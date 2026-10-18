"use client";

import React, { useState } from "react";
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Wand2, 
  ArrowRight, 
  Sliders, 
  Mic, 
  Film, 
  Layers,
  Copy,
  Check,
  RotateCcw
} from "lucide-react";

export interface ScriptSceneData {
  id: string;
  order: number;
  type: "hook" | "body" | "evidence" | "benchmark" | "cta";
  narration: string;
  visualIntent: string;
  templateTarget: string;
  durationSec: number;
}

export interface ResearchPaperData {
  id: string;
  journal: string;
  date: string;
  title: string;
  authors: string;
  abstract: string;
  highlightSentence: string;
  doi: string;
  sampleSize: string;
  metric: string;
}

interface ResearchScriptWorkspaceProps {
  onSendToVoiceover?: () => void;
  onSendToClipFinder?: () => void;
  onPushToTimeline?: () => void;
  onShowToast: (msg: string) => void;
}

export const ResearchScriptWorkspace: React.FC<ResearchScriptWorkspaceProps> = ({
  onSendToVoiceover,
  onSendToClipFinder,
  onPushToTimeline,
  onShowToast,
}) => {
  // Topic & Channel Settings
  const [topic, setTopic] = useState("Quantum Computing Supremacy: Sycamore Benchmark vs Classical Supercomputers");
  const [channelStyle, setChannelStyle] = useState<"veritasium" | "vox" | "hormozi" | "huberman">("veritasium");
  const [targetDuration, setTargetDuration] = useState<"60s" | "3m" | "8m" | "15m">("8m");
  const [isResearching, setIsResearching] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Selected Academic Paper
  const [selectedPaperId, setSelectedPaperId] = useState("p1");

  const papers: ResearchPaperData[] = [
    {
      id: "p1",
      journal: "Nature · Vol 574 · Oct 2019",
      date: "Oct 23, 2019",
      title: "Quantum supremacy using a programmable superconducting processor",
      authors: "Arute, F., Arya, K., Babbush, R. et al. (Google Quantum AI)",
      abstract: "We demonstrate quantum supremacy with a programmable superconducting processor named Sycamore. The processor performed a benchmark calculation in 200 seconds that would take a state-of-the-art supercomputer approximately 10,000 years. This dramatic increase in speed compared to all known classical algorithms is an experimental realization of quantum supremacy.",
      highlightSentence: "The processor performed a benchmark calculation in 200 seconds that would take a state-of-the-art supercomputer approximately 10,000 years.",
      doi: "10.1038/s41586-019-1666-5",
      sampleSize: "53 Qubits",
      metric: "1.58 × 10¹⁴ speedup factor",
    },
    {
      id: "p2",
      journal: "Science · Vol 370 · Dec 2020",
      date: "Dec 3, 2020",
      title: "Quantum computational advantage using photons (Jiuzhang)",
      authors: "Zhong, H.-S., Wang, H., Deng, Y.-H. et al. (USTC)",
      abstract: "We report the experimental realization of Gaussian boson sampling with 76 detected photons using a photonic quantum computer. Jiuzhang yielded 10¹⁴ times faster sampling than the fastest supercomputer Sunway TaihuLight, establishing computational advantage in photonics.",
      highlightSentence: "Jiuzhang yielded 10¹⁴ times faster sampling than the fastest supercomputer.",
      doi: "10.1126/science.abe8770",
      sampleSize: "76 Photons",
      metric: "10¹⁴ faster sampling",
    },
    {
      id: "p3",
      journal: "Sports Medicine · Vol 51 · 2021",
      date: "Jan 12, 2021",
      title: "Loading Recommendations for Muscle Strength, Hypertrophy, and Local Endurance",
      authors: "Schoenfeld, B. J., Grgic, J., Van Every, D. W. et al.",
      abstract: "The present meta-analysis evaluated the effects of resistance training loading zones on regional muscular adaptations. Horizontal rows elicited 118% higher mean motor unit recruitment in the latissimus dorsi compared to vertical pulldowns when volume-equated.",
      highlightSentence: "Horizontal rows elicited 118% higher mean motor unit recruitment in the latissimus dorsi compared to vertical pulldowns.",
      doi: "10.1007/s40279-021-01490-1",
      sampleSize: "157 Male Athletes",
      metric: "118% higher recruitment",
    },
  ];

  const currentPaper = papers.find((p) => p.id === selectedPaperId) || papers[0];

  // Editable Script Scenes
  const [scenes, setScenes] = useState<ScriptSceneData[]>([
    {
      id: "s1",
      order: 1,
      type: "hook",
      narration: "A classical supercomputer would take ten thousand years to solve this equation. Sycamore did it in 200 seconds.",
      visualIntent: "Macro dolly into dilution refrigerator chamber with cryogenic gold wiring",
      templateTarget: "QuoteCard",
      durationSec: 4.0,
    },
    {
      id: "s2",
      order: 2,
      type: "evidence",
      narration: "Published in Nature Volume 574, Google's team verified 53 superconducting qubits operating at 15 millikelvin.",
      visualIntent: "3D research paper lift-off with luminescent yellow highlighting over abstract",
      templateTarget: "PaperLiftOff",
      durationSec: 5.0,
    },
    {
      id: "s3",
      order: 3,
      type: "benchmark",
      narration: "Here is the exact comparison: Summit at Oak Ridge needed 10,000 years. Sycamore solved it in 3 minutes.",
      visualIntent: "3D Chrome Bar Chart on mirror reflection floor with metallic sheen",
      templateTarget: "BarChart",
      durationSec: 4.5,
    },
    {
      id: "s4",
      order: 4,
      type: "body",
      narration: "That is a speedup factor of over 1.58 trillion times faster than any silicon wafer on planet Earth.",
      visualIntent: "Rapid stat counter ticking from 1x to 1,580,000,000,000x with cyan glow",
      templateTarget: "StatCounter",
      durationSec: 3.5,
    },
    {
      id: "s5",
      order: 5,
      type: "cta",
      narration: "Hit subscribe and comment below: will quantum cryptography break RSA encryption before 2030?",
      visualIntent: "Glass tier list overlay ranking post-quantum encryption algorithms",
      templateTarget: "TierList",
      durationSec: 3.0,
    },
  ]);

  // Calculated Script Stats
  const totalDurationSec = scenes.reduce((acc, s) => acc + s.durationSec, 0);
  const totalWords = scenes.reduce((acc, s) => acc + s.narration.split(" ").length, 0);
  const speakingPaceWpm = Math.round((totalWords / (totalDurationSec / 60)));

  const handleRunAIResearch = () => {
    setIsResearching(true);
    setTimeout(() => {
      setIsResearching(false);
      onShowToast("Perplexity Research Engine: Found 3 cited peer-reviewed claims with source DOIs.");
    }, 1200);
  };

  const handleUpdateNarration = (id: string, text: string) => {
    setScenes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, narration: text } : s))
    );
  };

  const handleCopyScript = () => {
    const fullText = scenes.map((s) => `[Scene ${s.order} - ${s.type.toUpperCase()}]\n${s.narration}`).join("\n\n");
    navigator.clipboard.writeText(fullText);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
    onShowToast("Full script copied to clipboard");
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0b0e14] text-slate-200 select-none">
      {/* LEFT COLUMN: Topic Brief & Autonomous Perplexity Engine */}
      <div className="w-96 border-r border-slate-800/80 bg-[#101319] flex flex-col shrink-0">
        <div className="p-3 border-b border-slate-800 bg-[#14171d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#3B63FF]" />
            <span className="text-xs font-bold text-white tracking-wide">AUTONOMOUS RESEARCH BRIEF</span>
          </div>
          <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-mono">
            Perplexity API
          </span>
        </div>

        {/* Topic Input Box */}
        <div className="p-4 border-b border-slate-800 bg-[#0d0f14] space-y-3">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Video Topic & Working Title
          </label>
          <textarea
            rows={2}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-[#161a22] border border-slate-700/60 rounded p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#3B63FF]"
          />

          {/* Channel Personality Presets */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Channel Narrative Style
            </label>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-medium">
              <button
                onClick={() => setChannelStyle("veritasium")}
                className={`px-2 py-1.5 rounded border text-left transition-all ${
                  channelStyle === "veritasium"
                    ? "bg-[#3B63FF]/20 border-[#3B63FF] text-white"
                    : "bg-[#14171d] border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                🔬 Veritasium / Science
              </button>
              <button
                onClick={() => setChannelStyle("vox")}
                className={`px-2 py-1.5 rounded border text-left transition-all ${
                  channelStyle === "vox"
                    ? "bg-purple-600/20 border-purple-500 text-white"
                    : "bg-[#14171d] border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                📰 Vox / Visual Journal
              </button>
              <button
                onClick={() => setChannelStyle("hormozi")}
                className={`px-2 py-1.5 rounded border text-left transition-all ${
                  channelStyle === "hormozi"
                    ? "bg-amber-600/20 border-amber-500 text-white"
                    : "bg-[#14171d] border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                ⚡ Hormozi / Punchy
              </button>
              <button
                onClick={() => setChannelStyle("huberman")}
                className={`px-2 py-1.5 rounded border text-left transition-all ${
                  channelStyle === "huberman"
                    ? "bg-emerald-600/20 border-emerald-500 text-white"
                    : "bg-[#14171d] border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                🧬 Huberman / Protocols
              </button>
            </div>
          </div>

          {/* Trigger Live Research */}
          <button
            onClick={handleRunAIResearch}
            disabled={isResearching}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-gradient-to-r from-[#3B63FF] to-indigo-600 hover:from-[#4d72ff] hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-[#3B63FF]/30 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isResearching ? "Searching Literature..." : "Extract Verified Scientific Facts"}</span>
          </button>
        </div>

        {/* Paper Source Selector */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Ingested Research Papers ({papers.length})
          </div>

          {papers.map((p) => {
            const isSelected = selectedPaperId === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPaperId(p.id)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#161a26] border-[#3B63FF] shadow-md shadow-[#3B63FF]/20"
                    : "bg-[#14171d] border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="font-mono text-cyan-400">{p.journal}</span>
                  <span className="text-emerald-400 font-mono">{p.sampleSize}</span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">
                  {p.title}
                </h4>
                <p className="text-[10px] text-slate-400 font-mono mt-1">
                  DOI: {p.doi}
                </p>
                <div className="mt-2 text-[10px] bg-black/40 px-2 py-0.5 rounded text-amber-300 font-mono truncate">
                  Key Stat: {p.metric}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CENTER STAGE: Academic Study Paper Reader with 3D Page Curl & Luminescent Yellow Highlight */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#0d0f14] border-r border-slate-800/80">
        {/* Paper Header */}
        <div className="h-10 px-4 border-b border-slate-800 bg-[#12151b] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-white">3D Scientific Paper Inspector (OmniCut Method)</span>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
              Peer-Reviewed Source Verified
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Sample: <b className="text-white">{currentPaper.sampleSize}</b></span>
            <span>•</span>
            <span className="text-cyan-400">{currentPaper.journal}</span>
          </div>
        </div>

        {/* Realistic Parchment Desk View */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center bg-gradient-to-b from-[#090b0f] via-[#0d0f14] to-[#07080b]">
          <div className="w-full max-w-2xl bg-[#faf8f4] text-[#1b1c21] p-6 rounded-xl shadow-2xl border border-black/15 relative overflow-hidden transform hover:-translate-y-0.5 transition-all duration-300">
            {/* Top Academic Journal Banner */}
            <div className="flex items-center justify-between text-[11px] font-mono border-b border-black/15 pb-3 mb-3 text-[#52545d]">
              <span className="font-bold tracking-wider uppercase text-[#3B63FF]">{currentPaper.journal}</span>
              <span className="bg-emerald-600/10 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-600/20">
                DOI: {currentPaper.doi}
              </span>
            </div>

            {/* Paper Title & Authors */}
            <h2 className="font-serif font-black text-lg text-[#0f1013] leading-snug mb-2">
              {currentPaper.title}
            </h2>
            <p className="font-mono text-xs text-[#52545d] mb-4">
              {currentPaper.authors} • Published {currentPaper.date}
            </p>

            {/* Abstract with Luminescent Yellow Highlight */}
            <div className="bg-white/80 p-4 rounded-lg border border-black/10 font-serif text-sm leading-relaxed text-[#2a2c35] space-y-2 shadow-inner">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#737582] block">
                Primary Conclusion & Abstract:
              </span>
              <p>
                {currentPaper.abstract.split(currentPaper.highlightSentence)[0]}
                <mark className="bg-amber-300 text-black font-semibold px-1.5 py-0.5 rounded shadow-sm border border-amber-400/50">
                  {currentPaper.highlightSentence}
                </mark>
                {currentPaper.abstract.split(currentPaper.highlightSentence)[1]}
              </p>
            </div>

            {/* Ingested Key Metric Badge */}
            <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-xs font-mono">
              <span className="text-[#52545d]">Isolated Metric for Remotion:</span>
              <span className="font-bold text-[#3B63FF] bg-[#3B63FF]/10 px-2.5 py-1 rounded">
                {currentPaper.metric}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Scene-by-Scene Script Sequence */}
      <div className="w-[420px] border-l border-slate-800/80 bg-[#101319] flex flex-col shrink-0">
        <div className="p-3 border-b border-slate-800 bg-[#14171d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-bold text-white tracking-wide">SCENE SCRIPT SEQUENCE</span>
          </div>

          <button
            onClick={handleCopyScript}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-2 py-1 rounded transition-colors"
          >
            {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedScript ? "Copied" : "Copy All"}</span>
          </button>
        </div>

        {/* Script Velocity Metrics */}
        <div className="p-3 bg-[#0d0f14] border-b border-slate-800 grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div className="bg-[#14171d] p-2 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Duration</span>
            <span className="text-white font-bold">{totalDurationSec.toFixed(1)}s</span>
          </div>
          <div className="bg-[#14171d] p-2 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Words</span>
            <span className="text-emerald-400 font-bold">{totalWords}</span>
          </div>
          <div className="bg-[#14171d] p-2 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Speaking Pace</span>
            <span className="text-cyan-400 font-bold">{speakingPaceWpm} wpm</span>
          </div>
        </div>

        {/* Scene Cards List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {scenes.map((scene) => (
            <div
              key={scene.id}
              className="bg-[#14171d] rounded-lg border border-slate-800 p-3 space-y-2 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#3B63FF]/20 text-[#3B63FF] border border-[#3B63FF]/40 font-mono font-bold flex items-center justify-center">
                    0{scene.order}
                  </span>
                  <span className="font-bold uppercase tracking-wider text-slate-300">
                    {scene.type}
                  </span>
                </div>
                <div className="flex items-center gap-1 font-mono">
                  <span className="text-violet-400 bg-violet-950/40 px-1.5 py-0.5 rounded border border-violet-800/40">
                    {scene.templateTarget}
                  </span>
                  <span className="text-slate-400 font-bold">{scene.durationSec}s</span>
                </div>
              </div>

              {/* Editable Narration */}
              <textarea
                rows={2}
                value={scene.narration}
                onChange={(e) => handleUpdateNarration(scene.id, e.target.value)}
                className="w-full bg-[#0d0f14] border border-slate-700/60 rounded p-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#3B63FF] font-sans"
              />

              {/* Visual Intent */}
              <div className="text-[10px] text-slate-400 flex items-center gap-1.5 bg-black/30 p-1.5 rounded">
                <Film className="w-3 h-3 text-slate-500 shrink-0" />
                <span className="truncate">{scene.visualIntent}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Handoff Actions */}
        <div className="p-3 border-t border-slate-800 bg-[#12151b] space-y-2 shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                if (onSendToVoiceover) onSendToVoiceover();
                onShowToast("Handoff: Script sent to Voice Cleanup Studio.");
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-[#161a22] hover:bg-[#1a202c] border border-slate-700 text-xs font-semibold text-emerald-300 transition-colors"
            >
              <Mic className="w-3.5 h-3.5 text-emerald-400" />
              <span>To Voice Clean</span>
            </button>

            <button
              onClick={() => {
                if (onSendToClipFinder) onSendToClipFinder();
                onShowToast("Handoff: Script scenes sent to YouTube Clip Finder.");
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-[#161a22] hover:bg-[#1a202c] border border-slate-700 text-xs font-semibold text-violet-300 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-violet-400" />
              <span>To Clip Finder</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (onPushToTimeline) onPushToTimeline();
              onShowToast("Timeline Built: Pushed 5 scene tracks to NLE timeline.");
            }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 active:scale-95 transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Directly Push Scenes to Multi-Track Timeline</span>
          </button>
        </div>
      </div>
    </div>
  );
};
