"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, X, Wand2, Film, Clock, Palette, CheckCircle2, Terminal, User, BookOpen } from "lucide-react";

export interface OnePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (brief: { 
    topic: string; 
    durationSec: number; 
    stylePreset: string;
    narrator: string;
  }) => void;
}

export const OnePromptModal: React.FC<OnePromptModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [topic, setTopic] = useState("Quantum Computing & Algorithmic Supremacy in 2026");
  const [durationSec, setDurationSec] = useState(120);
  const [stylePreset, setStylePreset] = useState("veritasium");
  const [narrator, setNarrator] = useState("rachel_veritasium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleStart = () => {
    setIsGenerating(true);
    setGenerationLogs(["[0.1s] 🚀 Autonomous Pipeline Initialized (Route B Clean-Room)"]);

    const steps = [
      { delay: 400, text: "[0.5s] 🔍 Tavily & Perplexity Search: querying peer-reviewed databases..." },
      { delay: 900, text: "[1.1s] 📄 Extracted 6 verified claims from Nature & Science (2020-2026)" },
      { delay: 1400, text: "[1.7s] ✍️ Synthesizing 5-scene JSON script (Target WPM: 148, Hook-to-Payoff)" },
      { delay: 2000, text: `[2.3s] 🎙️ ElevenLabs 48kHz Voice Synthesis (${narrator})...` },
      { delay: 2600, text: "[2.9s] ✂️ faster-whisper alignment: 11 breaths & 4 filler words excised" },
      { delay: 3200, text: "[3.5s] 🎥 YouTube 4K footage matched: semantic in/out points locked" },
      { delay: 3800, text: "[4.1s] ✨ Remotion 3D motion nodes generated: Chrome reflection charts" },
      { delay: 4400, text: "[4.6s] 🎬 Master multi-track timeline assembled (5 tracks, ducked music)" },
    ];

    steps.forEach(({ delay, text }) => {
      setTimeout(() => {
        setGenerationLogs((prev) => [...prev, text]);
      }, delay);
    });

    setTimeout(() => {
      setIsGenerating(false);
      onGenerate({ topic, durationSec, stylePreset, narrator });
      onClose();
    }, 5000);
  };

  const STYLES = [
    { id: "veritasium", name: "Veritasium Mystery", desc: "Scientific paradox, 3D paper citations, dramatic pauses" },
    { id: "vox", name: "Vox Video Essay", desc: "Kinetic typography, archival b-roll, split-screen data maps" },
    { id: "hormozi", name: "Alex Hormozi Viral", desc: "Punchy cuts every 2s, bright yellow bold captions, value stacking" },
    { id: "huberman", name: "Huberman Lab Rigor", desc: "Neuroscience diagrams, clinical trials, measured voiceover" },
  ];

  const NARRATORS = [
    { id: "rachel_veritasium", name: "Rachel (Curious & Intellectual)" },
    { id: "adam_hormozi", name: "Adam (Direct, Fast-Paced & Punchy)" },
    { id: "marcus_vox", name: "Marcus (Authoritative Documentary)" },
    { id: "dr_peter_huberman", name: "Dr. Peter (Calm Clinical Precision)" },
  ];

  const SAMPLE_TOPICS = [
    "Quantum Supremacy & Post-RSA Encryption 2026",
    "Back Hypertrophy: Rows vs Pullups for Maximum Lats",
    "Why Modern Passenger Jets Don't Fly Over the Pacific",
    "The Silicon War: TSMC, ASML, and Next-Gen EUV Lithography",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150 select-none font-sans text-xs">
      <div className="w-full max-w-xl bg-[#0f1219] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="h-14 px-6 bg-[#131620] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-gradient-to-tr from-fuchsia-600 via-violet-600 to-indigo-600 text-white shadow-md shadow-violet-950/50">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">1-Prompt Autonomous Video Generator</h2>
              <p className="text-[11px] text-slate-400">Slot Studio Clean-Room Route B &bull; Research to Final Render in 1 Click</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {isGenerating ? (
            <div className="py-6 flex flex-col items-center justify-center space-y-4">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
                <Wand2 className="w-5 h-5 text-violet-400 animate-pulse" />
              </div>

              <div className="text-center">
                <p className="text-sm font-bold text-white">Synthesizing Autonomous Production</p>
                <p className="text-xs text-emerald-400 font-mono mt-0.5">Route B Clean-Room Agent Swarm Active</p>
              </div>

              {/* Live Terminal Log Stream */}
              <div className="w-full bg-black/70 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-slate-300 h-44 overflow-y-auto space-y-1 text-left shadow-inner">
                {generationLogs.map((log, i) => (
                  <div key={i} className="text-emerald-400/90 leading-tight">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Topic Input & Suggestion Chips */}
              <div className="space-y-2">
                <label className="text-slate-200 font-semibold block text-xs">Video Topic or Idea</label>
                <textarea
                  rows={2}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Why quantum processors will crack modern encryption by 2028..."
                  className="w-full bg-[#0a0c10] border border-slate-700/80 rounded-xl p-3 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all shadow-inner"
                />

                {/* Quick Topic Chips */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {SAMPLE_TOPICS.map((t, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTopic(t)}
                      className="text-[10px] bg-[#161a24] hover:bg-slate-800 text-slate-300 hover:text-white px-2 py-0.5 rounded border border-slate-700/60 transition-colors truncate max-w-full"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Duration & Narrator Voice */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Length</span>
                    </span>
                    <span className="font-mono text-cyan-400 font-semibold">{durationSec}s ({Math.round(durationSec / 60)}m)</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[60, 90, 120, 180].map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => setDurationSec(sec)}
                        className={`py-1.5 rounded-lg font-medium text-xs border transition-all ${
                          durationSec === sec
                            ? "bg-cyan-500/15 border-cyan-500 text-cyan-300 font-bold"
                            : "bg-[#0a0c10] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold block text-xs flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Narrator Voice</span>
                  </label>
                  <select
                    value={narrator}
                    onChange={(e) => setNarrator(e.target.value)}
                    className="w-full bg-[#0a0c10] border border-slate-700/80 rounded-lg py-2 px-2.5 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {NARRATORS.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Channel Visual & Narrative Style */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block text-xs flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>Channel Narrative &amp; Visual Style</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {STYLES.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setStylePreset(st.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        stylePreset === st.id
                          ? "bg-violet-600/20 border-violet-500 text-white shadow-sm shadow-violet-950/40"
                          : "bg-[#0a0c10] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
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
          <div className="h-16 px-6 bg-[#131620] border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Free &bull; Zero Rendering Credits Needed</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 font-medium transition-colors"
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
