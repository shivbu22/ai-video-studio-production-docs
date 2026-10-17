"use client";

import React, { useState } from "react";
import { 
  Palette, 
  Sparkles, 
  RotateCcw, 
  Sun, 
  Contrast, 
  Droplet, 
  Eye, 
  Sliders,
  Check,
  SplitSquareVertical
} from "lucide-react";
import { ProgramMonitor } from "../ProgramMonitor";

interface ColorGradingWorkspaceProps {
  currentTimeMs: number;
  totalDurationMs: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (timeMs: number) => void;
  aspectRatio: "16:9" | "9:16" | "1:1";
  onAspectRatioChange: (ratio: "16:9" | "9:16" | "1:1") => void;
  activeLut: string;
  onSelectLut: (lutName: string) => void;
  onShowToast: (msg: string) => void;
}

export const ColorGradingWorkspace: React.FC<ColorGradingWorkspaceProps> = ({
  currentTimeMs,
  totalDurationMs,
  isPlaying,
  onTogglePlay,
  onSeek,
  aspectRatio,
  onAspectRatioChange,
  activeLut,
  onSelectLut,
  onShowToast,
}) => {
  // Lumetri Basic Correction Parameters
  const [exposure, setExposure] = useState(0.15); // -5 to +5 EV
  const [contrast, setContrast] = useState(1.15); // 0.5 to 2.0
  const [temperature, setTemperature] = useState(5600); // 2000K to 10000K
  const [tint, setTint] = useState(4); // -100 to +100
  const [saturation, setSaturation] = useState(115); // 0 to 200%
  const [splitView, setSplitView] = useState(false);
  const [activeScope, setActiveScope] = useState<"parade" | "waveform" | "vectorscope">("parade");

  // 3-Way Color Wheel Offsets [x (-50..50), y (-50..50)]
  const [lift, setLift] = useState<{ x: number; y: number; lum: number }>({ x: -4, y: 8, lum: -0.05 }); // Teal shadow push
  const [gamma, setGamma] = useState<{ x: number; y: number; lum: number }>({ x: 0, y: 0, lum: 0.0 });
  const [gain, setGain] = useState<{ x: number; y: number; lum: number }>({ x: 8, y: -6, lum: 0.1 }); // Warm highlight push

  const LUT_PRESETS = [
    { id: "teal_orange", name: "Moody Teal & Orange", tag: "Hollywood Blockbuster", color: "from-cyan-600 via-slate-800 to-amber-500" },
    { id: "cyberpunk", name: "Cyberpunk Neon 2077", tag: "High Contrast Synth", color: "from-fuchsia-600 via-indigo-900 to-cyan-400" },
    { id: "vintage", name: "Vintage 35mm Grain", tag: "Kodak 5207 Warm", color: "from-amber-700 via-stone-800 to-stone-900" },
    { id: "noir", name: "Noir Monochrome", tag: "High Dynamic Silver", color: "from-slate-300 via-slate-700 to-black" },
    { id: "sunset", name: "Sunset Gold", tag: "Golden Hour Glow", color: "from-rose-500 via-amber-600 to-yellow-300" },
    { id: "matrix", name: "Emerald Matrix", tag: "Sci-Fi Deep Green", color: "from-emerald-700 via-emerald-950 to-teal-400" },
    { id: "bleach", name: "Bleach Bypass", tag: "Desaturated Gritty", color: "from-stone-400 via-slate-800 to-stone-600" },
    { id: "clean", name: "Clean Broadcast 709", tag: "Neutral Rec.709", color: "from-sky-500 via-slate-800 to-blue-600" },
  ];

  const resetAllColor = () => {
    setExposure(0);
    setContrast(1.0);
    setTemperature(5600);
    setTint(0);
    setSaturation(100);
    setLift({ x: 0, y: 0, lum: 0 });
    setGamma({ x: 0, y: 0, lum: 0 });
    setGain({ x: 0, y: 0, lum: 0 });
    onSelectLut("Clean Broadcast 709");
    onShowToast("Color parameters reset to Rec.709 baseline.");
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-studio-950 select-none">
      {/* Left 60%: Large Program Monitor with Live Color Scope Overlays */}
      <div className="flex-1 flex flex-col border-r border-studio-800 overflow-hidden">
        {/* Color Suite Sub-Header */}
        <div className="h-10 px-4 bg-studio-900 border-b border-studio-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-amber-500/20 text-amber-400">
              <Palette className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-100 tracking-wide">Lumetri Color Suite</span>
            <span className="text-[10px] text-amber-400/90 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
              LUT: {activeLut}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSplitView(!splitView)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] transition-all active:scale-95 ${
                splitView
                  ? "bg-amber-600 text-white shadow-sm font-semibold"
                  : "bg-studio-800 hover:bg-studio-700 text-slate-300"
              }`}
              title="Toggle Before/After Split View"
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>Before / After</span>
            </button>

            <button
              onClick={resetAllColor}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] bg-studio-800 hover:bg-studio-700 text-slate-300 transition-colors active:scale-95"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Central Monitor Frame */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          <div className="flex-1 relative">
            <ProgramMonitor
              currentTimeMs={currentTimeMs}
              totalDurationMs={totalDurationMs}
              isPlaying={isPlaying}
              onTogglePlay={onTogglePlay}
              onSeek={onSeek}
              aspectRatio={aspectRatio}
              onAspectRatioChange={onAspectRatioChange}
              currentSceneTitle="Color Grade: Quantum Benchmark"
              currentTemplateName="BarChart"
              activeLut={activeLut}
            />

            {/* Split Screen Indicator */}
            {splitView && (
              <div className="absolute top-12 left-8 z-20 pointer-events-none flex items-center gap-4 text-[10px] font-mono font-bold tracking-wider">
                <span className="bg-black/80 text-slate-400 px-2 py-0.5 rounded border border-white/10">RAW LOG (ORIGINAL)</span>
                <span className="bg-amber-500/90 text-black px-2 py-0.5 rounded">LUMETRI GRADE (ACTIVE)</span>
              </div>
            )}
          </div>

          {/* Bottom Live Video Scopes (Parade / Waveform / Vectorscope) */}
          <div className="h-32 bg-studio-950 border-t border-studio-800 p-2 flex flex-col">
            <div className="flex items-center justify-between mb-1 px-2 text-[10px] font-mono text-slate-400">
              <span className="font-semibold text-slate-300">REAL-TIME LUMETRI SCOPES</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveScope("parade")}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    activeScope === "parade" ? "bg-amber-500/20 text-amber-300 font-bold" : "hover:text-slate-200"
                  }`}
                >
                  RGB Parade
                </button>
                <button
                  onClick={() => setActiveScope("waveform")}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    activeScope === "waveform" ? "bg-amber-500/20 text-amber-300 font-bold" : "hover:text-slate-200"
                  }`}
                >
                  Luma Waveform
                </button>
                <button
                  onClick={() => setActiveScope("vectorscope")}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    activeScope === "vectorscope" ? "bg-amber-500/20 text-amber-300 font-bold" : "hover:text-slate-200"
                  }`}
                >
                  Vectorscope
                </button>
              </div>
            </div>

            {/* Simulated Live Scope Canvas */}
            <div className="flex-1 bg-black/90 rounded border border-studio-800 p-2 relative overflow-hidden flex items-center justify-around font-mono text-[9px]">
              {/* IRE Markers */}
              <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-between text-slate-600 text-[8px] pointer-events-none">
                <span>100 IRE</span>
                <span>50 IRE</span>
                <span>0 IRE</span>
              </div>

              {activeScope === "parade" && (
                <div className="w-full h-full flex items-end justify-around gap-2 px-6">
                  {/* Red Channel */}
                  <div className="flex-1 h-full flex flex-col justify-end items-center">
                    <div className="w-full bg-gradient-to-t from-red-600/20 via-red-500/60 to-red-400/90 rounded-t h-[75%] border-t border-red-400 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:4px_4px] opacity-40 animate-pulse" />
                    </div>
                    <span className="text-red-400 font-bold mt-0.5">RED (R)</span>
                  </div>

                  {/* Green Channel */}
                  <div className="flex-1 h-full flex flex-col justify-end items-center">
                    <div className="w-full bg-gradient-to-t from-emerald-600/20 via-emerald-500/60 to-emerald-400/90 rounded-t h-[68%] border-t border-emerald-400 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:4px_4px] opacity-40 animate-pulse" />
                    </div>
                    <span className="text-emerald-400 font-bold mt-0.5">GREEN (G)</span>
                  </div>

                  {/* Blue Channel */}
                  <div className="flex-1 h-full flex flex-col justify-end items-center">
                    <div className="w-full bg-gradient-to-t from-blue-600/20 via-blue-500/60 to-blue-400/90 rounded-t h-[82%] border-t border-blue-400 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:4px_4px] opacity-40 animate-pulse" />
                    </div>
                    <span className="text-blue-400 font-bold mt-0.5">BLUE (B)</span>
                  </div>
                </div>
              )}

              {activeScope === "waveform" && (
                <div className="w-full h-full flex items-center justify-center px-6">
                  <div className="w-full h-[70%] bg-gradient-to-r from-amber-500/30 via-slate-200/50 to-cyan-400/40 rounded border-y border-amber-400/40 relative">
                    <div className="absolute inset-0 flex items-center justify-around opacity-60">
                      <div className="w-1 h-full bg-amber-400 animate-pulse" />
                      <div className="w-1 h-4/5 bg-cyan-400 animate-pulse" />
                      <div className="w-1 h-3/5 bg-emerald-400 animate-pulse" />
                    </div>
                  </div>
                </div>
              )}

              {activeScope === "vectorscope" && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border border-slate-700 relative flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border border-dashed border-amber-500/30" />
                    <div className="w-2 h-2 rounded-full bg-amber-400 shadow-lg shadow-amber-400/80 animate-ping" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right 40%: 3-Way Color Wheels, Basic Sliders & 3D Cinema LUT Gallery */}
      <div className="w-full md:w-[460px] bg-studio-900 flex flex-col h-full overflow-y-auto font-sans text-xs">
        {/* 1. 3-Way Color Wheels (Lift / Gamma / Gain) */}
        <div className="p-4 border-b border-studio-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 text-xs tracking-wider uppercase">3-Way Color Wheels</span>
            <span className="text-[10px] text-slate-400">Shadows / Midtones / Highlights</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* LIFT (Shadows) */}
            <div className="flex flex-col items-center bg-studio-950 p-2 rounded-lg border border-studio-800">
              <span className="text-[10px] font-bold text-slate-300 mb-2">LIFT (Shadows)</span>
              <div className="w-24 h-24 rounded-full border border-cyan-500/40 bg-gradient-to-tr from-cyan-950/40 via-slate-900 to-amber-950/30 relative flex items-center justify-center shadow-inner cursor-pointer hover:border-cyan-400 transition-colors">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-[1px] bg-slate-800" />
                  <div className="h-full w-[1px] bg-slate-800 absolute" />
                </div>
                <div 
                  className="w-3.5 h-3.5 rounded-full bg-cyan-400 border border-white shadow-md shadow-cyan-500/50 transition-transform active:scale-125"
                  style={{ transform: `translate(${lift.x}px, ${lift.y}px)` }}
                />
              </div>
              <div className="w-full mt-2 space-y-1">
                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>Luma</span>
                  <span className="font-mono text-cyan-400">{lift.lum.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-0.5"
                  max="0.5"
                  step="0.01"
                  value={lift.lum}
                  onChange={(e) => setLift({ ...lift, lum: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 h-1 bg-studio-800 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* GAMMA (Midtones) */}
            <div className="flex flex-col items-center bg-studio-950 p-2 rounded-lg border border-studio-800">
              <span className="text-[10px] font-bold text-slate-300 mb-2">GAMMA (Mids)</span>
              <div className="w-24 h-24 rounded-full border border-purple-500/40 bg-gradient-to-tr from-purple-950/40 via-slate-900 to-indigo-950/30 relative flex items-center justify-center shadow-inner cursor-pointer hover:border-purple-400 transition-colors">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-[1px] bg-slate-800" />
                  <div className="h-full w-[1px] bg-slate-800 absolute" />
                </div>
                <div 
                  className="w-3.5 h-3.5 rounded-full bg-purple-400 border border-white shadow-md shadow-purple-500/50 transition-transform active:scale-125"
                  style={{ transform: `translate(${gamma.x}px, ${gamma.y}px)` }}
                />
              </div>
              <div className="w-full mt-2 space-y-1">
                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>Luma</span>
                  <span className="font-mono text-purple-400">{gamma.lum.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-0.5"
                  max="0.5"
                  step="0.01"
                  value={gamma.lum}
                  onChange={(e) => setGamma({ ...gamma, lum: parseFloat(e.target.value) })}
                  className="w-full accent-purple-500 h-1 bg-studio-800 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* GAIN (Highlights) */}
            <div className="flex flex-col items-center bg-studio-950 p-2 rounded-lg border border-studio-800">
              <span className="text-[10px] font-bold text-slate-300 mb-2">GAIN (Highs)</span>
              <div className="w-24 h-24 rounded-full border border-amber-500/40 bg-gradient-to-tr from-amber-950/40 via-slate-900 to-rose-950/30 relative flex items-center justify-center shadow-inner cursor-pointer hover:border-amber-400 transition-colors">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-[1px] bg-slate-800" />
                  <div className="h-full w-[1px] bg-slate-800 absolute" />
                </div>
                <div 
                  className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-white shadow-md shadow-amber-500/50 transition-transform active:scale-125"
                  style={{ transform: `translate(${gain.x}px, ${gain.y}px)` }}
                />
              </div>
              <div className="w-full mt-2 space-y-1">
                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>Luma</span>
                  <span className="font-mono text-amber-400">{gain.lum.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-0.5"
                  max="0.5"
                  step="0.01"
                  value={gain.lum}
                  onChange={(e) => setGain({ ...gain, lum: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500 h-1 bg-studio-800 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Basic Correction Sliders */}
        <div className="p-4 border-b border-studio-800 space-y-3">
          <span className="font-bold text-slate-200 text-xs tracking-wider uppercase block">Basic Correction</span>

          {/* Exposure Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sun className="w-3 h-3 text-amber-400" />
                <span>Exposure</span>
              </span>
              <span className="font-mono text-amber-400">{exposure > 0 ? `+${exposure.toFixed(2)}` : exposure.toFixed(2)} EV</span>
            </div>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.05"
              value={exposure}
              onChange={(e) => setExposure(parseFloat(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-studio-800 rounded cursor-pointer"
            />
          </div>

          {/* Contrast Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Contrast className="w-3 h-3 text-cyan-400" />
                <span>Contrast</span>
              </span>
              <span className="font-mono text-cyan-400">{contrast.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={contrast}
              onChange={(e) => setContrast(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 h-1.5 bg-studio-800 rounded cursor-pointer"
            />
          </div>

          {/* Temperature & Tint */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>Temp</span>
                <span className="font-mono text-amber-300">{temperature}K</span>
              </div>
              <input
                type="range"
                min="2800"
                max="9000"
                step="100"
                value={temperature}
                onChange={(e) => setTemperature(parseInt(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-gradient-to-r from-blue-600 via-amber-200 to-amber-600 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>Tint</span>
                <span className="font-mono text-fuchsia-400">{tint > 0 ? `+${tint}` : tint}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="1"
                value={tint}
                onChange={(e) => setTint(parseInt(e.target.value))}
                className="w-full accent-fuchsia-500 h-1.5 bg-gradient-to-r from-emerald-500 via-slate-400 to-fuchsia-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Saturation */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Droplet className="w-3 h-3 text-pink-400" />
                <span>Saturation</span>
              </span>
              <span className="font-mono text-pink-400">{saturation}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={saturation}
              onChange={(e) => setSaturation(parseInt(e.target.value))}
              className="w-full accent-pink-500 h-1.5 bg-studio-800 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* 3. 3D LUT Cinema Looks Gallery */}
        <div className="p-4 space-y-3 flex-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 text-xs tracking-wider uppercase">3D LUT Cinema Looks</span>
            <span className="text-[10px] text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Instant Rec.709</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {LUT_PRESETS.map((lut) => {
              const isSelected = activeLut.toLowerCase().includes(lut.name.toLowerCase().split(" ")[0]);
              return (
                <button
                  key={lut.id}
                  onClick={() => {
                    onSelectLut(lut.name);
                    onShowToast(`Applied 3D Cinema LUT: ${lut.name}`);
                  }}
                  className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all active:scale-[0.97] ${
                    isSelected
                      ? "bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/50"
                      : "bg-studio-950/80 border-studio-800 hover:border-slate-700 hover:bg-studio-800/50"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="font-semibold text-slate-200 text-[11px] truncate">{lut.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                  </div>

                  {/* Visual LUT Color Gradient Swatch */}
                  <div className={`h-5 w-full rounded bg-gradient-to-r ${lut.color} shadow-inner mb-1.5 opacity-90`} />

                  <span className="text-[9px] text-slate-400 truncate">{lut.tag}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
