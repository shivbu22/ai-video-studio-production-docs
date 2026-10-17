"use client";

import React, { useState } from "react";
import { Sparkles, Send, Command, Zap, Film, Scissors, BarChart3, Subtitles } from "lucide-react";

export interface AICommandBarProps {
  onExecuteCommand: (command: string) => void;
  isProcessing?: boolean;
}

export const AICommandBar: React.FC<AICommandBarProps> = ({
  onExecuteCommand,
  isProcessing = false,
}) => {
  const [inputVal, setInputVal] = useState("");

  const SUGGESTIONS = [
    { label: "Color grade moody teal & orange across all scenes", icon: Film, cmd: "apply_lut_teal_orange" },
    { label: "Cut 2 seconds off Scene 1", icon: Scissors, cmd: "trim_scene_1" },
    { label: "Insert Stat Counter milestone at playhead", icon: BarChart3, cmd: "insert_stat_counter" },
    { label: "Auto-sync kinetic captions to voiceover", icon: Subtitles, cmd: "sync_captions" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onExecuteCommand(inputVal.trim());
    setInputVal("");
  };

  return (
    <div className="bg-studio-950/95 border-t border-studio-800 px-4 py-2 flex flex-col gap-1.5 select-none font-sans text-xs flex-shrink-0 backdrop-blur-md">
      {/* 1. Main Command Input Row */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1 flex items-center">
          <Sparkles className="w-4 h-4 text-violet-400 absolute left-3 pointer-events-none animate-pulse" />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Direct the AI: 'Cut silence at 0:14', 'Color grade teal & orange', 'Zoom in on scene 2'..."
            className="w-full bg-studio-900 border border-studio-700/80 rounded-lg pl-9 pr-20 py-2 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all shadow-inner"
          />
          <div className="absolute right-3 flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-studio-800 px-1.5 py-0.5 rounded border border-studio-700">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing || !inputVal.trim()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-xs shadow-md shadow-violet-900/30 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Direct Edit</span>
        </button>
      </form>

      {/* 2. Quick Suggestion Chips */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
        <span className="flex items-center gap-1 text-slate-500 text-[11px] font-medium flex-shrink-0">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Suggestions:</span>
        </span>
        {SUGGESTIONS.map((s, idx) => {
          const Icon = s.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onExecuteCommand(s.label)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-studio-900 hover:bg-studio-800 border border-studio-800 hover:border-studio-700 text-slate-300 hover:text-slate-100 text-[11px] transition-all whitespace-nowrap active:scale-95"
            >
              <Icon className="w-3 h-3 text-violet-400" />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
