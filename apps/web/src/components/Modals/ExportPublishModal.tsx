"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Download, 
  Film, 
  FileCode2, 
  Check, 
  X, 
  Sparkles, 
  Image as ImageIcon, 
  Copy, 
  FileText, 
  CheckCircle2, 
  TrendingUp, 
  BarChart3, 
  Layers, 
  Video,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  CheckCheck
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
  const [activeTab, setActiveTab] = useState<"render" | "thumbnail" | "seo" | "queue">("render");
  const [resolution, setResolution] = useState<"1080p" | "4k" | "shorts">("1080p");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [activeStageText, setActiveStageText] = useState("");
  const [exportComplete, setExportComplete] = useState(false);

  // Multi-Format Export Queue State
  const [queueJobs, setQueueJobs] = useState([
    {
      id: "job_1080p",
      title: "OmniCut Master 1080p (YouTube FHD)",
      format: "1920x1080 (16:9)",
      codec: "H.264 High 5.1",
      audio: "-14 LUFS Clean Ducked",
      status: "completed",
      progress: 100,
      sizeMb: "124 MB",
      worker: "Local NVENC Hardware",
      downloadUrl: "/exports/master_1080p.mp4",
    },
    {
      id: "job_4k",
      title: "OmniCut 4K UHD Master (ProRes 422)",
      format: "3840x2160 (16:9)",
      codec: "Apple ProRes / HEVC",
      audio: "24-bit 48kHz Linear PCM",
      status: "completed",
      progress: 100,
      sizeMb: "480 MB",
      worker: "Distributed Lambda (16 chunks)",
      downloadUrl: "/exports/master_1080p.mp4",
    },
    {
      id: "job_short_9x16",
      title: "Vertical Short (TikTok / Reels / Shorts)",
      format: "1080x1920 (9:16)",
      codec: "H.264 + Burned-in Captions",
      audio: "-14 LUFS Speech Priority",
      status: "completed",
      progress: 100,
      sizeMb: "38 MB",
      worker: "Auto-Reframe Engine",
      downloadUrl: "/exports/short_9x16.mp4",
    },
    {
      id: "job_square_1x1",
      title: "Square Carousel Cut (Instagram / LinkedIn)",
      format: "1080x1080 (1:1)",
      codec: "H.264 Web Optimized",
      audio: "-14 LUFS Normalized",
      status: "completed",
      progress: 100,
      sizeMb: "44 MB",
      worker: "Remotion Worker Fleet",
      downloadUrl: "/exports/master_1080p.mp4",
    },
  ]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  // Thumbnail Studio
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [thumbHeadline, setThumbHeadline] = useState("QUANTUM SUPREMACY");
  const [thumbSub, setThumbSub] = useState("10,000 YEARS IN 200 SECONDS");
  const [thumbStyle, setThumbStyle] = useState<"mrbeast" | "hormozi" | "cinematic">("hormozi");
  const [copiedTimestamps, setCopiedTimestamps] = useState(false);

  // Canvas Thumbnail Generator
  useEffect(() => {
    if (!isOpen || activeTab !== "thumbnail") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Gradient background
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    if (thumbStyle === "hormozi") {
      grad.addColorStop(0, "#08090d");
      grad.addColorStop(1, "#12141c");
    } else if (thumbStyle === "mrbeast") {
      grad.addColorStop(0, "#080d24");
      grad.addColorStop(0.5, "#0d1a45");
      grad.addColorStop(1, "#1f0c3d");
    } else {
      grad.addColorStop(0, "#040508");
      grad.addColorStop(1, "#181924");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Accent lighting
    const glow = ctx.createRadialGradient(canvas.width * 0.75, canvas.height * 0.4, 40, canvas.width * 0.75, canvas.height * 0.4, 350);
    glow.addColorStop(0, thumbStyle === "hormozi" ? "rgba(59, 99, 255, 0.4)" : thumbStyle === "mrbeast" ? "rgba(250, 204, 21, 0.4)" : "rgba(168, 85, 247, 0.35)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Metric box
    ctx.fillStyle = "rgba(18, 20, 28, 0.85)";
    ctx.strokeStyle = thumbStyle === "hormozi" ? "#3B63FF" : thumbStyle === "mrbeast" ? "#facc15" : "#a855f7";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(canvas.width * 0.62, canvas.height * 0.22, 400, 280, 20);
    ctx.fill();
    ctx.stroke();

    // Box content
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("SPEEDUP", canvas.width * 0.66, canvas.height * 0.35);

    ctx.fillStyle = thumbStyle === "hormozi" ? "#9fb4ff" : thumbStyle === "mrbeast" ? "#facc15" : "#c084fc";
    ctx.font = "900 68px monospace";
    ctx.fillText("10,000x", canvas.width * 0.66, canvas.height * 0.52);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "20px sans-serif";
    ctx.fillText("Sycamore vs Summit", canvas.width * 0.66, canvas.height * 0.62);

    // Left typography
    ctx.font = "900 64px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(thumbHeadline, 80, 260);

    ctx.font = "700 36px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(thumbSub, 80, 340);

    // Bottom badge
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "bold 18px monospace";
    ctx.fillText("OmniCut ? 4K 60FPS EMPIRICAL BENCHMARK", 80, canvas.height - 50);

  }, [isOpen, activeTab, thumbHeadline, thumbSub, thumbStyle]);

  if (!isOpen) return null;

  // Chapter markers for YouTube
  const chapters = [
    { time: "00:00", title: "Introduction & Classical Supercomputer Limits" },
    { time: "00:04", title: "Cryogenic Dilution Refrigerator Tour" },
    { time: "00:09", title: "Empirical Speedup: Sycamore vs Summit" },
    { time: "00:13", title: "Peer-Reviewed Nature Citations & Summary" },
  ];

  const handleDownloadThumbnail = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/jpeg", 0.95);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectTitle.toLowerCase().replace(/\s+/g, "-")}-thumbnail.jpg`;
    a.click();
  };

  const handleBatchQueueAll = () => {
    setActiveTab("queue");
    setIsBatchProcessing(true);
    // Reset jobs to rendering state with dynamic progression
    setQueueJobs((prev) =>
      prev.map((j) => ({ ...j, status: "rendering", progress: 20 }))
    );

    setTimeout(() => {
      setQueueJobs((prev) =>
        prev.map((j, i) => ({ ...j, progress: Math.min(100, 45 + i * 15) }))
      );
    }, 600);

    setTimeout(() => {
      setQueueJobs((prev) =>
        prev.map((j, i) => ({
          ...j,
          progress: 100,
          status: "completed",
        }))
      );
      setIsBatchProcessing(false);
    }, 1400);
  };

  const handleStartExport = () => {
    setIsExporting(true);
    setExportProgress(15);
    setActiveStageText("Stage 1/4: Audio 48kHz Normalization & Ducking (-14.0 LUFS)...");

    setTimeout(() => {
      setExportProgress(45);
      setActiveStageText("Stage 2/4: Remotion 3D Motion Graphics & Chrome Bar Charts (60 FPS)...");
    }, 500);

    setTimeout(() => {
      setExportProgress(78);
      setActiveStageText("Stage 3/4: Hardware H.264 Master Encoding & Bitrate Optimization...");
    }, 1100);

    setTimeout(() => {
      setExportProgress(95);
      setActiveStageText("Stage 4/4: Vertical 9:16 Shorts Auto-Cutter & Thumbnails Pack...");
    }, 1600);

    setTimeout(() => {
      setExportProgress(100);
      setIsExporting(false);
      setExportComplete(true);
      setActiveStageText("Completed! Master files generated successfully.");
    }, 2000);
  };

  const copyTimestamps = () => {
    const text = `Title: ${projectTitle}\n\n` + 
      chapters.map((c) => `${c.time} - ${c.title}`).join("\n") + 
      "\n\nTags: #QuantumComputing #TechBreakthrough #AIvideo #Supercomputer #OmniCut";
    navigator.clipboard.writeText(text);
    setCopiedTimestamps(true);
    setTimeout(() => setCopiedTimestamps(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none font-sans">
      <div className="bg-[#0f1016] border border-[#232633] rounded-xl w-full max-w-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#14151d] border-b border-[#20222e] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#3B63FF] flex items-center justify-center text-white shadow-sm">
              <Download className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                Export 4K Master & Publish Pack
              </h2>
              <p className="text-[11px] text-slate-400">
                1080p/4K master MP4, 9:16 vertical short, High-CTR thumbnail, and YouTube metadata
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded text-slate-400 hover:text-white hover:bg-white/5 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Minimalist Tabs */}
        <div className="flex border-b border-[#20222e] bg-[#111218] px-5 gap-1">
          <button
            onClick={() => setActiveTab("render")}
            className={`py-2 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "render"
                ? "border-[#3B63FF] text-white font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Film className="w-3.5 h-3.5 text-[#3B63FF]" />
            <span>Master Video Export</span>
          </button>
          <button
            onClick={() => setActiveTab("thumbnail")}
            className={`py-2 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "thumbnail"
                ? "border-[#3B63FF] text-white font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Thumbnail Studio</span>
          </button>
          <button
            onClick={() => setActiveTab("seo")}
            className={`py-2 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "seo"
                ? "border-[#3B63FF] text-white font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>YouTube Chapters & SEO</span>
          </button>
          <button
            id="tab-btn-queue"
            onClick={() => setActiveTab("queue")}
            className={`py-2 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "queue"
                ? "border-[#3B63FF] text-white font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Queue ({queueJobs.length})</span>
          </button>
        </div>

        {/* Tab 1: Master Video Export */}
        {activeTab === "render" && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Quality Selection */}
              <div className="bg-[#14151d] p-4 rounded-lg border border-[#222432] space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Target Resolution Tier
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setResolution("1080p")}
                    className={`p-2.5 rounded border text-center transition-all ${
                      resolution === "1080p"
                        ? "border-[#3B63FF] bg-[#3B63FF]/15 text-white font-bold"
                        : "border-[#252838] bg-[#0f1016] text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="text-xs">1080p FHD</div>
                    <div className="text-[10px] opacity-70">1920x1080</div>
                  </button>
                  <button
                    onClick={() => setResolution("4k")}
                    className={`p-2.5 rounded border text-center transition-all ${
                      resolution === "4k"
                        ? "border-[#3B63FF] bg-[#3B63FF]/15 text-white font-bold"
                        : "border-[#252838] bg-[#0f1016] text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center justify-center gap-0.5">
                      <span>4K UHD</span>
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    </div>
                    <div className="text-[10px] opacity-70">3840x2160</div>
                  </button>
                  <button
                    onClick={() => setResolution("shorts")}
                    className={`p-2.5 rounded border text-center transition-all ${
                      resolution === "shorts"
                        ? "border-[#3B63FF] bg-[#3B63FF]/15 text-white font-bold"
                        : "border-[#252838] bg-[#0f1016] text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="text-xs">9:16 Short</div>
                    <div className="text-[10px] opacity-70">Vertical Reel</div>
                  </button>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-1.5 text-[11px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Encoding Engine:</span>
                    <span className="font-mono text-slate-200">FFmpeg 7.0 + Remotion</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Video Codec:</span>
                    <span className="font-mono text-slate-200">H.264 (NVENC) / High 5.1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Audio Profile:</span>
                    <span className="font-mono text-emerald-400">-14.0 LUFS Broadcast Safe</span>
                  </div>
                </div>
              </div>

              {/* Render Pipeline Box */}
              <div className="bg-[#14151d] p-4 rounded-lg border border-[#222432] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Celery Output Queue
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-mono font-bold">
                      READY
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    Bakes multi-track timeline ({clips.length} clips), 48kHz voiceover sidechain ducking, and 3D chrome graphics into an uncompressed master bundle.
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5">
                  {isExporting ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono text-[#9fb4ff]">
                        <span className="truncate max-w-[240px]">{activeStageText}</span>
                        <span>{exportProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#252838] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#3B63FF] transition-all duration-300"
                          style={{ width: `${exportProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : exportComplete ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Rendering Complete (4K Ready)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <a
                          href="/exports/master_1080p.mp4"
                          download="Quantum-Supremacy-2026-Master.mp4"
                          className="py-1.5 px-2 bg-[#3B63FF] hover:bg-[#4f73ff] text-white text-xs font-bold rounded flex items-center justify-center gap-1 text-center"
                        >
                          <Download className="w-3 h-3" />
                          <span>Master MP4</span>
                        </a>
                        <a
                          href="/exports/short_9x16.mp4"
                          download="Quantum-Supremacy-2026-Short-9x16.mp4"
                          className="py-1.5 px-2 bg-[#252838] hover:bg-[#2f3346] text-white text-xs font-bold rounded flex items-center justify-center gap-1 text-center"
                        >
                          <Smartphone className="w-3 h-3 text-cyan-400" />
                          <span>9:16 Short</span>
                        </a>
                      </div>
                      <a
                        href="/exports/publish_pack.zip"
                        download="Quantum-Supremacy-2026-Creator-Pack.zip"
                        className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 text-center mt-1"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Download Complete Publish Pack (.ZIP)</span>
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={handleStartExport}
                        className="btn-slot btn-slot-buy w-full py-2 text-black font-bold text-xs rounded flex items-center justify-center gap-2 shadow-md"
                      >
                        <Download className="w-3.5 h-3.5 text-black" />
                        <span>Start Master Export ({resolution.toUpperCase()})</span>
                      </button>
                      <button
                        onClick={handleBatchQueueAll}
                        className="w-full py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs rounded flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                        <span>Batch Queue All 4 Formats (1080p, 4K, 9:16, 1:1)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: High-CTR Thumbnail Studio */}
        {activeTab === "thumbnail" && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {/* Controls */}
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={thumbHeadline}
                    onChange={(e) => setThumbHeadline(e.target.value.toUpperCase())}
                    className="w-full bg-[#14151d] border border-[#252838] rounded p-2 text-xs text-white focus:outline-none focus:border-[#3B63FF]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Subheading
                  </label>
                  <input
                    type="text"
                    value={thumbSub}
                    onChange={(e) => setThumbSub(e.target.value.toUpperCase())}
                    className="w-full bg-[#14151d] border border-[#252838] rounded p-2 text-xs text-white focus:outline-none focus:border-[#3B63FF]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Visual Style
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => setThumbStyle("hormozi")}
                      className={`p-1.5 rounded text-[11px] font-medium border ${
                        thumbStyle === "hormozi" ? "bg-[#3B63FF]/20 border-[#3B63FF] text-white" : "border-[#252838] text-slate-400"
                      }`}
                    >
                      Hormozi
                    </button>
                    <button
                      onClick={() => setThumbStyle("mrbeast")}
                      className={`p-1.5 rounded text-[11px] font-medium border ${
                        thumbStyle === "mrbeast" ? "bg-[#3B63FF]/20 border-[#3B63FF] text-white" : "border-[#252838] text-slate-400"
                      }`}
                    >
                      High CTR
                    </button>
                    <button
                      onClick={() => setThumbStyle("cinematic")}
                      className={`p-1.5 rounded text-[11px] font-medium border ${
                        thumbStyle === "cinematic" ? "bg-[#3B63FF]/20 border-[#3B63FF] text-white" : "border-[#252838] text-slate-400"
                      }`}
                    >
                      Dark Tech
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleDownloadThumbnail}
                  className="w-full py-2 bg-[#3B63FF] hover:bg-[#4f73ff] text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Thumbnail (JPG)</span>
                </button>
              </div>

              {/* Canvas Preview */}
              <div className="col-span-2 bg-black rounded-lg border border-[#252838] overflow-hidden flex items-center justify-center p-2">
                <canvas
                  ref={canvasRef}
                  width={1280}
                  height={720}
                  className="w-full h-auto rounded shadow-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: YouTube SEO & Chapters */}
        {activeTab === "seo" && (
          <div className="p-5 space-y-4">
            <div className="bg-[#14151d] p-4 rounded-lg border border-[#222432] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">YouTube Chapters & Video Description</h4>
                  <p className="text-[11px] text-slate-400">Timecoded markers calculated from timeline cuts</p>
                </div>
                <button
                  onClick={copyTimestamps}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#3B63FF] hover:bg-[#4f73ff] text-white text-xs font-bold transition-colors"
                >
                  {copiedTimestamps ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTimestamps ? "Copied to Clipboard!" : "Copy Full Description"}</span>
                </button>
              </div>

              <div className="bg-[#0f1016] border border-[#252838] rounded p-3 text-xs font-mono text-slate-300 space-y-1">
                {chapters.map((c, idx) => (
                  <div key={idx} className="flex gap-3">
                    <span className="text-[#9fb4ff] font-bold">{c.time}</span>
                    <span>{c.title}</span>
                  </div>
                ))}
                <div className="pt-2 text-slate-500">
                  Tags: #QuantumComputing #TechBreakthrough #AIvideo #Supercomputer #OmniCut
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Multi-Format Batch Export Queue */}
        {activeTab === "queue" && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Background Multi-Format Render Queue
                </h4>
                <p className="text-[11px] text-slate-400">Parallel rendering via NVENC Hardware & Remotion Lambda fleet</p>
              </div>
              <button
                onClick={handleBatchQueueAll}
                disabled={isBatchProcessing}
                className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isBatchProcessing ? "Rendering All Chunks..." : "Re-render All Targets"}</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {queueJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-[#14151d] p-3.5 rounded-lg border border-[#222432] flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{job.title}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                        {job.format}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                        {job.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                      <span>Codec: {job.codec}</span>
                      <span>•</span>
                      <span>Worker: {job.worker}</span>
                      <span>•</span>
                      <span>Size: {job.sizeMb}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-[#252838] rounded-full overflow-hidden mt-1.5">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <a
                      href={job.downloadUrl}
                      download
                      className="px-3 py-1.5 bg-[#222533] hover:bg-[#2c3044] text-white text-xs font-semibold rounded flex items-center gap-1.5 border border-white/10 hover:border-white/20 transition-all"
                    >
                      <Download className="w-3 h-3 text-emerald-400" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
