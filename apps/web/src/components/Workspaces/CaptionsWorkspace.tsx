"use client";

import React, { useState, useEffect } from "react";
import { 
  Type, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Plus, 
  Download, 
  Smartphone, 
  Monitor, 
  Flame, 
  Palette, 
  Sliders, 
  Smile, 
  FileText,
  Copy,
  Layers
} from "lucide-react";

interface SubtitleWord {
  word: string;
  startMs: number;
  endMs: number;
  isEmphasis?: boolean;
  emoji?: string;
}

interface SubtitleSegment {
  id: string;
  startMs: number;
  endMs: number;
  text: string;
  words: SubtitleWord[];
}

interface CaptionsWorkspaceProps {
  currentTimeMs: number;
  totalDurationMs: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (timeMs: number) => void;
  aspectRatio: "16:9" | "9:16" | "1:1";
  onAspectRatioChange: (ratio: "16:9" | "9:16" | "1:1") => void;
  onInsertCaptionsToTimeline?: (segments: SubtitleSegment[]) => void;
  onShowToast: (msg: string) => void;
}

export const CaptionsWorkspace: React.FC<CaptionsWorkspaceProps> = ({
  currentTimeMs,
  totalDurationMs,
  isPlaying,
  onTogglePlay,
  onSeek,
  aspectRatio,
  onAspectRatioChange,
  onInsertCaptionsToTimeline,
  onShowToast,
}) => {
  // Kinetic Presets
  const [stylePreset, setStylePreset] = useState<"hormozi" | "vox" | "beast" | "minimal">("hormozi");
  const [highlightColor, setHighlightColor] = useState("#FACC15"); // Bright yellow
  const [fontSizePx, setFontSizePx] = useState(48);
  const [uppercaseOnly, setUppercaseOnly] = useState(true);
  const [showEmojis, setShowEmojis] = useState(true);
  const [showSafeZone, setShowSafeZone] = useState(true);
  const [wordsPerLine, setWordsPerLine] = useState<"1" | "2" | "3" | "full">("2");
  const [hasInserted, setHasInserted] = useState(false);

  // Subtitle Segments with word-level timings
  const [segments, setSegments] = useState<SubtitleSegment[]>([
    {
      id: "sub_1",
      startMs: 0,
      endMs: 2500,
      text: "Most people think quantum supremacy is decades away.",
      words: [
        { word: "Most", startMs: 0, endMs: 300 },
        { word: "people", startMs: 320, endMs: 650 },
        { word: "think", startMs: 680, endMs: 950 },
        { word: "quantum", startMs: 980, endMs: 1450, isEmphasis: true, emoji: "⚛️" },
        { word: "supremacy", startMs: 1480, endMs: 1950, isEmphasis: true, emoji: "👑" },
        { word: "is", startMs: 1980, endMs: 2150 },
        { word: "decades", startMs: 2180, endMs: 2350 },
        { word: "away.", startMs: 2380, endMs: 2500 },
      ],
    },
    {
      id: "sub_2",
      startMs: 2600,
      endMs: 5200,
      text: "They are completely wrong. Here is what happened yesterday.",
      words: [
        { word: "They", startMs: 2600, endMs: 2800 },
        { word: "are", startMs: 2820, endMs: 3000 },
        { word: "completely", startMs: 3020, endMs: 3500, isEmphasis: true, emoji: "❌" },
        { word: "wrong.", startMs: 3520, endMs: 3950 },
        { word: "Here", startMs: 4000, endMs: 4250 },
        { word: "is", startMs: 4280, endMs: 4400 },
        { word: "what", startMs: 4420, endMs: 4600 },
        { word: "happened", startMs: 4620, endMs: 4950 },
        { word: "yesterday.", startMs: 4980, endMs: 5200, isEmphasis: true, emoji: "⚡" },
      ],
    },
    {
      id: "sub_3",
      startMs: 5300,
      endMs: 8200,
      text: "Google and IBM just solved a problem in three minutes.",
      words: [
        { word: "Google", startMs: 5300, endMs: 5700, isEmphasis: true },
        { word: "and", startMs: 5720, endMs: 5900 },
        { word: "IBM", startMs: 5920, endMs: 6300, isEmphasis: true },
        { word: "just", startMs: 6320, endMs: 6550 },
        { word: "solved", startMs: 6580, endMs: 7000 },
        { word: "a", startMs: 7020, endMs: 7150 },
        { word: "problem", startMs: 7180, endMs: 7550 },
        { word: "in", startMs: 7580, endMs: 7700 },
        { word: "three", startMs: 7720, endMs: 7950, isEmphasis: true, emoji: "⏱️" },
        { word: "minutes.", startMs: 7980, endMs: 8200 },
      ],
    },
    {
      id: "sub_4",
      startMs: 8300,
      endMs: 11500,
      text: "That would take the world's fastest supercomputer ten thousand years.",
      words: [
        { word: "That", startMs: 8300, endMs: 8550 },
        { word: "would", startMs: 8580, endMs: 8800 },
        { word: "take", startMs: 8820, endMs: 9100 },
        { word: "the", startMs: 9120, endMs: 9250 },
        { word: "world's", startMs: 9280, endMs: 9550 },
        { word: "fastest", startMs: 9580, endMs: 9950 },
        { word: "supercomputer", startMs: 9980, endMs: 10600, isEmphasis: true, emoji: "💻" },
        { word: "ten", startMs: 10650, endMs: 10950, isEmphasis: true },
        { word: "thousand", startMs: 10980, endMs: 11250, isEmphasis: true },
        { word: "years.", startMs: 11280, endMs: 11500, emoji: "🔥" },
      ],
    },
  ]);

  // Find currently active segment and active word
  const currentSegment = segments.find(
    (s) => currentTimeMs >= s.startMs && currentTimeMs <= s.endMs
  ) || segments[0];

  const currentWord = currentSegment?.words.find(
    (w) => currentTimeMs >= w.startMs && currentTimeMs <= w.endMs
  );

  const handleToggleEmphasis = (segmentId: string, wordIdx: number) => {
    setSegments((prev) =>
      prev.map((s) => {
        if (s.id !== segmentId) return s;
        const newWords = [...s.words];
        newWords[wordIdx] = {
          ...newWords[wordIdx],
          isEmphasis: !newWords[wordIdx].isEmphasis,
        };
        return { ...s, words: newWords };
      })
    );
  };

  const handleInsertTimeline = () => {
    setHasInserted(true);
    if (onInsertCaptionsToTimeline) {
      onInsertCaptionsToTimeline(segments);
    }
    onShowToast("✨ Inserted kinetic word-by-word captions into V3 timeline track!");
    setTimeout(() => setHasInserted(false), 2500);
  };

  const handleExportSRT = () => {
    let srtContent = "";
    segments.forEach((seg, idx) => {
      const formatTime = (ms: number) => {
        const totalSec = Math.floor(ms / 1000);
        const remMs = ms % 1000;
        const hours = String(Math.floor(totalSec / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
        const seconds = String(totalSec % 60).padStart(2, "0");
        const millis = String(remMs).padStart(3, "0");
        return `${hours}:${minutes}:${seconds},${millis}`;
      };

      srtContent += `${idx + 1}\n${formatTime(seg.startMs)} --> ${formatTime(seg.endMs)}\n${seg.text}\n\n`;
    });

    const blob = new Blob([srtContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "captions_broadcast.srt";
    link.click();
    URL.revokeObjectURL(url);
    onShowToast("Downloaded standard SRT broadcast subtitles file.");
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0a0c10] text-slate-200 select-none">
      {/* LEFT COLUMN: Subtitle Styler & Preset Controls */}
      <div className="w-88 border-r border-slate-800/80 bg-[#101319] flex flex-col shrink-0">
        <div className="p-3 border-b border-slate-800 bg-[#14171d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white tracking-wide">KINETIC CAPTIONS STUDIO</span>
          </div>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono">
            Slot Studio FX
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Preset Styles */}
          <div className="space-y-2">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Creator Animation Preset
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "hormozi", name: "Hormozi Punch", badge: "Yellow / Green Pop", desc: "Bold uppercase, active word bounces 1.25x with neon glow" },
                { id: "vox", name: "Vox Documentarian", badge: "Serif Minimal", desc: "Lower-third translucent box, subtle white word fade" },
                { id: "beast", name: "Beast Viral Pop", badge: "Red/Yellow Impact", desc: "Thick black outline, explosive keyword emojis" },
                { id: "minimal", name: "Modern Sans", badge: "Clean Pill", desc: "Inter font with rounded glass backing, high elegance" },
              ].map((pst) => (
                <button
                  key={pst.id}
                  onClick={() => {
                    setStylePreset(pst.id as any);
                    if (pst.id === "hormozi") setHighlightColor("#FACC15");
                    if (pst.id === "vox") setHighlightColor("#38BDF8");
                    if (pst.id === "beast") setHighlightColor("#EF4444");
                    if (pst.id === "minimal") setHighlightColor("#10B981");
                  }}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    stylePreset === pst.id
                      ? "bg-amber-500/10 border-amber-500 text-white shadow-sm shadow-amber-950/30"
                      : "bg-[#14171d] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <span className="font-bold text-xs block text-slate-100">{pst.name}</span>
                  <span className="text-[9px] text-amber-400/90 font-mono block mt-0.5">{pst.badge}</span>
                  <span className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-tight">{pst.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Accent / Highlight Color Picker */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>Active Word Glow Color</span>
              </span>
              <span className="font-mono text-amber-400 font-bold">{highlightColor}</span>
            </div>
            <div className="flex items-center gap-2">
              {["#FACC15", "#10B981", "#38BDF8", "#EC4899", "#EF4444", "#A855F7"].map((c) => (
                <button
                  key={c}
                  onClick={() => setHighlightColor(c)}
                  className={`w-6 h-6 rounded-full border transition-all ${
                    highlightColor === c ? "scale-110 border-white shadow-md shadow-amber-500/30" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Display Configuration */}
          <div className="bg-[#14171d] p-3 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">Auto-Insert Animated Emojis</span>
              <input
                type="checkbox"
                checked={showEmojis}
                onChange={(e) => setShowEmojis(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">Force UPPERCASE</span>
              <input
                type="checkbox"
                checked={uppercaseOnly}
                onChange={(e) => setUppercaseOnly(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">Show 9:16 Safe Zones</span>
              <input
                type="checkbox"
                checked={showSafeZone}
                onChange={(e) => setShowSafeZone(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            {/* Font Size Slider */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Font Scale</span>
                <span className="font-mono text-slate-300">{fontSizePx}px</span>
              </div>
              <input
                type="range"
                min={28}
                max={72}
                value={fontSizePx}
                onChange={(e) => setFontSizePx(Number(e.target.value))}
                className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleInsertTimeline}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 active:scale-95 transition-all"
            >
              {hasInserted ? <Check className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
              <span>{hasInserted ? "Inserted into V3 Track!" : "Apply to V3 Captions Track"}</span>
            </button>

            <button
              onClick={handleExportSRT}
              className="w-full py-2 bg-[#181c24] hover:bg-[#1f242e] border border-slate-700 text-slate-300 font-medium rounded-lg text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export Broadcast .SRT Subtitles</span>
            </button>
          </div>
        </div>
      </div>

      {/* CENTER STAGE: Canvas Viewport with Live Kinetic Text Overlay */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#080a0f]">
        {/* Monitor HUD */}
        <div className="h-10 px-4 border-b border-slate-800 bg-[#12151b] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-white">Live Subtitle Rendering Engine</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700">
              {aspectRatio} • {Math.round(currentTimeMs)}ms
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAspectRatioChange(aspectRatio === "16:9" ? "9:16" : "16:9")}
              className="px-2.5 py-1 rounded bg-[#181c24] hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {aspectRatio === "16:9" ? <Smartphone className="w-3 h-3 text-cyan-400" /> : <Monitor className="w-3 h-3 text-amber-400" />}
              <span>Switch to {aspectRatio === "16:9" ? "9:16 Shorts" : "16:9 YouTube"}</span>
            </button>

            <button
              onClick={onTogglePlay}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs flex items-center gap-1 shadow transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? "Pause" : "Play"}</span>
            </button>
          </div>
        </div>

        {/* Viewport Container */}
        <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.06),transparent_70%)]">
          <div
            className={`relative rounded-xl border border-slate-700 shadow-2xl overflow-hidden bg-black flex flex-col justify-between transition-all duration-300 ${
              aspectRatio === "9:16" ? "h-full max-h-[560px] aspect-[9/16]" : "w-full max-w-3xl aspect-video"
            }`}
          >
            {/* Background Simulated Video Frame */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 opacity-90"></div>

            {/* Video overlay graphic (quantum/academic visual) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
              <div className="w-64 h-64 rounded-full border-2 border-dashed border-amber-500/30 animate-[spin_30s_linear_infinite]" />
            </div>

            {/* Safe Zone Guides for 9:16 Shorts */}
            {showSafeZone && aspectRatio === "9:16" && (
              <div className="absolute inset-x-4 top-12 bottom-20 border-2 border-dashed border-red-500/30 pointer-events-none rounded flex flex-col justify-between p-2">
                <span className="text-[9px] text-red-400 font-mono">Shorts Top Safe Edge (Header)</span>
                <span className="text-[9px] text-red-400 font-mono text-center">Shorts Bottom Safe Edge (Comments &amp; Profile)</span>
              </div>
            )}

            {/* Top HUD badge */}
            <div className="relative z-10 p-3 flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span className="bg-black/60 px-2 py-0.5 rounded border border-slate-800">
                REC • 3840×2160
              </span>
              <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">
                {stylePreset.toUpperCase()} ANIMATION
              </span>
            </div>

            {/* LIVE KINETIC CAPTION OVERLAY */}
            <div className="relative z-20 pb-12 px-6 flex flex-col items-center justify-center text-center">
              {currentSegment ? (
                <div 
                  className={`transition-all duration-150 ${
                    stylePreset === "vox"
                      ? "bg-black/75 backdrop-blur-md px-6 py-3 rounded-lg border border-slate-700/60 max-w-xl"
                      : stylePreset === "minimal"
                      ? "bg-slate-900/80 backdrop-blur-lg px-5 py-2.5 rounded-full border border-slate-700/80 shadow-2xl"
                      : "drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
                  }`}
                >
                  <p 
                    className={`font-black tracking-tight leading-snug transition-all ${
                      uppercaseOnly ? "uppercase" : ""
                    } ${
                      stylePreset === "vox" 
                        ? "font-serif text-slate-100" 
                        : stylePreset === "beast"
                        ? "font-sans tracking-tighter"
                        : "font-sans"
                    }`}
                    style={{ fontSize: `${aspectRatio === "9:16" ? fontSizePx * 0.75 : fontSizePx}px` }}
                  >
                    {currentSegment.words.map((w, idx) => {
                      const isCurrent = currentWord && currentWord.word === w.word && currentWord.startMs === w.startMs;
                      return (
                        <span
                          key={idx}
                          className={`inline-block mx-1.5 transition-all duration-100 ${
                            isCurrent
                              ? "scale-125 z-10"
                              : "scale-100 opacity-90"
                          }`}
                          style={{
                            color: isCurrent
                              ? highlightColor
                              : w.isEmphasis
                              ? "#FFFFFF"
                              : stylePreset === "vox"
                              ? "#CBD5E1"
                              : "#F8FAFC",
                            textShadow: isCurrent 
                              ? `0 0 25px ${highlightColor}88, 0 2px 4px rgba(0,0,0,0.9)` 
                              : "0 2px 4px rgba(0,0,0,0.9)",
                            WebkitTextStroke: stylePreset === "beast" ? "2px black" : "none"
                          }}
                        >
                          {showEmojis && w.emoji && (
                            <span className="block text-xl -mb-1 animate-bounce">{w.emoji}</span>
                          )}
                          {w.word}
                        </span>
                      );
                    })}
                  </p>
                </div>
              ) : (
                <span className="text-slate-500 font-mono text-xs">Waiting for speech...</span>
              )}
            </div>

            {/* Bottom Scrubber Timeline Bar */}
            <div className="relative z-10 px-4 py-2 bg-black/60 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">
                {(currentTimeMs / 1000).toFixed(1)}s / {(totalDurationMs / 1000).toFixed(1)}s
              </span>
              <input
                type="range"
                min={0}
                max={totalDurationMs}
                value={currentTimeMs}
                onChange={(e) => onSeek(Number(e.target.value))}
                className="w-1/2 h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-amber-500"
              />
              <span className="text-amber-400 font-semibold">
                Word {currentWord ? currentWord.word : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Word Timing & Script Breakdown */}
      <div className="w-80 border-l border-slate-800/80 bg-[#101319] flex flex-col shrink-0">
        <div className="p-3 border-b border-slate-800 bg-[#14171d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold text-white tracking-wide">WORD ACCENT TRIGGER</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Click to Emphasize</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {segments.map((seg, sIdx) => {
            const isSegActive = currentTimeMs >= seg.startMs && currentTimeMs <= seg.endMs;
            return (
              <div
                key={seg.id}
                onClick={() => onSeek(seg.startMs)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isSegActive
                    ? "bg-[#181c26] border-amber-500/60 shadow-md shadow-amber-950/20"
                    : "bg-[#12151c] border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mb-2">
                  <span className="font-semibold text-amber-400">Segment {sIdx + 1}</span>
                  <span>{(seg.startMs / 1000).toFixed(1)}s – {(seg.endMs / 1000).toFixed(1)}s</span>
                </div>

                {/* Word Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {seg.words.map((w, wIdx) => {
                    const isWordActive = currentWord && currentWord.word === w.word && currentWord.startMs === w.startMs;
                    return (
                      <button
                        key={wIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleEmphasis(seg.id, wIdx);
                        }}
                        className={`text-xs px-2 py-1 rounded font-medium transition-all flex items-center gap-1 ${
                          isWordActive
                            ? "bg-amber-400 text-slate-950 font-bold scale-105 shadow-md shadow-amber-500/30"
                            : w.isEmphasis
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/50"
                            : "bg-[#1a1e28] text-slate-300 hover:bg-slate-700 border border-slate-700/50"
                        }`}
                        title="Click to toggle word emphasis & glow"
                      >
                        {w.emoji && <span>{w.emoji}</span>}
                        <span>{w.word}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
