"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Wand2, 
  Paintbrush, 
  Eraser, 
  Crosshair, 
  Layers, 
  Sliders, 
  Eye, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  CheckCircle2, 
  ArrowRightLeft, 
  Cpu, 
  Download, 
  Scissors,
  Move,
  RefreshCw,
  Plus
} from "lucide-react";

type VFXToolMode = "inpaint" | "rotoscope" | "track" | "replace";

interface VFXInpaintingWorkspaceProps {
  projectTitle: string;
  currentTimeMs: number;
  onSeek: (ms: number) => void;
  onApplyVFXToTimeline?: (vfxType: string, details: string) => void;
  onShowToast?: (msg: string) => void;
}

export const VFXInpaintingWorkspace: React.FC<VFXInpaintingWorkspaceProps> = ({
  projectTitle,
  currentTimeMs,
  onSeek,
  onApplyVFXToTimeline,
  onShowToast,
}) => {
  const [activeTool, setActiveTool] = useState<VFXToolMode>("inpaint");
  const [brushRadius, setBrushRadius] = useState<number>(32);
  const [brushFeather, setBrushFeather] = useState<number>(8);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [splitPosition, setSplitPosition] = useState<number>(50); // percentage 0-100
  const [showSplitView, setShowSplitView] = useState<boolean>(true);
  const [alphaCheckerboard, setAlphaCheckerboard] = useState<boolean>(false);
  const [temporalConsistency, setTemporalConsistency] = useState<boolean>(true);
  const [replacePrompt, setReplacePrompt] = useState<string>("clean steel panel with ambient cyan reflection");
  const [maskDrawn, setMaskDrawn] = useState<boolean>(true);
  const [hasInpainted, setHasInpainted] = useState<boolean>(false);
  const [trackingActive, setTrackingActive] = useState<boolean>(false);
  const [pinnedTitleText, setPinnedTitleText] = useState<string>("QUANTUM CRYO-CORE [15 mK]");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Render mask on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (maskDrawn && activeTool === "inpaint") {
      // Draw simulated inpaint mask over sample object (e.g. cable / glare at bottom center)
      ctx.fillStyle = "rgba(239, 68, 68, 0.45)"; // Red mask overlay
      ctx.strokeStyle = "rgba(239, 68, 68, 0.85)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(canvas.width * 0.52, canvas.height * 0.62, 55, 30, Math.PI / 12, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    } else if (activeTool === "rotoscope") {
      // SAM-2 segmentation glow contour around center subject
      ctx.strokeStyle = "rgba(6, 182, 212, 0.9)"; // Cyan neon marching ants
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.fillStyle = "rgba(6, 182, 212, 0.2)";
      ctx.beginPath();
      ctx.ellipse(canvas.width * 0.5, canvas.height * 0.48, 120, 150, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [maskDrawn, activeTool]);

  const handleRunInpaint = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/vfx/inpaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clipId: "c_v1_1",
          action: activeTool === "rotoscope" ? "rotoscope" : "inpaint",
          timestampMs: currentTimeMs,
          prompt: replacePrompt,
          temporalConsistency,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setHasInpainted(true);
        if (onShowToast) {
          onShowToast(
            activeTool === "rotoscope"
              ? "SAM 2 Alpha Matte Generated (142 contour points, 96.5% confidence)"
              : "Generative Object Removed! Clean Plate Rendered (PSNR: 38.4 dB)"
          );
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRunTracking = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/vfx/inpaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clipId: "c_v1_1",
          action: "track",
          timestampMs: currentTimeMs,
          trackingPoint: { x: 50, y: 48 },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTrackingActive(true);
        if (onShowToast) {
          onShowToast("Optical Flow 2D Motion Path Baked! Pinned Title Anchored.");
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyToTimeline = () => {
    if (onApplyVFXToTimeline) {
      onApplyVFXToTimeline(
        activeTool.toUpperCase(),
        activeTool === "track" ? `Pinned Title: ${pinnedTitleText}` : "AI Clean Plate Pass"
      );
    }
    if (onShowToast) {
      onShowToast(`Applied ${activeTool.toUpperCase()} FX Layer to Timeline Track V2!`);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0c0d11] text-slate-200 select-none font-sans">
      {/* Left VFX Tool Sidebar */}
      <div className="w-80 bg-[#101117] border-r border-[#1e2029] flex flex-col shrink-0">
        <div className="p-3 border-b border-[#1e2029] bg-[#14151e] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#3B63FF] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white tracking-wide">VFX & Inpaint Studio</h2>
              <p className="text-[10px] text-slate-400 font-mono">SAM 2 & Temporal Diffusion</p>
            </div>
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            WebGPU Accel
          </span>
        </div>

        {/* Tool Mode Tabs */}
        <div className="p-2 border-b border-[#1e2029] grid grid-cols-2 gap-1.5 bg-[#0e0f14]">
          <button
            onClick={() => setActiveTool("inpaint")}
            className={`flex items-center gap-2 px-2.5 py-2 rounded text-xs font-medium transition-all ${
              activeTool === "inpaint"
                ? "bg-[#3B63FF] text-white shadow-sm"
                : "bg-[#161720] text-slate-300 hover:bg-[#1c1d29]"
            }`}
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Object Removal</span>
          </button>

          <button
            onClick={() => setActiveTool("rotoscope")}
            className={`flex items-center gap-2 px-2.5 py-2 rounded text-xs font-medium transition-all ${
              activeTool === "rotoscope"
                ? "bg-[#3B63FF] text-white shadow-sm"
                : "bg-[#161720] text-slate-300 hover:bg-[#1c1d29]"
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>SAM 2 Roto</span>
          </button>

          <button
            onClick={() => setActiveTool("track")}
            className={`flex items-center gap-2 px-2.5 py-2 rounded text-xs font-medium transition-all ${
              activeTool === "track"
                ? "bg-[#3B63FF] text-white shadow-sm"
                : "bg-[#161720] text-slate-300 hover:bg-[#1c1d29]"
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Motion Track</span>
          </button>

          <button
            onClick={() => setActiveTool("replace")}
            className={`flex items-center gap-2 px-2.5 py-2 rounded text-xs font-medium transition-all ${
              activeTool === "replace"
                ? "bg-[#3B63FF] text-white shadow-sm"
                : "bg-[#161720] text-slate-300 hover:bg-[#1c1d29]"
            }`}
          >
            <Paintbrush className="w-3.5 h-3.5" />
            <span>Gen Replace</span>
          </button>
        </div>

        {/* Dynamic Tool Controls */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
          {activeTool === "inpaint" && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Brush Radius</span>
                  <span className="font-mono text-cyan-300">{brushRadius}px</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="80"
                  value={brushRadius}
                  onChange={(e) => setBrushRadius(Number(e.target.value))}
                  className="w-full accent-[#3B63FF] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Edge Feathering</span>
                  <span className="font-mono text-cyan-300">{brushFeather}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={brushFeather}
                  onChange={(e) => setBrushFeather(Number(e.target.value))}
                  className="w-full accent-[#3B63FF] cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-[#1e2029] flex items-center justify-between">
                <span className="text-[11px] text-slate-300">Temporal Smoothing</span>
                <input
                  type="checkbox"
                  checked={temporalConsistency}
                  onChange={(e) => setTemporalConsistency(e.target.checked)}
                  className="accent-[#3B63FF] cursor-pointer"
                />
              </div>

              <div className="p-2.5 rounded bg-[#151620] border border-[#232532] space-y-1 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-200">Auto-Detect Hazards:</span>
                <div className="flex gap-1.5 flex-wrap pt-1">
                  <button 
                    onClick={() => { setMaskDrawn(true); if (onShowToast) onShowToast("Detected Mic Wire & Glare!"); }}
                    className="px-2 py-0.5 rounded bg-[#202230] text-[10px] text-slate-300 hover:text-white"
                  >
                    Mic Wire
                  </button>
                  <button 
                    onClick={() => { setMaskDrawn(true); if (onShowToast) onShowToast("Detected Sensor Dust Spot!"); }}
                    className="px-2 py-0.5 rounded bg-[#202230] text-[10px] text-slate-300 hover:text-white"
                  >
                    Sensor Dust
                  </button>
                  <button 
                    onClick={() => { setMaskDrawn(true); if (onShowToast) onShowToast("Detected Unwanted Logo!"); }}
                    className="px-2 py-0.5 rounded bg-[#202230] text-[10px] text-slate-300 hover:text-white"
                  >
                    Logo Stamp
                  </button>
                </div>
              </div>

              <button
                id="btn-run-inpaint"
                onClick={handleRunInpaint}
                disabled={isProcessing}
                className="w-full py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isProcessing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Eraser className="w-3.5 h-3.5" />
                )}
                <span>Remove Object & Clean Plate</span>
              </button>
            </div>
          )}

          {activeTool === "rotoscope" && (
            <div className="space-y-3">
              <div className="p-2.5 rounded bg-[#0a1826] border border-cyan-500/30 text-[11px] text-cyan-200 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Segment Anything 2 (SAM 2)</span>
                </span>
                <p className="text-[10px] text-cyan-300/80">
                  Click subject in monitor to drop positive/negative anchor prompt points.
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>Checkerboard Alpha View</span>
                <input
                  type="checkbox"
                  checked={alphaCheckerboard}
                  onChange={(e) => setAlphaCheckerboard(e.target.checked)}
                  className="accent-[#3B63FF] cursor-pointer"
                />
              </div>

              <button
                onClick={handleRunInpaint}
                disabled={isProcessing}
                className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Extract Alpha Cutout Mask</span>
              </button>
            </div>
          )}

          {activeTool === "track" && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-300 font-medium">Anchored Title Text</label>
                <input
                  type="text"
                  value={pinnedTitleText}
                  onChange={(e) => setPinnedTitleText(e.target.value)}
                  className="w-full bg-[#161720] border border-[#232532] rounded px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-[#3B63FF]"
                />
              </div>

              <div className="p-2.5 rounded bg-[#161722] border border-[#252838] space-y-1 text-[11px] text-slate-300">
                <span className="font-semibold text-white">Algorithm: Lucas-Kanade 2D</span>
                <p className="text-[10px] text-slate-400">Search window: 31x31 px · 4 pyramid levels · Sub-pixel bilinear</p>
              </div>

              <button
                id="btn-run-track"
                onClick={handleRunTracking}
                disabled={isProcessing}
                className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Bake Motion Path & Anchor Title</span>
              </button>
            </div>
          )}

          {activeTool === "replace" && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-300 font-medium">Generative Prompt</label>
                <textarea
                  value={replacePrompt}
                  onChange={(e) => setReplacePrompt(e.target.value)}
                  rows={3}
                  className="w-full bg-[#161720] border border-[#232532] rounded p-2 text-white text-xs focus:outline-none focus:border-[#3B63FF] resize-none"
                  placeholder="Describe generative fill replacement..."
                />
              </div>

              <button
                onClick={handleRunInpaint}
                disabled={isProcessing}
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Inpaint Fill</span>
              </button>
            </div>
          )}

          {/* Model Metrics Card */}
          <div className="pt-2 border-t border-[#1e2029] space-y-1.5 font-mono text-[10px] text-slate-400">
            <div className="flex justify-between">
              <span>Model Runtime:</span>
              <span className="text-emerald-400">ONNX WebGPU (f16)</span>
            </div>
            <div className="flex justify-between">
              <span>Latency:</span>
              <span className="text-cyan-300">14.8 ms / frame</span>
            </div>
            <div className="flex justify-between">
              <span>PSNR Quality:</span>
              <span className="text-slate-200">38.4 dB</span>
            </div>
          </div>
        </div>

        {/* Bottom Apply Action */}
        <div className="p-3 border-t border-[#1e2029] bg-[#12131b]">
          <button
            id="btn-apply-vfx-timeline"
            onClick={handleApplyToTimeline}
            className="w-full py-2.5 bg-[#3B63FF] hover:bg-[#4d73ff] text-white rounded font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Apply to Timeline (Track V2)</span>
          </button>
        </div>
      </div>

      {/* Center VFX Monitor & Interactive Canvas */}
      <div className="flex-1 flex flex-col bg-[#08090c] overflow-hidden">
        {/* Top Control Toolbar */}
        <div className="h-9 px-4 bg-[#101117] border-b border-[#1e2029] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">CLIP: Scene 1 (4K Dilution Refrigerator)</span>
            <span className="text-cyan-400">3840 x 2160 · 30.00 fps</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSplitView(!showSplitView)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] transition-colors ${
                showSplitView
                  ? "bg-[#3B63FF]/20 border-[#3B63FF]/50 text-white"
                  : "bg-[#161720] border-[#252834] text-slate-400"
              }`}
            >
              <ArrowRightLeft className="w-3 h-3 text-[#3B63FF]" />
              <span>A/B Split View</span>
            </button>

            <button
              onClick={() => setMaskDrawn(!maskDrawn)}
              className="flex items-center gap-1 px-2 py-1 rounded bg-[#161720] border border-[#252834] text-[11px] text-slate-300 hover:text-white"
            >
              <Eye className="w-3 h-3" />
              <span>{maskDrawn ? "Hide Mask" : "Show Mask"}</span>
            </button>
          </div>
        </div>

        {/* Main Canvas Viewport */}
        <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden bg-[radial-gradient(#151722_1px,transparent_1px)] [background-size:16px_16px]">
          {/* 16:9 Cinema Container */}
          <div 
            className="relative w-full max-w-4xl aspect-video rounded-lg overflow-hidden border border-[#252836] shadow-2xl bg-black select-none"
            style={{
              backgroundImage: alphaCheckerboard
                ? "linear-gradient(45deg, #181924 25%, transparent 25%), linear-gradient(-45deg, #181924 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #181924 75%), linear-gradient(-45deg, transparent 75%, #181924 75%)"
                : undefined,
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px"
            }}
          >
            {/* Base Video Frame Simulation */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
              {/* Graphic Representation of Quantum Cryostat */}
              <div className="relative w-72 h-80 flex flex-col items-center justify-center">
                <div className="w-48 h-3 bg-gradient-to-r from-amber-500 via-yellow-200 to-amber-600 rounded-sm shadow-lg mb-1" />
                <div className="w-36 h-2 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 rounded-sm mb-2" />
                <div className="w-28 h-24 bg-gradient-to-b from-amber-700/60 to-blue-900/60 border border-amber-400/30 rounded-lg flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                  <div className="w-16 h-16 rounded-full border-2 border-cyan-400/80 animate-pulse flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
                  </div>
                </div>
                <div className="w-20 h-16 bg-gradient-to-b from-blue-900/60 to-slate-950 rounded-b-lg border-b border-cyan-500/40" />

                {/* Simulated Wire/Glare (Inpaint Target) */}
                {!hasInpainted && (
                  <div className="absolute bottom-6 right-10 w-24 h-6 border-b-2 border-dashed border-red-500/70 rotate-12 flex items-center justify-center">
                    <span className="text-[9px] font-mono text-red-400 -translate-y-3">
                      [HAZARD WIRE]
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Split Comparison Slider Overlay */}
            {showSplitView && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ clipPath: `inset(0 0 0 ${splitPosition}%)` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#0c101b] via-[#091122] to-[#040813] flex items-center justify-center">
                  {/* Clean Plate Inpainted Render */}
                  <div className="relative w-72 h-80 flex flex-col items-center justify-center opacity-95">
                    <div className="w-48 h-3 bg-gradient-to-r from-amber-500 via-yellow-200 to-amber-600 rounded-sm shadow-lg mb-1" />
                    <div className="w-36 h-2 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 rounded-sm mb-2" />
                    <div className="w-28 h-24 bg-gradient-to-b from-amber-700/60 to-blue-900/60 border border-amber-400/30 rounded-lg flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border-2 border-cyan-400/80 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-cyan-400" />
                      </div>
                    </div>
                    <div className="w-20 h-16 bg-gradient-to-b from-blue-900/60 to-slate-950 rounded-b-lg" />
                    {/* Notice wire is completely absent! */}
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Mask Canvas Overlay */}
            <canvas
              ref={canvasRef}
              width={800}
              height={450}
              className="absolute inset-0 w-full h-full pointer-events-auto cursor-crosshair"
            />

            {/* Optical Flow Pinned Title Badge */}
            {trackingActive && (
              <div 
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none animate-in zoom-in duration-300"
              >
                <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/80 border border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.4)] backdrop-blur-md">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-xs font-mono font-bold text-cyan-200 tracking-wider">
                    {pinnedTitleText}
                  </span>
                  <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-600/40">
                    L-K Tracked
                  </span>
                  {/* Tracking Crosshair Line */}
                  <div className="absolute -bottom-8 left-1/2 w-0.5 h-8 bg-cyan-400/80 -translate-x-1/2" />
                  <div className="absolute -bottom-9 left-1/2 w-2 h-2 rounded-full bg-cyan-400 -translate-x-1/2 shadow-lg" />
                </div>
              </div>
            )}

            {/* A/B Split Draggable Divider Line */}
            {showSplitView && (
              <div
                style={{ left: `${splitPosition}%` }}
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-40 flex items-center justify-center cursor-ew-resize"
              >
                <div 
                  onMouseDown={(e) => {
                    const moveHandler = (moveEv: MouseEvent) => {
                      const container = e.currentTarget.parentElement?.parentElement;
                      if (!container) return;
                      const rect = container.getBoundingClientRect();
                      const pos = Math.max(0, Math.min(100, ((moveEv.clientX - rect.left) / rect.width) * 100));
                      setSplitPosition(pos);
                    };
                    const upHandler = () => {
                      window.removeEventListener("mousemove", moveHandler);
                      window.removeEventListener("mouseup", upHandler);
                    };
                    window.addEventListener("mousemove", moveHandler);
                    window.addEventListener("mouseup", upHandler);
                  }}
                  className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shadow-2xl -translate-x-0.5 cursor-ew-resize hover:scale-110 transition-transform"
                >
                  <ArrowRightLeft className="w-3 h-3 text-black" />
                </div>
              </div>
            )}

            {/* Split Labels */}
            {showSplitView && (
              <>
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[9px] font-mono text-slate-300 z-30">
                  ORIGINAL 4K (BEFORE)
                </div>
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-[9px] font-mono text-emerald-300 z-30">
                  CLEAN PLATE (INPAINTED)
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom Playback & Frame Scrubber Bar */}
        <div className="h-10 px-4 bg-[#101117] border-t border-[#1e2029] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onSeek(Math.max(0, currentTimeMs - 1000))}
              className="p-1.5 rounded hover:bg-[#1c1d29] text-slate-300"
              title="-1s Step"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => onSeek(currentTimeMs + 1000)}
              className="p-1.5 rounded hover:bg-[#1c1d29] text-slate-300"
              title="+1s Step"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
            <span className="text-cyan-400">
              {((currentTimeMs % 60000) / 1000).toFixed(2)}s / 14.00s
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>SAM 2 Point Prompts: 2 Active</span>
            <span className="text-emerald-400 font-bold">TEMPORAL DRIFT: 0.04% (LOCKED)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
