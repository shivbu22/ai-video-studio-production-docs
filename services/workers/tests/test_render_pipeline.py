import os
import subprocess
import zipfile
import pytest
from services.workers.src.audio.ffmpeg_audio import get_ffmpeg_bin
from services.workers.src.render.render_engine import RenderEngine
from services.workers.src.render.publish_pack import PublishPackAssembler
from services.workers.src.tasks.render import render_video, create_publish_pack_task

TEST_DIR = "services/workers/tests/tmp_render"

@pytest.fixture(scope="module", autouse=True)
def setup_teardown():
    os.makedirs(TEST_DIR, exist_ok=True)
    yield
    for root, dirs, files in os.walk(TEST_DIR, topdown=False):
        for f in files:
            try:
                os.remove(os.path.join(root, f))
            except Exception:
                pass

def create_synthetic_video(path: str, duration_sec: int = 2):
    ffmpeg = get_ffmpeg_bin()
    cmd = [
        ffmpeg, "-y",
        "-f", "lavfi", "-i", f"testsrc=duration={duration_sec}:size=1920x1080:rate=30",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        path
    ]
    subprocess.run(cmd, capture_output=True, check=True)

def create_synthetic_audio(path: str, duration_sec: int = 2, freq: int = 440):
    ffmpeg = get_ffmpeg_bin()
    cmd = [
        ffmpeg, "-y",
        "-f", "lavfi", "-i", f"sine=frequency={freq}:duration={duration_sec}",
        "-ar", "48000",
        "-ac", "1",
        "-c:a", "pcm_s24le",
        path
    ]
    subprocess.run(cmd, capture_output=True, check=True)

def test_render_composition_540p_and_1080p():
    video_src = os.path.join(TEST_DIR, "source_video.mp4")
    voice_src = os.path.join(TEST_DIR, "source_voice.wav")
    create_synthetic_video(video_src, duration_sec=2)
    create_synthetic_audio(voice_src, duration_sec=2)
    
    engine = RenderEngine()
    
    # 540p fast preview
    out_540p = os.path.join(TEST_DIR, "preview_540p.mp4")
    res_540p = engine.render_composition(video_src, voice_src, out_540p, resolution="540p")
    assert os.path.exists(out_540p)
    assert res_540p["resolution"] == "540p"
    assert res_540p["size_bytes"] > 0
    
    # 1080p master
    out_1080p = os.path.join(TEST_DIR, "master_1080p.mp4")
    res_1080p = engine.render_composition(video_src, voice_src, out_1080p, resolution="1080p")
    assert os.path.exists(out_1080p)
    assert res_1080p["resolution"] == "1080p"
    assert res_1080p["size_bytes"] > 0

def test_audio_ducking_with_music():
    video_src = os.path.join(TEST_DIR, "source_video.mp4")
    voice_src = os.path.join(TEST_DIR, "source_voice.wav")
    music_src = os.path.join(TEST_DIR, "source_music.wav")
    create_synthetic_audio(music_src, duration_sec=2, freq=220)
    
    engine = RenderEngine()
    out_ducked = os.path.join(TEST_DIR, "ducked_master.mp4")
    res = engine.render_composition(
        video_src, voice_src, out_ducked,
        bg_music_path=music_src,
        resolution="1080p"
    )
    assert os.path.exists(out_ducked)
    assert res["size_bytes"] > 0

def test_vertical_short_crop():
    master_src = os.path.join(TEST_DIR, "master_1080p.mp4")
    short_out = os.path.join(TEST_DIR, "short_9x16.mp4")
    
    assembler = PublishPackAssembler()
    res = assembler.create_vertical_short(master_src, short_out, max_duration_sec=60)
    assert os.path.exists(short_out)
    assert res["aspect_ratio"] == "9:16"
    assert res["size_bytes"] > 0

def test_publish_pack_zip_packaging():
    master_src = os.path.join(TEST_DIR, "master_1080p.mp4")
    short_src = os.path.join(TEST_DIR, "short_9x16.mp4")
    thumbs_dir = os.path.join(TEST_DIR, "thumbs")
    zip_out = os.path.join(TEST_DIR, "test_publish_pack.zip")
    
    assembler = PublishPackAssembler()
    thumbs = assembler.extract_thumbnails(master_src, thumbs_dir, count=3)
    assert len(thumbs) >= 1
    
    script_mock = {
        "scenes": [
            {"order": 1, "hook": "Hook test", "narration": "Narration test"}
        ]
    }
    
    pack = assembler.assemble_publish_pack(
        project_id="proj_test_pack",
        title="AI Video Studio Production Test",
        master_mp4=master_src,
        short_mp4=short_src,
        thumbnail_paths=thumbs,
        script=script_mock,
        output_zip_path=zip_out
    )
    
    assert os.path.exists(zip_out)
    assert pack["size_bytes"] > 0
    
    # Verify zip contents
    with zipfile.ZipFile(zip_out, 'r') as zf:
        namelist = zf.namelist()
        assert "metadata.json" in namelist
        assert any(n.startswith("video/") for n in namelist)
        assert any(n.startswith("shorts/") for n in namelist)
