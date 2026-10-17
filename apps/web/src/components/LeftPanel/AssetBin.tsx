"use client";

import React, { useState } from "react";
import { 
  UploadCloud, 
  BarChart3, 
  LineChart, 
  TrendingUp, 
  Quote, 
  Columns3, 
  Layers, 
  Film, 
  Music, 
  Mic, 
  Plus,
  Palette,
  Sparkles,
  Volume2
} from "lucide-react";

export interface MotionTemplateItem {
  id: string;
  name: string;
  category: "chart" | "quote" | "comparison" | "counter";
  icon: any;
  defaultProps: any;
}

const TEMPLATES: MotionTemplateItem[] = [
  {
    id: "BarChart",
    name: "Bar Chart",
    category: "chart",
    icon: BarChart3,
    defaultProps: { title: "Performance Comparison", data: [{ label: "A", value: 10 }, { label: "B", value: 25 }] }
  },
  {
    id: "StatCounter",
    name: "Metric Counter",
    category: "counter",
    icon: TrendingUp,
    defaultProps: { label: "Global Speedup", targetValue: 10000, prefix: "", suffix: "x" }
  },
  {
    id: "QuoteCard",
    name: "Pull Quote",
    category: "quote",
    icon: Quote,
    defaultProps: { quote: "Quantum will redefine computation.", author: "Physicist" }
  },
  {
    id: "Comparison",
    name: "Side-by-Side",
    category: "comparison",
    icon: Columns3,
    defaultProps: { leftTitle: "Classical", rightTitle: "Quantum" }
  },
  {
    id: "LineChart",
    name: "Trend Line",
    category: "chart",
    icon: LineChart,
    defaultProps: { title: "Compute Growth" }
  },
  {
    id: "TierList",
    name: "Tier Ranking",
    category: "comparison",
    icon: Layers,
    defaultProps: { title: "Architecture Tiers" }
  }
];

const LUTS = [
  { id: "teal_orange", name: "Teal & Orange Blockbuster", desc: "High contrast cinematic Hollywood look", grad: "from-teal-500 to-amber-500" },
  { id: "cyberpunk", name: "Cyberpunk Neon 2077", desc: "Vibrant ultraviolet and electric cyan tones", grad: "from-fuchsia-500 to-cyan-500" },
  { id: "vintage", name: "Vintage 35mm Film Grain", desc: "Warm kodak roll tone with gentle halation", grad: "from-amber-600 to-stone-800" },
  { id: "noir", name: "Noir Black & White", desc: "High dynamic range dramatic monochrome", grad: "from-slate-400 to-slate-950" },
  { id: "sunset", name: "Sunset Golden Hour", desc: "Rich amber highlights with soft shadows", grad: "from-rose-500 to-amber-400" },
  { id: "clean", name: "Clean Broadcast 6500K", desc: "Color calibrated neutral reference grade", grad: "from-sky-400 to-blue-600" },
];

const AUDIO_TRACKS = [
  { id: "a_bg_1", title: "Cybernetic Horizon Bed", type: "Music Bed", duration: "02:45", bpm: "120 BPM", ducked: true },
  { id: "a_bg_2", title: "Ambient Deep Focus", type: "Music Bed", duration: "03:10", bpm: "85 BPM", ducked: true },
  { id: "a_sfx_1", title: "Cinematic Sub Bass Drop", type: "SFX Whoosh", duration: "00:03", bpm: "-", ducked: false },
  { id: "a_sfx_2", title: "Data Stream Pop Riser", type: "SFX Riser", duration: "00:02", bpm: "-", ducked: false },
];

interface AssetBinProps {
  onInsertTemplate: (template: MotionTemplateItem) => void;
  onApplyLut?: (lutName: string) => void;
  onUploadMedia: () => void;
}

export const AssetBin: React.FC<AssetBinProps> = ({
  onInsertTemplate,
  onApplyLut,
  onUploadMedia,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"templates" | "luts" | "audio" | "stock">("templates");

  return (
    <div className="flex flex-col h-full bg-studio-900 select-none text-xs">
      {/* Bin Sub-Tab Header */}
      <div className="p-2 border-b border-studio-800 flex items-center justify-between">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveSubTab("templates")}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              activeSubTab === "templates" ? "bg-violet-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Motion FX
          </button>
          <button
            onClick={() => setActiveSubTab("luts")}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              activeSubTab === "luts" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            LUTs
          </button>
          <button
            onClick={() => setActiveSubTab("audio")}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              activeSubTab === "audio" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Audio
          </button>
          <button
            onClick={() => setActiveSubTab("stock")}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              activeSubTab === "stock" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Stock
          </button>
        </div>

        <button
          onClick={onUploadMedia}
          className="flex items-center gap-1 bg-studio-800 hover:bg-studio-700 text-slate-200 px-2 py-1 rounded border border-studio-700 text-[11px]"
        >
          <UploadCloud className="w-3 h-3 text-cyan-400" />
          <span>Import</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {/* 1. Motion Templates */}
        {activeSubTab === "templates" && (
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATES.map((tmpl) => {
              const Icon = tmpl.icon;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => onInsertTemplate(tmpl)}
                  className="p-3 bg-studio-950/80 hover:bg-studio-800 border border-studio-800 hover:border-violet-500/60 rounded-lg cursor-pointer transition-all flex flex-col justify-between h-24 group shadow-sm active:scale-95"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
                    <button className="opacity-0 group-hover:opacity-100 bg-violet-600 text-white p-1 rounded-full shadow transition-opacity">
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200 text-[11px] block">{tmpl.name}</span>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">{tmpl.category}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. Cinematic LUTs */}
        {activeSubTab === "luts" && (
          <div className="space-y-2">
            {LUTS.map((lut) => (
              <div
                key={lut.id}
                onClick={() => onApplyLut?.(lut.name)}
                className="p-3 bg-studio-950/80 hover:bg-studio-800 border border-studio-800 hover:border-amber-500/60 rounded-lg cursor-pointer transition-all flex items-center justify-between group active:scale-95 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${lut.grad} shadow-sm`} />
                    <span className="font-semibold text-slate-200 text-xs">{lut.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-500">{lut.desc}</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 px-2 py-1 rounded bg-amber-600 text-white font-medium text-[10px] shadow transition-opacity">
                  Apply
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 3. Audio & SFX */}
        {activeSubTab === "audio" && (
          <div className="space-y-2">
            {AUDIO_TRACKS.map((track) => (
              <div
                key={track.id}
                className="p-2.5 bg-studio-950/80 hover:bg-studio-800 border border-studio-800 rounded-lg flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <Music className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-medium text-slate-200 text-xs block">{track.title}</span>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span>{track.type}</span>
                      <span>•</span>
                      <span>{track.duration}</span>
                      {track.ducked && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400 font-medium">Auto-ducked</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button className="px-2 py-1 rounded bg-studio-800 hover:bg-emerald-600 text-slate-300 hover:text-white text-[10px] font-medium transition-colors">
                  Add to A2
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 4. Stock B-Roll */}
        {activeSubTab === "stock" && (
          <div className="grid grid-cols-2 gap-2">
            {[
              { title: "Dilution Refrigerator Macro", source: "Pexels (Licensed)", dur: "06.5s" },
              { title: "Quantum Qubit Waveform", source: "Pixabay (Licensed)", dur: "07.5s" },
              { title: "Supercomputer Server Core", source: "Fal Flux (Generative)", dur: "05.0s" },
              { title: "Deep Tech Lab Microchip", source: "Pexels (Licensed)", dur: "08.0s" },
            ].map((stock, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-studio-950/80 hover:bg-studio-800 border border-studio-800 hover:border-cyan-500/50 rounded-lg cursor-pointer transition-all flex flex-col justify-between h-24"
              >
                <div className="flex justify-between items-center">
                  <Film className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] font-mono text-slate-500">{stock.dur}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-200 text-[11px] block leading-tight truncate">{stock.title}</span>
                  <span className="text-[9px] text-slate-500">{stock.source}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
