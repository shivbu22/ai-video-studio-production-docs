# 02 - Architecture and Data Model

**Product:** AI Video Studio  
**Stack:** Next.js 15+, FastAPI, PostgreSQL 15+, Redis 7+, Celery 5.3+, Cloudflare R2 / AWS S3, faster-whisper, Remotion 4+, ffmpeg 6+  
**Architecture Pattern:** Clean-Room Asynchronous Monorepo with Partitioned Worker Fleets and Immutable Command-Based State.

---

## 1. System Services & Boundaries

```
[ Next.js 15 Web App ] ──(REST / SSE)──> [ FastAPI Orchestrator ] ──(DB)──> [ PostgreSQL 15 ]
          │                                     │
          │ (Presigned Direct S3/R2)            ├──(Pub/Sub)───> [ Redis 7 Broker ]
          ▼                                     │                       │
[ Cloudflare R2 Storage ] <──(Download/Upload)──┴───────────> [ Celery Worker Fleet ]
                                                                ├── q.research
                                                                ├── q.audio (Whisper)
                                                                ├── q.assets (Stock/AI)
                                                                ├── q.motion (Remotion)
                                                                ├── q.render (Headless)
                                                                └── q.publish (ffmpeg)
```

### Service Responsibility Boundaries

| Service | Primary Ownership | Strict Prohibitions ("Must Never") |
|---|---|---|
| **`apps/web`** (Next.js) | UI state, timeline canvas interactions, video preview player, client-side form validation. | Must NEVER store AI API keys, price renders, or schedule queue priorities directly. |
| **`services/api`** (FastAPI) | Auth, project/timeline CRUD, job scheduling, credit hold/capture, presigned URL issuance, MCP server. | Must NEVER run ffmpeg, Whisper, or Remotion. Requests exceeding 2.0s are bugs. |
| **`worker-research`** | Web search (Tavily/Perplexity), claim extraction, script scene generation via LLMs. | Must NEVER fetch media binaries or execute rendering. |
| **`worker-audio`** | `faster-whisper` transcription, word timestamps, ffmpeg silence/breath reduction. | Must NEVER alter original recordings; cleanup always creates a new asset. |
| **`worker-assets`** | Pexels/Pixabay stock search/download, cloud diffusion image generation, license metadata. | Must NEVER download YouTube media without explicit project opt-in flag. |
| **`worker-render`** | Remotion composition render, motion graphics compilation, captions burn-in, loudness normalization. | Must NEVER mutate billing state directly; reports completion to the API. |
| **`worker-publish`** | Vertical 9:16 Shorts cropping, thumbnail export, metadata packaging, zip archive generation. | Must NEVER post directly to YouTube/TikTok in MVP; outputs zip only. |

---

## 2. Queue Architecture (Redis + Celery)

| Queue Name | Concurrency | Soft / Hard Timeout | Primary Workload |
|---|---|---|---|
| `q.research` | 4 per worker | 120s / 180s | LLM research and script generation calls |
| `q.audio` | 2 per worker | 600s / 900s | `faster-whisper` alignment and audio cleanup |
| `q.assets` | 6 per worker | 300s / 420s | Network I/O stock downloads and diffusion generation |
| `q.motion` | 2 per worker | 300s / 420s | Remotion scene prop building and bundle compilation |
| `q.render` | 1 per worker | 3600s / 3900s | Headless Chromium video rendering (CPU/RAM bound) |
| `q.publish` | 2 per worker | 900s / 1200s | ffmpeg crops, audio normalization, zip creation |
| `q.dead` | Manual review | N/A | Dead-letter queue for terminal job failures |

### Queue Invariants
- **Idempotency:** Every Celery task has an `idempotency_key = SHA256(project_id + stage + input_version)`. Re-delivery returns the existing job status without double-processing.
- **Retry Strategy:** Transient network/5xx errors retry up to 3 times with exponential backoff (30s / 120s / 480s with jitter). Deterministic errors fail immediately.
- **Heartbeat & Orphan Reaper:** Render workers send heartbeats every 15s. If a worker goes silent for > 120s, the orchestrator marks the job failed and releases held credits.

---

## 3. Database Schema (PostgreSQL 15+)

All primary keys use prefixed string identifiers (`usr_`, `proj_`, `job_`, `ast_`, `rnd_`). Timestamps use UTC with microsecond precision.

```sql
-- 1. Users & Accounts
CREATE TABLE users (
    id VARCHAR(32) PRIMARY KEY, -- usr_...
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    plan_id VARCHAR(32) NOT NULL DEFAULT 'plan_free',
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Subscription Plans
CREATE TABLE plans (
    id VARCHAR(32) PRIMARY KEY, -- plan_free, plan_starter, plan_pro, plan_agency
    name VARCHAR(64) NOT NULL,
    monthly_credits INTEGER NOT NULL,
    max_quality_tier VARCHAR(16) NOT NULL DEFAULT '1080p',
    price_paise INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Append-Only Credit Ledger
CREATE TABLE credit_ledger (
    id VARCHAR(32) PRIMARY KEY, -- led_...
    user_id VARCHAR(32) NOT NULL REFERENCES users(id),
    delta INTEGER NOT NULL, -- signed integer (+/-)
    reason VARCHAR(32) NOT NULL, -- 'grant', 'hold', 'capture', 'release', 'purchase', 'refund'
    job_id VARCHAR(32), -- nullable reference to jobs
    balance_after INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_ledger_user ON credit_ledger(user_id, created_at DESC);

-- 4. Projects
CREATE TABLE projects (
    id VARCHAR(32) PRIMARY KEY, -- proj_...
    user_id VARCHAR(32) NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'draft',
    doc JSONB NOT NULL DEFAULT '{}'::jsonb,
    schema_version INTEGER NOT NULL DEFAULT 1,
    youtube_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
    youtube_opt_in_at TIMESTAMPTZ,
    youtube_opt_in_by VARCHAR(32),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_projects_user ON projects(user_id) WHERE deleted_at IS NULL;

-- 5. Immutable Script Versions
CREATE TABLE script_versions (
    id VARCHAR(32) PRIMARY KEY, -- scr_...
    project_id VARCHAR(32) NOT NULL REFERENCES projects(id),
    version INTEGER NOT NULL,
    body TEXT NOT NULL,
    scenes JSONB NOT NULL,
    source VARCHAR(32) NOT NULL DEFAULT 'ai', -- 'ai' or 'user_edit'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX idx_script_project_version ON script_versions(project_id, version);

-- 6. Timelines & Timeline Versions
CREATE TABLE timelines (
    id VARCHAR(32) PRIMARY KEY, -- tml_...
    project_id VARCHAR(32) UNIQUE NOT NULL REFERENCES projects(id),
    current_version INTEGER NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE timeline_versions (
    id VARCHAR(32) PRIMARY KEY, -- tmv_...
    timeline_id VARCHAR(32) NOT NULL REFERENCES timelines(id),
    version INTEGER NOT NULL,
    doc JSONB NOT NULL,
    created_by VARCHAR(32) NOT NULL, -- 'user', 'ai_pipeline', 'mcp_proposal'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX idx_timeline_version ON timeline_versions(timeline_id, version);

-- 7. Media Assets (Originals are Immutable)
CREATE TABLE assets (
    id VARCHAR(32) PRIMARY KEY, -- ast_...
    project_id VARCHAR(32) NOT NULL REFERENCES projects(id),
    kind VARCHAR(32) NOT NULL, -- 'voice', 'cleaned_audio', 'video', 'image', 'music', 'captions', 'thumbnail'
    storage_key VARCHAR(512) NOT NULL,
    duration_ms INTEGER,
    width INTEGER,
    height INTEGER,
    source VARCHAR(32) NOT NULL, -- 'upload', 'stock_pexels', 'stock_pixabay', 'ai_generated', 'youtube_opt_in'
    licence_ref VARCHAR(255),
    checksum VARCHAR(64) NOT NULL, -- SHA-256
    immutable BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_assets_project ON assets(project_id);

-- 8. Asynchronous Processing Jobs
CREATE TABLE jobs (
    id VARCHAR(32) PRIMARY KEY, -- job_...
    project_id VARCHAR(32) NOT NULL REFERENCES projects(id),
    type VARCHAR(32) NOT NULL, -- 'research', 'script', 'audio_clean', 'render', etc.
    queue VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'queued', -- 'queued', 'running', 'passed', 'failed', 'canceled'
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    progress INTEGER NOT NULL DEFAULT 0,
    input_version INTEGER NOT NULL,
    error_code VARCHAR(64),
    error_detail TEXT,
    cancel_requested_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_jobs_project ON jobs(project_id, status);

-- 9. Master Renders
CREATE TABLE renders (
    id VARCHAR(32) PRIMARY KEY, -- rnd_...
    project_id VARCHAR(32) NOT NULL REFERENCES projects(id),
    job_id VARCHAR(32) NOT NULL REFERENCES jobs(id),
    timeline_version INTEGER NOT NULL,
    quality_tier VARCHAR(16) NOT NULL, -- '540p_preview', '1080p', '4k'
    status VARCHAR(32) NOT NULL DEFAULT 'rendering',
    output_asset_id VARCHAR(32) REFERENCES assets(id),
    credits_charged INTEGER NOT NULL DEFAULT 0,
    duration_ms INTEGER NOT NULL,
    render_seconds INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Publish Packs
CREATE TABLE publish_packs (
    id VARCHAR(32) PRIMARY KEY, -- pak_...
    project_id VARCHAR(32) NOT NULL REFERENCES projects(id),
    render_id VARCHAR(32) NOT NULL REFERENCES renders(id),
    storage_key VARCHAR(512) NOT NULL,
    contents JSONB NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ready',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Stripe Subscriptions
CREATE TABLE subscriptions (
    id VARCHAR(32) PRIMARY KEY, -- sub_...
    user_id VARCHAR(32) NOT NULL REFERENCES users(id),
    stripe_customer_id VARCHAR(128) NOT NULL,
    stripe_subscription_id VARCHAR(128) UNIQUE NOT NULL,
    plan_id VARCHAR(32) NOT NULL REFERENCES plans(id),
    status VARCHAR(32) NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Audit Log (Append-Only)
CREATE TABLE audit_log (
    id VARCHAR(32) PRIMARY KEY, -- aud_...
    actor VARCHAR(64) NOT NULL,
    action VARCHAR(64) NOT NULL,
    entity VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    detail JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_entity ON audit_log(entity, entity_id);
```

---

## 4. Storage Key Hierarchy (Cloudflare R2 / S3)

Media objects are strictly isolated by project and version:
- Raw Voice Upload: `projects/{project_id}/assets/raw_voice_{uuid}.wav`
- Cleaned Audio: `projects/{project_id}/stages/cleanup/v{version}/voice_clean.wav`
- Stock Clips: `projects/{project_id}/assets/stock_{provider}_{asset_id}.mp4`
- Generated Images: `projects/{project_id}/assets/gen_{model}_{hash}.png`
- Motion Graphics Compositions: `projects/{project_id}/stages/motion/v{version}/`
- Render Previews: `projects/{project_id}/renders/preview_540p_{render_id}.mp4`
- Master Render: `projects/{project_id}/renders/master_1080p_{render_id}.mp4`
- Publish Pack Archive: `projects/{project_id}/publish/pack_{pack_id}.zip`
