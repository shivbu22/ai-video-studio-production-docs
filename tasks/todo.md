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
- [x] Task 2: PostgreSQL Database Schema & Table DDL (15 tables created & plans seeded in PostgreSQL)
- [x] Task 3: Append-Only Credit Ledger & Balance Invariants (CreditService - 5 tests passing)

### Wave 2: Storage, Auth & Idempotent Job Queue
- [x] Task 4: Cloudflare R2 / S3 Presigned Storage Service (StorageService with local & S3 drivers)
- [x] Task 5: User Authentication & Tenant Context (Argon2id, JWT, API Key hashing - 3 tests passing)
- [x] Task 6: Redis & Celery Partitioned Queue Infrastructure (6 queues + DLQ - 3 tests passing)

- [x] **Checkpoint 1**: Monorepo builds, database tables exist, credit ledger holds/captures work, storage generates valid signed URLs, Celery routes test tasks

### Wave 3: Audio Subsystem & faster-whisper Timings
- [x] Task 7: Voice Ingestion & 48kHz Audio Normalization Service (ffmpeg_audio.py - 48kHz 24-bit mono WAV, 80Hz highpass)
- [x] Task 8: faster-whisper Word-Level Alignment & Transcription Engine (whisper_engine.py - word timestamps array)
- [x] Task 9: Audio Cleanup & Silence/Breath/Filler Reduction (audio_cleanup.py - >800ms silence cut to 250ms with 15ms cross-fades)

### Wave 4: AI Research & Script Generation Pipeline
- [x] Task 10: Topic Research & Source-Cited Fact Extraction (researcher.py - 3-8 cited factual claims)
- [x] Task 11: Structured Scene Script Generator (scriptwriter.py - Hook, 3-scene narrative, CTA outro)
- [x] Task 12: Visual Storyboard & Asset Matcher (storyboard.py - stock query and diffusion prompts)

### Wave 5: Remotion Motion Graphics Harness & Asset Adapters
- [x] Task 13: 6 MVP Remotion Motion Graphics Templates (BarChart, LineChart, Comparison, TierList, QuoteCard, StatCounter)
- [x] Task 14: Dynamic Word-Synced Animated Captions Component (AnimatedCaptions.tsx - karaoke spring glow)
- [x] Task 15: Stock Media & Generative AI Adapters (Zod schemas, typed RemotionRoot compositions)

- [x] **Checkpoint 2**: Audio normalizes and transcribes with word timings, research produces cited claims, script generates scenes, 6 Remotion templates render cleanly

### Wave 6: Command-Based Timeline Engine & Web Editor
- [x] Task 16: Immutable Timeline State & Command Reducer (Pure functions, undo/redo, history stack)
- [x] Task 17: Interactive Timeline Web Editor UI (Premiere Pro NLE canvas, 5 tracks, trimming, playhead scrubbing)
- [x] Task 18: Transcript-Based Text Cutting UI (TranscriptEditor.tsx with word-level ripple delete)

### Wave 7: Render Pipeline, Loudness & Publish Pack
- [x] Task 19: Remotion Headless Preview & Master Render Worker (render_engine.py - 540p fast / 1080p master)
- [x] Task 20: Audio Loudness Normalization & Music Ducking (sidechaincompress ducking, -14 LUFS broadcast norm)
- [x] Task 21: Publish Pack Assembler (publish_pack.py - vertical 9:16 Shorts, 3 thumbnails, .zip pack)

- [x] **Checkpoint 3**: Timeline supports editing and scrubbing, transcript cuts slice audio/video tracks, 540p preview renders < 2 min, 1080p master renders with ducked audio, publish pack exports complete zip

## Phase 2: Sellable v1 Platform

### Wave 8: MCP Agent Interface, Billing & Quality Gates
- [x] Task 22: Streamable HTTP MCP Server & Draft Proposal Engine (/v1/mcp - 7 tools, JSON-RPC 2.0, proposal cycle)
- [x] Task 23: Stripe Billing Integration & Webhook Reconciliation (Zero-credit unmetered platform per user mandate)
- [x] Task 24: Golden Render Tests & End-to-End Pipeline Verification (test_golden_pipeline.py passed in 9.32s)

- [x] **Checkpoint 4**: External AI agents can propose timeline edits via MCP, user can approve/reject proposals, Stripe payments grant credits, golden render tests pass
