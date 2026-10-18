# Phase 6: Pro NLE Transitions Engine, Keyframing & Multi-Format Export Queue

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement professional video transitions, keyframe animation controls, and a multi-format background export queue in OmniCut.

**Architecture:** 
1. Extend `TimelineClip` with transition metadata (`transitionIn`, `transitionOut`) and render visual cut handles in `TimelineCanvas`.
2. Expand `ClipInspector` with interactive transition selection (Cross Dissolve, Dip to Black, Dip to White, Wipe, Zoom Blur) and keyframe animation controls (Scale, Position, Opacity, Rotation).
3. Build a multi-format Render Queue drawer in `ExportPublishModal` supporting simultaneous batch queuing of 1080p Master, 4K Archive, 9:16 Vertical Short, and 1:1 Social with live chunk progress tracking.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide React.

**Spec:** `TimelineCanvas.tsx`, `ClipInspector.tsx`, `ExportPublishModal.tsx`.

## Global Constraints
- Clean-Room Route B (Zero GPL/AGPL dependencies).
- Strictly adhere to Premiere Pro / DaVinci Resolve dark NLE design palette (`#090b0e`, `#111319`, `#1a1c26`, vibrant accent tokens).
- Maintain 100% TypeScript type safety (`tsc --noEmit` must pass with 0 errors).

---

### Task 1: Extend Timeline Clip Model & Visual Transition Badges

**Files:**
- Modify: `apps/web/src/components/Timeline/TimelineCanvas.tsx`
- Modify: `apps/web/src/app/page.tsx`

- [ ] **Step 1: Add transition properties to `TimelineClip` interface**
- [ ] **Step 2: Render diagonal transition markers on clip start and end in `TimelineCanvas`**
- [ ] **Step 3: Support updating transitions via `handleUpdateClipProps` in `page.tsx`**

---

### Task 2: Transition & Keyframing Studio in Clip Inspector

**Files:**
- Modify: `apps/web/src/components/RightPanel/ClipInspector.tsx`

- [ ] **Step 1: Add Transition In / Out selectors and duration sliders**
- [ ] **Step 2: Add Keyframe Animator diamonds and easing curve selector**
- [ ] **Step 3: Wire changes to `onUpdateClipProps` for real-time timeline updates**

---

### Task 3: Multi-Format Batch Export Queue & Live Job Tracker

**Files:**
- Modify: `apps/web/src/components/Modals/ExportPublishModal.tsx`

- [ ] **Step 1: Add Multi-Format target selector (1080p, 4K ProRes, 9:16 Short, 1:1 Square)**
- [ ] **Step 2: Build Live Render Queue drawer with multi-job parallel status and progress bars**
- [ ] **Step 3: Wire job dispatch to `/api/render` and `/api/render/lambda`**

---

### Task 4: Automated Compilation & Browser Verification

**Files:**
- Test: `apps/web` (`npx tsc --noEmit`)
- Browser: `http://localhost:3000`

- [ ] **Step 1: Verify TypeScript compilation with zero errors**
- [ ] **Step 2: Launch browser subagent to test transitions, keyframing, and multi-format export queue**
