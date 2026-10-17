"use client";

import React, { useState, useEffect } from "react";
import { Header, WorkspaceMode } from "../components/Header";
import { ProgramMonitor } from "../components/ProgramMonitor";
import { AudioMeter } from "../components/AudioMeter";
import { ClipInspector } from "../components/RightPanel/ClipInspector";
import { AICommandBar } from "../components/AICommandBar/AICommandBar";
import { OnePromptModal } from "../components/Modals/OnePromptModal";
import { ExportPublishModal } from "../components/Modals/ExportPublishModal";
import { ConnectionsModal } from "../components/Modals/ConnectionsModal";
import { YouTubeClipFinder } from "../components/LeftPanel/YouTubeClipFinder";
import { VoiceCleanStation } from "../components/LeftPanel/VoiceCleanStation";
import { TranscriptEditor, TranscriptWord } from "../components/LeftPanel/TranscriptEditor";
import { ScriptPanel, ScriptScene, Claim } from "../components/LeftPanel/ScriptPanel";
import { AssetBin, MotionTemplateItem } from "../components/LeftPanel/AssetBin";
import { ProposalReview, TimelineProposal } from "../components/LeftPanel/ProposalReview";
import { TimelineToolbar, ToolMode } from "../components/Timeline/TimelineToolbar";
import { TimelineRuler } from "../components/Timeline/TimelineRuler";
import { TimelineCanvas, TimelineClip } from "../components/Timeline/TimelineCanvas";
import { TrackConfig } from "../components/Timeline/TrackHeader";
import { FileText, Sparkles, FolderKanban, Bot, Sliders, PanelLeftClose, PanelLeftOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { ColorGradingWorkspace } from "../components/Workspaces/ColorGradingWorkspace";
import { AudioMixerWorkspace } from "../components/Workspaces/AudioMixerWorkspace";
import { AIDirectorWorkspace } from "../components/Workspaces/AIDirectorWorkspace";
import { ResearchScriptWorkspace } from "../components/Workspaces/ResearchScriptWorkspace";
import { ClipFinderWorkspace } from "../components/Workspaces/ClipFinderWorkspace";
import { VoiceCleanupWorkspace } from "../components/Workspaces/VoiceCleanupWorkspace";
import { Remotion3DWorkspace } from "../components/Workspaces/Remotion3DWorkspace";
import { CaptionsWorkspace } from "../components/Workspaces/CaptionsWorkspace";
import { PublishingKitWorkspace } from "../components/Workspaces/PublishingKitWorkspace";
import { ClaudeAICopilotDrawer } from "../components/ClaudeAICopilotDrawer";

// Initial Demo Tracks
const INITIAL_TRACKS: TrackConfig[] = [
  { id: "v3", name: "C1: Kinetic Captions", type: "video", colorClass: "bg-purple-600/80" },
  { id: "v2", name: "V2: Motion FX", type: "video", colorClass: "bg-indigo-600/80" },
  { id: "v1", name: "V1: Master Video", type: "video", colorClass: "bg-blue-600/80" },
  { id: "a1", name: "A1: Voiceover (AI)", type: "audio", colorClass: "bg-emerald-600/80" },
  { id: "a2", name: "A2: Background Music", type: "audio", colorClass: "bg-teal-600/80" },
];

// Initial Demo Clips
const INITIAL_CLIPS: TimelineClip[] = [
  // C1 Captions
  { id: "c_v3_1", trackId: "v3", title: "Dynamic Hormozi Captions", startMs: 0, durationMs: 14000, colorClass: "bg-purple-600/35 text-purple-200", borderClass: "border-purple-500/60", type: "captions" },

  // V2 Motion Graphics
  { id: "c_v2_1", trackId: "v2", title: "BarChart: 10,000y vs 200s", startMs: 2500, durationMs: 5500, colorClass: "bg-indigo-600/40 text-indigo-200", borderClass: "border-indigo-500/60", type: "motion" },
  { id: "c_v2_2", trackId: "v2", title: "StatCounter: 10,000x Speedup", startMs: 8500, durationMs: 4500, colorClass: "bg-indigo-600/40 text-indigo-200", borderClass: "border-indigo-500/60", type: "motion" },

  // V1 Master Video B-Roll
  { id: "c_v1_1", trackId: "v1", title: "Scene 1: Dilution Refrigerator", startMs: 0, durationMs: 4000, colorClass: "bg-blue-600/35 text-blue-200", borderClass: "border-blue-500/50", type: "video" },
  { id: "c_v1_2", trackId: "v1", title: "Scene 2: Quantum Qubit Macro", startMs: 4000, durationMs: 5000, colorClass: "bg-blue-600/35 text-blue-200", borderClass: "border-blue-500/50", type: "video" },
  { id: "c_v1_3", trackId: "v1", title: "Scene 3: Server Supercomputer", startMs: 9000, durationMs: 5000, colorClass: "bg-blue-600/35 text-blue-200", borderClass: "border-blue-500/50", type: "video" },

  // A1 Voiceover (with waveforms)
  { id: "c_a1_1", trackId: "a1", title: "Voiceover (AI Voice): voice_clean.wav", startMs: 0, durationMs: 14000, colorClass: "bg-emerald-600/35 text-emerald-200", borderClass: "border-emerald-500/50", type: "audio", waveform: true },

  // A2 Background Music (Ducked)
  { id: "c_a2_1", trackId: "a2", title: "Cybernetic Horizon Bed (-12dB Ducked)", startMs: 0, durationMs: 15000, colorClass: "bg-teal-600/30 text-teal-200", borderClass: "border-teal-500/40", type: "audio", ducked: true },
];

// Initial Transcript Words (word-level timestamps from faster-whisper)
const INITIAL_WORDS: TranscriptWord[] = [
  { id: "w1", word: "In", startMs: 200, endMs: 450 },
  { id: "w2", word: "October", startMs: 460, endMs: 850 },
  { id: "w3", word: "2019,", startMs: 860, endMs: 1300 },
  { id: "w4", word: "Google", startMs: 1400, endMs: 1800 },
  { id: "w5", word: "demonstrated", startMs: 1810, endMs: 2350 },
  { id: "w6", word: "quantum", startMs: 2360, endMs: 2750 },
  { id: "w7", word: "supremacy.", startMs: 2760, endMs: 3400 },
  { id: "w8", word: "Their", startMs: 3700, endMs: 3950 },
  { id: "w9", word: "Sycamore", startMs: 3960, endMs: 4450 },
  { id: "w10", word: "processor", startMs: 4460, endMs: 4950 },
  { id: "w11", word: "performed", startMs: 4960, endMs: 5400 },
  { id: "w12", word: "a", startMs: 5410, endMs: 5500 },
  { id: "w13", word: "benchmark", startMs: 5510, endMs: 6050 },
  { id: "w14", word: "in", startMs: 6060, endMs: 6200 },
  { id: "w15", word: "200", startMs: 6210, endMs: 6600 },
  { id: "w16", word: "seconds", startMs: 6610, endMs: 7100 },
  { id: "w17", word: "that", startMs: 7200, endMs: 7400 },
  { id: "w18", word: "would", startMs: 7410, endMs: 7600 },
  { id: "w19", word: "take", startMs: 7610, endMs: 7850 },
  { id: "w20", word: "supercomputers", startMs: 7860, endMs: 8700 },
  { id: "w21", word: "ten", startMs: 8710, endMs: 8950 },
  { id: "w22", word: "thousand", startMs: 8960, endMs: 9350 },
  { id: "w23", word: "years.", startMs: 9360, endMs: 9900 },
  { id: "w24", word: "Subscribe", startMs: 10400, endMs: 10900 },
  { id: "w25", word: "for", startMs: 10910, endMs: 11100 },
  { id: "w26", word: "deep", startMs: 11110, endMs: 11400 },
  { id: "w27", word: "tech", startMs: 11410, endMs: 11700 },
  { id: "w28", word: "breakdowns.", startMs: 11710, endMs: 12400 },
];

export default function StudioEditorPage() {
  // Workspace Modes
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceMode>("edit");
  const [isOnePromptModalOpen, setIsOnePromptModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isConnectionsOpen, setIsConnectionsOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [activeLut, setActiveLut] = useState("Moody Teal & Orange");
  const [projectTitle, setProjectTitle] = useState("Quantum Supremacy 2026");

  const handleSelectProjectPreset = (presetId: string) => {
    pushHistory();
    if (presetId === "quantum") {
      setProjectTitle("Quantum Supremacy 2026");
      setClips(INITIAL_CLIPS);
      showToast("Loaded Project: Quantum Supremacy 2026 (Nature 2019)");
    } else if (presetId === "hypertrophy") {
      setProjectTitle("Back Hypertrophy: Rows vs Pullups");
      setClips([
        { id: "c_v3_1", trackId: "v3", title: "Dynamic Hormozi Captions", startMs: 0, durationMs: 14000, colorClass: "bg-purple-600/35 text-purple-200", borderClass: "border-purple-500/60", type: "captions" },
        { id: "c_v2_1", trackId: "v2", title: "3D Paper Lift-Off: Schoenfeld 2021", startMs: 2000, durationMs: 5000, colorClass: "bg-amber-600/40 text-amber-200", borderClass: "border-amber-500/60", type: "motion" },
        { id: "c_v2_2", trackId: "v2", title: "BarChart: 118% Motor Unit EMG", startMs: 7500, durationMs: 4500, colorClass: "bg-indigo-600/40 text-indigo-200", borderClass: "border-indigo-500/60", type: "motion" },
        { id: "c_v1_1", trackId: "v1", title: "Scene 1: Jeff Nippard Barbell Row (4K)", startMs: 0, durationMs: 4000, colorClass: "bg-blue-600/35 text-blue-200", borderClass: "border-blue-500/50", type: "video" },
        { id: "c_v1_2", trackId: "v1", title: "Scene 2: Anatomical Lat Vector Macro", startMs: 4000, durationMs: 5000, colorClass: "bg-blue-600/35 text-blue-200", borderClass: "border-blue-500/50", type: "video" },
        { id: "c_v1_3", trackId: "v1", title: "Scene 3: Iliac Crest Pull Technique", startMs: 9000, durationMs: 5000, colorClass: "bg-blue-600/35 text-blue-200", borderClass: "border-blue-500/50", type: "video" },
        { id: "c_a1_1", trackId: "a1", title: "Voiceover (AI Voice): voice_clean.wav", startMs: 0, durationMs: 14000, colorClass: "bg-emerald-600/35 text-emerald-200", borderClass: "border-emerald-500/50", type: "audio", waveform: true },
        { id: "c_a2_1", trackId: "a2", title: "Heavy Phonk Gym Drive (-14dB Ducked)", startMs: 0, durationMs: 15000, colorClass: "bg-teal-600/30 text-teal-200", borderClass: "border-teal-500/40", type: "audio", ducked: true },
      ]);
      showToast("Loaded Project: Back Hypertrophy (Schoenfeld 2021)");
    } else if (presetId === "agents") {
      setProjectTitle("Autonomous AI Video Editors 2026");
      setClips([
        { id: "c_v3_1", trackId: "v3", title: "Dynamic Neon Subtitles", startMs: 0, durationMs: 14000, colorClass: "bg-purple-600/35 text-purple-200", borderClass: "border-purple-500/60", type: "captions" },
        { id: "c_v2_1", trackId: "v2", title: "Exploded 3D Pipeline Layers", startMs: 1500, durationMs: 5500, colorClass: "bg-indigo-600/40 text-indigo-200", borderClass: "border-indigo-500/60", type: "motion" },
        { id: "c_v2_2", trackId: "v2", title: "StatCounter: 10 Stages Autonomy", startMs: 7500, durationMs: 5000, colorClass: "bg-cyan-600/40 text-cyan-200", borderClass: "border-cyan-500/60", type: "motion" },
        { id: "c_v1_1", trackId: "v1", title: "Scene 1: Web Workstation NLE UI", startMs: 0, durationMs: 4500, colorClass: "bg-blue-600/35 text-blue-200", borderClass: "border-blue-500/50", type: "video" },
        { id: "c_v1_2", trackId: "v1", title: "Scene 2: Remotion Headless Cluster", startMs: 4500, durationMs: 5000, colorClass: "bg-blue-600/35 text-blue-200", borderClass: "border-blue-500/50", type: "video" },
        { id: "c_v1_3", trackId: "v1", title: "Scene 3: MCP Agent Direct Command", startMs: 9500, durationMs: 4500, colorClass: "bg-blue-600/35 text-blue-200", borderClass: "border-blue-500/50", type: "video" },
        { id: "c_a1_1", trackId: "a1", title: "Voiceover (AI Voice): voice_clean.wav", startMs: 0, durationMs: 14000, colorClass: "bg-emerald-600/35 text-emerald-200", borderClass: "border-emerald-500/50", type: "audio", waveform: true },
        { id: "c_a2_1", trackId: "a2", title: "Deep Cyber Ambient (-14dB Ducked)", startMs: 0, durationMs: 15000, colorClass: "bg-teal-600/30 text-teal-200", borderClass: "border-teal-500/40", type: "audio", ducked: true },
      ]);
      showToast("Loaded Project: Autonomous AI Video Editors (Route B)");
    }
  };

  // Playhead & Transport State
  const [currentTimeMs, setCurrentTimeMs] = useState(3500);
  const [totalDurationMs, setTotalDurationMs] = useState(15000);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16" | "1:1">("16:9");
  const [previewQuality, setPreviewQuality] = useState<"540p" | "1080p">("1080p");
  const [activeStage, setActiveStage] = useState("timeline");

  // Left Panel Tabs
  const [leftTab, setLeftTab] = useState<"youtube" | "voice" | "transcript" | "script" | "assets" | "proposals">("youtube");

  // Timeline State
  const [tracks, setTracks] = useState<TrackConfig[]>(INITIAL_TRACKS);
  const [clips, setClips] = useState<TimelineClip[]>(INITIAL_CLIPS);
  const [selectedClipId, setSelectedClipId] = useState<string | null>("c_v1_1");
  const [showInspector, setShowInspector] = useState(false);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [toolMode, setToolMode] = useState<ToolMode>("select");
  const [snapping, setSnapping] = useState(true);
  const [inPointMs, setInPointMs] = useState<number | null>(1000);
  const [outPointMs, setOutPointMs] = useState<number | null>(8000);
  const [shuttleSpeed, setShuttleSpeed] = useState<number>(0);
  const [zoomScale, setZoomScale] = useState(55); // px per second
  const [words, setWords] = useState<TranscriptWord[]>(INITIAL_WORDS);

  // Undo/Redo Stacks
  const [history, setHistory] = useState<TimelineClip[][]>([]);
  const [future, setFuture] = useState<TimelineClip[][]>([]);
  const [isTimelineDocked, setIsTimelineDocked] = useState(false);

  // Toast / Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // MCP AI Proposals (Route B Pattern)
  const [proposals, setProposals] = useState<TimelineProposal[]>([
    {
      id: "prp_101",
      agentId: "mcp-copilot-v1",
      summary: "Replace BarChart with Side-by-Side Comparison template",
      createdAt: "2m ago",
      changes: [
        {
          trackId: "v2",
          action: "replace",
          description: "Change visual from BarChart to Comparison for higher viewer retention",
          before: "BarChart: 10,000y vs 200s",
          after: "Comparison: Summit vs Sycamore"
        }
      ]
    }
  ]);

  // Keyboard Shortcuts (Premiere Pro Standard)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((p) => {
          if (!p) setShuttleSpeed(1);
          else setShuttleSpeed(0);
          return !p;
        });
      } else if (e.key === "j" || e.key === "J") {
        // Shuttle Reverse (J)
        e.preventDefault();
        setIsPlaying(true);
        setShuttleSpeed((s) => (s <= 0 ? Math.max(-4, s === 0 ? -1 : s * 2) : -1));
      } else if (e.key === "k" || e.key === "K") {
        // Shuttle Pause (K)
        e.preventDefault();
        setIsPlaying(false);
        setShuttleSpeed(0);
      } else if (e.key === "l" || e.key === "L") {
        // Shuttle Forward (L)
        e.preventDefault();
        setIsPlaying(true);
        setShuttleSpeed((s) => (s >= 0 ? Math.min(4, s === 0 ? 1 : s * 2) : 1));
      } else if (e.key === "i" || e.key === "I") {
        // Mark In (I)
        e.preventDefault();
        setInPointMs(currentTimeMs);
        showToast(`Marked IN: ${Math.round(currentTimeMs)}ms`);
      } else if (e.key === "o" || e.key === "O") {
        // Mark Out (O)
        e.preventDefault();
        setOutPointMs(currentTimeMs);
        showToast(`Marked OUT: ${Math.round(currentTimeMs)}ms`);
      } else if (e.altKey && (e.key === "x" || e.key === "X")) {
        // Clear In/Out (Alt+X)
        e.preventDefault();
        setInPointMs(null);
        setOutPointMs(null);
        showToast("Cleared In/Out Work Area");
      } else if (e.key === "m" || e.key === "M") {
        // Add Marker (M)
        e.preventDefault();
        showToast(`Added Marker at ${Math.round(currentTimeMs / 1000)}s`);
      } else if (e.key === "v" || e.key === "V") {
        setToolMode("select");
        showToast("Selection Tool (V)");
      } else if (e.key === "a" || e.key === "A") {
        setToolMode("trackSelect");
        showToast("Track Select Forward (A)");
      } else if (e.key === "b" || e.key === "B") {
        setToolMode("ripple");
        showToast("Ripple Edit Tool (B)");
      } else if (e.key === "c" || e.key === "C") {
        setToolMode("razor");
        showToast("Razor Blade Tool (C)");
      } else if (e.key === "y" || e.key === "Y") {
        setToolMode("slip");
        showToast("Slip Tool (Y)");
      } else if (e.key === "p" || e.key === "P") {
        setToolMode("pen");
        showToast("Pen Keyframe Tool (P)");
      } else if (e.key === "h" || e.key === "H") {
        setToolMode("hand");
        showToast("Hand Tool (H)");
      } else if (e.key === ",") {
        // Insert Subclip into Timeline
        e.preventDefault();
        handleInsertYouTubeClip({ title: "Subclip Insert", durationMs: 4000, source: "Source Monitor" });
      } else if (e.key === ".") {
        // Overwrite Subclip into Timeline
        e.preventDefault();
        handleInsertYouTubeClip({ title: "Subclip Overwrite", durationMs: 4000, source: "Source Monitor" });
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        setCurrentTimeMs((t) => Math.max(0, t - 33.33));
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        setCurrentTimeMs((t) => Math.min(totalDurationMs, t + 33.33));
      } else if (e.key === "s" || e.key === "S") {
        handleSplitAtPlayhead();
      } else if (e.key === "Delete" || e.key === "Backspace") {
        handleDeleteSelected();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const input = document.querySelector('input[placeholder*="Direct the AI"]') as HTMLInputElement;
        if (input) input.focus();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalDurationMs, selectedClipId, clips, history, future, currentTimeMs]);

  // Playhead Animation Loop with J-K-L Shuttle Support
  useEffect(() => {
    if (!isPlaying) return;
    const speed = shuttleSpeed === 0 ? 1 : shuttleSpeed;
    const interval = setInterval(() => {
      setCurrentTimeMs((curr) => {
        const next = curr + (40 * speed);
        if (next >= totalDurationMs) {
          setIsPlaying(false);
          setShuttleSpeed(0);
          return totalDurationMs;
        }
        if (next <= 0) {
          setIsPlaying(false);
          setShuttleSpeed(0);
          return 0;
        }
        return next;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [isPlaying, totalDurationMs, shuttleSpeed]);

  // Save State to History before mutation
  const pushHistory = () => {
    setHistory((prev) => [...prev.slice(-20), clips]);
    setFuture([]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setFuture((prev) => [clips, ...prev]);
    setHistory((prev) => prev.slice(0, -1));
    setClips(previous);
    showToast("Undo applied");
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory((prev) => [...prev, clips]);
    setFuture((prev) => prev.slice(1));
    setClips(next);
    showToast("Redo applied");
  };

  // Trimming Clip Edge
  const handleClipTrim = (clipId: string, newStartMs: number, newDurationMs: number) => {
    setClips((prev) =>
      prev.map((c) =>
        c.id === clipId
          ? { ...c, startMs: Math.round(newStartMs), durationMs: Math.round(newDurationMs) }
          : c
      )
    );
  };

  // Split Clip At Timestamp
  const handleClipSplit = (clipId: string, splitAtMs: number) => {
    const target = clips.find((c) => c.id === clipId);
    if (!target) return;

    const clipEnd = target.startMs + target.durationMs;
    if (splitAtMs <= target.startMs || splitAtMs >= clipEnd) return;

    pushHistory();
    const firstDuration = splitAtMs - target.startMs;
    const secondDuration = clipEnd - splitAtMs;

    const firstHalf: TimelineClip = {
      ...target,
      durationMs: firstDuration,
    };
    const secondHalf: TimelineClip = {
      ...target,
      id: `${target.id}_split_${Date.now()}`,
      title: `${target.title} (Part 2)`,
      startMs: splitAtMs,
      durationMs: secondDuration,
    };

    setClips((prev) => prev.map((c) => (c.id === clipId ? firstHalf : c)).concat(secondHalf));
    showToast(`Split clip into two segments at playhead`);
  };

  const handleSplitAtPlayhead = () => {
    const clipAtPlayhead = clips.find(
      (c) => currentTimeMs > c.startMs && currentTimeMs < c.startMs + c.durationMs
    );
    if (clipAtPlayhead) {
      handleClipSplit(clipAtPlayhead.id, currentTimeMs);
    }
  };

  const handleDeleteSelected = () => {
    if (!selectedClipId) return;
    pushHistory();
    setClips((prev) => prev.filter((c) => c.id !== selectedClipId));
    setSelectedClipId(null);
    showToast("Deleted selected clip");
  };

  // Transcript Ripple Cut
  const handleDeleteWord = (wordId: string) => {
    pushHistory();
    setWords((prev) =>
      prev.map((w) => (w.id === wordId ? { ...w, isDeleted: true } : w))
    );
    const word = words.find((w) => w.id === wordId);
    if (word) {
      const cutDuration = word.endMs - word.startMs;
      setClips((prev) =>
        prev.map((c) => {
          if (c.startMs >= word.endMs) {
            return { ...c, startMs: Math.max(0, c.startMs - cutDuration) };
          }
          return c;
        })
      );
      setTotalDurationMs((d) => Math.max(1000, d - cutDuration));
      showToast(`Ripple cut: Removed "${word.word}" and adjusted timeline`);
    }
  };

  const handleRemoveSilences = () => {
    showToast("Audio Cleanup: 3 pause gaps (>0.5s) removed via faster-whisper");
  };

  // MCP Proposal Approval
  const handleApproveProposal = (proposalId: string) => {
    pushHistory();
    setClips((prev) =>
      prev.map((c) =>
        c.id === "c_v2_1"
          ? { ...c, title: "Comparison: Summit vs Sycamore", colorClass: "bg-indigo-600/50 text-indigo-100" }
          : c
      )
    );
    setProposals((prev) => prev.filter((p) => p.id !== proposalId));
    showToast("MCP Proposal Approved! Applied non-destructive change to Track V2.");
  };

  const handleRejectProposal = (proposalId: string) => {
    setProposals((prev) => prev.filter((p) => p.id !== proposalId));
    showToast("Proposal discarded without side-effects");
  };

  // Insert Template
  const handleInsertTemplate = (templateOrId: MotionTemplateItem | string, props?: any) => {
    pushHistory();
    const templateName = typeof templateOrId === "string" ? templateOrId : templateOrId.name;
    const newClip: TimelineClip = {
      id: `c_v2_${Date.now()}`,
      trackId: "v2",
      title: `${templateName}: New Scene`,
      startMs: currentTimeMs,
      durationMs: 4000,
      colorClass: "bg-indigo-600/40 text-indigo-200",
      borderClass: "border-indigo-500/60",
      type: "motion",
    };
    setClips((prev) => [...prev, newClip]);
    setSelectedClipId(newClip.id);
    showToast(`Inserted ${templateName} at playhead`);
  };

  // Apply LUT
  const handleApplyLut = (lutName: string) => {
    setActiveLut(lutName);
    showToast(`Applied LUT: ${lutName} to program monitor`);
  };

  // AI Direct Edit Command
  const handleExecuteAICommand = (cmd: string) => {
    pushHistory();
    if (cmd.includes("teal") || cmd.includes("LUT") || cmd.includes("grade")) {
      setActiveLut("Cyberpunk Neon 2077");
      showToast("AI Director: Color graded all scenes with Cyberpunk Neon 2077");
    } else if (cmd.includes("Stat Counter") || cmd.includes("stat")) {
      handleInsertTemplate({
        id: "StatCounter",
        name: "Metric Counter",
        category: "counter",
        icon: null,
        defaultProps: {}
      });
    } else if (cmd.includes("2 seconds") || cmd.includes("Cut")) {
      setClips((prev) =>
        prev.map((c) => (c.id === "c_v1_1" ? { ...c, durationMs: Math.max(1000, c.durationMs - 2000) } : c))
      );
      showToast("AI Director: Cut 2.0s from Scene 1");
    } else {
      showToast(`AI Director: Executed '${cmd}'`);
    }
  };

  // 1-Prompt Autonomous Video Generator Callback
  const handleOnePromptGenerate = (brief: { 
    topic: string; 
    durationSec: number; 
    stylePreset: string;
    narrator?: string;
  }) => {
    pushHistory();
    const dur = brief.durationSec * 1000;
    setTotalDurationMs(dur);
    setProjectTitle(brief.topic);

    // Calculate dynamic scene durations
    const sceneDur = Math.floor(dur / 4);

    const generatedClips: TimelineClip[] = [
      // C1 Kinetic Captions
      { 
        id: `gen_c1_${Date.now()}`, 
        trackId: "v3", 
        title: `Kinetic Captions (${brief.stylePreset.toUpperCase()})`, 
        startMs: 0, 
        durationMs: dur, 
        colorClass: "bg-purple-600/35 text-purple-200", 
        borderClass: "border-purple-500/60", 
        type: "captions" 
      },
      // V2 Motion FX
      { 
        id: `gen_v2_1_${Date.now()}`, 
        trackId: "v2", 
        title: `Remotion 3D: Empirical Data Chart`, 
        startMs: Math.floor(sceneDur * 0.8), 
        durationMs: Math.floor(sceneDur * 1.2), 
        colorClass: "bg-indigo-600/40 text-indigo-200", 
        borderClass: "border-indigo-500/60", 
        type: "motion" 
      },
      { 
        id: `gen_v2_2_${Date.now()}`, 
        trackId: "v2", 
        title: `Remotion 3D: Research Paper Citation`, 
        startMs: Math.floor(sceneDur * 2.3), 
        durationMs: Math.floor(sceneDur * 1.1), 
        colorClass: "bg-indigo-600/40 text-indigo-200", 
        borderClass: "border-indigo-500/60", 
        type: "motion" 
      },
      // V1 Master Video B-Roll
      { 
        id: `gen_v1_1_${Date.now()}`, 
        trackId: "v1", 
        title: `Scene 1: Hook (${brief.topic.slice(0, 20)})`, 
        startMs: 0, 
        durationMs: sceneDur, 
        colorClass: "bg-blue-600/35 text-blue-200", 
        borderClass: "border-blue-500/50", 
        type: "video" 
      },
      { 
        id: `gen_v1_2_${Date.now()}`, 
        trackId: "v1", 
        title: `Scene 2: Conflict & Paradox`, 
        startMs: sceneDur, 
        durationMs: sceneDur, 
        colorClass: "bg-blue-600/35 text-blue-200", 
        borderClass: "border-blue-500/50", 
        type: "video" 
      },
      { 
        id: `gen_v1_3_${Date.now()}`, 
        trackId: "v1", 
        title: `Scene 3: Deep Investigation`, 
        startMs: sceneDur * 2, 
        durationMs: sceneDur, 
        colorClass: "bg-blue-600/35 text-blue-200", 
        borderClass: "border-blue-500/50", 
        type: "video" 
      },
      { 
        id: `gen_v1_4_${Date.now()}`, 
        trackId: "v1", 
        title: `Scene 4: Resolution & Conclusion`, 
        startMs: sceneDur * 3, 
        durationMs: dur - (sceneDur * 3), 
        colorClass: "bg-blue-600/35 text-blue-200", 
        borderClass: "border-blue-500/50", 
        type: "video" 
      },
      // A1 Clean Voiceover
      { 
        id: `gen_a1_1_${Date.now()}`, 
        trackId: "a1", 
        title: `Voiceover (AI Voice): voice_clean.wav`, 
        startMs: 0, 
        durationMs: dur, 
        colorClass: "bg-emerald-600/35 text-emerald-200", 
        borderClass: "border-emerald-500/50", 
        type: "audio", 
        waveform: true 
      },
      // A2 Background Music Ducked
      { 
        id: `gen_a2_1_${Date.now()}`, 
        trackId: "a2", 
        title: `Soundtrack Bed (-14dB Ducked under Speech)`, 
        startMs: 0, 
        durationMs: dur + 1500, 
        colorClass: "bg-teal-600/30 text-teal-200", 
        borderClass: "border-teal-500/40", 
        type: "audio", 
        ducked: true 
      },
    ];

    setClips(generatedClips);
    setActiveWorkspace("edit");
    showToast(`✨ Generated autonomous video for '${brief.topic}' (${brief.durationSec}s)!`);
  };

  // Master Render Export (100% Free & Unmetered)

  // Slot Studio YouTube Clip Ingestion
  const handleInsertYouTubeClip = (clipData: { title: string; durationMs: number; source: string }) => {
    const newId = `c_yt_${Date.now()}`;
    const newClip: TimelineClip = {
      id: newId,
      trackId: "v1",
      title: `${clipData.title} (${clipData.source})`,
      startMs: currentTimeMs,
      durationMs: clipData.durationMs,
      colorClass: "bg-[#3B63FF]/30 text-white",
      borderClass: "border-[#3B63FF]",
      type: "video"
    };
    setClips((prev) => [...prev, newClip]);
    showToast(`Saved 4K footage from YouTube: ${clipData.title} (3840×2160)`);
  };

  // Slot Studio Clean Voice Ingestion
  const handleApplyCleanVoice = () => {
    setClips((prev) => prev.map((c) => {
      if (c.trackId === "a1") {
        return {
          ...c,
          title: "Voiceover (Cleaned 48kHz, Breaths Cut)",
          colorClass: "bg-emerald-500/30 text-emerald-200",
          borderClass: "border-emerald-400"
        };
      }
      return c;
    }));
    showToast("Cleaned voiceover applied: 0 words clipped, -14.0 LUFS broadcast normalized.");
  };

  const handleExport = () => {
    setIsExportModalOpen(true);
  };

  const selectedClip = clips.find((c) => c.id === selectedClipId) || null;
  const HEADER_WIDTH = 180;

  return (
    <div className="flex flex-col h-screen w-screen bg-studio-950 text-slate-100 overflow-hidden font-sans">
      {/* 1. Header Toolbar */}
      <Header
        projectTitle={projectTitle}
        previewQuality={previewQuality}
        onQualityChange={setPreviewQuality}
        activeStage={activeStage}
        onStageSelect={(stage) => {
          setActiveStage(stage);
          if (stage === "script") {
            setActiveWorkspace("script");
            setLeftTab("script");
          } else if (stage === "youtube") {
            setActiveWorkspace("clipfinder");
            setLeftTab("youtube");
          } else if (stage === "voice") {
            setActiveWorkspace("cleanup");
            setLeftTab("voice");
          } else if (stage === "graphics") {
            setActiveWorkspace("remotion");
            setLeftTab("assets");
          } else if (stage === "timeline") {
            setActiveWorkspace("edit");
          } else if (stage === "render") {
            setActiveWorkspace("publish");
          }
        }}
        activeWorkspace={activeWorkspace}
        onWorkspaceChange={setActiveWorkspace}
        onOpenOnePromptModal={() => setIsOnePromptModalOpen(true)}
        onOpenConnections={() => setIsConnectionsOpen(true)}
        onOpenProposals={() => setLeftTab("proposals")}
        hasPendingProposal={proposals.length > 0}
        onExport={handleExport}
        onToggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
        isCopilotOpen={isCopilotOpen}
        onSelectProjectPreset={handleSelectProjectPreset}
      />

      {/* 2. Middle Work Area (Switches seamlessly between Edit, Script & Research, ClipFinder, VO Cleanup, Remotion 3D, Color, Audio, Director, and Publish suites) */}
      <div className="flex-1 flex overflow-hidden">
        {activeWorkspace === "script" && (
          <ResearchScriptWorkspace
            onSendToVoiceover={() => {
              setActiveWorkspace("cleanup");
              setActiveStage("voice");
            }}
            onSendToClipFinder={() => {
              setActiveWorkspace("clipfinder");
              setActiveStage("youtube");
            }}
            onPushToTimeline={() => {
              setActiveWorkspace("edit");
              setActiveStage("timeline");
              showToast("Pushed research scenes to multi-track timeline");
            }}
            onShowToast={showToast}
          />
        )}
        {activeWorkspace === "clipfinder" && (
          <ClipFinderWorkspace
            onInsertClip={(title, durationMs) => {
              const newClip: TimelineClip = {
                id: `c_yt_${Date.now()}`,
                trackId: "v2",
                title,
                startMs: currentTimeMs,
                durationMs,
                colorClass: "bg-violet-600/40 text-violet-200",
                borderClass: "border-violet-500/70",
                type: "video"
              };
              setClips((prev) => [...prev, newClip]);
              showToast(`Inserted 4K clip into timeline at ${Math.round(currentTimeMs/1000)}s`);
            }}
            currentTimeMs={currentTimeMs}
          />
        )}

        {activeWorkspace === "cleanup" && (
          <VoiceCleanupWorkspace
            onApplyCleanAudio={handleApplyCleanVoice}
            onShowToast={showToast}
          />
        )}

        {activeWorkspace === "remotion" && (
          <Remotion3DWorkspace
            onInsertTemplate={(templateName) => {
              handleInsertTemplate(templateName as any);
              showToast(`Remotion 3D template added: ${templateName}`);
            }}
            onShowToast={showToast}
          />
        )}

        {activeWorkspace === "captions" && (
          <CaptionsWorkspace
            currentTimeMs={currentTimeMs}
            totalDurationMs={totalDurationMs}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onSeek={setCurrentTimeMs}
            aspectRatio={aspectRatio}
            onAspectRatioChange={setAspectRatio}
            onInsertCaptionsToTimeline={(segments) => {
              setClips((prev) => {
                const nonCaptions = prev.filter((c) => c.trackId !== "v3");
                const newCaptions: TimelineClip[] = segments.map((seg, idx) => ({
                  id: `cap_${idx}_${Date.now()}`,
                  trackId: "v3",
                  title: `Caption: "${seg.text.slice(0, 22)}..."`,
                  startMs: seg.startMs,
                  durationMs: seg.endMs - seg.startMs,
                  colorClass: "bg-purple-600/35 text-purple-200",
                  borderClass: "border-purple-500/60",
                  type: "captions",
                }));
                return [...nonCaptions, ...newCaptions];
              });
              showToast("✨ Applied kinetic word-by-word captions to timeline!");
            }}
            onShowToast={showToast}
          />
        )}

        {activeWorkspace === "color" && (
          <ColorGradingWorkspace
            currentTimeMs={currentTimeMs}
            totalDurationMs={totalDurationMs}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onSeek={setCurrentTimeMs}
            aspectRatio={aspectRatio}
            onAspectRatioChange={setAspectRatio}
            activeLut={activeLut}
            onSelectLut={handleApplyLut}
            onShowToast={showToast}
          />
        )}

        {activeWorkspace === "audio" && (
          <AudioMixerWorkspace
            currentTimeMs={currentTimeMs}
            totalDurationMs={totalDurationMs}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onSeek={setCurrentTimeMs}
            aspectRatio={aspectRatio}
            onAspectRatioChange={setAspectRatio}
            onShowToast={showToast}
          />
        )}

        {activeWorkspace === "director" && (
          <AIDirectorWorkspace
            proposals={proposals}
            onApproveProposal={handleApproveProposal}
            onRejectProposal={handleRejectProposal}
            onExecuteCommand={handleExecuteAICommand}
            onShowToast={showToast}
          />
        )}

        {activeWorkspace === "publish" && (
          <PublishingKitWorkspace />
        )}

        {activeWorkspace === "edit" && (
          <>
            {/* Left Side: Sleek Media & Asset Bin */}
            <div className={`${isLeftPanelOpen ? "w-[340px]" : "w-8"} bg-[#0d0e13] border-r border-[#1a1c24] flex flex-col flex-shrink-0 transition-all duration-150 overflow-hidden`}>
              {/* Minimalist Tab Strip & Collapse Toggle */}
              <div className="h-8 bg-[#111217] border-b border-[#1c1e27] px-2 flex items-center justify-between select-none text-[11px] overflow-hidden">
                {isLeftPanelOpen ? (
                  <>
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                      <button
                        onClick={() => setLeftTab("youtube")}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap ${
                          leftTab === "youtube" ? "text-white bg-[#252836] font-semibold" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Clips
                      </button>
                      <button
                        onClick={() => setLeftTab("assets")}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap ${
                          leftTab === "assets" ? "text-white bg-[#252836] font-semibold" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Motion
                      </button>
                      <button
                        onClick={() => setLeftTab("script")}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                          leftTab === "script" ? "text-white bg-[#222430] font-semibold" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Script
                      </button>
                      <button
                        onClick={() => setLeftTab("voice")}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                          leftTab === "voice" ? "text-white bg-[#222430] font-semibold" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Voice
                      </button>
                      <button
                        onClick={() => setLeftTab("transcript")}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                          leftTab === "transcript" ? "text-white bg-[#222430] font-semibold" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Text
                      </button>
                      <button
                        onClick={() => setLeftTab("proposals")}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors relative ${
                          leftTab === "proposals" ? "text-white bg-[#222430] font-semibold" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <span>Agent</span>
                        {proposals.length > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block ml-1" />
                        )}
                      </button>
                    </div>
                    <button
                      onClick={() => setIsLeftPanelOpen(false)}
                      className="p-1 text-slate-500 hover:text-slate-300 rounded hover:bg-white/5"
                      title="Collapse Bin (Zen Mode)"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsLeftPanelOpen(true)}
                    className="w-full h-full flex items-center justify-center text-slate-400 hover:text-white"
                    title="Expand Media Bin"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Active Tab Content (Hidden if collapsed) */}
              {isLeftPanelOpen && (
                <div className="flex-1 overflow-hidden">
                  {leftTab === "youtube" && (
                    <YouTubeClipFinder onInsertClip={handleInsertYouTubeClip} />
                  )}
                  {leftTab === "voice" && (
                    <VoiceCleanStation onApplyVoice={handleApplyCleanVoice} />
                  )}
                  {leftTab === "transcript" && (
                    <TranscriptEditor
                      words={words}
                      currentTimeMs={currentTimeMs}
                      onSeek={setCurrentTimeMs}
                      onDeleteWord={handleDeleteWord}
                      onRemoveSilences={handleRemoveSilences}
                    />
                  )}
                  {leftTab === "script" && (
                    <ScriptPanel
                      scenes={[
                        { id: "s1", order: 1, type: "hook", narration: "In October 2019, Google demonstrated quantum supremacy.", visualIntent: "Macro dilution refrigerator", template: "BarChart", durationSec: 4 },
                        { id: "s2", order: 2, type: "body", narration: "Their Sycamore processor performed a calculation in 200 seconds.", visualIntent: "Speed comparison graph", template: "StatCounter", durationSec: 6 },
                        { id: "s3", order: 3, type: "cta", narration: "Subscribe for deep tech breakdowns.", visualIntent: "Channel branding end screen", template: "QuoteCard", durationSec: 4 },
                      ]}
                      claims={[
                        { fact: "Google Sycamore solved task in 200s vs Summit 10,000 years", sourceUrl: "https://www.nature.com/articles/s41586-019-1666-5" },
                        { fact: "Qubit state maintains coherent superposition at 15 mK", sourceUrl: "https://arxiv.org/abs/1910.11333" }
                      ]}
                      activeSceneId="s1"
                      onSelectScene={(id) => setCurrentTimeMs(id === "s1" ? 0 : id === "s2" ? 4000 : 10000)}
                    />
                  )}
                  {leftTab === "assets" && (
                    <AssetBin
                      onInsertTemplate={handleInsertTemplate}
                      onApplyLut={handleApplyLut}
                      onUploadMedia={() => showToast("Upload dialog: Presigned R2 direct transfer initialized.")}
                    />
                  )}
                  {leftTab === "proposals" && (
                    <ProposalReview
                      proposals={proposals}
                      onApprove={handleApproveProposal}
                      onReject={handleRejectProposal}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Center: Program Monitor */}
            <div className="flex-1 flex overflow-hidden">
              <ProgramMonitor
                currentTimeMs={currentTimeMs}
                totalDurationMs={totalDurationMs}
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying(!isPlaying)}
                onSeek={setCurrentTimeMs}
                aspectRatio={aspectRatio}
                onAspectRatioChange={setAspectRatio}
                currentSceneTitle={selectedClip ? selectedClip.title : projectTitle}
                currentTemplateName="BarChart"
                activeLut={activeLut}
                activeClip={selectedClip}
                showInspector={showInspector}
                onToggleInspector={() => setShowInspector(!showInspector)}
              />

              {/* Right Clip Inspector Panel */}
              {showInspector && (
                <ClipInspector
                  clip={selectedClip}
                  onClose={() => setShowInspector(false)}
                />
              )}

              {/* Stereo VU Loudness Meter */}
              <AudioMeter isPlaying={isPlaying} />
            </div>
          </>
        )}
      </div>

      {/* 3. Bottom Timeline Section */}
      {(activeWorkspace === "edit" || isTimelineDocked) && (
        <div className={`${activeWorkspace === "edit" ? "h-72" : "h-56"} bg-studio-950 flex flex-col border-t border-studio-800 flex-shrink-0 select-none`}>
          {/* Timeline Action Bar (Premiere Pro 8-Tool Palette & J-K-L Shuttle) */}
          <TimelineToolbar
            toolMode={toolMode}
            onToolModeChange={setToolMode}
            snapping={snapping}
            onToggleSnapping={() => setSnapping(!snapping)}
            zoomScale={zoomScale}
            onZoomChange={setZoomScale}
            canUndo={history.length > 0}
            canRedo={future.length > 0}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onSplitAtPlayhead={handleSplitAtPlayhead}
            onDeleteSelected={handleDeleteSelected}
            hasSelection={selectedClipId !== null}
            inPointMs={inPointMs}
            outPointMs={outPointMs}
            onSetInPoint={() => {
              setInPointMs(currentTimeMs);
              showToast(`Marked IN: ${Math.round(currentTimeMs)}ms`);
            }}
            onSetOutPoint={() => {
              setOutPointMs(currentTimeMs);
              showToast(`Marked OUT: ${Math.round(currentTimeMs)}ms`);
            }}
            onClearInOut={() => {
              setInPointMs(null);
              setOutPointMs(null);
              showToast("Cleared In/Out Work Area");
            }}
            onAddMarker={() => showToast(`Added Marker at ${Math.round(currentTimeMs/1000)}s`)}
            shuttleSpeed={shuttleSpeed}
          />

          {/* Timeline Timecode Ruler (SMPTE Drop-Frame + In/Out Range) */}
          <TimelineRuler
            totalDurationMs={totalDurationMs}
            currentTimeMs={currentTimeMs}
            zoomScale={zoomScale}
            onSeek={setCurrentTimeMs}
            headerWidth={HEADER_WIDTH}
            inPointMs={inPointMs}
            outPointMs={outPointMs}
          />

          {/* Multi-Track Canvas (Premiere Multi-Track Anatomy + Rubberbands + fx Badges) */}
          <TimelineCanvas
            tracks={tracks}
            clips={clips}
            currentTimeMs={currentTimeMs}
            totalDurationMs={totalDurationMs}
            zoomScale={zoomScale}
            toolMode={toolMode}
            snapping={snapping}
            selectedClipId={selectedClipId}
            onSelectClip={(id) => {
              setSelectedClipId(id);
              if (!showInspector) setShowInspector(true);
            }}
            onSeek={setCurrentTimeMs}
            onClipTrim={handleClipTrim}
            onClipSplit={handleClipSplit}
            onTrackToggleLock={(id) =>
              setTracks((ts) => ts.map((t) => (t.id === id ? { ...t, locked: !t.locked } : t)))
            }
            onTrackToggleMute={(id) =>
              setTracks((ts) => ts.map((t) => (t.id === id ? { ...t, muted: !t.muted } : t)))
            }
            onTrackToggleHide={(id) =>
              setTracks((ts) => ts.map((t) => (t.id === id ? { ...t, hidden: !t.hidden } : t)))
            }
            onTrackToggleSolo={(id) =>
              setTracks((ts) => ts.map((t) => (t.id === id ? { ...t, soloed: !t.soloed } : t)))
            }
            onTrackTogglePatchSource={(id) =>
              setTracks((ts) => ts.map((t) => (t.id === id ? { ...t, isPatchSource: !t.isPatchSource } : t)))
            }
            headerWidth={HEADER_WIDTH}
            inPointMs={inPointMs}
            outPointMs={outPointMs}
          />
        </div>
      )}

      {/* 4. Bottom AI Director Command Bar (Ctrl+K) */}
      {activeWorkspace === "edit" && (
        <AICommandBar onExecuteCommand={handleExecuteAICommand} />
      )}

      {/* 5. 1-Prompt Autonomous Video Modal */}
      <OnePromptModal
        isOpen={isOnePromptModalOpen}
        onClose={() => setIsOnePromptModalOpen(false)}
        onGenerate={handleOnePromptGenerate}
      />

      {/* 6. Creator Publish Pack & 4K Export Modal */}
      <ExportPublishModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        projectTitle="Quantum Supremacy 2026"
        totalDurationMs={totalDurationMs}
        clips={clips}
      />

      {/* 7. Claude AI Copilot Dialog Stream (Slot Studio Node) */}
      <ClaudeAICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />

      {/* 8. Sleek Status Footer */}
      <footer className="h-5 bg-[#090a0d] border-t border-[#1a1c24] px-3 flex items-center justify-between text-[10px] font-mono text-slate-500 z-40 shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>4K Ready · NVIDIA RTX 4090 · 2.1ms</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>Remotion v4.1.8 · Broadcast Safe -14.0 LUFS</span>
          <span className="text-slate-400">30.00 FPS</span>
        </div>
      </footer>

      <ConnectionsModal
        isOpen={isConnectionsOpen}
        onClose={() => setIsConnectionsOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-14 right-6 z-50 bg-studio-900 border border-violet-500/50 text-slate-100 text-xs px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
