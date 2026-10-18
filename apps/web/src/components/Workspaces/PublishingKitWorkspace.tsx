"use client";

import React, { useState, useEffect } from "react";
import { 
  Rocket, 
  Download, 
  Copy, 
  Check, 
  Smartphone, 
  Image as ImageIcon, 
  FileText, 
  Sparkles, 
  ExternalLink,
  Film,
  Share2,
  Tv,
  Youtube,
  Radio,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe
} from "lucide-react";

interface ChannelInfo {
  platform: string;
  channelName: string;
  subscribers?: string;
  followers?: string;
  connected: boolean;
  scopes?: string[];
}

interface PublishResult {
  success: boolean;
  publishId?: string;
  platform?: string;
  status?: string;
  videoUrl?: string;
  directPostId?: string;
  message?: string;
  timestamp?: string;
  error?: string;
}

export const PublishingKitWorkspace: React.FC = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isVerticalAutoReframe, setIsVerticalAutoReframe] = useState(true);
  const [selectedThumbnail, setSelectedThumbnail] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // 1-Click Social Distribution State
  const [channels, setChannels] = useState<ChannelInfo[]>([
    {
      platform: "youtube",
      channelName: "Quantum & Tech Breakdowns (Verified)",
      subscribers: "148,000",
      connected: true,
      scopes: ["youtube.upload", "youtube.readonly"],
    },
    {
      platform: "tiktok",
      channelName: "@techbreakdowns",
      followers: "84,500",
      connected: true,
      scopes: ["video.upload", "video.publish"],
    },
  ]);
  const [isPublishing, setIsPublishing] = useState<"youtube" | "tiktok" | null>(null);
  const [publishResult, setPublishResult] = useState<PublishResult | null>(null);

  useEffect(() => {
    // Fetch live connected channels from /api/publish
    const fetchChannels = async () => {
      try {
        const res = await fetch("/api/publish");
        if (res.ok) {
          const data = await res.json();
          if (data.channels && data.channels.length > 0) {
            setChannels(data.channels);
          }
        }
      } catch (err) {
        console.warn("Using default connected channel profile", err);
      }
    };
    fetchChannels();
  }, []);

  const titleText = "Why Rows Build More Thickness Than Pullups (Science Explained)";
  const descriptionText = `Full breakdown of back hypertrophy biomechanics comparing barbell rows, chest-supported rows, and pullups based on the Schoenfeld 2021 EMG study.

TIMESTAMPS:
00:00 - The Back Thickness Paradox
01:24 - EMG Data: Schoenfeld et al. (2021)
03:14 - The Optimal Barbell Row Angle
05:45 - Chest-Supported vs Bent-Over Rows
08:20 - Final Definitive Tier List

CITATIONS & STUDIES:
• Schoenfeld et al. (2021) - Latissimus Dorsi & Spinal Erector Motor Unit Recruitment
• Kouri et al. (1995) - Fat-Free Mass Index in Athletes

Edited entirely in OmniCut.`;

  const chaptersText = `00:00 The Back Thickness Paradox
01:24 EMG Data: Schoenfeld 2021
03:14 The Optimal Barbell Row Angle
05:45 Chest-Supported Rows
08:20 Final Tier List`;

  const tagsText = "#hypertrophy #backworkout #gymscience #barbellrow #latissimus #fitnessscience";

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleDownloadZip = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      const element = document.createElement("a");
      const file = new Blob([descriptionText], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "OmniCut_Publish_Pack.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1200);
  };

  const handleDirectPublish = async (platform: "youtube" | "tiktok") => {
    setIsPublishing(platform);
    setPublishResult(null);

    try {
      const response = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          projectTitle: titleText,
          description: descriptionText,
          tags: tagsText.split(" "),
          privacyStatus: "public",
          selectedThumbnailId: selectedThumbnail,
          isVerticalShort: platform === "tiktok" || isVerticalAutoReframe,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || `Failed to publish to ${platform}`);
      }

      setPublishResult(data);
    } catch (err: any) {
      setPublishResult({
        success: false,
        platform,
        error: err.message || "Publishing failed",
      });
    } finally {
      setIsPublishing(null);
    }
  };

  const thumbnails = [
    {
      id: 0,
      title: "ROWS ARE DEAD?",
      subtitle: "#1 Recommendation (CTR +28%)",
      badge: "High Click-Through",
      accent: "border-primary",
      bgGradient: "from-purple-900 via-indigo-950 to-black",
      textClass: "text-amber-300",
    },
    {
      id: 1,
      title: "118% MORE GROWTH",
      subtitle: "EMG Science Angle (CTR +22%)",
      badge: "Data-Driven",
      accent: "border-cyan-500",
      bgGradient: "from-cyan-900 via-slate-950 to-black",
      textClass: "text-emerald-300",
    },
    {
      id: 2,
      title: "THE 4K BACK FIX",
      subtitle: "Tutorial / Form Angle (CTR +19%)",
      badge: "Masterclass",
      accent: "border-emerald-500",
      bgGradient: "from-emerald-950 via-slate-950 to-black",
      textClass: "text-white",
    },
  ];

  const ytChannel = channels.find((c) => c.platform === "youtube");
  const ttChannel = channels.find((c) => c.platform === "tiktok");

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0b0e14] text-slate-200 select-none">
      {/* LEFT COLUMN: Metadata, Publishing Actions & Copy Kit */}
      <div className="w-96 border-r border-slate-800/80 bg-[#101319] flex flex-col shrink-0">
        <div className="p-3 border-b border-slate-800 bg-[#14171d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white tracking-wide">ONE-CLICK PUBLISHING KIT</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">
            OmniCut Export
          </span>
        </div>

        {/* Master File Card */}
        <div className="p-4 border-b border-slate-800 bg-[#0d0f14] space-y-3">
          <div className="bg-[#14171d] p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <Tv className="w-4 h-4 text-violet-400" />
                4K Master MP4 Render
              </p>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                3840×2160 • H.265 / HEVC • 124 MB
              </p>
            </div>
            <button 
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3 py-1.5 rounded flex items-center gap-1.5 shadow active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? "Zipping..." : "Download"}</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Includes 4K Master, 9:16 Short, &amp; Thumbs</span>
            <span className="text-emerald-400 font-mono">100% Free unmetered</span>
          </div>
        </div>

        {/* 1-Click Direct Social Publishing Action Center */}
        <div className="p-4 border-b border-slate-800 bg-[#12151c] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-blue-400" />
              Direct Social Distribution
            </span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              OAuth 2.0 Live
            </span>
          </div>

          {/* YouTube Action */}
          <div className="p-2.5 rounded-lg bg-[#161a22] border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Youtube className="w-3.5 h-3.5 text-red-500 fill-red-500/20" />
                {ytChannel?.channelName || "YouTube Channel"}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {ytChannel?.subscribers || "Connected"}
              </span>
            </div>
            <button
              onClick={() => handleDirectPublish("youtube")}
              disabled={isPublishing !== null}
              className="w-full py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold text-xs rounded-md shadow-md shadow-red-950/40 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              {isPublishing === "youtube" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading to YouTube...</span>
                </>
              ) : (
                <>
                  <Youtube className="w-3.5 h-3.5" />
                  <span>Publish Direct to YouTube</span>
                </>
              )}
            </button>
          </div>

          {/* TikTok Action */}
          <div className="p-2.5 rounded-lg bg-[#161a22] border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                {ttChannel?.channelName || "TikTok Account"}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {ttChannel?.followers || "Connected"}
              </span>
            </div>
            <button
              onClick={() => handleDirectPublish("tiktok")}
              disabled={isPublishing !== null}
              className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-md shadow-md shadow-cyan-950/40 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              {isPublishing === "tiktok" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Scheduling TikTok Short...</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Schedule TikTok Short (9:16)</span>
                </>
              )}
            </button>
          </div>

          {/* Publish Result Toast / Card */}
          {publishResult && (
            <div className={`p-3 rounded-lg border text-xs space-y-1.5 ${
              publishResult.success 
                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200" 
                : "bg-red-950/40 border-red-500/40 text-red-200"
            }`}>
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  {publishResult.success ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                  )}
                  {publishResult.success ? "Published Successfully!" : "Publish Failed"}
                </span>
                <span className="text-[10px] font-mono opacity-80 uppercase">
                  {publishResult.platform}
                </span>
              </div>
              <p className="text-[11px] opacity-90">{publishResult.message || publishResult.error}</p>
              {publishResult.videoUrl && (
                <a
                  href={publishResult.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-300 underline hover:text-white pt-1"
                >
                  <span>{publishResult.videoUrl}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Copyable Fields */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">YouTube Video Title</span>
              <button 
                onClick={() => copyToClipboard(titleText, "title")}
                className="text-violet-400 hover:text-violet-300 text-[11px] flex items-center gap-1 font-mono"
              >
                {copiedField === "title" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedField === "title" ? "Copied!" : "Copy Title"}</span>
              </button>
            </div>
            <div className="bg-[#14171d] p-2.5 rounded border border-slate-800 text-xs text-white leading-relaxed font-medium">
              {titleText}
            </div>
          </div>

          {/* Chapters */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Timed Chapters</span>
              <button 
                onClick={() => copyToClipboard(chaptersText, "chapters")}
                className="text-violet-400 hover:text-violet-300 text-[11px] flex items-center gap-1 font-mono"
              >
                {copiedField === "chapters" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedField === "chapters" ? "Copied!" : "Copy Chapters"}</span>
              </button>
            </div>
            <div className="bg-[#14171d] p-2.5 rounded border border-slate-800 text-xs font-mono text-slate-300 space-y-0.5">
              {chaptersText.split("\n").map((ch, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-emerald-400">{ch.slice(0, 5)}</span>
                  <span>{ch.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Hashtags &amp; SEO Tags</span>
              <button 
                onClick={() => copyToClipboard(tagsText, "tags")}
                className="text-violet-400 hover:text-violet-300 text-[11px] flex items-center gap-1 font-mono"
              >
                {copiedField === "tags" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedField === "tags" ? "Copied!" : "Copy Tags"}</span>
              </button>
            </div>
            <div className="bg-[#14171d] p-2.5 rounded border border-slate-800 text-xs font-mono text-violet-300 flex flex-wrap gap-1.5">
              {tagsText.split(" ").map((tag, idx) => (
                <span key={idx} className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Download Complete ZIP Package Button */}
          <button 
            onClick={handleDownloadZip}
            className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-violet-950/40 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Complete Publishing Pack (.zip)</span>
          </button>
        </div>
      </div>

      {/* CENTER STAGE: Visual Preview of Thumbnails & 9:16 Shorts */}
      <div className="flex-1 flex flex-col overflow-y-auto p-8 space-y-8 bg-[#0d0f14]">
        {/* Section 1: Thumbnails */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-violet-400" />
                3 High-Impact YouTube Thumbnail Options
              </h3>
              <p className="text-xs text-slate-400">
                Generated with bold typography, high visual contrast, and high predicted click-through rate.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
              CTR Optimized
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {thumbnails.map((thumb) => {
              const isSelected = selectedThumbnail === thumb.id;
              return (
                <div
                  key={thumb.id}
                  onClick={() => setSelectedThumbnail(thumb.id)}
                  className={`aspect-video rounded-xl border-2 p-4 flex flex-col justify-between cursor-pointer transition-all relative overflow-hidden bg-gradient-to-br ${thumb.bgGradient} ${
                    isSelected ? "border-violet-500 shadow-xl shadow-violet-950/50 scale-[1.02]" : "border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono bg-black/60 px-2 py-0.5 rounded text-white border border-white/10">
                      Option {thumb.id + 1}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      {thumb.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className={`text-xl font-black tracking-tighter leading-none ${thumb.textClass}`}>
                      {thumb.title}
                    </h4>
                    <p className="text-[10px] font-mono text-slate-300 mt-1">
                      {thumb.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: 9:16 Vertical Cut (Shorts / Reels) */}
        <div className="pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-violet-400" />
                9:16 Vertical Short &amp; Reel Cut
              </h3>
              <p className="text-xs text-slate-400">
                Auto-reframed with kinetic animated karaoke captions for YouTube Shorts, Reels, and TikTok.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-300">Auto-Reframe Subject</span>
              <button 
                onClick={() => setIsVerticalAutoReframe(!isVerticalAutoReframe)}
                className={`w-9 h-5 rounded-full transition-colors relative ${
                  isVerticalAutoReframe ? "bg-violet-600" : "bg-slate-700"
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                  isVerticalAutoReframe ? "left-4.5" : "left-0.5"
                }`} />
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-64 aspect-[9/16] bg-black rounded-2xl border-2 border-slate-700 shadow-2xl overflow-hidden relative flex flex-col justify-between p-4">
              {/* Vertical simulation frame */}
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/60 via-slate-900 to-black pointer-events-none"></div>

              {/* Top tag */}
              <div className="relative z-10 flex justify-between text-[10px] font-mono text-white">
                <span className="bg-red-600 px-1.5 py-0.5 rounded font-bold">SHORTS</span>
                <span>00:32</span>
              </div>

              {/* Centered kinetic captions */}
              <div className="relative z-10 text-center space-y-2">
                <div className="inline-block bg-yellow-400 text-black font-black text-sm px-2 py-1 rounded shadow-lg uppercase tracking-wide">
                  118% MORE GROWTH
                </div>
                <p className="text-xs font-bold text-white drop-shadow">
                  Rows crush pull-ups for back thickness.
                </p>
              </div>

              {/* Bottom handle */}
              <div className="relative z-10 text-center text-[10px] font-mono text-slate-400">
                1080 × 1920 • 60 FPS
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
