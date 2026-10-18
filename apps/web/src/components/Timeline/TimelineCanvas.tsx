"use client";

import React, { useRef, useState } from "react";
import { TrackConfig, TrackHeader } from "./TrackHeader";
import { ToolMode } from "./TimelineToolbar";
import { Sparkles, Volume2, Move, Scissors } from "lucide-react";

export type TransitionType = "none" | "crossDissolve" | "dipToBlack" | "dipToWhite" | "wipeRight" | "zoomBlur";

export interface ClipTransition {
  type: TransitionType;
  durationMs: number;
}

export interface TimelineClip {
  id: string;
  trackId: string;
  title: string;
  startMs: number;
  durationMs: number;
  colorClass: string;
  borderClass: string;
  type: "video" | "audio" | "motion" | "captions";
  waveform?: boolean;
  ducked?: boolean;
  hasFx?: boolean;
  gainDb?: number;
  transitionIn?: ClipTransition;
  transitionOut?: ClipTransition;
  keyframes?: Array<{ property: string; timeMs: number; value: number }>;
}

export interface PeerCollaborator {
  id: string;
  name: string;
  color: string;
  playheadMs: number;
}

interface TimelineCanvasProps {
  tracks: TrackConfig[];
  clips: TimelineClip[];
  currentTimeMs: number;
  totalDurationMs: number;
  zoomScale: number; // px per second
  toolMode: ToolMode;
  snapping: boolean;
  selectedClipId: string | null;
  onSelectClip: (clipId: string | null) => void;
  onSeek: (ms: number) => void;
  onClipTrim: (clipId: string, newStartMs: number, newDurationMs: number) => void;
  onClipSplit: (clipId: string, splitAtMs: number) => void;
  onTrackToggleLock: (trackId: string) => void;
  onTrackToggleMute: (trackId: string) => void;
  onTrackToggleHide: (trackId: string) => void;
  onTrackToggleSolo?: (trackId: string) => void;
  onTrackTogglePatchSource?: (trackId: string) => void;
  headerWidth: number;
  inPointMs?: number | null;
  outPointMs?: number | null;
  collaborators?: PeerCollaborator[];
}

export const TimelineCanvas: React.FC<TimelineCanvasProps> = ({
  tracks,
  clips,
  currentTimeMs,
  totalDurationMs,
  zoomScale,
  toolMode,
  snapping,
  selectedClipId,
  onSelectClip,
  onSeek,
  onClipTrim,
  onClipSplit,
  onTrackToggleLock,
  onTrackToggleMute,
  onTrackToggleHide,
  onTrackToggleSolo,
  onTrackTogglePatchSource,
  headerWidth,
  inPointMs = null,
  outPointMs = null,
  collaborators = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalSeconds = Math.ceil(totalDurationMs / 1000);
  const totalWidthPx = totalSeconds * zoomScale;
  const playheadX = (currentTimeMs / 1000) * zoomScale;

  // Track dragging volume rubberband
  const [activeRubberbandClipId, setActiveRubberbandClipId] = useState<string | null>(null);

  // Handle clicking on the track lane to seek or razor split
  const handleLanePointerDown = (e: React.PointerEvent, trackId: string) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left - headerWidth + containerRef.current.scrollLeft;
    if (clickX < 0) return;

    let clickedMs = Math.max(0, (clickX / zoomScale) * 1000);

    // Magnetic Snapping to Clip Edges & Playhead
    if (snapping) {
      const snapThresholdMs = 120;
      for (const c of clips) {
        if (Math.abs(clickedMs - c.startMs) < snapThresholdMs) {
          clickedMs = c.startMs;
          break;
        }
        if (Math.abs(clickedMs - (c.startMs + c.durationMs)) < snapThresholdMs) {
          clickedMs = c.startMs + c.durationMs;
          break;
        }
      }
    }

    onSeek(clickedMs);

    // If Razor tool is active, split clip under cursor
    if (toolMode === "razor") {
      const targetClip = clips.find(
        (c) => c.trackId === trackId && clickedMs >= c.startMs && clickedMs <= c.startMs + c.durationMs
      );
      if (targetClip) {
        onClipSplit(targetClip.id, clickedMs);
      }
    }
  };

  // Handle trimming clip edge (left or right bracket handle)
  const startTrim = (
    e: React.PointerEvent,
    clip: TimelineClip,
    edge: "start" | "end"
  ) => {
    e.stopPropagation();
    const initialClientX = e.clientX;
    const initialStartMs = clip.startMs;
    const initialDurationMs = clip.durationMs;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - initialClientX;
      let deltaMs = (deltaX / zoomScale) * 1000;

      if (edge === "end") {
        let proposedDuration = Math.max(300, initialDurationMs + deltaMs);
        if (snapping) {
          const targetEnd = initialStartMs + proposedDuration;
          if (Math.abs(targetEnd - currentTimeMs) < 150) {
            proposedDuration = Math.max(300, currentTimeMs - initialStartMs);
          }
        }
        onClipTrim(clip.id, initialStartMs, proposedDuration);
      } else {
        let proposedStart = Math.max(0, initialStartMs + deltaMs);
        if (snapping && Math.abs(proposedStart - currentTimeMs) < 150) {
          proposedStart = currentTimeMs;
        }
        const proposedDuration = initialDurationMs - (proposedStart - initialStartMs);
        if (proposedDuration > 300) {
          onClipTrim(clip.id, proposedStart, proposedDuration);
        }
      }
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <div ref={containerRef} className="flex-1 flex overflow-x-auto overflow-y-hidden bg-[#101115] relative select-none font-sans">
      {/* 1. Left Track Headers Column (Sticky) */}
      <div 
        style={{ width: `${headerWidth}px` }} 
        className="sticky left-0 z-30 flex-shrink-0 bg-[#141519] border-r border-[#262830] shadow-2xl"
      >
        {tracks.map((t) => (
          <TrackHeader
            key={t.id}
            track={t}
            onToggleLock={onTrackToggleLock}
            onToggleMute={onTrackToggleMute}
            onToggleHide={onTrackToggleHide}
            onToggleSolo={onTrackToggleSolo}
            onTogglePatchSource={onTrackTogglePatchSource}
          />
        ))}
      </div>

      {/* 2. Tracks Canvas Area */}
      <div style={{ width: `${totalWidthPx}px` }} className="relative flex-shrink-0 bg-[#101115]">
        {/* In / Out Shaded Work Area Range */}
        {inPointMs !== null && outPointMs !== null && outPointMs > inPointMs && (
          <div
            style={{
              left: `${(inPointMs / 1000) * zoomScale}px`,
              width: `${((outPointMs - inPointMs) / 1000) * zoomScale}px`,
            }}
            className="absolute top-0 bottom-0 bg-[#3B63FF]/10 border-x border-[#3B63FF]/40 pointer-events-none z-10"
          />
        )}

        {/* Premiere Pro Red CTI Playhead Needle extending down all tracks */}
        <div
          style={{ transform: `translateX(${playheadX}px)` }}
          className="absolute top-0 bottom-0 pointer-events-none z-40 flex flex-col items-center"
        >
          {/* Triangular Red CTI Head */}
          <div 
            className="w-3 h-3 bg-red-500 shadow-md shadow-red-950/80 -mt-0.5" 
            style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 60%, 50% 100%, 0% 60%)" }}
          />
          <div className="w-[1.5px] h-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
        </div>

        {/* Tracks horizontal lanes */}
        {tracks.map((t) => {
          const trackClips = clips.filter((c) => c.trackId === t.id);

          return (
            <div
              key={t.id}
              style={{ height: "52px" }}
              onPointerDown={(e) => handleLanePointerDown(e, t.id)}
              className={`relative border-b border-[#202228] w-full ${
                toolMode === "razor" ? "cursor-crosshair" : "cursor-default"
              } ${t.hidden ? "opacity-25" : ""}`}
            >
              {/* Clips inside Track */}
              {trackClips.map((clip) => {
                const clipLeftPx = (clip.startMs / 1000) * zoomScale;
                const clipWidthPx = (clip.durationMs / 1000) * zoomScale;
                const isSelected = selectedClipId === clip.id;
                const isAudio = clip.type === "audio";
                const isMotion = clip.type === "motion";

                return (
                  <div
                    key={clip.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (toolMode === "razor") {
                        const rect = containerRef.current?.getBoundingClientRect();
                        if (rect) {
                          const clickX = e.clientX - rect.left;
                          const clickedMs = Math.max(0, (clickX / zoomScale) * 1000);
                          onClipSplit(clip.id, clickedMs);
                          return;
                        }
                      }
                      onSelectClip(clip.id);
                    }}
                    style={{
                      left: `${clipLeftPx}px`,
                      width: `${clipWidthPx}px`,
                      height: "46px",
                      top: "3px",
                    }}
                    className={`absolute rounded-[2px] overflow-hidden flex flex-col justify-between border cursor-pointer group shadow-sm transition-all select-none ${
                      clip.colorClass
                    } ${
                      isSelected
                        ? "ring-2 ring-white border-white z-20 shadow-lg shadow-black/80"
                        : clip.borderClass
                    }`}
                  >
                    {/* Left Trim Bracket Handle */}
                    <div
                      onPointerDown={(e) => startTrim(e, clip, "start")}
                      title="Trim In Point"
                      className="absolute left-0 top-0 bottom-0 w-3 cursor-col-resize z-20 flex items-center justify-start opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-red-500/50 to-transparent"
                    >
                      <span className="text-[10px] font-mono font-black text-white pl-0.5">[</span>
                    </div>

                    {/* Transition In Badge */}
                    {clip.transitionIn && clip.transitionIn.type !== "none" && (
                      <div 
                        title={`In Transition: ${clip.transitionIn.type} (${clip.transitionIn.durationMs}ms)`}
                        className="absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-indigo-500/80 to-transparent border-r border-indigo-400/60 z-10 pointer-events-none flex items-center justify-start pl-0.5"
                      >
                        <span className="text-[8px] font-black font-mono text-white leading-none rotate-90">◪</span>
                      </div>
                    )}

                    {/* Clip Header Bar */}
                    <div className="h-4 bg-black/40 border-b border-white/10 px-1.5 flex items-center justify-between text-[10px] font-semibold text-slate-100 z-10">
                      <div className="flex items-center gap-1 overflow-hidden">
                        {/* fx Badge */}
                        <span 
                          title="Effects Status: Green = Native, Amber = Remotion/LUT Active"
                          className={`w-3.5 h-2.5 rounded-[1px] flex items-center justify-center text-[7px] font-black uppercase font-mono border ${
                            isMotion || clip.ducked || clip.title.includes("LUT") || clip.hasFx
                              ? "bg-amber-500 text-black border-amber-300"
                              : "bg-[#2b2e36] text-slate-400 border-[#3d414d]"
                          }`}
                        >
                          fx
                        </span>
                        <span className="truncate">{clip.title}</span>
                      </div>

                      <span className="text-[8.5px] opacity-75 font-mono">
                        {(clip.durationMs / 1000).toFixed(1)}s
                      </span>
                    </div>

                    {/* Clip Body: Mirrored Audio Waveform or Video Frames */}
                    <div className="flex-1 relative flex items-center px-1 overflow-hidden">
                      {isAudio && (
                        /* Realistic Mirrored Audio Waveform */
                        <div className="w-full h-full flex items-center gap-[1.5px] opacity-80 py-1">
                          {Array.from({ length: Math.min(60, Math.floor(clipWidthPx / 3)) }).map((_, i) => {
                            // Symmetrical mirrored heights
                            const seed = (i * 7) % 19;
                            const h = Math.round(4 + (seed * 1.3));
                            return (
                              <div
                                key={i}
                                style={{ height: `${Math.min(22, Math.max(3, h))}px` }}
                                className="w-[1.5px] bg-emerald-300 rounded-full my-auto"
                              />
                            );
                          })}
                        </div>
                      )}

                      {/* Volume Rubberband Wire on Audio Clips */}
                      {isAudio && (
                        <div 
                          className="absolute left-0 right-0 h-[1px] bg-white/50 hover:bg-[#3B63FF] hover:h-[2px] cursor-ns-resize group/wire z-10"
                          style={{ top: "60%" }}
                          title="Audio Volume Rubberband: 0.0 dB"
                        >
                          <div className="w-1.5 h-1.5 bg-white border border-[#3B63FF] rotate-45 absolute -top-[3px] left-1/3 opacity-0 group-hover/wire:opacity-100 transition-opacity" />
                          <div className="w-1.5 h-1.5 bg-white border border-[#3B63FF] rotate-45 absolute -top-[3px] left-2/3 opacity-0 group-hover/wire:opacity-100 transition-opacity" />
                        </div>
                      )}

                      {/* Video / Motion FX representation */}
                      {!isAudio && isMotion && (
                        <div className="flex items-center gap-1 text-[9px] font-mono text-indigo-200/90 pl-1">
                          <Sparkles className="w-2.5 h-2.5 text-cyan-300" />
                          <span>Remotion 3D Node</span>
                        </div>
                      )}

                      {/* Auto-Ducking Indicator */}
                      {clip.ducked && (
                        <div className="absolute bottom-1 right-2 flex items-center gap-1 text-[8px] font-mono text-rose-300/90 bg-rose-950/60 px-1 rounded border border-rose-800/40">
                          <span>-12dB Duck</span>
                        </div>
                      )}
                    </div>

                    {/* Crossfade Corner Dog-Ear */}
                    <div className="crossfade-dogear right-0" />

                    {/* Transition Out Badge */}
                    {clip.transitionOut && clip.transitionOut.type !== "none" && (
                      <div 
                        title={`Out Transition: ${clip.transitionOut.type} (${clip.transitionOut.durationMs}ms)`}
                        className="absolute right-0 top-0 bottom-0 w-5 bg-gradient-to-l from-indigo-500/80 to-transparent border-l border-indigo-400/60 z-10 pointer-events-none flex items-center justify-end pr-0.5"
                      >
                        <span className="text-[8px] font-black font-mono text-white leading-none -rotate-90">◪</span>
                      </div>
                    )}

                    {/* Right Trim Bracket Handle */}
                    <div
                      onPointerDown={(e) => startTrim(e, clip, "end")}
                      title="Trim Out Point"
                      className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize z-20 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-l from-red-500/50 to-transparent"
                    >
                      <span className="text-[10px] font-mono font-black text-white pr-0.5">]</span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
