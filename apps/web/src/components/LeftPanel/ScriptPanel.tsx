"use client";

import React from "react";
import { FileText, ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";

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
  return (
    <div className="flex flex-col h-full bg-studio-900 overflow-y-auto select-none text-xs">
      {/* Cited Claims Section */}
      <div className="p-3 border-b border-studio-800 bg-studio-950/40">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Research Claims (Web Search Cited)</span>
        </div>
        <div className="space-y-1.5">
          {claims.map((c, idx) => (
            <div key={idx} className="p-2 rounded bg-studio-850 border border-studio-800 text-[11px]">
              <div className="text-slate-200 mb-1">{c.fact}</div>
              <a
                href={c.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>{c.sourceUrl}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Structured Scene Sequence */}
      <div className="p-3 flex-1 space-y-2">
        <div className="flex items-center justify-between text-slate-400 font-semibold mb-1">
          <span>Scene Sequence ({scenes.length} Scenes)</span>
          <span className="text-[10px] text-emerald-400">Locked to Audio</span>
        </div>

        {scenes.map((s) => {
          const isActive = s.id === activeSceneId;
          return (
            <div
              key={s.id}
              onClick={() => onSelectScene(s.id)}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                isActive
                  ? "bg-violet-950/30 border-violet-500/60 shadow-sm"
                  : "bg-studio-850 border-studio-800 hover:border-studio-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-100 uppercase tracking-wider text-[10px]">
                  Scene {s.order} • {s.type}
                </span>
                <span className="text-[10px] bg-studio-800 text-slate-400 px-1.5 py-0.5 rounded">
                  {s.durationSec}s • {s.template}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] mb-2 leading-relaxed italic">
                "{s.narration}"
              </p>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <span className="text-violet-400 font-medium">Visual:</span>
                <span>{s.visualIntent}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
