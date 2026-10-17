import uuid
import datetime
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

projects_router = APIRouter(prefix="/projects", tags=["Projects & Pipeline"])

class ProjectCreateRequest(BaseModel):
    title: str = Field(..., min_length=1)
    topic: str = Field(..., min_length=1)
    target_length_sec: int = Field(default=180, ge=30, le=1800)
    language: str = Field(default="en")
    preset: str = Field(default="educational_tech")

# In-memory mock backing for API responses
PROJECTS_DB: Dict[str, Dict[str, Any]] = {
    "proj_demo_1": {
        "id": "proj_demo_1",
        "title": "Autonomous Video Editing with Remotion",
        "topic": "The shift from manual Premiere timelines to code-driven Remotion pipelines in 2026",
        "target_length_sec": 180,
        "language": "en",
        "preset": "educational_tech",
        "status": "timeline",
        "current_stage": "timeline",
        "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "unmetered": True
    }
}

@projects_router.post("", status_code=status.HTTP_201_CREATED)
async def create_project(req: ProjectCreateRequest):
    pid = f"proj_{uuid.uuid4().hex[:8]}"
    project = {
        "id": pid,
        "title": req.title,
        "topic": req.topic,
        "target_length_sec": req.target_length_sec,
        "language": req.language,
        "preset": req.preset,
        "status": "draft",
        "current_stage": "intake",
        "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "unmetered": True
    }
    PROJECTS_DB[pid] = project
    return project

@projects_router.get("")
async def list_projects():
    return list(PROJECTS_DB.values())

@projects_router.get("/{project_id}")
async def get_project(project_id: str):
    if project_id not in PROJECTS_DB:
        raise HTTPException(status_code=404, detail="Project not found")
    return PROJECTS_DB[project_id]

@projects_router.post("/{project_id}/research/run")
async def trigger_research(project_id: str):
    if project_id not in PROJECTS_DB:
        raise HTTPException(status_code=404, detail="Project not found")
    PROJECTS_DB[project_id]["current_stage"] = "research"
    return {
        "job_id": f"job_res_{uuid.uuid4().hex[:8]}",
        "project_id": project_id,
        "stage": "research",
        "status": "queued"
    }

@projects_router.post("/{project_id}/script/run")
async def trigger_script(project_id: str):
    if project_id not in PROJECTS_DB:
        raise HTTPException(status_code=404, detail="Project not found")
    PROJECTS_DB[project_id]["current_stage"] = "script"
    return {
        "job_id": f"job_scr_{uuid.uuid4().hex[:8]}",
        "project_id": project_id,
        "stage": "script",
        "status": "queued"
    }

@projects_router.post("/{project_id}/cleanup/run")
async def trigger_cleanup(project_id: str):
    if project_id not in PROJECTS_DB:
        raise HTTPException(status_code=404, detail="Project not found")
    PROJECTS_DB[project_id]["current_stage"] = "cleanup"
    return {
        "job_id": f"job_cln_{uuid.uuid4().hex[:8]}",
        "project_id": project_id,
        "stage": "cleanup",
        "status": "queued"
    }

@projects_router.post("/{project_id}/renders")
async def trigger_render(project_id: str, resolution: str = "1080p"):
    if project_id not in PROJECTS_DB:
        raise HTTPException(status_code=404, detail="Project not found")
    return {
        "render_id": f"rnd_{uuid.uuid4().hex[:8]}",
        "project_id": project_id,
        "resolution": resolution,
        "status": "queued",
        "credits_charged": 0,
        "unmetered": True
    }

@projects_router.post("/{project_id}/publish-pack")
async def trigger_publish_pack(project_id: str):
    if project_id not in PROJECTS_DB:
        raise HTTPException(status_code=404, detail="Project not found")
    return {
        "pack_id": f"pack_{uuid.uuid4().hex[:8]}",
        "project_id": project_id,
        "status": "queued",
        "download_url": f"/v1/projects/{project_id}/publish-pack/download"
    }
