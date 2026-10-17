"use client";

import React from "react";
import { Eye, EyeOff, Lock, Unlock, Volume2, VolumeX } from "lucide-react";

export interface TrackConfig {
  id: string;
  name: string;
  type: "video" | "audio";
  colorClass: string;
  locked?: boolean;
  muted?: boolean;
  hidden?: boolean;
}

interface TrackHeaderProps {
  track: TrackConfig;
  onToggleLock: (trackId: string) => void;
  onToggleMute: (trackId: string) => void;
  onToggleHide: (trackId: string) => void;
  heightPx?: number;
}

export const TrackHeader: React.FC<TrackHeaderProps> = ({
  track,
  onToggleLock,
  onToggleMute,
  onToggleHide,
  heightPx = 52,
}) => {
  return (
    <div
      style={{ height: `${heightPx}px` }}
      className="w-40 bg-studio-900 border-r border-b border-studio-800 px-2.5 flex items-center justify-between text-xs select-none"
    >
      {/* Track Name & Color Accent */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-6 rounded-full ${track.colorClass}`} />
        <span className="font-semibold text-slate-200 text-[11px]">{track.name}</span>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-1">
        {track.type === "video" ? (
          <button
            onClick={() => onToggleHide(track.id)}
            title="Toggle Output"
            className={`p-1 rounded hover:bg-studio-800 ${
              track.hidden ? "text-slate-600" : "text-slate-300"
            }`}
          >
            {track.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </button>
        ) : (
          <button
            onClick={() => onToggleMute(track.id)}
            title="Mute Track"
            className={`px-1 py-0.5 rounded text-[10px] font-bold ${
              track.muted ? "bg-rose-900/60 text-rose-300" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            M
          </button>
        )}

        <button
          onClick={() => onToggleLock(track.id)}
          title="Toggle Track Lock"
          className={`p-1 rounded hover:bg-studio-800 ${
            track.locked ? "text-amber-400" : "text-slate-500"
          }`}
        >
          {track.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
};
