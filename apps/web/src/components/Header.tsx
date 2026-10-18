"use client";

import React, { useState } from "react";
import { 
  Radio,
  Scissors,
  Film,
  Database,
  Shield,
  Cpu,
  Globe2,
  MessageSquare,
  Users, 
  Sparkles, 
  Download, Save, Upload, 
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

export type WorkspaceMode = "edit" | "script" | "clipfinder" | "cleanup" | "remotion" | "captions" | "color" | "audio" | "director" | "publish" | "vfx" | "dubbing" | "volumetric" | "spatial" | "mam" | "multicam" | "style" | "matting" | "automation";

interface HeaderProps {
  onSaveProject?: () => void;
  onLoadProject?: () => void;
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
  onOpenCollabInvite?: () => void;
  onToggleCommentsDrawer?: () => void;
  isCommentsDrawerOpen?: boolean;
  commentCount?: number;
  onOpenClientExport?: () => void;
  onOpenShareReview?: () => void;
  onOpenStoryboard?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSaveProject,
  onLoadProject,
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
  onOpenCollabInvite,
  onToggleCommentsDrawer,
  isCommentsDrawerOpen = false,
  commentCount = 3,
  onOpenClientExport,
  onOpenShareReview,
  onOpenStoryboard,
}) => {
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);

  return (
    <header className="h-11 bg-[#0c0d11] border-b border-[#1e2029] px-3.5 flex items-center justify-between z-30 select-none font-sans">
      {/* Left: Brand & Project Selector */}
      <div className="flex items-center gap-3">
        {/* Minimalist OmniCut Brand */}
        <div 
          onClick={() => onWorkspaceChange("edit")}
          className="flex items-center gap-2 cursor-pointer group"
          title="OmniCut Timeline"
        >
          <div className="w-5 h-5 rounded bg-[#3B63FF] flex items-center justify-center shadow-[0_0_12px_rgba(59,99,255,0.45)] transition-transform group-hover:scale-105">
            <svg viewBox="0 0 24 24" className="w-3 h-3 text-white fill-current">
              <path d="M4 4h4v16H4V4zm6 0h4v16h-4V4zm6 0h4v16h-4V4z" opacity="0.4"/>
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
          <span className="font-bold text-white text-[14px] tracking-tight">
            OmniCut
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

        <button
          id="btn-nav-vfx"
          onClick={() => onWorkspaceChange("vfx")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
            activeWorkspace === "vfx"
              ? "bg-[#252836] text-white shadow-sm font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>VFX & Inpaint</span>
        </button>

        <button
          id="btn-nav-dubbing"
          onClick={() => onWorkspaceChange("dubbing")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
            activeWorkspace === "dubbing"
              ? "bg-[#252836] text-white shadow-sm font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Globe2 className="w-3.5 h-3.5 text-purple-400" />
          <span>Dub & LipSync</span>
        </button>

        <button
          id="btn-nav-spatial"
          onClick={() => onWorkspaceChange("spatial")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
            activeWorkspace === "spatial"
              ? "bg-[#252836] text-white shadow-sm font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Spatial 3D</span>
        </button>

        <button
          id="btn-nav-mam"
          onClick={() => onWorkspaceChange("mam")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
            activeWorkspace === "mam"
              ? "bg-[#252836] text-white shadow-sm font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>Cloud MAM</span>
        </button>

        <button
          id="btn-nav-multicam"
          onClick={() => onWorkspaceChange("multicam")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
            activeWorkspace === "multicam"
              ? "bg-[#252836] text-white shadow-sm font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-red-400" />
          <span>Multi-Cam</span>
        </button>

        <button
          id="btn-nav-style"
          onClick={() => onWorkspaceChange("style")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
            activeWorkspace === "style"
              ? "bg-[#252836] text-white shadow-sm font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Wand2 className="w-3.5 h-3.5 text-pink-400" />
          <span>Style VFX</span>
        </button>

        <button
          id="btn-nav-matting"
          onClick={() => onWorkspaceChange("matting")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
            activeWorkspace === "matting"
              ? "bg-[#252836] text-white shadow-sm font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Scissors className="w-3.5 h-3.5 text-emerald-400" />
          <span>Matting 3D</span>
        </button>

        <button
          id="btn-nav-automation"
          onClick={() => onWorkspaceChange("automation")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
            activeWorkspace === "automation"
              ? "bg-[#252836] text-white shadow-sm font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span>Automation</span>
        </button>

        <button
          id="btn-nav-publish"
          onClick={() => onWorkspaceChange("publish")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
            activeWorkspace === "publish"
              ? "bg-[#252836] text-white shadow-sm font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Share2 className="w-3.5 h-3.5 text-rose-400" />
          <span>Publish</span>
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
                id="btn-tool-vfx"
                onClick={() => { onWorkspaceChange("vfx"); setShowToolsDropdown(false); }}
                className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>VFX & Inpaint Studio</span>
              </button>
              <button
                id="btn-tool-spatial"
                onClick={() => { onWorkspaceChange("spatial"); setShowToolsDropdown(false); }}
                className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Spatial Video & WebXR</span>
              </button>
              <button
                id="btn-tool-mam"
                onClick={() => { onWorkspaceChange("mam"); setShowToolsDropdown(false); }}
                className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cloud MAM Vector Search</span>
              </button>
              <button
                id="btn-tool-multicam"
                onClick={() => { onWorkspaceChange("multicam"); setShowToolsDropdown(false); }}
                className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <Radio className="w-3.5 h-3.5 text-red-400" />
                <span>Neural Multi-Cam Switcher</span>
              </button>
              <button
                id="btn-tool-style"
                onClick={() => { onWorkspaceChange("style"); setShowToolsDropdown(false); }}
                className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <Wand2 className="w-3.5 h-3.5 text-pink-400" />
                <span>Generative Video Stylization</span>
              </button>
              <button
                id="btn-tool-matting"
                onClick={() => { onWorkspaceChange("matting"); setShowToolsDropdown(false); }}
                className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <Scissors className="w-3.5 h-3.5 text-emerald-400" />
                <span>Neural Video Matting Studio</span>
              </button>
              <button
                id="btn-tool-automation"
                onClick={() => { onWorkspaceChange("automation"); setShowToolsDropdown(false); }}
                className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Headless Studio CI/CD</span>
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

                {/* Project Save & Load Quick Actions */}
        {onSaveProject && (
          <button
            onClick={onSaveProject}
            className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded bg-[#161722] hover:bg-[#202334] border border-[#2b2e40] text-slate-300 hover:text-white transition-colors"
            title="Export project JSON (.omnicut)"
          >
            <Save className="w-3 h-3 text-[#3B63FF]" />
            <span className="hidden md:inline">Save</span>
          </button>
        )}
        {onLoadProject && (
          <button
            onClick={onLoadProject}
            className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded bg-[#161722] hover:bg-[#202334] border border-[#2b2e40] text-slate-300 hover:text-white transition-colors"
            title="Import project JSON (.omnicut)"
          >
            <Upload className="w-3 h-3 text-emerald-400" />
            <span className="hidden md:inline">Open</span>
          </button>
        )}

        {/* Collaborator Presence Stack */}
        {onOpenCollabInvite && (
          <button 
            id="btn-collab-invite"
            type="button"
            onClick={onOpenCollabInvite}
            className="flex items-center -space-x-1.5 cursor-pointer hover:opacity-90 transition-opacity pl-1 bg-transparent border-0 p-0 focus:outline-none"
            title="Active Collaborators (Click to Invite)"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-600 border border-[#0c0d11] flex items-center justify-center text-[8px] font-bold text-white shadow-sm">
              SL
            </div>
            <div className="w-5 h-5 rounded-full bg-purple-600 border border-[#0c0d11] flex items-center justify-center text-[8px] font-bold text-white shadow-sm">
              MV
            </div>
            <div className="w-5 h-5 rounded-full bg-amber-600 border border-[#0c0d11] flex items-center justify-center text-[8px] font-bold text-white shadow-sm">
              AC
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-2 right-24 animate-pulse"></span>
          </button>
        )}

        {/* Frame Comments Drawer Toggle */}
        {onToggleCommentsDrawer && (
          <button
            id="btn-toggle-comments"
            onClick={onToggleCommentsDrawer}
            className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded border transition-colors ${
              isCommentsDrawerOpen
                ? "bg-[#3B63FF]/20 border-[#3B63FF]/60 text-white"
                : "bg-[#14151b] border-[#252834] text-slate-300 hover:text-white"
            }`}
            title="Toggle Review Comments"
          >
            <MessageSquare className="w-3 h-3 text-[#3B63FF]" />
            <span>Comments</span>
            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#252836] text-cyan-300">
              {commentCount}
            </span>
          </button>
        )}

        {/* OmniCut Signature White Pill Export Button */}
        <button
          id="btn-header-export"
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
