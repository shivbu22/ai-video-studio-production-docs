"use client";

import React, { useState } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Tv, 
  Smartphone, 
  Grid, 
  Sliders,
  Volume2, 
  VolumeX
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
  showInspector?: boolean;
  onToggleInspector?: () => void;
}

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
  activeClip = null,
  showInspector = false,
  onToggleInspector,
}) => {
  const [monitorView, setMonitorView] = useState<MonitorViewMode>("program");
  const [showGrid, setShowGrid] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRes, setPlaybackRes] = useState<"Full" | "1/2" | "1/4">("Full");

  // Determine active visual style inferred from active clip or playhead time
  const resolveActiveStyle = (): "barchart" | "tierlist" | "paper" | "exploded" | "counter" | "youtube" => {
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
    <div className="flex flex-col h-full flex-1 bg-[#0b0c10] border-r border-[#1a1b22] select-none font-sans overflow-hidden">
      {/* 1. Sleek Single-Row Monitor Header */}
      <div className="h-8 px-3 bg-[#111217] border-b border-[#1c1e27] flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          {/* Segmented Source vs Program Switcher */}
          <div className="flex items-center bg-[#0d0e13] border border-[#232532] rounded p-0.5 text-[11px]">
            <button
              onClick={() => setMonitorView("program")}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                monitorView === "program" ? "bg-[#252836] text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Program
            </button>
            <button
              onClick={() => setMonitorView("source")}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                monitorView === "source" ? "bg-[#252836] text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Source
            </button>
          </div>

          <span className="text-[11px] font-medium text-slate-400 truncate max-w-[220px]">
            {monitorView === "program" ? currentSceneTitle : "RAW_BROLL_4K.MP4"}
          </span>
        </div>

        {/* Right Controls: Aspect Ratio, Resolution, Inspector Toggle */}
        <div className="flex items-center gap-2">
          {/* Aspect Ratio Switcher */}
          <div className="flex items-center bg-[#0d0e13] border border-[#232532] rounded p-0.5 text-[11px]">
            <button
              onClick={() => onAspectRatioChange("16:9")}
              className={`px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
                aspectRatio === "16:9" ? "bg-[#3B63FF] text-white font-medium" : "text-slate-400 hover:text-slate-200"
              }`}
              title="16:9 Horizontal (YouTube / Master)"
            >
              <Tv className="w-3 h-3" />
              <span>16:9</span>
            </button>
            <button
              onClick={() => onAspectRatioChange("9:16")}
              className={`px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
                aspectRatio === "9:16" ? "bg-[#3B63FF] text-white font-medium" : "text-slate-400 hover:text-slate-200"
              }`}
              title="9:16 Vertical (Shorts / Reels)"
            >
              <Smartphone className="w-3 h-3" />
              <span>9:16</span>
            </button>
          </div>

          {/* Resolution Badge */}
          <button
            onClick={() => setPlaybackRes(playbackRes === "Full" ? "1/2" : playbackRes === "1/2" ? "1/4" : "Full")}
            className="px-1.5 py-0.5 rounded bg-[#14151c] border border-[#242633] text-[10px] font-mono text-slate-300 hover:text-white"
            title="Toggle Playback Resolution (Full / 1/2 / 1/4)"
          >
            {playbackRes}
          </button>

          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1 rounded transition-colors ${
              showGrid ? "text-[#3B63FF] bg-[#3B63FF]/15" : "text-slate-500 hover:text-slate-300"
            }`}
            title="Toggle Composition Grid"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Inspector Panel Toggle Button */}
          {onToggleInspector && (
            <button
              onClick={onToggleInspector}
              className={`px-2 py-0.5 rounded border text-[11px] font-medium flex items-center gap-1 transition-colors ${
                showInspector
                  ? "bg-[#3B63FF]/20 border-[#3B63FF]/50 text-white"
                  : "bg-[#14151c] border-[#242633] text-slate-400 hover:text-slate-200"
              }`}
              title="Toggle Clip Inspector Panel"
            >
              <Sliders className="w-3 h-3" />
              <span>Inspector</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Video Screening Canvas */}
      <div className="flex-1 relative flex items-center justify-center p-3 overflow-hidden bg-[#07080b]">
        {/* Aspect Ratio Bounding Container */}
        <div 
          className={`relative bg-[#0d0e13] border border-[#1e202a] rounded shadow-2xl overflow-hidden flex items-center justify-center transition-all ${
            aspectRatio === "16:9" 
              ? "w-full max-w-[820px] aspect-video" 
              : aspectRatio === "9:16"
              ? "h-full max-h-[380px] aspect-[9/16]"
              : "w-full max-w-[420px] aspect-square"
          }`}
        >
          {/* Rule of Thirds Grid Overlay */}
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 z-20">
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="" />
            </div>
          )}

          {/* 3D Motion Graphics / Footage Preview Component */}
          {activeStyle === "barchart" && (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-white bg-gradient-to-b from-[#0c0e18] to-[#06070a]">
              <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1">Empirical Benchmark (Slot Studio)</span>
              <h3 className="text-sm font-extrabold text-white mb-6">Quantum Supercomputer Speedup</h3>
              <div className="flex items-end justify-center gap-10 h-32 w-full max-w-sm">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-slate-400 font-mono">10,000 yrs</span>
                  <div className="w-12 h-24 bg-gradient-to-t from-slate-700 to-slate-400 rounded-t shadow-lg" />
                  <span className="text-[11px] font-semibold text-slate-300">Summit</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-[#9fb4ff] font-mono font-bold">200 sec</span>
                  <div className="w-12 h-8 bg-gradient-to-t from-[#2440c9] to-[#3B63FF] rounded-t shadow-lg shadow-[#3B63FF]/30" />
                  <span className="text-[11px] font-bold text-[#9fb4ff]">Sycamore</span>
                </div>
              </div>
            </div>
          )}

          {activeStyle === "paper" && (
            <div className="w-full h-full flex items-center justify-center p-4 bg-[#0a0b0f]">
              <div className="bg-[#181920] border border-white/10 rounded-lg p-5 max-w-md shadow-2xl text-slate-200">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-2">
                  <span>NATURE · VOL 574 · OCT 2019</span>
                  <span className="text-emerald-400 font-semibold">PEER-REVIEWED</span>
                </div>
                <h4 className="text-xs font-bold text-white mb-2 leading-snug">Quantum supremacy using a programmable superconducting processor</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed italic">
                  "The processor performed a benchmark calculation in <span className="bg-amber-400/20 text-amber-300 px-1 py-0.5 rounded font-mono font-semibold">200 seconds</span> that would take classical supercomputers <span className="bg-amber-400/20 text-amber-300 px-1 py-0.5 rounded font-mono font-semibold">10,000 years</span>."
                </p>
              </div>
            </div>
          )}

          {activeStyle === "counter" && (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#0a0c16] to-[#040508]">
              <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-widest mb-2">Performance Multiplier</span>
              <div className="text-4xl md:text-5xl font-black text-white tracking-tight font-mono">
                10,000<span className="text-[#3B63FF]">x</span>
              </div>
              <span className="text-xs text-slate-400 mt-2 font-medium">Faster than Summit classical supercomputer</span>
            </div>
          )}

          {activeStyle === "tierlist" && (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#0c0d12]">
              <div className="w-full max-w-md space-y-1.5">
                <div className="flex items-center gap-2 bg-rose-950/40 border border-rose-600/30 rounded p-1.5">
                  <span className="w-6 h-6 rounded bg-rose-600 text-white font-bold flex items-center justify-center text-xs">S</span>
                  <span className="text-xs font-semibold text-rose-100">Deadlift, Weighted Pull-ups</span>
                </div>
                <div className="flex items-center gap-2 bg-amber-950/40 border border-amber-600/30 rounded p-1.5">
                  <span className="w-6 h-6 rounded bg-amber-600 text-white font-bold flex items-center justify-center text-xs">A</span>
                  <span className="text-xs font-semibold text-amber-100">Barbell Row, Chest-Supported Row</span>
                </div>
              </div>
            </div>
          )}

          {activeStyle === "youtube" && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white relative">
              <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[10px] text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span>4K ProRes 422 HQ · 3840x2160</span>
              </div>
              <p className="text-xs font-semibold text-slate-300">Dilution Refrigerator Vacuum Chamber (B-Roll)</p>
              <span className="text-[10px] text-slate-500 font-mono mt-1">Take 03 · 60.00 fps</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Sleek Floating Mini Transport Bar */}
      <div className="h-8 px-4 bg-[#0e0f14] border-t border-[#1a1b22] flex items-center justify-between text-xs font-mono text-slate-400">
        {/* Playhead Timecode */}
        <div className="flex items-center gap-2">
          <span className="text-[#3B63FF] font-bold text-xs tabular-timecode">
            {formatTimecode(currentTimeMs)}
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-500 text-xs tabular-timecode">
            {formatTimecode(totalDurationMs)}
          </span>
        </div>

        {/* Central Transport Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSeek(0)}
            className="text-slate-400 hover:text-white transition-colors"
            title="Return to Start"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onTogglePlay}
            className="w-6 h-6 rounded-full bg-[#3B63FF] hover:bg-[#4f73ff] text-white flex items-center justify-center shadow-md shadow-[#3B63FF]/30 transition-transform active:scale-90"
            title="Play / Pause (Space)"
          >
            {isPlaying ? <Pause className="w-3 h-3 fill-white" /> : <Play className="w-3 h-3 fill-white ml-0.5" />}
          </button>

          <button
            onClick={() => onSeek(totalDurationMs)}
            className="text-slate-400 hover:text-white transition-colors"
            title="Go to End"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Quick Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-slate-400 hover:text-white transition-colors"
            title="Toggle Mute"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <span className="text-[10px] text-slate-500">30 FPS</span>
        </div>
      </div>
    </div>
  );
};
