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
  PenTool, 
  Hand, 
  Bookmark
} from "lucide-react";

export type ToolMode = "select" | "trackSelect" | "ripple" | "razor" | "slip" | "pen" | "hand" | "zoom";

interface TimelineToolbarProps {
  toolMode: ToolMode;
  onToolModeChange: (mode: ToolMode) => void;
  snapping: boolean;
  onToggleSnapping: () => void;
  zoomScale: number;
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
    <div className="h-8 bg-[#13141a] border-y border-[#21232e] px-2.5 flex items-center justify-between select-none text-xs text-slate-300 font-sans">
      {/* 1. Left: 8-Tool Palette */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => onToolModeChange("select")}
          title="Selection Tool (V)"
          className={`h-6 px-1.5 rounded transition-colors flex items-center gap-1 ${
            toolMode === "select" ? "bg-[#3B63FF] text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Pointer className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono opacity-80">V</span>
        </button>

        <button
          onClick={() => onToolModeChange("trackSelect")}
          title="Track Select Forward (A)"
          className={`h-6 px-1.5 rounded transition-colors flex items-center gap-1 ${
            toolMode === "trackSelect" ? "bg-[#3B63FF] text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <ArrowRightToLine className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono opacity-80">A</span>
        </button>

        <button
          onClick={() => onToolModeChange("ripple")}
          title="Ripple Edit Tool (B)"
          className={`h-6 px-1.5 rounded transition-colors flex items-center gap-1 ${
            toolMode === "ripple" ? "bg-[#3B63FF] text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <MoveHorizontal className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono opacity-80">B</span>
        </button>

        <button
          onClick={() => onToolModeChange("razor")}
          title="Razor Blade Tool (C)"
          className={`h-6 px-1.5 rounded transition-colors flex items-center gap-1 ${
            toolMode === "razor" ? "bg-[#3B63FF] text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono opacity-80">C</span>
        </button>

        <button
          onClick={() => onToolModeChange("pen")}
          title="Pen Tool (P)"
          className={`h-6 px-1.5 rounded transition-colors flex items-center gap-1 ${
            toolMode === "pen" ? "bg-[#3B63FF] text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono opacity-80">P</span>
        </button>

        <button
          onClick={() => onToolModeChange("hand")}
          title="Hand Tool (H)"
          className={`h-6 px-1.5 rounded transition-colors flex items-center gap-1 ${
            toolMode === "hand" ? "bg-[#3B63FF] text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Hand className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono opacity-80">H</span>
        </button>

        <div className="h-3.5 w-[1px] bg-white/10 mx-1" />

        {/* Quick Cut & Delete */}
        <button
          onClick={onSplitAtPlayhead}
          title="Split at playhead (S)"
          className="h-6 px-2 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center gap-1 text-[11px] font-medium"
        >
          <Split className="w-3 h-3 text-cyan-400" />
          <span>Split</span>
        </button>

        <button
          onClick={onDeleteSelected}
          disabled={!hasSelection}
          title="Delete selected (Del)"
          className="h-6 px-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 disabled:opacity-30 disabled:pointer-events-none"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Center: Work Area In/Out & Markers */}
      <div className="flex items-center gap-1">
        <button
          onClick={onSetInPoint}
          className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 hover:bg-white/10 text-slate-300"
          title="Mark In Point (I)"
        >
          In
        </button>
        <button
          onClick={onSetOutPoint}
          className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 hover:bg-white/10 text-slate-300"
          title="Mark Out Point (O)"
        >
          Out
        </button>
        {(inPointMs !== null || outPointMs !== null) && (
          <button
            onClick={onClearInOut}
            className="px-1.5 py-0.5 rounded text-[10px] text-slate-400 hover:text-white"
            title="Clear In/Out (Alt+X)"
          >
            Clear
          </button>
        )}
        <button
          onClick={onAddMarker}
          className="p-1 rounded text-slate-400 hover:text-amber-300 hover:bg-white/5"
          title="Add Marker (M)"
        >
          <Bookmark className="w-3 h-3" />
        </button>

        {shuttleSpeed !== 0 && (
          <span className="text-[10px] font-mono text-[#3B63FF] bg-[#3B63FF]/10 px-1.5 py-0.5 rounded">
            {shuttleSpeed > 0 ? `+${shuttleSpeed}x` : `${shuttleSpeed}x`}
          </span>
        )}
      </div>

      {/* 3. Right: Snapping & Zoom */}
      <div className="flex items-center gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onToggleSnapping}
          title="Magnetic Snapping (S)"
          className={`p-1 rounded transition-colors ${
            snapping ? "text-amber-400 bg-amber-400/10" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <Magnet className="w-3.5 h-3.5" />
        </button>

        {/* Zoom Slider */}
        <div className="flex items-center gap-1 bg-[#0f1015] border border-[#232532] rounded px-1.5 py-0.5">
          <ZoomOut 
            className="w-3 h-3 text-slate-500 cursor-pointer hover:text-slate-300" 
            onClick={() => onZoomChange(Math.max(10, zoomScale - 10))} 
          />
          <input
            type="range"
            min={10}
            max={120}
            value={zoomScale}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className="w-16 h-1 accent-[#3B63FF] bg-slate-700 cursor-pointer"
          />
          <ZoomIn 
            className="w-3 h-3 text-slate-500 cursor-pointer hover:text-slate-300" 
            onClick={() => onZoomChange(Math.min(120, zoomScale + 10))} 
          />
        </div>
      </div>
    </div>
  );
};
