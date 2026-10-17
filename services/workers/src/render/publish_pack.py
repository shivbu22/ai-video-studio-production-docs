import os
import subprocess
import zipfile
import json
from typing import List, Dict, Any
from ..audio.ffmpeg_audio import get_ffmpeg_bin, get_audio_metadata, calculate_sha256

class PublishPackAssembler:
    """
    Stage 10 Publish Pack Generator:
    - Crops horizontal 1080p video into vertical 9:16 Shorts/Reels/TikTok format.
    - Generates 3 high-contrast PNG thumbnails from key timeline frames.
    - Packages complete publish archive with metadata.json into .zip.
    """
    def __init__(self):
        self.ffmpeg = get_ffmpeg_bin()

    def create_vertical_short(
        self,
        master_mp4_path: str,
        output_short_path: str,
        max_duration_sec: int = 60
    ) -> Dict[str, Any]:
        """Crop 16:9 master video into vertical 9:16 (1080x1920) format."""
        if not os.path.isfile(master_mp4_path):
            raise FileNotFoundError(f"Master MP4 not found: {master_mp4_path}")
        
        os.makedirs(os.path.dirname(os.path.abspath(output_short_path)), exist_ok=True)

        cmd = [
            self.ffmpeg, "-y",
            "-i", master_mp4_path,
            "-vf", "crop=ih*9/16:ih,scale=1080:1920",
            "-t", str(max_duration_sec),
            "-c:v", "libx264",
            "-c:a", "copy",
            output_short_path
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode != 0:
            raise RuntimeError(f"FFmpeg vertical short crop failed: {res.stderr}")

        meta = get_audio_metadata(output_short_path)
        return {
            "output_path": output_short_path,
            "aspect_ratio": "9:16",
            "duration_sec": meta["duration_sec"],
            "size_bytes": os.path.getsize(output_short_path),
            "sha256": calculate_sha256(output_short_path)
        }

    def extract_thumbnails(
        self,
        master_mp4_path: str,
        output_dir: str,
        count: int = 3
    ) -> List[str]:
        """Extract keyframe PNG thumbnails across timeline."""
        if not os.path.isfile(master_mp4_path):
            raise FileNotFoundError(f"Master MP4 not found: {master_mp4_path}")
        
        os.makedirs(output_dir, exist_ok=True)
        meta = get_audio_metadata(master_mp4_path)
        total_sec = max(1.0, meta["duration_sec"])

        thumbnail_paths = []
        # Sample at 15%, 50%, 85%
        time_fractions = [0.15, 0.50, 0.85][:count]

        for i, frac in enumerate(time_fractions, start=1):
            seek_time = max(0.1, total_sec * frac)
            thumb_path = os.path.join(output_dir, f"thumbnail_{i}.png")
            cmd = [
                self.ffmpeg, "-y",
                "-ss", f"{seek_time:.2f}",
                "-i", master_mp4_path,
                "-vframes", "1",
                "-q:v", "2",
                thumb_path
            ]
            res = subprocess.run(cmd, capture_output=True, text=True)
            if res.returncode == 0 and os.path.isfile(thumb_path):
                thumbnail_paths.append(thumb_path)

        return thumbnail_paths

    def assemble_publish_pack(
        self,
        project_id: str,
        title: str,
        master_mp4: str,
        short_mp4: str,
        thumbnail_paths: List[str],
        script: Dict[str, Any],
        output_zip_path: str
    ) -> Dict[str, Any]:
        """Assemble full publish zip archive with metadata."""
        os.makedirs(os.path.dirname(os.path.abspath(output_zip_path)), exist_ok=True)

        metadata = {
            "project_id": project_id,
            "title": title,
            "description": f"{title}\n\nProduced with AI Video Studio (Route B clean-room architecture).",
            "tags": ["AI Video", "Remotion", "Autonomous Studio", "Future of Video"],
            "scenes": script.get("scenes", []),
            "generated_files": {
                "master_1080p": os.path.basename(master_mp4),
                "vertical_short_9x16": os.path.basename(short_mp4),
                "thumbnails": [os.path.basename(t) for t in thumbnail_paths]
            }
        }

        with zipfile.ZipFile(output_zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
            if os.path.isfile(master_mp4):
                zf.write(master_mp4, arcname=f"video/{os.path.basename(master_mp4)}")
            if os.path.isfile(short_mp4):
                zf.write(short_mp4, arcname=f"shorts/{os.path.basename(short_mp4)}")
            for t in thumbnail_paths:
                if os.path.isfile(t):
                    zf.write(t, arcname=f"thumbnails/{os.path.basename(t)}")
            zf.writestr("metadata.json", json.dumps(metadata, indent=2))

        return {
            "project_id": project_id,
            "publish_pack_path": output_zip_path,
            "size_bytes": os.path.getsize(output_zip_path),
            "sha256": calculate_sha256(output_zip_path),
            "files_included": [
                os.path.basename(master_mp4),
                os.path.basename(short_mp4),
                *[os.path.basename(t) for t in thumbnail_paths],
                "metadata.json"
            ]
        }
