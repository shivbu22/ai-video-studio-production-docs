"use client";

import React, { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Layers, 
  Sparkles,
  Plus,
  Play,
  Check,
  Award,
  BookOpen,
  Film,
  Music,
  Mic
} from "lucide-react";

export interface MotionTemplateItem {
  id: string;
  name: string;
  category: "chart" | "quote" | "comparison" | "counter" | "tier" | "layers";
  icon: any;
  defaultProps: any;
}

export interface UploadedClip { id: string; name: string; url: string; type: "video" | "audio" | "image"; duration: string; }

interface AssetBinProps {
  onAddUploadedClip?: (clip: UploadedClip) => void;
  onInsertTemplate: (templateId: string, props: any) => void;
  onApplyLut: (lutName: string) => void;
  onUploadMedia: () => void;
  onOpenAutoBRoll?: () => void;
}

export const AssetBin: React.FC<AssetBinProps> = ({
  onAddUploadedClip,
  onInsertTemplate,
  onApplyLut,
  onUploadMedia,
  onOpenAutoBRoll,
}) => {
  const [activeFolder, setActiveFolder] = useState<"motion" | "footage" | "voice">("motion");
  const [hoveredClipId, setHoveredClipId] = useState<string | null>(null);
  const [scrubPercent, setScrubPercent] = useState<number>(0);
  const [insertedId, setInsertedId] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedClip[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Allowed MIME type whitelist
    const allowedPrefixes = ["video/", "audio/", "image/"];
    const maxFileSize = 500 * 1024 * 1024; // 500MB client guard
    const newClips: UploadedClip[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // File size enforcement
      if (file.size > maxFileSize) {
        continue;
      }

      // MIME type verification
      const isAllowed = allowedPrefixes.some((prefix) => file.type.startsWith(prefix));
      if (!isAllowed) {
        continue;
      }

      // Sanitize filename to prevent HTML injection in DOM
      const sanitizedName = file.name.slice(0, 80).replace(/[<>\/\\&]/g, "_");
      const url = URL.createObjectURL(file);
      const isAudio = file.type.startsWith("audio");
      const isVideo = file.type.startsWith("video");

      const clip: UploadedClip = {
        id: `upload-${Date.now()}-${i}`,
        name: sanitizedName,
        url,
        type: isAudio ? "audio" : isVideo ? "video" : "image",
        duration: "00:05:00",
      };
      newClips.push(clip);
      if (onAddUploadedClip) onAddUploadedClip(clip);
    }

    if (newClips.length > 0) {
      setUploadedFiles((prev) => [...prev, ...newClips]);
      setActiveFolder("footage");
    }
    e.target.value = "";
  };

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
      tagline: "Rank anything live over footage with glass cards",
      icon: Award,
      category: "tier",
      duration: "6.0s",
      defaultProps: { title: "Exercise Tier List", tiers: [{ rank: "S", items: ["Deadlift", "Pull-ups"] }, { rank: "A", items: ["Barbell Row"] }] }
    },
    {
      id: "ResearchPaper",
      name: "Research Paper Lift-Off",
      tagline: "3D camera tilt over peer-reviewed paper citation",
      icon: BookOpen,
      category: "quote",
      duration: "6.5s",
      defaultProps: { title: "Nature 2019 Quantum Supremacy", citation: "Arute et al., Nature 574, 505-510 (2019)" }
    },
    {
      id: "StatCounter",
      name: "Dynamic Stat Multiplier",
      tagline: "Big bold animated numeric counter with metallic sheen",
      icon: TrendingUp,
      category: "counter",
      duration: "4.5s",
      defaultProps: { title: "Calculation Speedup", value: "10,000x", subtitle: "Summit 10,000y -> Sycamore 200s" }
    },
    {
      id: "ExplodedLayers",
      name: "Exploded Layers 3D",
      tagline: "Deconstruct multi-layer graphics into isometric 3D space",
      icon: Layers,
      category: "layers",
      duration: "7.0s",
      defaultProps: { title: "Dilution Refrigerator Cryostat Anatomy", layerCount: 4 }
    }
  ];

  const rawFootageClips = [
    {
      id: "broll-1",
      name: "RAW_BROLL_CRYOSTAT_4K.MP4",
      duration: "00:18:22",
      res: "3840x2160 Â· ProRes 422 HQ",
      fps: "60.00 fps",
      previewColor: "from-blue-900 to-slate-900"
    },
    {
      id: "broll-2",
      name: "MACRO_QUBIT_ARRAY_60FPS.MP4",
      duration: "00:12:45",
      res: "3840x2160 Â· ProRes 422 HQ",
      fps: "60.00 fps",
      previewColor: "from-indigo-900 to-slate-900"
    },
    {
      id: "broll-3",
      name: "SERVER_FARM_DATA_CLUSTER.MP4",
      duration: "00:24:10",
      res: "3840x2160 Â· ProRes 422 HQ",
      fps: "60.00 fps",
      previewColor: "from-slate-900 to-cyan-950"
    }
  ];

  const handleMouseMoveScrub = (e: React.MouseEvent<HTMLDivElement>, clipId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const pct = Math.round((x / rect.width) * 100);
    setHoveredClipId(clipId);
    setScrubPercent(pct);
  };

  const handleMouseLeave = () => {
    setHoveredClipId(null);
    setScrubPercent(0);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0e13] text-slate-100 select-none overflow-hidden font-sans">
      {/* 1. Premiere Pro Bin Folder Selector Bar */}
      <div className="p-2 bg-[#111217] border-b border-[#1c1e27] flex items-center justify-between text-xs">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          multiple 
          accept="video/*,audio/*,image/*" 
          className="hidden" 
        />
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveFolder("motion")}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              activeFolder === "motion" ? "bg-[#252836] text-white font-semibold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>3D Graphics</span>
          </button>
          <button
            onClick={() => setActiveFolder("footage")}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              activeFolder === "footage" ? "bg-[#252836] text-white font-semibold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Film className="w-3 h-3 text-blue-400" />
            <span>Footage</span>
          </button>
          <button
            onClick={() => setActiveFolder("voice")}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              activeFolder === "voice" ? "bg-[#252836] text-white font-semibold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Mic className="w-3 h-3 text-emerald-400" />
            <span>Voice</span>
          </button>
        </div>

        {onOpenAutoBRoll && (
          <button
            id="btn-open-auto-broll"
            onClick={onOpenAutoBRoll}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/50 transition-colors shadow-sm"
            title="AI Automatic B-Roll Inserter"
          >
            <Sparkles className="w-3 h-3 text-cyan-300" />
            <span>Auto B-Roll</span>
          </button>
        )}
      </div>

      {/* 2. Folder Content Area */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {/* Folder: 3D Motion Templates */}
        {activeFolder === "motion" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
              <span className="font-medium text-slate-300">Remotion 3D Engine ({slotTemplates.length})</span>
              <span className="text-[10px] font-mono text-slate-500">60 FPS WebGL</span>
            </div>

            {slotTemplates.map((t) => {
              const Icon = t.icon;
              const isInserted = insertedId === t.id;
              return (
                <div
                  key={t.id}
                  className="bg-[#12131a] hover:bg-[#161722] border border-[#1e202a] hover:border-[#2b2e3c] rounded p-2.5 transition-all group"
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded bg-[#3B63FF]/15 flex items-center justify-center text-[#9fb4ff]">
                        <Icon className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-semibold text-white leading-tight">
                        {t.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-black/40 px-1 py-0.5 rounded">
                      {t.duration}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug mb-2 pl-6">
                    {t.tagline}
                  </p>

                  <div className="flex items-center justify-between pl-6 pt-1 border-t border-white/5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{t.category}</span>
                    <button
                      onClick={() => {
                        onInsertTemplate(t.id, t.defaultProps);
                        setInsertedId(t.id);
                        setTimeout(() => setInsertedId(null), 1500);
                      }}
                      className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded transition-colors ${
                        isInserted
                          ? "bg-emerald-600 text-white"
                          : "text-[#9fb4ff] hover:text-white bg-[#3B63FF]/20 hover:bg-[#3B63FF]"
                      }`}
                    >
                      {isInserted ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      <span>{isInserted ? "Inserted" : "Add to Timeline"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Folder: Raw Footage with Real-Time Hover Scrubbing */}
        {activeFolder === "footage" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
              <span className="font-medium text-slate-300">Media Bins ({rawFootageClips.length + uploadedFiles.length})</span>
              <span className="text-[10px] font-mono text-[#3B63FF]">Hover to Scrub</span>
            </div>

            {/* Uploaded User Clips */}
            {uploadedFiles.map((up) => (
              <div
                key={up.id}
                className="bg-[#12131a] border border-[#2e3448] hover:border-[#3B63FF] rounded overflow-hidden transition-all group p-2"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold text-white truncate">{up.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/20">
                    USER MEDIA
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span className="capitalize">{up.type}</span>
                  <button
                    onClick={() => {
                      if (onAddUploadedClip) onAddUploadedClip(up);
                    }}
                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-[#3B63FF] hover:bg-[#4f73ff] text-white rounded transition-colors"
                  >
                    <Plus className="w-2.5 h-2.5" />
                    <span>Insert into Timeline</span>
                  </button>
                </div>
              </div>
            ))}

            {rawFootageClips.map((clip) => {
              const isHovered = hoveredClipId === clip.id;
              return (
                <div
                  key={clip.id}
                  className="bg-[#12131a] border border-[#1e202a] hover:border-[#2b2e3c] rounded overflow-hidden transition-all group"
                >
                  {/* Hover Scrubber Canvas Bar */}
                  <div
                    onMouseMove={(e) => handleMouseMoveScrub(e, clip.id)}
                    onMouseLeave={handleMouseLeave}
                    className={`h-16 w-full bg-gradient-to-r ${clip.previewColor} relative flex items-center justify-center cursor-ew-resize overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-black/20" />
                    
                    {/* Scrubbing playhead laser */}
                    {isHovered && (
                      <div
                        className="absolute top-0 bottom-0 w-[2px] bg-red-500 pointer-events-none shadow-sm shadow-red-500/50"
                        style={{ left: `${scrubPercent}%` }}
                      />
                    )}

                    {/* Timecode Badge on Scrubber */}
                    <div className="absolute top-1.5 left-2 bg-black/70 backdrop-blur px-1.5 py-0.5 rounded text-[10px] font-mono text-white flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${isHovered ? "bg-red-500 animate-pulse" : "bg-emerald-400"}`} />
                      <span>{isHovered ? `00:00:${Math.floor((scrubPercent / 100) * 18).toString().padStart(2, "0")}:15` : clip.duration}</span>
                    </div>

                    <div className="text-[10px] font-mono text-slate-300/80 pointer-events-none">
                      {isHovered ? `SCRUBBING ${scrubPercent}%` : "HOVER TO PREVIEW"}
                    </div>
                  </div>

                  {/* Metadata & Actions */}
                  <div className="p-2 space-y-1">
                    <span className="text-xs font-semibold text-white block truncate">
                      {clip.name}
                    </span>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>{clip.res}</span>
                      <span>{clip.fps}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Folder: Cleaned Voiceover */}
        {activeFolder === "voice" && (
          <div className="space-y-2">
            <div className="bg-[#12131a] border border-[#1e202a] rounded p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-white">voice_clean.wav (48kHz Master)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Silences cut from 800ms to 250ms with 15ms cross-fades. -14.0 LUFS broadcast safe.
              </p>
              <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                Loudness: -14.0 LUFS Â· 0 Words Clipped
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
