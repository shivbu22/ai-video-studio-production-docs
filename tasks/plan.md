# Implementation Plan: AI Video Studio Platform (Clean-Room Route B)

## Overview
A web-based AI video studio that converts a topic brief and voiceover into a finished 1080p video, vertical Shorts/Reels, thumbnails, and publish metadata pack across a 10-stage pipeline with an immutable command-based timeline, Remotion motion graphics, and an MCP agent editing interface.

Detailed implementation specification is documented in [docs/superpowers/plans/2026-10-17-ai-video-studio-master-plan.md](file:///c:/Users/ahiva/OneDrive/Desktop/ai-video-studio-production-docs/docs/superpowers/plans/2026-10-17-ai-video-studio-master-plan.md).

## Architecture Decisions
- **Clean-Room Route B:** Zero code or assets from OpenChatCut, Palmier Pro, or Pallaidium (avoid AGPL/GPL copyleft trap). Clean-room implementation on Next.js 15, FastAPI, Celery, and Remotion.
- **Dogfood First:** Phase 0 Spike and Phase 1 MVP tested on internal Pixalified content before expanding to external creators.
- **Credit Economy:** 1 Credit = 1 minute of finished 1080p master render. Charged only upon successful render completion. Previews at 540p are free. Append-only credit_ledger prevents race conditions and balance drifting.
- **Media Binary Isolation:** Media never flows through FastAPI; pre-signed Cloudflare R2 / S3 URLs with short TTL handle direct client/worker I/O.
- **Queue Partitioning:** 6 dedicated Celery queues (q.research, q.audio, q.assets, q.motion, q.render, q.publish) preventing heavy rendering from starving lightweight research or transcription jobs.
- **Proposal-Based MCP Editing:** External AI agents edit projects in isolated draft sessions; modifications require human approval in the web UI before merging into the main timeline.

## Task List

### Phase 0: 5-7 Day Validation Spike
- [ ] Task S0.1: CLI Topic Research & Claim Citation Runner
- [ ] Task S0.2: Voice Cleanup & faster-whisper Timings CLI
- [ ] Task S0.3: Remotion Graphics CLI Harness (3 templates)
- [ ] Task S0.4: ffmpeg Ducking & 1080p Assembly Pipeline
- [ ] Checkpoint S0: 1 Postable 3-5 Minute Pixalified Video & Behaviour Spec

### Phase 1: MVP Platform (Waves 1 - 7)
- [ ] Task 1: Monorepo Scaffolding & Canonical Shared Types
- [ ] Task 2: PostgreSQL Database Schema & Alembic Migrations
- [ ] Task 3: Append-Only Credit Ledger & Balance Invariants
- [ ] Task 4: Cloudflare R2 / S3 Presigned Storage Service
- [ ] Task 5: User Authentication & Tenant Context
- [ ] Task 6: Redis & Celery Partitioned Queue Infrastructure
- [ ] Checkpoint 1: Foundations (Tasks 1 - 6)
- [ ] Task 7: Voice Ingestion & 48kHz Audio Normalization Service
- [ ] Task 8: faster-whisper Word-Level Alignment & Transcription Engine
- [ ] Task 9: Audio Cleanup & Silence/Breath/Filler Reduction
- [ ] Task 10: Topic Research & Source-Cited Fact Extraction
- [ ] Task 11: Structured Scene Script Generator
- [ ] Task 12: Visual Storyboard & Asset Matcher
- [ ] Task 13: 6 MVP Remotion Motion Graphics Templates
- [ ] Task 14: Dynamic Word-Synced Animated Captions Component
- [ ] Task 15: Stock Media & Generative AI Adapters
- [ ] Checkpoint 2: Core Pipeline & Media Harness (Tasks 7 - 15)
- [ ] Task 16: Immutable Timeline State & Command Reducer
- [ ] Task 17: Interactive Timeline Web Editor UI
- [ ] Task 18: Transcript-Based Text Cutting UI
- [ ] Task 19: Remotion Headless Preview & Master Render Worker
- [ ] Task 20: Audio Loudness Normalization & Music Ducking
- [ ] Task 21: Publish Pack Assembler (Shorts, Thumbnails, Zip)
- [ ] Checkpoint 3: Interactive Editor & Render Output (Tasks 16 - 21)

### Phase 2: Sellable v1 Platform (Wave 8)
- [ ] Task 22: Streamable HTTP MCP Server & Draft Proposal Engine
- [ ] Task 23: Stripe Billing Integration & Webhook Reconciliation
- [ ] Task 24: Golden Render Tests & End-to-End Pipeline Verification
- [ ] Checkpoint 4: Commercial Platform Readiness (Tasks 22 - 24)

## Risks and Mitigations
| Risk | Impact | Mitigation |
|---|---|---|
| AGPL/GPL Licence Contamination | Critical | Clean-room Route B strictly enforced. Zero foreign code. CI dependency license audits. |
| Render Worker Crashes / OOM | High | 1 render per worker in MVP, cgroup memory limits, stale heartbeat reaper for credit holds. |
| AI Generation Cost Spikes | High | Free stock footage is default; AI generation is scene opt-in with upfront credit quotes. |
| YouTube Fair Use Liability | High | YouTube import disabled by default; requires affirmative legal disclaimer opt-in. |
| Script Factual Hallucinations | High | Mandatory source URL citations per claim; mandatory human script approval gate. |
