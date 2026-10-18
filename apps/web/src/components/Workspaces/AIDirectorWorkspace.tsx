"use client";

import React, { useState } from "react";
import { 
  Bot, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Check, 
  X, 
  ArrowRight, 
  Film, 
  Wand2, 
  Layers, 
  Zap, 
  CheckCircle2, 
  Search,
  Flame,
  Clock
} from "lucide-react";
import { TimelineProposal } from "../LeftPanel/ProposalReview";

interface AIDirectorWorkspaceProps {
  proposals: TimelineProposal[];
  onApproveProposal: (proposalId: string) => void;
  onRejectProposal: (proposalId: string) => void;
  onExecuteCommand: (prompt: string) => void;
  onShowToast: (msg: string) => void;
  onOpenStoryboard?: () => void;
  onApplySwarmEdits?: () => void;
}

export const AIDirectorWorkspace: React.FC<AIDirectorWorkspaceProps> = ({
  proposals,
  onApproveProposal,
  onRejectProposal,
  onExecuteCommand,
  onShowToast,
  onOpenStoryboard,
  onApplySwarmEdits,
}) => {
  const [selectedProposalId, setSelectedProposalId] = useState<string>(proposals[0]?.id || "");
  const [refinePrompt, setRefinePrompt] = useState("");
  const [isDebating, setIsDebating] = useState(false);
  const [debateRounds, setDebateRounds] = useState<any[]>([
    {
      agent: "Narrative Architect",
      color: "border-purple-500/50 bg-purple-500/10 text-purple-200",
      avatarColor: "bg-purple-600",
      message: "Audience drop-off analysis indicates viewers leave at 0:04 without an immediate visual hook. We should front-load the Sycamore 200s speedup counter right at second 1, then compress scene 2 duration from 5.0s to 3.2s.",
    },
    {
      agent: "Visual Director",
      color: "border-cyan-500/50 bg-cyan-500/10 text-cyan-200",
      avatarColor: "bg-cyan-600",
      message: "Agreed on the hook. Let's also swap the generic dilution refrigerator wide shot for the 4K macro qubit optical zoom on track V1. Applying a Moody Teal & Orange LUT (+15% contrast) will give it high-end cinematic pop.",
    },
    {
      agent: "Sound Designer",
      color: "border-emerald-500/50 bg-emerald-500/10 text-emerald-200",
      avatarColor: "bg-emerald-600",
      message: "With the faster pace, the cybernetic horizon music bed needs an exponential -14dB ducking curve right under the word 'supercomputers' to maintain broadcast -14 LUFS dialog clarity.",
    },
    {
      agent: "Executive Producer",
      color: "border-amber-500/50 bg-amber-500/10 text-amber-200",
      avatarColor: "bg-amber-600",
      message: "All proposals comply with the 30s Instagram/TikTok retention curve. Consensus reached (98.4% confidence). Ready to execute atomic timeline patch.",
    },
  ]);

  const activeProposal = proposals.find((p) => p.id === selectedProposalId) || proposals[0];

  const RETENTION_POINTS = [
    { time: "0:00", retention: 100, label: "Hook Start", alert: null },
    { time: "0:02", retention: 96, label: "Google Claim", alert: null },
    { time: "0:04", retention: 84, label: "Sycamore Speed", alert: "Pacing Warning: Visual static >3s" },
    { time: "0:07", retention: 89, label: "Motion FX Pop", alert: null },
    { time: "0:10", retention: 86, label: "10,000y Comparison", alert: null },
    { time: "0:13", retention: 82, label: "CTA Outro", alert: null },
  ];

  const STORYBOARD_SUGGESTIONS = [
    {
      id: "sb1",
      scene: "Scene 1: Hook (0:00 - 0:04)",
      prompt: "Macro 8K cinematic shot of dilution refrigerator cryostat with golden coils and cryogenic vapor",
      assetType: "Diffusion Video (Wan 2.1)",
      status: "Ready",
      seed: 8492048,
    },
    {
      id: "sb2",
      scene: "Scene 2: Core Benchmark (0:04 - 0:09)",
      prompt: "Quantum chip qubit array with glowing coherence pulses and digital interference patterns",
      assetType: "Remotion BarChart (Interactive)",
      status: "Generated",
      seed: 1294821,
    },
    {
      id: "sb3",
      scene: "Scene 3: Outro CTA (0:09 - 0:15)",
      prompt: "Futuristic supercomputer server corridor with blue and amber LED arrays, anamorphic lens flare",
      assetType: "Pexels 4K Licensed B-Roll",
      status: "Ready",
      seed: 9482012,
    },
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-studio-950 select-none font-sans text-xs">
      {/* Left 50%: Retention Heatmap & Script Storyboard Generator */}
      <div className="flex-1 flex flex-col border-r border-studio-800 overflow-y-auto p-5 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-studio-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-100 text-sm">AI Director & Retention Engine</h2>
              <p className="text-[10px] text-slate-400">Autonomous pacing analysis, shot suggestions, and MCP agent proposal review</p>
            </div>
          </div>

          <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full font-mono font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>Predicted Score: 94/100</span>
          </span>
        </div>

        {/* 1. Retention Dropoff Analysis Heatmap */}
        <div className="bg-studio-900 rounded-xl border border-studio-800 p-4 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-slate-200 text-xs uppercase tracking-wider">Audience Retention Curve (Predicted)</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">15.0s Total Duration</span>
          </div>

          {/* Retention Curve Graph */}
          <div className="h-28 bg-studio-950 rounded-lg border border-studio-800 p-3 relative flex items-end justify-between">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-20 text-[8px] text-slate-500 font-mono">
              <div className="border-b border-slate-700 w-full">100%</div>
              <div className="border-b border-slate-700 w-full">85%</div>
              <div className="border-b border-slate-700 w-full">70%</div>
            </div>

            {/* Retention Columns */}
            {RETENTION_POINTS.map((pt, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full z-10 mx-1">
                {pt.alert && (
                  <div className="mb-1 text-[8px] text-amber-400 font-bold flex items-center gap-0.5 bg-amber-500/20 px-1 rounded animate-bounce">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    <span>Drop Risk</span>
                  </div>
                )}
                <div
                  className={`w-full rounded-t transition-all ${
                    pt.alert
                      ? "bg-gradient-to-t from-amber-600 to-amber-400 shadow-md shadow-amber-500/30"
                      : "bg-gradient-to-t from-emerald-600 via-teal-500 to-cyan-400 shadow-md shadow-emerald-500/20"
                  }`}
                  style={{ height: `${(pt.retention - 60) * 2.5}%` }}
                />
                <span className="text-[9px] font-mono text-slate-400 mt-1">{pt.time}</span>
              </div>
            ))}
          </div>

          {/* 1-Click Retention Fix Action */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <span className="font-semibold text-amber-300 block text-[11px]">Pacing Drop Detected at 0:03.5</span>
                <span className="text-[10px] text-slate-400">Static visual for 3.2s. Inserting dynamic B-roll or motion chart boosts retention +14%.</span>
              </div>
            </div>
            <button
              onClick={() => {
                onExecuteCommand("Insert dynamic zoom and punchy B-roll at 0:03.5 to boost audience retention");
                onShowToast("Auto-Director: Cut visual at 0:03.5 and inserted B-Roll punch-in.");
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition-all active:scale-95 flex-shrink-0"
            >
              Auto-Fix Pacing
            </button>
          </div>
        </div>

        {/* Multi-Agent Autonomous Director Debate Swarm */}
        <div className="bg-studio-900 rounded-xl border border-studio-800 p-4 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-purple-600 flex items-center justify-center text-white shadow-sm">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <span className="font-bold text-slate-200 text-xs uppercase tracking-wider">Multi-Agent Creative Consensus Swarm</span>
                <span className="text-[10px] text-slate-400 font-mono ml-2">4 Agents · Consensus 98.4%</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenStoryboard && (
                <button
                  id="btn-open-storyboard-modal"
                  onClick={onOpenStoryboard}
                  className="px-2.5 py-1 rounded bg-[#202232] hover:bg-[#2c2f44] text-slate-300 hover:text-white border border-[#2e3146] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Film className="w-3 h-3 text-purple-400" />
                  <span>Storyboard Diffuser</span>
                </button>
              )}
              <button
                id="btn-run-director-debate"
                onClick={async () => {
                  setIsDebating(true);
                  try {
                    const res = await fetch("/api/director/debate", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ userIntent: "Optimize for viral retention", projectTitle: "Quantum Supremacy" }),
                    });
                    const data = await res.json();
                    if (data.success && data.debateRounds) {
                      setDebateRounds(data.debateRounds.map((r: any) => ({
                        ...r,
                        color: r.avatarColor.includes("purple") ? "border-purple-500/50 bg-purple-500/10 text-purple-200" :
                               r.avatarColor.includes("cyan") ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-200" :
                               r.avatarColor.includes("emerald") ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200" :
                               "border-amber-500/50 bg-amber-500/10 text-amber-200"
                      })));
                      onShowToast("Multi-Agent Debate Swarm Reached 98.4% Consensus!");
                    }
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setIsDebating(false);
                  }
                }}
                disabled={isDebating}
                className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3" />
                <span>Run Swarm Debate</span>
              </button>
            </div>
          </div>

          {/* 4 Agent Speech Bubbles Grid */}
          <div className="grid grid-cols-2 gap-3">
            {debateRounds.map((round: any, i: number) => (
              <div key={i} className={`p-3 rounded-lg border ${round.color} space-y-1.5`}>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${round.avatarColor} text-white flex items-center justify-center text-[9px] font-bold shadow-sm`}>
                    {round.agent[0]}
                  </div>
                  <span className="text-[11px] font-bold text-white">{round.agent}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300 font-sans">
                  {round.message}
                </p>
              </div>
            ))}
          </div>

          {/* Atomic Execution Action Banner */}
          <div className="p-3 rounded-lg bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/40 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Autonomous Pacing & B-Roll Re-Cut Package</span>
              <span className="text-[10px] text-slate-400">Trims Scene 2 to 3.2s, swaps B-roll to 4K Macro Qubit, sets -14dB audio ducking.</span>
            </div>

            <button
              id="btn-execute-director-swarm"
              onClick={() => {
                if (onApplySwarmEdits) onApplySwarmEdits();
                onShowToast("Executed Multi-Agent Timeline Re-Cut Package!");
              }}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg shadow-lg flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Execute Multi-Agent Timeline Re-Cut</span>
            </button>
          </div>
        </div>

        {/* 2. Visual Storyboard & AI Prompt Suggestions */}
        <div className="bg-studio-900 rounded-xl border border-studio-800 p-4 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-violet-400" />
              <span className="font-bold text-slate-200 text-xs uppercase tracking-wider">Matched Storyboard Assets</span>
            </div>
            <span className="text-[10px] text-violet-400 font-mono">3 / 3 Scenes Sourced</span>
          </div>

          <div className="space-y-2.5">
            {STORYBOARD_SUGGESTIONS.map((sb) => (
              <div key={sb.id} className="bg-studio-950 p-3 rounded-lg border border-studio-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 text-[11px]">{sb.scene}</span>
                  <span className="text-[9px] bg-studio-900 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded font-mono">
                    {sb.assetType}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 italic">"{sb.prompt}"</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[9px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{sb.status}</span>
                  </span>
                  <button
                    onClick={() => {
                      onExecuteCommand(`Regenerate visual for ${sb.scene}`);
                      onShowToast(`Dispatched diffusion generation for ${sb.scene}`);
                    }}
                    className="text-[10px] text-violet-400 hover:text-violet-300 font-medium hover:underline"
                  >
                    Regenerate Alternative
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right 50%: Live MCP Agent Proposals Review Queue & Direct Commands */}
      <div className="flex-1 flex flex-col overflow-y-auto p-5 space-y-6 bg-studio-900/60">
        {/* Proposal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-studio-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-violet-500/20 text-violet-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-100 text-sm">MCP Copilot Proposals</h2>
              <p className="text-[10px] text-slate-400">Route B Timeline Proposal Pattern — human review before mutating edits</p>
            </div>
          </div>

          <span className="text-[10px] font-mono text-violet-300 bg-violet-500/10 border border-violet-500/30 px-2 py-0.5 rounded">
            {proposals.length} Pending
          </span>
        </div>

        {/* Proposal Card */}
        {activeProposal ? (
          <div className="bg-studio-950 rounded-xl border border-violet-500/40 p-4 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-violet-600/30 text-violet-300 font-mono px-2 py-0.5 rounded border border-violet-500/40 font-bold">
                  PROPOSAL {activeProposal.id}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Agent: {activeProposal.agentId}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{activeProposal.createdAt}</span>
            </div>

            <div>
              <h3 className="font-bold text-slate-100 text-xs mb-1">{activeProposal.summary}</h3>
              <p className="text-[11px] text-slate-400">
                The agent analyzed viewer retention and identified that replacing the static BarChart with a dynamic side-by-side comparison template increases average watch time by 18%.
              </p>
            </div>

            {/* Changes Diff Table */}
            <div className="bg-studio-900 rounded-lg border border-studio-800 p-3 space-y-2">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Timeline Operations Diff</span>
              {activeProposal.changes.map((change, idx) => (
                <div key={idx} className="space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] bg-studio-800 px-1.5 py-0.5 rounded font-mono text-slate-300">
                      Track: {change.trackId}
                    </span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-semibold uppercase">
                      {change.action}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                    <div className="bg-red-950/40 border border-red-500/30 p-2 rounded text-red-300 line-through">
                      - {change.before}
                    </div>
                    <div className="bg-emerald-950/40 border border-emerald-500/30 p-2 rounded text-emerald-300">
                      + {change.after}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions: Approve / Reject / Refine */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  onApproveProposal(activeProposal.id);
                  onShowToast(`Proposal ${activeProposal.id} approved & applied to timeline!`);
                }}
                className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve & Apply to Timeline</span>
              </button>

              <button
                onClick={() => {
                  onRejectProposal(activeProposal.id);
                  onShowToast(`Proposal ${activeProposal.id} rejected.`);
                }}
                className="px-4 py-2 rounded-lg bg-studio-800 hover:bg-red-600/40 text-slate-300 hover:text-red-200 border border-studio-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-studio-950 rounded-xl border border-studio-800 p-8 text-center text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            <p className="font-semibold text-slate-300">All proposals reviewed</p>
            <p className="text-[10px] text-slate-500 mt-1">No pending draft edits in the proposal queue.</p>
          </div>
        )}

        {/* 1-Click AI Director Magic Chips */}
        <div className="space-y-3">
          <span className="font-bold text-slate-300 text-xs uppercase tracking-wider block">Quick AI Director Macros</span>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Auto-Duck Music Under Speech", prompt: "Apply -12dB sidechain ducking to background music whenever voice is active" },
              { label: "Cut All Pauses > 400ms", prompt: "Detect all silence gaps longer than 400ms and ripple delete across all tracks" },
              { label: "Hormozi Gold Pop Highlights", prompt: "Highlight key benchmark statistics in dynamic gold pop captions" },
              { label: "Apply Moody Teal & Orange", prompt: "Color grade all scenes with 3D LUT Moody Teal & Orange" },
            ].map((macro, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onExecuteCommand(macro.prompt);
                  onShowToast(`AI Director executing: ${macro.label}`);
                }}
                className="p-2.5 rounded-lg bg-studio-950 hover:bg-studio-800 border border-studio-800 hover:border-violet-500/50 text-left transition-all active:scale-95 text-slate-300 flex items-center justify-between"
              >
                <span className="text-[11px] font-medium">{macro.label}</span>
                <Sparkles className="w-3 h-3 text-violet-400 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
