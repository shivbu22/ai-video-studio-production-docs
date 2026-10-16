# 03 - REST API & MCP Server Specification

**Base URL:** `https://api.aivideostudio.app/v1` (Local: `http://localhost:8000/v1`)  
**Format:** JSON over HTTPS (UTF-8). Media is transferred exclusively via presigned S3/R2 URLs.  
**Version:** API v1.0 — Production Contract

---

## 1. Authentication & Security Headers

All protected endpoints require a Bearer token:
```http
Authorization: Bearer <jwt_or_api_key>
```
- **Session JWT:** 7-day expiration, issued by `POST /auth/login` and `POST /auth/register`.
- **Scoped API Key:** Format `ak_live_...` generated for MCP external agents, revocable per key.
- **Idempotency Key:** Required on all mutating `POST` endpoints:
```http
Idempotency-Key: <unique_uuid_or_hash>
```

---

## 2. Global Error Response Contract

All errors return a structured payload with a machine-readable `code`:
```json
{
  "error": {
    "code": "INSUFFICIENT_CREDITS",
    "message": "Project requires 5 credits to render, but available balance is 2.",
    "status": 402,
    "details": {
      "required": 5,
      "available": 2
    }
  }
}
```

### Standard Error Codes
| Code | HTTP Status | Meaning |
|---|---|---|
| `UNAUTHORIZED` | 401 | Missing or expired JWT / API key |
| `FORBIDDEN` | 403 | Insufficient permissions for tenant/project |
| `NOT_FOUND` | 404 | Project or resource does not exist |
| `VERSION_CONFLICT` | 409 | Timeline `base_version` mismatch; re-fetch and re-diff |
| `INSUFFICIENT_CREDITS` | 402 | Available credit balance lower than required hold |
| `RATE_LIMITED` | 429 | Exceeded requests/min threshold |
| `UNLICENSED_ASSET_DETECTED` | 422 | Render blocked: asset lacks license or YouTube opt-in |

---

## 3. Core API Endpoints

### 3.1 Projects & Stages
- `POST /projects` — Create project from brief (`title`, `topic`, `target_length_sec`, `language`, `preset`).
- `GET /projects` — List user projects (Cursor pagination, newest first).
- `GET /projects/{id}` — Full project state including stage status and credit estimates.
- `PATCH /projects/{id}` — Update brief metadata (title, target length).
- `DELETE /projects/{id}` — Soft-delete project (retained for 30 days).
- `POST /projects/{id}/duplicate` — Clone project brief, script, and timeline.

### 3.2 Pipeline Execution
- `POST /projects/{id}/research/run` — Queue Stage 2 web search & claim extraction.
- `GET /projects/{id}/research` — Retrieve extracted claims and source URLs.
- `POST /projects/{id}/script/run` — Queue Stage 3 LLM scene script generation.
- `GET /projects/{id}/script` — Retrieve current script version and scenes.
- `PATCH /projects/{id}/script` — Edit individual scene narration or visual prompt.
- `POST /projects/{id}/voice/run` — Start Stage 4 voice generation or bind upload.
- `POST /projects/{id}/cleanup/run` — Queue Stage 5 Whisper transcription and silence cut.
- `GET /projects/{id}/cleanup/transcript` — Get word-level timestamps array.
- `POST /projects/{id}/visual-plan/run` — Queue Stage 6 storyboard asset matching.
- `POST /projects/{id}/assets/generate` — Generate AI diffusion image into project.
- `POST /projects/{id}/motion/run` — Build Stage 8 Remotion template parameters.

### 3.3 Timeline & Editing
- `GET /projects/{id}/timeline` — Get current timeline document and `current_version`.
- `PATCH /projects/{id}/timeline` — Apply timeline command operations. Requires `base_version`.
- `POST /projects/{id}/timeline/restore` — Roll back timeline to specified historical version.

### 3.4 Previews, Renders & Publish Pack
- `POST /projects/{id}/previews` — Queue fast 540p preview render (0 credits).
- `POST /projects/{id}/renders` — Queue 1080p master render (Requires credit hold).
- `GET /projects/{id}/renders/{render_id}` — Get render progress, status, and download URL.
- `POST /projects/{id}/publish-pack` — Assemble vertical shorts, thumbnails, and zip pack.
- `GET /projects/{id}/publish-pack` — Retrieve download link for publish archive.

### 3.5 Media Uploads & Storage
- `POST /uploads` — Request signed direct upload URL:
  - Body: `{ "filename": "voice.wav", "content_type": "audio/wav", "size_bytes": 10485760 }`
  - Response: `{ "upload_id": "upl_...", "upload_url": "https://...", "storage_key": "..." }`
- `POST /uploads/{upload_id}/complete` — Confirm successful upload; verifies checksum and creates asset.
- `GET /assets/{asset_id}` — Returns asset metadata and 15-minute presigned read URL.

---

## 4. MCP Server Contract (`/v1/mcp`)

The Model Context Protocol endpoint serves tools over Streamable HTTP for external agents (Claude Code, Cursor, Codex). All timeline changes create review proposals.

```
External Agent (MCP) ──> [timeline_propose_ops] ──> Proposal Generated (draft)
                                                            │
                                                            ▼
                                               [Web UI: Accept / Reject]
                                                            │
                                              Accept ───────┴────── Reject
                                                │                     │
                                                ▼                     ▼
                                         Committed to           Draft Discarded
                                        Main Timeline         (Zero Destruction)
```

### Registered MCP Tools
1. `project_create(title, topic, target_length_sec, language)` -> Returns created `Project`.
2. `project_get(project_id)` -> Returns full project state and current stage.
3. `stage_run(project_id, stage, params)` -> Triggers asynchronous stage execution.
4. `job_status(job_id)` -> Polls job progress, status, or error code.
5. `script_propose_edit(project_id, scene_id, new_narration)` -> Generates script diff proposal.
6. `timeline_propose_ops(project_id, base_version, ops[])` -> Generates timeline proposal.
7. `proposal_apply(proposal_id)` -> Commits proposal to timeline if `base_version` matches.
8. `proposal_reject(proposal_id)` -> Discards proposal without side-effects.
9. `render_request(project_id, resolution, dry_run)` -> Estimates credits or queues render.
