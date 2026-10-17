"use client";

import React, { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Quote, 
  Columns3, 
  Layers, 
  Sparkles,
  Download,
  Plus,
  Play,
  Check,
  Award,
  BookOpen
} from "lucide-react";

export interface MotionTemplateItem {
  id: string;
  name: string;
  category: "chart" | "quote" | "comparison" | "counter" | "tier" | "layers";
  icon: any;
  defaultProps: any;
}

interface AssetBinProps {
  onInsertTemplate: (templateId: string, props: any) => void;
  onApplyLut: (lutName: string) => void;
  onUploadMedia: () => void;
}

export const AssetBin: React.FC<AssetBinProps> = ({
  onInsertTemplate,
  onApplyLut,
  onUploadMedia,
}) => {
  const [activeCategory, setActiveCategory] = useState<"motion" | "luts" | "audio">("motion");
  const [insertedId, setInsertedId] = useState<string | null>(null);

  const slotTemplates = [
    {
      id: "BarChart",
      name: "3D Chrome Bar Chart",
      tagline: "Chrome bars on mirror floor with live metrics",
      icon: BarChart3,
      category: "chart",
      duration: "5.5s",
      defaultProps: { title: "Speedup vs Classical Supercomputer", data: [{ label: "Summit", value: 10000 }, { label: "Sycamore", value: 200 }] }
    },
    {
      id: "TierList",
      name: "Glass Tier List",
      tagline: "Rank anything live over your footage with glass cards",
      icon: Award,
      category: "tier",
      duration: "6.0s",
      defaultProps: { title: "Exercise Tier List", tiers: [{ rank: "S", items: ["Deadlift", "Pull-ups"] }, { rank: "A", items: ["Barbell Row"] }] }
    },
    {
      id: "ResearchPaper",
      name: "Research Paper Lift",
      tagline: "Scientific journal curls up with highlighted findings",
      icon: BookOpen,
      category: "quote",
      duration: "4.5s",
      defaultProps: { journal: "Nature 2019", quote: "Quantum supremacy experimentally achieved." }
    },
    {
      id: "StatCounter",
      name: "Metric Stat Counter",
      tagline: "Count-up animation landing on the spoken word",
      icon: TrendingUp,
      category: "counter",
      duration: "4.5s",
      defaultProps: { label: "Computation Speedup", targetValue: 10000, suffix: "x" }
    },
    {
      id: "ExplodedLayers",
      name: "Exploded Layers FX",
      tagline: "Footage, graphics, captions & sound pulled apart in 3D",
      icon: Layers,
      category: "layers",
      duration: "4.0s",
      defaultProps: { layers: ["Footage 4K", "Chrome Graphics", "Audio Ducking", "Word Sync"] }
    },
    {
      id: "QuoteCard",
      name: "Cinematic Quote Card",
      tagline: "Director quotation with glassmorphic backdrop",
      icon: Quote,
      category: "quote",
      duration: "4.0s",
      defaultProps: { quote: "For the last month, every long-form video has been edited by this tool.", author: "Siddharth Dev" }
    }
  ];

  const luts = [
    { name: "Moody Teal & Orange", desc: "Hollywood blockbuster aesthetic" },
    { name: "Cyberpunk Neon 2077", desc: "High-contrast blues & magenta" },
    { name: "Vintage 35mm Film", desc: "Warm Kodak Portra organic tones" },
    { name: "Monochrome Film Noir", desc: "Deep rich contrast black & white" },
  ];

  const handleInsert = (tmpl: typeof slotTemplates[0]) => {
    onInsertTemplate(tmpl.id, tmpl.defaultProps);
    setInsertedId(tmpl.id);
    setTimeout(() => setInsertedId(null), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-[#05060a] select-none text-xs text-slate-200 border-r border-white/5 overflow-hidden">
      {/* Header */}
      <div className="p-3.5 bg-[#0a0c12] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#3B63FF]" />
          <span className="font-bold text-white text-xs tracking-wide">Motion Studio & FX Bin</span>
        </div>
        <span className="text-[10px] bg-[#3B63FF]/15 text-[#9fb4ff] font-semibold px-2 py-0.5 rounded-full border border-[#3B63FF]/30">
          Remotion 4+
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex bg-[#0a0c12] p-1.5 border-b border-white/5 gap-1">
        <button
          onClick={() => setActiveCategory("motion")}
          className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
            activeCategory === "motion" ? "bg-[#3B63FF] text-white shadow" : "text-slate-400 hover:text-white"
          }`}
        >
          Motion Graphics
        </button>
        <button
          onClick={() => setActiveCategory("luts")}
          className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
            activeCategory === "luts" ? "bg-[#3B63FF] text-white shadow" : "text-slate-400 hover:text-white"
          }`}
        >
          3D Cinema LUTs
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeCategory === "motion" && (
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-white">Then it edits like a motion studio.</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                3D chrome charts, research that lifts off the page, glass tier lists, and sound on every cut.
              </p>
            </div>

            <div className="space-y-2.5">
              {slotTemplates.map((tmpl) => {
                const IconComponent = tmpl.icon;
                const isJustInserted = insertedId === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    className="p-3 bg-[#10131b] rounded-xl border border-white/5 hover:border-white/15 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#3B63FF]/20 border border-[#3B63FF]/40 text-[#9fb4ff] flex items-center justify-center">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">{tmpl.name}</h4>
                          <span className="text-[10px] text-slate-400 block">{tmpl.tagline}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                        {tmpl.duration}
                      </span>
                    </div>

                    <button
                      onClick={() => handleInsert(tmpl)}
                      className={`w-full py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                        isJustInserted
                          ? "bg-emerald-600 text-white"
                          : "bg-white/5 hover:bg-[#3B63FF] hover:text-white text-slate-300"
                      }`}
                    >
                      {isJustInserted ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added to V2 Motion Track!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Insert to V2 Track at Playhead</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeCategory === "luts" && (
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-white">3D Color Cinema Looks</h3>
              <p className="text-[11px] text-slate-400 mt-1">
                One-click Hollywood color grading calibrated for high dynamic range YouTube footage.
              </p>
            </div>

            <div className="space-y-2">
              {luts.map((lut) => (
                <div
                  key={lut.name}
                  onClick={() => onApplyLut(lut.name)}
                  className="p-3 bg-[#10131b] rounded-xl border border-white/5 hover:border-[#3B63FF] cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white">{lut.name}</h4>
                    <span className="text-[10px] text-slate-400">{lut.desc}</span>
                  </div>
                  <button className="px-2.5 py-1 rounded bg-[#3B63FF]/20 text-cyan-300 font-semibold text-[10px]">
                    Apply Look
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
