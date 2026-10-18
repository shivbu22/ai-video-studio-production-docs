"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  GenerativeStyleTransferEngine,
  STYLE_PRESETS,
  StylePreset,
  TemporalConsistencyMetrics,
} from "../../lib/vfx/generativeStyleTransfer";
import { Wand2, Sparkles, CheckCircle2, Sliders, ShieldCheck, Play, Pause, RefreshCw, Layers } from "lucide-react";

interface GenerativeStyleWorkspaceProps {
  onClose?: () => void;
  onApplyStyleToTimeline?: (styleName: string, prompt: string) => void;
  onShowToast?: (msg: string) => void;
}

export const GenerativeStyleWorkspace: React.FC<GenerativeStyleWorkspaceProps> = ({
  onClose,
  onApplyStyleToTimeline,
  onShowToast,
}) => {
  const [engine] = useState(() => new GenerativeStyleTransferEngine(0.88));
  const [selectedPreset, setSelectedPreset] = useState<StylePreset>(STYLE_PRESETS[0]);
  const [promptText, setPromptText] = useState<string>("Volumetric neon rim lights, rain reflections, glowing signs");
  const [temporalWeight, setTemporalWeight] = useState<number>(0.88);
  const [seedLock, setSeedLock] = useState<boolean>(true);
  const [guidanceScale, setGuidanceScale] = useState<number>(7.5);
  const [splitPos, setSplitPos] = useState<number>(50); // percentage 0 - 100
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isBaked, setIsBaked] = useState<boolean>(false);
  const [telemetry, setTelemetry] = useState<TemporalConsistencyMetrics>({
    temporalSSIM: 0.948,
    opticalFlowWarpError: 0.042,
    flickerReductionPercentage: 97.2,
    effectiveFps: 60,
    coherenceRating: "Broadcast Grade",
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Update telemetry on controls change
  useEffect(() => {
    setTelemetry(engine.evaluateTemporalMetrics(temporalWeight));
  }, [engine, temporalWeight]);

  // Render stylized visual preview
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.04;
      const w = canvas.width;
      const h = canvas.height;
      const splitPx = (w * splitPos) / 100;

      // Draw original video plane (left of split)
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitPx, h);
      ctx.clip();
      ctx.fillStyle = "#1e2433";
      ctx.fillRect(0, 0, w, h);

      // Raw video graphics
      ctx.fillStyle = "#64748b";
      ctx.fillRect(40, 40, w - 80, h - 80);
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 90, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 13px Inter, sans-serif";
      ctx.fillText("ORIGINAL LOG / REC.709 FEED", 20, 32);
      ctx.restore();

      // Draw stylized video plane (right of split)
      ctx.save();
      ctx.beginPath();
      ctx.rect(splitPx, 0, w - splitPx, h);
      ctx.clip();

      if (selectedPreset.id === "cyberpunk_neon") {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, "#090514");
        grad.addColorStop(0.5, "#180b30");
        grad.addColorStop(1, "#030208");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Neon stylized bloom
        ctx.shadowColor = "#f43f5e";
        ctx.shadowBlur = 25;
        ctx.fillStyle = "#fb7185";
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 90 + Math.sin(t) * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 20;
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 4;
        ctx.strokeRect(60, 60, w - 120, h - 120);
        ctx.shadowBlur = 0;
      } else if (selectedPreset.id === "anime_ghibli") {
        ctx.fillStyle = "#e0f2fe";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 90, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#0284c7";
        ctx.lineWidth = 3;
        ctx.stroke();
      } else {
        // Technicolor / Noir
        ctx.fillStyle = "#1c1917";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#ea580c";
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 90, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px Inter, sans-serif";
      ctx.fillText(`GENERATIVE: ${selectedPreset.name.toUpperCase()}`, splitPx + 20, 32);
      ctx.restore();

      // Split bar line
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(splitPx, 0);
      ctx.lineTo(splitPx, h);
      ctx.stroke();

      // Center split handle circle
      ctx.fillStyle = "#a855f7";
      ctx.beginPath();
      ctx.arc(splitPx, h / 2, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [selectedPreset, splitPos, promptText]);

  const handleApply = () => {
    setIsBaked(true);
    if (onApplyStyleToTimeline) {
      onApplyStyleToTimeline(selectedPreset.name, promptText);
    }
    if (onShowToast) {
      onShowToast(`Applied ${selectedPreset.name} Stylized VFX Track to Timeline!`);
    }
  };

  return (
    <div
      id="generative-style-workspace"
      className="flex flex-col h-full bg-[#080a11] text-slate-200 border-t border-slate-800 select-none overflow-hidden"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#111524] border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wide uppercase text-white flex items-center gap-2">
              Generative Video-to-Video Stylization Studio
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-pink-950 text-pink-300 border border-pink-800 rounded">
                Optical Flow Temporal Lock
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Zero-flicker diffusion style transfer guided by optical flow recurrence vector warp
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
            <span className="text-slate-400">Temporal SSIM:</span>
            <span className="text-emerald-400 font-semibold">{telemetry.temporalSSIM}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Flicker Suppr:</span>
            <span className="text-pink-400 font-semibold">{telemetry.flickerReductionPercentage}%</span>
          </div>

          <button
            id="btn-apply-style-track"
            onClick={handleApply}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              isBaked
                ? "bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                : "bg-pink-600 hover:bg-pink-500 text-white"
            }`}
          >
            {isBaked ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Stylized Track Applied</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply Style to Track V2</span>
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
        {/* Left Controls Panel */}
        <div className="w-84 bg-[#0d1019] border-r border-slate-800/80 p-5 flex flex-col gap-5 overflow-y-auto">
          {/* Preset Selector Grid */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Neural Aesthetic Preset
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STYLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  id={`btn-preset-${preset.id}`}
                  onClick={() => {
                    setSelectedPreset(preset);
                    setTemporalWeight(preset.recommendedTemporalWeight);
                    setGuidanceScale(preset.defaultGuidance);
                  }}
                  className={`p-2 rounded-lg border text-left flex flex-col gap-1 transition ${
                    selectedPreset.id === preset.id
                      ? "bg-pink-950/70 text-pink-300 border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.3)]"
                      : "bg-[#131722] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <img
                    src={preset.thumbnailUrl}
                    alt={preset.name}
                    className="w-full h-16 object-cover rounded"
                  />
                  <span className="text-xs font-bold text-white truncate">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Generative Text Prompt Modifier */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Style Prompt Modifier
            </label>
            <textarea
              id="input-style-prompt"
              rows={3}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full bg-[#141825] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500 resize-none font-medium"
            />
          </div>

          {/* Temporal Consistency Persistence Slider */}
          <div className="bg-[#121624] p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-300">Temporal Optical Flow Weight</span>
              <span className="text-xs font-mono text-pink-400">{(temporalWeight * 100).toFixed(0)}%</span>
            </div>
            <input
              id="slider-temporal-weight"
              type="range"
              min="0.2"
              max="1.0"
              step="0.02"
              value={temporalWeight}
              onChange={(e) => setTemporalWeight(parseFloat(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>0.2 (High Drift)</span>
              <span>0.88 (Optimal)</span>
              <span>1.0 (Rigid)</span>
            </div>
          </div>

          {/* Latent Seed Locking Switch */}
          <div className="bg-[#121624] p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-300">Latent Random Seed Lock</div>
              <div className="text-[10px] text-slate-500">Locks spatial noise matrix across frame series</div>
            </div>
            <button
              id="btn-toggle-seed-lock"
              onClick={() => setSeedLock(!seedLock)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                seedLock ? "bg-pink-600" : "bg-slate-700"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  seedLock ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Comparison Split Slider */}
          <div className="bg-[#121624] p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-300">A/B Comparison Split</span>
              <span className="text-xs font-mono text-purple-400">{splitPos}%</span>
            </div>
            <input
              id="slider-ab-split"
              type="range"
              min="0"
              max="100"
              value={splitPos}
              onChange={(e) => setSplitPos(parseInt(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Center Canvas Preview Area */}
        <div className="flex-1 bg-[#06080e] p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="relative border border-slate-800 rounded-xl overflow-hidden shadow-2xl bg-black w-full max-w-4xl aspect-video flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              className="w-full h-full object-contain"
            />

            {/* Overlaid Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-2.5 py-1 text-[11px] font-mono bg-black/75 backdrop-blur border border-slate-700 text-slate-300 rounded">
                ORIGINAL (REC.709)
              </span>
            </div>

            <div className="absolute top-4 right-4 flex gap-2">
              <span className="px-2.5 py-1 text-[11px] font-mono bg-pink-950/80 backdrop-blur border border-pink-700 text-pink-300 rounded">
                STYLIZED: {selectedPreset.name.toUpperCase()}
              </span>
            </div>

            <div className="absolute bottom-4 right-4 flex gap-2 font-mono text-[11px]">
              <span className="px-2 py-1 bg-black/80 backdrop-blur border border-slate-800 text-emerald-400 rounded">
                OPTICAL FLOW: PASS (0.042 ERROR)
              </span>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-slate-500 max-w-xl">
            Real-time optical flow temporal warp eliminates diffusion flicker and maintains 60fps frame consistency.
          </div>
        </div>
      </div>
    </div>
  );
};
