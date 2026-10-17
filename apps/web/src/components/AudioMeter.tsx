"use client";

import React, { useEffect, useState } from "react";

interface AudioMeterProps {
  isPlaying: boolean;
}

export const AudioMeter: React.FC<AudioMeterProps> = ({ isPlaying }) => {
  const [levelL, setLevelL] = useState(25);
  const [levelR, setLevelR] = useState(24);
  const [peakHoldL, setPeakHoldL] = useState(35);
  const [peakHoldR, setPeakHoldR] = useState(34);

  useEffect(() => {
    if (!isPlaying) {
      setLevelL(4);
      setLevelR(4);
      return;
    }

    const interval = setInterval(() => {
      // Dynamic calibrated levels around -14 LUFS target
      const base = 66;
      const jL = Math.floor(Math.random() * 18) - 9;
      const jR = Math.floor(Math.random() * 18) - 9;
      const curL = Math.min(94, Math.max(8, base + jL));
      const curR = Math.min(94, Math.max(8, base + jR));

      setLevelL(curL);
      setLevelR(curR);

      // Peak-hold updates
      setPeakHoldL((prev) => Math.max(curL, Math.max(8, prev - 1.5)));
      setPeakHoldR((prev) => Math.max(curR, Math.max(8, prev - 1.5)));
    }, 60);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Segment count
  const NUM_SEGS = 24;

  const renderChannel = (level: number, peakHold: number) => {
    return (
      <div className="w-2.5 bg-[#0a0c10] border border-[#202228] p-[1px] rounded-[1px] flex flex-col justify-end gap-[1px] h-full relative">
        {Array.from({ length: NUM_SEGS }).map((_, i) => {
          // Bottom-up indexing: 0 is lowest dB, NUM_SEGS-1 is peak
          const segIdx = NUM_SEGS - 1 - i;
          const segPercent = (segIdx / NUM_SEGS) * 100;
          const isLit = level >= segPercent;

          // Color classification:
          // Top 2 segments: Red (Clip zone > 0 dB)
          // Next 6 segments: Amber (-6 dB to 0 dB)
          // Lower 16 segments: Emerald (< -6 dB)
          const isRed = segIdx >= NUM_SEGS - 2;
          const isYellow = segIdx >= NUM_SEGS - 8 && segIdx < NUM_SEGS - 2;

          let colorClass = "bg-[#181a20] opacity-30";
          if (isLit) {
            if (isRed) colorClass = "bg-rose-500 shadow-[0_0_4px_rgba(244,63,94,0.8)] opacity-100";
            else if (isYellow) colorClass = "bg-amber-400 shadow-[0_0_3px_rgba(251,191,36,0.6)] opacity-100";
            else colorClass = "bg-emerald-400 shadow-[0_0_2px_rgba(52,211,153,0.5)] opacity-100";
          }

          return (
            <div
              key={segIdx}
              className={`w-full h-[2.5px] rounded-[0.5px] transition-colors duration-75 ${colorClass}`}
            />
          );
        })}

        {/* Peak Hold Tick Line */}
        <div
          style={{ bottom: `${peakHold}%` }}
          className="absolute left-0 right-0 h-[1.5px] bg-white shadow-sm pointer-events-none z-10"
        />
      </div>
    );
  };

  return (
    <div className="w-14 bg-[#141519] border-l border-[#262830] flex flex-col items-center py-2 px-1 select-none text-[8.5px] text-slate-400 font-sans">
      {/* Header */}
      <span className="font-bold text-[8px] text-slate-300 tracking-wider uppercase font-mono">
        MASTER
      </span>

      {/* Target indicator */}
      <div className="w-full flex justify-between items-center px-1 text-[8px] font-mono text-emerald-400 font-semibold my-0.5">
        <span>-14</span>
        <span className="text-[7px] text-slate-500">LUFS</span>
      </div>

      {/* Stereo Dual Segmented LED Meters with dB Scale */}
      <div className="flex-1 w-full flex items-center justify-center gap-1 py-1">
        {/* Left Channel */}
        {renderChannel(levelL, peakHoldL)}

        {/* Scale Ticks */}
        <div className="flex flex-col justify-between h-full text-[7px] font-mono text-slate-500 leading-none py-0.5">
          <span className="text-rose-400 font-bold">+3</span>
          <span className="text-amber-400 font-bold">0</span>
          <span>-6</span>
          <span className="text-emerald-400 font-bold">-12</span>
          <span>-18</span>
          <span>-24</span>
          <span>-36</span>
          <span>-48</span>
        </div>

        {/* Right Channel */}
        {renderChannel(levelR, peakHoldR)}
      </div>

      {/* Numerical True Peak & LUFS Status */}
      <div className="w-full flex flex-col items-center pt-1 border-t border-[#202228] text-center">
        <span className="text-[8px] font-mono text-slate-300 font-bold tabular-timecode">
          {isPlaying ? "-14.0" : "-inf"}
        </span>
        <span className="text-[6.5px] text-emerald-400 uppercase font-black tracking-wider">
          BROADCAST
        </span>
      </div>
    </div>
  );
};
