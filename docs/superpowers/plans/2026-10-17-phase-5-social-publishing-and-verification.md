# Phase 5 Social Publishing & E2E System Verification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Integrate 1-click social distribution in OmniCut's Publishing Kit with live YouTube & TikTok APIs, verify all production endpoints, compile the production bundle, and validate the UI via browser test.

**Architecture:** Connect PublishingKitWorkspace.tsx to Next.js API route /api/publish with live channel status retrieval, dynamic publish mutations (YouTube video upload, TikTok vertical reframe scheduling), optimistic state feedback, and direct live URL links. Then execute full-suite integration tests and headless browser validation.

**Tech Stack:** Next.js 15, React 19, TypeScript, Lucide React, Tailwind CSS.

**Spec:** pps/web/src/components/Workspaces/PublishingKitWorkspace.tsx and pps/web/src/app/api/publish/route.ts.

## Global Constraints
- Strictly zero GPL/AGPL dependencies (Clean-Room Route B compliance).
- Dark Premiere Pro / DaVinci Resolve aesthetic: #090b0e, #14171d, violet/blue accents.
- All network interactions must handle loading, error, and success states gracefully.
- TypeScript build must pass with 0 errors.

## Review Focus
1. POST /api/publish failure handling: Network errors or missing title must render inline error alerts without breaking workspace state.
2. Channel connectivity status: Connected vs unconnected channels must clearly visually reflect permission scopes.
3. Live links: Published video URL must render as a clickable external link opening in a new tab.
4. Thumbnail selection persistence: Selected thumbnail ID must be bundled into the publish payload.
5. Vertical reframe mode: Toggling 9:16 reframe must pass appropriate aspect ratio formatting to the publishing worker.

---

### Task 1: Wire Live Channel Status & 1-Click Direct Publishing in PublishingKitWorkspace

**Files:**
- Modify: pps/web/src/components/Workspaces/PublishingKitWorkspace.tsx
- Interface: Consumes GET /api/publish (channels) and POST /api/publish (publish request)

- [ ] **Step 1: Add Channel and Publish state definitions and API invocation hooks**
- [ ] **Step 2: Add Direct YouTube Upload and TikTok Schedule Action Bar**
- [ ] **Step 3: Display Live Published Links and Status Alerts**
- [ ] **Step 4: Verify type safety and component rendering**

---

### Task 2: Compile & Run Full-Stack Automated Verification

**Files:**
- Test: pps/web/src/app/api/publish/route.ts
- Test: pps/web/src/app/api/voice/clone/route.ts
- Test: pps/web/src/app/api/render/lambda/route.ts

- [ ] **Step 1: Run pnpm run build in apps/web to verify 0 TypeScript compiler errors**
- [ ] **Step 2: Run automated HTTP API test script covering all post-MVP endpoints**

---

### Task 3: Live Browser Visual Inspection & Workflow Verification

**Files:**
- Browser Session: http://localhost:3000

- [ ] **Step 1: Launch browser subagent to inspect OmniCut UI**
- [ ] **Step 2: Verify Publishing Kit tab, click Publish Direct to YouTube, and observe success state**
- [ ] **Step 3: Capture screenshot/recording confirming production readiness**
