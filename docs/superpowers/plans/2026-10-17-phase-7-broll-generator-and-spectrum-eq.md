# Phase 7: AI Semantic B-Roll Inserter & Dynamic FFT Audio Spectrum EQ

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement an automated AI B-roll semantic inserter with relevance scoring and an interactive dynamic FFT frequency spectrum EQ canvas in OmniCut.

**Architecture:**
1. **AI B-Roll Auto-Inserter**:
   - Build `AutoBRollModal.tsx` in `components/Modals/` with intelligent keyword extraction, Pexels/Pixabay mock stock footage matcher, relevance scoring, and 1-click batch insertion into timeline track `V2` aligned to speech scene boundaries.
   - Wire trigger button `✨ Auto-B-Roll` in `AssetBin.tsx` and `Header.tsx`.
2. **Dynamic FFT Audio Spectrum EQ Canvas**:
   - Upgrade `AudioMixerWorkspace.tsx` with a live interactive `<canvas>` rendering 32-band real-time audio FFT bars, a smooth parametric biquad curve with draggable EQ nodes (Low Shelf 100Hz, Mid Presence 1.5kHz, High Air 10kHz), and live gain reduction dynamics.

**Tech Stack:** Next.js 15, React 19, HTML5 Canvas API, TypeScript, Tailwind CSS, Lucide React.

**Spec:** `AssetBin.tsx`, `AudioMixerWorkspace.tsx`, `page.tsx`.

## Global Constraints
- Clean-Room Route B compliant (Zero GPL/AGPL copyleft libraries).
- Strictly adhere to dark Premiere / DaVinci Resolve aesthetic.
- TypeScript compiler (`tsc --noEmit`) must pass with 0 errors.

---

### Task 1: Build AI B-Roll Auto-Inserter Modal & Timeline Insertion

**Files:**
- Create: `apps/web/src/components/Modals/AutoBRollModal.tsx`
- Modify: `apps/web/src/components/LeftPanel/AssetBin.tsx`
- Modify: `apps/web/src/app/page.tsx`

- [ ] **Step 1: Create AutoBRollModal with keyword extraction, clip catalog, and relevance badges**
- [ ] **Step 2: Add trigger in AssetBin ("Auto B-Roll")**
- [ ] **Step 3: Wire batch insertion to track V2 at speech scene boundaries in page.tsx**

---

### Task 2: Interactive Dynamic FFT Audio Spectrum EQ Canvas

**Files:**
- Modify: `apps/web/src/components/Workspaces/AudioMixerWorkspace.tsx`

- [ ] **Step 1: Build Canvas FFT spectrum visualizer reacting to playback**
- [ ] **Step 2: Render parametric EQ curve overlay with interactive control nodes**
- [ ] **Step 3: Add Master Gain Reduction meter & YouTube LUFS broadcast meter**

---

### Task 3: Compilation, Test & Live Browser Verification

**Files:**
- Verify: `npx tsc --noEmit` in `apps/web`
- Browser: `http://localhost:3000`

- [ ] **Step 1: Run TypeScript compiler to ensure 0 errors**
- [ ] **Step 2: Run browser subagent to verify Auto B-Roll modal and live FFT spectrum EQ in Audio workspace**
