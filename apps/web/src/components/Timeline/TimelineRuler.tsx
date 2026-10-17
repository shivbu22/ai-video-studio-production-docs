"use client";

import React, { useRef } from "react";

interface TimelineRulerProps {
  totalDurationMs: number;
  currentTimeMs: number;
  zoomScale: number; // pixels per second
  onSeek: (ms: number) => void;
  headerWidth: number;
  inPointMs?: number | null;
  outPointMs?: number | null;
}

export const TimelineRuler: React.FC<TimelineRulerProps> = ({
  totalDurationMs,
  currentTimeMs,
  zoomScale,
  onSeek,
  headerWidth,
  inPointMs = null,
  outPointMs = null,
}) => {
  const rulerRef = useRef<HTMLDivElement>(null);
  const totalSeconds = Math.ceil(totalDurationMs / 1000);
  const totalWidthPx = totalSeconds * zoomScale;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const offsetX = Math.max(0, e.clientX - rect.left);
    const newSeconds = offsetX / zoomScale;
    onSeek(Math.min(totalDurationMs, Math.max(0, newSeconds * 1000)));

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const moveOffsetX = Math.max(0, moveEvent.clientX - rect.left);
      const moveSeconds = moveOffsetX / zoomScale;
      onSeek(Math.min(totalDurationMs, Math.max(0, moveSeconds * 1000)));
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const playheadX = (currentTimeMs / 1000) * zoomScale;

  return (
    <div className="h-7 bg-[#141519] border-b border-[#262830] flex select-none relative font-sans">
      {/* Left Spacer corresponding to Track Headers */}
      <div 
        style={{ width: `${headerWidth}px` }} 
        className="h-full bg-[#111215] border-r border-[#262830] flex items-center justify-between px-2.5 text-[9px] text-slate-500 font-mono font-bold tracking-wider"
      >
        <span>TIMELINE</span>
        <span className="text-[8px] text-slate-600">30 FPS</span>
      </div>

      {/* Ticks Canvas Container */}
      <div
        ref={rulerRef}
        onPointerDown={handlePointerDown}
        style={{ width: `${totalWidthPx}px` }}
        className="relative h-full cursor-pointer overflow-hidden bg-[#141519]"
      >
        {/* Shaded Work Area Range Bar */}
        {inPointMs !== null && outPointMs !== null && outPointMs > inPointMs && (
          <div
            style={{
              left: `${(inPointMs / 1000) * zoomScale}px`,
              width: `${((outPointMs - inPointMs) / 1000) * zoomScale}px`,
            }}
            className="absolute top-0 bottom-0 bg-[#3B63FF]/25 border-x-2 border-[#3B63FF] pointer-events-none z-10 flex items-center justify-between px-1"
          >
            <span className="text-[8px] font-mono font-bold text-white bg-[#3B63FF] px-0.5 rounded-[1px]">IN</span>
            <span className="text-[8px] font-mono font-bold text-white bg-[#3B63FF] px-0.5 rounded-[1px]">OUT</span>
          </div>
        )}

        {/* Render Second & Frame Ticks */}
        {Array.from({ length: totalSeconds + 1 }).map((_, sec) => {
          const x = sec * zoomScale;
          const minutes = Math.floor(sec / 60);
          const remainingSec = sec % 60;
          // SMPTE Timecode format
          const label = `00:${String(minutes).padStart(2, "0")}:${String(remainingSec).padStart(2, "0")}:00`;

          return (
            <React.Fragment key={sec}>
              {/* Major Second Tick */}
              <div
                style={{ left: `${x}px` }}
                className="absolute top-0 bottom-0 border-l border-[#353842] flex flex-col justify-between pl-1 pointer-events-none"
              >
                <span className="text-[8.5px] font-mono text-slate-400 font-bold tabular-timecode">{label}</span>
                <div className="h-2 w-[1px] bg-[#4a4e5c]" />
              </div>

              {/* Sub-second Minor Frame Ticks (Quarter-second / 8 frames) */}
              {zoomScale > 40 && (
                <>
                  <div
                    style={{ left: `${x + zoomScale * 0.25}px` }}
                    className="absolute bottom-0 h-1 w-[1px] bg-[#2a2d36] pointer-events-none"
                  />
                  <div
                    style={{ left: `${x + zoomScale * 0.5}px` }}
                    className="absolute bottom-0 h-1.5 w-[1px] bg-[#353842] pointer-events-none"
                  />
                  <div
                    style={{ left: `${x + zoomScale * 0.75}px` }}
                    className="absolute bottom-0 h-1 w-[1px] bg-[#2a2d36] pointer-events-none"
                  />
                </>
              )}
            </React.Fragment>
          );
        })}

        {/* Premiere Pro Red CTI Playhead Flag on Ruler */}
        <div
          style={{ transform: `translateX(${playheadX}px)` }}
          className="absolute top-0 bottom-0 pointer-events-none z-30 flex flex-col items-center -ml-1.5"
        >
          {/* Triangular Red CTI Head */}
          <div 
            className="w-3.5 h-3.5 bg-red-500 shadow-md shadow-red-950/80 pointer-events-auto"
            style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 60%, 50% 100%, 0% 60%)" }}
          />
        </div>
      </div>
    </div>
  );
};
