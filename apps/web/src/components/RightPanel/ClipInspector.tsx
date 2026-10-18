"use client";

import React, { useState } from "react";
import { Sliders, Move, Eye, Volume2, Palette, Sparkles, X, Check, BarChart3, Trophy, FileText, Layers, Box, RotateCw } from "lucide-react";
import { TimelineClip } from "../Timeline/TimelineCanvas";

export interface ClipInspectorProps {
  clip: TimelineClip | null;
  onClose: () => void;
  onUpdateClipProps?: (clipId: string, updates: Partial<TimelineClip>) => void;
  onOpenVFXStudio?: () => void;
}

export const ClipInspector: React.FC<ClipInspectorProps> = ({
  clip,
  onClose,
  onUpdateClipProps,
  onOpenVFXStudio,
}) => {
  const [scale, setScale] = useState(100);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [volume, setVolume] = useState(100);
  const [selectedLut, setSelectedLut] = useState("Moody Teal & Orange");
  const [exposure, setExposure] = useState(0);
  const [saturation, setSaturation] = useState(100);

  // Transitions & Keyframing State
  const [transitionInType, setTransitionInType] = useState<string>(clip?.transitionIn?.type || "none");
  const [transitionInDuration, setTransitionInDuration] = useState<number>(clip?.transitionIn?.durationMs || 500);
  const [transitionOutType, setTransitionOutType] = useState<string>(clip?.transitionOut?.type || "none");
  const [transitionOutDuration, setTransitionOutDuration] = useState<number>(clip?.transitionOut?.durationMs || 500);
  const [isKeyframeEnabled, setIsKeyframeEnabled] = useState<boolean>(false);
  const [keyframeEasing, setKeyframeEasing] = useState<string>("easeInOut");

  // OmniCut Motion Graphic Parameters
  const [motionMetricA, setMotionMetricA] = useState("10,000 yrs");
  const [motionMetricB, setMotionMetricB] = useState("200 sec");
  const [mirrorFloor, setMirrorFloor] = useState(true);
  const [isometricAngle, setIsometricAngle] = useState(35);
  const [motionAccentColor, setMotionAccentColor] = useState("#3B63FF");

  const handleApplyTransitions = (
    inType = transitionInType, 
    inDur = transitionInDuration, 
    outType = transitionOutType, 
    outDur = transitionOutDuration
  ) => {
    if (!clip || !onUpdateClipProps) return;
    onUpdateClipProps(clip.id, {
      transitionIn: inType !== "none" ? { type: inType as any, durationMs: inDur } : undefined,
      transitionOut: outType !== "none" ? { type: outType as any, durationMs: outDur } : undefined,
      hasFx: inType !== "none" || outType !== "none",
    });
  };

  if (!clip) {
    return (
      <div className="w-80 bg-[#0a0c12] border-l border-white/5 p-6 flex flex-col items-center justify-center text-center text-slate-500 select-none font-sans">
        <Sliders className="w-8 h-8 text-slate-600 mb-3 animate-pulse" />
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">No Clip Selected</p>
        <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
          Click any clip on the multi-track timeline to inspect and edit transform, 3D motion graphics, audio, and color grading.
        </p>
      </div>
    );
  }

  const isAudio = clip.type === "audio";
  const isMotion = clip.type === "motion";

  const LUT_PRESETS = [
    { id: "teal_orange", name: "Moody Teal & Orange", color: "from-teal-500 to-amber-500" },
    { id: "cyberpunk", name: "Cyberpunk 2077", color: "from-fuchsia-500 to-cyan-500" },
    { id: "vintage", name: "35mm Film Grain", color: "from-amber-600 to-stone-800" },
    { id: "noir", name: "Noir Monochrome", color: "from-slate-400 to-slate-900" },
    { id: "sunset", name: "Sunset Gold", color: "from-rose-500 to-amber-400" },
    { id: "matrix", name: "Matrix Emerald", color: "from-emerald-500 to-black" },
  ];

  return (
    <div className="w-80 bg-[#0a0c12] border-l border-white/5 flex flex-col h-full overflow-y-auto select-none font-sans text-xs">
      {/* Header */}
      <div className="h-10 px-4 bg-[#05060a] border-b border-white/5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <Sliders className="w-3.5 h-3.5 text-[#3B63FF] flex-shrink-0" />
          <span className="font-bold text-white truncate">{clip.title}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 space-y-5 flex-1">
        {/* Section 0: OmniCut 3D MOTION GRAPHIC CONTROLS */}
        {isMotion && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <Sparkles className="w-3 h-3 text-[#3B63FF]" />
                <span>OmniCut Motion FX</span>
              </div>
              <span className="text-[9px] bg-[#3B63FF]/20 text-[#3B63FF] border border-[#3B63FF]/40 px-1.5 py-0.5 rounded font-mono font-bold">
                Remotion 3D
              </span>
            </div>

            <div className="bg-[#05060a] p-3 rounded-xl border border-white/10 space-y-3">
              <div className="space-y-1">
                <span className="text-slate-400 text-[10px] block">Metric / Label A (Baseline)</span>
                <input
                  type="text"
                  value={motionMetricA}
                  onChange={(e) => setMotionMetricA(e.target.value)}
                  className="w-full bg-[#101319] border border-white/10 rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-[#3B63FF]"
                />
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[10px] block">Metric / Label B (Target Result)</span>
                <input
                  type="text"
                  value={motionMetricB}
                  onChange={(e) => setMotionMetricB(e.target.value)}
                  className="w-full bg-[#101319] border border-white/10 rounded px-2.5 py-1 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400 text-[10px]">Mirror Ground Reflection</span>
                <button
                  onClick={() => setMirrorFloor(!mirrorFloor)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                    mirrorFloor ? "bg-[#3B63FF] text-white" : "bg-white/5 text-slate-500"
                  }`}
                >
                  {mirrorFloor ? "Enabled" : "Disabled"}
                </button>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>Camera 3D Perspective</span>
                  <span className="text-[#3B63FF] font-mono font-bold">{isometricAngle}°</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={isometricAngle}
                  onChange={(e) => setIsometricAngle(Number(e.target.value))}
                  className="w-full accent-[#3B63FF] h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Accent Color Picker */}
              <div className="space-y-1 pt-1">
                <span className="text-slate-400 text-[10px] block">Accent Rim Glow</span>
                <div className="flex items-center gap-2">
                  {["#3B63FF", "#06b6d4", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setMotionAccentColor(c)}
                      className={`w-5 h-5 rounded-full border transition-all ${
                        motionAccentColor === c ? "scale-110 border-white ring-2 ring-white/20" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 1: TRANSFORM (Visual Clips) */}
        {!isAudio && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold uppercase tracking-wider text-[10px]">
              <Move className="w-3 h-3 text-cyan-400" />
              <span>Transform & Scale</span>
            </div>

            <div className="bg-[#05060a] p-3 rounded-xl border border-white/10 space-y-3">
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
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Position X / Y */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="space-y-1">
                  <span className="text-slate-500 text-[10px] block">Position X</span>
                  <div className="flex items-center bg-[#101319] border border-white/10 rounded px-2 py-1">
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
                  <div className="flex items-center bg-[#101319] border border-white/10 rounded px-2 py-1">
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

          <div className="bg-[#05060a] p-3 rounded-xl border border-white/10 space-y-3">
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
                  className="w-full accent-violet-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
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
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
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
              <span className="text-[10px] text-amber-400/90 font-medium truncate max-w-[120px]">{selectedLut}</span>
            </div>

            <div className="bg-[#05060a] p-3 rounded-xl border border-white/10 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {LUT_PRESETS.map((lut) => (
                  <button
                    key={lut.id}
                    onClick={() => setSelectedLut(lut.name)}
                    className={`p-2 rounded-lg border flex flex-col items-start gap-1 transition-all text-left ${
                      selectedLut === lut.name
                        ? "border-[#3B63FF] bg-[#3B63FF]/15 text-white shadow-sm"
                        : "border-white/5 bg-[#101319] text-slate-400 hover:border-white/15"
                    }`}
                  >
                    <div className={`w-full h-2 rounded-full bg-gradient-to-r ${lut.color}`} />
                    <span className="text-[10px] font-medium leading-tight truncate w-full">{lut.name}</span>
                  </button>
                ))}
              </div>

              {/* Sliders: Exposure & Saturation */}
              <div className="space-y-2 pt-2 border-t border-white/5">
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
                    className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
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
                    className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: PRO NLE TRANSITIONS */}
        {!isAudio && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold uppercase tracking-wider text-[10px]">
                <Layers className="w-3 h-3 text-indigo-400" />
                <span>Video Transitions</span>
              </div>
              <span className="text-[10px] text-indigo-400 font-mono">Clean Cut</span>
            </div>

            <div className="bg-[#05060a] p-3 rounded-xl border border-white/10 space-y-3 text-xs">
              {/* Transition In */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>Transition In</span>
                  <span className="text-indigo-400 font-mono">{transitionInDuration}ms</span>
                </div>
                <div className="flex gap-2">
                  <select
                    value={transitionInType}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTransitionInType(val);
                      handleApplyTransitions(val, transitionInDuration, transitionOutType, transitionOutDuration);
                    }}
                    className="flex-1 bg-[#101319] border border-white/10 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="none">None (Hard Cut)</option>
                    <option value="crossDissolve">Cross Dissolve</option>
                    <option value="dipToBlack">Dip to Black</option>
                    <option value="dipToWhite">Dip to White</option>
                    <option value="wipeRight">Wipe Right</option>
                    <option value="zoomBlur">Zoom Blur</option>
                  </select>
                </div>
                {transitionInType !== "none" && (
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="50"
                    value={transitionInDuration}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setTransitionInDuration(val);
                      handleApplyTransitions(transitionInType, val, transitionOutType, transitionOutDuration);
                    }}
                    className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                )}
              </div>

              {/* Transition Out */}
              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>Transition Out</span>
                  <span className="text-indigo-400 font-mono">{transitionOutDuration}ms</span>
                </div>
                <div className="flex gap-2">
                  <select
                    value={transitionOutType}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTransitionOutType(val);
                      handleApplyTransitions(transitionInType, transitionInDuration, val, transitionOutDuration);
                    }}
                    className="flex-1 bg-[#101319] border border-white/10 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="none">None (Hard Cut)</option>
                    <option value="crossDissolve">Cross Dissolve</option>
                    <option value="dipToBlack">Dip to Black</option>
                    <option value="dipToWhite">Dip to White</option>
                    <option value="wipeRight">Wipe Right</option>
                    <option value="zoomBlur">Zoom Blur</option>
                  </select>
                </div>
                {transitionOutType !== "none" && (
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="50"
                    value={transitionOutDuration}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setTransitionOutDuration(val);
                      handleApplyTransitions(transitionInType, transitionInDuration, transitionOutType, val);
                    }}
                    className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Section 5: KEYFRAME ANIMATOR */}
        {!isAudio && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold uppercase tracking-wider text-[10px]">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Keyframe Animator</span>
              </div>
              <button
                onClick={() => setIsKeyframeEnabled(!isKeyframeEnabled)}
                className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold transition-colors ${
                  isKeyframeEnabled ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-slate-800 text-slate-400"
                }`}
              >
                {isKeyframeEnabled ? "ACTIVE" : "OFF"}
              </button>
            </div>

            {isKeyframeEnabled && (
              <div className="bg-[#05060a] p-3 rounded-xl border border-white/10 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span>Motion Easing Curve</span>
                  <span className="text-emerald-400 font-mono uppercase">{keyframeEasing}</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {["linear", "easeInOut", "spring"].map((curve) => (
                    <button
                      key={curve}
                      onClick={() => setKeyframeEasing(curve)}
                      className={`py-1 rounded text-[10px] font-mono border transition-all ${
                        keyframeEasing === curve
                          ? "bg-emerald-600 text-white border-emerald-400"
                          : "bg-[#101319] text-slate-400 border-white/5 hover:border-white/15"
                      }`}
                    >
                      {curve}
                    </button>
                  ))}
                </div>
                <div className="p-2 rounded bg-[#101319] border border-white/5 flex items-center justify-between text-[10px] text-slate-300 font-mono">
                  <span>◆ Start: 100% Scale</span>
                  <span>➜</span>
                  <span className="text-emerald-400">◆ End: {scale}% Scale</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
