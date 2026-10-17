"use client";

import React, { useRef, useState } from "react";
import { TrackConfig, TrackHeader } from "./TrackHeader";
import { ToolMode } from "./TimelineToolbar";

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
  headerWidth: number;
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
  headerWidth,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalSeconds = Math.ceil(totalDurationMs / 1000);
  const totalWidthPx = totalSeconds * zoomScale;
  const playheadX = (currentTimeMs / 1000) * zoomScale;

  // Handle clicking on the track lane to seek or razor split
  const handleLanePointerDown = (e: React.PointerEvent, trackId: string) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left - headerWidth;
    if (clickX < 0) return;

    const clickedMs = Math.max(0, (clickX / zoomScale) * 1000);
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

  // Handle trimming clip edge (left or right handle)
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
      const deltaMs = (deltaX / zoomScale) * 1000;

      if (edge === "end") {
        const newDuration = Math.max(500, initialDurationMs + deltaMs);
        onClipTrim(clip.id, initialStartMs, newDuration);
      } else {
        const proposedStart = Math.max(0, initialStartMs + deltaMs);
        const proposedDuration = initialDurationMs - (proposedStart - initialStartMs);
        if (proposedDuration > 500) {
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
    <div ref={containerRef} className="flex-1 flex overflow-x-auto overflow-y-hidden bg-studio-950 relative select-none">
      {/* Left Track Headers Column */}
      <div 
        style={{ width: `${headerWidth}px` }} 
        className="sticky left-0 z-20 flex-shrink-0 bg-studio-900 border-r border-studio-800 shadow-lg"
      >
        {tracks.map((t) => (
          <TrackHeader
            key={t.id}
            track={t}
            onToggleLock={onTrackToggleLock}
            onToggleMute={onTrackToggleMute}
            onToggleHide={onTrackToggleHide}
          />
        ))}
      </div>

      {/* Tracks Canvas Area */}
      <div style={{ width: `${totalWidthPx}px` }} className="relative flex-shrink-0">
        {/* Playhead Vertical Needle extending down all tracks */}
        <div
          style={{ transform: `translateX(${playheadX}px)` }}
          className="absolute top-0 bottom-0 pointer-events-none z-30 flex flex-col items-center"
        >
          <div className="w-[1.5px] h-full bg-red-500 playhead-needle" />
        </div>

        {/* Tracks horizontal lanes */}
        {tracks.map((t) => {
          const trackClips = clips.filter((c) => c.trackId === t.id);

          return (
            <div
              key={t.id}
              style={{ height: "52px" }}
              onPointerDown={(e) => handleLanePointerDown(e, t.id)}
              className={`relative border-b border-studio-800/80 w-full cursor-crosshair ${
                t.id === "v3" ? "timeline-track-v3" :
                t.id === "v2" ? "timeline-track-v2" :
                t.id === "v1" ? "timeline-track-v1" :
                t.id === "a1" ? "timeline-track-a1" : "timeline-track-a2"
              }`}
            >
              {/* Clips inside Track */}
              {trackClips.map((clip) => {
                const clipLeftPx = (clip.startMs / 1000) * zoomScale;
                const clipWidthPx = (clip.durationMs / 1000) * zoomScale;
                const isSelected = selectedClipId === clip.id;

                return (
                  <div
                    key={clip.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectClip(clip.id);
                    }}
                    style={{
                      left: `${clipLeftPx}px`,
                      width: `${clipWidthPx}px`,
                      height: "44px",
                      top: "4px",
                    }}
                    className={`absolute rounded-sm p-1.5 flex flex-col justify-between border cursor-pointer group shadow-sm craft-clip ${
                      clip.colorClass
                    } ${
                      isSelected
                        ? "ring-2 ring-white border-white z-10"
                        : clip.borderClass
                    }`}
                  >
                    {/* Left Trim Handle */}
                    <div
                      onPointerDown={(e) => startTrim(e, clip, "start")}
                      className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    />

                    {/* Clip Title & Time info */}
                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-100 overflow-hidden text-ellipsis whitespace-nowrap">
                      <span>{clip.title}</span>
                      <span className="text-[9px] opacity-75 font-mono">
                        {(clip.durationMs / 1000).toFixed(1)}s
                      </span>
                    </div>

                    {/* Waveform Visualization (for Audio A1 Track) */}
                    {clip.waveform && (
                      <div className="w-full h-4 flex items-center gap-[2px] opacity-80">
                        {Array.from({ length: Math.min(30, Math.floor(clipWidthPx / 4)) }).map((_, i) => {
                          const h = Math.round((i % 3 === 0 ? 12 : i % 2 === 0 ? 8 : 4) + (Math.sin(i) * 3));
                          return (
                            <div
                              key={i}
                              style={{ height: `${Math.max(3, h)}px` }}
                              className="w-[2px] bg-emerald-200/90 rounded-full"
                            />
                          );
                        })}
                      </div>
                    )}

                    {/* Auto-Ducking Visual Curve (for Music A2 Track) */}
                    {clip.ducked && (
                      <div className="w-full flex items-center justify-between text-[8px] font-mono text-rose-200/80">
                        <span>-12dB Ducking active</span>
                        <div className="h-[2px] w-12 bg-rose-300 rounded" />
                      </div>
                    )}

                    {/* Right Trim Handle */}
                    <div
                      onPointerDown={(e) => startTrim(e, clip, "end")}
                      className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    />
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
