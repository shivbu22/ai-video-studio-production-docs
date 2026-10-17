"use client";

import React from "react";
import { 
  Film, 
  Sparkles, 
  Zap, 
  Download, 
  Bot, 
  ChevronRight,
  Palette,
  Sliders,
  Wand2,
  SlidersVertical
} from "lucide-react";

export type WorkspaceMode = "edit" | "color" | "audio" | "director";

interface HeaderProps {
  projectTitle: string;
  previewQuality: "540p" | "1080p";
  onQualityChange: (quality: "540p" | "1080p") => void;
  activeStage: string;
  onStageSelect: (stage: string) => void;
  activeWorkspace: WorkspaceMode;
  onWorkspaceChange: (mode: WorkspaceMode) => void;
  onOpenOnePromptModal: () => void;
  onOpenProposals: () => void;
  hasPendingProposal: boolean;
  onExport: () => void;
}

const STAGES = [
  { id: "brief", label: "Brief" },
  { id: "research", label: "Research" },
  { id: "script", label: "Script" },
  { id: "voice", label: "Voice" },
  { id: "cleanup", label: "Cleanup" },
  { id: "visuals", label: "Visuals" },
  { id: "timeline", label: "Timeline" },
  { id: "render", label: "Render" },
];

export const Header: React.FC<HeaderProps> = ({
  projectTitle,
  previewQuality,
  onQualityChange,
  activeStage,
  onStageSelect,
  activeWorkspace,
  onWorkspaceChange,
  onOpenOnePromptModal,
  onOpenProposals,
  hasPendingProposal,
  onExport,
}) => {
  return (
    <header className="h-14 bg-studio-950 border-b border-studio-800 px-4 flex items-center justify-between z-30 select-none backdrop-blur-md">
      {/* Brand & Workspace Mode Switcher */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg shadow-sm font-black tracking-wider text-xs">
          <Film className="w-4 h-4" />
          <span>STUDIO PRO</span>
        </div>

        {/* Workspace Mode Pills (Premiere / DaVinci Style) */}
        <div className="hidden md:flex items-center bg-studio-900 border border-studio-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => onWorkspaceChange("edit")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-all ${
              activeWorkspace === "edit"
                ? "bg-violet-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onWorkspaceChange("color")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-all ${
              activeWorkspace === "color"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Color Grading</span>
          </button>
          <button
            onClick={() => onWorkspaceChange("audio")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-all ${
              activeWorkspace === "audio"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <SlidersVertical className="w-3.5 h-3.5" />
            <span>Audio Mixer</span>
          </button>
          <button
            onClick={() => onWorkspaceChange("director")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-all ${
              activeWorkspace === "director"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>AI Director</span>
          </button>
        </div>

        {/* Project Name */}
        <div className="h-5 w-[1px] bg-studio-800 mx-1 hidden lg:block" />
        <div className="hidden xl:flex items-center gap-2">
          <span className="font-semibold text-xs text-slate-200 truncate max-w-[200px]">{projectTitle}</span>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-medium px-2 py-0.5 rounded-full border border-emerald-500/30">
            Route B Clean-Room
          </span>
        </div>
      </div>

      {/* 10-Stage Pipeline Indicator */}
      <div className="hidden 2xl:flex items-center gap-1 bg-studio-900/80 p-1 rounded-lg border border-studio-800">
        {STAGES.map((s, idx) => {
          const isActive = s.id === activeStage;
          return (
            <React.Fragment key={s.id}>
              <button
                onClick={() => onStageSelect(s.id)}
                className={`text-[11px] px-2 py-0.5 rounded transition-all font-medium ${
                  isActive
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {s.label}
              </button>
              {idx < STAGES.length - 1 && (
                <ChevronRight className="w-3 h-3 text-slate-700" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        {/* 1-Prompt Video Generator */}
        <button
          onClick={onOpenOnePromptModal}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white font-semibold shadow-md shadow-fuchsia-950/40 active:scale-95 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>1-Prompt Video</span>
        </button>

        {/* MCP Proposal Trigger */}
        <button
          onClick={onOpenProposals}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
            hasPendingProposal
              ? "bg-amber-500/10 border-amber-500/50 text-amber-300 animate-pulse"
              : "bg-studio-900 border-studio-800 text-slate-300 hover:bg-studio-850"
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-violet-400" />
          <span>MCP Agent</span>
          {hasPendingProposal && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>

        {/* Resolution Switcher */}
        <div className="flex items-center bg-studio-900 border border-studio-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => onQualityChange("540p")}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              previewQuality === "540p"
                ? "bg-studio-800 text-slate-100 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            540p
          </button>
          <button
            onClick={() => onQualityChange("1080p")}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              previewQuality === "1080p"
                ? "bg-violet-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            1080p
          </button>
        </div>

        {/* Unlimited Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
          <span>Unlimited</span>
        </div>

        {/* Render/Export Button */}
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow-sm active:scale-95 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
