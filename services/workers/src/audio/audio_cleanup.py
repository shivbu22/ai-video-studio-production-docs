import os
import re
import subprocess
from typing import List, Dict, Any, Tuple
from .ffmpeg_audio import get_ffmpeg_bin, get_audio_metadata, calculate_sha256

def detect_silences(
    wav_path: str,
    noise_threshold_db: float = -30.0,
    min_silence_sec: float = 0.8
) -> List[Dict[str, Any]]:
    """
    Detect non-speech intervals exceeding min_silence_sec using ffmpeg silencedetect.
    Returns list of dicts: [{'start_ms': 2500, 'end_ms': 3800, 'duration_ms': 1300}]
    """
    if not os.path.isfile(wav_path):
        raise FileNotFoundError(f"Audio file not found: {wav_path}")
    
    ffmpeg = get_ffmpeg_bin()
    cmd = [
        ffmpeg,
        "-i", wav_path,
        "-af", f"silencedetect=noise={noise_threshold_db}dB:d={min_silence_sec}",
        "-f", "null",
        "-"
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    
    silences = []
    current_start = None
    
    for line in res.stderr.splitlines():
        if "silence_start:" in line:
            m = re.search(r"silence_start:\s*([0-9.]+)", line)
            if m:
                current_start = float(m.group(1))
        elif "silence_end:" in line and current_start is not None:
            m = re.search(r"silence_end:\s*([0-9.]+)", line)
            if m:
                end_sec = float(m.group(1))
                duration_sec = end_sec - current_start
                silences.append({
                    "start_ms": int(current_start * 1000),
                    "end_ms": int(end_sec * 1000),
                    "duration_ms": int(duration_sec * 1000)
                })
                current_start = None
                
    return silences

def clean_silences_and_breaths(
    input_wav: str,
    output_wav: str,
    words: List[Dict[str, Any]],
    noise_threshold_db: float = -30.0,
    min_silence_sec: float = 0.8,
    target_pause_ms: int = 250
) -> Dict[str, Any]:
    """
    Trim silence intervals exceeding min_silence_sec down to target_pause_ms (250ms).
    Re-aligns word timestamps so transcript stays 100% synchronized with voice_clean.wav.
    """
    if not os.path.isfile(input_wav):
        raise FileNotFoundError(f"Audio file not found: {input_wav}")
    
    meta = get_audio_metadata(input_wav)
    original_duration_ms = meta["duration_ms"]
    
    silences = detect_silences(input_wav, noise_threshold_db, min_silence_sec)
    
    # If no long silences detected, copy or soft normalize
    if not silences:
        ffmpeg = get_ffmpeg_bin()
        cmd = [ffmpeg, "-y", "-i", input_wav, "-c:a", "copy", output_wav]
        subprocess.run(cmd, capture_output=True, check=True)
        return {
            "output_path": output_wav,
            "original_duration_ms": original_duration_ms,
            "clean_duration_ms": original_duration_ms,
            "silences_cut": 0,
            "words": words,
            "sha256": calculate_sha256(output_wav)
        }
    
    # Construct ffmpeg select/concat or atrim filter chain
    # For robust cross-platform cutting, cut each keep interval:
    keep_intervals: List[Tuple[int, int]] = []
    cursor = 0
    cuts_count = 0
    time_offset_map: List[Tuple[int, int]] = [] # (original_ms, cut_ms_cumulative)
    cumulative_cut = 0

    for s in silences:
        # Keep speech up to silence start + 50ms padding
        speech_end = s["start_ms"]
        if speech_end > cursor:
            keep_intervals.append((cursor, speech_end))
        
        # Calculate how much silence to trim
        silence_dur = s["duration_ms"]
        if silence_dur > target_pause_ms:
            amount_to_cut = silence_dur - target_pause_ms
            cumulative_cut += amount_to_cut
            cuts_count += 1
            # Keep a short target_pause_ms chunk
            keep_intervals.append((s["start_ms"], s["start_ms"] + target_pause_ms))
        else:
            keep_intervals.append((s["start_ms"], s["end_ms"]))
            
        time_offset_map.append((s["end_ms"], cumulative_cut))
        cursor = s["end_ms"]
        
    if cursor < original_duration_ms:
        keep_intervals.append((cursor, original_duration_ms))
        
    # Build filter_complex with atrim and concat
    filter_parts = []
    concat_inputs = []
    for i, (start_ms, end_ms) in enumerate(keep_intervals):
        start_sec = start_ms / 1000.0
        end_sec = end_ms / 1000.0
        filter_parts.append(f"[0:a]atrim=start={start_sec:.3f}:end={end_sec:.3f},asetpts=PTS-STARTPTS[a{i}]")
        concat_inputs.append(f"[a{i}]")
        
    filter_complex = f"{';'.join(filter_parts)};{''.join(concat_inputs)}concat=n={len(keep_intervals)}:v=0:a=1[out]"
    
    ffmpeg = get_ffmpeg_bin()
    cmd = [
        ffmpeg,
        "-y",
        "-i", input_wav,
        "-filter_complex", filter_complex,
        "-map", "[out]",
        "-ar", "48000",
        "-ac", "1",
        "-c:a", "pcm_s24le",
        output_wav
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        # Fallback to direct copy if atrim has syntax limitation
        cmd_copy = [ffmpeg, "-y", "-i", input_wav, "-c:a", "copy", output_wav]
        subprocess.run(cmd_copy, capture_output=True, check=True)
        return {
            "output_path": output_wav,
            "original_duration_ms": original_duration_ms,
            "clean_duration_ms": original_duration_ms,
            "silences_cut": 0,
            "words": words,
            "sha256": calculate_sha256(output_wav)
        }
        
    clean_meta = get_audio_metadata(output_wav)
    
    # Adjust word timestamps by cumulative cuts
    adjusted_words = []
    for w in words:
        w_start = w["start_ms"]
        w_end = w["end_ms"]
        # Find applicable cut offset
        offset = 0
        for silence_end, cut_amount in time_offset_map:
            if w_start >= silence_end:
                offset = cut_amount
        adjusted_words.append({
            "word": w["word"],
            "start_ms": max(0, w_start - offset),
            "end_ms": max(0, w_end - offset),
            "confidence": w.get("confidence", 0.9)
        })
        
    return {
        "output_path": output_wav,
        "original_duration_ms": original_duration_ms,
        "clean_duration_ms": clean_meta["duration_ms"],
        "silences_cut": cuts_count,
        "words": adjusted_words,
        "sha256": calculate_sha256(output_wav)
    }
