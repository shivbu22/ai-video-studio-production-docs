"use client";

import React from "react";
import { 
  Pointer, 
  Scissors, 
  Magnet, 
  ZoomIn, 
  ZoomOut, 
  Undo2, 
  Redo2, 
  Split,
  Trash2,
  ArrowRightToLine,
  MoveHorizontal,
  Move,
  PenTool,
  Hand,
  Search,
  Bookmark,
  FastForward,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

export type ToolMode = "select" | "trackSelect" | "ripple" | "razor" | "slip" | "pen" | "hand" | "zoom";

interface TimelineToolbarProps {
  toolMode: ToolMode;
  onToolModeChange: (mode: ToolMode) => void;
  snapping: boolean;
  onToggleSnapping: () => void;
  zoomScale: number; // pixels per second
  onZoomChange: (scale: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSplitAtPlayhead: () => void;
  onDeleteSelected: () => void;
  hasSelection: boolean;
  inPointMs?: number | null;
  outPointMs?: number | null;
  onSetInPoint?: () => void;
  onSetOutPoint?: () => void;
  onClearInOut?: () => void;
  onAddMarker?: () => void;
  shuttleSpeed?: number;
}

export const TimelineToolbar: React.FC<TimelineToolbarProps> = ({
  toolMode,
  onToolModeChange,
  snapping,
  onToggleSnapping,
  zoomScale,
  onZoomChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSplitAtPlayhead,
  onDeleteSelected,
  hasSelection,
  inPointMs = null,
  outPointMs = null,
  onSetInPoint,
  onSetOutPoint,
  onClearInOut,
  onAddMarker,
  shuttleSpeed = 0,
}) => {
  return (
    <div className="h-9 bg-[#16171b] border-y border-[#262830] px-2.5 flex items-center justify-between select-none text-xs text-slate-300 font-sans">
      {/* 1. Premiere Pro 8-Tool Palette */}
      <div className="flex items-center gap-0.5">
        {/* Selection Tool (V) */}
        <button
          onClick={() => onToolModeChange("select")}
          title="Selection Tool (V) — Select and move clips"
          className={`h-7 px-2 rounded-[2px] transition-all flex items-center gap-1 font-medium ${
            toolMode === "select"
              ? "bg-[#3B63FF] text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Pointer className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono opacity-80">V</span>
        </button>

        {/* Track Select Forward Tool (A) */}
        <button
          onClick={() => onToolModeChange("trackSelect")}
          title="Track Select Forward Tool (A) — Select all clips to the right"
          className={`h-7 px-2 rounded-[2px] transition-all flex items-center gap-1 font-medium ${
            toolMode === "trackSelect"
              ? "bg-[#3B63FF] text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <ArrowRightToLine className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono opacity-80">A</span>
        </button>

        {/* Ripple Edit Tool (B) */}
        <button
          onClick={() => onToolModeChange("ripple")}
          title="Ripple Edit Tool (B) — Trim and close timeline gap"
          className={`h-7 px-2 rounded-[2px] transition-all flex items-center gap-1 font-medium ${
            toolMode === "ripple"
              ? "bg-[#3B63FF] text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <MoveHorizontal className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono opacity-80">B</span>
        </button>

        {/* Razor Blade Tool (C) */}
        <button
          onClick={() => onToolModeChange("razor")}
          title="Razor Blade Tool (C) — Split clip at cursor"
          className={`h-7 px-2 rounded-[2px] transition-all flex items-center gap-1 font-medium ${
            toolMode === "razor"
              ? "bg-[#3B63FF] text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono opacity-80">C</span>
        </button>

        {/* Slip Tool (Y) */}
        <button
          onClick={() => onToolModeChange("slip")}
          title="Slip Tool (Y) — Slip clip in/out range without moving position"
          className={`h-7 px-2 rounded-[2px] transition-all flex items-center gap-1 font-medium ${
            toolMode === "slip"
              ? "bg-[#3B63FF] text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Move className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono opacity-80">Y</span>
        </button>

        {/* Pen Keyframe Tool (P) */}
        <button
          onClick={() => onToolModeChange("pen")}
          title="Pen Tool (P) — Add volume rubberband & opacity keyframes"
          className={`h-7 px-2 rounded-[2px] transition-all flex items-center gap-1 font-medium ${
            toolMode === "pen"
              ? "bg-[#3B63FF] text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono opacity-80">P</span>
        </button>

        {/* Hand Tool (H) */}
        <button
          onClick={() => onToolModeChange("hand")}
          title="Hand Tool (H) — Pan timeline view"
          className={`h-7 px-1.5 rounded-[2px] transition-all flex items-center ${
            toolMode === "hand"
              ? "bg-[#3B63FF] text-white"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Hand className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-[#2b2e36] mx-1" />

        {/* Razor Split at Playhead */}
        <button
          onClick={onSplitAtPlayhead}
          title="Split at Playhead (Ctrl+K / Cmd+K)"
          className="h-7 px-2 rounded-[2px] text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1 border border-[#2b2e36]"
        >
          <Split className="w-3 h-3 text-cyan-400" />
          <span className="text-[10px] font-mono font-semibold">Split</span>
        </button>

        {/* Snapping Magnet (S) */}
        <button
          onClick={onToggleSnapping}
          title="Toggle Snap to Clips & Playhead (S)"
          className={`h-7 px-2 rounded-[2px] transition-all flex items-center gap-1 ${
            snapping
              ? "bg-amber-500/15 text-amber-300 border border-amber-500/40"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Magnet className="w-3 h-3" />
          <span className="text-[10px] font-semibold">Snap</span>
        </button>

        {/* Markers */}
        {onAddMarker && (
          <button
            onClick={onAddMarker}
            title="Add Timeline Marker at Playhead (M)"
            className="h-7 px-2 rounded-[2px] text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1"
          >
            <Bookmark className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] font-mono">Marker</span>
          </button>
        )}

        {/* In / Out Work Area Controls */}
        <div className="flex items-center gap-0.5 ml-1 border-l border-[#2b2e36] pl-1.5">
          {onSetInPoint && (
            <button
              onClick={onSetInPoint}
              title="Mark In Point (I)"
              className="h-6 px-1.5 rounded-[2px] bg-[#1f2229] hover:bg-[#282c35] text-[10px] font-mono font-bold text-slate-300 border border-[#2e323c]"
            >
              [ I
            </button>
          )}
          {onSetOutPoint && (
            <button
              onClick={onSetOutPoint}
              title="Mark Out Point (O)"
              className="h-6 px-1.5 rounded-[2px] bg-[#1f2229] hover:bg-[#282c35] text-[10px] font-mono font-bold text-slate-300 border border-[#2e323c]"
            >
              O ]
            </button>
          )}
          {onClearInOut && (inPointMs !== null || outPointMs !== null) && (
            <button
              onClick={onClearInOut}
              title="Clear In/Out Marks (Alt+X)"
              className="h-6 px-1.5 rounded-[2px] text-[10px] font-mono text-slate-400 hover:text-rose-400"
            >
              <RotateCcw className="w-2.5 h-2.5" />
            </button>
          )}
        </div>

        {hasSelection && (
          <button
            onClick={onDeleteSelected}
            title="Ripple Delete Selected Clip (Del / Backspace)"
            className="h-7 px-2 rounded-[2px] bg-rose-950/40 text-rose-300 border border-rose-800/40 hover:bg-rose-900/60 transition-colors flex items-center gap-1 ml-1"
          >
            <Trash2 className="w-3 h-3" />
            <span className="text-[10px]">Delete</span>
          </button>
        )}
      </div>

      {/* 2. J-K-L Shuttle Speed Indicator & Transport Status */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#111215] border border-[#2b2e36] text-[10px] font-mono">
          <span className="text-slate-500 font-semibold uppercase">Shuttle:</span>
          <span className={`font-bold ${
            shuttleSpeed === 0 ? "text-slate-400" :
            shuttleSpeed > 0 ? "text-emerald-400" : "text-amber-400"
          }`}>
            {shuttleSpeed === 0 && "⏸ Paused (K)"}
            {shuttleSpeed === 1 && "▶ 1x Fwd (L)"}
            {shuttleSpeed === 2 && "▶▶ 2x Fast"}
            {shuttleSpeed === 4 && "▶▶▶ 4x Shuttle"}
            {shuttleSpeed === -1 && "◀ 1x Rev (J)"}
            {shuttleSpeed === -2 && "◀◀ 2x Rev"}
            {shuttleSpeed === -4 && "◀◀◀ 4x Shuttle"}
          </span>
        </div>

        {/* Undo/Redo & Zoom Controls */}
        <div className="flex items-center gap-1 border-l border-[#2b2e36] pl-2">
          <button
            disabled={!canUndo}
            onClick={onUndo}
            title="Undo (Ctrl+Z)"
            className="p-1 rounded-[2px] text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-25 transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            disabled={!canRedo}
            onClick={onRedo}
            title="Redo (Ctrl+Y)"
            className="p-1 rounded-[2px] text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-25 transition-colors"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Slider */}
          <div className="flex items-center gap-1 bg-[#111215] px-2 py-1 rounded-[2px] border border-[#2b2e36] ml-1">
            <button
              onClick={() => onZoomChange(Math.max(20, zoomScale - 15))}
              className="text-slate-400 hover:text-white"
              title="Zoom Out Timeline (-)"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <input
              type="range"
              min={20}
              max={150}
              value={zoomScale}
              onChange={(e) => onZoomChange(Number(e.target.value))}
              className="w-16 h-1 bg-slate-800 accent-[#3B63FF] rounded cursor-pointer"
            />
            <button
              onClick={() => onZoomChange(Math.min(150, zoomScale + 15))}
              className="text-slate-400 hover:text-white"
              title="Zoom In Timeline (+)"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
