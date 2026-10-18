# Phase 8: Real-Time Multi-User Collaboration & Frame-Accurate Review System

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement real-time multiplayer collaborator presence, color-coded peer playheads on the timeline, and a frame-accurate timecoded review comments drawer in OmniCut.

**Architecture:**
1. **Multi-User Presence**:
   - Define `Collaborator` state in `page.tsx` with name, role, color avatar, and active playhead position.
   - Render live presence pill cluster in `Header.tsx` and interactive collaborator invite modal (`CollaborationInviteModal.tsx`).
2. **Peer Playheads on Timeline**:
   - Render real-time color-coded playhead lines and collaborator name tags on `TimelineCanvas.tsx` reflecting peer positions.
3. **Timecoded Review Comments Drawer**:
   - Build `ReviewCommentsDrawer.tsx` with pin markers, timestamp jumps, threaded replies, and resolve states.
   - Pinned comment markers rendered on `TimelineRuler.tsx` at corresponding timestamps.

**Tech Stack:** Next.js 15, React 19, TypeScript, Lucide React, Tailwind CSS.

**Spec:** `page.tsx`, `Header.tsx`, `TimelineCanvas.tsx`, `TimelineRuler.tsx`.

## Global Constraints
- Clean-Room Route B compliant (Zero GPL/AGPL dependencies).
- Strictly adhere to Premiere Pro / DaVinci Resolve dark NLE design aesthetic.
- TypeScript compiler (`tsc --noEmit`) must pass with 0 errors.

---

### Task 1: Collaborator Presence & Invite Modal

**Files:**
- Create: `apps/web/src/components/Modals/CollaborationInviteModal.tsx`
- Modify: `apps/web/src/components/Header.tsx`
- Modify: `apps/web/src/app/page.tsx`

- [ ] **Step 1: Create CollaborationInviteModal with shareable room link and role selector**
- [ ] **Step 2: Add live collaborator avatars and Invite button in Header.tsx**
- [ ] **Step 3: Wire presence state into page.tsx**

---

### Task 2: Peer Playheads on Timeline & Ruler Comment Pins

**Files:**
- Modify: `apps/web/src/components/Timeline/TimelineCanvas.tsx`
- Modify: `apps/web/src/components/Timeline/TimelineRuler.tsx`

- [ ] **Step 1: Render peer playhead lines with collaborator name tags in TimelineCanvas**
- [ ] **Step 2: Render comment pin diamonds on TimelineRuler**

---

### Task 3: Frame-Accurate Timecoded Review Comments Drawer

**Files:**
- Create: `apps/web/src/components/Modals/ReviewCommentsDrawer.tsx`
- Modify: `apps/web/src/app/page.tsx`

- [ ] **Step 1: Build ReviewCommentsDrawer with timecoded comments, replies, and status filtering**
- [ ] **Step 2: Clicking comment seeks timeline playhead to exact timestamp**
- [ ] **Step 3: Wire comment toggle button in Header and page.tsx**

---

### Task 4: Compilation, Testing & Live Browser Verification

**Files:**
- Test: `apps/web` (`npx tsc --noEmit`)
- Browser: `http://localhost:3000`

- [ ] **Step 1: Verify TypeScript compiler produces 0 errors**
- [ ] **Step 2: Launch browser subagent to verify presence avatars, peer playheads, comment drawer, and seek functionality**
