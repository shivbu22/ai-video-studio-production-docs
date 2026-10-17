"use client";

import React, { useState } from "react";
import { Sparkles, X, Wand2, Film, Clock, Palette, CheckCircle2 } from "lucide-react";

export interface OnePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (brief: { topic: string; durationSec: number; stylePreset: string }) => void;
}

export const OnePromptModal: React.FC<OnePromptModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [topic, setTopic] = useState("Quantum Computing & Algorithmic Supremacy in 2026");
  const [durationSec, setDurationSec] = useState(120);
  const [stylePreset, setStylePreset] = useState("educational_tech");
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState("");

  if (!isOpen) return null;

  const handleStart = () => {
    setIsGenerating(true);
    setStep("Querying research claims & sources...");
    setTimeout(() => {
      setStep("Authoring structured 5-scene JSON script...");
      setTimeout(() => {
        setStep("Generating 48kHz voice track & faster-whisper alignment...");
        setTimeout(() => {
          setStep("Compiling Remotion motion graphics & 5-track timeline...");
          setTimeout(() => {
            setIsGenerating(false);
            onGenerate({ topic, durationSec, stylePreset });
            onClose();
          }, 800);
        }, 800);
      }, 800);
    }, 800);
  };

  const STYLES = [
    { id: "educational_tech", name: "Educational Tech", desc: "Data charts, clean motion graphics, high engagement" },
    { id: "cyberpunk", name: "Cyberpunk Neon", desc: "Ultraviolet glows, fast cuts, high-contrast dark mode" },
    { id: "documentarian", name: "Documentary", desc: "Cinematic b-roll, pull quotes, 35mm film halation" },
    { id: "minimal", name: "Executive Minimal", desc: "Typography-first, Swiss bento layouts, subtle motion" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150 select-none font-sans text-xs">
      <div className="w-full max-w-xl bg-studio-900 border border-studio-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="h-14 px-6 bg-studio-950 border-b border-studio-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-gradient-to-tr from-fuchsia-600 to-violet-600 text-white shadow-md shadow-fuchsia-950/50">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">1-Prompt Autonomous Video Generator</h2>
              <p className="text-[11px] text-slate-400">Generate full research, script, voiceover, and Remotion timeline in 1 click.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-studio-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {isGenerating ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
                <Wand2 className="w-6 h-6 text-violet-400 animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-100">{step}</p>
                <p className="text-xs text-slate-400">Route B Clean-Room Autonomous Pipeline Active</p>
              </div>
            </div>
          ) : (
            <>
              {/* Topic Input */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block text-xs">Video Topic or Prompt</label>
                <textarea
                  rows={3}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Why quantum processors will crack modern encryption by 2028..."
                  className="w-full bg-studio-950 border border-studio-800 rounded-xl p-3 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all shadow-inner"
                />
              </div>

              {/* Target Duration */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Target Length</span>
                  </span>
                  <span className="font-mono text-cyan-400 font-semibold">{durationSec} seconds ({Math.round(durationSec / 60)} min)</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[60, 90, 120, 180].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setDurationSec(sec)}
                      className={`py-2 rounded-lg font-medium text-xs border transition-all ${
                        durationSec === sec
                          ? "bg-cyan-500/10 border-cyan-500 text-cyan-300 shadow-sm"
                          : "bg-studio-950 border-studio-800 text-slate-400 hover:border-studio-700 hover:text-slate-200"
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Style Preset */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block text-xs flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>Motion & Visual Preset</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {STYLES.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setStylePreset(st.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        stylePreset === st.id
                          ? "bg-violet-600/15 border-violet-500 text-slate-100 shadow-sm"
                          : "bg-studio-950 border-studio-800 text-slate-400 hover:border-studio-700 hover:text-slate-300"
                      }`}
                    >
                      <span className="font-semibold text-xs block text-slate-200">{st.name}</span>
                      <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{st.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!isGenerating && (
          <div className="h-16 px-6 bg-studio-950 border-t border-studio-800 flex items-center justify-between">
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Free & Unlimited Pipeline</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-studio-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStart}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-violet-900/40 active:scale-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Autonomous Video</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
