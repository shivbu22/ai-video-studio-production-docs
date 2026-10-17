"use client";

import React, { useState } from "react";
import { Search, Film, Download, Check, Sparkles, Plus, Clock } from "lucide-react";

interface YouTubeClipFinderProps {
  onInsertClip: (clip: { title: string; durationMs: number; source: string }) => void;
}

export const YouTubeClipFinder: React.FC<YouTubeClipFinderProps> = ({ onInsertClip }) => {
  const [searchQuery, setSearchQuery] = useState("barbell row side view 4k");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResult, setSelectedResult] = useState(0);

  const searchResults = [
    {
      id: "yt-1",
      title: "Barbell Row Masterclass · 4K 60fps",
      channel: "Strength Channel",
      totalDur: "41:56",
      sliceDur: "4.0s",
      chapter: "Chapter 12:05 · Barbell row, side view",
      sourceTime: "12:31 - 12:35",
      filename: "barbell_row_side_4k.mp4",
      resolution: "3840x2160"
    },
    {
      id: "yt-2",
      title: "Full Back Day, Every Set Filmed",
      channel: "Training Vlog",
      totalDur: "22:10",
      sliceDur: "3.0s",
      chapter: "Chapter 06:40 · Pull-ups wide grip",
      sourceTime: "06:42 - 06:45",
      filename: "pullup_wide_4k.mp4",
      resolution: "3840x2160"
    },
    {
      id: "yt-3",
      title: "Dilution Refrigerator Macro Tour",
      channel: "Tech Science",
      totalDur: "18:22",
      sliceDur: "5.0s",
      chapter: "Chapter 04:12 · Golden chandelier cryostat",
      sourceTime: "04:15 - 04:20",
      filename: "quantum_cryostat_4k.mp4",
      resolution: "3840x2160"
    }
  ];

  const handleRunSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 400);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0e13] text-slate-100 select-none overflow-hidden font-sans">
      {/* Search Header */}
      <div className="p-2.5 bg-[#111217] border-b border-[#1c1e27] flex flex-col gap-2">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRunSearch()}
            className="w-full bg-[#161720] border border-[#232532] rounded pl-7 pr-16 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#3B63FF] transition-colors"
            placeholder="Search B-roll footage..."
          />
          <button
            onClick={handleRunSearch}
            className="absolute right-1 text-[10px] font-medium bg-[#3B63FF] hover:bg-[#4f73ff] text-white px-2 py-0.5 rounded transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
          <span className="font-medium text-slate-300">Matching B-Roll ({searchResults.length})</span>
          <span className="text-[10px] font-mono text-slate-500">4K Pro</span>
        </div>

        {searchResults.map((res, idx) => (
          <div
            key={res.id}
            onClick={() => setSelectedResult(idx)}
            className={`p-2.5 rounded border cursor-pointer transition-all ${
              selectedResult === idx
                ? "bg-[#181a24] border-[#3B63FF]/70 shadow-sm"
                : "bg-[#12131a] border-[#1e202a] hover:border-[#2b2e3c]"
            }`}
          >
            <div className="flex items-start justify-between gap-1 mb-1">
              <span className="text-xs font-semibold text-white leading-tight truncate">
                {res.title}
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-black/40 px-1 py-0.5 rounded shrink-0">
                {res.sliceDur}
              </span>
            </div>

            <div className="text-[11px] text-slate-400 truncate mb-2">
              {res.chapter}
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-slate-500">
              <span className="font-mono">{res.resolution}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onInsertClip({
                    title: res.title,
                    durationMs: parseFloat(res.sliceDur) * 1000,
                    source: "YouTube 4K B-Roll",
                  });
                }}
                className="flex items-center gap-1 text-[11px] font-medium text-[#9fb4ff] hover:text-white bg-[#3B63FF]/20 hover:bg-[#3B63FF] px-2 py-0.5 rounded transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add to Timeline</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
