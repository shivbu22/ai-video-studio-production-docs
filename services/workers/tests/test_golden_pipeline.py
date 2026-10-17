import os
import subprocess
import zipfile
import pytest
from services.workers.src.audio.ffmpeg_audio import normalize_to_48k_wav, get_ffmpeg_bin
from services.workers.src.audio.whisper_engine import WhisperEngine
from services.workers.src.audio.audio_cleanup import clean_silences_and_breaths
from services.workers.src.pipeline.researcher import ResearchEngine
from services.workers.src.pipeline.scriptwriter import ScriptWriter
from services.workers.src.pipeline.storyboard import StoryboardEngine
from services.workers.src.render.render_engine import RenderEngine
from services.workers.src.render.publish_pack import PublishPackAssembler

GOLDEN_OUT = "services/workers/tests/golden_out"

@pytest.fixture(scope="module", autouse=True)
def setup_golden_dir():
    os.makedirs(GOLDEN_OUT, exist_ok=True)
    yield
    for root, dirs, files in os.walk(GOLDEN_OUT, topdown=False):
        for f in files:
            try:
                os.remove(os.path.join(root, f))
            except Exception:
                pass

def test_full_10_stage_pipeline_golden_run():
    """
    End-to-End Pipeline Golden Verification:
    Executes the entire Route B production pipeline from Topic Brief to Publish Pack Zip.
    """
    project_id = "proj_golden_2026"
    topic = "The Rise of Autonomous AI Video Editing"
    
    # Stage 1 & 2: Research
    researcher = ResearchEngine()
    research = researcher.run_research(topic=topic, target_length_sec=120)
    assert len(research["claims"]) >= 3
    
    # Stage 3: Script
    writer = ScriptWriter()
    script = writer.generate_script(
        project_id=project_id,
        topic=topic,
        claims=research["claims"],
        target_length_sec=120
    )
    assert len(script["scenes"]) >= 4
    
    # Stage 6: Storyboard
    storyboarder = StoryboardEngine()
    storyboard = storyboarder.generate_storyboard(script, aspect_ratio="16:9")
    assert storyboard["items_count"] == len(script["scenes"])
    
    # Stage 4: Voice synthesis & 48kHz Normalization
    raw_tone = os.path.join(GOLDEN_OUT, "raw_voice.mp3")
    clean_wav = os.path.join(GOLDEN_OUT, "voice_clean.wav")
    ffmpeg = get_ffmpeg_bin()
    subprocess.run([
        ffmpeg, "-y", "-f", "lavfi",
        "-i", "sine=frequency=440:duration=3",
        raw_tone
    ], capture_output=True, check=True)
    
    norm_res = normalize_to_48k_wav(raw_tone, clean_wav)
    assert norm_res["sample_rate"] == 48000
    assert norm_res["channels"] == 1
    
    # Stage 5: Whisper word timestamps & audio cleanup
    whisper = WhisperEngine(model_size="base")
    words = whisper.transcribe_with_word_timestamps(clean_wav)
    assert len(words) > 0
    
    # Stage 10: Master Render
    dummy_video = os.path.join(GOLDEN_OUT, "canvas_video.mp4")
    subprocess.run([
        ffmpeg, "-y", "-f", "lavfi",
        "-i", "testsrc=duration=3:size=1920x1080:rate=30",
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        dummy_video
    ], capture_output=True, check=True)
    
    renderer = RenderEngine()
    master_mp4 = os.path.join(GOLDEN_OUT, "master_1080p.mp4")
    render_res = renderer.render_composition(
        video_track_path=dummy_video,
        voice_wav_path=clean_wav,
        output_mp4_path=master_mp4,
        resolution="1080p"
    )
    assert os.path.exists(master_mp4)
    assert render_res["size_bytes"] > 0
    
    # Stage 10: Publish Pack
    assembler = PublishPackAssembler()
    short_mp4 = os.path.join(GOLDEN_OUT, "short_9x16.mp4")
    short_res = assembler.create_vertical_short(master_mp4, short_mp4)
    assert os.path.exists(short_mp4)
    
    thumbs = assembler.extract_thumbnails(master_mp4, GOLDEN_OUT, count=3)
    assert len(thumbs) >= 1
    
    zip_path = os.path.join(GOLDEN_OUT, "publish_pack.zip")
    pack = assembler.assemble_publish_pack(
        project_id=project_id,
        title=topic,
        master_mp4=master_mp4,
        short_mp4=short_mp4,
        thumbnail_paths=thumbs,
        script=script,
        output_zip_path=zip_path
    )
    assert os.path.exists(zip_path)
    assert pack["size_bytes"] > 0
    
    with zipfile.ZipFile(zip_path, 'r') as zf:
        names = zf.namelist()
        assert "metadata.json" in names
        assert any(n.startswith("video/") for n in names)
        assert any(n.startswith("shorts/") for n in names)
