"use client";

import React, { useState } from "react";
import { Play, Sparkles, CheckCircle2, Clock, Terminal, Globe, ArrowRight, RefreshCw, Cpu, Layers, Download } from "lucide-react";
import { AutomationJobResponse } from "../../app/api/automation/pipeline/route";

interface AutomationStudioWorkspaceProps {
  onClose?: () => void;
  onApplyShortToTimeline?: (shortTitle: string) => void;
  onShowToast?: (msg: string) => void;
}

export const AutomationStudioWorkspace: React.FC<AutomationStudioWorkspaceProps> = ({
  onClose,
  onApplyShortToTimeline,
  onShowToast,
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState<"podcast_to_shorts" | "raw_to_proxy" | "global_dub">("podcast_to_shorts");
  const [webhookUrl, setWebhookUrl] = useState<string>("https://api.omnicut.studio/v1/webhooks/shorts-dispatch");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedJob, setCompletedJob] = useState<AutomationJobResponse | null>(null);
  const [importedShorts, setImportedShorts] = useState<string[]>([]);

  const RECIPES = [
    {
      id: "podcast_to_shorts",
      name: "Podcast Longform -> 3x Viral Shorts",
      desc: "Auto-detects high-retention moments, dynamically crops 16:9 to 9:16 on active speaker, and bakes kinetic captions.",
      badge: "Most Popular",
      badgeColor: "bg-purple-950 text-purple-300 border-purple-700",
    },
    {
      id: "raw_to_proxy",
      name: "8K RAW Ingest & 540p ProRes Proxy Suite",
      desc: "Generates fast editing proxies with burned-in timecode, applies Rec.709 base LUT, and links metadata.",
      badge: "Production Studio",
      badgeColor: "bg-blue-950 text-blue-300 border-blue-700",
    },
    {
      id: "global_dub",
      name: "Global Multilingual Dubbing CI/CD Fleet",
      desc: "Translates master voiceover to 5 languages with Wav2Lip viseme alignment and dispatches to localized CDN buckets.",
      badge: "Localization",
      badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-700",
    },
  ] as const;

  const handleRunPipeline = async () => {
    setIsRunning(true);
    try {
      const res = await fetch("/api/automation/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeId: selectedRecipe,
          webhookUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCompletedJob(data);
        if (onShowToast) {
          onShowToast(`Headless Pipeline Completed in ${(data.totalDurationMs / 1000).toFixed(1)}s!`);
        }
      }
    } catch (e) {
      console.error("Pipeline failed", e);
    } finally {
      setIsRunning(false);
    }
  };

  const handleImportToTimeline = (title: string) => {
    setImportedShorts((prev) => [...prev, title]);
    if (onApplyShortToTimeline) {
      onApplyShortToTimeline(title);
    }
    if (onShowToast) {
      onShowToast(`Loaded "${title}" to Timeline Track V1 & C1!`);
    }
  };

  return (
    <div
      id="automation-studio-workspace"
      className="flex flex-col h-full bg-[#080a11] text-slate-200 border-t border-slate-800 select-none overflow-hidden"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#111524] border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wide uppercase text-white flex items-center gap-2">
              Studio Automation Hub & Webhook CI/CD Fleet
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-indigo-950 text-indigo-300 border border-indigo-800 rounded">
                Headless Production Pipeline
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Trigger automated batch editing, transcribing, framing, and multi-platform publishing via HTTP Webhook
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-run-automation-job"
            onClick={handleRunPipeline}
            disabled={isRunning}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
              isRunning
                ? "bg-indigo-900 text-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
            }`}
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Executing Pipeline Stages...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Execute Headless Pipeline</span>
              </>
            )}
          </button>

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

      {/* Main Studio Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: Pipeline Recipes & Webhook Config */}
        <div className="w-88 bg-[#0d101a] border-r border-slate-800/80 p-5 flex flex-col gap-5 overflow-y-auto">
          {/* Recipes Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Automated Studio Recipes
            </label>
            <div className="flex flex-col gap-2.5">
              {RECIPES.map((recipe) => (
                <div
                  key={recipe.id}
                  id={`btn-recipe-${recipe.id}`}
                  onClick={() => setSelectedRecipe(recipe.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex flex-col gap-1.5 ${
                    selectedRecipe === recipe.id
                      ? "bg-indigo-950/70 text-indigo-200 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.25)]"
                      : "bg-[#141825] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{recipe.name}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-mono rounded border ${recipe.badgeColor}`}>
                      {recipe.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{recipe.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Webhook Endpoint Input */}
          <div className="bg-[#121624] p-3.5 rounded-lg border border-slate-800 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              Outbound Webhook Dispatch URL
            </span>
            <input
              id="input-webhook-url"
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full bg-[#161c2d] border border-slate-700 rounded p-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-indigo-500"
            />
            <span className="text-[10px] text-slate-500 font-mono">
              Sends signed HMAC-SHA256 payload when render completes.
            </span>
          </div>

          {/* Webhook JSON Payload Preview */}
          <div className="bg-[#0b0e17] p-3 rounded-lg border border-slate-800 font-mono text-[10px] text-slate-400">
            <div className="text-slate-300 font-bold mb-1 flex items-center gap-1">
              <Terminal className="w-3 h-3 text-purple-400" />
              Trigger Payload Mock (HTTP POST)
            </div>
            <pre className="text-emerald-400 overflow-x-auto no-scrollbar">
{`{
  "event": "studio.render.complete",
  "recipe": "${selectedRecipe}",
  "timestamp": ${Date.now()},
  "status": "ready"
}`}
            </pre>
          </div>
        </div>

        {/* Center / Right Side: Pipeline Execution Stages & Output Artifacts */}
        <div className="flex-1 bg-[#06080e] p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Execution Stages Status Card */}
          <div className="bg-[#0d101a] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                Pipeline Execution Stages
              </div>
              <div className="text-xs font-mono text-slate-400">
                Status:{" "}
                <span className={isRunning ? "text-amber-400 animate-pulse font-semibold" : "text-emerald-400 font-semibold"}>
                  {isRunning ? "PROCESSING CLOUD WORKERS..." : completedJob ? "PIPELINE COMPLETE (200 OK)" : "READY TO RUN"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(completedJob?.stages || [
                { stage: "1. Headless Audio Transcribe & Alignment", status: "completed", latencyMs: 1420 },
                { stage: "2. Active Speaker Computer Vision Framing (9:16)", status: "completed", latencyMs: 2150 },
                { stage: "3. Kinetic Word-by-Word Caption Baking", status: "completed", latencyMs: 1840 },
                { stage: "4. Webhook Dispatch to CDN & Social Queues", status: "completed", latencyMs: 420 },
              ]).map((stg, sIdx) => (
                <div
                  key={sIdx}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#141825] border border-slate-800/80 text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-200">{stg.stage}</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">{stg.latencyMs}ms</span>
                </div>
              ))}
            </div>
          </div>

          {/* Generated Artifacts / Viral Shorts */}
          <div className="flex-1 flex flex-col gap-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Automated Output Deliverables (Viral Shorts)</span>
              <span className="text-[11px] font-mono text-cyan-400">9:16 Vertical Video Formats</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(completedJob?.artifacts || [
                {
                  title: "Viral Short #1: Quantum Transmon Cryostat (9:16 60fps)",
                  format: "MP4 (H.264 / AAC)",
                  resolution: "1080x1920",
                  downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                },
                {
                  title: "Viral Short #2: 10,000x Speedup Explained (9:16 60fps)",
                  format: "MP4 (H.264 / AAC)",
                  resolution: "1080x1920",
                  downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
                },
              ]).map((art, aIdx) => {
                const isImported = importedShorts.includes(art.title);
                return (
                  <div
                    key={aIdx}
                    className="p-4 rounded-xl bg-[#0f131f] border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{art.title}</div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-slate-400">
                        <span className="text-emerald-400 font-semibold">{art.resolution}</span>
                        <span>•</span>
                        <span>{art.format}</span>
                      </div>
                    </div>

                    <button
                      id={`btn-import-short-${aIdx}`}
                      onClick={() => handleImportToTimeline(art.title)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition flex-shrink-0 ${
                        isImported
                          ? "bg-emerald-600/30 text-emerald-400 border border-emerald-500/50"
                          : "bg-indigo-600 hover:bg-indigo-500 text-white"
                      }`}
                    >
                      {isImported ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Imported</span>
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-3.5 h-3.5" />
                          <span>Load to Timeline</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
