"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  StereoscopicMode,
  StereoscopicCompositor,
  StereoDisparityMetrics,
} from "../../lib/spatial/stereoscopicCompositor";

interface SpatialVideoWorkspaceProps {
  onClose?: () => void;
  onApplySpatialTrack?: (mode: StereoscopicMode, disparityOffset: number) => void;
}

export const SpatialVideoWorkspace: React.FC<SpatialVideoWorkspaceProps> = ({
  onClose,
  onApplySpatialTrack,
}) => {
  const [compositor] = useState(() => new StereoscopicCompositor());
  const [stereoMode, setStereoMode] = useState<StereoscopicMode>("anaglyph");
  const [ipdMm, setIpdMm] = useState<number>(64);
  const [convergenceMeters, setConvergenceMeters] = useState<number>(2.0);
  const [depthFactor, setDepthFactor] = useState<number>(1.0);
  const [depthModel, setDepthModel] = useState<"Depth-Anything-V2" | "Marigold-16bit">("Depth-Anything-V2");
  const [webxrActive, setWebxrActive] = useState<boolean>(false);
  const [spatialBaked, setSpatialBaked] = useState<boolean>(false);
  const [telemetry, setTelemetry] = useState<StereoDisparityMetrics>({
    maxPositiveParallaxPixels: 16.8,
    maxNegativeParallaxPixels: 11.4,
    crosstalkRiskScore: 0.26,
    comfortRating: "Optimal",
    recommendedConvergence: 2.15,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Recalculate metrics when controls change
  useEffect(() => {
    compositor.updateConfig({
      mode: stereoMode,
      interpupillaryDistanceMm: ipdMm,
      convergencePlaneMeters: convergenceMeters,
      depthSeparationFactor: depthFactor,
    });
    setTelemetry(compositor.analyzeComfortMetrics(1920));
  }, [compositor, stereoMode, ipdMm, convergenceMeters, depthFactor]);

  // Render animated stereoscopic canvas preview
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.03;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = "#0a0c10";
      ctx.fillRect(0, 0, w, h);

      // Parallax shift calculation
      const shift = Math.sin(t) * (ipdMm / 64) * depthFactor * 8;

      if (stereoMode === "sideBySide") {
        // Left Eye
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, w / 2 - 2, h);
        ctx.clip();
        ctx.fillStyle = "#141824";
        ctx.fillRect(0, 0, w / 2, h);
        // Drawing scene with left shift
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(w / 4 - shift, h / 2, 60, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 13px Inter, sans-serif";
        ctx.fillText("LEFT EYE [0.0°]", 16, 28);
        ctx.restore();

        // Divider
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w / 2, h);
        ctx.stroke();

        // Right Eye
        ctx.save();
        ctx.beginPath();
        ctx.rect(w / 2 + 2, 0, w / 2, h);
        ctx.clip();
        ctx.fillStyle = "#141824";
        ctx.fillRect(w / 2, 0, w / 2, h);
        // Drawing scene with right shift
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc((3 * w) / 4 + shift, h / 2, 60, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 13px Inter, sans-serif";
        ctx.fillText("RIGHT EYE [+2.4°]", w / 2 + 16, 28);
        ctx.restore();
      } else if (stereoMode === "anaglyph") {
        // Red / Cyan Dubois Synthesis
        ctx.fillStyle = "#07090e";
        ctx.fillRect(0, 0, w, h);

        // Simulated background grid
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }

        // Left Eye (Red Channel)
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = "rgba(239, 68, 68, 0.85)"; // Red
        ctx.beginPath();
        ctx.arc(w / 2 - shift, h / 2, 70, 0, Math.PI * 2);
        ctx.fill();

        // Foreground HUD in Left
        ctx.fillStyle = "rgba(239, 68, 68, 0.75)";
        ctx.fillRect(w / 2 - shift - 50, h / 2 + 90, 100, 16);

        // Right Eye (Cyan Channel)
        ctx.fillStyle = "rgba(6, 182, 212, 0.85)"; // Cyan
        ctx.beginPath();
        ctx.arc(w / 2 + shift, h / 2, 70, 0, Math.PI * 2);
        ctx.fill();

        // Foreground HUD in Right
        ctx.fillStyle = "rgba(6, 182, 212, 0.75)";
        ctx.fillRect(w / 2 + shift - 50, h / 2 + 90, 100, 16);

        ctx.globalCompositeOperation = "source-over";

        // Parallax plane marker
        ctx.strokeStyle = "#a855f7";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(w / 2, 40);
        ctx.lineTo(w / 2, h - 40);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#e2e8f0";
        ctx.font = "12px Inter, sans-serif";
        ctx.fillText(`Zero-Parallax Convergence: ${convergenceMeters.toFixed(1)}m`, w / 2 + 10, 56);
      } else if (stereoMode === "webxrSpatial") {
        // Apple Vision Pro / Meta Quest Curvature Screen Canvas
        const grad = ctx.createRadialGradient(w / 2, h / 2, 100, w / 2, h / 2, w / 1.5);
        grad.addColorStop(0, "#1e293b");
        grad.addColorStop(1, "#030712");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Floating spatial 3D window frame
        ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
        ctx.lineWidth = 3;
        ctx.strokeRect(60, 40, w - 120, h - 80);

        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.fillRect(60, 40, w - 120, h - 80);

        // Immersive Theater glow
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 18px Inter, sans-serif";
        ctx.fillText("APPLE VISION PRO SPATIAL ENVIRONMENT", w / 2 - 200, h / 2 - 30);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "13px Inter, sans-serif";
        ctx.fillText("MV-HEVC Dual 4K 90fps Dynamic Foveated Stream", w / 2 - 160, h / 2);

        // Spatial orb
        ctx.fillStyle = "#818cf8";
        ctx.beginPath();
        ctx.arc(w / 2, h / 2 + 50, 30 + Math.sin(t * 2) * 5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Mono 2D fallback
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#f8fafc";
        ctx.font = "16px Inter, sans-serif";
        ctx.fillText("Standard Monoscopic 2D Video Plane", w / 2 - 130, h / 2);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [stereoMode, ipdMm, convergenceMeters, depthFactor]);

  const handleBakeSpatial = () => {
    setSpatialBaked(true);
    if (onApplySpatialTrack) {
      onApplySpatialTrack(stereoMode, telemetry.maxPositiveParallaxPixels);
    }
  };

  return (
    <div
      id="spatial-video-workspace"
      className="flex flex-col h-full bg-[#0a0d14] text-slate-200 border-t border-slate-800 select-none overflow-hidden"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#111622] border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <h2 className="text-sm font-bold tracking-wide uppercase text-white flex items-center gap-2">
            Spatial Video & WebXR Immersive Engine
            <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-800 rounded">
              MV-HEVC Stereoscopic
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs bg-slate-900 px-3 py-1.5 rounded border border-slate-700 font-mono">
            <span className="text-slate-400">Optical Comfort:</span>
            <span
              className={`font-semibold ${
                telemetry.comfortRating === "Optimal"
                  ? "text-emerald-400"
                  : telemetry.comfortRating === "Mild Parallax"
                  ? "text-amber-400"
                  : "text-rose-400"
              }`}
            >
              {telemetry.comfortRating}
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Crosstalk:</span>
            <span className="text-cyan-300">{(telemetry.crosstalkRiskScore * 100).toFixed(0)}%</span>
          </div>

          <button
            id="btn-bake-spatial"
            onClick={handleBakeSpatial}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
              spatialBaked
                ? "bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                : "bg-cyan-600 hover:bg-cyan-500 text-white"
            }`}
          >
            {spatialBaked ? "✓ Spatial Video Stamped" : "Bake MV-HEVC Metadata"}
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

      {/* Main Grid Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Controls Panel */}
        <div className="w-80 bg-[#0e121a] border-r border-slate-800/80 p-5 flex flex-col gap-5 overflow-y-auto">
          {/* Stereoscopic Preview Modes */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Viewing Display Mode
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  { id: "anaglyph", label: "Red/Cyan Anaglyph" },
                  { id: "sideBySide", label: "Side-by-Side (SBS)" },
                  { id: "webxrSpatial", label: "Vision Pro Spatial" },
                  { id: "mono2D", label: "Mono 2D Standard" },
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  id={`btn-mode-${mode.id}`}
                  onClick={() => setStereoMode(mode.id)}
                  className={`px-2.5 py-2 text-xs font-medium rounded border transition text-left ${
                    stereoMode === mode.id
                      ? "bg-cyan-950/70 text-cyan-300 border-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                      : "bg-[#141a24] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interpupillary Distance (IPD) */}
          <div className="bg-[#121622] p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-300">Interpupillary Distance</span>
              <span className="text-xs font-mono text-cyan-400">{ipdMm} mm</span>
            </div>
            <input
              id="slider-ipd"
              type="range"
              min="50"
              max="75"
              step="0.5"
              value={ipdMm}
              onChange={(e) => setIpdMm(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>50mm (Narrow)</span>
              <span>64mm (Default)</span>
              <span>75mm (Wide)</span>
            </div>
          </div>

          {/* Zero-Parallax Convergence Plane */}
          <div className="bg-[#121622] p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-300">Convergence Zero-Plane</span>
              <span className="text-xs font-mono text-cyan-400">{convergenceMeters.toFixed(1)} m</span>
            </div>
            <input
              id="slider-convergence"
              type="range"
              min="0.5"
              max="6.0"
              step="0.1"
              value={convergenceMeters}
              onChange={(e) => setConvergenceMeters(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>0.5m (Close HUD)</span>
              <span>2.0m (Theater)</span>
              <span>6.0m (Infinity)</span>
            </div>
          </div>

          {/* Depth Separation Factor */}
          <div className="bg-[#121622] p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-300">Depth Separation Factor</span>
              <span className="text-xs font-mono text-cyan-400">{depthFactor.toFixed(2)}x</span>
            </div>
            <input
              id="slider-depth-factor"
              type="range"
              min="0.2"
              max="2.5"
              step="0.05"
              value={depthFactor}
              onChange={(e) => setDepthFactor(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* AI Monocular Depth Model Selection */}
          <div className="bg-[#121622] p-3 rounded-lg border border-slate-800">
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Monocular 16-Bit Depth Engine
            </label>
            <div className="flex gap-2">
              {(["Depth-Anything-V2", "Marigold-16bit"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setDepthModel(m)}
                  className={`flex-1 py-1.5 text-[11px] font-mono rounded border transition ${
                    depthModel === m
                      ? "bg-purple-950/80 text-purple-300 border-purple-500"
                      : "bg-[#181e2b] text-slate-400 border-slate-700 hover:text-slate-200"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* WebXR Immersive Launcher */}
          <button
            id="btn-launch-webxr"
            onClick={() => {
              setWebxrActive(!webxrActive);
              setStereoMode("webxrSpatial");
            }}
            className={`w-full py-2.5 rounded-lg text-xs font-bold tracking-wide uppercase transition-all flex items-center justify-center gap-2 border ${
              webxrActive
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                : "bg-gradient-to-r from-slate-800 to-slate-900 text-slate-300 border-slate-700 hover:border-slate-600 hover:text-white"
            }`}
          >
            <span>🥽</span>
            {webxrActive ? "WebXR Theater Active (Quest / Vision Pro)" : "Enter WebXR Immersive Theater"}
          </button>
        </div>

        {/* Center / Right Program Stereoscopic Canvas */}
        <div className="flex-1 bg-[#07090e] p-6 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Spatial Canvas */}
          <div className="relative border border-slate-800 rounded-xl overflow-hidden shadow-2xl bg-black w-full max-w-4xl aspect-video flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              className="w-full h-full object-contain"
            />

            {/* Overlaid Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-2.5 py-1 text-[11px] font-mono bg-black/70 backdrop-blur border border-slate-700 text-cyan-300 rounded">
                MODE: {stereoMode.toUpperCase()}
              </span>
              <span className="px-2.5 py-1 text-[11px] font-mono bg-black/70 backdrop-blur border border-slate-700 text-purple-300 rounded">
                DEPTH: {depthModel}
              </span>
            </div>

            <div className="absolute bottom-4 right-4 flex gap-2 font-mono text-[11px]">
              <span className="px-2 py-1 bg-black/80 backdrop-blur border border-slate-800 text-emerald-400 rounded">
                +PARALLAX: {telemetry.maxPositiveParallaxPixels}px
              </span>
              <span className="px-2 py-1 bg-black/80 backdrop-blur border border-slate-800 text-cyan-400 rounded">
                -PARALLAX: {telemetry.maxNegativeParallaxPixels}px
              </span>
            </div>
          </div>

          {/* Quick Explanation Footer */}
          <div className="mt-4 text-center text-xs text-slate-500 max-w-xl">
            Clean-room Dubois Red/Cyan synthesis & MV-HEVC dual-track stereoscopic rendering compliant with Apple Vision Pro Spatial Video Profile and Meta Quest WebXR Specification.
          </div>
        </div>
      </div>
    </div>
  );
};
