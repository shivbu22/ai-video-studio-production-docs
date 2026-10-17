"use client";

import React from "react";
import { Bot, Check, X, ArrowRight, ShieldCheck, History } from "lucide-react";

export interface TimelineProposal {
  id: string;
  agentId: string;
  summary: string;
  createdAt: string;
  changes: {
    trackId: string;
    action: "insert" | "replace" | "trim" | "delete";
    description: string;
    before?: string;
    after?: string;
  }[];
}

interface ProposalReviewProps {
  proposals: TimelineProposal[];
  onApprove: (proposalId: string) => void;
  onReject: (proposalId: string) => void;
}

export const ProposalReview: React.FC<ProposalReviewProps> = ({
  proposals,
  onApprove,
  onReject,
}) => {
  return (
    <div className="flex flex-col h-full bg-studio-900 select-none text-xs">
      {/* Header */}
      <div className="p-3 border-b border-studio-800 bg-studio-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-violet-400" />
          <span className="font-semibold text-slate-100">MCP Agent Proposals</span>
        </div>
        <span className="text-[10px] bg-violet-600/20 text-violet-300 font-medium px-2 py-0.5 rounded border border-violet-500/30">
          Clean-Room Proposal Review
        </span>
      </div>

      {/* Proposals List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {proposals.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center text-slate-500 gap-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400/50" />
            <p className="text-xs">No pending AI proposals</p>
            <span className="text-[10px]">MCP server listening on /v1/mcp</span>
          </div>
        ) : (
          proposals.map((p) => (
            <div
              key={p.id}
              className="p-3 bg-studio-850 rounded-lg border border-studio-700/80 shadow-md space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 text-[11px]">{p.summary}</span>
                <span className="text-[10px] font-mono text-slate-400">{p.agentId}</span>
              </div>

              {/* Changes Diff */}
              <div className="space-y-1.5 bg-studio-950 p-2 rounded border border-studio-800 text-[11px]">
                {p.changes.map((c, idx) => (
                  <div key={idx} className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-bold text-violet-400">
                      [{c.trackId}] {c.action}
                    </span>
                    <span className="text-slate-300">{c.description}</span>
                    {c.before && c.after && (
                      <div className="flex items-center gap-2 text-[10px] mt-1 font-mono">
                        <span className="text-rose-400 line-through">{c.before}</span>
                        <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
                        <span className="text-emerald-400 font-bold">{c.after}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => onReject(p.id)}
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-studio-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-studio-700 hover:border-rose-800/40 transition-colors"
                >
                  <X className="w-3 h-3" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => onApprove(p.id)}
                  className="flex items-center gap-1 text-[11px] px-3 py-1 rounded bg-violet-600 hover:bg-violet-500 text-white font-medium shadow-sm transition-all"
                >
                  <Check className="w-3 h-3" />
                  <span>Approve & Apply</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
