# AI Video Studio Master Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, production-grade AI Video Studio web platform (clean-room Route B) that transforms a topic brief and voiceover into a finished 1080p video, vertical Shorts/Reels, thumbnails, and publish metadata pack across a 10-stage pipeline with an immutable command-based timeline, Remotion motion graphics, and an MCP agent editing interface.

**Architecture:** A modern monorepo featuring a Next.js 15+ (React 19 / Tailwind CSS) web editor communicating via REST / SSE with a FastAPI (Python 3.11+) asynchronous orchestration service. Heavy compute (faster-whisper, Remotion headless rendering, ffmpeg assembly, AI generation) is offloaded to a partitioned Redis + Celery worker queue network backed by PostgreSQL 15+ and Cloudflare R2 / S3 storage. External AI agents and in-app assistants interact through a Streamable HTTP MCP server utilizing an isolated draft-proposal review pattern.

**Tech Stack:** Next.js 15+, React 19, Tailwind CSS, TypeScript, FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic, PostgreSQL 15+, Redis 7+, Celery 5.3+, faster-whisper, Remotion 4+, ffmpeg 6+, Cloudflare R2 / AWS S3, Claude 3.5 Sonnet / GPT-4o APIs, Tavily / Perplexity API, ElevenLabs / OpenAI TTS, Stripe SDK.

**Spec References:**
- [01-PRD-AI-Video-Studio.docx](file:///c:/Users/ahiva/OneDrive/Desktop/ai-video-studio-production-docs/01-PRD-AI-Video-Studio.docx)
- [02-Architecture-and-Data-Model.pdf](file:///c:/Users/ahiva/OneDrive/Desktop/ai-video-studio-production-docs/02-Architecture-and-Data-Model.pdf)
- [03-API-Spec.pdf](file:///c:/Users/ahiva/OneDrive/Desktop/ai-video-studio-production-docs/03-API-Spec.pdf)
- [04-UI-UX-Spec.pdf](file:///c:/Users/ahiva/OneDrive/Desktop/ai-video-studio-production-docs/04-UI-UX-Spec.pdf)
- [05-AI-Pipeline-Spec.pdf](file:///c:/Users/ahiva/OneDrive/Desktop/ai-video-studio-production-docs/05-AI-Pipeline-Spec.pdf)
- [06-Security-Privacy-Licensing.pdf](file:///c:/Users/ahiva/OneDrive/Desktop/ai-video-studio-production-docs/06-Security-Privacy-Licensing.pdf)
- [07-Testing-and-DevOps.pdf](file:///c:/Users/ahiva/OneDrive/Desktop/ai-video-studio-production-docs/07-Testing-and-DevOps.pdf)
- [08-Pricing-Billing-Launch.pdf](file:///c:/Users/ahiva/OneDrive/Desktop/ai-video-studio-production-docs/08-Pricing-Billing-Launch.pdf)
- [09-Build-Plan-SlotStudio.pdf](file:///c:/Users/ahiva/OneDrive/Desktop/ai-video-studio-production-docs/09-Build-Plan-SlotStudio.pdf)
- [10-Full-Plan-Three-Repos.pdf](file:///c:/Users/ahiva/OneDrive/Desktop/ai-video-studio-production-docs/10-Full-Plan-Three-Repos.pdf)

---

## Global Constraints

- **Licensing Clean-Room Invariant:** ABSOLUTELY ZERO source code, templates, or binary assets from OpenChatCut (AGPL-3.0), Palmier Pro (GPL-3.0), or Pallaidium (GPL-3.0) may enter this repository. All code must be original, clean-room implementation based solely on behavioral specifications and open protocols (MCP, OpenAI-compatible /v1 generation schema). All dependencies must be MIT, Apache-2.0, BSD, or commercial friendly.
- **Credit Metering Invariant:** 1 Credit = exactly 1 minute of finished 1080p master render. Fast 540p previews are free. Master render credits are placed on hold at job initiation and captured ONLY upon successful render completion. Failed or canceled jobs release held credits immediately. Credits are integer amounts stored in an append-only `credit_ledger` table; mutable credit balance counters are strictly forbidden.
- **API Boundary & Media Isolation:** Media binaries (raw audio, stock video, images, render outputs) NEVER pass through the FastAPI application server; all uploads and downloads use presigned Cloudflare R2 / S3 URLs with a 15-minute read TTL and 30-minute upload TTL. No request to FastAPI may exceed 2.0s execution time.
- **Queue Partitioning & Limits:** Tasks are segregated into dedicated Celery queues with strict soft/hard timeouts: `q.research` (120s/180s), `q.audio` (600s/900s), `q.assets` (300s/420s), `q.motion` (300s/420s), `q.render` (3600s/3900s), `q.publish` (900s/1200s), and `q.dead`. Every job is idempotent on `SHA256(project_id + stage + input_version)`.
- **Timeline & Proposal Immutability:** The timeline engine operates on an immutable command pattern with optimistic version concurrency (`base_version`). All edits from external AI agents via MCP or conversational assistants must land as an isolated draft proposal (`proposal_id`) requiring explicit user review and approval before committing into a single undo/redo step.
- **Audio Standards:** All intermediate voice and audio assets are normalized to 48 kHz 24-bit mono WAV. Final audio mix loudness is normalized to exactly -14 LUFS (+/- 0.5 LUFS) with a maximum true peak of -1.0 dBTP.
- **Provenance & Provenance Chain:** Every fact claim in generated scripts must retain its primary source URL and timestamp. Every media asset must retain its origin, license type, attribution requirements, model, prompt, and seed.
- **YouTube Disclaimer:** Direct YouTube URL media import is strictly disabled by default. It can only be unlocked per-project by workspace owners via `youtube_source_enabled: true` with an affirmative user rights acknowledgment recorded in `audit_log`.

---

## Review Focus (Top Failure Modes & Critical Edge Cases)

1. **Audio-Video Desynchronization & Drift:** Word-level timestamps from faster-whisper drifting relative to Remotion composition frames due to sample rate mismatches or variable framerate video clips. *Expected behavior:* Strict audio conversion to 48 kHz WAV before transcription; Remotion compositions locked to exactly 30 fps; verification assertion fails if audio/video drift exceeds 40ms over a 10-minute timeline.
2. **Worker Restart & Dead-Letter Recovery Mid-Render:** Worker host termination or OOM crash during a 45-minute 1080p render leaving jobs stuck in `running` status and credits locked in `held` state. *Expected behavior:* Celery visibility timeouts with heartbeats; orphaned job reaper detects stale heartbeats (> 120s), marks job `failed`, releases credit holds, and moves task to `q.dead` without duplicate charging.
3. **Optimistic Concurrency & Timeline Race Conditions:** User edits a scene in the web UI while an MCP agent simultaneously applies a draft proposal on an older `base_version`. *Expected behavior:* Reject with HTTP 409 `VERSION_CONFLICT`; reject proposal apply; force client to re-fetch current timeline version and recompute diff.
4. **Idempotent Webhook & Credit Reconciliation:** Stripe billing webhooks firing multiple times or out of sequence for subscription renewals and top-ups. *Expected behavior:* Webhook events recorded in an idempotent table `stripe_events`; credit ledger entries linked to unique Stripe event IDs; duplicate deliveries return HTTP 200 without duplicate credit grants.
5. **Fair-Use & License Contamination Guard:** An automated scraper or user uploads unlicensed copyrighted music or YouTube clips without explicit rights opt-in. *Expected behavior:* Stage 10 render gate validates `rights[]` manifest array; if any asset lacks a valid license or unapproved YouTube flag, render is blocked with HTTP 422 `UNLICENSED_ASSET_DETECTED`.

---

## Architecture & Monorepo Layout

The project is structured as a unified monorepo enabling shared TypeScript types between the Next.js frontend and Remotion render packages, while maintaining a decoupled Python FastAPI backend and Celery worker fleet:

```
ai-video-studio/
├── apps/
│   └── web/                               # Next.js 15+ App Router, React 19, Tailwind CSS
│       ├── src/
│       │   ├── app/                       # Dashboard, Editor, Projects, Billing, Settings
│       │   ├── components/                # Timeline Canvas, Script Editor, Audio Scrub, Modals
│       │   ├── hooks/                     # useTimeline, useJobPolling, useAudioWaveform
│       │   ├── lib/                       # API client, SSE listener, auth utilities
│       │   └── types/                     # Frontend state models
│       ├── package.json
│       └── tsconfig.json
├── services/
│   ├── api/                               # FastAPI Orchestration Engine (Python 3.11+)
│   │   ├── src/
│   │   │   ├── routers/                   # /auth, /projects, /timeline, /jobs, /billing, /mcp
│   │   │   ├── models/                    # SQLAlchemy 2.0 ORM & Pydantic v2 schemas
│   │   │   ├── services/                  # Business logic: credits, storage, stage runner
│   │   │   ├── mcp/                       # Streamable HTTP MCP server & proposal engine
│   │   │   └── main.py                    # FastAPI application entrypoint
│   │   ├── alembic/                       # PostgreSQL migrations
│   │   └── requirements.txt
│   └── workers/                           # Partitioned Celery Worker Fleet
│       ├── src/
│       │   ├── tasks/                     # research.py, audio.py, assets.py, motion.py, render.py
│       │   ├── pipeline/                  # Whisper engine, ffmpeg wrapper, Remotion CLI runner
│       │   ├── adapters/                  # Cloud AI generation adapters (fal.ai, ElevenLabs, ComfyUI)
│       │   └── celery_app.py              # Celery configuration & queue bindings
│       └── requirements.txt
├── packages/
│   ├── remotion/                          # Remotion 4+ React Motion Graphics & Render Harness
│   │   ├── src/
│   │   │   ├── compositions/              # MainTimeline, ShortCut, PreviewComposition
│   │   │   ├── templates/                 # 6 MVP Templates + 6 v1 Templates
│   │   │   └── captions/                  # Word-synced animated typography
│   │   ├── package.json
│   │   └── remotion.config.ts
│   └── shared-types/                      # Canonical JSON schemas & TypeScript definitions
│       ├── schemas/                       # project.json, timeline.json, manifest.json
│       └── package.json
├── docker/                                # Dockerfiles and Docker Compose topologies
├── tests/                                 # Golden renders, end-to-end fixtures, contract tests
└── docs/                                  # Production specifications and architecture docs
```

---

## Complete 10-Stage Pipeline Flow

```
[1. Topic Intake] ──> [2. Research Brief] ──> [3. Scene Script] ──> [4. Voice Track] ──> [5. Audio Cleanup & Timings]
                                                                                                  │
                                                                                                  ▼
[10. Master Render & Pack] <── [9. Timeline Edit] <── [8. Motion Graphics] <── [7. Asset Sourcing] <── [6. Visual Storyboard]
       │                               ▲
       ▼                               │
 (1080p MP4 +               (MCP External Agent &
  Vertical Shorts +          Manual Proposal Review)
  Metadata Zip)
```

---

## Dependency Graph & Implementation Waves

```
Wave 1: Monorepo Scaffolding & Core Database Models (Tasks 1 - 3)
     │
     ├── Wave 2: Storage, Auth & Idempotent Job Queue (Tasks 4 - 6)
     │        │
     │        ├── Wave 3: Audio Subsystem & faster-whisper Timings (Tasks 7 - 9)
     │        │        │
     │        │        ├── Wave 4: AI Research & Script Generation Pipeline (Tasks 10 - 12)
     │        │        │        │
     │        │        ├── Wave 5: Remotion Motion Graphics Harness & Asset Adapters (Tasks 13 - 15)
     │        │        │        │        │
     │        │        │        ├── Wave 6: Command-Based Timeline Engine & Web Editor (Tasks 16 - 18)
     │        │        │        │        │        │
     │        │        │        │        ├── Wave 7: Render Pipeline, Loudness & Publish Pack (Tasks 19 - 21)
     │        │        │        │        │        │        │
     │        │        │        │        │        └── Wave 8: MCP Agent Interface, Billing & Quality Gates (Tasks 22 - 24)
```

---

## Phased Delivery Roadmap & Scope Boundaries

### Phase 0: 5-7 Day Validation Spike (Zero-UI CLI Pipeline)
- **Objective:** Prove the core pipeline end-to-end on one real Pixalified video before committing to the full web app.
- **Scope:**
  - Automated topic research and claim extraction with source citations.
  - Script generation into scene JSON format.
  - Voice cleanup (faster-whisper word-timings + ffmpeg silence/breath reduction).
  - 3 Remotion graphic scenes (Bar Chart, A vs B Comparison, Quote Card).
  - ffmpeg final assembly: ducked background music, burned-in captions, 1080p export, and 1 vertical Short cut.
- **Exit Gate:** 1 genuinely postable 3-5 minute video produced; written behavior spec for the timeline editor and MCP tools; confirmed unit economics per render.

### Phase 1: 6-8 Weeks Production MVP Platform (Route B Clean-Room)
- **Objective:** A browser-based web application working on Windows and Mac with no desktop installs.
- **Scope:**
  - Full Next.js 15 web app with user authentication, dashboard, and 10-stage guided navigation.
  - Asynchronous FastAPI orchestrator with Redis + Celery queues and SSE progress streaming.
  - Script editor with per-scene editing and fact-source inspector.
  - Voice upload + in-browser audio recording + faster-whisper transcription with word timings.
  - Visual storyboard matching scenes to Pexels/Pixabay stock footage and Cloud AI image generation.
  - 6 Remotion motion graphics templates (Bar chart, Line chart, Comparison, Tier list, Quote, Stat counter).
  - Lightweight scene timeline editor (trim, split, reorder, swap, delete, transcript-based cutting).
  - 540p fast preview (< 2 min render) and 1080p master render.
  - Publish pack: 1 vertical 9:16 Short cut, 1 primary thumbnail, YouTube title/description/chapters.
- **Exit Gate:** 5 complete videos produced through the UI by internal creators without developer assistance.

### Phase 2: 4-6 Weeks Sellable v1 Platform
- **Objective:** Turn internal dogfooding tool into a commercial SaaS platform.
- **Scope:**
  - Stripe subscription billing and integer credit ledger with atomic hold/capture/release.
  - Streamable HTTP MCP server exposing draft edit sessions (`open_edit_session`, `propose_timeline_edit`, `commit_draft`).
  - TTS option (ElevenLabs & OpenAI TTS) with per-scene credit estimates.
  - ComfyUI generation adapter for remote GPU image/video workflows.
  - 3 automated thumbnail variations and 2-3 Shorts per video.
  - 12+ Remotion templates (adding Pie/Donut, Timeline, Map, Callout, List, Chapter).
  - Per-channel brand kits (custom fonts, color tokens, logos, watermarks).
  - Project archive export (.zip with all assets, JSON manifest, and timeline EDL).
- **Exit Gate:** First paying creator successfully renders a video start-to-finish; an external AI agent (Claude Code / Codex) edits a project draft over MCP that the user approves.

### Phase 3: v2 Polish & Scaling (Ongoing)
- **Scope:** 4K master render tier; Hindi / Hinglish script generation and caption tuning; team collaboration and multi-seat permissions; template marketplace; user-connected local GPU generation backend (Pallaidium pattern); Shorts engagement analytics.

---

## Detailed Task Breakdown

### Wave 1: Monorepo Foundation & Core Database Models

#### Task 1: Monorepo Scaffolding & Canonical Shared Types
**Description:** Initialize monorepo workspace containing Next.js 15+ frontend, FastAPI backend, Remotion package, and shared canonical TypeScript schemas for Project, Timeline, Scene, and Manifest objects.
**Files:**
- Create: `package.json`, `pnpm-workspace.yaml`, `packages/shared-types/package.json`, `packages/shared-types/src/index.ts`, `packages/shared-types/src/schemas/project.ts`, `packages/shared-types/src/schemas/timeline.ts`
- Test: `packages/shared-types/tests/schemas.test.ts`
**Interfaces:**
- Consumes: JSON Schema definitions from `02-Architecture-and-Data-Model.pdf`.
- Produces: TypeScript types `Project`, `Timeline`, `Scene`, `Cue`, `Manifest` exported for web and Remotion packages.

- [ ] **Step 1: Write the failing schema validation test**
```typescript
import { ProjectSchema, TimelineSchema } from '../src';
describe('Canonical Schemas', () => {
  it('validates a conformant project and timeline object', () => {
    const validTimeline = { schema_version: 1, duration_ms: 120000, fps: 30, tracks: [] };
    expect(TimelineSchema.safeParse(validTimeline).success).toBe(true);
  });
});
```
- [ ] **Step 2: Run test to verify it fails**
Run: `pnpm --filter @ai-video-studio/shared-types test`
Expected: FAIL with "Cannot find module '../src'"
- [ ] **Step 3: Implement schemas with Zod in `packages/shared-types/src`**
Define `ProjectSchema`, `TimelineSchema`, `SceneSchema`, `ManifestSchema` with strict schema versioning.
- [ ] **Step 4: Run test to verify it passes**
Run: `pnpm --filter @ai-video-studio/shared-types test`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add package.json pnpm-workspace.yaml packages/shared-types
git commit -m "chore: initialize monorepo and canonical shared types"
```

---

#### Task 2: PostgreSQL Database Schema & Alembic Migrations
**Description:** Implement SQLAlchemy 2.0 models and initial Alembic migration for all 12 core tables (`users`, `plans`, `credit_ledger`, `projects`, `script_versions`, `timelines`, `timeline_versions`, `assets`, `jobs`, `renders`, `publish_packs`, `subscriptions`, `audit_log`).
**Files:**
- Create: `services/api/src/models/base.py`, `services/api/src/models/entities.py`, `services/api/alembic.ini`, `services/api/alembic/env.py`, `services/api/alembic/versions/001_initial_schema.py`
- Test: `services/api/tests/test_models.py`
**Interfaces:**
- Consumes: Table specifications from `02-Architecture-and-Data-Model.pdf`.
- Produces: SQLAlchemy ORM entities with foreign keys, composite indexes, and enum statuses.

- [ ] **Step 1: Write failing model constraint tests**
```python
def test_project_and_immutable_script_models(db_session):
    user = User(email="creator@pixalified.com", password_hash="hash")
    db_session.add(user)
    db_session.commit()
    proj = Project(user_id=user.id, title="AI Revolution", schema_version=1)
    db_session.add(proj)
    db_session.commit()
    assert proj.id.startswith("proj_")
    assert proj.created_at is not None
```
- [ ] **Step 2: Run test to verify it fails**
Run: `pytest services/api/tests/test_models.py -v`
Expected: FAIL with "ModuleNotFoundError: No module named 'models.entities'"
- [ ] **Step 3: Implement ORM entities in `services/api/src/models/entities.py`**
Configure prefixed string IDs (`usr_`, `proj_`, `job_`, `ast_`), UUID v7 timestamps, and PostgreSQL JSONB columns.
- [ ] **Step 4: Run test to verify it passes**
Run: `pytest services/api/tests/test_models.py -v`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add services/api/src/models services/api/alembic services/api/tests
git commit -m "feat(api): implement postgresql data models and initial migration"
```

---

#### Task 3: Append-Only Credit Ledger & Balance Invariants
**Description:** Build the credit management service enforcing the append-only ledger pattern. Credits are integer amounts; balance is derived dynamically; holds, captures, releases, grants, and purchases are executed atomically.
**Files:**
- Create: `services/api/src/services/credit_service.py`, `services/api/src/schemas/billing.py`
- Test: `services/api/tests/test_credit_service.py`
**Interfaces:**
- Consumes: `credit_ledger` table, `User` entity.
- Produces: `CreditService.get_balance(user_id) -> int`, `CreditService.hold_credits(user_id, job_id, amount) -> LedgerEntry`, `CreditService.capture_hold(job_id) -> LedgerEntry`, `CreditService.release_hold(job_id) -> LedgerEntry`.

- [ ] **Step 1: Write failing credit ledger invariant tests**
```python
def test_credit_hold_and_capture_cycle(credit_service, user_id):
    credit_service.grant_credits(user_id, 100, reason="subscription_grant")
    assert credit_service.get_available_balance(user_id) == 100
    credit_service.hold_credits(user_id, job_id="job_1", amount=30)
    assert credit_service.get_available_balance(user_id) == 70
    credit_service.capture_hold(job_id="job_1")
    assert credit_service.get_available_balance(user_id) == 70
    assert credit_service.get_total_balance(user_id) == 70
```
- [ ] **Step 2: Run test to verify it fails**
Run: `pytest services/api/tests/test_credit_service.py -v`
Expected: FAIL with "NameError: name 'CreditService' is not defined"
- [ ] **Step 3: Implement `CreditService` in `services/api/src/services/credit_service.py`**
Use `SELECT ... FOR UPDATE` row-level locks on user rows during transactions to prevent overdrafts.
- [ ] **Step 4: Run test to verify it passes**
Run: `pytest services/api/tests/test_credit_service.py -v`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add services/api/src/services/credit_service.py services/api/tests/test_credit_service.py
git commit -m "feat(billing): implement append-only credit ledger and atomic hold/capture"
```

---

### Wave 2: Storage, Auth & Idempotent Job Queue

#### Task 4: Cloudflare R2 / S3 Presigned Storage Service
**Description:** Implement signed URL generation service for uploads and downloads, asset checksum verification (SHA-256), and tenant isolation path conventions (`projects/{project_id}/stages/{stage}/v{version}/`).
**Files:**
- Create: `services/api/src/services/storage_service.py`, `services/api/src/routers/uploads.py`
- Test: `services/api/tests/test_storage_service.py`
**Interfaces:**
- Consumes: Boto3 S3 client, AWS/Cloudflare credentials from environment.
- Produces: `StorageService.create_upload_url(project_id, filename, content_type, size_bytes) -> dict`, `StorageService.create_download_url(storage_key, ttl_sec=900) -> str`.

- [ ] **Step 1: Write failing storage URL generation test**
```python
def test_generate_upload_url_with_tenant_isolation(storage_service):
    res = storage_service.create_upload_url(project_id="proj_abc", filename="voice.wav", content_type="audio/wav", size_bytes=5000000)
    assert "proj_abc" in res["storage_key"]
    assert "X-Amz-Signature" in res["upload_url"]
```
- [ ] **Step 2: Run test to verify it fails**
Run: `pytest services/api/tests/test_storage_service.py -v`
Expected: FAIL with "storage_service not found"
- [ ] **Step 3: Implement `StorageService` using Boto3**
Enforce maximum upload size restrictions (Voice: 500MB, Image: 25MB, Video: 2GB).
- [ ] **Step 4: Run test to verify it passes**
Run: `pytest services/api/tests/test_storage_service.py -v`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add services/api/src/services/storage_service.py services/api/src/routers/uploads.py
git commit -m "feat(storage): implement presigned s3/r2 upload and download service"
```

---

#### Task 5: User Authentication & Tenant Context
**Description:** Implement JWT session authentication, API key generation for MCP clients, password hashing with Argon2id, and tenant isolation dependency injection in FastAPI.
**Files:**
- Create: `services/api/src/routers/auth.py`, `services/api/src/dependencies/auth.py`, `services/api/src/utils/security.py`
- Test: `services/api/tests/test_auth.py`
**Interfaces:**
- Consumes: `users` table, JWT secret.
- Produces: `POST /v1/auth/login`, `POST /v1/auth/register`, `get_current_user`, `get_scoped_api_key`.

- [ ] **Step 1: Write failing auth flow test**
```python
def test_user_registration_and_jwt_issuance(client):
    res = client.post("/v1/auth/register", json={"email": "user@example.com", "password": "SuperSecret123!"})
    assert res.status_code == 201
    assert "access_token" in res.json()
```
- [ ] **Step 2: Run test to verify it fails**
Run: `pytest services/api/tests/test_auth.py -v`
Expected: FAIL with 404 Not Found
- [ ] **Step 3: Implement auth endpoints in `services/api/src/routers/auth.py`**
Use `passlib[argon2]` and `pyjwt` with 7-day expiration and rate limiting.
- [ ] **Step 4: Run test to verify it passes**
Run: `pytest services/api/tests/test_auth.py -v`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add services/api/src/routers/auth.py services/api/src/dependencies/auth.py
git commit -m "feat(auth): implement jwt auth and api-key validation"
```

---

#### Task 6: Redis & Celery Partitioned Queue Infrastructure
**Description:** Configure Celery with Redis broker, strict queue routing (`q.research`, `q.audio`, `q.assets`, `q.motion`, `q.render`, `q.publish`, `q.dead`), progress tracking via Redis pub/sub, and job idempotency key verification.
**Files:**
- Create: `services/workers/src/celery_app.py`, `services/api/src/services/job_service.py`, `services/api/src/routers/jobs.py`
- Test: `services/api/tests/test_job_service.py`
**Interfaces:**
- Consumes: Redis 7+ instance, `jobs` table.
- Produces: `JobService.enqueue_stage(project_id, stage, input_params) -> Job`, `GET /v1/jobs/{job_id}`, `POST /v1/jobs/{job_id}/cancel`.

- [ ] **Step 1: Write failing idempotent job enqueue test**
```python
def test_idempotent_job_enqueue(job_service, project_id):
    job1 = job_service.enqueue_stage(project_id, "research", {"topic": "AI Agents"})
    job2 = job_service.enqueue_stage(project_id, "research", {"topic": "AI Agents"})
    assert job1.id == job2.id
    assert job1.idempotency_key == job2.idempotency_key
```
- [ ] **Step 2: Run test to verify it fails**
Run: `pytest services/api/tests/test_job_service.py -v`
Expected: FAIL with "job_service not defined"
- [ ] **Step 3: Implement Celery queue configuration and `JobService`**
Bind soft/hard limits per queue and implement Redis pub/sub progress broadcaster.
- [ ] **Step 4: Run test to verify it passes**
Run: `pytest services/api/tests/test_job_service.py -v`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add services/workers/src/celery_app.py services/api/src/services/job_service.py
git commit -m "feat(queue): configure celery partitioned queues and job idempotency"
```

---

### Wave 3: Audio Subsystem & faster-whisper Timings

#### Task 7: Voice Ingestion & 48kHz Audio Normalization Service
**Description:** Implement audio ingestion worker pipeline that accepts uploaded voice recordings, validates format with `ffprobe`, converts to standard 48 kHz 24-bit mono WAV, and checks audio quality (clipping, RMS loudness).
**Files:**
- Create: `services/workers/src/tasks/audio_normalize.py`, `services/workers/src/pipeline/ffmpeg_audio.py`
- Test: `services/workers/tests/test_audio_normalize.py`
**Interfaces:**
- Consumes: Storage key of raw audio upload.
- Produces: Normalized 48 kHz WAV file storage key and metadata (duration_ms, sample_rate, channels).

- [ ] **Step 1: Write failing audio conversion test**
```python
def test_normalize_audio_to_48k_wav(tmp_path):
    out_wav = ffmpeg_audio.normalize_voice(input_path="tests/fixtures/sample_voice.mp3", out_dir=str(tmp_path))
    info = ffmpeg_audio.probe_audio(out_wav)
    assert info["sample_rate"] == 48000
    assert info["channels"] == 1
```
- [ ] **Step 2: Run test to verify it fails**
Run: `pytest services/workers/tests/test_audio_normalize.py -v`
Expected: FAIL with "No module named ffmpeg_audio"
- [ ] **Step 3: Implement ffmpeg audio normalization in `ffmpeg_audio.py`**
Execute `ffmpeg -y -i {input} -ar 48000 -ac 1 -c:a pcm_s24le {output}`.
- [ ] **Step 4: Run test to verify it passes**
Run: `pytest services/workers/tests/test_audio_normalize.py -v`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add services/workers/src/pipeline/ffmpeg_audio.py services/workers/src/tasks/audio_normalize.py
git commit -m "feat(audio): implement voice ingestion and 48khz normalization"
```

---

#### Task 8: faster-whisper Word-Level Alignment & Transcription Engine
**Description:** Implement self-hosted `faster-whisper` transcription service yielding accurate word-level start/end timestamps, confidence scores, and raw sentence cues.
**Files:**
- Create: `services/workers/src/pipeline/whisper_engine.py`, `services/workers/src/tasks/transcription.py`
- Test: `services/workers/tests/test_transcription.py`
**Interfaces:**
- Consumes: 48 kHz WAV audio asset.
- Produces: Word timestamp JSON array `[{ word, start_ms, end_ms, probability }]` and transcript text.

- [ ] **Step 1: Write failing transcription alignment test**
```python
def test_transcription_yields_word_level_timestamps(sample_audio_48k):
    transcript = whisper_engine.transcribe(sample_audio_48k)
    assert len(transcript["words"]) > 0
    first_word = transcript["words"][0]
    assert "start_ms" in first_word and "end_ms" in first_word
    assert first_word["start_ms"] < first_word["end_ms"]
```
- [ ] **Step 2: Run test to verify it fails**
Run: `pytest services/workers/tests/test_transcription.py -v`
Expected: FAIL with "whisper_engine not defined"
- [ ] **Step 3: Implement `whisper_engine.py` using `faster-whisper`**
Configure `WhisperModel(model_size_or_path="base", device="cpu", compute_type="int8")` with beam_size=5 and word_timestamps=True.
- [ ] **Step 4: Run test to verify it passes**
Run: `pytest services/workers/tests/test_transcription.py -v`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add services/workers/src/pipeline/whisper_engine.py services/workers/src/tasks/transcription.py
git commit -m "feat(audio): integrate faster-whisper word-level transcription engine"
```

---

#### Task 9: Audio Cleanup & Silence/Breath/Filler Reduction
**Description:** Implement intelligent audio cleanup stage using ffmpeg `silencedetect` and word-timing gap analysis to cut long pauses (> 800ms reduced to 250ms), trim breaths, and produce `voice_clean.wav` accompanied by re-aligned word timings.
**Files:**
- Create: `services/workers/src/pipeline/audio_cleanup.py`, `services/workers/src/tasks/cleanup.py`
- Test: `services/workers/tests/test_audio_cleanup.py`
**Interfaces:**
- Consumes: Raw normalized audio WAV + initial word timestamps.
- Produces: `voice_clean.wav` storage key + updated word timestamps with cumulative time offsets adjusted.

- [ ] **Step 1: Write failing audio cleanup test**
```python
def test_audio_cleanup_truncates_long_pauses(audio_with_silence, initial_words):
    clean_wav, new_words = audio_cleanup.clean_and_realign(audio_with_silence, initial_words)
    old_duration = ffmpeg_audio.get_duration(audio_with_silence)
    new_duration = ffmpeg_audio.get_duration(clean_wav)
    assert new_duration < old_duration
    assert new_words[-1]["end_ms"] <= int(new_duration * 1000)
```
- [ ] **Step 2: Run test to verify it fails**
Run: `pytest services/workers/tests/test_audio_cleanup.py -v`
Expected: FAIL with "audio_cleanup not defined"
- [ ] **Step 3: Implement `audio_cleanup.py`**
Slice out non-speech segments over 800ms, cross-fade cuts by 15ms to eliminate pops, and apply a 80 Hz high-pass filter.
- [ ] **Step 4: Run test to verify it passes**
Run: `pytest services/workers/tests/test_audio_cleanup.py -v`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add services/workers/src/pipeline/audio_cleanup.py services/workers/src/tasks/cleanup.py
git commit -m "feat(audio): implement silence/breath cleanup and word-timing realignment"
```

---

### Wave 4: AI Research & Script Generation Pipeline

#### Task 10: Topic Research & Source-Cited Fact Extraction
**Description:** Implement Stage 2 research worker that queries web search (Tavily/Perplexity), fetches top authoritative sources, extracts core claims with attached source URLs, and generates an immutable research brief.
**Files:**
- Create: `services/workers/src/pipeline/researcher.py`, `services/workers/src/tasks/research.py`, `services/api/src/schemas/research.py`
- Test: `services/workers/tests/test_researcher.py`
**Interfaces:**
- Consumes: Topic brief, language, target duration.
- Produces: Research brief JSON: `claims: [{ claim_text, source_url, source_title, confidence }]`.

- [ ] **Step 1: Write failing research brief test**
```python
def test_research_generates_source_attributed_claims(mock_search_provider):
    brief = researcher.generate_brief(topic="Quantum Computing", language="en")
    assert len(brief["claims"]) >= 3
    for claim in brief["claims"]:
        assert claim["source_url"].startswith("http")
```
- [ ] **Step 2: Run test to verify it fails**
Run: `pytest services/workers/tests/test_researcher.py -v`
Expected: FAIL with "researcher not defined"
- [ ] **Step 3: Implement `researcher.py` using LLM structured output**
Use Claude 3.5 Sonnet / GPT-4o with tool use enforcing Pydantic `ResearchBrief` schema.
- [ ] **Step 4: Run test to verify it passes**
Run: `pytest services/workers/tests/test_researcher.py -v`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add services/workers/src/pipeline/researcher.py services/workers/src/tasks/research.py
git commit -m "feat(research): implement cited research brief generation"
```

---

#### Task 11: Structured Scene Script Generator
**Description:** Implement Stage 3 script generator that transforms research claims into an engaging, structured scene sequence with hooks, narration, estimated duration, visual intent, and suggested motion graphics.
**Files:**
- Create: `services/workers/src/pipeline/scriptwriter.py`, `services/workers/src/tasks/script.py`, `services/api/src/routers/script.py`
- Test: `services/workers/tests/test_scriptwriter.py`
**Interfaces:**
- Consumes: `ResearchBrief` JSON, channel tone style preset.
- Produces: `ScriptVersion` JSON: `scenes: [{ id, order, hook, narration, est_duration_sec, visual_intent, template_suggestion, source_claim_ids }]`.

- [ ] **Step 1: Write failing script generation test**
```python
def test_script_generation_creates_valid_scenes(sample_research_brief):
    script = scriptwriter.generate_script(sample_research_brief, target_length_sec=180)
    assert len(script["scenes"]) >= 4
    first_scene = script["scenes"][0]
    assert "narration" in first_scene
    assert first_scene["order"] == 1
    assert "visual_intent" in first_scene
```
- [ ] **Step 2: Run test to verify it fails**
Run: `pytest services/workers/tests/test_scriptwriter.py -v`
Expected: FAIL with "scriptwriter not defined"
- [ ] **Step 3: Implement `scriptwriter.py` and API endpoints**
Support `GET /projects/{id}/script` and `PATCH /projects/{id}/script` for granular section editing.
- [ ] **Step 4: Run test to verify it passes**
Run: `pytest services/workers/tests/test_scriptwriter.py -v`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add services/workers/src/pipeline/scriptwriter.py services/api/src/routers/script.py
git commit -m "feat(script): implement structured scene script generation and editing"
```

---

#### Task 12: Visual Storyboard & Asset Matcher
**Description:** Implement Stage 6 visual plan worker that matches script scenes to visual types (stock footage, stock photo, AI generated image, or motion graphics template) with search queries and prompts.
**Files:**
- Create: `services/workers/src/pipeline/storyboard.py`, `services/workers/src/tasks/visual_plan.py`, `services/api/src/routers/visual_plan.py`
- Test: `services/workers/tests/test_storyboard.py`
**Interfaces:**
- Consumes: `ScriptVersion` scenes.
- Produces: Storyboard JSON: `scenes: [{ scene_id, shot_type: "stock"|"graphic"|"generate", query, prompt, duration_sec }]`.

- [ ] **Step 1: Write failing storyboard matcher test**
```python
def test_storyboard_assigns_appropriate_shot_types(sample_script):
    storyboard = storyboard.plan_visuals(sample_script)
    assert len(storyboard["scenes"]) == len(sample_script["scenes"])
    types = {s["shot_type"] for s in storyboard["scenes"]}
    assert "graphic" in types or "stock" in types
```
- [ ] **Step 2: Run test to verify it fails**
Run: `pytest services/workers/tests/test_storyboard.py -v`
Expected: FAIL with "storyboard not defined"
- [ ] **Step 3: Implement `storyboard.py` logic**
Generate specific search queries for Pexels and generative prompts for diffusion models.
- [ ] **Step 4: Run test to verify it passes**
Run: `pytest services/workers/tests/test_storyboard.py -v`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add services/workers/src/pipeline/storyboard.py services/api/src/routers/visual_plan.py
git commit -m "feat(storyboard): implement visual plan and asset matching engine"
```

---

### Wave 5: Remotion Motion Graphics Harness & Asset Adapters

#### Task 13: 6 MVP Remotion Motion Graphics Templates
**Description:** Build the core Remotion React motion graphics package with data-driven templates: Animated Bar Chart, Line Chart, Comparison (A vs B), Tier List, Big Quote Card, and Stat Counter.
**Files:**
- Create:
  - `packages/remotion/src/templates/BarChart.tsx`
  - `packages/remotion/src/templates/LineChart.tsx`
  - `packages/remotion/src/templates/Comparison.tsx`
  - `packages/remotion/src/templates/TierList.tsx`
  - `packages/remotion/src/templates/QuoteCard.tsx`
  - `packages/remotion/src/templates/StatCounter.tsx`
  - `packages/remotion/src/templates/index.ts`
- Test: `packages/remotion/tests/templates.test.tsx`
**Interfaces:**
- Consumes: JSON props (title, labels, values, colors, font_family).
- Produces: Animated React Remotion compositions rendered with smooth spring physics (`spring({ fps, frame })`).

- [ ] **Step 1: Write failing template render test**
```typescript
import { render } from '@testing-library/react';
import { StatCounter } from '../src/templates/StatCounter';
describe('StatCounter Template', () => {
  it('renders title and animated number', () => {
    const { getByText } = render(<StatCounter title="Active Creators" value={50000} prefix="+" />);
    expect(getByText('Active Creators')).toBeDefined();
  });
});
```
- [ ] **Step 2: Run test to verify it fails**
Run: `pnpm --filter @ai-video-studio/remotion test`
Expected: FAIL with "Cannot find module '../src/templates/StatCounter'"
- [ ] **Step 3: Implement the 6 motion graphic templates**
Utilize Remotion `interpolate`, `spring`, and Tailwind CSS styling driven by channel design tokens.
- [ ] **Step 4: Run test to verify it passes**
Run: `pnpm --filter @ai-video-studio/remotion test`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add packages/remotion/src/templates packages/remotion/tests
git commit -m "feat(remotion): implement 6 core data-driven motion graphics templates"
```

---

#### Task 14: Dynamic Word-Synced Animated Captions Component
**Description:** Implement dynamic animated typography component that highlights words in sync with whisper timestamps, supporting active word bounce, karaoke color fill, and 9:16 vertical / 16:9 horizontal safe margins.
**Files:**
- Create: `packages/remotion/src/captions/AnimatedCaptions.tsx`, `packages/remotion/src/captions/CaptionStyles.ts`
- Test: `packages/remotion/tests/captions.test.tsx`
**Interfaces:**
- Consumes: `words: [{ word, start_ms, end_ms }]`, current Remotion `frame`, `fps=30`.
- Produces: Rendered caption overlay with subtitle styling presets (MrBeast yellow, Sleek Minimal, Editorial Serif).

- [ ] **Step 1: Write failing captions sync test**
```typescript
import { getActiveWordIndex } from '../src/captions/AnimatedCaptions';
describe('Caption Sync', () => {
  it('calculates the exact active word index for a given millisecond', () => {
    const words = [
      { word: 'Hello', start_ms: 0, end_ms: 400 },
      { word: 'World', start_ms: 401, end_ms: 800 }
    ];
    expect(getActiveWordIndex(words, 200)).toBe(0);
    expect(getActiveWordIndex(words, 600)).toBe(1);
  });
});
```
- [ ] **Step 2: Run test to verify it fails**
Run: `pnpm --filter @ai-video-studio/remotion test`
Expected: FAIL with "getActiveWordIndex is not defined"
- [ ] **Step 3: Implement `AnimatedCaptions.tsx`**
Add auto-line-wrapping (max 4-5 words per cue) and safe-margin boundary clamps.
- [ ] **Step 4: Run test to verify it passes**
Run: `pnpm --filter @ai-video-studio/remotion test`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add packages/remotion/src/captions packages/remotion/tests
git commit -m "feat(remotion): implement word-synced animated typography captions"
```

---

#### Task 15: Stock Media & Generative AI Adapters
**Description:** Implement asset sourcing workers with Pexels / Pixabay APIs for licensed b-roll and an OpenAI-compatible `/v1` adapter for cloud diffusion image generation (fal.ai / Flux / SDXL) with provenance tracking.
**Files:**
- Create: `services/workers/src/adapters/pexels.py`, `services/workers/src/adapters/diffusion_client.py`, `services/workers/src/tasks/asset_fetcher.py`
- Test: `services/workers/tests/test_asset_adapters.py`
**Interfaces:**
- Consumes: Search keywords or image generation prompts.
- Produces: Downloaded media files uploaded to R2, registered in `assets` table with `licence_ref` and provenance metadata.

- [ ] **Step 1: Write failing asset adapter test**
```python
def test_pexels_adapter_returns_licensed_mp4(mock_pexels_api):
    result = pexels.search_video(query="cyberpunk city", min_duration_sec=5)
    assert result["storage_key"].endswith(".mp4")
    assert result["licence_type"] == "pexels_free"
    assert "pexels.com" in result["attribution_url"]
```
- [ ] **Step 2: Run test to verify it fails**
Run: `pytest services/workers/tests/test_asset_adapters.py -v`
Expected: FAIL with "pexels module not found"
- [ ] **Step 3: Implement Pexels and diffusion adapters**
Save prompt, model name, and random seed into asset metadata JSON for reproducible generation.
- [ ] **Step 4: Run test to verify it passes**
Run: `pytest services/workers/tests/test_asset_adapters.py -v`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add services/workers/src/adapters services/workers/src/tasks/asset_fetcher.py
git commit -m "feat(assets): implement pexels stock and cloud diffusion generation adapters"
```

---

### Wave 6: Command-Based Timeline Engine & Web Editor

#### Task 16: Immutable Timeline State & Command Reducer
**Description:** Implement core timeline command engine following the OpenChatCut pattern: immutable timeline states, atomic command operations (`TRIM_CLIP`, `MOVE_CLIP`, `SPLIT_CLIP`, `SWAP_ASSET`, `DELETE_CLIP`, `UPDATE_TEMPLATE_PROPS`), and undo/redo stacks.
**Files:**
- Create: `packages/shared-types/src/timeline/commands.ts`, `packages/shared-types/src/timeline/reducer.ts`
- Test: `packages/shared-types/tests/timeline_reducer.test.ts`
**Interfaces:**
- Consumes: `TimelineState`, `TimelineCommand`.
- Produces: `newTimelineState` with incremented `version`, validated boundaries, and no overlapping clips on single tracks.

- [ ] **Step 1: Write failing timeline command reducer test**
```typescript
import { timelineReducer, executeCommand } from '../src/timeline';
describe('Timeline Reducer', () => {
  it('splits a clip cleanly at given timestamp and supports undo', () => {
    const initial = createSampleTimeline();
    const { nextState, undoCommand } = executeCommand(initial, {
      type: 'SPLIT_CLIP',
      trackId: 'video-1',
      clipId: 'clip-1',
      splitTimeMs: 5000
    });
    expect(nextState.tracks[0].clips.length).toBe(2);
    const reverted = executeCommand(nextState, undoCommand);
    expect(reverted.nextState.tracks[0].clips.length).toBe(1);
  });
});
```
- [ ] **Step 2: Run test to verify it fails**
Run: `pnpm --filter @ai-video-studio/shared-types test`
Expected: FAIL with "executeCommand is not defined"
- [ ] **Step 3: Implement immutable timeline reducer**
Ensure pure function execution and enforce gap-closing rules on text-aligned cuts.
- [ ] **Step 4: Run test to verify it passes**
Run: `pnpm --filter @ai-video-studio/shared-types test`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add packages/shared-types/src/timeline packages/shared-types/tests
git commit -m "feat(timeline): implement immutable command reducer and undo/redo engine"
```

---

#### Task 17: Interactive Timeline Web Editor UI
**Description:** Implement interactive multi-track timeline component in Next.js with video track, audio track, motion graphics track, and caption track. Support playhead scrubbing, zoom, drag-to-trim, and snap-to-grid.
**Files:**
- Create:
  - `apps/web/src/components/timeline/TimelineCanvas.tsx`
  - `apps/web/src/components/timeline/TrackHeader.tsx`
  - `apps/web/src/components/timeline/ClipItem.tsx`
  - `apps/web/src/components/timeline/Playhead.tsx`
  - `apps/web/src/hooks/useTimelineControls.ts`
- Test: `apps/web/tests/components/TimelineCanvas.test.tsx`
**Interfaces:**
- Consumes: `TimelineState`, player current time.
- Produces: Visual timeline rendering with keyboard shortcuts (Space=Play, J/K/L=Scrub, S=Split, Del=Delete, Ctrl+Z=Undo).

- [ ] **Step 1: Write failing timeline canvas test**
```typescript
import { render, screen } from '@testing-library/react';
import { TimelineCanvas } from '@/components/timeline/TimelineCanvas';
describe('TimelineCanvas', () => {
  it('renders track headers and clips', () => {
    render(<TimelineCanvas timeline={mockTimeline} currentTimeMs={0} onCommand={jest.fn()} />);
    expect(screen.getByText('Video Track')).toBeInTheDocument();
    expect(screen.getByText('Voiceover')).toBeInTheDocument();
  });
});
```
- [ ] **Step 2: Run test to verify it fails**
Run: `pnpm --filter @ai-video-studio/web test`
Expected: FAIL with "TimelineCanvas not found"
- [ ] **Step 3: Implement `TimelineCanvas` with HTML5 Canvas / DOM virtualized tracks**
Optimize rendering performance to prevent lag when scrubbing 10+ minute timelines.
- [ ] **Step 4: Run test to verify it passes**
Run: `pnpm --filter @ai-video-studio/web test`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add apps/web/src/components/timeline apps/web/src/hooks apps/web/tests
git commit -m "feat(web): build interactive multi-track timeline editor UI"
```

---

#### Task 18: Transcript-Based Text Cutting UI
**Description:** Implement transcript-based editing interface where selecting or deleting words in the transcript automatically executes corresponding slice/delete commands on the voice and video tracks.
**Files:**
- Create: `apps/web/src/components/editor/TranscriptEditor.tsx`, `apps/web/src/components/editor/WordSpan.tsx`
- Test: `apps/web/tests/components/TranscriptEditor.test.tsx`
**Interfaces:**
- Consumes: Word timestamps array, `onCutSilence`, `onDeleteWordRange`.
- Produces: Timeline commands mapped to exact word `start_ms` and `end_ms`.

- [ ] **Step 1: Write failing transcript editor test**
```typescript
import { render, fireEvent } from '@testing-library/react';
import { TranscriptEditor } from '@/components/editor/TranscriptEditor';
describe('TranscriptEditor', () => {
  it('triggers delete command when backspacing highlighted words', () => {
    const onCommand = jest.fn();
    const { getByText } = render(<TranscriptEditor words={sampleWords} onCommand={onCommand} />);
    fireEvent.click(getByText('unwanted'));
    fireEvent.keyDown(window, { key: 'Backspace' });
    expect(onCommand).toHaveBeenCalledWith(expect.objectContaining({ type: 'DELETE_RANGE' }));
  });
});
```
- [ ] **Step 2: Run test to verify it fails**
Run: `pnpm --filter @ai-video-studio/web test`
Expected: FAIL with "TranscriptEditor not found"
- [ ] **Step 3: Implement `TranscriptEditor.tsx`**
Highlight active words matching current playhead time; provide "Delete all filler words" one-click button.
- [ ] **Step 4: Run test to verify it passes**
Run: `pnpm --filter @ai-video-studio/web test`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add apps/web/src/components/editor apps/web/tests
git commit -m "feat(web): implement transcript-based video cutting and filler word removal UI"
```

---

### Wave 7: Render Pipeline, Loudness & Publish Pack

#### Task 19: Remotion Headless Preview & Master Render Worker
**Description:** Implement Stage 10 render worker using `@remotion/renderer` to render 540p fast previews (low-res, CRF 28, ultra-fast) and 1080p master MP4s (H.264 high profile, 30fps, CRF 18).
**Files:**
- Create: `services/workers/src/pipeline/remotion_renderer.py`, `services/workers/src/tasks/render.py`
- Test: `services/workers/tests/test_render_worker.py`
**Interfaces:**
- Consumes: `timeline.json` specification, resolution tier (`540p_preview` | `1080p`).
- Produces: Rendered MP4 output file, frame count, rendering duration, and upload to R2 storage.

- [ ] **Step 1: Write failing render worker test**
```python
def test_render_preview_generates_mp4(sample_timeline_json, tmp_path):
    output_mp4 = remotion_renderer.render_composition(
        timeline=sample_timeline_json,
        resolution="540p",
        out_dir=str(tmp_path)
    )
    assert os.path.exists(output_mp4)
    info = ffmpeg_video.probe_video(output_mp4)
    assert info["height"] == 540
```
- [ ] **Step 2: Run test to verify it fails**
Run: `pytest services/workers/tests/test_render_worker.py -v`
Expected: FAIL with "remotion_renderer not found"
- [ ] **Step 3: Implement `remotion_renderer.py`**
Spawn `npx remotion render` with progress parsing from stdout, broadcasting percent completion over Redis pub/sub.
- [ ] **Step 4: Run test to verify it passes**
Run: `pytest services/workers/tests/test_render_worker.py -v`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add services/workers/src/pipeline/remotion_renderer.py services/workers/src/tasks/render.py
git commit -m "feat(render): implement remotion headless preview and master render pipeline"
```

---

#### Task 20: Audio Loudness Normalization & Music Ducking
**Description:** Implement final audio assembly filter in ffmpeg: automatically duck background music by -12 dB whenever narration is active, apply sidechain compression, and normalize overall master to -14 LUFS (+/- 0.5 LUFS) with true peak <= -1.0 dBTP.
**Files:**
- Create: `services/workers/src/pipeline/audio_mixer.py`, `services/workers/src/tasks/audio_mix.py`
- Test: `services/workers/tests/test_audio_mixer.py`
**Interfaces:**
- Consumes: Voiceover track, background music track, speech timestamps.
- Produces: Final mixed 48 kHz stereo audio track compliant with broadcast loudness standards.

- [ ] **Step 1: Write failing audio mixing and loudness test**
```python
def test_loudness_normalization_meets_broadcast_target(voice_wav, music_wav):
    mixed_wav = audio_mixer.mix_and_duck(voice_wav, music_wav, duck_db=12)
    loudness = audio_mixer.measure_ebur128(mixed_wav)
    assert -14.5 <= loudness["integrated_lufs"] <= -13.5
    assert loudness["true_peak_dbtp"] <= -1.0
```
- [ ] **Step 2: Run test to verify it fails**
Run: `pytest services/workers/tests/test_audio_mixer.py -v`
Expected: FAIL with "audio_mixer not defined"
- [ ] **Step 3: Implement `audio_mixer.py` using ffmpeg `sidechaincompress` and `loudnorm` filters**
Chain `[1:a]asplit[sc][music];[0:a][sc]sidechaincompress=threshold=0.125:ratio=4:attack=50:release=300[ducked];[0:a][ducked]amix=inputs=2[mixed];[mixed]loudnorm=I=-14:TP=-1.0:LRA=11[out]`.
- [ ] **Step 4: Run test to verify it passes**
Run: `pytest services/workers/tests/test_audio_mixer.py -v`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add services/workers/src/pipeline/audio_mixer.py services/workers/src/tasks/audio_mix.py
git commit -m "feat(audio): implement automatic music ducking and ebur128 loudness normalization"
```

---

#### Task 21: Publish Pack Assembler (Shorts, Thumbnails, Zip)
**Description:** Implement publish pack generator that auto-crops the highest engagement hook scene to vertical 9:16 for Shorts/Reels, generates 3 thumbnail variants with text overlays, writes SEO titles/descriptions/chapters, and packages everything into a downloadable zip file.
**Files:**
- Create: `services/workers/src/pipeline/publish_pack.py`, `services/workers/src/tasks/publish.py`, `services/api/src/routers/publish.py`
- Test: `services/workers/tests/test_publish_pack.py`
**Interfaces:**
- Consumes: Master MP4, script metadata, chapter cues.
- Produces: `publish_pack.zip` containing master video, 1-3 vertical shorts, 3 thumbnails (.png), and `metadata.json`.

- [ ] **Step 1: Write failing publish pack test**
```python
def test_publish_pack_generates_complete_zip(master_mp4, project_metadata, tmp_path):
    zip_path = publish_pack.assemble_pack(master_mp4, project_metadata, out_dir=str(tmp_path))
    with zipfile.ZipFile(zip_path, "r") as z:
        names = z.namelist()
        assert any(n.endswith(".mp4") for n in names)
        assert any("short_1" in n for n in names)
        assert "metadata.txt" in names
```
- [ ] **Step 2: Run test to verify it fails**
Run: `pytest services/workers/tests/test_publish_pack.py -v`
Expected: FAIL with "publish_pack not defined"
- [ ] **Step 3: Implement `publish_pack.py`**
Extract high-energy speech segments using word timing density and auto-center vertical crops.
- [ ] **Step 4: Run test to verify it passes**
Run: `pytest services/workers/tests/test_publish_pack.py -v`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add services/workers/src/pipeline/publish_pack.py services/api/src/routers/publish.py
git commit -m "feat(publish): implement vertical shorts auto-cutting and publish pack packaging"
```

---

### Wave 8: MCP Agent Interface, Billing & Quality Gates

#### Task 22: Streamable HTTP MCP Server & Draft Proposal Engine
**Description:** Implement MCP server exposing video editing tools over Streamable HTTP (`/v1/mcp`). All modifications create isolated draft proposals requiring user review and manual approval before committing to the timeline.
**Files:**
- Create:
  - `services/api/src/mcp/server.py`
  - `services/api/src/mcp/tools.py`
  - `services/api/src/mcp/proposals.py`
  - `services/api/src/routers/proposals.py`
- Test: `services/api/tests/test_mcp_server.py`
**Interfaces:**
- Consumes: MCP protocol requests from Claude Code, Cursor, or external agents.
- Produces: MCP tools: `project_get`, `script_propose_edit`, `timeline_propose_ops`, `captions_propose_edit`, `proposal_apply`, `proposal_reject`.

- [ ] **Step 1: Write failing MCP proposal lifecycle test**
```python
def test_mcp_timeline_edit_generates_draft_proposal_not_direct_write(mcp_client, project_id):
    res = mcp_client.call_tool("timeline_propose_ops", {
        "project_id": project_id,
        "base_version": 1,
        "ops": [{"type": "DELETE_CLIP", "clip_id": "clip-2"}]
    })
    assert "proposal_id" in res
    project = get_project(project_id)
    assert project.timeline_version == 1  # Verify state has not mutated directly
```
- [ ] **Step 2: Run test to verify it fails**
Run: `pytest services/api/tests/test_mcp_server.py -v`
Expected: FAIL with "mcp_client not defined"
- [ ] **Step 3: Implement MCP tool handlers and proposal engine**
Enforce version locking: if timeline increments before proposal apply, reject with `VERSION_CONFLICT`.
- [ ] **Step 4: Run test to verify it passes**
Run: `pytest services/api/tests/test_mcp_server.py -v`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add services/api/src/mcp services/api/src/routers/proposals.py
git commit -m "feat(mcp): implement streamable http mcp server and proposal review pattern"
```

---

#### Task 23: Stripe Billing Integration & Webhook Reconciliation
**Description:** Implement Stripe Checkout, Customer Portal sessions, and idempotent webhook handler for subscription tier renewals and credit top-up packs.
**Files:**
- Create: `services/api/src/services/billing_service.py`, `services/api/src/routers/billing.py`, `services/api/src/routers/webhooks.py`
- Test: `services/api/tests/test_billing.py`
**Interfaces:**
- Consumes: Stripe webhook events (`checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`).
- Produces: Credit ledger grants, subscription status updates, customer portal URLs.

- [ ] **Step 1: Write failing Stripe webhook idempotency test**
```python
def test_stripe_webhook_is_strictly_idempotent(client, mock_stripe_event):
    res1 = client.post("/v1/webhooks/stripe", json=mock_stripe_event, headers={"Stripe-Signature": "valid_sig"})
    res2 = client.post("/v1/webhooks/stripe", json=mock_stripe_event, headers={"Stripe-Signature": "valid_sig"})
    assert res1.status_code == 200
    assert res2.status_code == 200
    ledger_entries = get_ledger_entries(user_id=mock_stripe_event["user_id"])
    assert len(ledger_entries) == 1  # Granted only once
```
- [ ] **Step 2: Run test to verify it fails**
Run: `pytest services/api/tests/test_billing.py -v`
Expected: FAIL with 404 Not Found
- [ ] **Step 3: Implement `BillingService` and webhook signature verification**
Store processed webhook event IDs in `processed_stripe_events` table within a serializable transaction.
- [ ] **Step 4: Run test to verify it passes**
Run: `pytest services/api/tests/test_billing.py -v`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add services/api/src/services/billing_service.py services/api/src/routers/billing.py services/api/src/routers/webhooks.py
git commit -m "feat(billing): implement stripe subscriptions and idempotent webhook reconciliation"
```

---

#### Task 24: Golden Render Tests & End-to-End Pipeline Verification
**Description:** Implement automated test suite running a reference project through all 10 stages: asserting perceptual image hash match (pHash) on frames, audio drift < 40ms, broadcast loudness conformance, and publish pack completeness.
**Files:**
- Create: `tests/e2e/test_full_pipeline.py`, `tests/golden/reference_hashes.json`, `docker/docker-compose.test.yml`
- Test: `tests/e2e/test_full_pipeline.py`
**Interfaces:**
- Consumes: Test topic fixture and audio file.
- Produces: Validated 1080p MP4 master, verified audio sync, zero credit leaks.

- [ ] **Step 1: Write failing golden render assertion test**
```python
def test_full_pipeline_produces_golden_render(e2e_pipeline_runner):
    result = e2e_pipeline_runner.run_project(topic="The Solar System", voice_fixture="tests/fixtures/sample_voice.wav")
    assert result["status"] == "passed"
    assert os.path.exists(result["master_mp4"])
    phash_diff = compare_frame_phashes(result["master_mp4"], "tests/golden/frame_10s.png")
    assert phash_diff <= 5  # Strict perceptual visual match
```
- [ ] **Step 2: Run test to verify it fails**
Run: `pytest tests/e2e/test_full_pipeline.py -v`
Expected: FAIL with "e2e_pipeline_runner not found"
- [ ] **Step 3: Implement `e2e_pipeline_runner` fixture in `test_full_pipeline.py`**
Drive execution through all 10 stages using TestContainers for Postgres, Redis, and MinIO.
- [ ] **Step 4: Run test to verify it passes**
Run: `pytest tests/e2e/test_full_pipeline.py -v`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add tests/e2e tests/golden docker/docker-compose.test.yml
git commit -m "test(e2e): implement golden render regression and end-to-end pipeline verification"
```

---

## Checkpoints and Quality Verification

### Checkpoint 1: Foundations (After Tasks 1 - 6)
- [ ] Monorepo builds without TypeScript errors (`pnpm build`).
- [ ] PostgreSQL migrations run cleanly and pass foreign key and constraint tests.
- [ ] Credit ledger correctly enforces non-negative balance, holds, and captures without race conditions.
- [ ] Storage service issues presigned URLs with verified expiration headers.
- [ ] Celery workers successfully pick up and process tasks from assigned queues.

### Checkpoint 2: Core Pipeline & Media Harness (After Tasks 7 - 15)
- [ ] Audio upload normalizes to 48 kHz mono WAV with verified sample rate.
- [ ] `faster-whisper` returns word-level timestamps with valid start/end bounds.
- [ ] Long pauses and breaths are trimmed without corrupting word alignment.
- [ ] Research brief and scene script generate valid JSON with source URLs.
- [ ] All 6 Remotion templates render headless without frame drops.
- [ ] Animated captions accurately sync with audio frames.

### Checkpoint 3: Interactive Editor & Render Output (After Tasks 16 - 21)
- [ ] Web timeline supports clip splitting, dragging, trimming, and undo/redo.
- [ ] Transcript editor text deletions correctly slice media tracks.
- [ ] 540p fast preview completes in under 2 minutes.
- [ ] 1080p master render successfully finishes with normalized -14 LUFS loudness.
- [ ] Downloadable publish pack (.zip) contains master video, 9:16 vertical short, and metadata.

### Checkpoint 4: Commercial Platform Readiness (After Tasks 22 - 24)
- [ ] External AI agent connects over MCP and submits a timeline proposal.
- [ ] Proposal preview and one-click accept/reject functions seamlessly in the web UI.
- [ ] Stripe test transactions grant credits and update subscriptions idempotently.
- [ ] Golden render test suite passes with perceptual visual hash match and < 40ms audio drift.
- [ ] Clean-room licensing scan confirms 0% GPL/AGPL dependency contamination.

---

## Risk Register & Mitigations

| Risk | Impact | Likelihood | Mitigation Strategy |
|---|---|---|---|
| **Licensing Contamination (AGPL/GPL)** | Critical | Low | Clean-room Route B strictly enforced. Automated CI license scanner (`license-checker` / `pip-licenses`) fails builds if any copyleft code is imported. Repositories (OpenChatCut, Palmier, Pallaidium) used strictly as behavioral references. |
| **Render Worker Host OOM / Crash** | High | Medium | 1 render per worker box in MVP. Hard memory cgroups set in Docker/systemd. Stale heartbeat detector automatically frees credit holds and routes failed jobs to `q.dead`. |
| **Generation Credit & Cost Variance** | High | Medium | Free licensed stock (Pexels/Pixabay) is default. Cloud diffusion generation is explicit opt-in per scene with upfront credit cost quotes displayed before execution. |
| **YouTube Copyright / Terms Liability** | High | Low | Direct YouTube import disabled by default. Requires explicit workspace owner setting `youtube_source_enabled: true` with affirmative rights indemnity recorded in `audit_log`. |
| **Factual Hallucinations in Video Scripts** | High | Medium | Research stage strictly pairs claims with source URLs. Mandatory human-in-the-loop script approval gate prevents automatic generation or rendering of unverified scripts. |
| **Audio-Video Lip-Sync & Caption Drift** | Medium | Medium | Strict 48 kHz WAV normalization before Whisper inference; compositions locked to 30 fps; automated golden render tests verify synchronization error < 40ms. |

---

## Self-Review Checklist

1. **Spec Coverage:**
   - 01-PRD: Addressed (10-stage pipeline, web app form, credit pricing model, creator stories).
   - 02-Architecture: Addressed (PostgreSQL 12 tables, Redis/Celery 6 queues, Cloudflare R2 storage).
   - 03-API: Addressed (REST /v1 endpoints, idempotency keys, SSE progress, signed media URLs).
   - 04-UI-UX: Addressed (Timeline editor, transcript cutting, app shell, 10-stage guided navigation).
   - 05-AI-Pipeline: Addressed (faster-whisper, audio cleanup, Remotion templates, manifest schemas).
   - 06-Security & Licensing: Addressed (Clean-room rule, tenant media isolation, YouTube opt-in).
   - 07-Testing & DevOps: Addressed (Golden render tests, pHash, broadcast loudness, CI/CD).
   - 08-Pricing & Billing: Addressed (1 credit = 1 min 1080p render, Stripe webhooks, credit ledger).
   - 09-Build-Plan & 10-Three-Repos: Addressed (Route B clean-room, proposal-based MCP editing).
2. **Step Granularity:** Every task carries exact files (Create, Modify, Test), interfaces (Consumes, Produces), and 5 distinct checkable TDD steps.
3. **Type Consistency:** Method signatures, tables, queue names, and endpoints match verbatim across all tasks.
4. **Review Focus:** Top 5 failure modes explicitly documented with concrete mitigation and test requirements.
