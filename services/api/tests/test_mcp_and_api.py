import pytest
from fastapi.testclient import TestClient
from services.api.src.main import app

client = TestClient(app)

def test_health_and_root():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

    res_v1 = client.get("/v1")
    assert res_v1.status_code == 200
    assert res_v1.json()["unmetered"] is True

def test_projects_crud_and_stages():
    # 1. Create project
    create_payload = {
        "title": "Agentic AI in 2026",
        "topic": "The evolution of autonomous coding agents",
        "target_length_sec": 120,
        "language": "en",
        "preset": "educational_tech"
    }
    res_create = client.post("/v1/projects", json=create_payload)
    assert res_create.status_code == 201
    data = res_create.json()
    assert "id" in data
    assert data["title"] == create_payload["title"]
    assert data["unmetered"] is True
    pid = data["id"]

    # 2. Get project
    res_get = client.get(f"/v1/projects/{pid}")
    assert res_get.status_code == 200
    assert res_get.json()["id"] == pid

    # 3. Trigger research
    res_res = client.post(f"/v1/projects/{pid}/research/run")
    assert res_res.status_code == 200
    assert res_res.json()["stage"] == "research"

    # 4. Trigger render
    res_rnd = client.post(f"/v1/projects/{pid}/renders", params={"resolution": "1080p"})
    assert res_rnd.status_code == 200
    assert res_rnd.json()["credits_charged"] == 0

def test_mcp_tools_list():
    payload = {
        "jsonrpc": "2.0",
        "method": "tools/list",
        "id": 1
    }
    res = client.post("/v1/mcp", json=payload)
    assert res.status_code == 200
    data = res.json()
    tools = data["result"]["tools"]
    tool_names = [t["name"] for t in tools]
    assert "project_create" in tool_names
    assert "timeline_propose_ops" in tool_names
    assert "proposal_apply" in tool_names
    assert "proposal_reject" in tool_names
    assert "render_request" in tool_names

def test_mcp_timeline_proposal_cycle():
    # 1. Propose ops
    propose_payload = {
        "jsonrpc": "2.0",
        "method": "tools/call",
        "params": {
            "name": "timeline_propose_ops",
            "arguments": {
                "project_id": "proj_demo_1",
                "base_version": 1,
                "ops": [
                    {
                        "type": "TRIM_CLIP",
                        "clip_id": "clip_voice_1",
                        "params": {"trim_end_ms": 500}
                    }
                ]
            }
        },
        "id": 2
    }
    res_prop = client.post("/v1/mcp", json=propose_payload)
    assert res_prop.status_code == 200
    prop_text = res_prop.json()["result"]["content"][0]["text"]
    import json
    prop_data = json.loads(prop_text)
    assert prop_data["status"] == "draft"
    proposal_id = prop_data["proposal_id"]

    # 2. Apply proposal
    apply_payload = {
        "jsonrpc": "2.0",
        "method": "tools/call",
        "params": {
            "name": "proposal_apply",
            "arguments": {
                "proposal_id": proposal_id
            }
        },
        "id": 3
    }
    res_apply = client.post("/v1/mcp", json=apply_payload)
    assert res_apply.status_code == 200
    apply_text = res_apply.json()["result"]["content"][0]["text"]
    apply_data = json.loads(apply_text)
    assert apply_data["status"] == "applied"
    assert apply_data["committed_version"] == 2

def test_billing_status_unmetered():
    res = client.get("/v1/billing/status")
    assert res.status_code == 200
    data = res.json()
    assert data["is_unmetered"] is True
    assert data["credits_balance"] == "UNLIMITED"
    assert data["price_per_minute"] == 0
