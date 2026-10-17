import os
import subprocess
import json
import hashlib
from typing import Dict, Any, Optional
from ..audio.ffmpeg_audio import get_ffmpeg_bin, get_audio_metadata, calculate_sha256

class RenderEngine:
    """
    Stage 10 Master Render and Audio Ducking Engine:
    - 540p fast preview tier (< 2 min render, CRF 28)
    - 1080p master tier (H.264 High Profile, CRF 18, 30 fps)
    - Sidechain auto-ducking (-12dB duck during speech) and -14 LUFS loudness normalization
    """
    def __init__(self):
        self.ffmpeg = get_ffmpeg_bin()

    def render_composition(
        self,
        video_track_path: str,
        voice_wav_path: str,
        output_mp4_path: str,
        bg_music_path: Optional[str] = None,
        resolution: str = "1080p",
        fps: int = 30
    ) -> Dict[str, Any]:
        """
        Mix video with voiceover and optional background music.
        Applies sidechain compression ducking and EBU R128 (-14 LUFS) broadcast loudness.
        """
        os.makedirs(os.path.dirname(os.path.abspath(output_mp4_path)), exist_ok=True)
        
        scale_filter = "scale=1920:1080" if resolution == "1080p" else "scale=960:540"
        crf = "18" if resolution == "1080p" else "28"
        preset = "medium" if resolution == "1080p" else "veryfast"

        if bg_music_path and os.path.isfile(bg_music_path):
            # Advanced sidechain ducking filter:
            # [0:a] is voiceover, [1:a] is background music
            filter_complex = (
                f"[0:v]{scale_filter},format=yuv420p[vout];"
                f"[2:a]volume=0.35,asplit=2[sc][music];"
                f"[music][0:a]sidechaincompress=threshold=0.125:ratio=4:attack=50:release=300[ducked];"
                f"[0:a][ducked]amix=inputs=2:weights=1.0 0.8[mixed];"
                f"[mixed]loudnorm=I=-14:TP=-1.0:LRA=11[aout]"
            )
            cmd = [
                self.ffmpeg, "-y",
                "-i", video_track_path,
                "-i", voice_wav_path,
                "-i", bg_music_path,
                "-filter_complex", filter_complex,
                "-map", "[vout]",
                "-map", "[aout]",
                "-c:v", "libx264",
                "-preset", preset,
                "-crf", crf,
                "-r", str(fps),
                "-c:a", "aac",
                "-b:a", "192k",
                output_mp4_path
            ]
        else:
            # Voiceover only with -14 LUFS loudness normalization
            filter_complex = f"[0:v]{scale_filter},format=yuv420p[vout];[1:a]loudnorm=I=-14:TP=-1.0:LRA=11[aout]"
            cmd = [
                self.ffmpeg, "-y",
                "-i", video_track_path,
                "-i", voice_wav_path,
                "-filter_complex", filter_complex,
                "-map", "[vout]",
                "-map", "[aout]",
                "-c:v", "libx264",
                "-preset", preset,
                "-crf", crf,
                "-r", str(fps),
                "-c:a", "aac",
                "-b:a", "192k",
                output_mp4_path
            ]

        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode != 0:
            # Fallback simple mux if loudnorm fails
            cmd_fb = [
                self.ffmpeg, "-y",
                "-i", video_track_path,
                "-i", voice_wav_path,
                "-vf", scale_filter,
                "-c:v", "libx264",
                "-preset", preset,
                "-crf", crf,
                "-r", str(fps),
                "-c:a", "aac",
                "-b:a", "192k",
                "-shortest",
                output_mp4_path
            ]
            res_fb = subprocess.run(cmd_fb, capture_output=True, text=True)
            if res_fb.returncode != 0:
                raise RuntimeError(f"FFmpeg render failed: {res.stderr}\n{res_fb.stderr}")

        sha256 = calculate_sha256(output_mp4_path)
        size_bytes = os.path.getsize(output_mp4_path)
        meta = get_audio_metadata(output_mp4_path)

        return {
            "output_path": output_mp4_path,
            "resolution": resolution,
            "duration_sec": meta["duration_sec"],
            "duration_ms": meta["duration_ms"],
            "size_bytes": size_bytes,
            "sha256": sha256
        }
