from ..celery_app import celery_app
from ..pipeline.researcher import ResearchEngine
from ..pipeline.scriptwriter import ScriptWriter
from ..pipeline.storyboard import StoryboardEngine

@celery_app.task(name="services.workers.src.tasks.research.run_research", bind=True)
def run_research(self, project_id: str, topic: str, target_length_sec: int = 180):
    """Execute AI topic research and source-cited claims extraction."""
    if self.request.id:
        self.update_state(state="PROGRESS", meta={"progress": 30, "stage": "searching_claims"})
    
    engine = ResearchEngine()
    result = engine.run_research(topic=topic, target_length_sec=target_length_sec)
    return {
        "project_id": project_id,
        "topic": topic,
        "claims_count": result["claims_count"],
        "claims": result["claims"],
        "generated_at": result["generated_at"],
        "status": "completed"
    }

@celery_app.task(name="services.workers.src.tasks.research.generate_script_task", bind=True)
def generate_script_task(self, project_id: str, topic: str, claims: list, target_length_sec: int = 180):
    """Generate structured Hook/Narrative/CTA scene sequence with Remotion templates."""
    if self.request.id:
        self.update_state(state="PROGRESS", meta={"progress": 60, "stage": "authoring_scenes"})
    
    writer = ScriptWriter()
    script = writer.generate_script(
        project_id=project_id,
        topic=topic,
        claims=claims,
        target_length_sec=target_length_sec
    )
    return {
        "project_id": project_id,
        "script_id": script["id"],
        "scenes_count": script["scenes_count"],
        "total_duration_sec": script["total_duration_sec"],
        "scenes": script["scenes"],
        "status": "completed"
    }

@celery_app.task(name="services.workers.src.tasks.research.build_storyboard_task", bind=True)
def build_storyboard_task(self, project_id: str, script: dict, aspect_ratio: str = "16:9"):
    """Match scenes to stock footage queries and motion graphic templates."""
    if self.request.id:
        self.update_state(state="PROGRESS", meta={"progress": 85, "stage": "storyboarding_assets"})
    
    sb_engine = StoryboardEngine()
    storyboard = sb_engine.generate_storyboard(script=script, aspect_ratio=aspect_ratio)
    return {
        "project_id": project_id,
        "storyboard_id": storyboard["storyboard_id"],
        "items_count": storyboard["items_count"],
        "total_duration_ms": storyboard["total_duration_ms"],
        "items": storyboard["items"],
        "status": "completed"
    }
