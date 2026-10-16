# 07 - Testing, DevOps, and Quality Assurance

**Product:** AI Video Studio  
**Testing Frameworks:** Jest / Vitest (Frontend & Remotion), Pytest (FastAPI & Workers), Playwright (E2E).  
**Infrastructure Stack:** Docker Compose, GitHub Actions CI/CD, Caddy Reverse Proxy, Cloudflare CDN.

---

## 1. Quality Gates (Definition of Done)

A task or pull request cannot be merged unless:
1. **Unit & Contract Tests Pass:** 100% of existing and new unit tests pass cleanly.
2. **Type Safety:** `tsc --noEmit` and `mypy --strict` complete with zero errors.
3. **Lint & Formatting:** ESLint, Prettier, Black, and Ruff report zero violations.
4. **License Check:** CI license scan confirms 0% copyleft contamination.
5. **No Regressions on Golden Renders:** Output video renders match reference perceptual hashes.

---

## 2. Test Plan by Layer

```
┌─────────────────────────────────────────────────────────────┐
│ E2E System Tests (Playwright): Full Browser 10-Stage Flow   │
├─────────────────────────────────────────────────────────────┤
│ Golden Render Tests: Perceptual Hash, Sync Drift, Loudness  │
├─────────────────────────────────────────────────────────────┤
│ Integration Tests (Testcontainers): FastAPI + Postgres + R2 │
├─────────────────────────────────────────────────────────────┤
│ Unit Tests: Zod Schemas, Timeline Reducer, Audio Normalizer │
└─────────────────────────────────────────────────────────────┘
```

### Layer 1: Unit Tests
- `packages/shared-types`: Validates canonical Zod schemas and JSON serialization.
- `packages/remotion`: Tests template prop rendering, active caption word calculations, and spring animation formulas.
- `services/api`: Tests credit ledger math, JWT generation, and router validation.
- `services/workers`: Tests audio normalization, Whisper output parser, and ffmpeg filter chain strings.

### Layer 2: Integration Tests (Testcontainers)
- Spawns ephemeral PostgreSQL 15, Redis 7, and MinIO S3 containers during test runs.
- Verifies Alembic migrations from scratch.
- Validates Celery queue job routing, progress pub/sub events, and dead-letter handling.

### Layer 3: Golden Render Tests & Media QA
The render pipeline is validated using deterministic test fixtures:
1. **Visual Match via Perceptual Hash (pHash):**
   - Compares keyframes (e.g., at 10s, 30s, 60s) of test project renders against reference images.
   - Requirement: Hamming distance $\le 5$ (imperceptible visual variation).
2. **Audio-Video Synchronization Drift:**
   - Measures time difference between Whisper word timestamp and caption visual highlight.
   - Requirement: Synchronization drift $< 40	ext{ ms}$ over a 10-minute timeline.
3. **Broadcast Loudness Verification:**
   - Runs `ffmpeg -i master.mp4 -af ebur128=framelog=verbose -f null -`.
   - Requirement: Integrated Loudness must be $-14.0	ext{ LUFS} \pm 0.5	ext{ LUFS}$ with True Peak $\le -1.0	ext{ dBTP}$.

---

## 3. Performance & Resource Targets

| Metric | Target SLA | Failure Threshold |
|---|---|---|
| **API Response Time** | $< 200	ext{ ms}$ (p95) | $> 2000	ext{ ms}$ (Flagged as bug) |
| **540p Fast Preview Render** | $< 90	ext{ seconds}$ for 3-min video | $> 180	ext{ seconds}$ |
| **1080p Master Render** | $< 1.5	imes$ real-time duration | $> 3.0	imes$ real-time duration |
| **Worker Heartbeat Interval** | Every 15 seconds | Stale if silent for $> 120	ext{ seconds}$ |

---

## 4. CI/CD GitHub Actions Pipeline

```yaml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node & Python
        uses: actions/setup-node@v4
        with: { node-version: 20 }
      - name: Install pnpm & dependencies
        run: pnpm install
      - name: TypeScript Check
        run: pnpm type-check
      - name: License Whitelist Scan
        run: pnpm license-check && pip-licenses --fail-on 'GPL;AGPL'

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: pnpm --filter @ai-video-studio/web test
      - run: pnpm --filter @ai-video-studio/remotion test

  test-backend:
    runs-on: ubuntu-latest
    services:
      postgres: { image: 'postgres:15-alpine', env: { POSTGRES_PASSWORD: root } }
      redis: { image: 'redis:7-alpine' }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.11' }
      - run: pip install -r services/api/requirements.txt
      - run: pytest services/api/tests -v
```
