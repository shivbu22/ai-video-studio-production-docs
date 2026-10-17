"use client";

import React, { useRef } from "react";

interface TimelineRulerProps {
  totalDurationMs: number;
  currentTimeMs: number;
  zoomScale: number; // pixels per second
  onSeek: (ms: number) => void;
  headerWidth: number;
}

export const TimelineRuler: React.FC<TimelineRulerProps> = ({
  totalDurationMs,
  currentTimeMs,
  zoomScale,
  onSeek,
  headerWidth,
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
    <div className="h-7 bg-studio-900 border-b border-studio-800 flex select-none relative">
      {/* Left Spacer corresponding to Track Headers */}
      <div 
        style={{ width: `${headerWidth}px` }} 
        className="h-full bg-studio-950 border-r border-studio-800 flex items-center px-3 text-[10px] text-slate-500 font-mono"
      >
        TRACKS
      </div>

      {/* Ticks Canvas Container */}
      <div
        ref={rulerRef}
        onPointerDown={handlePointerDown}
        style={{ width: `${totalWidthPx}px` }}
        className="relative h-full cursor-pointer overflow-hidden"
      >
        {/* Render Second & Frame Ticks */}
        {Array.from({ length: totalSeconds + 1 }).map((_, sec) => {
          const x = sec * zoomScale;
          const minutes = Math.floor(sec / 60);
          const remainingSec = sec % 60;
          const label = `${String(minutes).padStart(2, "0")}:${String(remainingSec).padStart(2, "0")}`;

          return (
            <React.Fragment key={sec}>
              {/* Major Second Tick */}
              <div
                style={{ left: `${x}px` }}
                className="absolute top-0 bottom-0 border-l border-studio-700/80 flex flex-col justify-between pl-1"
              >
                <span className="text-[9px] font-mono text-slate-400 font-semibold">{label}</span>
                <div className="h-2 w-[1px] bg-studio-600" />
              </div>

              {/* Sub-second Minor Ticks (at 1/2 second) */}
              <div
                style={{ left: `${x + zoomScale / 2}px` }}
                className="absolute bottom-0 h-1.5 w-[1px] bg-studio-800"
              />
            </React.Fragment>
          );
        })}

        {/* Playhead Flag on Ruler */}
        <div
          style={{ transform: `translateX(${playheadX}px)` }}
          className="absolute top-0 bottom-0 pointer-events-none z-20 flex flex-col items-center -ml-2"
        >
          {/* Red Flag Shape */}
          <div className="w-4 h-4 bg-red-500 text-white flex items-center justify-center clip-flag shadow-md">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
