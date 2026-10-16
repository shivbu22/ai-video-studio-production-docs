# Phase 0: Pipeline Validation Spike

This CLI pipeline validates the core 10-stage AI Video Studio pipeline end-to-end with **zero web UI overhead**.

## What this spike proves:
1. **Research & Scripting:** Factual research extraction with real source URLs.
2. **Audio Processing:** Word-level timestamps via `faster-whisper` and silence reduction via `ffmpeg`.
3. **Motion Graphics:** Headless Remotion composition rendering (Bar chart, Comparison, Quote).
4. **Final Assembly:** ffmpeg audio ducking (-14 LUFS) and vertical 9:16 Short cut.
5. **Unit Economics:** Exact runtime measurement and cost per finished video minute.

## Running the Spike:
```bash
python spike/run_spike.py --topic "The Future of AI Video Production in 2026" --duration 180
```
