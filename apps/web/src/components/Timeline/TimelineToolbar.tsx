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
  Trash2
} from "lucide-react";

export type ToolMode = "select" | "razor" | "ripple";

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
}) => {
  return (
    <div className="h-10 bg-studio-900 border-y border-studio-800 px-3 flex items-center justify-between select-none text-xs">
      {/* Editing Tools (Premiere Pro Shortcuts: V, C, B) */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onToolModeChange("select")}
          title="Selection Tool (V)"
          className={`p-1.5 rounded transition-all flex items-center gap-1 ${
            toolMode === "select"
              ? "bg-violet-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-studio-800"
          }`}
        >
          <Pointer className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono">V</span>
        </button>

        <button
          onClick={() => onToolModeChange("razor")}
          title="Razor Blade Tool (C)"
          className={`p-1.5 rounded transition-all flex items-center gap-1 ${
            toolMode === "razor"
              ? "bg-violet-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-studio-800"
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono">C</span>
        </button>

        <button
          onClick={onSplitAtPlayhead}
          title="Split at Playhead (S)"
          className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-studio-800 transition-colors flex items-center gap-1"
        >
          <Split className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-mono">Split</span>
        </button>

        <div className="h-4 w-[1px] bg-studio-800 mx-1" />

        <button
          onClick={onToggleSnapping}
          title="Toggle Snapping (S)"
          className={`p-1.5 rounded transition-all flex items-center gap-1 ${
            snapping
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              : "text-slate-400 hover:text-slate-200 hover:bg-studio-800"
          }`}
        >
          <Magnet className="w-3.5 h-3.5" />
          <span className="text-[10px]">Snap</span>
        </button>

        {hasSelection && (
          <button
            onClick={onDeleteSelected}
            title="Delete Selected Clip (Del / Backspace)"
            className="p-1.5 rounded bg-rose-950/40 text-rose-300 border border-rose-800/40 hover:bg-rose-900/60 transition-colors flex items-center gap-1 ml-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="text-[10px]">Delete</span>
          </button>
        )}
      </div>

      {/* Undo/Redo & Zoom Controls */}
      <div className="flex items-center gap-3">
        {/* Undo/Redo */}
        <div className="flex items-center gap-0.5">
          <button
            disabled={!canUndo}
            onClick={onUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-studio-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            disabled={!canRedo}
            onClick={onRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-studio-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom Slider */}
        <div className="flex items-center gap-1.5 bg-studio-950 px-2 py-1 rounded border border-studio-800">
          <button
            onClick={() => onZoomChange(Math.max(20, zoomScale - 15))}
            className="text-slate-400 hover:text-slate-200"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <input
            type="range"
            min={20}
            max={150}
            value={zoomScale}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className="w-16 h-1 bg-studio-800 accent-violet-500 rounded cursor-pointer"
          />
          <button
            onClick={() => onZoomChange(Math.min(150, zoomScale + 15))}
            className="text-slate-400 hover:text-slate-200"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
