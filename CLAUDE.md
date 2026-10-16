# AGENTS.md — Developer and AI Agent Guidelines for AI Video Studio

Welcome to the AI Video Studio repository. This document defines the architectural rules, coding standards, and operational guidelines that all engineers and agentic assistants must strictly follow.

## 1. Project Overview & Architecture
AI Video Studio is a modern web platform (clean-room Route B) that transforms a topic brief and voiceover into a finished 1080p video, vertical Shorts/Reels, thumbnails, and publish metadata pack across a 10-stage pipeline with an immutable command-based timeline, Remotion motion graphics, and an MCP agent editing interface.

### The 10-Stage Pipeline
1. **Topic Brief** (`/projects`) — Title, topic, target length, language, channel preset.
2. **Research Brief** (`/research`) — Web search (Tavily/Perplexity), claims extracted with source URLs.
3. **Scene Script** (`/script`) — Structured JSON scene sequence (hook, narration, visual intent).
4. **Voice Track** (`/voice`) — Audio recording upload or cloud TTS (ElevenLabs/OpenAI).
5. **Audio Cleanup & Timings** (`/cleanup`) — `faster-whisper` word timestamps, silence/breath reduction to `voice_clean.wav`.
6. **Visual Storyboard** (`/visual-plan`) — Scenes matched to stock footage, motion graphics, or generative prompts.
7. **Asset Sourcing & Generation** (`/assets`) — Pexels/Pixabay licensed b-roll and cloud diffusion images.
8. **Motion Graphics** (`/motion`) — Data-driven Remotion React templates (charts, comparisons, quotes).
9. **Timeline Edit** (`/timeline`) — Multi-track immutable timeline, transcript cuts, MCP proposal review.
10. **Master Render & Publish Pack** (`/renders`, `/publish-pack`) — Headless Remotion 540p/1080p render, -14 LUFS ducking, vertical shorts, thumbnails, metadata zip.

---

## 2. Hard Invariants (Non-Negotiable)

1. **Clean-Room License Invariant:**
   - ABSOLUTELY ZERO code, templates, or assets from OpenChatCut (AGPL-3.0), Palmier Pro (GPL-3.0), or Pallaidium (GPL-3.0) may enter this codebase.
   - All code must be original clean-room implementation. Dependencies must be MIT, Apache-2.0, or BSD.
2. **Credit & Billing Invariant:**
   - 1 Credit = 1 minute of finished 1080p master render. Fast 540p previews are free.
   - Master render credits are placed on hold at job initiation and captured ONLY upon successful render.
   - Credits are stored in an append-only `credit_ledger` table; mutable balance columns are strictly forbidden.
3. **Media Isolation:**
   - Media binaries NEVER pass through the FastAPI server. All uploads and downloads use presigned Cloudflare R2 / S3 URLs with short TTLs (15 min read, 30 min upload).
4. **Service Boundary Rules:**
   - `apps/web`: Never holds API secrets, prices renders, or decides job scheduling.
   - `services/api`: Never runs ffmpeg, Whisper, or Remotion. Requests must finish in < 2.0s.
   - `services/workers`: Partitioned Celery queues (`q.research`, `q.audio`, `q.assets`, `q.motion`, `q.render`, `q.publish`, `q.dead`). Never silently drop jobs.
5. **Timeline Proposal Pattern:**
   - External AI agents communicating over MCP NEVER mutate project timelines directly. All edits land as draft proposals requiring explicit human review and approval in the web UI.

---

## 3. Monorepo Structure

- `apps/web/`: Next.js 15+ App Router, React 19, Tailwind CSS.
- `services/api/`: FastAPI orchestration service (Python 3.11+), SQLAlchemy 2.0, Alembic, MCP server.
- `services/workers/`: Celery worker fleet with `faster-whisper`, `ffmpeg`, Remotion CLI runner.
- `packages/remotion/`: Remotion 4+ compositions, motion graphics templates, and caption typography.
- `packages/shared-types/`: Canonical Zod schemas and TypeScript type definitions.
- `docs/specs/`: Complete architectural specifications.

---

## 4. Key Documentation Pointers

- **Master Plan:** [docs/superpowers/plans/2026-10-17-ai-video-studio-master-plan.md](file:///docs/superpowers/plans/2026-10-17-ai-video-studio-master-plan.md)
- **Task Checklist:** [tasks/todo.md](file:///tasks/todo.md)
- **Architecture & DB:** [docs/specs/02-ARCHITECTURE-AND-DATA-MODEL.md](file:///docs/specs/02-ARCHITECTURE-AND-DATA-MODEL.md)
- **API Specification:** [docs/specs/03-API-SPEC.md](file:///docs/specs/03-API-SPEC.md)
- **AI Pipeline Specification:** [docs/specs/05-AI-PIPELINE-SPEC.md](file:///docs/specs/05-AI-PIPELINE-SPEC.md)
- **Remotion Template Catalog:** [docs/specs/09-REMOTION-TEMPLATES-CATALOG.md](file:///docs/specs/09-REMOTION-TEMPLATES-CATALOG.md)
- **MCP Server Protocol:** [docs/specs/10-MCP-SERVER-SPEC.md](file:///docs/specs/10-MCP-SERVER-SPEC.md)

---

## 5. Development Commands

```bash
# Monorepo setup
pnpm install
pnpm build

# Run local development stack (Postgres, Redis, MinIO)
docker compose up -d

# Run FastAPI backend
cd services/api && uvicorn src.main:app --reload --port 8000

# Run Celery workers
cd services/workers && celery -A src.celery_app worker -Q q.research,q.audio,q.assets,q.motion,q.render,q.publish -l info

# Run Next.js frontend
cd apps/web && pnpm dev

# Run test suites
pnpm test                          # Frontend & Remotion tests
pytest services/api/tests -v        # API tests
pytest services/workers/tests -v    # Worker pipeline tests
```
