"use client";

import React from "react";
import { Eye, EyeOff, Lock, Unlock, Volume2, VolumeX, Mic, Link2, Radio } from "lucide-react";

export interface TrackConfig {
  id: string;
  name: string;
  type: "video" | "audio";
  colorClass: string;
  locked?: boolean;
  muted?: boolean;
  hidden?: boolean;
  soloed?: boolean;
  isPatchSource?: boolean;
}

interface TrackHeaderProps {
  track: TrackConfig;
  onToggleLock: (trackId: string) => void;
  onToggleMute: (trackId: string) => void;
  onToggleHide: (trackId: string) => void;
  onToggleSolo?: (trackId: string) => void;
  onTogglePatchSource?: (trackId: string) => void;
  heightPx?: number;
}

export const TrackHeader: React.FC<TrackHeaderProps> = ({
  track,
  onToggleLock,
  onToggleMute,
  onToggleHide,
  onToggleSolo,
  onTogglePatchSource,
  heightPx = 52,
}) => {
  const isVideo = track.type === "video";

  return (
    <div
      style={{ height: `${heightPx}px` }}
      className="w-44 bg-[#141519] border-r border-b border-[#262830] px-2 flex items-center justify-between text-xs select-none font-sans"
    >
      {/* 1. Track Patching & Name */}
      <div className="flex items-center gap-1.5 overflow-hidden">
        {/* Source Patch Indicator (V1 / A1) */}
        <button
          onClick={() => onTogglePatchSource && onTogglePatchSource(track.id)}
          title={`Source Patch Target: ${track.id.toUpperCase()}`}
          className={`w-6 h-5 rounded-[2px] font-mono text-[9px] font-bold flex items-center justify-center border transition-all ${
            track.isPatchSource !== false && (track.id === "v1" || track.id === "a1")
              ? "bg-[#3B63FF] text-white border-[#3B63FF] shadow-sm shadow-[#3B63FF]/30"
              : "bg-[#1c1e24] text-slate-500 border-[#2a2d36] hover:text-slate-300"
          }`}
        >
          {track.id.toUpperCase()}
        </button>

        {/* Track Label */}
        <div className="flex flex-col overflow-hidden">
          <span className="font-bold text-slate-200 text-[10px] truncate leading-tight">
            {track.name}
          </span>
          <span className="text-[8px] font-mono text-slate-500 leading-tight">
            {isVideo ? "Composite" : "0.0 dB · Stereo"}
          </span>
        </div>
      </div>

      {/* 2. Pro NLE Control Buttons */}
      <div className="flex items-center gap-0.5">
        {/* Sync Lock Icon */}
        <button
          title="Toggle Track Sync Lock"
          className="p-1 text-slate-500 hover:text-slate-300 rounded-[2px] transition-colors"
        >
          <Link2 className="w-2.5 h-2.5" />
        </button>

        {isVideo ? (
          /* Video Output Eye */
          <button
            onClick={() => onToggleHide(track.id)}
            title="Toggle Output Display (Eye)"
            className={`p-1 rounded-[2px] transition-colors ${
              track.hidden ? "text-slate-600 bg-black/40" : "text-slate-300 hover:text-white"
            }`}
          >
            {track.hidden ? <EyeOff className="w-3 h-3 text-rose-400" /> : <Eye className="w-3 h-3" />}
          </button>
        ) : (
          /* Audio Controls: Mute (M), Solo (S), Record (Mic) */
          <>
            <button
              onClick={() => onToggleMute(track.id)}
              title="Mute Track (M)"
              className={`w-4 h-4 rounded-[2px] text-[9px] font-mono font-bold flex items-center justify-center transition-all ${
                track.muted 
                  ? "bg-rose-600 text-white shadow-sm" 
                  : "bg-[#1c1e24] text-slate-400 hover:text-white border border-[#2a2d36]"
              }`}
            >
              M
            </button>

            <button
              onClick={() => onToggleSolo && onToggleSolo(track.id)}
              title="Solo Track (S)"
              className={`w-4 h-4 rounded-[2px] text-[9px] font-mono font-bold flex items-center justify-center transition-all ${
                track.soloed 
                  ? "bg-amber-500 text-black shadow-sm font-black" 
                  : "bg-[#1c1e24] text-slate-400 hover:text-white border border-[#2a2d36]"
              }`}
            >
              S
            </button>

            <button
              title="Voiceover Record"
              className="p-0.5 text-slate-500 hover:text-rose-400 rounded-[2px]"
            >
              <Mic className="w-2.5 h-2.5" />
            </button>
          </>
        )}

        {/* Track Lock */}
        <button
          onClick={() => onToggleLock(track.id)}
          title="Lock Track"
          className={`p-1 rounded-[2px] transition-colors ${
            track.locked ? "text-amber-400 bg-amber-500/10" : "text-slate-600 hover:text-slate-300"
          }`}
        >
          {track.locked ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
        </button>
      </div>
    </div>
  );
};
