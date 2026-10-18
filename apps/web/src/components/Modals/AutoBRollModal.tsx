"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  X, 
  Film, 
  Check, 
  CheckCircle2, 
  Layers, 
  Clock, 
  Search, 
  ArrowRight,
  Video,
  Play
} from "lucide-react";

export interface BRollItem {
  id: string;
  title: string;
  keyword: string;
  durationMs: number;
  matchScore: number;
  resolution: string;
  fps: number;
  gradientBg: string;
  selected: boolean;
}

interface AutoBRollModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  currentTimeMs: number;
  onInsertBRollClips: (clips: Array<{ title: string; durationMs: number; trackId: string }>) => void;
}

export const AutoBRollModal: React.FC<AutoBRollModalProps> = ({
  isOpen,
  onClose,
  projectTitle,
  currentTimeMs,
  onInsertBRollClips,
}) => {
  const [brollCandidates, setBrollCandidates] = useState<BRollItem[]>([
    {
      id: "broll_1",
      title: "Cryogenic Dilution Chandelier (Macro 4K)",
      keyword: "Quantum Hardware",
      durationMs: 4000,
      matchScore: 98,
      resolution: "3840×2160",
      fps: 60,
      gradientBg: "from-blue-900 via-indigo-950 to-black",
      selected: true,
    },
    {
      id: "broll_2",
      title: "Summit Supercomputer LED Rack Pulse",
      keyword: "High Performance Compute",
      durationMs: 3500,
      matchScore: 94,
      resolution: "3840×2160",
      fps: 60,
      gradientBg: "from-cyan-900 via-slate-950 to-black",
      selected: true,
    },
    {
      id: "broll_3",
      title: "Silicon Wafer Cleanroom Micro-Etching",
      keyword: "Qubit Microfabrication",
      durationMs: 4500,
      matchScore: 91,
      resolution: "3840×2160",
      fps: 60,
      gradientBg: "from-amber-900 via-slate-950 to-black",
      selected: true,
    },
    {
      id: "broll_4",
      title: "Optical Laser Breadboard Interferometer",
      keyword: "Photon Entanglement",
      durationMs: 3800,
      matchScore: 89,
      resolution: "3840×2160",
      fps: 60,
      gradientBg: "from-purple-900 via-indigo-950 to-black",
      selected: true,
    },
  ]);

  const [isInserting, setIsInserting] = useState(false);

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    setBrollCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  };

  const handleInsertSelected = () => {
    setIsInserting(true);
    const selected = brollCandidates.filter((c) => c.selected);
    const clipsToInsert = selected.map((c) => ({
      title: `[B-Roll] ${c.title}`,
      durationMs: c.durationMs,
      trackId: "v2",
    }));

    setTimeout(() => {
      onInsertBRollClips(clipsToInsert);
      setIsInserting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none font-sans">
      <div className="bg-[#0f1016] border border-[#232633] rounded-xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#14151d] border-b border-[#20222e] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>AI Semantic B-Roll Auto-Inserter</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Track V2
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Contextual stock cutaways matched to narration keywords for &apos;{projectTitle}&apos;
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-cyan-400" />
              <span>4 Matched 4K B-Roll Clips ({brollCandidates.filter((c) => c.selected).length} Selected)</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-400">
              Pexels 4K Royalty-Free API
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {brollCandidates.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleSelect(item.id)}
                className={`p-3 rounded-lg border flex flex-col justify-between cursor-pointer transition-all bg-gradient-to-br ${item.gradientBg} ${
                  item.selected
                    ? "border-cyan-400 shadow-md shadow-cyan-950/40"
                    : "border-slate-800 opacity-60 hover:opacity-90"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-cyan-300 border border-cyan-500/30">
                    {item.keyword}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {item.matchScore}%
                    </span>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      item.selected ? "bg-cyan-500 border-cyan-400 text-black" : "border-slate-600 bg-black/40"
                    }`}>
                      {item.selected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <h4 className="text-xs font-bold text-white line-clamp-1">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-300 font-mono">
                    <span>{item.resolution}</span>
                    <span>•</span>
                    <span>{item.fps}fps</span>
                    <span>•</span>
                    <span className="text-cyan-400">{(item.durationMs / 1000).toFixed(1)}s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Insertion Info Banner */}
          <div className="bg-[#14151d] p-3 rounded-lg border border-[#222432] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Target Track: <strong className="text-white">V2 (Overlay / Cutaways)</strong> at <strong className="text-cyan-400 font-mono">{(currentTimeMs / 1000).toFixed(1)}s</strong></span>
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">
              Auto J-Cut 150ms Overlap
            </span>
          </div>

          {/* Action Button */}
          <button
            id="btn-confirm-insert-broll"
            onClick={handleInsertSelected}
            disabled={isInserting || brollCandidates.filter((c) => c.selected).length === 0}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow-lg shadow-cyan-950/40 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>
              {isInserting 
                ? "Inserting B-Roll to Track V2..." 
                : `Insert ${brollCandidates.filter((c) => c.selected).length} B-Roll Cutaways to Timeline`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
