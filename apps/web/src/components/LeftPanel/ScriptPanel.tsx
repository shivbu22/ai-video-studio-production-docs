"use client";

import React, { useState } from "react";
import { FileText, ExternalLink, Sparkles, CheckCircle2, Bookmark, BookOpen, Quote, ChevronRight, Layers } from "lucide-react";

export interface ScriptScene {
  id: string;
  order: number;
  type: "hook" | "body" | "cta";
  narration: string;
  visualIntent: string;
  template: string;
  durationSec: number;
}

export interface Claim {
  fact: string;
  sourceUrl: string;
}

interface ScriptPanelProps {
  scenes: ScriptScene[];
  claims: Claim[];
  activeSceneId?: string;
  onSelectScene: (sceneId: string) => void;
}

export const ScriptPanel: React.FC<ScriptPanelProps> = ({
  scenes,
  claims,
  activeSceneId,
  onSelectScene,
}) => {
  const [activeStudy, setActiveStudy] = useState<"nature" | "ffmi">("nature");

  return (
    <div className="flex flex-col h-full bg-[#05060a] overflow-y-auto select-none text-xs text-slate-200 border-r border-white/5">
      {/* Slot Studio Header */}
      <div className="p-3.5 bg-[#0a0c12] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#3B63FF]" />
          <span className="font-bold text-white text-xs tracking-wide">Research & Script Studio</span>
        </div>
        <span className="text-[10px] bg-cyan-500/10 text-cyan-400 font-semibold px-2 py-0.5 rounded-full border border-cyan-500/30">
          Source-Cited Facts
        </span>
      </div>

      <div className="p-4 space-y-5">
        {/* Pitch Headline */}
        <div>
          <h3 className="text-sm font-bold text-white">It does the research. And writes the script with you.</h3>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Studies, numbers, who said what. It reads them, highlights the exact sentence, and attaches citations to every line.
          </p>
        </div>

        {/* Slot Studio: Research That Lifts Off the Page */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span>Primary Scientific Evidence</span>
            <div className="flex gap-1">
              <button
                onClick={() => setActiveStudy("nature")}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                  activeStudy === "nature" ? "bg-[#3B63FF] text-white" : "bg-white/5 text-slate-400"
                }`}
              >
                Nature 2019
              </button>
              <button
                onClick={() => setActiveStudy("ffmi")}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                  activeStudy === "ffmi" ? "bg-[#3B63FF] text-white" : "bg-white/5 text-slate-400"
                }`}
              >
                Sports Med
              </button>
            </div>
          </div>

          {/* Academic Paper Card (Parchment Styled Desk Lift) */}
          <div className="bg-[#f5f3ee] text-[#1c1d22] p-4 rounded-xl shadow-xl relative overflow-hidden border border-black/10">
            <div className="flex items-center justify-between text-[10px] text-[#6b6d76] uppercase tracking-wider font-mono border-b border-black/10 pb-2 mb-2.5">
              <span>{activeStudy === "nature" ? "Nature · Vol 574 · Oct 2019" : "Clin J Sport Med · 1995"}</span>
              <span className="font-bold text-[#3B63FF]">Peer-Reviewed</span>
            </div>

            <h4 className="font-serif font-black text-xs leading-snug text-[#0f1013] mb-1.5">
              {activeStudy === "nature"
                ? "Quantum supremacy using a programmable superconducting processor"
                : "Fat-Free Mass Index in Users and Nonusers of Anabolic-Androgenic Steroids"}
            </h4>

            <p className="text-[10px] font-mono text-[#52545d] mb-2.5">
              {activeStudy === "nature" ? "Arute, F., Arya, K., Babbush, R. et al. (Google AI Quantum)" : "E. M. Kouri, H. G. Pope Jr., D. L. Katz, P. Oliva"}
            </p>

            <div className="text-[11px] font-serif leading-relaxed text-[#2a2c35] bg-white/70 p-2.5 rounded-lg border border-black/5">
              <span className="font-bold text-[9px] uppercase tracking-wider text-[#737582] block mb-1">Abstract Excerpt:</span>
              {activeStudy === "nature" ? (
                <>
                  “We demonstrate quantum supremacy with a programmable superconducting processor named Sycamore.{' '}
                  <mark className="bg-amber-300 text-black font-semibold px-1 py-0.5 rounded shadow-sm">
                    The processor performed a benchmark calculation in 200 seconds that would take a state-of-the-art supercomputer approximately 10,000 years.
                  </mark>{' '}
                  This dramatic increase in speed compared to all known classical algorithms is an experimental realization of quantum supremacy.”
                </>
              ) : (
                <>
                  “We calculated fat-free mass index (FFMI) in 157 male athletes.{' '}
                  <mark className="bg-amber-300 text-black font-semibold px-1 py-0.5 rounded shadow-sm">
                    The normalized FFMI values of athletes who had not used steroids extended up to a well-defined limit of 25.0.
                  </mark>{' '}
                  Similarly, 20 Mr. America winners from the presteroid era had a mean FFMI of 25.4.”
                </>
              )}
            </div>
          </div>

          {/* Connected Script Hook Card */}
          <div className="bg-[#10131b] p-3.5 rounded-xl border border-white/10 space-y-2 relative shadow-lg">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[#3B63FF] font-bold tracking-wide uppercase">Generated Script Hook</span>
              <span className="text-slate-400 font-mono">Draft 2 · Synced</span>
            </div>

            <p className="text-xs text-white font-medium italic">
              {activeStudy === "nature"
                ? "“Their Sycamore processor performed a benchmark in 200 seconds that would take supercomputers ten thousand years.”"
                : "“Natural lifters topped out around an FFMI of 25. So where does that leave him?”"}
            </p>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5">
              <span className="font-mono text-cyan-400">
                Source: {activeStudy === "nature" ? "Nature 574, 505–510 (2019)" : "Kouri et al., 1995"}
              </span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Claim</span>
              </span>
            </div>
          </div>
        </div>

        {/* Multi-Scene Breakdown */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span>Video Scene Breakdown</span>
            <span className="text-[10px] font-mono text-slate-500">3 Scenes · 14.0s Total</span>
          </div>

          <div className="space-y-2">
            {scenes.map((scene) => (
              <div
                key={scene.id}
                onClick={() => onSelectScene(scene.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  activeSceneId === scene.id
                    ? "bg-[#141824] border-[#3B63FF] shadow-lg shadow-[#3B63FF]/20"
                    : "bg-[#0a0c12] border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-white/10 text-white font-bold flex items-center justify-center text-[10px]">
                      {scene.order}
                    </span>
                    <span className="font-bold text-white uppercase text-[10px] tracking-wide">
                      {scene.type}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#3B63FF] bg-[#3B63FF]/10 px-2 py-0.5 rounded-full font-bold">
                    {scene.durationSec}s
                  </span>
                </div>

                <p className="text-xs text-slate-200 line-clamp-2 mb-2 font-sans">
                  {scene.narration}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 bg-black/30 px-2 py-1 rounded">
                  <span>Visual: {scene.visualIntent}</span>
                  <span className="text-purple-400 font-mono font-semibold">{scene.template}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
