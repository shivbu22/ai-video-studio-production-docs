# AI Video Studio Tasks Checklist

## Phase 0: 5-7 Day Validation Spike
- [x] Task S0.1: Build CLI research & claim citation runner (spike/run_spike.py)
- [x] Task S0.2: Build CLI audio cleanup & 48kHz normalization harness
- [x] Task S0.3: Implement core Remotion templates (Bar Chart, Comparison, Quote Card, Stat Counter)
- [x] Task S0.4: Build ffmpeg assembly script with 1080p MP4 export and vertical 9:16 Short cut
- [x] **Checkpoint S0**: Produce 1 genuinely postable Pixalified video & author behavior specification (Verified in spike/out/)

## Phase 1: MVP Platform

### Wave 1: Monorepo Foundation & Core Database Models
- [x] Task 1: Monorepo Scaffolding & Canonical Shared Types (@ai-video-studio/shared-types)
- [ ] Task 2: PostgreSQL Database Schema & Alembic Migrations (12 tables)
- [ ] Task 3: Append-Only Credit Ledger & Balance Invariants (CreditService)

### Wave 2: Storage, Auth & Idempotent Job Queue
- [ ] Task 4: Cloudflare R2 / S3 Presigned Storage Service (StorageService)
- [ ] Task 5: User Authentication & Tenant Context (JWT, Argon2id, API Keys)
- [ ] Task 6: Redis & Celery Partitioned Queue Infrastructure (6 queues + DLQ)

- [ ] **Checkpoint 1**: Monorepo builds, migrations pass, credit ledger holds/captures work, storage generates valid signed URLs, Celery processes test tasks

### Wave 3: Audio Subsystem & faster-whisper Timings
- [ ] Task 7: Voice Ingestion & 48kHz Audio Normalization Service (fmpeg_audio.py)
- [ ] Task 8: faster-whisper Word-Level Alignment & Transcription Engine (whisper_engine.py)
- [ ] Task 9: Audio Cleanup & Silence/Breath/Filler Reduction (udio_cleanup.py)

### Wave 4: AI Research & Script Generation Pipeline
- [ ] Task 10: Topic Research & Source-Cited Fact Extraction (
esearcher.py)
- [ ] Task 11: Structured Scene Script Generator (scriptwriter.py)
- [ ] Task 12: Visual Storyboard & Asset Matcher (storyboard.py)

### Wave 5: Remotion Motion Graphics Harness & Asset Adapters
- [ ] Task 13: 6 MVP Remotion Motion Graphics Templates (Bar, Line, Comparison, Tier, Quote, Counter)
- [ ] Task 14: Dynamic Word-Synced Animated Captions Component (AnimatedCaptions.tsx)
- [ ] Task 15: Stock Media & Generative AI Adapters (Pexels, Pixabay, Diffusion /v1)

- [ ] **Checkpoint 2**: Audio normalizes and transcribes with word timings, research produces cited claims, script generates scenes, 6 Remotion templates render cleanly

### Wave 6: Command-Based Timeline Engine & Web Editor
- [ ] Task 16: Immutable Timeline State & Command Reducer (Pure functions, undo/redo)
- [ ] Task 17: Interactive Timeline Web Editor UI (TimelineCanvas.tsx, multi-track)
- [ ] Task 18: Transcript-Based Text Cutting UI (TranscriptEditor.tsx)

### Wave 7: Render Pipeline, Loudness & Publish Pack
- [ ] Task 19: Remotion Headless Preview & Master Render Worker (540p fast / 1080p master)
- [ ] Task 20: Audio Loudness Normalization & Music Ducking (-14 LUFS, -1.0 dBTP)
- [ ] Task 21: Publish Pack Assembler (Shorts, Thumbnails, Zip)

- [ ] **Checkpoint 3**: Timeline supports editing and scrubbing, transcript cuts slice audio/video tracks, 540p preview renders < 2 min, 1080p master renders with ducked audio, publish pack exports complete zip

## Phase 2: Sellable v1 Platform

### Wave 8: MCP Agent Interface, Billing & Quality Gates
- [ ] Task 22: Streamable HTTP MCP Server & Draft Proposal Engine (/v1/mcp)
- [ ] Task 23: Stripe Billing Integration & Webhook Reconciliation (Subscriptions, top-ups)
- [ ] Task 24: Golden Render Tests & End-to-End Pipeline Verification (pHash, sync drift < 40ms)

- [ ] **Checkpoint 4**: External AI agents can propose timeline edits via MCP, user can approve/reject proposals, Stripe payments grant credits, golden render tests pass
