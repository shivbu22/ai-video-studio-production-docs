"use client";

import React, { useState } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Smartphone, 
  Tv, 
  Volume2, 
  VolumeX, 
  Grid, 
  Sparkles, 
  Square, 
  BarChart3, 
  Trophy, 
  FileText, 
  Layers, 
  Video, 
  CheckCircle2 
} from "lucide-react";
import { TimelineClip } from "./Timeline/TimelineCanvas";

interface ProgramMonitorProps {
  currentTimeMs: number;
  totalDurationMs: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (timeMs: number) => void;
  aspectRatio: "16:9" | "9:16" | "1:1";
  onAspectRatioChange: (ratio: "16:9" | "9:16" | "1:1") => void;
  currentSceneTitle?: string;
  currentTemplateName?: string;
  activeLut?: string;
  activeClip?: TimelineClip | null;
}

type TemplatePreviewMode = "auto" | "barchart" | "tierlist" | "paper" | "exploded" | "counter" | "youtube";

export const ProgramMonitor: React.FC<ProgramMonitorProps> = ({
  currentTimeMs,
  totalDurationMs,
  isPlaying,
  onTogglePlay,
  onSeek,
  aspectRatio,
  onAspectRatioChange,
  currentSceneTitle = "Quantum Supremacy Benchmark",
  currentTemplateName = "BarChart",
  activeLut = "Moody Teal & Orange",
  activeClip = null,
}) => {
  const [safeMargins, setSafeMargins] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [previewMode, setPreviewMode] = useState<TemplatePreviewMode>("auto");

  // Determine active visual style: manual override takes priority, otherwise infer from active clip or playhead time
  const resolveActiveStyle = (): TemplatePreviewMode => {
    if (previewMode !== "auto") return previewMode;

    if (activeClip) {
      const title = (activeClip.title || "").toLowerCase();
      if (title.includes("tier") || title.includes("ranking")) return "tierlist";
      if (title.includes("paper") || title.includes("citation") || title.includes("study")) return "paper";
      if (title.includes("exploded") || title.includes("layer")) return "exploded";
      if (title.includes("stat") || title.includes("counter")) return "counter";
      if (title.includes("bar") || title.includes("chart")) return "barchart";
      if (title.includes("youtube") || title.includes("clip")) return "youtube";
    }

    if (currentTimeMs < 3000) return "youtube";
    if (currentTimeMs < 8500) return "barchart";
    if (currentTimeMs < 12000) return "counter";
    return "paper";
  };

  const activeStyle = resolveActiveStyle();

  // Format milliseconds into SMPTE Timecode HH:MM:SS:FF (at 30fps)
  const formatTimecode = (ms: number) => {
    const totalFrames = Math.floor((ms / 1000) * 30);
    const frames = totalFrames % 30;
    const totalSeconds = Math.floor(ms / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(frames).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full bg-[#05060a] border-r border-white/5 select-none font-sans">
      {/* Monitor Header Toolbar */}
      <div className="h-10 px-3 bg-[#0a0c12] border-b border-white/5 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="font-bold text-white tracking-wide text-xs flex items-center gap-1.5">
            <Tv className="w-3.5 h-3.5 text-[#3B63FF]" />
            <span>Program Monitor</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5 hidden md:inline">
            4K UHD · 3840x2160 (60fps)
          </span>
          {activeLut && (
            <span className="flex items-center gap-1 text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">
              <Sparkles className="w-2.5 h-2.5" />
              <span>LUT: {activeLut}</span>
            </span>
          )}
        </div>

        {/* Aspect Ratio, Grid & Safe Margins */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Rule-of-Thirds Grid"
            className={`p-1.5 rounded text-[10px] transition-colors ${
              showGrid ? "bg-[#3B63FF]/20 text-[#3B63FF] border border-[#3B63FF]/50" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setSafeMargins(!safeMargins)}
            title="Toggle Broadcast Safe Margins (Title/Action Safe)"
            className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
              safeMargins ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Safe Margins
          </button>

          <div className="flex items-center bg-[#05060a] border border-white/10 rounded p-0.5">
            <button
              onClick={() => onAspectRatioChange("16:9")}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                aspectRatio === "16:9" ? "bg-[#3B63FF] text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Tv className="w-3 h-3" />
              <span>16:9</span>
            </button>
            <button
              onClick={() => onAspectRatioChange("9:16")}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                aspectRatio === "9:16" ? "bg-[#3B63FF] text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>9:16</span>
            </button>
            <button
              onClick={() => onAspectRatioChange("1:1")}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                aspectRatio === "1:1" ? "bg-[#3B63FF] text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Square className="w-3 h-3" />
              <span>1:1</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slot Studio Motion Template Quick-Preview Strip */}
      <div className="h-8 px-3 bg-[#08090f] border-b border-white/5 flex items-center gap-1 text-[11px] overflow-x-auto select-none">
        <span className="text-[9px] uppercase tracking-wider font-mono text-slate-500 mr-1.5 flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-[#3B63FF]" />
          <span>Stage:</span>
        </span>
        <button
          onClick={() => setPreviewMode("auto")}
          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
            previewMode === "auto" ? "bg-[#3B63FF] text-white shadow-sm" : "bg-white/5 text-slate-400 hover:text-white"
          }`}
        >
          Auto (Timeline)
        </button>
        <button
          onClick={() => setPreviewMode("barchart")}
          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all flex items-center gap-1 ${
            previewMode === "barchart" ? "bg-[#3B63FF] text-white shadow-sm" : "bg-white/5 text-slate-400 hover:text-white"
          }`}
        >
          <BarChart3 className="w-2.5 h-2.5" />
          <span>3D Bar Chart</span>
        </button>
        <button
          onClick={() => setPreviewMode("tierlist")}
          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all flex items-center gap-1 ${
            previewMode === "tierlist" ? "bg-[#3B63FF] text-white shadow-sm" : "bg-white/5 text-slate-400 hover:text-white"
          }`}
        >
          <Trophy className="w-2.5 h-2.5" />
          <span>Glass Tier List</span>
        </button>
        <button
          onClick={() => setPreviewMode("paper")}
          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all flex items-center gap-1 ${
            previewMode === "paper" ? "bg-[#3B63FF] text-white shadow-sm" : "bg-white/5 text-slate-400 hover:text-white"
          }`}
        >
          <FileText className="w-2.5 h-2.5" />
          <span>Paper Lift-Off</span>
        </button>
        <button
          onClick={() => setPreviewMode("exploded")}
          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all flex items-center gap-1 ${
            previewMode === "exploded" ? "bg-[#3B63FF] text-white shadow-sm" : "bg-white/5 text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="w-2.5 h-2.5" />
          <span>Exploded 3D</span>
        </button>
        <button
          onClick={() => setPreviewMode("counter")}
          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all flex items-center gap-1 ${
            previewMode === "counter" ? "bg-[#3B63FF] text-white shadow-sm" : "bg-white/5 text-slate-400 hover:text-white"
          }`}
        >
          <Sparkles className="w-2.5 h-2.5" />
          <span>Stat Counter</span>
        </button>
        <button
          onClick={() => setPreviewMode("youtube")}
          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all flex items-center gap-1 ${
            previewMode === "youtube" ? "bg-[#3B63FF] text-white shadow-sm" : "bg-white/5 text-slate-400 hover:text-white"
          }`}
        >
          <Video className="w-2.5 h-2.5" />
          <span>YouTube 4K Clip</span>
        </button>
      </div>

      {/* Video Canvas Stage */}
      <div className="flex-1 flex items-center justify-center p-4 bg-[#05060a] relative overflow-hidden">
        <div
          className={`relative bg-black rounded-xl shadow-2xl border border-white/10 flex items-center justify-center transition-all overflow-hidden ${
            aspectRatio === "16:9"
              ? "w-full max-w-[640px] aspect-video"
              : aspectRatio === "9:16"
              ? "h-full max-h-[440px] aspect-[9/16]"
              : "h-full max-h-[440px] aspect-square"
          }`}
        >
          {/* Active Motion Template Rendering Simulation */}
          <div className="absolute inset-0 flex flex-col justify-between p-5 bg-gradient-to-b from-[#0c0e17] via-[#07080f] to-[#040508] overflow-hidden select-none">
            {/* Top Scene Pill */}
            <div className="flex items-center justify-between z-10">
              <span className="text-[10px] tracking-wider uppercase font-bold bg-[#3B63FF] text-white px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-2.5 h-2.5" />
                <span>
                  {activeStyle === "barchart" && "REMOTION: 3D CHROME BAR CHART"}
                  {activeStyle === "tierlist" && "REMOTION: GLASS TIER LIST"}
                  {activeStyle === "paper" && "REMOTION: PAPER LIFT-OFF CITATION"}
                  {activeStyle === "exploded" && "REMOTION: EXPLODED LAYERS 3D"}
                  {activeStyle === "counter" && "REMOTION: STAT COUNTER 10,000X"}
                  {activeStyle === "youtube" && "4K YOUTUBE SMART SLICE"}
                </span>
              </span>

              <span className="text-[10px] font-mono bg-black/80 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>48kHz · -14.0 LUFS</span>
              </span>
            </div>

            {/* Dynamic Visual Mockup Driven by Active Style */}
            <div className="my-auto flex flex-col items-center justify-center text-center z-10 w-full px-2">
              {activeStyle === "barchart" && (
                /* 3D Chrome Bar Chart on Mirror Floor */
                <div className="space-y-3 flex flex-col items-center w-full max-w-sm animate-in fade-in duration-300">
                  <div className="text-xs md:text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-blue-100 to-white">
                    Benchmark Speedup vs Classical Supercomputer
                  </div>

                  {/* 3D Bar Stage with Ground Reflection */}
                  <div className="relative w-full max-w-[280px] h-32 flex flex-col items-center justify-end">
                    <div className="flex items-end justify-center gap-8 w-full">
                      {/* Bar 1: Summit */}
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-mono text-slate-400 font-semibold">10,000 yrs</span>
                        <div className="w-14 bg-gradient-to-t from-slate-700 via-slate-500 to-slate-400 rounded-t-md h-20 shadow-lg border-t border-l border-white/20" />
                        <span className="text-[9px] text-slate-300 font-bold uppercase tracking-wider">Summit HPC</span>
                      </div>

                      {/* Bar 2: Sycamore */}
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-mono text-emerald-400 font-black flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-emerald-300" />
                          <span>200 sec</span>
                        </span>
                        <div className="w-14 bg-gradient-to-t from-[#3B63FF] via-blue-400 to-cyan-300 rounded-t-md h-28 shadow-[0_0_25px_rgba(59,99,255,0.6)] border-t border-l border-white/40 animate-pulse" />
                        <span className="text-[9px] text-cyan-300 font-bold uppercase tracking-wider">Sycamore QPU</span>
                      </div>
                    </div>

                    {/* Mirror Floor Reflection */}
                    <div className="w-full h-8 flex items-start justify-center gap-8 opacity-25 transform scale-y-[-1] pointer-events-none blur-[0.5px]">
                      <div className="w-14 bg-gradient-to-b from-slate-700 to-transparent rounded-b-md h-12" />
                      <div className="w-14 bg-gradient-to-b from-[#3B63FF] to-transparent rounded-b-md h-16" />
                    </div>

                    {/* Floor Perspective Line */}
                    <div className="absolute bottom-8 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </div>
                </div>
              )}

              {activeStyle === "tierlist" && (
                /* Slot Studio Glass Tier List */
                <div className="space-y-2 flex flex-col items-center w-full max-w-md animate-in fade-in duration-300">
                  <div className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Quantum Architecture Tier Ranking</span>
                  </div>

                  <div className="w-full space-y-1.5 text-left">
                    {/* S Tier */}
                    <div className="flex items-center gap-2.5 bg-rose-950/40 border border-rose-500/40 p-2 rounded-lg backdrop-blur-md shadow-lg shadow-rose-950/30">
                      <span className="w-6 h-6 rounded bg-rose-600 font-black text-white flex items-center justify-center text-xs shadow">S</span>
                      <div className="flex-1">
                        <div className="text-[11px] font-bold text-white">Sycamore 54-Qubit Transmon Array</div>
                        <div className="text-[9px] text-rose-300 font-mono">Quantum Supremacy Target · Coherent Superposition</div>
                      </div>
                      <span className="text-[9px] bg-rose-500/20 text-rose-200 px-1.5 py-0.5 rounded border border-rose-500/30 font-mono">Top Tier</span>
                    </div>

                    {/* A Tier */}
                    <div className="flex items-center gap-2.5 bg-cyan-950/40 border border-cyan-500/40 p-2 rounded-lg backdrop-blur-md shadow-lg shadow-cyan-950/30">
                      <span className="w-6 h-6 rounded bg-cyan-600 font-black text-white flex items-center justify-center text-xs shadow">A</span>
                      <div className="flex-1">
                        <div className="text-[11px] font-bold text-white">Frontier & Summit Exascale Clusters</div>
                        <div className="text-[9px] text-cyan-300 font-mono">Petascale Classical · Tensor Contraction</div>
                      </div>
                      <span className="text-[9px] bg-cyan-500/20 text-cyan-200 px-1.5 py-0.5 rounded border border-cyan-500/30 font-mono">Classical SOTA</span>
                    </div>

                    {/* B Tier */}
                    <div className="flex items-center gap-2.5 bg-violet-950/40 border border-violet-500/40 p-2 rounded-lg backdrop-blur-md shadow-lg shadow-violet-950/30">
                      <span className="w-6 h-6 rounded bg-violet-600 font-black text-white flex items-center justify-center text-xs shadow">B</span>
                      <div className="flex-1">
                        <div className="text-[11px] font-bold text-white">Single-Node Von Neumann Hardware</div>
                        <div className="text-[9px] text-violet-300 font-mono">Exponential State Vector Penalty</div>
                      </div>
                      <span className="text-[9px] bg-violet-500/20 text-violet-200 px-1.5 py-0.5 rounded border border-violet-500/30 font-mono">Baseline</span>
                    </div>
                  </div>
                </div>
              )}

              {activeStyle === "paper" && (
                /* Research That Lifts Off the Page (3D Perspective Paper Lift) */
                <div className="w-full max-w-sm flex flex-col items-center animate-in fade-in duration-300">
                  <div 
                    className="bg-[#f5f3ee] text-[#1c1d22] p-4 rounded-xl shadow-2xl border border-black/10 text-left transition-transform duration-500 hover:rotate-0"
                    style={{
                      transform: "perspective(900px) rotateX(10deg) rotateY(-8deg)",
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 99, 255, 0.2)"
                    }}
                  >
                    <div className="flex items-center justify-between text-[9px] text-[#6b6d76] uppercase tracking-wider font-mono border-b border-black/10 pb-1.5 mb-2">
                      <span>Nature · Vol 574 · Oct 2019</span>
                      <span className="font-bold text-[#3B63FF] flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Peer-Reviewed</span>
                      </span>
                    </div>

                    <h4 className="font-serif font-black text-[11px] leading-snug text-[#0f1013] mb-1">
                      Quantum supremacy using a programmable superconducting processor
                    </h4>

                    <div className="text-[10px] font-serif leading-relaxed text-[#2a2c35] bg-white/70 p-2 rounded border border-black/5">
                      “We demonstrate quantum supremacy with Sycamore.{' '}
                      <mark className="bg-amber-300 text-black font-semibold px-1 py-0.5 rounded shadow-sm">
                        The processor performed a benchmark calculation in 200 seconds that would take supercomputers 10,000 years.
                      </mark>{' '}
                      This represents an experimental realization of quantum supremacy.”
                    </div>
                  </div>
                </div>
              )}

              {activeStyle === "exploded" && (
                /* Exploded Layers 3D */
                <div className="w-full max-w-sm flex flex-col items-center animate-in fade-in duration-300">
                  <div className="text-xs font-bold text-white mb-2">Exploded NLE Composite Z-Stack (5 Layers)</div>

                  <div 
                    className="space-y-1.5 w-64 text-left transition-transform duration-500"
                    style={{
                      transform: "perspective(800px) rotateX(35deg) rotateZ(-18deg)",
                      transformStyle: "preserve-3d"
                    }}
                  >
                    <div className="p-2 rounded bg-purple-600/30 border border-purple-400 text-[10px] font-bold text-purple-200 shadow-lg shadow-purple-900/40 backdrop-blur-md">
                      C1: Dynamic Hormozi Captions
                    </div>
                    <div className="p-2 rounded bg-indigo-600/30 border border-indigo-400 text-[10px] font-bold text-indigo-200 shadow-lg shadow-indigo-900/40 backdrop-blur-md">
                      V2: 3D Motion Graphics & Tier List
                    </div>
                    <div className="p-2 rounded bg-blue-600/30 border border-blue-400 text-[10px] font-bold text-blue-200 shadow-lg shadow-blue-900/40 backdrop-blur-md">
                      V1: 4K Master Video & Stock B-Roll
                    </div>
                    <div className="p-2 rounded bg-emerald-600/30 border border-emerald-400 text-[10px] font-bold text-emerald-200 shadow-lg shadow-emerald-900/40 backdrop-blur-md">
                      A1: Cleaned Voiceover (48kHz Whisper)
                    </div>
                    <div className="p-2 rounded bg-teal-600/30 border border-teal-400 text-[10px] font-bold text-teal-200 shadow-lg shadow-teal-900/40 backdrop-blur-md">
                      A2: Cybernetic Music Bed (-12dB Ducked)
                    </div>
                  </div>
                </div>
              )}

              {activeStyle === "counter" && (
                /* Stat Counter 10,000x */
                <div className="space-y-2 flex flex-col items-center animate-in fade-in duration-300">
                  <div className="text-4xl md:text-5xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-[#3B63FF] tracking-tight drop-shadow-[0_0_20px_rgba(59,99,255,0.5)]">
                    10,000x
                  </div>
                  <div className="text-xs font-bold text-blue-200 uppercase tracking-widest bg-[#3B63FF]/20 border border-[#3B63FF]/50 px-3 py-1 rounded-full">
                    Quantum Speedup Multiplier
                  </div>
                  <p className="text-[10px] text-slate-400 max-w-[260px]">
                    Exponential computational advantage over world-class petascale clusters.
                  </p>
                </div>
              )}

              {activeStyle === "youtube" && (
                /* YouTube 4K Clip Stream */
                <div className="space-y-3 flex flex-col items-center animate-in fade-in duration-300 w-full max-w-sm">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#3B63FF] to-cyan-500 p-0.5 shadow-xl shadow-[#3B63FF]/30">
                    <div className="w-full h-full bg-[#0a0c12] rounded-2xl flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(#3B63FF_1px,transparent_1px)] [background-size:8px_8px] opacity-40 animate-pulse" />
                      <Video className="w-8 h-8 text-[#3B63FF] relative z-10" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-extrabold text-white tracking-tight">
                      Google Quantum AI Supremacy
                    </h3>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        41:56 → 0:04 (4s slice)
                      </span>
                      <span className="text-[10px] text-cyan-300 font-mono">YouTube 4K UHD</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Synchronized Animated Captions Burn-In Preview */}
            <div className="w-full flex justify-center text-center z-10">
              <div className="bg-black/90 px-4 py-1.5 rounded-lg border border-white/10 backdrop-blur-md shadow-2xl max-w-[90%]">
                <span className="text-xs font-bold text-white tracking-wide">
                  {currentTimeMs < 3000 ? (
                    <>In October 2019, <span className="text-cyan-400 font-black underline decoration-cyan-400">Google demonstrated</span> quantum supremacy.</>
                  ) : currentTimeMs < 8500 ? (
                    <>Their Sycamore processor performed in <span className="text-[#3B63FF] font-black underline decoration-[#3B63FF]">200 seconds</span> what took millennia.</>
                  ) : currentTimeMs < 12000 ? (
                    <>that would take supercomputers <span className="text-emerald-400 font-black underline decoration-emerald-400">ten thousand years</span>.</>
                  ) : (
                    <>Subscribe for <span className="text-violet-400 font-black underline decoration-violet-400">deep tech breakdowns</span>.</>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Rule of Thirds Grid Overlay */}
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-cyan-400/20">
              <div className="border-r border-b border-cyan-400/20" />
              <div className="border-r border-b border-cyan-400/20" />
              <div className="border-b border-cyan-400/20" />
              <div className="border-r border-b border-cyan-400/20" />
              <div className="border-r border-b border-cyan-400/20" />
              <div className="border-b border-cyan-400/20" />
              <div className="border-r border-cyan-400/20" />
              <div className="border-r border-cyan-400/20" />
              <div />
            </div>
          )}

          {/* Safe Margins Overlay (Title Safe & Action Safe) */}
          {safeMargins && (
            <div className="absolute inset-0 pointer-events-none border border-dashed border-amber-500/40 m-[10%]">
              <div className="absolute inset-0 border border-dashed border-cyan-400/30 m-[5%]" />
            </div>
          )}
        </div>
      </div>

      {/* Transport Controls & Timecode Bar */}
      <div className="h-12 px-4 bg-[#0a0c12] border-t border-white/5 flex items-center justify-between text-xs">
        {/* Timecode display */}
        <div className="flex items-center gap-2">
          <div className="font-mono text-xs font-bold text-emerald-400 bg-[#05060a] px-2.5 py-1 rounded border border-white/10 tracking-wider shadow-inner">
            {formatTimecode(currentTimeMs)}
          </div>
          <span className="text-xs text-slate-600">/</span>
          <div className="font-mono text-xs text-slate-400">
            DUR: {formatTimecode(totalDurationMs)}
          </div>
        </div>

        {/* Transport Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSeek(0)}
            title="Jump to Start (Home)"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSeek(Math.max(0, currentTimeMs - 33.33))}
            title="Step 1 Frame Back (Left Arrow)"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onTogglePlay}
            title="Play / Pause (Space)"
            className={`p-2.5 rounded-full shadow-lg mx-1 transition-all active:scale-95 ${
              isPlaying
                ? "bg-[#3B63FF] hover:bg-blue-600 text-white ring-4 ring-[#3B63FF]/30 animate-pulse"
                : "bg-[#3B63FF] hover:bg-blue-600 text-white shadow-[#3B63FF]/40"
            }`}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 fill-white translate-x-0.5" />
            )}
          </button>
          <button
            onClick={() => onSeek(Math.min(totalDurationMs, currentTimeMs + 33.33))}
            title="Step 1 Frame Forward (Right Arrow)"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSeek(totalDurationMs)}
            title="Jump to End (End)"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mute & Playback Speed Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#05060a] border border-white/10 rounded px-1 py-0.5 text-[10px] font-mono text-slate-400">
            <button
              onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1)}
              className="hover:text-white px-1.5 py-0.5 font-bold text-slate-300"
              title="Playback Speed"
            >
              {playbackSpeed}x
            </button>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
