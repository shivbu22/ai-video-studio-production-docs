import pytest
from services.workers.src.pipeline.researcher import ResearchEngine
from services.workers.src.pipeline.scriptwriter import ScriptWriter
from services.workers.src.pipeline.storyboard import StoryboardEngine
from services.workers.src.tasks.research import run_research, generate_script_task, build_storyboard_task

def test_research_engine_extraction():
    engine = ResearchEngine()
    result = engine.run_research("AI Video Synthesis in 2026", target_length_sec=120)
    
    assert result["topic"] == "AI Video Synthesis in 2026"
    assert result["claims_count"] >= 3
    for claim in result["claims"]:
        assert "claim" in claim
        assert "source_url" in claim
        assert claim["source_url"].startswith("http")
        assert claim["confidence"] >= 0.9

def test_script_writer_structure():
    engine = ResearchEngine()
    research = engine.run_research("AI Video Synthesis in 2026", target_length_sec=180)
    
    writer = ScriptWriter()
    script = writer.generate_script(
        project_id="proj_test_script_1",
        topic="AI Video Synthesis in 2026",
        claims=research["claims"],
        target_length_sec=180
    )
    
    assert script["project_id"] == "proj_test_script_1"
    assert script["scenes_count"] >= 4
    
    # Verify Hook scene
    hook_scene = script["scenes"][0]
    assert hook_scene["order"] == 1
    assert hook_scene["template"] in ["QuoteCard", "StatCounter"]
    assert "quote" in hook_scene["props"] or "number" in hook_scene["props"]
    
    # Verify BarChart scene
    bar_scenes = [s for s in script["scenes"] if s["template"] == "BarChart"]
    assert len(bar_scenes) >= 1
    assert "items" in bar_scenes[0]["props"]
    
    # Verify Comparison scene
    comp_scenes = [s for s in script["scenes"] if s["template"] == "Comparison"]
    assert len(comp_scenes) >= 1
    assert "sideA" in comp_scenes[0]["props"]
    assert "sideB" in comp_scenes[0]["props"]
    
    # Verify Outro scene
    outro_scene = script["scenes"][-1]
    assert outro_scene["order"] == len(script["scenes"])

def test_storyboard_engine_layout():
    writer = ScriptWriter()
    claims = [
        {"claim": "Neural rendering speedup", "source_url": "https://example.com/speedup"},
        {"claim": "Cost dropped 4x", "source_url": "https://example.com/cost"}
    ]
    script = writer.generate_script("proj_sb_test", "Motion Graphics", claims, 120)
    
    sb_engine = StoryboardEngine()
    storyboard = sb_engine.generate_storyboard(script, aspect_ratio="16:9")
    
    assert storyboard["project_id"] == "proj_sb_test"
    assert storyboard["items_count"] == len(script["scenes"])
    assert storyboard["total_duration_ms"] > 0
    
    # Verify contiguous timestamps without gaps
    current_ms = 0
    for item in storyboard["items"]:
        assert item["start_ms"] == current_ms
        assert item["end_ms"] > item["start_ms"]
        current_ms = item["end_ms"]
    assert current_ms == storyboard["total_duration_ms"]

def test_celery_pipeline_tasks():
    # Direct task execution test
    res_research = run_research("proj_celery_1", "Autonomous Video Pipelines", 150)
    assert res_research["status"] == "completed"
    assert res_research["claims_count"] >= 3
    
    res_script = generate_script_task("proj_celery_1", "Autonomous Video Pipelines", res_research["claims"], 150)
    assert res_script["status"] == "completed"
    assert res_script["scenes_count"] >= 4
    
    res_sb = build_storyboard_task("proj_celery_1", res_script)
    assert res_sb["status"] == "completed"
    assert res_sb["items_count"] == res_script["scenes_count"]
