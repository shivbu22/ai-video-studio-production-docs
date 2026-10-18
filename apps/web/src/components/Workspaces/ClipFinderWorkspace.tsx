"use client";

import React, { useState } from "react";
import { 
  Search, 
  Scissors, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Play, 
  FileText, 
  Plus, 
  Sliders, 
  Download, 
  Film, 
  Youtube,
  Layers,
  ArrowRight
} from "lucide-react";

interface ClipFinderWorkspaceProps {
  onInsertClip?: (clipTitle: string, durationMs: number) => void;
  currentTimeMs: number;
}

export const ClipFinderWorkspace: React.FC<ClipFinderWorkspaceProps> = ({
  onInsertClip,
  currentTimeMs,
}) => {
  const [searchQuery, setSearchQuery] = useState("barbell row latissimus dorsi 4k 60fps");
  const [selectedScriptLine, setSelectedScriptLine] = useState(2);
  const [inTimeSec, setInTimeSec] = useState(1104); // 18:24
  const [outTimeSec, setOutTimeSec] = useState(1108); // 18:28
  const [isCached, setIsCached] = useState(true);
  const [isInserting, setIsInserting] = useState(false);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const scriptLines = [
    { id: 0, text: "“Your back has two primary vector planes: width and thickness.”", tag: "Host A-Roll", status: "ready" },
    { id: 1, text: "“Wide-grip pull-ups build vertical lat width.”", tag: "B-Roll Found", status: "ready" },
    { id: 2, text: "“Heavy bent-over rows build the maximum spinal erector thickness.”", tag: "Needs 4K Shot", status: "matched", query: "barbell row side view 4k" },
    { id: 3, text: "“Pull aggressively toward the iliac crest, not the chest.”", tag: "Needs Macro Angle", status: "searching", query: "barbell row hip pull angle" },
    { id: 4, text: "“Schoenfeld et al. (2021) demonstrated 118% higher mean motor unit recruitment.”", tag: "Paper Lift-Off", status: "ready" },
  ];

  const candidateClips = [
    {
      id: "c1",
      title: "Chest-Supported T-Bar Row Form",
      channel: "Dr. Mike Israetel • Renaissance Periodization",
      totalDuration: "28:14",
      cutDuration: "0:04",
      cutRange: "14:10 - 14:14",
      confidence: 98.4,
      res: "4K 60fps",
      thumbBg: "from-blue-900/60 to-slate-900",
    },
    {
      id: "c2",
      title: "Barbell Bent-Over Row Anatomical Breakdown",
      channel: "Jeff Nippard • Ultimate Back Hypertrophy",
      totalDuration: "41:56",
      cutDuration: "0:04",
      cutRange: "18:24 - 18:28",
      confidence: 96.8,
      res: "4K HDR",
      thumbBg: "from-indigo-900/60 to-slate-900",
      active: true,
    },
    {
      id: "c3",
      title: "Raw Powerlifting Back Session",
      channel: "Strength Science Lab",
      totalDuration: "19:45",
      cutDuration: "0:05",
      cutRange: "06:12 - 06:17",
      confidence: 91.2,
      res: "1080p60",
      thumbBg: "from-emerald-900/60 to-slate-900",
    },
  ];

  const handleInsert = (title: string, durationSec = 4) => {
    setIsInserting(true);
    setTimeout(() => {
      setIsInserting(false);
      if (onInsertClip) {
        onInsertClip(title, durationSec * 1000);
      }
    }, 600);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0b0e14] text-slate-200 select-none">
      {/* LEFT PANEL: Script Lines & Semantic Query Scanner */}
      <div className="w-96 border-r border-slate-800/80 bg-[#101319] flex flex-col shrink-0">
        <div className="p-3 border-b border-slate-800 bg-[#14171d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Youtube className="w-4 h-4 text-red-500" />
            <span className="text-xs font-bold text-white tracking-wide">SMART SCRIPT CLIP FINDER</span>
          </div>
          <span className="text-[10px] bg-violet-500/20 text-violet-300 border border-violet-500/30 px-1.5 py-0.5 rounded font-mono">
            OmniCut v2.4
          </span>
        </div>

        {/* Search bar */}
        <div className="p-3 border-b border-slate-800 bg-[#0d0f14]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161a22] border border-slate-700/60 rounded pl-8 pr-12 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono"
            />
            <span className="absolute right-2 top-1 text-[9px] bg-slate-800 text-slate-400 px-1 rounded border border-slate-700">
              ⌘K
            </span>
          </div>
          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
            <span>Scan 4K YouTube & Stock API</span>
            <span className="text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Auto-Cutter Ready
            </span>
          </div>
        </div>

        {/* Script Line List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Script Scene Sequence (OmniCut Intake)
          </div>
          {scriptLines.map((line) => {
            const isSelected = selectedScriptLine === line.id;
            return (
              <div 
                key={line.id}
                onClick={() => setSelectedScriptLine(line.id)}
                className={`p-2.5 rounded border transition-all cursor-pointer relative ${
                  isSelected 
                    ? "bg-violet-950/30 border-violet-500/70 shadow-sm shadow-violet-900/20" 
                    : "bg-[#14171d] border-slate-800/80 hover:border-slate-700"
                }`}
              >
                {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500 rounded-l" />}
                <div className="flex items-center justify-between mb-1 text-[10px]">
                  <span className="font-mono text-slate-400">Scene 0{line.id + 1}</span>
                  <span className={`px-1.5 py-0.2 rounded font-mono ${
                    line.status === "matched" 
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" 
                      : line.status === "ready" 
                        ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                        : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  }`}>
                    {line.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                  {line.text}
                </p>
                {line.query && (
                  <div className="mt-2 text-[10px] bg-black/40 px-2 py-0.5 rounded text-violet-300 border border-violet-500/20 font-mono flex items-center justify-between">
                    <span className="truncate">query: “{line.query}”</span>
                    <span className="text-emerald-400">Match 98%</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Research Study Lift-Off Card */}
          <div className="mt-4 p-3 bg-gradient-to-br from-amber-950/20 to-slate-900 rounded border border-amber-500/30">
            <div className="flex items-center justify-between mb-1 text-[10px]">
              <span className="text-amber-400 font-bold uppercase tracking-wide flex items-center gap-1">
                <FileText className="w-3 h-3 text-amber-400" />
                Paper Ingestion (OmniCut Method)
              </span>
              <span className="bg-amber-500/20 text-amber-300 text-[9px] px-1 rounded border border-amber-500/30 font-mono">
                Extracted
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium">
              Schoenfeld et al. (2021) — Latissimus Dorsi Motor Unit EMG
            </p>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Automatic 3D page curl with luminescent yellow highlighting over key conclusion: 
              <span className="text-amber-300 bg-amber-500/10 px-1 py-0.2 rounded ml-1">
                “118% higher recruitment in horizontal rowing vs pulldown”
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* CENTER STAGE: Precision 41:56 -> 0:04 YouTube Cutter Preview */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#0d0f14]">
        {/* Cutter Header Bar */}
        <div className="h-10 px-4 border-b border-slate-800 bg-[#12151b] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-semibold text-white">Smart In/Out Sub-Clip Cutter</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700">
              Never save the whole 40-min video • Keeps only 4.0s
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-400 line-through">41:56</span>
              <ArrowRight className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                0:04 KEPT
              </span>
            </div>
            <button 
              onClick={() => handleInsert("Jeff Nippard 4K Barbell Row (0:04 Cut)", 4)}
              disabled={isInserting}
              className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-3 py-1.5 rounded shadow-lg shadow-violet-950/40 active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isInserting ? "Inserting..." : "Insert at Playhead"}</span>
            </button>
          </div>
        </div>

        {/* Video Player & Scrubber Stage */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
          {/* Simulated 4K Player */}
          <div className="w-full max-w-3xl aspect-video bg-black rounded-lg border border-slate-800 relative shadow-2xl overflow-hidden flex flex-col justify-between">
            {/* Visual simulation of YouTube 4K Frame */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-black flex items-center justify-center">
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-violet-600/30 border border-violet-500/60 flex items-center justify-center mx-auto mb-3 text-violet-300 backdrop-blur-sm">
                  <Play className="w-7 h-7 ml-0.5" />
                </div>
                <h3 className="text-base font-bold text-white tracking-wide">
                  Jeff Nippard: Ultimate Back Hypertrophy Masterclass
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Chapter 18:05: Barbell Bent-Over Row (Side View 4K60)
                </p>
                <div className="inline-flex items-center gap-2 mt-3 bg-black/60 border border-slate-700/60 px-3 py-1 rounded-full text-[11px] font-mono text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sub-Clip isolated: 18:24 → 18:28 (4K 3840×2160)</span>
                </div>
              </div>
            </div>

            {/* Top HUD Badges */}
            <div className="relative z-10 p-3 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-2">
                <span className="bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded">4K 60FPS</span>
                <span className="text-xs text-slate-200 font-medium">Auto-Cut In/Out Range</span>
              </div>
              <span className="text-xs font-mono text-slate-300 bg-black/50 px-2 py-0.5 rounded border border-slate-700">
                Playhead: {formatSeconds(inTimeSec)} / 41:56
              </span>
            </div>

            {/* Bottom Filmstrip Scrub Bar */}
            <div className="relative z-10 p-4 bg-gradient-to-t from-black via-black/90 to-transparent space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="text-violet-300">In: {formatSeconds(inTimeSec)}</span>
                <span className="text-emerald-400 font-bold">Clip Duration: {outTimeSec - inTimeSec} seconds</span>
                <span className="text-violet-300">Out: {formatSeconds(outTimeSec)}</span>
              </div>

              {/* Dual Slider / Scrubber */}
              <div className="relative h-10 bg-slate-900/90 rounded border border-slate-700/80 overflow-hidden flex items-center px-1">
                {/* Filmstrip ticks */}
                <div className="absolute inset-0 flex justify-between items-center opacity-20 pointer-events-none px-2">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="w-[1px] h-4 bg-slate-400" />
                  ))}
                </div>

                {/* Selected 4s cut range highlight */}
                <div 
                  className="absolute h-8 bg-violet-600/30 border-2 border-violet-500 rounded flex items-center justify-between px-2 text-[10px] font-mono text-white shadow-lg shadow-violet-950/50"
                  style={{ left: "42%", width: "16%" }}
                >
                  <span className="w-1.5 h-4 bg-white/70 rounded-full cursor-ew-resize"></span>
                  <span className="font-bold text-violet-200">0:04</span>
                  <span className="w-1.5 h-4 bg-white/70 rounded-full cursor-ew-resize"></span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>00:00 (Start)</span>
                <span>10:00</span>
                <span className="text-violet-400 font-semibold">18:24 [IN]</span>
                <span>30:00</span>
                <span>41:56 (End)</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM CANDIDATE QUEUE: Ready Sourced B-Roll Clips */}
        <div className="h-44 border-t border-slate-800 bg-[#101319] p-3 flex flex-col shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-violet-400" />
              Sourced 4K Clips & Photos in Project Folder
            </span>
            <span className="text-[10px] font-mono text-emerald-400">
              3 Clips Cached • 0 MB Bloat
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 flex-1">
            {candidateClips.map((clip) => (
              <div 
                key={clip.id}
                className={`rounded border p-2.5 flex flex-col justify-between transition-all ${
                  clip.active 
                    ? "bg-violet-950/20 border-violet-500/50 shadow-sm" 
                    : "bg-[#14171d] border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="truncate mr-2">
                    <p className="text-xs font-bold text-white truncate">{clip.title}</p>
                    <p className="text-[10px] text-slate-400 truncate">{clip.channel}</p>
                  </div>
                  <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono border border-slate-700 shrink-0">
                    {clip.res}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono">
                  <span className="text-slate-400">Cut: <b className="text-white">{clip.cutDuration}</b> ({clip.cutRange})</span>
                  <button 
                    onClick={() => handleInsert(clip.title)}
                    className="text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1"
                  >
                    <span>Insert</span>
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
