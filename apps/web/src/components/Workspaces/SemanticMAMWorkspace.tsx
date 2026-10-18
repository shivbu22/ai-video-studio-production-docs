"use client";

import React, { useState, useEffect } from "react";
import { Search, Database, Sparkles, Plus, Film, CheckCircle2, Play, RefreshCw, Cpu, Layers } from "lucide-react";
import { SemanticSearchResult } from "../../app/api/mam/search/route";

interface SemanticMAMWorkspaceProps {
  onClose?: () => void;
  onApplyClipToTimeline?: (clip: { title: string; durationMs: number; resolution: string }) => void;
  onShowToast?: (msg: string) => void;
}

export const SemanticMAMWorkspace: React.FC<SemanticMAMWorkspaceProps> = ({
  onClose,
  onApplyClipToTimeline,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState("Quantum Qubit Hardware");
  const [activeFilter, setActiveFilter] = useState<"all" | "4k" | "8k" | "robotics" | "gym">("all");
  const [results, setResults] = useState<SemanticSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLatency, setSearchLatency] = useState(34.2);
  const [insertedIds, setInsertedIds] = useState<string[]>([]);
  const [relinkedRaw, setRelinkedRaw] = useState<Record<string, boolean>>({});

  const executeSearch = async (queryText: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/mam/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText, threshold: 0.5, maxResults: 10 }),
      });
      const data = await res.json();
      if (data.success) {
        setResults(data.results || []);
        setSearchLatency(data.searchLatencyMs || 28.5);
      }
    } catch (e) {
      console.error("MAM Search failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch(searchQuery);
  }, []);

  const handleInsert = (item: SemanticSearchResult) => {
    setInsertedIds((prev) => [...prev, item.id]);
    if (onApplyClipToTimeline) {
      onApplyClipToTimeline({
        title: item.title,
        durationMs: item.durationMs,
        resolution: relinkedRaw[item.id] ? "8K RAW" : item.resolution,
      });
    }
    if (onShowToast) {
      onShowToast(`Added "${item.title}" to Timeline Track V2!`);
    }
  };

  const toggleRawRelink = (id: string) => {
    setRelinkedRaw((prev) => ({ ...prev, [id]: !prev[id] }));
    if (onShowToast) {
      onShowToast(relinkedRaw[id] ? "Switched to 540p fast proxy" : "Relinked to 8K Apple ProRes 4444 RAW!");
    }
  };

  const quickPrompts = [
    "Quantum Superconducting Qubit",
    "Autonomous AI Robotics Arm",
    "Neon Cyberpunk Metropolis Drone",
    "Liquid-Cooled GPU Datacenter",
    "Heavy Deadlift Biomechanics",
  ];

  return (
    <div
      id="semantic-mam-workspace"
      className="flex flex-col h-full bg-[#090b10] text-slate-200 border-t border-slate-800 select-none overflow-hidden"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#10131c] border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wide uppercase text-white flex items-center gap-2">
              Cloud MAM & Semantic Vector Search
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                SigLIP Multi-Modal Index
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Natural language visual search across 100,000+ indexed 4K/8K B-roll and RAW studio rushes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
            <span className="text-slate-400">Vector Index Latency:</span>
            <span className="text-emerald-400 font-semibold">{searchLatency} ms</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Matched Assets:</span>
            <span className="text-cyan-300 font-semibold">{results.length}</span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition"
              title="Close Workspace"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Search & Filter Sidebar */}
        <div className="w-80 bg-[#0d1017] border-r border-slate-800/80 p-5 flex flex-col gap-5 overflow-y-auto">
          {/* Query Input */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Semantic Search Query
            </label>
            <div className="relative">
              <input
                id="input-mam-query"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") executeSearch(searchQuery);
                }}
                placeholder="Describe scene in plain English..."
                className="w-full bg-[#141824] border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
              />
              <button
                id="btn-mam-search"
                onClick={() => executeSearch(searchQuery)}
                className="absolute right-2 top-2 p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded transition"
                title="Search Index"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Natural Language Prompts */}
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Suggested Semantic Prompts
            </span>
            <div className="flex flex-col gap-1.5">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  id={`btn-prompt-${idx}`}
                  onClick={() => {
                    setSearchQuery(p);
                    executeSearch(p);
                  }}
                  className="text-left text-xs px-2.5 py-1.5 rounded bg-[#131722] hover:bg-[#1b2234] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition truncate"
                >
                  "{p}"
                </button>
              ))}
            </div>
          </div>

          {/* Resolution & Asset Type Filter */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Filter by Asset Class
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  { id: "all", label: "All Assets" },
                  { id: "4k", label: "4K UHD Only" },
                  { id: "8k", label: "8K ProRes RAW" },
                  { id: "robotics", label: "Robotics/Tech" },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded border transition ${
                    activeFilter === f.id
                      ? "bg-emerald-950 text-emerald-300 border-emerald-600"
                      : "bg-[#141824] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Index Telemetry Card */}
          <div className="bg-[#121622] p-3 rounded-lg border border-slate-800/80 text-xs text-slate-400 font-mono">
            <div className="text-slate-300 font-bold mb-1 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              SigLIP SO400M Vector DB
            </div>
            <div className="flex justify-between py-0.5">
              <span>Embedding Dims:</span>
              <span className="text-cyan-300">1152-d FP16</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>Indexed Vectors:</span>
              <span className="text-cyan-300">128,450 clips</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>Vector Distance:</span>
              <span className="text-emerald-400">Cosine Similarity</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>Proxy Engine:</span>
              <span className="text-amber-400">540p ProRes Proxy</span>
            </div>
          </div>
        </div>

        {/* Center / Right Results Grid */}
        <div className="flex-1 bg-[#07080d] p-6 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
              <p className="text-sm font-medium">Embedding query & calculating cosine distances...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <Database className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">No semantic assets matched your query threshold.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((clip) => {
                const isInserted = insertedIds.includes(clip.id);
                const isRaw = relinkedRaw[clip.id];

                return (
                  <div
                    key={clip.id}
                    className="bg-[#10141f] border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition flex flex-col group shadow-lg"
                  >
                    {/* Thumbnail & Badges */}
                    <div className="relative aspect-video bg-black overflow-hidden">
                      <img
                        src={clip.thumbnailUrl}
                        alt={clip.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/90 text-black font-mono shadow">
                          {(clip.relevanceScore * 100).toFixed(1)}% MATCH
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-black/60 backdrop-blur text-slate-300 border border-slate-700">
                          {isRaw ? "8K RAW" : clip.resolution}
                        </span>
                      </div>

                      {/* Duration Badge */}
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 text-[10px] font-mono bg-black/80 text-white rounded">
                        {(clip.durationMs / 1000).toFixed(1)}s
                      </div>
                    </div>

                    {/* Metadata Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                      <div>
                        <h3 className="text-xs font-bold text-white group-hover:text-emerald-400 transition line-clamp-1">
                          {clip.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                          {clip.description}
                        </p>
                      </div>

                      {/* Tag Chips */}
                      <div className="flex flex-wrap gap-1">
                        {clip.tags.slice(0, 4).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-1.5 py-0.5 text-[9px] font-mono bg-slate-900 text-slate-400 rounded border border-slate-800"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Proxy / RAW Relinking Toggle */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                        <button
                          onClick={() => toggleRawRelink(clip.id)}
                          className={`font-mono text-[10px] px-2 py-0.5 rounded transition ${
                            isRaw
                              ? "bg-purple-950 text-purple-300 border border-purple-700"
                              : "bg-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          {isRaw ? "● 8K RAW Relinked" : "○ 540p Proxy"}
                        </button>

                        <button
                          id={`btn-insert-mam-${clip.id}`}
                          onClick={() => handleInsert(clip)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                            isInserted
                              ? "bg-emerald-600/30 text-emerald-400 border border-emerald-500/50"
                              : "bg-emerald-600 hover:bg-emerald-500 text-white"
                          }`}
                        >
                          {isInserted ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>To Timeline</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
