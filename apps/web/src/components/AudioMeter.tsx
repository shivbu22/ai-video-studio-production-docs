"use client";

import React, { useEffect, useState } from "react";

interface AudioMeterProps {
  isPlaying: boolean;
}

export const AudioMeter: React.FC<AudioMeterProps> = ({ isPlaying }) => {
  const [levelL, setLevelL] = useState(25);
  const [levelR, setLevelR] = useState(24);

  useEffect(() => {
    if (!isPlaying) {
      setLevelL(5);
      setLevelR(5);
      return;
    }

    const interval = setInterval(() => {
      // Bouncing levels around -14 LUFS (-14dB target is ~70% of bar)
      const base = 68;
      const jitterL = Math.floor(Math.random() * 16) - 8;
      const jitterR = Math.floor(Math.random() * 16) - 8;
      setLevelL(Math.min(95, Math.max(10, base + jitterL)));
      setLevelR(Math.min(95, Math.max(10, base + jitterR)));
    }, 80);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-14 bg-studio-900 border-l border-studio-800 flex flex-col items-center py-2 px-1 select-none text-[9px] text-slate-400">
      <span className="font-bold text-[8px] text-slate-300 mb-1 tracking-wider uppercase">LUFS</span>
      
      {/* Target indicator */}
      <div className="w-full flex justify-between items-center px-1 text-[8px] font-mono text-emerald-400">
        <span>-14</span>
        <span className="text-[7px] text-slate-500">REF</span>
      </div>

      {/* Stereo Dual Meters */}
      <div className="flex-1 w-full flex justify-center gap-1.5 py-1">
        {/* Left Channel */}
        <div className="w-2.5 bg-studio-950 rounded-sm relative flex flex-col justify-end overflow-hidden border border-studio-800">
          {/* Target Line at -14 LUFS */}
          <div className="absolute top-[30%] w-full h-[1px] bg-amber-400 z-10 opacity-70" />
          <div
            className="w-full transition-all duration-100 ease-out rounded-b-sm bg-gradient-to-t from-emerald-500 via-amber-400 to-rose-500 shadow-sm shadow-emerald-500/20"
            style={{ height: `${levelL}%` }}
          />
        </div>

        {/* Right Channel */}
        <div className="w-2.5 bg-studio-950 rounded-sm relative flex flex-col justify-end overflow-hidden border border-studio-800">
          <div className="absolute top-[30%] w-full h-[1px] bg-amber-400 z-10 opacity-70" />
          <div
            className="w-full transition-all duration-100 ease-out rounded-b-sm bg-gradient-to-t from-emerald-500 via-amber-400 to-rose-500 shadow-sm shadow-emerald-500/20"
            style={{ height: `${levelR}%` }}
          />
        </div>
      </div>

      {/* Peak True Value */}
      <div className="text-[8px] font-mono text-slate-400 mt-1">
        {isPlaying ? "-14.2" : "-inf"}
      </div>
      <span className="text-[7px] text-emerald-400 uppercase font-bold">Passed</span>
    </div>
  );
};
