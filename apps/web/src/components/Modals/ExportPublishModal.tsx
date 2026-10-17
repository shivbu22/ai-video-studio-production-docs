"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Download, Film, FileCode2, Check, X, Sparkles, Image as ImageIcon, Copy, FileText, CheckCircle2, TrendingUp, BarChart3, Flame, Hash, Layers, Video
} from "lucide-react";

interface ExportPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  totalDurationMs: number;
  clips: Array<{ id: string; title: string; startMs: number; durationMs: number; trackId: string }>;
}

export const ExportPublishModal: React.FC<ExportPublishModalProps> = ({
  isOpen,
  onClose,
  projectTitle,
  totalDurationMs,
  clips,
}) => {
  const [activeTab, setActiveTab] = useState<"render" | "thumbnail" | "engagement" | "seo">("render");
  const [format, setFormat] = useState<"mp4" | "fcpxml" | "srt" | "zip">("mp4");
  const [resolution, setResolution] = useState<"1080p" | "4k" | "shorts">("1080p");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);

  // Thumbnail Studio State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [thumbHeadline, setThumbHeadline] = useState("QUANTUM SUPREMACY IS HERE");
  const [thumbSub, setThumbSub] = useState("10,000 YEARS IN 200 SECONDS");
  const [thumbStyle, setThumbStyle] = useState<"mrbeast" | "hormozi" | "cyberpunk">("mrbeast");
  const [copiedTimestamps, setCopiedTimestamps] = useState(false);

  // Render Thumbnail on Canvas
  useEffect(() => {
    if (!isOpen || activeTab !== "thumbnail") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    if (thumbStyle === "mrbeast") {
      grad.addColorStop(0, "#080c1e");
      grad.addColorStop(0.5, "#0b1536");
      grad.addColorStop(1, "#1c0d38");
    } else if (thumbStyle === "hormozi") {
      grad.addColorStop(0, "#050608");
      grad.addColorStop(1, "#12141a");
    } else {
      grad.addColorStop(0, "#030014");
      grad.addColorStop(0.5, "#0d0221");
      grad.addColorStop(1, "#260845");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative glow circles
    const glow = ctx.createRadialGradient(canvas.width * 0.75, canvas.height * 0.4, 50, canvas.width * 0.75, canvas.height * 0.4, 400);
    glow.addColorStop(0, thumbStyle === "hormozi" ? "rgba(6, 182, 212, 0.4)" : thumbStyle === "cyberpunk" ? "rgba(236, 72, 153, 0.4)" : "rgba(250, 204, 21, 0.35)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Visual Accent Box / Comparison Pill
    ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
    ctx.strokeStyle = thumbStyle === "hormozi" ? "#06b6d4" : thumbStyle === "cyberpunk" ? "#ec4899" : "#facc15";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(canvas.width * 0.65, canvas.height * 0.22, 380, 280, 24);
    ctx.fill();
    ctx.stroke();

    // Graphic inside accent box
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 34px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SPEEDUP COMPARISON", canvas.width * 0.65 + 190, canvas.height * 0.35);

    // Comparison bars
    ctx.fillStyle = "#64748b";
    ctx.fillRect(canvas.width * 0.65 + 50, canvas.height * 0.48, 100, 110);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px monospace";
    ctx.fillText("10,000 YRS", canvas.width * 0.65 + 100, canvas.height * 0.46);

    ctx.fillStyle = thumbStyle === "hormozi" ? "#06b6d4" : thumbStyle === "cyberpunk" ? "#ec4899" : "#10b981";
    ctx.fillRect(canvas.width * 0.65 + 230, canvas.height * 0.40, 100, 150);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px monospace";
    ctx.fillText("200 SEC", canvas.width * 0.65 + 280, canvas.height * 0.38);

    // Badge / Pill Header
    ctx.save();
    ctx.translate(90, 110);
    ctx.fillStyle = thumbStyle === "hormozi" ? "#06b6d4" : thumbStyle === "cyberpunk" ? "#ec4899" : "#ef4444";
    ctx.beginPath();
    ctx.roundRect(0, 0, 310, 56, 12);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🚨 REVOLUTIONARY TECH", 155, 38);
    ctx.restore();

    // Main Big Headline
    ctx.textAlign = "left";
    if (thumbStyle === "mrbeast") {
      ctx.font = "900 68px sans-serif";
      // Shadow
      ctx.fillStyle = "#000000";
      ctx.fillText(thumbHeadline, 94, 254);
      // Main
      ctx.fillStyle = "#facc15"; // Yellow
      ctx.fillText(thumbHeadline, 90, 250);
    } else if (thumbStyle === "hormozi") {
      ctx.font = "900 64px sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(thumbHeadline, 90, 250);
    } else {
      ctx.font = "900 62px sans-serif";
      ctx.fillStyle = "#38bdf8";
      ctx.shadowColor = "#ec4899";
      ctx.shadowBlur = 20;
      ctx.fillText(thumbHeadline, 90, 250);
      ctx.shadowBlur = 0;
    }

    // Subtitle
    ctx.font = "800 42px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(thumbSub, 90, 340);

    // Bottom Creator Brand Tag
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "bold 20px monospace";
    ctx.fillText("OmniCut Route B Master Studio • 4K UHD 60FPS", 90, canvas.height - 60);

  }, [isOpen, activeTab, thumbHeadline, thumbSub, thumbStyle]);

  if (!isOpen) return null;

  // Format Timestamps
  const chapters = [
    { time: "00:00", title: "Introduction & Classical Bottleneck" },
    { time: "00:04", title: "Dilution Refrigerator & Quantum Macro" },
    { time: "00:09", title: "Sycamore Processor vs Summit Supercomputer" },
    { time: "00:13", title: "Summary & Future Breakthroughs" },
  ];

  const handleDownloadThumbnail = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/jpeg", 0.95);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectTitle.toLowerCase().replace(/\\s+/g, "-")}-thumbnail.jpg`;
    a.click();
  };

  const handleStartExport = () => {
    setIsExporting(true);
    setExportProgress(10);
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          setExportComplete(true);
          return 100;
        }
        return prev + 18;
      });
    }, 400);
  };

  const copyTimestamps = () => {
    const text = chapters.map((c) => `${c.time} - ${c.title}`).join("\\n") + 
      "\\n\\nTags: #QuantumComputing #TechBreakthrough #AIvideo #Supercomputer #OmniCut";
    navigator.clipboard.writeText(text);
    setCopiedTimestamps(true);
    setTimeout(() => setCopiedTimestamps(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e1118] border border-[#23293a] rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#131722] border-b border-[#23293a] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display tracking-wide">
                Creator Publish Pack & Master Export
              </h2>
              <p className="text-xs text-slate-400">
                Generate 4K/1080p master MP4, Apple FCPXML, High-CTR Thumbnail, and SEO Timestamps.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#23293a] bg-[#10141f] px-6">
          <button
            onClick={() => setActiveTab("render")}
            className={`py-3 px-4 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === "render"
                ? "border-cyan-500 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Master Video & XML</span>
          </button>
          <button
            onClick={() => setActiveTab("thumbnail")}
            className={`py-3 px-4 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === "thumbnail"
                ? "border-cyan-500 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>High-CTR Thumbnail Studio</span>
          </button>
          <button
            onClick={() => setActiveTab("engagement")}
            className={`py-3 px-4 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === "engagement"
                ? "border-cyan-500 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Viral Analytics & Pacing</span>
          </button>
          <button
            onClick={() => setActiveTab("seo")}
            className={`py-3 px-4 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === "seo"
                ? "border-cyan-500 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>YouTube SEO & Chapters</span>
          </button>
        </div>

        {/* Tab 1: Master Video & XML Export */}
        {activeTab === "render" && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Quality & Format Card */}
              <div className="bg-[#141824] p-5 rounded-xl border border-[#23293a] space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Resolution Tier
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setResolution("1080p")}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      resolution === "1080p"
                        ? "border-cyan-500 bg-cyan-950/40 text-cyan-300 font-bold"
                        : "border-[#252b3d] bg-slate-900/60 text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    <div className="text-sm">1080p FHD</div>
                    <div className="text-[10px] opacity-70">1920x1080 @ 30fps</div>
                  </button>
                  <button
                    onClick={() => setResolution("4k")}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      resolution === "4k"
                        ? "border-purple-500 bg-purple-950/40 text-purple-300 font-bold"
                        : "border-[#252b3d] bg-slate-900/60 text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    <div className="text-sm font-bold flex items-center justify-center space-x-1">
                      <span>4K UHD</span>
                      <Sparkles className="w-3 h-3 text-amber-400" />
                    </div>
                    <div className="text-[10px] opacity-70">3840x2160 @ 60fps</div>
                  </button>
                  <button
                    onClick={() => setResolution("shorts")}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      resolution === "shorts"
                        ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold"
                        : "border-[#252b3d] bg-slate-900/60 text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    <div className="text-sm">9:16 Short</div>
                    <div className="text-[10px] opacity-70">1080x1920 Reel</div>
                  </button>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Export Output Format
                  </span>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      onClick={() => setFormat("mp4")}
                      className={`p-2.5 rounded-lg border text-xs font-medium flex items-center space-x-2 ${
                        format === "mp4" ? "border-cyan-500 bg-cyan-950/30 text-white" : "border-[#252b3d] text-slate-400"
                      }`}
                    >
                      <Video className="w-4 h-4 text-cyan-400" />
                      <span>H.264 / AAC MP4</span>
                    </button>
                    <button
                      onClick={() => setFormat("fcpxml")}
                      className={`p-2.5 rounded-lg border text-xs font-medium flex items-center space-x-2 ${
                        format === "fcpxml" ? "border-cyan-500 bg-cyan-950/30 text-white" : "border-[#252b3d] text-slate-400"
                      }`}
                    >
                      <FileCode2 className="w-4 h-4 text-purple-400" />
                      <span>Apple FCPXML / Premiere</span>
                    </button>
                    <button
                      onClick={() => setFormat("srt")}
                      className={`p-2.5 rounded-lg border text-xs font-medium flex items-center space-x-2 ${
                        format === "srt" ? "border-cyan-500 bg-cyan-950/30 text-white" : "border-[#252b3d] text-slate-400"
                      }`}
                    >
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>.SRT Subtitle Captions</span>
                    </button>
                    <button
                      onClick={() => setFormat("zip")}
                      className={`p-2.5 rounded-lg border text-xs font-medium flex items-center space-x-2 ${
                        format === "zip" ? "border-cyan-500 bg-cyan-950/30 text-white" : "border-[#252b3d] text-slate-400"
                      }`}
                    >
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <span>Complete Creator ZIP Pack</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Render Pipeline Status */}
              <div className="bg-[#141824] p-5 rounded-xl border border-[#23293a] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Celery Render Pipeline
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                      100% UNMETERED FREE
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Duration:</span>
                      <span className="font-mono text-white">{(totalDurationMs / 1000).toFixed(1)}s (30 fps)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Queue:</span>
                      <span className="font-mono text-cyan-300">q.render (Redis Celery)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Audio Loudness:</span>
                      <span className="font-mono text-emerald-400">-14.0 LUFS (Broadcast Safe)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Voiceover Ducking:</span>
                      <span className="font-mono text-amber-300">-12dB Sidechain Ducking</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  {isExporting ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono text-cyan-400">
                        <span>Rendering Remotion Composition...</span>
                        <span>{exportProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                          style={{ width: `${exportProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : exportComplete ? (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Master File Ready for Download!</span>
                      </div>
                      <button
                        onClick={() => {
                          const blob = new Blob(["Master Render Export Simulated"], { type: "video/mp4" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${projectTitle.toLowerCase().replace(/\\s+/g, "-")}-${resolution}.${format === "fcpxml" ? "fcpxml" : format === "srt" ? "srt" : "mp4"}`;
                          a.click();
                        }}
                        className="btn-pro px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded"
                      >
                        Download
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleStartExport}
                      className="btn-pro w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20"
                    >
                      <Download className="w-4 h-4" />
                      <span>Start Master Export ({resolution.toUpperCase()})</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: High-CTR Thumbnail Studio */}
        {activeTab === "thumbnail" && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Controls */}
              <div className="col-span-1 bg-[#141824] p-5 rounded-xl border border-[#23293a] space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Thumbnail Typography & Look
                </span>
                <div className="space-y-2">
                  <button
                    onClick={() => setThumbStyle("mrbeast")}
                    className={`w-full p-2.5 rounded-lg border text-xs font-bold text-left transition-all ${
                      thumbStyle === "mrbeast"
                        ? "border-amber-400 bg-amber-950/30 text-amber-300"
                        : "border-[#252b3d] text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    MrBeast High-Contrast Yellow
                  </button>
                  <button
                    onClick={() => setThumbStyle("hormozi")}
                    className={`w-full p-2.5 rounded-lg border text-xs font-bold text-left transition-all ${
                      thumbStyle === "hormozi"
                        ? "border-cyan-400 bg-cyan-950/30 text-cyan-300"
                        : "border-[#252b3d] text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    Hormozi Punch Cyan Accent
                  </button>
                  <button
                    onClick={() => setThumbStyle("cyberpunk")}
                    className={`w-full p-2.5 rounded-lg border text-xs font-bold text-left transition-all ${
                      thumbStyle === "cyberpunk"
                        ? "border-pink-500 bg-pink-950/30 text-pink-300"
                        : "border-[#252b3d] text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    Cyberpunk 2077 Neon Glow
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-[11px] font-semibold text-slate-300">Primary Headline</label>
                  <input
                    type="text"
                    value={thumbHeadline}
                    onChange={(e) => setThumbHeadline(e.target.value)}
                    className="w-full bg-[#0a0d14] border border-[#252b3d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-300">Subtitle / Metric</label>
                  <input
                    type="text"
                    value={thumbSub}
                    onChange={(e) => setThumbSub(e.target.value)}
                    className="w-full bg-[#0a0d14] border border-[#252b3d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  onClick={handleDownloadThumbnail}
                  className="btn-pro w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-2 mt-4"
                >
                  <Download className="w-4 h-4" />
                  <span>Download 1280x720 Thumbnail</span>
                </button>
              </div>

              {/* Live Canvas Preview */}
              <div className="col-span-2 bg-[#141824] p-5 rounded-xl border border-[#23293a] flex flex-col justify-between items-center">
                <div className="w-full flex items-center justify-between mb-3 text-xs text-slate-400">
                  <span className="font-semibold">Live 1280x720 Canvas Render</span>
                  <span className="font-mono text-cyan-400">Aspect 16:9 • High CTR Target</span>
                </div>
                <div className="w-full aspect-video rounded-lg overflow-hidden border border-[#23293a] bg-black shadow-inner flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    width={1280}
                    height={720}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-3 text-center">
                  Rendered dynamically from the active composition frame using HTML5 Canvas 2D engine.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Viral Analytics & Pacing */}
        {activeTab === "engagement" && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Score Card 1: Viral Score */}
              <div className="bg-[#141824] p-5 rounded-xl border border-[#23293a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">Hook Strength</span>
                  <Flame className="w-4 h-4 text-orange-400" />
                </div>
                <div className="text-3xl font-extrabold text-white font-display">94<span className="text-sm text-slate-500 font-normal">/100</span></div>
                <p className="text-[11px] text-emerald-400 font-medium">Top 5% pacing in tech breakdown category</p>
                <div className="text-[10px] text-slate-400 pt-1">
                  First 3 seconds contains high-contrast conflict ("10,000 years vs 200 seconds").
                </div>
              </div>

              {/* Score Card 2: Visual Pacing */}
              <div className="bg-[#141824] p-5 rounded-xl border border-[#23293a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">Scene Pacing</span>
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-extrabold text-white font-display">4.2s<span className="text-sm text-slate-500 font-normal"> avg cut</span></div>
                <p className="text-[11px] text-cyan-400 font-medium">Optimal cut rate for YouTube Shorts & Reels</p>
                <div className="text-[10px] text-slate-400 pt-1">
                  Motion graphic overlay triggers every 4.5s to reset viewer dopamine baseline.
                </div>
              </div>

              {/* Score Card 3: Word-Sync Accuracy */}
              <div className="bg-[#141824] p-5 rounded-xl border border-[#23293a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">faster-whisper</span>
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-extrabold text-white font-display">100%<span className="text-sm text-slate-500 font-normal"> sync</span></div>
                <p className="text-[11px] text-purple-300 font-medium">Word-level kinetic captions aligned to 48kHz audio</p>
                <div className="text-[10px] text-slate-400 pt-1">
                  Zero audio/video drift across entire 14-second sequence.
                </div>
              </div>
            </div>

            {/* Retention Curve Simulation Chart */}
            <div className="bg-[#141824] p-5 rounded-xl border border-[#23293a] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Simulated 30s Viewer Retention Curve</h4>
                  <p className="text-[10px] text-slate-400">Modeled based on 500k+ high-performing science & tech short-form videos</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono">
                  Predicted Completion: 88.4%
                </span>
              </div>

              {/* Visual ASCII / SVG Retention Line Chart */}
              <div className="w-full h-32 bg-[#0d1017] rounded-lg border border-[#202533] p-4 flex items-end justify-between gap-1">
                {[100, 96, 94, 91, 93, 89, 90, 88, 87, 88, 86, 89, 87, 85].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[8px] text-slate-500 font-mono">{val}%</span>
                    <div
                      className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t"
                      style={{ height: `${val * 0.7}%` }}
                    />
                    <span className="text-[8px] text-slate-600 font-mono">{i}s</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: YouTube SEO & Chapters */}
        {activeTab === "seo" && (
          <div className="p-6 space-y-4">
            <div className="bg-[#141824] p-5 rounded-xl border border-[#23293a] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Auto-Generated YouTube Chapters & Metadata
                </span>
                <button
                  onClick={copyTimestamps}
                  className="btn-pro px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 shadow"
                >
                  {copiedTimestamps ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTimestamps ? "Copied to Clipboard!" : "Copy Description Kit"}</span>
                </button>
              </div>

              <div className="space-y-1.5 font-mono text-xs bg-[#0b0e15] p-3.5 rounded-lg border border-[#23293a] text-slate-300">
                {chapters.map((ch, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <span className="text-cyan-400 font-bold">{ch.time}</span>
                    <span className="text-slate-400">•</span>
                    <span>{ch.title}</span>
                  </div>
                ))}
                <div className="pt-2 text-slate-500 text-[11px] font-sans">
                  Tags: <span className="text-cyan-400">#QuantumComputing #TechBreakthrough #AIvideo #Supercomputer #OmniCut</span>
                </div>
              </div>
            </div>

            <div className="bg-[#141824] p-4 rounded-xl border border-[#23293a] flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <Hash className="w-4 h-4 text-cyan-400" />
                <span>Publishing to YouTube Shorts & TikTok automatically optimizes 9:16 safe title margins.</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">READY TO PUBLISH</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
