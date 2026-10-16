# 10 - Model Context Protocol (MCP) Server Specification

**Endpoint:** `https://api.aivideostudio.app/v1/mcp` (Streamable HTTP)  
**Protocol Version:** MCP Spec 2024-11-05  
**Core Pattern:** Isolated Draft Edit Sessions with Human Proposal Review.

---

## 1. Architectural Philosophy

AI Video Studio implements the Model Context Protocol to allow external AI assistants (such as Claude Code, Claude Desktop, Cursor, and OpenAI Codex) to inspect, generate, and edit video projects.

### The Proposal Review Rule
Tools that modify a project's script, timeline, or captions **NEVER** write directly to the active version. Instead, they produce a **Draft Proposal**:
1. The agent calls `timeline_propose_ops` with the project ID, `base_version`, and a list of command operations.
2. The server creates an isolated proposal record containing the exact before/after JSON diff, duration delta, and displaced assets.
3. The proposal appears in the web application's "Agent Review" pane.
4. The user clicks **"Accept"** (which applies the commands as a single undo step) or **"Reject"** (which discards the proposal with zero side-effects).
5. If the user edited the timeline while the agent was drafting, attempting to apply the proposal fails with `VERSION_CONFLICT`, preserving user agency.

---

## 2. MCP Tool Definitions

### Tool 1: `project_create`
- **Description:** Initialize a new video project.
- **Input Schema:**
  ```json
  {
    "type": "object",
    "properties": {
      "title": { "type": "string" },
      "topic": { "type": "string" },
      "target_length_sec": { "type": "integer", "default": 180 },
      "language": { "type": "string", "default": "en" }
    },
    "required": ["title", "topic"]
  }
  ```
- **Returns:** Created project object.

### Tool 2: `project_get`
- **Description:** Retrieve complete project details including stage status and credit estimates.
- **Input Schema:**
  ```json
  {
    "type": "object",
    "properties": {
      "project_id": { "type": "string" }
    },
    "required": ["project_id"]
  }
  ```

### Tool 3: `stage_run`
- **Description:** Queue asynchronous stage execution (research, script, audio cleanup, etc.).
- **Input Schema:**
  ```json
  {
    "type": "object",
    "properties": {
      "project_id": { "type": "string" },
      "stage": { "type": "string", "enum": ["research", "script", "voice", "cleanup", "visual_plan", "motion", "render"] },
      "params": { "type": "object" }
    },
    "required": ["project_id", "stage"]
  }
  ```

### Tool 4: `job_status`
- **Description:** Poll progress and status of an asynchronous job.
- **Input Schema:**
  ```json
  {
    "type": "object",
    "properties": {
      "job_id": { "type": "string" }
    },
    "required": ["job_id"]
  }
  ```

### Tool 5: `script_propose_edit`
- **Description:** Propose modifications to a script scene's narration or visual intent.
- **Input Schema:**
  ```json
  {
    "type": "object",
    "properties": {
      "project_id": { "type": "string" },
      "scene_id": { "type": "string" },
      "new_narration": { "type": "string" }
    },
    "required": ["project_id", "scene_id", "new_narration"]
  }
  ```
- **Returns:** `proposal_id` with before/after diff.

### Tool 6: `timeline_propose_ops`
- **Description:** Propose timeline edits (clip trim, move, split, delete, or swap).
- **Input Schema:**
  ```json
  {
    "type": "object",
    "properties": {
      "project_id": { "type": "string" },
      "base_version": { "type": "integer" },
      "ops": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "type": { "type": "string", "enum": ["TRIM_CLIP", "SPLIT_CLIP", "DELETE_CLIP", "SWAP_ASSET", "MOVE_CLIP"] },
            "clip_id": { "type": "string" },
            "params": { "type": "object" }
          },
          "required": ["type", "clip_id"]
        }
      }
    },
    "required": ["project_id", "base_version", "ops"]
  }
  ```
- **Returns:** `proposal_id` with resulting duration and displaced clip warnings.

### Tool 7: `proposal_apply`
- **Description:** Apply an approved proposal to the project timeline.
- **Input Schema:**
  ```json
  {
    "type": "object",
    "properties": {
      "proposal_id": { "type": "string" }
    },
    "required": ["proposal_id"]
  }
  ```

### Tool 8: `proposal_reject`
- **Description:** Discard a draft proposal.
- **Input Schema:**
  ```json
  {
    "type": "object",
    "properties": {
      "proposal_id": { "type": "string" }
    },
    "required": ["proposal_id"]
  }
  ```

### Tool 9: `render_request`
- **Description:** Queue a master 1080p render or perform a dry-run credit estimate.
- **Input Schema:**
  ```json
  {
    "type": "object",
    "properties": {
      "project_id": { "type": "string" },
      "resolution": { "type": "string", "enum": ["540p_preview", "1080p", "4k"], "default": "1080p" },
      "dry_run": { "type": "boolean", "default": false }
    },
    "required": ["project_id"]
  }
  ```
