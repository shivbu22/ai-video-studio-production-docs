"use client";

import React, { useState } from "react";
import { Search, Film, Download, Check, Sparkles, ExternalLink, Scissors, Play, ShieldCheck, ArrowRight } from "lucide-react";

interface YouTubeClipFinderProps {
  onInsertClip: (clip: { title: string; durationMs: number; source: string }) => void;
}

export const YouTubeClipFinder: React.FC<YouTubeClipFinderProps> = ({ onInsertClip }) => {
  const [searchQuery, setSearchQuery] = useState("barbell row side view 4k");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResult, setSelectedResult] = useState(0);
  const [sliceStart, setSliceStart] = useState("12:31");
  const [sliceEnd, setSliceEnd] = useState("12:35");
  const [savedClip, setSavedClip] = useState(false);

  const searchResults = [
    {
      id: "yt-1",
      title: "Barbell Row Masterclass · Full Workout in 4K",
      channel: "Strength Channel · 4K 60fps",
      totalDur: "41:56",
      pickedSlice: "0:04",
      chapter: "Chapter 12:05 · Barbell row, side view",
      sourceTime: "12:31 → 12:35",
      filename: "barbell_row_side_4k.mp4",
      resolution: "3840 × 2160"
    },
    {
      id: "yt-2",
      title: "Full Back Day, Every Set Filmed (High Angle)",
      channel: "Training Vlog · 1080p",
      totalDur: "22:10",
      pickedSlice: "0:03",
      chapter: "Chapter 06:40 · Pull-ups wide grip",
      sourceTime: "06:42 → 06:45",
      filename: "pullup_wide_4k.mp4",
      resolution: "3840 × 2160"
    },
    {
      id: "yt-3",
      title: "Quantum Dilution Refrigerator Macro Laboratory Tour",
      channel: "Tech Science · 4K",
      totalDur: "18:22",
      pickedSlice: "0:05",
      chapter: "Chapter 04:12 · Golden chandelier cryostat",
      sourceTime: "04:15 → 04:20",
      filename: "quantum_cryostat_4k.mp4",
      resolution: "3840 × 2160"
    }
  ];

  const current = searchResults[selectedResult];

  const handleRunSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 400);
  };

  const handleSaveAndInsert = () => {
    onInsertClip({
      title: current.filename,
      durationMs: 4000,
      source: `YouTube 4K (${current.sourceTime})`
    });
    setSavedClip(true);
    setTimeout(() => setSavedClip(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-[#05060a] text-slate-100 select-none overflow-hidden border-r border-white/5">
      {/* Slot Studio Clip Finder Header */}
      <div className="p-3.5 bg-[#0a0c12] border-b border-white/5 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Slot Studio 3-pill logo */}
            <svg viewBox="0 0 64 36" className="w-5 h-3">
              <rect x="1.5" y="1.5" width="16" height="33" rx="6.5" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="3"/>
              <rect x="24" y="0" width="16" height="36" rx="7" fill="#3B63FF"/>
              <rect x="25.5" y="1.5" width="13" height="10" rx="5" fill="#fff" opacity="0.3"/>
              <rect x="46.5" y="1.5" width="16" height="33" rx="6.5" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="3"/>
            </svg>
            <span className="text-xs font-bold text-white tracking-wide">YouTube Clip Finder</span>
          </div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
            Done · ready to edit
          </span>
        </div>

        {/* Live Search Bar with Glowing Blue Ring */}
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRunSearch()}
            className="w-full bg-[#10131b] border border-white/10 rounded-full pl-8 pr-20 py-1.5 text-xs text-white focus:outline-none focus:border-[#3B63FF] focus:ring-2 focus:ring-[#3B63FF]/30 transition-all font-sans"
            placeholder="Search YouTube footage..."
          />
          <button
            onClick={handleRunSearch}
            className="absolute right-1 text-[11px] font-semibold bg-[#3B63FF] hover:bg-[#4f73ff] text-white px-2.5 py-1 rounded-full transition-all active:scale-95"
          >
            Search
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* Step 1: Script Line Connection */}
        <div className="bg-[#10131b] p-3 rounded-xl border border-white/5 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Script Line 13</span>
            <span className="text-amber-400 font-medium bg-amber-400/10 px-1.5 py-0.5 rounded">Needs a shot</span>
          </div>
          <p className="text-xs text-slate-200 italic font-serif">
            “Rows build the thickness. Pull to your hip, not your chest.”
          </p>
          <div className="text-[10px] text-cyan-400 font-mono">Target: barbell row, side view, 4K</div>
        </div>

        {/* Step 2: YouTube Results Picker */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span>YouTube 4K Matches ({searchResults.length})</span>
            <span className="text-[10px] text-slate-500">Auto-scanned</span>
          </div>

          <div className="space-y-2">
            {searchResults.map((res, idx) => (
              <div
                key={res.id}
                onClick={() => setSelectedResult(idx)}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  selectedResult === idx
                    ? "bg-[#141824] border-[#3B63FF] shadow-lg shadow-[#3B63FF]/15"
                    : "bg-[#0a0c12] border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-white line-clamp-1">{res.title}</h4>
                    <p className="text-[10px] text-slate-400">{res.channel}</p>
                    <p className="text-[10px] text-emerald-400 font-mono mt-1">{res.chapter}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white font-mono">{res.totalDur}</span>
                    <div className="text-[9px] text-[#3B63FF] font-bold mt-1.5">Cuts to {res.pickedSlice}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3: The Slot Studio Cut Slice */}
        <div className="bg-[#10131b] p-3.5 rounded-xl border border-white/5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Slot Studio Smart Slice</span>
            <span className="text-[10px] font-mono text-cyan-400">{current.resolution}</span>
          </div>

          <div className="flex items-center justify-between bg-[#05060a] p-2.5 rounded-lg border border-white/5">
            <div className="text-center">
              <span className="text-[10px] text-slate-500 block">Whole Video</span>
              <span className="text-xs font-mono font-bold text-slate-400 line-through">{current.totalDur}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#3B63FF]" />
            <div className="text-center">
              <span className="text-[10px] text-emerald-400 block">What it keeps</span>
              <span className="text-sm font-mono font-black text-emerald-300">{current.pickedSlice}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Timestamp Window:</span>
            <span className="font-mono text-white font-semibold">{current.sourceTime}</span>
          </div>

          <button
            onClick={handleSaveAndInsert}
            className="w-full py-2.5 rounded-xl bg-[#3B63FF] hover:bg-[#4f73ff] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#3B63FF]/30 active:scale-97 transition-all"
          >
            {savedClip ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Saved & Added to V1 Timeline!</span>
              </>
            ) : (
              <>
                <Scissors className="w-4 h-4 text-white" />
                <span>Cut 4s & Insert to Timeline</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
