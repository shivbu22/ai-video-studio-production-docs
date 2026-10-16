# 04 - UI/UX Design and Interaction Specification

**Product:** AI Video Studio Web Application  
**Target Resolution:** Desktop Optimized (1280px minimum width), Tablet Responsive.  
**Design System:** Dark Mode First (`bg-slate-950`), Tailwind CSS, Accessible (WCAG 2.2 AA).

---

## 1. Design Principles

1. **Approval Gates are the Design:**
   Expensive compute steps (voiceover generation, master 1080p rendering) are never triggered automatically. The creator retains full veto power at Script, Storyboard, and Preview stages.
2. **Nothing the AI Makes is Final:**
   Every AI-generated output (script sentences, stock clips, motion graphic numbers, captions) lands as an immediately editable object in the UI.
3. **Draft Proposals Before Mutations:**
   Changes suggested by in-app conversational assistants or external MCP agents appear in a side-by-side proposal review pane with diff highlights.
4. **Deterministic Progress Feedback:**
   Long-running tasks show real-time progress percentage (0-100%), stage labels, and elapsed timers. Indefinite loading spinners are prohibited.
5. **Direct Manipulation Timeline:**
   The timeline canvas supports fluid scrubbing, drag-to-trim, clip snapping, and one-click ripple delete.

---

## 2. Screen Map & Application Shell

```
[ App Shell Header: Project Title | Stage Stepper (1-10) | Credit Balance Badge | Render Button ]
┌──────────────────────────────┬──────────────────────────────────────────────────────────────┐
│ Left Panel:                  │ Main Canvas:                                                 │
│ • Stage Navigation           │ • Active Stage Workspace (Script, Storyboard, or Preview)    │
│ • Media Library & Assets     │ • Real-time Video Player (540p scrubber)                     │
│ • Inspector / Settings       ├──────────────────────────────────────────────────────────────┤
│ • Agent Proposals Pane       │ Bottom Area: Multi-Track Timeline Canvas                     │
│                              │ [Video Track | Graphics Track | Audio Track | Captions Track]│
└──────────────────────────────┴──────────────────────────────────────────────────────────────┘
```

---

## 3. Screen-by-Screen Specifications

### Screen 1: Dashboard (`/dashboard`)
- Recent projects grid showing thumbnail preview, title, target duration, stage badge, and last modified date.
- "New Project" primary action button triggering topic brief modal.
- Credit balance display with top-up quick link.

### Screen 2: Topic & Brief Intake (Stage 1)
- Form inputs: Project title, core topic description, target duration slider (1 to 30 mins), primary language selector (English, Hindi/Hinglish), and channel tone preset (Educational, Dramatic, Fast-Paced Tech).
- "Start Research & Script" action button that charges 0 credits and initiates background research.

### Screen 3: Research & Script Editor (Stages 2-3)
- Left column: Extracted factual claims list with source URLs, publication dates, and confidence tags.
- Center/Right column: Scene-by-scene script cards. Each card displays:
  - Scene order badge (`Scene 01`, `Scene 02`).
  - Editable hook / narration text area.
  - Calculated duration badge (updates in real time based on 150 WPM speaking cadence).
  - Visual intent tag and suggested motion graphics template chip.
  - "Approve Script & Proceed" sticky footer action.

### Screen 4: Voiceover & Audio Cleanup (Stages 4-5)
- Tabbed selector: "Upload Voice Recording", "Record in Browser", or "Generate AI Voice (ElevenLabs)".
- Waveform visualizer showing raw audio vs. cleaned audio.
- Audio cleanup controls: "Remove Breaths" (toggle), "Truncate Pauses > 800ms" (toggle), "High-Pass Filter 80Hz" (toggle).
- Transcript review pane displaying words synced with waveform playback.

### Screen 5: Visual Storyboard & Sourcing (Stages 6-7)
- Grid of scenes matching the approved script.
- Each scene card provides:
  - Assigned visual media thumbnail (Stock video, AI image, or Remotion template).
  - "Swap Shot" button opening media drawer with Pexels/Pixabay stock search and AI generation prompt box.
  - Duration trim handles.

### Screen 6: Interactive Timeline Editor (Stages 8-9)
- Multi-track timeline canvas:
  - **Track 1 (Captions):** Dynamic word-synced subtitles.
  - **Track 2 (Motion Graphics):** Data-driven Remotion composition blocks.
  - **Track 3 (Video / B-Roll):** Stock footage and image clips.
  - **Track 4 (Voiceover):** Master cleaned speech audio track.
  - **Track 5 (Background Music):** Music track with automated sidechain ducking indicators.
- Scrubbing playhead locked to 30 fps.
- Keyboard shortcuts: `Space` (Play/Pause), `S` (Split at playhead), `Delete` (Ripple delete), `Ctrl+Z` (Undo), `Ctrl+Shift+Z` (Redo).

### Screen 7: Transcript-Based Cutting Mode
- Text editor displaying full speech transcript.
- Selecting words reveals quick action bar: "Cut", "Silence", "Insert Pause".
- Backspacing text ripples through the timeline, removing corresponding audio/video segments.

### Screen 8: Render Queue & Publish Pack (Stage 10)
- "Generate 540p Preview" button (Instant, 0 credits).
- "Render Master 1080p MP4" button displaying exact credit quote (`e.g., "5 Credits required"`).
- Render progress modal displaying frame count (`Frame 1420 / 4500`), ETA, and CPU worker status.
- Completed view:
  - Master 1080p video player with download button.
  - Vertical 9:16 Shorts gallery (auto-cut highlights).
  - 3 AI-generated thumbnail options with text title overlays.
  - YouTube copy-paste drawer (Title, Description, Chapters, Hashtags).
  - "Download Complete Publish Pack (.zip)" button.

---

## 4. Accessibility & UI Compliance (WCAG 2.2 AA)

- **Contrast:** Text maintains a minimum 4.5:1 contrast ratio against dark backgrounds.
- **Keyboard Navigation:** All buttons, timeline clips, and modal dialogs are fully navigable via `Tab`, `Arrow keys`, and `Enter`.
- **Focus Indicators:** High-visibility focus rings (`focus:ring-2 focus:ring-blue-500`) on all interactive controls.
- **Screen Reader Support:** ARIA live regions announce background job status transitions (`"Transcription completed"`, `"Render started"`).
