"use client";

import React, { useState } from "react";
import { Sparkles, Send, Command, ChevronDown } from "lucide-react";

export interface AICommandBarProps {
  onExecuteCommand: (command: string) => void;
  isProcessing?: boolean;
}

export const AICommandBar: React.FC<AICommandBarProps> = ({
  onExecuteCommand,
  isProcessing = false,
}) => {
  const [inputVal, setInputVal] = useState("");
  const [showQuickPrompts, setShowQuickPrompts] = useState(false);

  const SUGGESTIONS = [
    "Color grade moody teal & orange across all scenes",
    "Cut 2 seconds off Scene 1",
    "Insert Stat Counter milestone at playhead",
    "Auto-sync kinetic captions to voiceover",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onExecuteCommand(inputVal.trim());
    setInputVal("");
    setShowQuickPrompts(false);
  };

  return (
    <div className="bg-[#0e0f14] border-t border-[#1a1b22] px-3 py-1.5 flex items-center justify-between select-none font-sans text-xs flex-shrink-0 z-20">
      <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2 max-w-4xl mx-auto">
        <div className="relative flex-1 flex items-center">
          <Sparkles className="w-3.5 h-3.5 text-[#3B63FF] absolute left-2.5 pointer-events-none" />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onFocus={() => setShowQuickPrompts(true)}
            placeholder="Direct the AI: 'Cut silence at 0:14', 'Color grade teal & orange', 'Zoom in on scene 2'..."
            className="w-full bg-[#14151b] border border-[#232532] rounded pl-8 pr-16 py-1.5 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-[#3B63FF] transition-colors"
          />
          <div className="absolute right-2 flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-[#0d0e13] px-1 py-0.5 rounded border border-white/5">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>

        {/* Quick Prompts Dropdown Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowQuickPrompts(!showQuickPrompts)}
            className="h-7 px-2 rounded bg-[#14151b] border border-[#232532] text-slate-400 hover:text-slate-200 flex items-center gap-1 text-[11px]"
          >
            <span>Examples</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {showQuickPrompts && (
            <div 
              className="absolute right-0 bottom-full mb-1.5 w-80 bg-[#14151b] border border-[#2b2e3a] rounded-md shadow-2xl p-1 z-50 text-[11px]"
              onMouseLeave={() => setShowQuickPrompts(false)}
            >
              <div className="px-2 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Quick Directives</div>
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onExecuteCommand(s);
                    setShowQuickPrompts(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-white/5 rounded text-slate-300 hover:text-white transition-colors truncate"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isProcessing || !inputVal.trim()}
          className="h-7 px-3 rounded bg-[#3B63FF] hover:bg-[#4f73ff] text-white font-medium text-xs shadow-sm disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1"
        >
          <Send className="w-3 h-3" />
          <span>Apply</span>
        </button>
      </form>
    </div>
  );
};
