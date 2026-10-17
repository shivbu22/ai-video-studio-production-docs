"use client";

import React, { useState } from "react";
import { 
  Film, 
  Sparkles, 
  Download, 
  Bot, 
  BookOpen, 
  Sparkle, 
  SlidersVertical, 
  ChevronDown,
  Layers,
  Search,
  Mic,
  Palette,
  Wand2,
  Share2,
  Type
} from "lucide-react";

export type WorkspaceMode = "edit" | "script" | "clipfinder" | "cleanup" | "remotion" | "captions" | "color" | "audio" | "director" | "publish";

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
  onOpenConnections?: () => void;
  onToggleCopilot?: () => void;
  isCopilotOpen?: boolean;
  onSelectProjectPreset?: (presetId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  projectTitle,
  activeWorkspace,
  onWorkspaceChange,
  onOpenOnePromptModal,
  onOpenProposals,
  hasPendingProposal,
  onExport,
  onToggleCopilot,
  isCopilotOpen = false,
  onSelectProjectPreset,
}) => {
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);

  return (
    <header className="h-11 bg-[#0c0d11] border-b border-[#1e2029] px-3.5 flex items-center justify-between z-30 select-none font-sans">
      {/* Left: Brand & Project Selector */}
      <div className="flex items-center gap-3">
        {/* Minimalist Slot Studio Logo */}
        <div 
          onClick={() => onWorkspaceChange("edit")}
          className="flex items-center gap-2 cursor-pointer group"
          title="Return to Timeline"
        >
          <svg viewBox="0 0 64 36" className="w-6 h-3.5 transition-transform group-hover:scale-105">
            <rect x="1.5" y="1.5" width="16" height="33" rx="6.5" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="3"/>
            <rect x="24" y="0" width="16" height="36" rx="7" fill="#3B63FF"/>
            <rect x="25.5" y="1.5" width="13" height="10" rx="5" fill="#ffffff" opacity="0.3"/>
            <rect x="46.5" y="1.5" width="16" height="33" rx="6.5" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="3"/>
          </svg>
          <span className="font-bold text-white text-[13px] tracking-tight">
            Slot Studio
          </span>
        </div>

        <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

        {/* Project Selector (Minimalist) */}
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <select
            value={projectTitle}
            onChange={(e) => {
              if (onSelectProjectPreset) {
                if (e.target.value.includes("Quantum")) onSelectProjectPreset("quantum");
                else if (e.target.value.includes("Hypertrophy")) onSelectProjectPreset("hypertrophy");
                else if (e.target.value.includes("Autonomous")) onSelectProjectPreset("agents");
              }
            }}
            className="bg-transparent text-xs font-medium text-slate-200 hover:text-white focus:outline-none cursor-pointer py-1 max-w-[200px] truncate"
          >
            <option value="Quantum Supremacy 2026" className="bg-[#121318] text-white">Quantum Supremacy 2026</option>
            <option value="Back Hypertrophy: Rows vs Pullups" className="bg-[#121318] text-white">Back Hypertrophy: Rows vs Pullups</option>
            <option value="Autonomous AI Video Editors 2026" className="bg-[#121318] text-white">Autonomous AI Video Editors 2026</option>
          </select>
        </div>
      </div>

      {/* Center: Sleek 4-Workspace Segmented Switcher */}
      <div className="flex items-center bg-[#14151b] border border-[#232530] rounded-md p-0.5 text-xs">
        <button
          onClick={() => onWorkspaceChange("edit")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
            activeWorkspace === "edit"
              ? "bg-[#252836] text-white shadow-sm font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Film className="w-3.5 h-3.5 text-[#3B63FF]" />
          <span>Timeline</span>
        </button>

        <button
          onClick={() => onWorkspaceChange("script")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
            activeWorkspace === "script"
              ? "bg-[#252836] text-white shadow-sm font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>Script & Research</span>
        </button>

        <button
          onClick={() => onWorkspaceChange("remotion")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
            activeWorkspace === "remotion"
              ? "bg-[#252836] text-white shadow-sm font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>3D Motion</span>
        </button>

        <button
          onClick={() => onWorkspaceChange("audio")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
            activeWorkspace === "audio" || activeWorkspace === "color"
              ? "bg-[#252836] text-white shadow-sm font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <SlidersVertical className="w-3.5 h-3.5 text-teal-400" />
          <span>Mixer & Grade</span>
        </button>

        {/* More Tools Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowToolsDropdown(!showToolsDropdown)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
              ["clipfinder", "cleanup", "captions", "director", "publish"].includes(activeWorkspace)
                ? "text-blue-400 font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>Tools</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {showToolsDropdown && (
            <div 
              className="absolute left-0 top-full mt-1.5 w-44 bg-[#14151b] border border-[#2b2e3a] rounded-md shadow-2xl py-1 z-50 text-xs"
              onMouseLeave={() => setShowToolsDropdown(false)}
            >
              <button
                onClick={() => { onWorkspaceChange("clipfinder"); setShowToolsDropdown(false); }}
                className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <Search className="w-3.5 h-3.5 text-violet-400" />
                <span>4K Clip Finder</span>
              </button>
              <button
                onClick={() => { onWorkspaceChange("cleanup"); setShowToolsDropdown(false); }}
                className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
                <span>Voice Cleanup</span>
              </button>
              <button
                onClick={() => { onWorkspaceChange("captions"); setShowToolsDropdown(false); }}
                className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <Type className="w-3.5 h-3.5 text-amber-400" />
                <span>Kinetic Captions</span>
              </button>
              <button
                onClick={() => { onWorkspaceChange("color"); setShowToolsDropdown(false); }}
                className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <Palette className="w-3.5 h-3.5 text-orange-400" />
                <span>Color Grading LUTs</span>
              </button>
              <button
                onClick={() => { onWorkspaceChange("director"); setShowToolsDropdown(false); }}
                className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <Wand2 className="w-3.5 h-3.5 text-pink-400" />
                <span>AI Director Review</span>
              </button>
              <button
                onClick={() => { onWorkspaceChange("publish"); setShowToolsDropdown(false); }}
                className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <Share2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Publishing Kit (Shorts)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right: Clean Action Cluster */}
      <div className="flex items-center gap-2">
        {/* 1-Prompt Autonomous Generator (Quiet / Sleek) */}
        <button
          onClick={onOpenOnePromptModal}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-[#181a22] hover:bg-[#20232e] border border-[#2b2e3a] text-slate-200 hover:text-white font-medium transition-colors"
          title="Create full video from single prompt"
        >
          <Sparkle className="w-3.5 h-3.5 text-[#3B63FF]" />
          <span>1-Prompt AI</span>
        </button>

        {/* MCP Proposal Trigger (Minimalist indicator) */}
        {hasPendingProposal && (
          <button
            onClick={onOpenProposals}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 animate-pulse font-medium"
            title="AI timeline proposals pending"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Proposals</span>
          </button>
        )}

        {/* Claude AI Copilot Toggle */}
        {onToggleCopilot && (
          <button
            onClick={onToggleCopilot}
            className={`p-1.5 rounded-md border text-xs transition-colors ${
              isCopilotOpen
                ? "bg-[#3B63FF]/20 border-[#3B63FF]/50 text-white"
                : "bg-[#14151b] border-[#252834] text-slate-400 hover:text-slate-200"
            }`}
            title="Toggle Claude AI Copilot Drawer"
          >
            <Bot className="w-3.5 h-3.5 text-[#3B63FF]" />
          </button>
        )}

        {/* Slot Studio Signature White Pill Export Button */}
        <button
          onClick={onExport}
          className="btn-slot btn-slot-buy text-xs font-semibold px-3.5 py-1 text-black shadow-sm"
        >
          <Download className="w-3 h-3 text-black" />
          <span>Export 4K</span>
        </button>
      </div>
    </header>
  );
};
