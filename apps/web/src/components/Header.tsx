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
  SlidersVertical,
  Wand2,
  Video,
  Mic,
  BarChart3,
  Layers,
  Search
} from "lucide-react";

export type WorkspaceMode = "edit" | "clipfinder" | "cleanup" | "remotion" | "color" | "audio" | "director" | "publish";

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
  onToggleCopilot?: () => void;
  isCopilotOpen?: boolean;
}

const STAGES = [
  { id: "script", label: "Script & Research" },
  { id: "youtube", label: "YouTube Clips" },
  { id: "voice", label: "Voice Clean" },
  { id: "graphics", label: "Motion Graphics" },
  { id: "timeline", label: "Timeline NLE" },
  { id: "render", label: "Publish Pack" },
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
  onToggleCopilot,
  isCopilotOpen = false,
}) => {
  return (
    <header className="h-14 bg-[#05060a] border-b border-white/10 px-4 flex items-center justify-between z-30 select-none backdrop-blur-xl">
      {/* Brand & Workspace Mode Switcher */}
      <div className="flex items-center gap-3">
        {/* Slot Studio Official Logo */}
        <div 
          onClick={() => onWorkspaceChange("edit")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <svg viewBox="0 0 64 36" className="w-8 h-4.5 transition-transform group-hover:scale-105">
            <rect x="1.5" y="1.5" width="16" height="33" rx="6.5" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3"/>
            <rect x="24" y="0" width="16" height="36" rx="7" fill="#3B63FF"/>
            <rect x="25.5" y="1.5" width="13" height="10" rx="5" fill="#ffffff" opacity="0.25"/>
            <rect x="46.5" y="1.5" width="16" height="33" rx="6.5" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3"/>
          </svg>
          <span className="font-extrabold text-white text-sm tracking-tight font-sans">
            Slot Studio
          </span>
          <span className="text-[10px] bg-[#3B63FF]/15 text-[#9fb4ff] font-semibold px-2 py-0.5 rounded-full border border-[#3B63FF]/30 hidden sm:inline">
            Web Platform
          </span>
        </div>

        {/* Workspace Mode Pills */}
        <div className="hidden lg:flex items-center bg-[#10131b] border border-white/10 rounded-full p-0.5 text-xs">
          <button
            onClick={() => onWorkspaceChange("edit")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold transition-all ${
              activeWorkspace === "edit"
                ? "bg-[#3B63FF] text-white shadow-md shadow-[#3B63FF]/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>
          <button
            onClick={() => onWorkspaceChange("clipfinder")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold transition-all ${
              activeWorkspace === "clipfinder"
                ? "bg-violet-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>Clip Finder</span>
          </button>
          <button
            onClick={() => onWorkspaceChange("cleanup")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold transition-all ${
              activeWorkspace === "cleanup"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>VO Cleanup</span>
          </button>
          <button
            onClick={() => onWorkspaceChange("remotion")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold transition-all ${
              activeWorkspace === "remotion"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Remotion 3D</span>
          </button>
          <button
            onClick={() => onWorkspaceChange("color")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold transition-all ${
              activeWorkspace === "color"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Color</span>
          </button>
          <button
            onClick={() => onWorkspaceChange("audio")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold transition-all ${
              activeWorkspace === "audio"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <SlidersVertical className="w-3.5 h-3.5" />
            <span>Mixer</span>
          </button>
          <button
            onClick={() => onWorkspaceChange("director")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold transition-all ${
              activeWorkspace === "director"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>AI Director</span>
          </button>
          <button
            onClick={() => onWorkspaceChange("publish")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold transition-all ${
              activeWorkspace === "publish"
                ? "bg-rose-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>Publish Kit</span>
          </button>
        </div>
      </div>

      {/* Slot Studio 6-Stage Pipeline Nav */}
      <div className="hidden 2xl:flex items-center gap-1 bg-[#0a0c12] px-2.5 py-1 rounded-full border border-white/10">
        {STAGES.map((s, idx) => {
          const isActive = s.id === activeStage;
          return (
            <React.Fragment key={s.id}>
              <button
                onClick={() => onStageSelect(s.id)}
                className={`text-[11px] px-2.5 py-1 rounded-full transition-all font-semibold ${
                  isActive
                    ? "bg-white/15 text-white shadow-sm"
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

      {/* Right Action Bar */}
      <div className="flex items-center gap-2.5">
        {/* 1-Prompt Autonomous Video Generator */}
        <button
          onClick={onOpenOnePromptModal}
          className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#3B63FF] to-[#2440c9] hover:from-[#4f73ff] hover:to-[#3B63FF] text-white font-bold shadow-lg shadow-[#3B63FF]/25 active:scale-95 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>1-Prompt Video</span>
        </button>

        {/* Claude AI Copilot Toggle */}
        {onToggleCopilot && (
          <button
            onClick={onToggleCopilot}
            className={`flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full border transition-all ${
              isCopilotOpen
                ? "bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-950/50"
                : "bg-[#10131b] border-white/10 text-slate-300 hover:bg-[#141824]"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="font-semibold">Claude Copilot</span>
          </button>
        )}

        {/* MCP Proposal Trigger */}
        <button
          onClick={onOpenProposals}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${
            hasPendingProposal
              ? "bg-amber-500/10 border-amber-500/50 text-amber-300 animate-pulse"
              : "bg-[#10131b] border-white/10 text-slate-300 hover:bg-[#141824]"
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-[#3B63FF]" />
          <span className="font-semibold">MCP Agent</span>
          {hasPendingProposal && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>

        {/* Resolution Switcher */}
        <div className="flex items-center bg-[#10131b] border border-white/10 rounded-full p-0.5 text-xs">
          <button
            onClick={() => onQualityChange("540p")}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
              previewQuality === "540p"
                ? "bg-white/20 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            540p
          </button>
          <button
            onClick={() => onQualityChange("1080p")}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
              previewQuality === "1080p"
                ? "bg-[#3B63FF] text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            1080p
          </button>
        </div>

        {/* Slot Studio Signature White Pill Export Button */}
        <button
          onClick={onExport}
          className="btn-slot btn-slot-buy text-xs font-bold px-4 py-1.5 text-black shadow-lg"
        >
          <Download className="w-3.5 h-3.5 text-black" />
          <span>Export 4K Master</span>
        </button>
      </div>
    </header>
  );
};
