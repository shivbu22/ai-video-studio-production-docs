"use client";

import React, { useState } from "react";
import { Scissors, Trash2, Wand2, Volume2, Sparkles } from "lucide-react";

export interface TranscriptWord {
  id: string;
  word: string;
  startMs: number;
  endMs: number;
  isDeleted?: boolean;
}

interface TranscriptEditorProps {
  words: TranscriptWord[];
  currentTimeMs: number;
  onSeek: (ms: number) => void;
  onDeleteWord: (wordId: string) => void;
  onRemoveSilences: () => void;
}

export const TranscriptEditor: React.FC<TranscriptEditorProps> = ({
  words,
  currentTimeMs,
  onSeek,
  onDeleteWord,
  onRemoveSilences,
}) => {
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full bg-studio-900 select-none">
      {/* Transcript Toolbar */}
      <div className="p-2 border-b border-studio-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Speech Alignment (faster-whisper)</span>
        </div>
        <button
          onClick={onRemoveSilences}
          className="flex items-center gap-1 bg-studio-800 hover:bg-studio-700 text-amber-300 text-[11px] px-2 py-1 rounded border border-amber-500/30 transition-colors"
        >
          <Wand2 className="w-3 h-3" />
          <span>Cut Pauses &gt; 0.5s</span>
        </button>
      </div>

      {/* Words Flow Canvas */}
      <div className="flex-1 p-4 overflow-y-auto leading-relaxed">
        <div className="flex flex-wrap gap-1.5">
          {words.map((item) => {
            const isActive = currentTimeMs >= item.startMs && currentTimeMs <= item.endMs;
            const isSelected = selectedWordId === item.id;

            return (
              <span
                key={item.id}
                onClick={() => {
                  setSelectedWordId(item.id);
                  onSeek(item.startMs);
                }}
                className={`relative px-1 py-0.5 rounded cursor-pointer transition-all duration-150 craft-pill active:scale-95 text-xs font-medium ${
                  item.isDeleted
                    ? "line-through text-slate-600 bg-rose-950/20 border border-rose-900/30 opacity-60"
                    : isActive
                    ? "bg-amber-400 text-black font-bold shadow-lg shadow-amber-400/20 scale-105"
                    : isSelected
                    ? "bg-violet-600 text-white shadow"
                    : "text-slate-300 hover:bg-studio-800 hover:text-slate-100"
                }`}
              >
                {item.word}
                {isSelected && !item.isDeleted && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteWord(item.id);
                    }}
                    title="Cut Word (Ripple Delete Timeline)"
                    className="ml-1 text-rose-300 hover:text-white"
                  >
                    ×
                  </button>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Transcript Footer Helper */}
      <div className="p-2.5 bg-studio-950 border-t border-studio-800 text-[10px] text-slate-500 flex items-center justify-between">
        <span>Click word to jump playhead • Click × to ripple cut audio & video</span>
        <span className="text-emerald-400 font-mono">Word Sync: 100%</span>
      </div>
    </div>
  );
};
