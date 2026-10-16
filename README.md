# AI Video Studio

> **Transform a topic brief and voiceover into a finished video, vertical Shorts, thumbnails, and publish metadata pack — in one web app that works seamlessly on Windows, Mac, and Linux.**

---

## What is AI Video Studio?

AI Video Studio is a modern, web-first platform designed as a clean-room alternative to desktop folder packs like Slot Studio. Instead of requiring a local Mac, Apple Silicon M-series chip, or desktop Claude Project configuration, AI Video Studio provides a server-side render queue, an immutable command-based timeline editor, data-driven Remotion motion graphics, and a unified Model Context Protocol (MCP) interface for external AI assistants.

### Key Highlights
- **Universal Browser Access:** Next.js 15+ frontend runs on any modern browser across Windows, Mac, and Linux. No local desktop app or Electron required.
- **10-Stage Asynchronous Pipeline:** Resumable, idempotent stage progression from research to master render with approval gates that prevent credit waste.
- **Clean-Room Route B Architecture:** 100% original implementation with zero AGPL/GPL copyleft license contamination from OpenChatCut, Palmier Pro, or Pallaidium.
- **Fair Credit Economy:** 1 Credit = 1 minute of finished 1080p master render. Fast 540p previews are free. Credits are placed on hold and captured only upon successful render completion.
- **Direct-to-Storage Media Transfers:** Audio and video binaries never transit through the web or API application servers; presigned Cloudflare R2 / S3 URLs ensure sub-2-second API response times.
- **Agent-Ready MCP Server:** External AI assistants (Claude Code, Codex, Cursor) connect via Streamable HTTP (`/v1/mcp`) using an isolated draft-proposal review pattern.

---

## The 10-Stage Pipeline

```
[1. Topic Intake] ──> [2. Research Brief] ──> [3. Scene Script] ──> [4. Voice Track] ──> [5. Audio Cleanup & Timings]
                                                                                                  │
                                                                                                  ▼
[10. Master Render & Pack] <── [9. Timeline Edit] <── [8. Motion Graphics] <── [7. Asset Sourcing] <── [6. Visual Storyboard]
```

1. **Topic Brief:** User inputs topic, target duration (1-30 min), language, and channel tone preset.
2. **Research Brief:** Search engine fact-checking (Tavily/Perplexity); facts extracted with verified source URLs.
3. **Scene Script:** LLM generates structured scene JSON (hook, narration, visual intent, template suggestion).
4. **Voice Track:** User uploads a voiceover recording or triggers cloud TTS (ElevenLabs / OpenAI).
5. **Audio Cleanup & Timings:** `faster-whisper` aligns word timestamps; silences (>800ms) and breaths trimmed to `voice_clean.wav`.
6. **Visual Storyboard:** Matches scenes with b-roll footage, motion graphics templates, or generative image prompts.
7. **Asset Sourcing & Generation:** Downloads licensed stock media (Pexels / Pixabay) or runs cloud diffusion adapters.
8. **Motion Graphics:** Data-driven Remotion React templates (Bar charts, Line charts, Comparisons, Tier lists, Quotes, Stat counters).
9. **Timeline Edit:** Multi-track timeline canvas with transcript-based cutting and MCP proposal review.
10. **Master Render & Publish Pack:** Headless Remotion render (540p preview / 1080p master), automatic -14 LUFS loudness ducking, 1-3 vertical Shorts/Reels, 3 thumbnail options, and complete metadata zip.

---

## Monorepo Architecture

```
ai-video-studio/
├── apps/
│   └── web/                   # Next.js 15+ App Router, React 19, Tailwind CSS
├── services/
│   ├── api/                   # FastAPI (Python 3.11+), SQLAlchemy 2.0, MCP Server
│   └── workers/               # Celery Worker Fleet (faster-whisper, ffmpeg, Remotion)
├── packages/
│   ├── remotion/              # Remotion React Compositions & Template Library
│   └── shared-types/          # Canonical Zod Schemas & TypeScript Types
├── docker/                    # Dockerfiles & Local Development Compose Topologies
├── docs/                      # Production Specifications & Master Implementation Plans
└── tasks/                     # Task Breakdown & Implementation Checklist
```

---

## Quickstart (Local Development)

### Prerequisites
- Node.js >= 20.x and pnpm >= 9.x
- Python >= 3.11
- Docker and Docker Compose
- ffmpeg >= 6.0 and ffprobe on PATH

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/ai-video-studio.git
cd ai-video-studio

# Install Node monorepo packages
pnpm install

# Setup Python virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r services/api/requirements.txt
pip install -r services/workers/requirements.txt
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
```
*(Populate your API keys for Claude/OpenAI, Tavily, Pexels, and Cloudflare R2 / S3).*

### 3. Start Infrastructure Containers
```bash
docker compose up -d postgres redis minio
```
- PostgreSQL available on `localhost:5432`
- Redis available on `localhost:6379`
- MinIO S3 Console on `http://localhost:9001` (User: `minioadmin`, Pass: `minioadmin`)

### 4. Run Database Migrations
```bash
cd services/api
alembic upgrade head
```

### 5. Start Development Servers
In separate terminal tabs:
```bash
# Tab 1: FastAPI Orchestrator
cd services/api && uvicorn src.main:app --reload --port 8000

# Tab 2: Celery Worker Fleet
cd services/workers && celery -A src.celery_app worker -Q q.research,q.audio,q.assets,q.motion,q.render,q.publish -l info

# Tab 3: Next.js Frontend
cd apps/web && pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to access the studio.

---

## Documentation Index

- **Master Plan:** [docs/superpowers/plans/2026-10-17-ai-video-studio-master-plan.md](file:///docs/superpowers/plans/2026-10-17-ai-video-studio-master-plan.md)
- **Task Checklist:** [tasks/todo.md](file:///tasks/todo.md)
- **Product Requirements (PRD):** [docs/specs/01-PRD.md](file:///docs/specs/01-PRD.md)
- **Architecture & Data Model:** [docs/specs/02-ARCHITECTURE-AND-DATA-MODEL.md](file:///docs/specs/02-ARCHITECTURE-AND-DATA-MODEL.md)
- **API Contract:** [docs/specs/03-API-SPEC.md](file:///docs/specs/03-API-SPEC.md)
- **UI/UX & Timeline Model:** [docs/specs/04-UI-UX-SPEC.md](file:///docs/specs/04-UI-UX-SPEC.md)
- **AI Pipeline & Audio Contract:** [docs/specs/05-AI-PIPELINE-SPEC.md](file:///docs/specs/05-AI-PIPELINE-SPEC.md)
- **Security, Privacy & Licensing:** [docs/specs/06-SECURITY-PRIVACY-LICENSING.md](file:///docs/specs/06-SECURITY-PRIVACY-LICENSING.md)
- **Testing, DevOps & Golden Renders:** [docs/specs/07-TESTING-AND-DEVOPS.md](file:///docs/specs/07-TESTING-AND-DEVOPS.md)
- **Pricing, Billing & Launch:** [docs/specs/08-PRICING-BILLING-LAUNCH.md](file:///docs/specs/08-PRICING-BILLING-LAUNCH.md)
- **Remotion Template Catalog:** [docs/specs/09-REMOTION-TEMPLATES-CATALOG.md](file:///docs/specs/09-REMOTION-TEMPLATES-CATALOG.md)
- **MCP Server Protocol:** [docs/specs/10-MCP-SERVER-SPEC.md](file:///docs/specs/10-MCP-SERVER-SPEC.md)

---

## License

Proprietary and Commercial — All Rights Reserved.
Clean-room implementation. Independent of OpenChatCut, Palmier Pro, and Pallaidium.
