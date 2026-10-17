import uuid
import datetime
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Request, HTTPException, status
from pydantic import BaseModel, Field

mcp_router = APIRouter(prefix="/mcp", tags=["Model Context Protocol"])

# In-memory proposal store (in production backed by PostgreSQL timeline_proposals table)
PROPOSALS_STORE: Dict[str, Dict[str, Any]] = {}
PROJECTS_STORE: Dict[str, Dict[str, Any]] = {
    "proj_demo_1": {
        "id": "proj_demo_1",
        "title": "Quantum Computing 2026",
        "topic": "Quantum Computing breakthroughs in 2026",
        "target_length_sec": 180,
        "language": "en",
        "stage": "timeline",
        "current_version": 1,
        "unmetered": True
    }
}

MCP_TOOLS = [
    {
        "name": "project_create",
        "description": "Initialize a new AI Video Studio project from topic brief.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "topic": {"type": "string"},
                "target_length_sec": {"type": "integer", "default": 180},
                "language": {"type": "string", "default": "en"}
            },
            "required": ["title", "topic"]
        }
    },
    {
        "name": "project_get",
        "description": "Retrieve project state, current stage, and timeline version.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "project_id": {"type": "string"}
            },
            "required": ["project_id"]
        }
    },
    {
        "name": "stage_run",
        "description": "Queue asynchronous pipeline stage execution.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "project_id": {"type": "string"},
                "stage": {"type": "string", "enum": ["research", "script", "voice", "cleanup", "visual_plan", "motion", "render"]},
                "params": {"type": "object"}
            },
            "required": ["project_id", "stage"]
        }
    },
    {
        "name": "timeline_propose_ops",
        "description": "Propose immutable timeline edit operations. Creates an isolated draft proposal for human review.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "project_id": {"type": "string"},
                "base_version": {"type": "integer"},
                "ops": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "type": {"type": "string", "enum": ["TRIM_CLIP", "SPLIT_CLIP", "DELETE_CLIP", "MOVE_CLIP", "SWAP_ASSET"]},
                            "clip_id": {"type": "string"},
                            "params": {"type": "object"}
                        },
                        "required": ["type", "clip_id"]
                    }
                }
            },
            "required": ["project_id", "base_version", "ops"]
        }
    },
    {
        "name": "proposal_apply",
        "description": "Apply approved timeline proposal to active project version.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "proposal_id": {"type": "string"}
            },
            "required": ["proposal_id"]
        }
    },
    {
        "name": "proposal_reject",
        "description": "Discard a draft proposal with zero side-effects.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "proposal_id": {"type": "string"}
            },
            "required": ["proposal_id"]
        }
    },
    {
        "name": "render_request",
        "description": "Request 540p fast preview or 1080p master render. Always unmetered (0 credits).",
        "inputSchema": {
            "type": "object",
            "properties": {
                "project_id": {"type": "string"},
                "resolution": {"type": "string", "enum": ["540p", "1080p"], "default": "1080p"}
            },
            "required": ["project_id"]
        }
    }
]

class JsonRpcRequest(BaseModel):
    jsonrpc: str = "2.0"
    method: str
    params: Optional[Dict[str, Any]] = None
    id: Optional[Any] = None

@mcp_router.post("")
async def handle_mcp_request(req: JsonRpcRequest):
    """JSON-RPC 2.0 handler for Streamable HTTP MCP Server Protocol."""
    method = req.method
    params = req.params or {}

    if method == "tools/list":
        return {
            "jsonrpc": "2.0",
            "id": req.id,
            "result": {
                "tools": MCP_TOOLS
            }
        }
    
    elif method == "tools/call":
        tool_name = params.get("name")
        args = params.get("arguments", {})
        result = execute_mcp_tool(tool_name, args)
        return {
            "jsonrpc": "2.0",
            "id": req.id,
            "result": {
                "content": [
                    {
                        "type": "text",
                        "text": json_dump_compact(result)
                    }
                ]
            }
        }
    
    elif method == "initialize":
        return {
            "jsonrpc": "2.0",
            "id": req.id,
            "result": {
                "protocolVersion": "2024-11-05",
                "capabilities": {
                    "tools": {}
                },
                "serverInfo": {
                    "name": "ai-video-studio-mcp",
                    "version": "1.0.0"
                }
            }
        }
        
    return {
        "jsonrpc": "2.0",
        "id": req.id,
        "error": {
            "code": -32601,
            "message": f"Method not found: {method}"
        }
    }

def json_dump_compact(data: Any) -> str:
    import json
    return json.dumps(data)

def execute_mcp_tool(name: str, args: Dict[str, Any]) -> Dict[str, Any]:
    if name == "project_create":
        pid = f"proj_{uuid.uuid4().hex[:8]}"
        project = {
            "id": pid,
            "title": args["title"],
            "topic": args["topic"],
            "target_length_sec": args.get("target_length_sec", 180),
            "language": args.get("language", "en"),
            "stage": "intake",
            "current_version": 1,
            "unmetered": True,
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
        PROJECTS_STORE[pid] = project
        return {"project": project}

    elif name == "project_get":
        pid = args["project_id"]
        if pid not in PROJECTS_STORE:
            return {"error": "Project not found", "project_id": pid}
        return {"project": PROJECTS_STORE[pid]}

    elif name == "stage_run":
        pid = args["project_id"]
        stage = args["stage"]
        return {
            "job_id": f"job_{uuid.uuid4().hex[:8]}",
            "project_id": pid,
            "stage": stage,
            "status": "queued"
        }

    elif name == "timeline_propose_ops":
        pid = args["project_id"]
        base_version = args["base_version"]
        ops = args["ops"]
        proposal_id = f"prop_{uuid.uuid4().hex[:8]}"
        
        proposal = {
            "id": proposal_id,
            "project_id": pid,
            "base_version": base_version,
            "author": "MCP Agent",
            "status": "draft",
            "ops": ops,
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "summary": f"Agent proposed {len(ops)} timeline edit operations."
        }
        PROPOSALS_STORE[proposal_id] = proposal
        return {
            "proposal_id": proposal_id,
            "status": "draft",
            "message": "Draft proposal created. Awaiting human review in Web UI.",
            "ops_count": len(ops)
        }

    elif name == "proposal_apply":
        prop_id = args["proposal_id"]
        if prop_id not in PROPOSALS_STORE:
            return {"error": "Proposal not found", "proposal_id": prop_id}
        prop = PROPOSALS_STORE[prop_id]
        prop["status"] = "applied"
        return {
            "proposal_id": prop_id,
            "status": "applied",
            "committed_version": prop["base_version"] + 1
        }

    elif name == "proposal_reject":
        prop_id = args["proposal_id"]
        if prop_id in PROPOSALS_STORE:
            PROPOSALS_STORE[prop_id]["status"] = "rejected"
        return {
            "proposal_id": prop_id,
            "status": "rejected",
            "message": "Proposal discarded with zero side-effects."
        }

    elif name == "render_request":
        return {
            "render_id": f"rnd_{uuid.uuid4().hex[:8]}",
            "project_id": args["project_id"],
            "resolution": args.get("resolution", "1080p"),
            "status": "queued",
            "credits_cost": 0,
            "unmetered": True
        }

    return {"error": f"Unknown tool: {name}"}
