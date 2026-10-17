"use client";

import React, { useState } from "react";
import { 
  Mic, 
  Volume2, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Scissors, 
  Sparkles, 
  Sliders, 
  Activity,
  AudioLines,
  UploadCloud,
  Check
} from "lucide-react";

interface VoiceCleanupWorkspaceProps {
  onApplyCleanAudio?: () => void;
}

export const VoiceCleanupWorkspace: React.FC<VoiceCleanupWorkspaceProps> = ({
  onApplyCleanAudio,
}) => {
  const [activeTake, setActiveTake] = useState<"raw" | "clean">("clean");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [debreathSensitivity, setDebreathSensitivity] = useState(85);
  const [fillerCutThreshold, setFillerCutThreshold] = useState(90);
  const [hasApplied, setHasApplied] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);

  // Animate playback needle
  React.useEffect(() => {
    if (!isPlaying) return;
    const durationMs = activeTake === "raw" ? 7400 : 4700;
    const interval = setInterval(() => {
      setPlayProgress((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 0;
        }
        return prev + (100 / (durationMs / 40));
      });
    }, 40);
    return () => clearInterval(interval);
  }, [isPlaying, activeTake]);

  const handleTogglePlay = () => {
    if (!isPlaying && playProgress >= 100) {
      setPlayProgress(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleApply = () => {
    setHasApplied(true);
    if (onApplyCleanAudio) {
      onApplyCleanAudio();
    }
    setTimeout(() => setHasApplied(false), 3000);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0b0e14] text-slate-200 select-none">
      {/* LEFT COLUMN: Audio Ingestion & DSP Controls */}
      <div className="w-84 border-r border-slate-800/80 bg-[#101319] flex flex-col shrink-0">
        <div className="p-3 border-b border-slate-800 bg-[#14171d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AudioLines className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white tracking-wide">VOICEOVER SURGICAL DSP</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">
            faster-whisper
          </span>
        </div>

        {/* Input Methods: Mic Recording or File Upload */}
        <div className="p-4 border-b border-slate-800 bg-[#0d0f14] space-y-3">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Audio Track Intake
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => setIsRecording(!isRecording)}
              className={`p-2.5 rounded border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                isRecording 
                  ? "bg-red-950/40 border-red-500 text-red-300 animate-pulse" 
                  : "bg-[#161a22] border-slate-700/60 text-slate-300 hover:border-slate-600"
              }`}
            >
              <Mic className={`w-4 h-4 ${isRecording ? "text-red-400" : "text-slate-400"}`} />
              <span>{isRecording ? "Recording..." : "Record Mic"}</span>
            </button>

            <button className="p-2.5 rounded border border-slate-700/60 bg-[#161a22] text-xs font-semibold text-slate-300 hover:border-slate-600 flex flex-col items-center gap-1.5 transition-all">
              <UploadCloud className="w-4 h-4 text-slate-400" />
              <span>Upload WAV/MP3</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Record once and keep talking. SlotStudio cuts every breath, filler word, and false start without clipping a single phoneme.
          </p>
        </div>

        {/* Surgical Threshold Knobs */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            AI Removal Filters
          </div>

          {/* Breath Reduction */}
          <div className="space-y-1.5 bg-[#14171d] p-3 rounded border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-200">Breath Attenuation</span>
              <span className="font-mono text-emerald-400">{debreathSensitivity}% (-28 dB)</span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              value={debreathSensitivity}
              onChange={(e) => setDebreathSensitivity(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <p className="text-[10px] text-slate-500">
              Isolates deep inhalations via spectral formants and silences them.
            </p>
          </div>

          {/* Filler Um/Uh Cuts */}
          <div className="space-y-1.5 bg-[#14171d] p-3 rounded border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-200">Filler Word Detection</span>
              <span className="font-mono text-amber-400">{fillerCutThreshold}% Strict</span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              value={fillerCutThreshold}
              onChange={(e) => setFillerCutThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <p className="text-[10px] text-slate-500">
              Excises hesitation tokens (&quot;um&quot;, &quot;uh&quot;, &quot;like&quot;, &quot;you know&quot;) with zero clip pop.
            </p>
          </div>

          {/* Highpass filter */}
          <div className="p-3 bg-[#14171d] rounded border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-200">80Hz Subsonic Highpass</p>
              <p className="text-[10px] text-slate-400">Eliminates desk rumble &amp; plosives</p>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
              Enabled
            </span>
          </div>

          {/* Cloud Voice Option */}
          <div className="p-3 bg-gradient-to-br from-violet-950/20 to-slate-900 rounded border border-violet-500/30">
            <p className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              Want an AI Voice Instead?
            </p>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Connect ElevenLabs in Connections tab. Generates natural cloned voiceovers directly matching your script scenes.
            </p>
          </div>
        </div>
      </div>

      {/* CENTER STAGE: Dual Waveform Display & Word Transcript */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#0d0f14]">
        {/* Top Playback & Cut Counter Header */}
        <div className="h-12 px-6 border-b border-slate-800 bg-[#12151b] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button 
              onClick={handleTogglePlay}
              className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-950/40 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            {/* Raw vs Clean Toggle (SlotStudio exact UX) */}
            <div className="flex items-center bg-[#161a22] border border-slate-700/80 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => {
                  setActiveTake("raw");
                  setPlayProgress(0);
                }}
                className={`px-3 py-1 rounded font-medium transition-all ${
                  activeTake === "raw"
                    ? "bg-amber-600/90 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Raw Take (7.4s)
              </button>
              <button
                onClick={() => {
                  setActiveTake("clean");
                  setPlayProgress(0);
                }}
                className={`px-3 py-1 rounded font-medium transition-all ${
                  activeTake === "clean"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Clean Take (4.7s)
              </button>
            </div>
          </div>

          {/* Cut Statistics Pill (SlotStudio exact tagline) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#161a22] border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-mono">
              <span className="text-amber-400 font-bold">3 cuts</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                0 words clipped
              </span>
            </div>

            <button 
              onClick={handleApply}
              className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded shadow-lg shadow-emerald-950/40 active:scale-95 transition-all"
            >
              {hasApplied ? <Check className="w-3.5 h-3.5" /> : <Scissors className="w-3.5 h-3.5" />}
              <span>{hasApplied ? "Applied to Timeline!" : "Apply to A1 Track"}</span>
            </button>
          </div>
        </div>

        {/* Main Stage: Waveform Visualizer & Transcript */}
        <div className="flex-1 flex flex-col p-8 items-center justify-center space-y-6 overflow-y-auto">
          {/* SlotStudio Headline Callout */}
          <div className="text-center max-w-xl">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Every breath. Every um. Gone.
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              It cuts every breath, every um and every sentence you started twice, without clipping a single word.
            </p>
          </div>

          {/* Dual Waveform Card */}
          <div className="w-full max-w-2xl bg-[#14171d] rounded-xl border border-slate-800 p-5 space-y-4 shadow-2xl">
            {/* Raw Take Waveform */}
            <div className={`space-y-1 transition-opacity ${activeTake === "raw" ? "opacity-100 ring-1 ring-amber-500/40 rounded-lg p-1" : "opacity-60"}`}>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  Raw Take Waveform
                </span>
                <span className="text-red-400 font-bold">0:07.4</span>
              </div>
              <div className="h-14 bg-[#0a0c10] rounded border border-slate-800 p-2 flex items-center justify-between relative overflow-hidden">
                {/* Scanning Playhead Needle */}
                {activeTake === "raw" && (
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-20 shadow-[0_0_8px_rgba(251,191,36,0.8)] pointer-events-none transition-[left] duration-75"
                    style={{ left: `${playProgress}%` }}
                  />
                )}
                {/* Simulated Waveform Bars with breath bursts in red */}
                <div className="w-full flex items-center justify-around h-full">
                  <span className="w-1.5 h-10 bg-red-500 rounded-full animate-pulse" title="Inhale Breath (-12dB)"></span>
                  <span className="w-1 h-3 bg-slate-600 rounded-full"></span>
                  <span className="w-1.5 h-6 bg-slate-500 rounded-full"></span>
                  <span className="w-2 h-11 bg-amber-400 rounded-full" title="Hesitation 'um'"></span>
                  <span className="w-1 h-4 bg-slate-600 rounded-full"></span>
                  <span className="w-2 h-9 bg-red-400 rounded-full" title="False start sentence"></span>
                  <span className="w-1.5 h-7 bg-slate-500 rounded-full"></span>
                  <span className="w-2 h-12 bg-slate-400 rounded-full"></span>
                  <span className="w-1.5 h-8 bg-slate-500 rounded-full"></span>
                  <span className="w-2 h-11 bg-slate-400 rounded-full"></span>
                  <span className="w-1.5 h-5 bg-slate-600 rounded-full"></span>
                </div>
                <div className="absolute top-1 left-2 text-[9px] font-mono text-red-400 bg-red-950/40 px-1 rounded border border-red-800/40">
                  Breath &amp; Fillers Tagged
                </div>
              </div>
            </div>

            {/* Clean Take Waveform */}
            <div className={`space-y-1 transition-opacity ${activeTake === "clean" ? "opacity-100 ring-1 ring-emerald-500/40 rounded-lg p-1" : "opacity-60"}`}>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Clean Take (voice_clean.wav)
                </span>
                <span className="text-emerald-400 font-bold">0:04.7 (-2.7s cut)</span>
              </div>
              <div className="h-14 bg-[#0a0c10] rounded border border-emerald-500/30 p-2 flex items-center justify-between relative overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.08)]">
                {/* Scanning Playhead Needle */}
                {activeTake === "clean" && (
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-emerald-400 z-20 shadow-[0_0_8px_rgba(52,211,153,0.8)] pointer-events-none transition-[left] duration-75"
                    style={{ left: `${playProgress}%` }}
                  />
                )}
                {/* Pristine Clean Bars without gaps */}
                <div className="w-full flex items-center justify-around h-full">
                  <span className="w-1.5 h-6 bg-emerald-400 rounded-full"></span>
                  <span className="w-2 h-10 bg-emerald-400 rounded-full"></span>
                  <span className="w-1.5 h-7 bg-emerald-400 rounded-full"></span>
                  <span className="w-2 h-12 bg-emerald-400 rounded-full"></span>
                  <span className="w-1.5 h-9 bg-emerald-400 rounded-full"></span>
                  <span className="w-2 h-11 bg-emerald-400 rounded-full"></span>
                  <span className="w-1.5 h-6 bg-emerald-400 rounded-full"></span>
                </div>
                <div className="absolute top-1 left-2 text-[9px] font-mono text-emerald-300 bg-emerald-950/40 px-1 rounded border border-emerald-800/40">
                  Normalized -14.0 LUFS • 0 Words Clipped
                </div>
              </div>
            </div>

            {/* Interactive Word Strikethrough Transcript */}
            <div className="pt-3 border-t border-slate-800">
              <div className="text-[10px] font-mono uppercase text-slate-400 mb-2">
                Transcript Diff (faster-whisper Word Alignment)
              </div>
              <div className="bg-[#0e1117] p-4 rounded-lg border border-slate-800 text-sm leading-loose">
                <span className="line-through text-red-400 bg-red-950/50 px-1.5 py-0.5 rounded mr-1 font-mono text-xs border border-red-800/40" title="Cut 0.42s breath">
                  (breath)
                </span>
                <span className="text-white font-medium mr-1">So</span>
                <span className="line-through text-amber-400 bg-amber-950/50 px-1.5 py-0.5 rounded mr-1 font-mono text-xs border border-amber-800/40" title="Cut filler um">
                  um,
                </span>
                <span className="line-through text-red-400 bg-red-950/50 px-1.5 py-0.5 rounded mr-1 font-mono text-xs border border-red-800/40" title="Healed false start">
                  the best way—
                </span>
                <span className="text-emerald-300 font-semibold bg-emerald-950/30 px-1 py-0.5 rounded border border-emerald-500/20">
                  the best way to grow is to stay consistent.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
