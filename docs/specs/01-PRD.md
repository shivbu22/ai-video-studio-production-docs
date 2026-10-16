# 01 - Product Requirements Document (PRD)

**Product:** AI Video Studio  
**Status:** Approved for Build (Route B Clean-Room)  
**Version:** 1.0 — Production Spec  
**Target Platform:** Modern Web Browsers (Windows, macOS, Linux). Zero local installs.

---

## 1. Executive Summary & Vision

AI Video Studio transforms a topic brief and voiceover into a finished 1080p video, vertical Shorts/Reels, thumbnails, and a publish-ready metadata pack in one browser-based workflow.

While competing solutions like Slot Studio are sold as local desktop folders running inside the Claude desktop app on Apple Silicon Macs (M1+) requiring users to manage their own paid Claude plans and endure 95-minute local renders, AI Video Studio is built as a true web-native SaaS platform. It offloads compute to a high-speed server-side render queue, works across all operating systems, provides an interactive multi-track timeline with transcript-based cutting, and connects to external AI assistants over the Model Context Protocol (MCP).

---

## 2. Competitive Comparison: Slot Studio vs. AI Video Studio

| Attribute | Slot Studio | AI Video Studio (Our Platform) |
|---|---|---|
| **Product Form** | Claude Project folder running in Claude Desktop | Full Web Application (Next.js 15 + FastAPI) |
| **Operating System** | Mac Only (Apple Silicon M1+ required) | Windows, macOS, Linux (Any modern browser) |
| **AI Model Costs** | User must bring their own Claude subscription | Controlled per-stage (cheap models for cleanup, frontier for script) |
| **Pricing Model** | Rs 24,999 - 34,999 one-time + GST | Subscription & Render Credits (1 Credit = 1 Min 1080p render) |
| **Visual Sources** | Scrapes YouTube clips and web photos | Licensed stock (Pexels/Pixabay) + Cloud AI image generation |
| **Rendering** | Local (approx. 95 mins for a 6-min video on M5) | Server render queue; fast 540p previews, 1080p/4K master renders |
| **Editing Interface** | Static script edits before rendering | Interactive multi-track timeline + transcript-based cutting |
| **Agent Interface** | Claude desktop chat only | Open Streamable HTTP MCP server for Claude Code, Codex, Cursor |

---

## 3. Target User Personas

1. **Digital Agency & Content Teams (e.g., Pixalified):**
   - High volume requirements: Producing 15-30 educational and explainer videos per month.
   - Core Need: Predictable turnaround times, brand consistency (fonts/colors/logos), and zero local machine freeze during renders.
2. **Solo Creators & Educators:**
   - Script-heavy workflows: Need quick factual research, cited claims, and automated motion graphics without learning After Effects or Premiere.
   - Core Need: Uploading voice recordings and instantly getting synced charts, b-roll, captions, and vertical Shorts.
3. **Growth Marketers & Repurposers:**
   - Multi-platform publishing: Need 1 horizontal master cut automatically cropped into 2-3 engaging vertical 9:16 Shorts with burned-in captions for TikTok/Reels.

---

## 4. The 10-Stage Pipeline

```
[1. Topic Brief] ──> [2. Research Brief] ──> [3. Scene Script] ──> [4. Voice Track] ──> [5. Audio Cleanup & Timings]
                                                                                                  │
                                                                                                  ▼
[10. Master Render & Pack] <── [9. Timeline Edit] <── [8. Motion Graphics] <── [7. Asset Sourcing] <── [6. Visual Storyboard]
```

1. **Topic Brief:** User specifies topic title, target length (1-30 min), language (English default, Hinglish supported), and style preset.
2. **Research Brief:** Autonomous web search extracting key claims with source URLs and confidence scores.
3. **Scene Script:** Hook, structured scenes, narration, estimated durations, and visual intent formatted as JSON.
4. **Voice Track:** Voiceover upload (WAV/MP3/M4A), in-browser microphone recording, or cloud TTS generation.
5. **Audio Cleanup & Timings:** `faster-whisper` transcription for word-level timestamps; silence and breath reduction yielding `voice_clean.wav`.
6. **Visual Storyboard:** Matches each scene with b-roll queries, motion graphic templates, or AI image prompts.
7. **Asset Sourcing & Generation:** Downloads Pexels/Pixabay licensed media or triggers cloud diffusion image generation with provenance tracking.
8. **Motion Graphics:** Remotion React templates rendering charts, comparisons, quotes, tier lists, and stat counters.
9. **Timeline Edit:** Multi-track canvas supporting clip trimming, splitting, transcript-based word deletions, and MCP proposal diffs.
10. **Master Render & Publish Pack:** Headless Remotion composition render (540p preview or 1080p master), -14 LUFS loudness ducking, vertical 9:16 Short auto-cuts, 3 thumbnail variations, and complete metadata package (.zip).

---

## 5. Scope Boundaries by Phase

### Phase 0: Validation Spike (5-7 Days)
- Zero-UI CLI pipeline testing: research brief, script generation, Whisper cleanup, 3 Remotion templates, ffmpeg assembly.
- Exit Gate: 1 postable 3-5 minute video for Pixalified; verified unit costs; timeline behavior specification.

### Phase 1: MVP Platform (6-8 Weeks)
- Web application (Next.js 15, FastAPI, Celery, Postgres, R2/S3).
- Full 10-stage pipeline with guided UI navigation and approval gates.
- 6 Remotion templates (Bar, Line, Comparison, Tier list, Quote, Stat counter).
- Interactive scene timeline and transcript cutting.
- 540p fast preview and 1080p master rendering.
- Exit Gate: 5 complete videos produced through the UI without developer assistance.

### Phase 2: Sellable v1 (+4-6 Weeks)
- Stripe billing integration and append-only credit ledger.
- Streamable HTTP MCP server for external AI agent editing sessions.
- Cloud TTS (ElevenLabs / OpenAI) and ComfyUI generation adapter.
- 12+ Remotion templates, channel brand kits, and project zip archive export.
- Exit Gate: First paying creator completes a video; an external AI agent edits a project draft over MCP that the creator approves.

### Phase 3: v2 Polish (Ongoing)
- 4K master rendering tier, Hindi/Hinglish deep tuning, team workspaces, local GPU backend adapter.

---

## 6. User Stories & Acceptance Criteria

- **US-1 (Script Review):** As a creator, I want to review and edit generated script scenes before any media is fetched or rendered, so that I don't waste compute on incorrect text.
  - *Acceptance:* Script approval gate is mandatory; editing narration dynamically updates scene duration estimate.
- **US-2 (Transcript Cut):** As an editor, I want to delete filler words directly in the transcript and have the audio and video tracks slice automatically.
  - *Acceptance:* Backspacing a word in the transcript editor deletes the corresponding time slice across all active tracks and closes the gap.
- **US-3 (Agent Review):** As a user, I want external AI assistants to propose timeline edits in a review pane, so that an AI cannot silently destroy my project.
  - *Acceptance:* MCP tool edits create an isolated draft proposal; user clicks "Accept" to apply as a single undo step or "Reject" to discard.
- **US-4 (Fair Billing):** As a customer, I want render credits to be deducted only when a master video renders successfully.
  - *Acceptance:* Render credits are held at job start and captured only on completion. 540p previews cost 0 credits.
