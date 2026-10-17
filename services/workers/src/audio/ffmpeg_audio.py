import os
import shutil
import subprocess
import json
import hashlib
from typing import Dict, Any, Optional

def get_ffmpeg_bin() -> str:
    path = os.getenv("FFMPEG_PATH")
    if path and os.path.isfile(path):
        return path
    which = shutil.which("ffmpeg")
    if which:
        return which
    # Default Windows WinGet installation path
    winget_default = r"C:\Users\ahiva\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe"
    if os.path.isfile(winget_default):
        return winget_default
    return "ffmpeg"

def get_ffprobe_bin() -> str:
    path = os.getenv("FFPROBE_PATH")
    if path and os.path.isfile(path):
        return path
    which = shutil.which("ffprobe")
    if which:
        return which
    winget_default = r"C:\Users\ahiva\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffprobe.exe"
    if os.path.isfile(winget_default):
        return winget_default
    return "ffprobe"

def calculate_sha256(filepath: str) -> str:
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def get_audio_metadata(input_path: str) -> Dict[str, Any]:
    """Inspect audio file using ffprobe and return duration, sample rate, and format info."""
    if not os.path.isfile(input_path):
        raise FileNotFoundError(f"Audio file not found: {input_path}")
    
    ffprobe = get_ffprobe_bin()
    cmd = [
        ffprobe,
        "-v", "quiet",
        "-print_format", "json",
        "-show_format",
        "-show_streams",
        input_path
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"ffprobe failed to inspect {input_path}: {res.stderr}")
    
    data = json.loads(res.stdout)
    format_info = data.get("format", {})
    audio_streams = [s for s in data.get("streams", []) if s.get("codec_type") == "audio"]
    
    stream = audio_streams[0] if audio_streams else {}
    duration_sec = float(format_info.get("duration", stream.get("duration", 0.0)))
    
    return {
        "duration_sec": duration_sec,
        "duration_ms": int(duration_sec * 1000),
        "sample_rate": int(stream.get("sample_rate", 0)),
        "channels": int(stream.get("channels", 0)),
        "codec_name": stream.get("codec_name", "unknown"),
        "size_bytes": int(format_info.get("size", os.path.getsize(input_path))),
        "bit_rate": int(format_info.get("bit_rate", stream.get("bit_rate", 0)))
    }

def normalize_to_48k_wav(input_path: str, output_path: str, highpass_hz: int = 80) -> Dict[str, Any]:
    """
    Resample and normalize any audio file to 48 kHz 24-bit PCM mono WAV.
    Applies an 80Hz highpass filter to eliminate sub-bass microphone rumble.
    """
    if not os.path.isfile(input_path):
        raise FileNotFoundError(f"Input audio file not found: {input_path}")
    
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    ffmpeg = get_ffmpeg_bin()
    
    # Audio filter: 80Hz high-pass filter + peak volume normalization
    af_filter = f"highpass=f={highpass_hz},loudnorm=I=-16:TP=-1.0:LRA=11"
    
    cmd = [
        ffmpeg,
        "-y",
        "-i", input_path,
        "-af", af_filter,
        "-ar", "48000",
        "-ac", "1",
        "-c:a", "pcm_s24le",
        output_path
    ]
    
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        # Fallback without loudnorm if loudnorm dual-pass fails on short audio
        cmd_fallback = [
            ffmpeg,
            "-y",
            "-i", input_path,
            "-af", f"highpass=f={highpass_hz}",
            "-ar", "48000",
            "-ac", "1",
            "-c:a", "pcm_s24le",
            output_path
        ]
        res_fb = subprocess.run(cmd_fallback, capture_output=True, text=True)
        if res_fb.returncode != 0:
            raise RuntimeError(f"FFmpeg audio normalization failed: {res.stderr}\n{res_fb.stderr}")
    
    meta = get_audio_metadata(output_path)
    checksum = calculate_sha256(output_path)
    
    return {
        "output_path": output_path,
        "sample_rate": 48000,
        "channels": 1,
        "format": "pcm_s24le",
        "duration_sec": meta["duration_sec"],
        "duration_ms": meta["duration_ms"],
        "size_bytes": meta["size_bytes"],
        "sha256": checksum
    }
