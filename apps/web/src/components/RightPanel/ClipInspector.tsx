"use client";

import React, { useState } from "react";
import { Sliders, Move, Eye, Volume2, Palette, Sparkles, X, Check } from "lucide-react";
import { TimelineClip } from "../Timeline/TimelineCanvas";

export interface ClipInspectorProps {
  clip: TimelineClip | null;
  onClose: () => void;
  onUpdateClipProps?: (clipId: string, updates: Partial<TimelineClip>) => void;
}

export const ClipInspector: React.FC<ClipInspectorProps> = ({
  clip,
  onClose,
  onUpdateClipProps,
}) => {
  const [scale, setScale] = useState(100);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [volume, setVolume] = useState(100);
  const [selectedLut, setSelectedLut] = useState("Teal & Orange");
  const [exposure, setExposure] = useState(0);
  const [saturation, setSaturation] = useState(100);

  if (!clip) {
    return (
      <div className="w-80 bg-studio-900 border-l border-studio-800 p-6 flex flex-col items-center justify-center text-center text-slate-500 select-none">
        <Sliders className="w-8 h-8 text-slate-600 mb-3 animate-pulse" />
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">No Clip Selected</p>
        <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
          Click any clip on the multi-track timeline to inspect and edit transform, compositing, audio, and color grading.
        </p>
      </div>
    );
  }

  const isAudio = clip.type === "audio";
  const isMotion = clip.type === "motion";

  const LUT_PRESETS = [
    { id: "teal_orange", name: "Teal & Orange", color: "from-teal-500 to-amber-500" },
    { id: "cyberpunk", name: "Cyberpunk 2077", color: "from-fuchsia-500 to-cyan-500" },
    { id: "vintage", name: "35mm Film Grain", color: "from-amber-600 to-stone-800" },
    { id: "noir", name: "Noir Monochrome", color: "from-slate-400 to-slate-900" },
    { id: "sunset", name: "Sunset Gold", color: "from-rose-500 to-amber-400" },
    { id: "clean", name: "Clean Broadcast", color: "from-sky-400 to-blue-600" },
  ];

  return (
    <div className="w-80 bg-studio-900 border-l border-studio-800 flex flex-col h-full overflow-y-auto select-none font-sans text-xs">
      {/* Header */}
      <div className="h-10 px-4 bg-studio-950 border-b border-studio-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <Sliders className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
          <span className="font-semibold text-slate-200 truncate">{clip.title}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-studio-800 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 space-y-5 flex-1">
        {/* Section 1: TRANSFORM (Visual Clips) */}
        {!isAudio && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold uppercase tracking-wider text-[10px]">
              <Move className="w-3 h-3 text-cyan-400" />
              <span>Transform & Scale</span>
            </div>

            <div className="bg-studio-950/70 p-3 rounded-lg border border-studio-800 space-y-3">
              {/* Scale Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Scale</span>
                  <span className="text-cyan-400 font-mono font-medium">{scale}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-studio-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Position X / Y */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="space-y-1">
                  <span className="text-slate-500 text-[10px] block">Position X</span>
                  <div className="flex items-center bg-studio-900 border border-studio-800 rounded px-2 py-1">
                    <input
                      type="number"
                      value={posX}
                      onChange={(e) => setPosX(Number(e.target.value))}
                      className="w-full bg-transparent text-slate-200 font-mono text-xs focus:outline-none"
                    />
                    <span className="text-slate-600 text-[10px]">px</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 text-[10px] block">Position Y</span>
                  <div className="flex items-center bg-studio-900 border border-studio-800 rounded px-2 py-1">
                    <input
                      type="number"
                      value={posY}
                      onChange={(e) => setPosY(Number(e.target.value))}
                      className="w-full bg-transparent text-slate-200 font-mono text-xs focus:outline-none"
                    />
                    <span className="text-slate-600 text-[10px]">px</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: COMPOSITING & AUDIO */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold uppercase tracking-wider text-[10px]">
            {isAudio ? (
              <Volume2 className="w-3 h-3 text-emerald-400" />
            ) : (
              <Eye className="w-3 h-3 text-violet-400" />
            )}
            <span>{isAudio ? "Audio Gain & Normalization" : "Compositing & Opacity"}</span>
          </div>

          <div className="bg-studio-950/70 p-3 rounded-lg border border-studio-800 space-y-3">
            {!isAudio && (
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Opacity</span>
                  <span className="text-violet-400 font-mono font-medium">{opacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-violet-500 h-1.5 bg-studio-800 rounded-lg cursor-pointer"
                />
              </div>
            )}

            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Volume Gain</span>
                <span className="text-emerald-400 font-mono font-medium">{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="150"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-studio-800 rounded-lg cursor-pointer"
              />
              {clip.ducked && (
                <div className="flex items-center gap-1 text-[10px] text-rose-400 pt-1 font-medium">
                  <Check className="w-3 h-3" />
                  <span>Auto-ducked by speech track (-12 dB)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: CINEMATIC LUT & COLOR GRADING */}
        {!isAudio && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold uppercase tracking-wider text-[10px]">
                <Palette className="w-3 h-3 text-amber-400" />
                <span>Cinematic Color Grade & LUT</span>
              </div>
              <span className="text-[10px] text-amber-400/90 font-medium">{selectedLut}</span>
            </div>

            <div className="bg-studio-950/70 p-3 rounded-lg border border-studio-800 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {LUT_PRESETS.map((lut) => (
                  <button
                    key={lut.id}
                    onClick={() => setSelectedLut(lut.name)}
                    className={`p-2 rounded border flex flex-col items-start gap-1 transition-all text-left ${
                      selectedLut === lut.name
                        ? "border-amber-500 bg-amber-500/10 text-slate-100"
                        : "border-studio-800 bg-studio-900/60 text-slate-400 hover:border-studio-700"
                    }`}
                  >
                    <div className={`w-full h-2 rounded-full bg-gradient-to-r ${lut.color}`} />
                    <span className="text-[10px] font-medium leading-tight truncate w-full">{lut.name}</span>
                  </button>
                ))}
              </div>

              {/* Sliders: Exposure & Saturation */}
              <div className="space-y-2 pt-2 border-t border-studio-800/80">
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>Exposure</span>
                    <span className="font-mono text-slate-300">{exposure > 0 ? `+${exposure}` : exposure} EV</span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    value={exposure}
                    onChange={(e) => setExposure(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-studio-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>Saturation</span>
                    <span className="font-mono text-slate-300">{saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={saturation}
                    onChange={(e) => setSaturation(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-studio-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: REMOTION MOTION GRAPHICS PROPS */}
        {isMotion && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold uppercase tracking-wider text-[10px]">
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span>Remotion Template Data</span>
            </div>

            <div className="bg-studio-950/70 p-3 rounded-lg border border-studio-800 space-y-2">
              <span className="text-slate-400 block text-[10px]">Template Type</span>
              <span className="inline-block px-2 py-1 rounded bg-violet-600/30 text-violet-300 font-mono text-[11px] border border-violet-500/30">
                BarChart (30 fps)
              </span>
              <p className="text-slate-500 text-[10px] pt-1">
                Data parameters are live-bound to Remotion engine and auto-render in real-time.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
