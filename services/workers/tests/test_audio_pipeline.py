import os
import subprocess
import pytest
from services.workers.src.audio.ffmpeg_audio import normalize_to_48k_wav, get_audio_metadata, get_ffmpeg_bin
from services.workers.src.audio.whisper_engine import WhisperEngine
from services.workers.src.audio.audio_cleanup import clean_silences_and_breaths, detect_silences

TEST_DIR = "services/workers/tests/tmp_audio"

@pytest.fixture(scope="module", autouse=True)
def setup_teardown():
    os.makedirs(TEST_DIR, exist_ok=True)
    yield
    # Cleanup tmp files
    for f in os.listdir(TEST_DIR):
        try:
            os.remove(os.path.join(TEST_DIR, f))
        except Exception:
            pass

def create_synthetic_audio(path: str, duration_sec: int = 3, freq: int = 440):
    ffmpeg = get_ffmpeg_bin()
    cmd = [
        ffmpeg, "-y",
        "-f", "lavfi",
        "-i", f"sine=frequency={freq}:duration={duration_sec}",
        "-ar", "22050",
        "-ac", "2",
        path
    ]
    subprocess.run(cmd, capture_output=True, check=True)

def create_audio_with_silence(path: str):
    """Generates 1s tone + 1.2s silence + 1s tone."""
    ffmpeg = get_ffmpeg_bin()
    cmd = [
        ffmpeg, "-y",
        "-f", "lavfi", "-i", "sine=frequency=440:duration=1",
        "-f", "lavfi", "-i", "anullsrc=duration=1.2",
        "-f", "lavfi", "-i", "sine=frequency=880:duration=1",
        "-filter_complex", "[0:a][1:a][2:a]concat=n=3:v=0:a=1[out]",
        "-map", "[out]",
        path
    ]
    subprocess.run(cmd, capture_output=True, check=True)

def test_normalize_to_48k_wav():
    raw_path = os.path.join(TEST_DIR, "raw_tone.mp3")
    clean_wav = os.path.join(TEST_DIR, "clean_48k.wav")
    create_synthetic_audio(raw_path, duration_sec=2)
    
    res = normalize_to_48k_wav(raw_path, clean_wav)
    assert res["sample_rate"] == 48000
    assert res["channels"] == 1
    assert res["format"] == "pcm_s24le"
    assert res["duration_ms"] > 1800
    assert len(res["sha256"]) == 64
    assert os.path.exists(clean_wav)

def test_whisper_engine_alignment():
    test_wav = os.path.join(TEST_DIR, "speech_sample.wav")
    create_synthetic_audio(test_wav, duration_sec=4)
    
    engine = WhisperEngine(model_size="base")
    words = engine.transcribe_with_word_timestamps(test_wav)
    
    assert isinstance(words, list)
    assert len(words) > 0
    first_word = words[0]
    assert "word" in first_word
    assert "start_ms" in first_word
    assert "end_ms" in first_word
    assert first_word["end_ms"] >= first_word["start_ms"]
    assert first_word["confidence"] > 0

def test_audio_cleanup_and_silence_reduction():
    silence_wav = os.path.join(TEST_DIR, "silence_test.wav")
    clean_out = os.path.join(TEST_DIR, "voice_clean.wav")
    create_audio_with_silence(silence_wav)
    
    test_words = [
        {"word": "Before", "start_ms": 200, "end_ms": 800, "confidence": 0.95},
        {"word": "After", "start_ms": 2400, "end_ms": 3100, "confidence": 0.92}
    ]
    
    result = clean_silences_and_breaths(
        input_wav=silence_wav,
        output_wav=clean_out,
        words=test_words,
        min_silence_sec=0.8,
        target_pause_ms=250
    )
    
    assert os.path.exists(clean_out)
    assert result["original_duration_ms"] > 3000
    # The silence was trimmed so clean duration is shorter
    assert result["clean_duration_ms"] < result["original_duration_ms"]
    assert len(result["words"]) == 2
    # Verify second word was shifted left
    assert result["words"][1]["start_ms"] < 2400
