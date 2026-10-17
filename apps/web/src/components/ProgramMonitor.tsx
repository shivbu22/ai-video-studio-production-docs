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
  CheckCircle2,
  Camera,
  Layers as LayersIcon,
  Film,
  ArrowDownToLine,
  Replace
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
  onInsertSourceClip?: () => void;
  onOverwriteSourceClip?: () => void;
}

type TemplatePreviewMode = "auto" | "barchart" | "tierlist" | "paper" | "exploded" | "counter" | "youtube";
type MonitorViewMode = "program" | "source";

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
  onInsertSourceClip,
  onOverwriteSourceClip,
}) => {
  const [monitorView, setMonitorView] = useState<MonitorViewMode>("program");
  const [safeMargins, setSafeMargins] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [playbackRes, setPlaybackRes] = useState<"Full" | "1/2" | "1/4">("Full");
  const [previewMode, setPreviewMode] = useState<TemplatePreviewMode>("auto");

  // Source Monitor in/out simulation
  const [sourceInMs, setSourceInMs] = useState(500);
  const [sourceOutMs, setSourceOutMs] = useState(4500);

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
    <div className="flex flex-col h-full bg-[#111215] border-r border-[#262830] select-none font-sans">
      {/* 1. Dual Monitor Tab Header (Source vs Program) */}
      <div className="h-9 px-3 bg-[#16171b] border-b border-[#262830] flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-1.5">
          {/* Source Monitor Tab */}
          <button
            onClick={() => setMonitorView("source")}
            className={`px-2.5 py-1 rounded-[2px] font-bold text-[11px] transition-all flex items-center gap-1.5 ${
              monitorView === "source"
                ? "bg-[#252831] text-white border-t-2 border-[#3B63FF] shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Film className="w-3 h-3 text-[#3B63FF]" />
            <span>Source: {activeClip?.title ? activeClip.title.slice(0, 18) : "RAW_BROLL_4K.MP4"}</span>
          </button>

          {/* Program Monitor Tab */}
          <button
            onClick={() => setMonitorView("program")}
            className={`px-2.5 py-1 rounded-[2px] font-bold text-[11px] transition-all flex items-center gap-1.5 ${
              monitorView === "program"
                ? "bg-[#252831] text-white border-t-2 border-[#3B63FF] shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Tv className="w-3 h-3 text-[#3B63FF]" />
            <span>Program: Master Comp</span>
          </button>

          <span className="text-[10px] text-slate-400 font-mono bg-black/40 px-2 py-0.5 rounded border border-[#2b2e36] hidden md:inline ml-1 tabular-timecode">
            4K UHD · 3840x2160 (60.00fps)
          </span>
        </div>

        {/* Aspect Ratio, Quality, Grid & Safe Margins */}
        <div className="flex items-center gap-1.5">
          {/* Playback Resolution Dropdown */}
          <div className="flex items-center bg-[#101115] border border-[#2b2e36] rounded-[2px] px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
            <button
              onClick={() => setPlaybackRes(playbackRes === "Full" ? "1/2" : playbackRes === "1/2" ? "1/4" : "Full")}
              className="hover:text-white font-bold"
              title="Playback Resolution (Full / 1/2 / 1/4)"
            >
              {playbackRes}
            </button>
          </div>

          <button
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Rule-of-Thirds Grid"
            className={`p-1.5 rounded-[2px] text-[10px] transition-colors ${
              showGrid ? "bg-[#3B63FF]/20 text-[#3B63FF] border border-[#3B63FF]/50" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setSafeMargins(!safeMargins)}
            title="Toggle Broadcast Safe Margins (Title/Action Safe)"
            className={`px-2 py-1 rounded-[2px] text-[10px] font-semibold transition-colors ${
              safeMargins ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Safe Margins
          </button>

          <div className="flex items-center bg-[#101115] border border-[#2b2e36] rounded-[2px] p-0.5">
            <button
              onClick={() => onAspectRatioChange("16:9")}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[10px] font-medium transition-colors ${
                aspectRatio === "16:9" ? "bg-[#3B63FF] text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Tv className="w-3 h-3" />
              <span>16:9</span>
            </button>
            <button
              onClick={() => onAspectRatioChange("9:16")}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[10px] font-medium transition-colors ${
                aspectRatio === "9:16" ? "bg-[#3B63FF] text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>9:16</span>
            </button>
            <button
              onClick={() => onAspectRatioChange("1:1")}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[10px] font-medium transition-colors ${
                aspectRatio === "1:1" ? "bg-[#3B63FF] text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Square className="w-3 h-3" />
              <span>1:1</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Slot Studio Motion Template Quick-Preview Strip (Program View Only) */}
      {monitorView === "program" && (
        <div className="h-7 px-3 bg-[#131418] border-b border-[#262830] flex items-center gap-1 text-[11px] overflow-x-auto select-none">
          <span className="text-[9px] uppercase tracking-wider font-mono text-slate-500 mr-1.5 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-[#3B63FF]" />
            <span>Remotion 3D:</span>
          </span>
          <button
            onClick={() => setPreviewMode("auto")}
            className={`px-2 py-0.5 rounded-[2px] text-[10px] font-semibold transition-all ${
              previewMode === "auto" ? "bg-[#3B63FF] text-white shadow-sm" : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            Auto (Timeline)
          </button>
          <button
            onClick={() => setPreviewMode("barchart")}
            className={`px-2 py-0.5 rounded-[2px] text-[10px] font-semibold transition-all flex items-center gap-1 ${
              previewMode === "barchart" ? "bg-[#3B63FF] text-white shadow-sm" : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            <BarChart3 className="w-2.5 h-2.5" />
            <span>3D Bar Chart</span>
          </button>
          <button
            onClick={() => setPreviewMode("tierlist")}
            className={`px-2 py-0.5 rounded-[2px] text-[10px] font-semibold transition-all flex items-center gap-1 ${
              previewMode === "tierlist" ? "bg-[#3B63FF] text-white shadow-sm" : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            <Trophy className="w-2.5 h-2.5" />
            <span>Glass Tier List</span>
          </button>
          <button
            onClick={() => setPreviewMode("paper")}
            className={`px-2 py-0.5 rounded-[2px] text-[10px] font-semibold transition-all flex items-center gap-1 ${
              previewMode === "paper" ? "bg-[#3B63FF] text-white shadow-sm" : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-2.5 h-2.5" />
            <span>Paper Lift-Off</span>
          </button>
          <button
            onClick={() => setPreviewMode("exploded")}
            className={`px-2 py-0.5 rounded-[2px] text-[10px] font-semibold transition-all flex items-center gap-1 ${
              previewMode === "exploded" ? "bg-[#3B63FF] text-white shadow-sm" : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-2.5 h-2.5" />
            <span>Exploded 3D</span>
          </button>
          <button
            onClick={() => setPreviewMode("counter")}
            className={`px-2 py-0.5 rounded-[2px] text-[10px] font-semibold transition-all flex items-center gap-1 ${
              previewMode === "counter" ? "bg-[#3B63FF] text-white shadow-sm" : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>Stat Counter</span>
          </button>
          <button
            onClick={() => setPreviewMode("youtube")}
            className={`px-2 py-0.5 rounded-[2px] text-[10px] font-semibold transition-all flex items-center gap-1 ${
              previewMode === "youtube" ? "bg-[#3B63FF] text-white shadow-sm" : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            <Video className="w-2.5 h-2.5" />
            <span>YouTube 4K Clip</span>
          </button>
        </div>
      )}

      {/* 3. Source Monitor Subclip Action Bar (Source View Only) */}
      {monitorView === "source" && (
        <div className="h-7 px-3 bg-[#131418] border-b border-[#262830] flex items-center justify-between text-[11px] select-none">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-cyan-400 font-mono font-bold bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded-[2px]">
              SOURCE INSPECTOR · RAW TAKE
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              In: {formatTimecode(sourceInMs)} · Out: {formatTimecode(sourceOutMs)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onInsertSourceClip && onInsertSourceClip()}
              title="Insert Subclip into Timeline (Comma ,)"
              className="px-2 py-0.5 bg-[#3B63FF] hover:bg-blue-600 text-white rounded-[2px] font-semibold text-[10px] flex items-center gap-1"
            >
              <ArrowDownToLine className="w-3 h-3" />
              <span>Insert ( , )</span>
            </button>
            <button
              onClick={() => onOverwriteSourceClip && onOverwriteSourceClip()}
              title="Overwrite Subclip into Timeline (Period .)"
              className="px-2 py-0.5 bg-[#252831] hover:bg-[#2f333f] text-slate-200 border border-[#3d414d] rounded-[2px] font-semibold text-[10px] flex items-center gap-1"
            >
              <Replace className="w-3 h-3 text-cyan-400" />
              <span>Overwrite ( . )</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Video Canvas Stage */}
      <div className="flex-1 flex items-center justify-center p-4 bg-[#111215] relative overflow-hidden">
        <div
          className={`relative bg-black rounded-[2px] shadow-2xl border border-[#262830] flex items-center justify-center transition-all overflow-hidden ${
            aspectRatio === "16:9"
              ? "w-full max-w-[640px] aspect-video"
              : aspectRatio === "9:16"
              ? "h-full max-h-[440px] aspect-[9/16]"
              : "h-full max-h-[440px] aspect-square"
          }`}
        >
          {monitorView === "source" ? (
            /* SOURCE MONITOR VIEW (Raw Asset Inspection) */
            <div className="absolute inset-0 flex flex-col justify-between p-5 bg-gradient-to-b from-[#181a22] to-[#0a0b0e] select-none">
              <div className="flex items-center justify-between z-10">
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-[2px]">
                  PRORES 422 HQ · 3840x2160 · 23.976 FPS
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded">
                  Subclip: 4.0s
                </span>
              </div>

              <div className="my-auto flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 p-0.5 shadow-xl">
                  <div className="w-full h-full bg-[#111215] rounded-xl flex items-center justify-center">
                    <Film className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white mt-2">
                  {activeClip?.title || "Quantum Superconducting Dilution Cryostat Take 01"}
                </h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Audio: 48,000 Hz · 24-Bit Linear PCM
                </p>
              </div>

              {/* In/Out Subclip Bracket Scrubber */}
              <div className="w-full bg-black/70 p-2 rounded border border-white/10 flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#3B63FF] font-bold">[ IN: 00:00:00:15</span>
                <div className="h-1 flex-1 mx-3 bg-[#262830] rounded-full relative">
                  <div className="absolute left-[15%] right-[25%] top-0 bottom-0 bg-[#3B63FF] rounded-full" />
                </div>
                <span className="text-[#3B63FF] font-bold">OUT: 00:00:04:15 ]</span>
              </div>
            </div>
          ) : (
            /* PROGRAM MONITOR VIEW (Master Composite) */
            <div className="absolute inset-0 flex flex-col justify-between p-5 bg-gradient-to-b from-[#0c0e17] via-[#07080f] to-[#040508] overflow-hidden select-none">
              {/* Top Scene Pill */}
              <div className="flex items-center justify-between z-10">
                <span className="text-[10px] tracking-wider uppercase font-bold bg-[#3B63FF] text-white px-2.5 py-0.5 rounded-[2px] shadow-sm flex items-center gap-1.5">
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

                <span className="text-[10px] font-mono bg-black/80 text-emerald-400 px-2 py-0.5 rounded-[2px] border border-emerald-500/30 flex items-center gap-1">
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

                    <div className="relative w-full max-w-[280px] h-32 flex flex-col items-center justify-end">
                      <div className="flex items-end justify-center gap-8 w-full">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[10px] font-mono text-slate-400 font-semibold tabular-timecode">10,000 yrs</span>
                          <div className="w-14 bg-gradient-to-t from-slate-700 via-slate-500 to-slate-400 rounded-t-[2px] h-20 shadow-lg border-t border-l border-white/20" />
                          <span className="text-[9px] text-slate-300 font-bold uppercase tracking-wider">Summit HPC</span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[10px] font-mono text-emerald-400 font-black flex items-center gap-1 tabular-timecode">
                            <Sparkles className="w-2.5 h-2.5 text-emerald-300" />
                            <span>200 sec</span>
                          </span>
                          <div className="w-14 bg-gradient-to-t from-[#3B63FF] via-blue-400 to-cyan-300 rounded-t-[2px] h-28 shadow-[0_0_25px_rgba(59,99,255,0.6)] border-t border-l border-white/40 animate-pulse" />
                          <span className="text-[9px] text-cyan-300 font-bold uppercase tracking-wider">Sycamore QPU</span>
                        </div>
                      </div>

                      {/* Mirror Floor Reflection */}
                      <div className="w-full h-8 flex items-start justify-center gap-8 opacity-25 transform scale-y-[-1] pointer-events-none blur-[0.5px]">
                        <div className="w-14 bg-gradient-to-b from-slate-700 to-transparent rounded-b-[2px] h-12" />
                        <div className="w-14 bg-gradient-to-b from-[#3B63FF] to-transparent rounded-b-[2px] h-16" />
                      </div>

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
                      <div className="flex items-center gap-2.5 bg-rose-950/40 border border-rose-500/40 p-2 rounded-[2px] backdrop-blur-md shadow-lg shadow-rose-950/30">
                        <span className="w-6 h-6 rounded-[2px] bg-rose-600 font-black text-white flex items-center justify-center text-xs shadow">S</span>
                        <div className="flex-1">
                          <div className="text-[11px] font-bold text-white">Sycamore 54-Qubit Transmon Array</div>
                          <div className="text-[9px] text-rose-300 font-mono">Quantum Supremacy Target · Coherent Superposition</div>
                        </div>
                        <span className="text-[9px] bg-rose-500/20 text-rose-200 px-1.5 py-0.5 rounded-[2px] border border-rose-500/30 font-mono">Top Tier</span>
                      </div>

                      <div className="flex items-center gap-2.5 bg-cyan-950/40 border border-cyan-500/40 p-2 rounded-[2px] backdrop-blur-md shadow-lg shadow-cyan-950/30">
                        <span className="w-6 h-6 rounded-[2px] bg-cyan-600 font-black text-white flex items-center justify-center text-xs shadow">A</span>
                        <div className="flex-1">
                          <div className="text-[11px] font-bold text-white">Frontier & Summit Exascale Clusters</div>
                          <div className="text-[9px] text-cyan-300 font-mono">Petascale Classical · Tensor Contraction</div>
                        </div>
                        <span className="text-[9px] bg-cyan-500/20 text-cyan-200 px-1.5 py-0.5 rounded-[2px] border border-cyan-500/30 font-mono">Classical SOTA</span>
                      </div>

                      <div className="flex items-center gap-2.5 bg-violet-950/40 border border-violet-500/40 p-2 rounded-[2px] backdrop-blur-md shadow-lg shadow-violet-950/30">
                        <span className="w-6 h-6 rounded-[2px] bg-violet-600 font-black text-white flex items-center justify-center text-xs shadow">B</span>
                        <div className="flex-1">
                          <div className="text-[11px] font-bold text-white">Single-Node Von Neumann Hardware</div>
                          <div className="text-[9px] text-violet-300 font-mono">Exponential State Vector Penalty</div>
                        </div>
                        <span className="text-[9px] bg-violet-500/20 text-violet-200 px-1.5 py-0.5 rounded-[2px] border border-violet-500/30 font-mono">Baseline</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeStyle === "paper" && (
                  /* Research Paper Lift-Off */
                  <div className="w-full max-w-sm flex flex-col items-center animate-in fade-in duration-300">
                    <div 
                      className="bg-[#f5f3ee] text-[#1c1d22] p-4 rounded-lg shadow-2xl border border-black/10 text-left transition-transform duration-500 hover:rotate-0"
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
                      <div className="p-2 rounded-[2px] bg-purple-600/30 border border-purple-400 text-[10px] font-bold text-purple-200 shadow-lg backdrop-blur-md">
                        C1: Dynamic Hormozi Captions
                      </div>
                      <div className="p-2 rounded-[2px] bg-indigo-600/30 border border-indigo-400 text-[10px] font-bold text-indigo-200 shadow-lg backdrop-blur-md">
                        V2: 3D Motion Graphics & Tier List
                      </div>
                      <div className="p-2 rounded-[2px] bg-blue-600/30 border border-blue-400 text-[10px] font-bold text-blue-200 shadow-lg backdrop-blur-md">
                        V1: 4K Master Video & Stock B-Roll
                      </div>
                      <div className="p-2 rounded-[2px] bg-emerald-600/30 border border-emerald-400 text-[10px] font-bold text-emerald-200 shadow-lg backdrop-blur-md">
                        A1: Cleaned Voiceover (48kHz Whisper)
                      </div>
                      <div className="p-2 rounded-[2px] bg-teal-600/30 border border-teal-400 text-[10px] font-bold text-teal-200 shadow-lg backdrop-blur-md">
                        A2: Cybernetic Music Bed (-12dB Ducked)
                      </div>
                    </div>
                  </div>
                )}

                {activeStyle === "counter" && (
                  /* Stat Counter 10,000x */
                  <div className="space-y-2 flex flex-col items-center animate-in fade-in duration-300">
                    <div className="text-4xl md:text-5xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-[#3B63FF] tracking-tight drop-shadow-[0_0_20px_rgba(59,99,255,0.5)] tabular-timecode">
                      10,000x
                    </div>
                    <div className="text-xs font-bold text-blue-200 uppercase tracking-widest bg-[#3B63FF]/20 border border-[#3B63FF]/50 px-3 py-1 rounded-[2px]">
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
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-tr from-[#3B63FF] to-cyan-500 p-0.5 shadow-xl shadow-[#3B63FF]/30">
                      <div className="w-full h-full bg-[#111215] rounded-xl flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(#3B63FF_1px,transparent_1px)] [background-size:8px_8px] opacity-40 animate-pulse" />
                        <Video className="w-8 h-8 text-[#3B63FF] relative z-10" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm md:text-base font-extrabold text-white tracking-tight">
                        Google Quantum AI Supremacy
                      </h3>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-[2px] border border-emerald-500/30">
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
                <div className="bg-black/90 px-4 py-1.5 rounded-[2px] border border-white/10 backdrop-blur-md shadow-2xl max-w-[90%]">
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
          )}

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

      {/* 5. Transport Controls & Timecode Bar */}
      <div className="h-11 px-4 bg-[#16171b] border-t border-[#262830] flex items-center justify-between text-xs">
        {/* Timecode display */}
        <div className="flex items-center gap-2">
          <div className="font-mono text-xs font-bold text-emerald-400 bg-[#0d0e12] px-2.5 py-1 rounded-[2px] border border-[#262830] tracking-wider shadow-inner tabular-timecode">
            {formatTimecode(currentTimeMs)}
          </div>
          <span className="text-xs text-slate-600">/</span>
          <div className="font-mono text-xs text-slate-400 tabular-timecode">
            DUR: {formatTimecode(totalDurationMs)}
          </div>
        </div>

        {/* Transport Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSeek(0)}
            title="Jump to Start (Home)"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-[2px] transition-colors"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSeek(Math.max(0, currentTimeMs - 33.33))}
            title="Step 1 Frame Back (Left Arrow)"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-[2px] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onTogglePlay}
            title="Play / Pause (Space)"
            className={`p-2 rounded-full shadow-lg mx-1 transition-all active:scale-95 ${
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
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-[2px] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSeek(totalDurationMs)}
            title="Jump to End (End)"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-[2px] transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Export Frame & Mute Controls */}
        <div className="flex items-center gap-2">
          <button
            title="Export Frame Snapshot (Ctrl+Shift+E)"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-[2px] transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-[2px] transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
