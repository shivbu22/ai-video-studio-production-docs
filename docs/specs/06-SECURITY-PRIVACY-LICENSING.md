# 06 - Security, Privacy, Licensing & Compliance

**Product:** AI Video Studio  
**Standard:** Enterprise Security, Tenant Isolation, Clean-Room Licensing, and Fair-Use Compliance.

---

## 1. Clean-Room Legal Invariant (MANDATORY)

AI Video Studio follows a strict Clean-Room Route B development model:
- **Zero Foreign Code:** ABSOLUTELY ZERO source code, template files, or compiled binaries from OpenChatCut (AGPL-3.0), Palmier Pro (GPL-3.0), or Pallaidium (GPL-3.0) may be copied, adapted, or included in this repository.
- **Protocol Compatibility Only:** The Streamable HTTP Model Context Protocol (MCP) and OpenAI-compatible `/v1` generation schemas are open standard specifications. Adopting these open wire protocols does not create copyleft obligations.
- **Dependency License Whitelist:** Only libraries licensed under MIT, Apache-2.0, BSD-2/3-Clause, ISC, or approved commercial licenses may be added.
- **Automated CI Enforcement:** Every PR runs automated license scanning (`license-checker` for npm, `pip-licenses` for Python). Any viral copyleft (GPL, AGPL, LGPL with static linking) immediately fails the build.

---

## 2. Authentication & Secrets Architecture

- **Server-Side API Key Isolation:** AI provider keys (Anthropic, OpenAI, Tavily, ElevenLabs, fal.ai, Stripe) reside exclusively on the server in environment variables or HashiCorp Vault. The Next.js client NEVER receives provider keys.
- **Session Authentication:** Next.js authentication uses JWT tokens signed with HMAC-SHA256 (64-byte random secret) with a 7-day expiration and automatic rotation. Passwords are hash-protected with Argon2id (`time_cost=3, memory_cost=65536, parallelism=4`).
- **Scoped MCP API Keys:** External agents authenticate using scoped API keys (`ak_live_...`). Keys are stored as SHA-256 hashes in PostgreSQL and can be revoked instantly without affecting user sessions.

---

## 3. Media Isolation & Tenant Boundaries

- **Direct Storage Isolation:** All user media (voice recordings, stock footage, generated assets, project manifests, and rendered videos) are stored in Cloudflare R2 / S3 under strict tenant path prefixes:
  ```
  projects/{project_id}/...
  ```
- **Presigned URLs with Short TTL:**
  - Read access: 15-minute expiration (`ttl_sec=900`).
  - Upload access: 30-minute expiration (`ttl_sec=1800`) with strict content-length and MIME type validation.
- **No Public Bucket Access:** Cloudflare R2 / S3 buckets are entirely private. Direct public access is disabled.
- **Soft Deletion & Retention:** Project deletion is soft-retained for 30 days. After 30 days, an automated purge job removes database records and storage objects simultaneously.

---

## 4. YouTube Terms of Service & Fair-Use Policy

- **Default State Disabled:** Direct YouTube URL media import is disabled platform-wide by default.
- **Affirmative Workspace Opt-In:** A workspace owner can only unlock YouTube clip import via `PATCH /workspace/settings` with `youtube_source_enabled: true` after agreeing to an affirmative legal acknowledgment:
  > *"I confirm that I possess the explicit intellectual property rights or valid fair-use authorization for any third-party media imported into my projects, and I indemnify AI Video Studio against copyright claims."*
- **Audit Logging:** Every opt-in toggle and YouTube import call is permanently logged in the append-only `audit_log` table with user ID, IP address, timestamp, and URL.
- **Render Gate:** The Stage 10 render worker verifies the project's `rights[]` manifest. If an asset origin is `youtube` but `youtube_opt_in` is false, render execution is immediately blocked with HTTP 422 `UNLICENSED_ASSET_DETECTED`.

---

## 5. Content Moderation & Abuse Prevention

- **Input Prompt Filtering:** User topic briefs and script generation prompts pass through automated moderation filters checking for hate speech, violence, child sexual abuse material (CSAM), and harassment.
- **DMCA Takedown Flow:** Automated admin endpoints allow immediate takedown and asset revocation upon receipt of a valid copyright notice.
