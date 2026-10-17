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
  Square
} from "lucide-react";

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
}

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
}) => {
  const [safeMargins, setSafeMargins] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

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
    <div className="flex flex-col h-full bg-studio-950 border-r border-studio-800 select-none">
      {/* Monitor Header Toolbar */}
      <div className="h-9 px-3 bg-studio-900 border-b border-studio-800 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="font-semibold text-slate-200">Program Monitor</span>
          <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
            1920x1080 (30fps)
          </span>
          {activeLut && (
            <span className="flex items-center gap-1 text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">
              <Sparkles className="w-2.5 h-2.5" />
              <span>LUT: {activeLut}</span>
            </span>
          )}
        </div>

        {/* Aspect Ratio, Grid & Safe Margins */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Rule-of-Thirds Grid"
            className={`p-1 rounded text-[10px] transition-colors ${
              showGrid ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setSafeMargins(!safeMargins)}
            title="Toggle Broadcast Safe Margins"
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
              safeMargins ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Safe Margins
          </button>

          <div className="flex items-center bg-studio-950 border border-studio-800 rounded p-0.5">
            <button
              onClick={() => onAspectRatioChange("16:9")}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] ${
                aspectRatio === "16:9" ? "bg-studio-800 text-slate-100 font-medium" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Tv className="w-3 h-3" />
              <span>16:9</span>
            </button>
            <button
              onClick={() => onAspectRatioChange("9:16")}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] ${
                aspectRatio === "9:16" ? "bg-studio-800 text-slate-100 font-medium" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>9:16</span>
            </button>
            <button
              onClick={() => onAspectRatioChange("1:1")}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] ${
                aspectRatio === "1:1" ? "bg-studio-800 text-slate-100 font-medium" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Square className="w-3 h-3" />
              <span>1:1</span>
            </button>
          </div>
        </div>
      </div>

      {/* Video Canvas Stage */}
      <div className="flex-1 flex items-center justify-center p-4 bg-studio-950 relative overflow-hidden">
        <div
          className={`relative bg-black rounded-lg shadow-2xl border border-studio-800 flex items-center justify-center transition-all ${
            aspectRatio === "16:9"
              ? "w-full max-w-[620px] aspect-video"
              : aspectRatio === "9:16"
              ? "h-full max-h-[420px] aspect-[9/16]"
              : "h-full max-h-[420px] aspect-square"
          }`}
        >
          {/* Active Motion Template Rendering Simulation (Time-Synchronized) */}
          <div className="absolute inset-0 flex flex-col justify-between p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/80 overflow-hidden rounded-lg select-none">
            {/* Top Scene Pill */}
            <div className="flex items-center justify-between z-10">
              <span className="text-[10px] tracking-wider uppercase font-bold bg-violet-600/90 text-white px-2.5 py-0.5 rounded shadow-sm flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>
                  {currentTimeMs < 3000 
                    ? "SCENE 1: HOOK" 
                    : currentTimeMs < 8500 
                    ? "SCENE 2: BENCHMARK" 
                    : currentTimeMs < 12000 
                    ? "SCENE 3: STAT COUNTER" 
                    : "SCENE 4: CTA OUTRO"}
                </span>
              </span>
              <span className="text-[10px] font-mono bg-black/80 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                {currentTimeMs < 3000 
                  ? "Stock: Cryostat" 
                  : currentTimeMs < 8500 
                  ? "Remotion: BarChart" 
                  : currentTimeMs < 12000 
                  ? "Remotion: StatCounter" 
                  : "Remotion: QuoteCard"}
              </span>
            </div>

            {/* Dynamic Visual Mockup Driven by Playhead */}
            <div className="my-auto flex flex-col items-center justify-center text-center z-10 w-full px-4">
              {currentTimeMs < 3000 ? (
                /* Scene 1: Hook Dilution Refrigerator */
                <div className="space-y-3 flex flex-col items-center animate-in fade-in duration-300">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 p-0.5 shadow-xl shadow-cyan-500/30">
                    <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:8px_8px] opacity-40 animate-pulse" />
                      <Tv className="w-8 h-8 text-cyan-300 relative z-10" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-blue-300 tracking-tight">
                      Google Quantum AI Supremacy
                    </h3>
                    <p className="text-[10px] text-cyan-400/80 font-mono mt-0.5">Sycamore Architecture • Santa Barbara, CA</p>
                  </div>
                </div>
              ) : currentTimeMs < 8500 ? (
                /* Scene 2: BarChart 10,000y vs 200s */
                <div className="space-y-2 flex flex-col items-center w-full max-w-sm animate-in fade-in duration-300">
                  <div className="text-sm md:text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-100 to-white">
                    Speedup vs Classical Supercomputer
                  </div>
                  <div className="flex items-end justify-center gap-6 h-28 w-full max-w-[260px] pt-2">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-mono text-slate-400">10,000 yrs</span>
                      <div className="w-12 bg-slate-700/80 rounded-t h-20 shadow-inner" />
                      <span className="text-[9px] text-slate-400 font-medium">Summit</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">200 sec</span>
                      <div className="w-12 bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t h-28 shadow-lg shadow-emerald-500/40 animate-pulse" />
                      <span className="text-[9px] text-emerald-300 font-bold">Sycamore</span>
                    </div>
                  </div>
                </div>
              ) : currentTimeMs < 12000 ? (
                /* Scene 3: StatCounter 10,000x */
                <div className="space-y-2 flex flex-col items-center animate-in fade-in duration-300">
                  <div className="text-3xl md:text-4xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 tracking-tight drop-shadow-lg">
                    10,000x
                  </div>
                  <div className="text-xs font-bold text-amber-200 uppercase tracking-widest bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                    Quantum Speedup Multiplier
                  </div>
                  <p className="text-[10px] text-slate-400 max-w-[240px]">
                    Exponential computational advantage over world-class petascale clusters.
                  </p>
                </div>
              ) : (
                /* Scene 4: CTA Outro QuoteCard */
                <div className="space-y-2 flex flex-col items-center animate-in fade-in duration-300">
                  <div className="p-3 bg-violet-600/20 border border-violet-500/40 rounded-xl max-w-[260px]">
                    <p className="text-xs font-semibold text-violet-200 italic">
                      "Quantum computing represents the most profound shift in information theory since Turing."
                    </p>
                    <span className="text-[9px] text-violet-400 block mt-1 font-mono text-right">— Nature 574, 505–510</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-red-600/30">
                    <Sparkles className="w-3 h-3" />
                    <span>Subscribe for Deep Tech</span>
                  </div>
                </div>
              )}
            </div>

            {/* Synchronized Animated Captions Burn-In Preview */}
            <div className="w-full flex justify-center text-center z-10">
              <div className="bg-black/85 px-4 py-1.5 rounded-lg border border-white/10 backdrop-blur-md shadow-2xl max-w-[90%]">
                <span className="text-xs font-bold text-white tracking-wide">
                  {currentTimeMs < 3000 ? (
                    <>In October 2019, <span className="text-cyan-400 font-black underline decoration-cyan-400">Google demonstrated</span> quantum supremacy.</>
                  ) : currentTimeMs < 8500 ? (
                    <>Their Sycamore processor performed in <span className="text-amber-400 font-black underline decoration-amber-400">200 seconds</span> what took millennia.</>
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
      <div className="h-11 px-4 bg-studio-900 border-t border-studio-800 flex items-center justify-between">
        {/* Timecode display */}
        <div className="flex items-center gap-2">
          <div className="font-mono text-xs font-bold text-emerald-400 bg-studio-950 px-2 py-1 rounded border border-studio-800 tracking-wider">
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
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-studio-800 rounded transition-colors"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSeek(Math.max(0, currentTimeMs - 33.33))}
            title="Step 1 Frame Back (Left Arrow)"
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-studio-800 rounded transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onTogglePlay}
            title="Play / Pause (Space)"
            className={`p-2.5 rounded-full shadow-lg mx-1 transition-all active:scale-95 ${
              isPlaying
                ? "bg-violet-600 hover:bg-violet-500 text-white ring-4 ring-violet-500/20 animate-pulse"
                : "bg-gradient-to-tr from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white shadow-violet-900/40"
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
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-studio-800 rounded transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSeek(totalDurationMs)}
            title="Jump to End (End)"
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-studio-800 rounded transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mute & Quality Indicators */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-studio-800 rounded transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
