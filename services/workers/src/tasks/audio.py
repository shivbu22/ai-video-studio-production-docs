import os
from ..celery_app import celery_app
from ..audio.ffmpeg_audio import normalize_to_48k_wav
from ..audio.whisper_engine import WhisperEngine
from ..audio.audio_cleanup import clean_silences_and_breaths

@celery_app.task(name="services.workers.src.tasks.audio.align_and_clean", bind=True)
def align_and_clean(self, project_id: str, raw_audio_path: str, output_dir: str = "spike/out"):
    """
    Full Stage 5 Celery pipeline:
    1. Normalize audio to 48 kHz 24-bit mono WAV.
    2. Extract word-level timestamps with faster-whisper.
    3. Detect silences > 800ms and trim to 250ms with micro cross-fades -> voice_clean.wav.
    4. Emit clean word timestamps synchronized with voice_clean.wav.
    """
    if self.request.id:
        self.update_state(state="PROGRESS", meta={"progress": 20, "stage": "normalizing_48k"})
    
    os.makedirs(output_dir, exist_ok=True)
    norm_wav = os.path.join(output_dir, f"{project_id}_norm_48k.wav")
    clean_wav = os.path.join(output_dir, f"{project_id}_voice_clean.wav")
    
    # 1. Normalize
    norm_result = normalize_to_48k_wav(raw_audio_path, norm_wav)
    
    # 2. Whisper transcription
    if self.request.id:
        self.update_state(state="PROGRESS", meta={"progress": 55, "stage": "whisper_alignment"})
    engine = WhisperEngine(model_size="base")
    raw_words = engine.transcribe_with_word_timestamps(norm_wav)
    
    # 3. Clean silences
    if self.request.id:
        self.update_state(state="PROGRESS", meta={"progress": 85, "stage": "silence_reduction"})
    cleanup_result = clean_silences_and_breaths(
        input_wav=norm_wav,
        output_wav=clean_wav,
        words=raw_words,
        min_silence_sec=0.8,
        target_pause_ms=250
    )
    
    return {
        "project_id": project_id,
        "clean_audio_path": clean_wav,
        "sample_rate": 48000,
        "original_duration_ms": cleanup_result["original_duration_ms"],
        "clean_duration_ms": cleanup_result["clean_duration_ms"],
        "silences_cut": cleanup_result["silences_cut"],
        "words_count": len(cleanup_result["words"]),
        "words": cleanup_result["words"],
        "sha256": cleanup_result["sha256"],
        "status": "completed"
    }
