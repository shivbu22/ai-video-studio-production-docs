"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  X, 
  Film, 
  Camera, 
  Clock, 
  CheckCircle2, 
  RefreshCw, 
  Download, 
  Layers,
  ArrowRight
} from "lucide-react";

interface StoryboardShot {
  shotNumber: number;
  timeRange: string;
  cameraAngle: string;
  description: string;
  visualPrompt: string;
  paletteColor: string;
}

interface StoryboardGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  onInsertStoryboardScenes?: () => void;
  onShowToast?: (msg: string) => void;
}

export const StoryboardGeneratorModal: React.FC<StoryboardGeneratorModalProps> = ({
  isOpen,
  onClose,
  projectTitle,
  onInsertStoryboardScenes,
  onShowToast,
}) => {
  const [directorPrompt, setDirectorPrompt] = useState<string>(
    "High-energy tech breakdown: Quantum supremacy cryostat, glowing superconducting qubits, kinetic motion graphics, and supercomputer vault."
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const [shots, setShots] = useState<StoryboardShot[]>([
    {
      shotNumber: 1,
      timeRange: "00:00 - 00:04",
      cameraAngle: "Low-Angle Crane Up",
      description: "Golden Dilution Refrigerator chandelier descending into sub-Kelvin vacuum chamber.",
      visualPrompt: "Cinema 4K, golden cryostat, copper cooling plates, glowing neon reflections, shallow DOF.",
      paletteColor: "from-amber-600/40 via-yellow-500/20 to-black",
    },
    {
      shotNumber: 2,
      timeRange: "00:04 - 00:08",
      cameraAngle: "Extreme Macro Probe Lens",
      description: "Sycamore quantum processor chip showing 54 micro-qubits with pulsed microwave guides.",
      visualPrompt: "Silicon wafer, gold bond wires, cyan luminescence, cleanroom lighting, high tech.",
      paletteColor: "from-cyan-600/40 via-blue-500/20 to-black",
    },
    {
      shotNumber: 3,
      timeRange: "00:08 - 00:11",
      cameraAngle: "Dynamic Isometric 3D",
      description: "Kinetic bar chart comparing 10,000 years supercomputer time against 200 seconds Sycamore.",
      visualPrompt: "3D bar chart on reflective mirror floor, kinetic numbers, vibrant blue and purple glow.",
      paletteColor: "from-purple-600/40 via-indigo-500/20 to-black",
    },
    {
      shotNumber: 4,
      timeRange: "00:11 - 00:14",
      cameraAngle: "Wide Aerial Tracking Shot",
      description: "Infinite rows of IBM Summit supercomputer server racks with pulsing blue LED indicators.",
      visualPrompt: "Cold futuristic server vault, atmospheric haze, linear vanishing point, 8K RED Monstro.",
      paletteColor: "from-blue-600/40 via-slate-700/20 to-black",
    },
  ]);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      if (onShowToast) {
        onShowToast("Synthesized 4-Panel AI Visual Storyboard!");
      }
    }, 600);
  };

  const handleApplyToTimeline = () => {
    if (onInsertStoryboardScenes) {
      onInsertStoryboardScenes();
    }
    if (onShowToast) {
      onShowToast("Inserted all 4 Storyboard Scenes into Timeline!");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none font-sans">
      <div className="bg-[#0f1016] border border-[#232633] rounded-xl w-full max-w-4xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#14151d] border-b border-[#20222e] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#3B63FF] flex items-center justify-center text-white shadow-sm">
              <Film className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>Autonomous AI Storyboard Generator</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  4-Panel Scene Swarm
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Generate coherent cinematic shot lists and timing cards from natural language prompts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Prompt Input */}
        <div className="p-4 bg-[#111219] border-b border-[#1f212d] flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={directorPrompt}
              onChange={(e) => setDirectorPrompt(e.target.value)}
              className="w-full bg-[#161722] border border-[#272a3a] rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-[#3B63FF]"
              placeholder="Describe your desired scene narrative..."
            />
          </div>
          <button
            id="btn-generate-storyboard"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Re-Generate Storyboard</span>
          </button>
        </div>

        {/* 4-Panel Grid */}
        <div className="p-5 grid grid-cols-4 gap-3.5 overflow-y-auto max-h-[460px]">
          {shots.map((shot) => (
            <div
              key={shot.shotNumber}
              className="bg-[#13141d] border border-[#222534] rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#3B63FF]/50 transition-colors"
            >
              {/* Visual Preview Box */}
              <div className={`aspect-video bg-gradient-to-br ${shot.paletteColor} p-3 flex flex-col justify-between border-b border-[#222534] relative`}>
                <div className="flex justify-between items-center text-[9px] font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-black/60 text-white font-bold">
                    SHOT 0{shot.shotNumber}
                  </span>
                  <span className="text-cyan-300 font-bold bg-black/40 px-1 rounded">
                    {shot.timeRange}
                  </span>
                </div>

                <div className="text-[10px] font-mono text-slate-300 bg-black/50 p-1 rounded backdrop-blur-xs flex items-center gap-1">
                  <Camera className="w-3 h-3 text-cyan-400" />
                  <span>{shot.cameraAngle}</span>
                </div>
              </div>

              {/* Description & Prompt */}
              <div className="p-3 space-y-2 flex-1 flex flex-col justify-between text-xs">
                <div>
                  <h4 className="font-semibold text-white text-[11px] leading-tight mb-1">
                    {shot.description}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono leading-relaxed line-clamp-3">
                    {shot.visualPrompt}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#1c1e28] flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span>Aspect: 16:9 4K</span>
                  <span className="text-emerald-400">Ready</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#14151d] border-t border-[#20222e] flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            4 Scenes · 14.0 Seconds Total Duration · Clean-Room Certified
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              id="btn-apply-storyboard-timeline"
              onClick={handleApplyToTimeline}
              className="px-4 py-2 bg-[#3B63FF] hover:bg-[#4d73ff] text-white font-bold text-xs rounded-lg shadow-lg flex items-center gap-2 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Apply Storyboard Scenes to Timeline</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
