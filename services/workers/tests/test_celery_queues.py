import pytest
from services.workers.src.celery_app import celery_app
from services.workers.src.tasks.research import run_research
from services.workers.src.tasks.audio import align_and_clean
from services.workers.src.tasks.render import render_video

def test_celery_queue_configuration():
    queues = [q.name for q in celery_app.conf.task_queues]
    assert "q.research" in queues
    assert "q.audio" in queues
    assert "q.assets" in queues
    assert "q.motion" in queues
    assert "q.render" in queues
    assert "q.publish" in queues
    assert "q.dead" in queues

def test_task_queue_routing():
    routes = celery_app.conf.task_routes
    assert routes["services.workers.src.tasks.research.*"]["queue"] == "q.research"
    assert routes["services.workers.src.tasks.audio.*"]["queue"] == "q.audio"
    assert routes["services.workers.src.tasks.render.*"]["queue"] == "q.render"

def test_task_direct_execution():
    res = run_research("proj_test_1", "Quantum Computing", 180)
    assert res["status"] == "completed"
    assert res["project_id"] == "proj_test_1"
