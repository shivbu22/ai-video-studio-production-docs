"use client";

import React, { useState } from "react";
import { 
  Layers, 
  BarChart3, 
  FileText, 
  Trophy, 
  Sparkles, 
  Sliders, 
  Eye, 
  Play, 
  Pause, 
  RotateCw, 
  Check, 
  Box,
  Copy,
  Plus
} from "lucide-react";

interface Remotion3DWorkspaceProps {
  onInsertTemplate?: (templateTitle: string) => void;
}

export const Remotion3DWorkspace: React.FC<Remotion3DWorkspaceProps> = ({
  onInsertTemplate,
}) => {
  const [activeMotionStyle, setActiveMotionStyle] = useState<"barchart" | "tierlist" | "paper" | "exploded">("barchart");
  const [isPlaying, setIsPlaying] = useState(true);
  const [bar1Value, setBar1Value] = useState(118);
  const [bar2Value, setBar2Value] = useState(94);
  const [hasInserted, setHasInserted] = useState(false);

  const motionStyles = [
    {
      id: "barchart",
      title: "3D Chrome Bar Chart",
      subtitle: "Chrome bars on mirror floor",
      badge: "Real-time 3D",
      desc: "Interactive extruded bars with realistic ground reflections and dynamic percentage labels.",
      icon: BarChart3,
      color: "text-violet-400",
    },
    {
      id: "tierlist",
      title: "Glass Tier List",
      subtitle: "Rank anything live over footage",
      badge: "Glassmorphism",
      desc: "Floating S/A/B/C tier rankings with frosted glass blur and illuminated card borders.",
      icon: Trophy,
      color: "text-amber-400",
    },
    {
      id: "paper",
      title: "Research Paper Lift-Off",
      subtitle: "Study curls with glowing highlight",
      badge: "Citation FX",
      desc: "Scientific PDF abstract lifts in 3D perspective with neon yellow highlighter over key finding.",
      icon: FileText,
      color: "text-cyan-400",
    },
    {
      id: "exploded",
      title: "Exploded Layers 3D",
      subtitle: "Footage, graphics & sound pulled apart",
      badge: "Z-Depth Stack",
      desc: "Visualizes the entire NLE composite stack in isometric 3D space.",
      icon: Layers,
      color: "text-emerald-400",
    },
  ];

  const handleInsert = () => {
    setHasInserted(true);
    if (onInsertTemplate) {
      const templateName = 
        activeMotionStyle === "barchart" ? "Remotion: 3D Chrome Bar Chart" :
        activeMotionStyle === "tierlist" ? "Remotion: Glass Tier List" :
        activeMotionStyle === "paper" ? "Remotion: Paper Lift-Off Citation" :
        "Remotion: Exploded Layers 3D";
      onInsertTemplate(templateName);
    }
    setTimeout(() => setHasInserted(false), 2500);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0b0e14] text-slate-200 select-none">
      {/* LEFT COLUMN: Motion Style Catalog & Parameters */}
      <div className="w-88 border-r border-slate-800/80 bg-[#101319] flex flex-col shrink-0">
        <div className="p-3 border-b border-slate-800 bg-[#14171d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-bold text-white tracking-wide">REMOTION 3D MOTION STUDIO</span>
          </div>
          <span className="text-[10px] bg-violet-500/20 text-violet-300 border border-violet-500/30 px-1.5 py-0.5 rounded font-mono">
            React v19
          </span>
        </div>

        {/* 4 Core Styles Picker (SlotStudio exact showcase) */}
        <div className="p-3 border-b border-slate-800 space-y-2 bg-[#0d0f14]">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            SlotStudio Motion Templates
          </div>
          <div className="space-y-1.5">
            {motionStyles.map((style) => {
              const Icon = style.icon;
              const isActive = activeMotionStyle === style.id;
              return (
                <div
                  key={style.id}
                  onClick={() => setActiveMotionStyle(style.id as any)}
                  className={`p-2.5 rounded border cursor-pointer transition-all ${
                    isActive 
                      ? "bg-violet-950/30 border-violet-500/80 shadow-md shadow-violet-950/40" 
                      : "bg-[#14171d] border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      <Icon className={`w-3.5 h-3.5 ${style.color}`} />
                      <span>{style.title}</span>
                    </div>
                    <span className="text-[9px] font-mono bg-slate-800 px-1.5 py-0.2 rounded text-slate-300 border border-slate-700">
                      {style.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    {style.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customization Sliders for Active Template */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Live Template Parameters
          </div>

          {activeMotionStyle === "barchart" && (
            <div className="space-y-3 bg-[#14171d] p-3 rounded border border-slate-800">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Barbell Row EMG (%)</span>
                  <span className="font-mono text-violet-400 font-bold">{bar1Value}%</span>
                </div>
                <input 
                  type="range"
                  min="50"
                  max="150"
                  value={bar1Value}
                  onChange={(e) => setBar1Value(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-violet-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Lat Pulldown EMG (%)</span>
                  <span className="font-mono text-cyan-400 font-bold">{bar2Value}%</span>
                </div>
                <input 
                  type="range"
                  min="50"
                  max="150"
                  value={bar2Value}
                  onChange={(e) => setBar2Value(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>
          )}

          {activeMotionStyle === "tierlist" && (
            <div className="bg-[#14171d] p-3 rounded border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-amber-400 font-bold">
                <span>Tier Rankings</span>
                <span className="text-[10px] bg-amber-500/20 px-1.5 rounded">4 Tiers</span>
              </div>
              <div className="p-1.5 bg-black/40 rounded border border-slate-800 flex justify-between">
                <span className="font-bold text-red-400">S-Tier:</span>
                <span className="text-slate-300 truncate">Chest-Supported Row</span>
              </div>
              <div className="p-1.5 bg-black/40 rounded border border-slate-800 flex justify-between">
                <span className="font-bold text-orange-400">A-Tier:</span>
                <span className="text-slate-300 truncate">Barbell Bent-Over Row</span>
              </div>
              <div className="p-1.5 bg-black/40 rounded border border-slate-800 flex justify-between">
                <span className="font-bold text-yellow-400">B-Tier:</span>
                <span className="text-slate-300 truncate">Seated Cable Row</span>
              </div>
            </div>
          )}

          {activeMotionStyle === "paper" && (
            <div className="bg-[#14171d] p-3 rounded border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-cyan-400 font-bold">
                <span>Citation Highlight</span>
                <span className="text-[10px] bg-cyan-500/20 px-1.5 rounded">PDF Parser</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Source: Clinical Journal of Sport Medicine / Schoenfeld 2021
              </p>
              <div className="bg-yellow-400/20 border border-yellow-400/40 p-2 rounded text-yellow-300 text-[11px] font-medium leading-relaxed">
                “Normalized FFMI of athletes who had not used steroids extended up to a limit of 25.0.”
              </div>
            </div>
          )}

          {/* Action button */}
          <button 
            onClick={handleInsert}
            className="w-full mt-2 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded font-semibold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-violet-950/40 active:scale-95 transition-all"
          >
            {hasInserted ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{hasInserted ? "Inserted into V2 Track!" : "Insert into V2 Track"}</span>
          </button>
        </div>
      </div>

      {/* CENTER STAGE: Real-Time WebGL / Remotion Canvas Simulation */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#090b10]">
        {/* Canvas HUD Bar */}
        <div className="h-10 px-4 border-b border-slate-800 bg-[#12151b] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-semibold text-white">Remotion Composition Viewport</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700">
              60.0 FPS • 4K WebGL Canvas
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Shader Reflections
            </span>
          </div>
        </div>

        {/* 16:9 Canvas Viewport */}
        <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
          <div className="w-full max-w-3xl aspect-video bg-gradient-to-b from-[#161a25] via-[#0d0f15] to-[#08090d] rounded-xl border border-slate-700/80 shadow-2xl relative overflow-hidden flex flex-col justify-between p-8">
            {/* Background Grid & Ambient Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(139,92,246,0.15),transparent_70%)] pointer-events-none"></div>

            {/* Top Label */}
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <span className="bg-violet-500/20 border border-violet-500/40 text-violet-300 text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold">
                  Remotion 3D Node: {activeMotionStyle.toUpperCase()}
                </span>
                <h3 className="text-lg font-extrabold text-white mt-1.5 tracking-tight">
                  {activeMotionStyle === "barchart" && "Latissimus Dorsi Peak EMG Activation"}
                  {activeMotionStyle === "tierlist" && "Definitive Back Exercise Tier Ranking"}
                  {activeMotionStyle === "paper" && "Schoenfeld et al. (2021) — Full Hypertrophy Study"}
                  {activeMotionStyle === "exploded" && "Exploded NLE Composite Z-Stack (4 Layers)"}
                </h3>
              </div>

              {/* Glass Tier List Floating Overlay in Top Right */}
              <div className="bg-black/60 backdrop-blur-md border border-slate-700 p-2.5 rounded-lg text-xs max-w-[200px] shadow-xl">
                <p className="font-bold text-amber-400 text-[11px] mb-1">SLOT STUDIO ENGINE</p>
                <p className="text-slate-300 text-[10px] leading-tight">
                  Edits every cut or graphic every 2 to 3 seconds.
                </p>
              </div>
            </div>

            {/* Dynamic Visual Content */}
            <div className="relative z-10 flex-1 flex items-end justify-center pb-6">
              {activeMotionStyle === "barchart" && (
                <div className="flex items-end justify-center space-x-16 w-full">
                  {/* Bar 1 */}
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-bold font-mono text-violet-400 mb-2 animate-bounce">
                      {bar1Value}%
                    </span>
                    <div 
                      className="w-24 bg-gradient-to-t from-violet-700 via-violet-500 to-violet-300 rounded-t-lg border-t-2 border-l border-r border-violet-200 shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all duration-300 relative overflow-hidden"
                      style={{ height: `${bar1Value * 1.5}px` }}
                    >
                      <div className="absolute inset-0 bg-white/20 transform -skew-y-12"></div>
                    </div>
                    <span className="text-xs font-bold text-white mt-2">Barbell Row</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Max Thickness</span>
                  </div>

                  {/* Bar 2 */}
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-bold font-mono text-cyan-400 mb-2">
                      {bar2Value}%
                    </span>
                    <div 
                      className="w-24 bg-gradient-to-t from-cyan-700 via-cyan-500 to-cyan-300 rounded-t-lg border-t-2 border-l border-r border-cyan-200 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all duration-300 relative overflow-hidden"
                      style={{ height: `${bar2Value * 1.5}px` }}
                    >
                      <div className="absolute inset-0 bg-white/20 transform -skew-y-12"></div>
                    </div>
                    <span className="text-xs font-bold text-white mt-2">Lat Pulldown</span>
                    <span className="text-[10px] text-slate-400 font-mono">Vertical Width</span>
                  </div>
                </div>
              )}

              {activeMotionStyle === "tierlist" && (
                <div className="w-full max-w-lg space-y-2">
                  <div className="flex items-center gap-3 bg-red-950/40 border border-red-500/50 p-2 rounded-lg backdrop-blur-md">
                    <span className="w-8 h-8 rounded bg-red-600 font-black text-white flex items-center justify-center text-sm shadow">S</span>
                    <span className="text-xs font-bold text-white">Chest-Supported T-Bar Row</span>
                    <span className="ml-auto text-[10px] text-emerald-400 font-mono">Zero Lumbar Shear</span>
                  </div>
                  <div className="flex items-center gap-3 bg-orange-950/40 border border-orange-500/50 p-2 rounded-lg backdrop-blur-md">
                    <span className="w-8 h-8 rounded bg-orange-600 font-black text-white flex items-center justify-center text-sm shadow">A</span>
                    <span className="text-xs font-bold text-white">Barbell Bent-Over Row</span>
                    <span className="ml-auto text-[10px] text-amber-300 font-mono">Peak Erector Tension</span>
                  </div>
                  <div className="flex items-center gap-3 bg-yellow-950/40 border border-yellow-500/50 p-2 rounded-lg backdrop-blur-md">
                    <span className="w-8 h-8 rounded bg-yellow-600 font-black text-white flex items-center justify-center text-sm shadow">B</span>
                    <span className="text-xs font-bold text-white">Seated Cable Row</span>
                    <span className="ml-auto text-[10px] text-slate-400 font-mono">Mid-Range Overload</span>
                  </div>
                </div>
              )}

              {activeMotionStyle === "paper" && (
                <div className="w-full max-w-md bg-white text-slate-900 p-6 rounded-lg shadow-2xl border border-slate-300 transform -rotate-1 hover:rotate-0 transition-transform relative">
                  <p className="text-[10px] text-slate-500 font-serif">Clinical Journal of Sport Medicine • 1995</p>
                  <h4 className="text-sm font-serif font-bold text-slate-900 mt-1">
                    Fat-Free Mass Index in Anabolic-Androgenic Steroid Users
                  </h4>
                  <div className="mt-3 p-2 bg-yellow-200 text-slate-900 text-xs font-serif font-semibold border-l-4 border-yellow-500 shadow-md">
                    “The normalized FFMI values of athletes who had not used steroids extended up to a well-defined limit of 25.0.”
                  </div>
                  <span className="absolute top-2 right-2 text-[9px] bg-violet-600 text-white font-mono px-1.5 py-0.5 rounded">
                    3D Extruded
                  </span>
                </div>
              )}

              {activeMotionStyle === "exploded" && (
                <div className="relative w-full h-40 flex items-center justify-center">
                  <div className="absolute w-72 h-20 bg-purple-600/30 border border-purple-400 rounded-lg transform -rotate-6 translate-y-8 backdrop-blur-sm flex items-center px-4 text-xs font-mono text-purple-200">
                    Layer 4: Animated Karaoke Captions
                  </div>
                  <div className="absolute w-72 h-20 bg-indigo-600/30 border border-indigo-400 rounded-lg transform -rotate-6 translate-y-3 backdrop-blur-sm flex items-center px-4 text-xs font-mono text-indigo-200">
                    Layer 3: Remotion 3D Chrome Chart
                  </div>
                  <div className="absolute w-72 h-20 bg-blue-600/30 border border-blue-400 rounded-lg transform -rotate-6 -translate-y-2 backdrop-blur-sm flex items-center px-4 text-xs font-mono text-blue-200">
                    Layer 2: YouTube 4K Cut Footage
                  </div>
                  <div className="absolute w-72 h-20 bg-emerald-600/30 border border-emerald-400 rounded-lg transform -rotate-6 -translate-y-7 backdrop-blur-sm flex items-center px-4 text-xs font-mono text-emerald-200">
                    Layer 1: Cleaned Voiceover &amp; Music Bed
                  </div>
                </div>
              )}
            </div>

            {/* Mirror Floor Horizon Line */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
