"use client";

import React, { useState } from "react";
import { Mic, Volume2, Sparkles, Check, Scissors, Play, RefreshCw, Zap, ShieldCheck } from "lucide-react";

interface VoiceCleanStationProps {
  onApplyVoice: () => void;
}

export const VoiceCleanStation: React.FC<VoiceCleanStationProps> = ({ onApplyVoice }) => {
  const [takeMode, setTakeMode] = useState<"raw" | "clean">("clean");
  const [isPlaying, setIsPlaying] = useState(false);
  const [applied, setApplied] = useState(false);

  const rawDuration = "0:07.4";
  const cleanDuration = "0:04.7";

  const handleApply = () => {
    onApplyVoice();
    setApplied(true);
    setTimeout(() => setApplied(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-[#05060a] text-slate-100 select-none overflow-hidden border-r border-white/5">
      {/* Header */}
      <div className="p-3.5 bg-[#0a0c12] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-[#3B63FF]" />
          <span className="text-xs font-bold text-white tracking-wide">OmniCut Voice Cleaner</span>
        </div>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
          faster-whisper 48kHz
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Pitch Headline */}
        <div>
          <h3 className="text-sm font-bold text-white">Every breath. Every um. Gone.</h3>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Cuts every breath, every um and restarted sentence without clipping a single word.
          </p>
        </div>

        {/* Readout Counter Comparison */}
        <div className="grid grid-cols-2 gap-3 bg-[#10131b] p-3 rounded-xl border border-white/5">
          <div className={`p-2.5 rounded-lg text-center transition-all ${takeMode === "raw" ? "bg-white/10 border border-white/20" : "opacity-60"}`}>
            <span className="text-[10px] text-slate-400 block font-medium">Raw Take</span>
            <span className="text-sm font-mono font-bold text-slate-300">{rawDuration}</span>
          </div>
          <div className={`p-2.5 rounded-lg text-center transition-all ${takeMode === "clean" ? "bg-[#3B63FF]/20 border border-[#3B63FF] shadow-lg shadow-[#3B63FF]/20" : "opacity-60"}`}>
            <span className="text-[10px] text-cyan-400 block font-bold">Clean Take</span>
            <span className="text-sm font-mono font-black text-white">{cleanDuration}</span>
          </div>
        </div>

        {/* Mode Toggle Switch (Raw vs Clean) */}
        <div className="flex bg-[#10131b] p-1 rounded-full border border-white/10">
          <button
            onClick={() => setTakeMode("raw")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all ${
              takeMode === "raw" ? "bg-white/20 text-white shadow" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Raw Take
          </button>
          <button
            onClick={() => setTakeMode("clean")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all ${
              takeMode === "clean" ? "bg-[#3B63FF] text-white shadow-md shadow-[#3B63FF]/30" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Clean Take
          </button>
        </div>

        {/* Word-by-Word Cut Token Viewer */}
        <div className="bg-[#10131b] p-3.5 rounded-xl border border-white/5 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Speech Alignment</span>
          <div className="flex flex-wrap gap-1.5 text-xs font-sans leading-relaxed">
            {takeMode === "raw" ? (
              <>
                <span className="bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono text-[11px]">(breath)</span>
                <span className="text-slate-200">So</span>
                <span className="bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono text-[11px]">um,</span>
                <span className="bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono text-[11px]">the best way—</span>
                <span className="text-white font-semibold">the</span>
                <span className="text-white font-semibold">best</span>
                <span className="text-white font-semibold">way</span>
                <span className="text-white font-semibold">to</span>
                <span className="text-white font-semibold">grow</span>
                <span className="text-white font-semibold">is</span>
                <span className="text-white font-semibold">to</span>
                <span className="text-white font-semibold">stay</span>
                <span className="text-white font-semibold">consistent.</span>
              </>
            ) : (
              <>
                <span className="text-slate-500 line-through text-[11px] font-mono opacity-40">(breath)</span>
                <span className="text-slate-200">So</span>
                <span className="text-slate-500 line-through text-[11px] font-mono opacity-40">um,</span>
                <span className="text-slate-500 line-through text-[11px] font-mono opacity-40">the best way—</span>
                <span className="text-emerald-300 font-bold bg-emerald-500/10 px-1 rounded">the</span>
                <span className="text-emerald-300 font-bold bg-emerald-500/10 px-1 rounded">best</span>
                <span className="text-emerald-300 font-bold bg-emerald-500/10 px-1 rounded">way</span>
                <span className="text-emerald-300 font-bold bg-emerald-500/10 px-1 rounded">to</span>
                <span className="text-emerald-300 font-bold bg-emerald-500/10 px-1 rounded">grow</span>
                <span className="text-emerald-300 font-bold bg-emerald-500/10 px-1 rounded">is</span>
                <span className="text-emerald-300 font-bold bg-emerald-500/10 px-1 rounded">to</span>
                <span className="text-emerald-300 font-bold bg-emerald-500/10 px-1 rounded">stay</span>
                <span className="text-emerald-300 font-bold bg-emerald-500/10 px-1 rounded">consistent.</span>
              </>
            )}
          </div>
        </div>

        {/* Live Audio Waveform Simulation */}
        <div className="bg-[#05060a] p-3 rounded-xl border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>48kHz Mono 24-bit WAV</span>
            <span className="font-mono text-emerald-400">-14.0 LUFS Broadcast Standard</span>
          </div>

          <div className="h-10 flex items-center gap-[2px] justify-center px-2">
            {Array.from({ length: 42 }).map((_, i) => {
              const isCut = takeMode === "clean" && (i < 6 || (i >= 10 && i <= 18));
              const h = isCut ? 2 : (i % 4 === 0 ? 32 : i % 3 === 0 ? 22 : 14);
              return (
                <div
                  key={i}
                  style={{ height: `${h}px` }}
                  className={`flex-1 rounded-full transition-all duration-300 ${
                    isCut ? "bg-rose-500/30" : "bg-[#3B63FF]"
                  }`}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>3 cuts · 0 words clipped</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">15ms cross-fade</span>
          </div>
        </div>

        {/* Apply Action */}
        <button
          onClick={handleApply}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#3B63FF] to-[#2440c9] hover:from-[#4f73ff] hover:to-[#3B63FF] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#3B63FF]/30 active:scale-97 transition-all"
        >
          {applied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Cleaned Take Synced to A1!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-white" />
              <span>Apply Cleaned Voice to Timeline</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
