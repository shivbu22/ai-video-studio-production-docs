import os
from ..celery_app import celery_app
from ..render.render_engine import RenderEngine
from ..render.publish_pack import PublishPackAssembler

@celery_app.task(name="services.workers.src.tasks.render.render_video", bind=True)
def render_video(
    self,
    project_id: str,
    quality_tier: str = "1080p",
    video_track_path: str = "spike/out/master_1080p.mp4",
    voice_wav_path: str = "spike/out/voice_clean.wav",
    bg_music_path: str = None,
    output_dir: str = "spike/out"
):
    """
    Execute Remotion / FFmpeg master render (540p fast preview or 1080p master)
    with automatic audio ducking and -14 LUFS broadcast loudness.
    """
    if self.request.id:
        self.update_state(state="PROGRESS", meta={"progress": 40, "stage": "rendering_video"})
    
    os.makedirs(output_dir, exist_ok=True)
    filename = "preview_540p.mp4" if quality_tier == "540p" else "master_1080p.mp4"
    output_mp4 = os.path.join(output_dir, f"{project_id}_{filename}")
    
    engine = RenderEngine()
    result = engine.render_composition(
        video_track_path=video_track_path,
        voice_wav_path=voice_wav_path,
        output_mp4_path=output_mp4,
        bg_music_path=bg_music_path,
        resolution=quality_tier
    )
    
    return {
        "project_id": project_id,
        "quality_tier": quality_tier,
        "output_path": result["output_path"],
        "duration_sec": result["duration_sec"],
        "size_bytes": result["size_bytes"],
        "sha256": result["sha256"],
        "status": "completed"
    }

@celery_app.task(name="services.workers.src.tasks.render.create_publish_pack_task", bind=True)
def create_publish_pack_task(
    self,
    project_id: str,
    title: str,
    master_mp4: str,
    script: dict,
    output_dir: str = "spike/out"
):
    """
    Execute Stage 10 Publish Pack generation:
    1. Crop vertical 9:16 Shorts.
    2. Extract keyframe thumbnails.
    3. Zip publish pack archive.
    """
    if self.request.id:
        self.update_state(state="PROGRESS", meta={"progress": 65, "stage": "generating_shorts"})
    
    os.makedirs(output_dir, exist_ok=True)
    short_mp4 = os.path.join(output_dir, f"{project_id}_short_9x16.mp4")
    zip_path = os.path.join(output_dir, f"{project_id}_publish_pack.zip")
    thumbs_dir = os.path.join(output_dir, f"{project_id}_thumbs")
    
    assembler = PublishPackAssembler()
    short_result = assembler.create_vertical_short(master_mp4, short_mp4)
    
    if self.request.id:
        self.update_state(state="PROGRESS", meta={"progress": 85, "stage": "extracting_thumbnails"})
    thumbnails = assembler.extract_thumbnails(master_mp4, thumbs_dir, count=3)
    
    pack_result = assembler.assemble_publish_pack(
        project_id=project_id,
        title=title,
        master_mp4=master_mp4,
        short_mp4=short_mp4,
        thumbnail_paths=thumbnails,
        script=script,
        output_zip_path=zip_path
    )
    
    return {
        "project_id": project_id,
        "publish_pack_path": pack_result["publish_pack_path"],
        "size_bytes": pack_result["size_bytes"],
        "sha256": pack_result["sha256"],
        "files_included": pack_result["files_included"],
        "status": "completed"
    }
