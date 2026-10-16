# 05 - AI Pipeline and Media Processing Contract

**Product:** AI Video Studio Pipeline  
**Execution Runtime:** Celery 5.3+ Workers, Python 3.11+, ffmpeg 6.0+, Node.js 20+  
**Intermediates Standard:** Audio: 48 kHz 24-bit mono WAV. Video: 30 fps Remotion Compositions.

---

## 1. Universal Stage Manifest Schema

Every pipeline stage reads from and writes to a versioned manifest stored in Cloudflare R2 / S3:

```json
{
  "$schema": "https://api.aivideostudio.app/schemas/manifest.v1.json",
  "project_id": "proj_123456",
  "stage": "cleanup",
  "stage_version": 2,
  "inputs": [
    {
      "storage_key": "projects/proj_123456/assets/raw_voice.wav",
      "checksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "size_bytes": 14205840,
      "media_type": "audio/wav"
    }
  ],
  "outputs": [
    {
      "storage_key": "projects/proj_123456/stages/cleanup/v2/voice_clean.wav",
      "checksum": "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
      "size_bytes": 11840200,
      "media_type": "audio/wav"
    }
  ],
  "model_telemetry": {
    "provider": "faster-whisper",
    "model": "base.en",
    "compute_device": "cpu",
    "inference_time_ms": 4200
  },
  "rights": [
    {
      "asset_key": "projects/proj_123456/assets/raw_voice.wav",
      "source": "user_upload",
      "licence_type": "owner_copyright"
    }
  ],
  "status": "passed",
  "error": null
}
```

---

## 2. Stage-by-Stage Processing Specifications

### Stage 1: Topic Intake
- Input: User topic prompt and preferences.
- Processing: Validates duration (60-1800s), language tag, and creates root project record.

### Stage 2: Research & Fact Extraction
- Input: Topic title and duration.
- Tooling: Tavily Search API / Perplexity API.
- LLM: Claude 3.5 Sonnet / GPT-4o with structured JSON schema output.
- Output: Research brief containing 3-8 key claims, each tied to a valid `source_url` and `source_title`.

### Stage 3: Script & Scene Sequence
- Input: Research brief claims.
- Prompt Engineering: Structured system prompt enforcing scene breakdown: Hook (0-15s), Core Narrative (in 3-5 distinct scenes), and Outro/CTA.
- Output: Array of scenes with narration, visual intent, and Remotion template suggestions.

### Stage 4: Voiceover Ingestion / TTS
- Mode A (Upload/Record): Validates audio header with `ffprobe`, resamples to 48 kHz 24-bit mono WAV.
- Mode B (AI TTS): ElevenLabs API (`eleven_turbo_v2_5`) or OpenAI TTS (`tts-1-hd`). Outputs 48 kHz WAV.

### Stage 5: Speech Alignment & Audio Cleanup
- Transcription Engine: Self-hosted `faster-whisper` (`base` or `small` model, int8 quantization, beam size 5).
- Word Timings: Extracts exact start/end millisecond timestamps per word.
- Silence Reduction: `ffmpeg -af silencedetect=noise=-30dB:d=0.8`. Cuts non-speech gaps exceeding 800ms down to 250ms with 15ms cross-fades.
- Output: `voice_clean.wav` and updated word timestamp array.

### Stage 6: Visual Storyboard Matching
- Input: Scene narration and visual intent.
- Matching Logic: LLM determines whether each scene is best served by a data graphic (e.g. statistics, comparisons) or b-roll footage.
- Output: Storyboard manifest with search queries for stock media or template IDs.

### Stage 7: Asset Sourcing & Generative AI
- Stock Adapter: Pexels API / Pixabay API. Searches for HD vertical/horizontal video clips, downloads MP4s, extracts license metadata.
- Generative Adapter: OpenAI-compatible `/v1/images/generations` (fal.ai Flux / SDXL). Stores prompt, seed, and model name in asset metadata.

### Stage 8: Motion Graphics Compilation
- Engine: Remotion React component tree.
- Data Binding: Script statistics and comparison values inject directly into React template props.
- Output: Composition manifest defining frame duration, dimensions, and transition springs.

### Stage 9: Interactive Timeline Assembly
- State Representation: Immutable track-and-clip JSON document.
- Operations: Non-destructive trim, split, reorder, and ripple edits.
- MCP Bridge: External agent edit sessions create isolated proposal diffs against `base_version`.

### Stage 10: Master Render & Loudness Normalization
- Preview Tier: Remotion CLI renders 540p MP4 (CRF 28, fast preset) in < 2 minutes.
- Master Tier: Remotion CLI renders 1080p MP4 (H.264 High Profile, CRF 18, 30 fps).
- Audio Mixing Filter Chain:
```bash
ffmpeg -y -i master_video.mp4 -i background_music.mp3 -filter_complex "[1:a]asplit[sc][music];  [0:a][sc]sidechaincompress=threshold=0.125:ratio=4:attack=50:release=300[ducked];  [0:a][ducked]amix=inputs=2[mixed];  [mixed]loudnorm=I=-14:TP=-1.0:LRA=11[aout]" -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 192k output_master.mp4
```
- Publish Pack Packaging:
  - 1-3 vertical 9:16 Shorts cropped via ffmpeg `crop=ih*9/16:ih`.
  - 3 PNG thumbnails rendered from key composition frames.
  - Complete `.zip` archive assembled with `metadata.txt`.
