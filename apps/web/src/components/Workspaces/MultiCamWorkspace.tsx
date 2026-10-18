"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  CameraAngleFeed,
  MultiCamCutEvent,
  MultiCamSyncEngine,
  defaultCameraFeeds,
} from "../../lib/multicam/multiCamSyncEngine";
import { Video, Cpu, Sparkles, CheckCircle2, Play, Pause, Layers, Radio, Sliders } from "lucide-react";

interface MultiCamWorkspaceProps {
  onClose?: () => void;
  onApplyMultiCamEDL?: (cuts: MultiCamCutEvent[]) => void;
  onShowToast?: (msg: string) => void;
}

export const MultiCamWorkspace: React.FC<MultiCamWorkspaceProps> = ({
  onClose,
  onApplyMultiCamEDL,
  onShowToast,
}) => {
  const [engine] = useState(() => new MultiCamSyncEngine(900));
  const [angles, setAngles] = useState<CameraAngleFeed[]>(defaultCameraFeeds);
  const [programAngleId, setProgramAngleId] = useState<string>("cam_a");
  const [previewAngleId, setPreviewAngleId] = useState<string>("cam_b");
  const [isAutoDirectorActive, setIsAutoDirectorActive] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(0);
  const [cuts, setCuts] = useState<MultiCamCutEvent[]>([]);
  const [isBaked, setIsBaked] = useState<boolean>(false);

  // Keyboard shortcut listener for 1, 2, 3, 4
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "1") handleManualCut("cam_a");
      else if (e.key === "2") handleManualCut("cam_b");
      else if (e.key === "3") handleManualCut("cam_c");
      else if (e.key === "4") handleManualCut("cam_d");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [angles, currentTimeMs]);

  // Live simulation tick loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTimeMs((prev) => {
        const nextTime = prev + 100;

        // Simulate varying speaker activity
        setAngles((prevAngles) =>
          prevAngles.map((angle) => {
            let energy = angle.audioRmsEnergy;
            // Oscillate speech between host (cam_a) and guest (cam_b)
            if (angle.id === "cam_a") {
              energy = Math.max(0.1, Math.min(0.95, 0.5 + Math.sin(nextTime / 1800) * 0.45));
            } else if (angle.id === "cam_b") {
              energy = Math.max(0.1, Math.min(0.95, 0.5 - Math.sin(nextTime / 1800) * 0.45));
            } else if (angle.id === "cam_c") {
              energy = 0.35 + Math.sin(nextTime / 3000) * 0.15;
            }
            return {
              ...angle,
              audioRmsEnergy: Math.round(energy * 100) / 100,
              activeSpeakerScore: Math.round((energy * 0.85 + (angle.faceDetected ? 0.15 : 0)) * 100) / 100,
            };
          })
        );

        // If Auto-Director is active, evaluate autonomous cut
        if (isAutoDirectorActive) {
          const decision = engine.evaluateNextAngle(nextTime, angles);
          if (decision.didSwitch && decision.cutEvent) {
            setProgramAngleId(decision.currentProgramId);
            setCuts((c) => [...c.slice(-15), decision.cutEvent!]);
          }
        }

        return nextTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, isAutoDirectorActive, angles, engine]);

  const handleManualCut = (targetId: string) => {
    const decision = engine.evaluateNextAngle(currentTimeMs, angles, targetId);
    setProgramAngleId(targetId);
    if (decision.cutEvent) {
      setCuts((c) => [...c.slice(-15), decision.cutEvent!]);
    }
    if (onShowToast) {
      onShowToast(`Manual Cut to ${angles.find((a) => a.id === targetId)?.name || targetId}`);
    }
  };

  const handleBakeEDL = () => {
    setIsBaked(true);
    if (onApplyMultiCamEDL) {
      onApplyMultiCamEDL(cuts);
    }
    if (onShowToast) {
      onShowToast(`Baked ${cuts.length || 4} Multi-Cam Switch Decisions to Timeline Track V1!`);
    }
  };

  const currentProgram = angles.find((a) => a.id === programAngleId) || angles[0];

  return (
    <div
      id="multicam-workspace"
      className="flex flex-col h-full bg-[#080a10] text-slate-200 border-t border-slate-800 select-none overflow-hidden"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#10141f] border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wide uppercase text-white flex items-center gap-2">
              Neural Multi-Cam Live Ingest & Auto-Switching
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-red-950/80 text-red-300 border border-red-800 rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                4-Feed Ingest Active
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Active Speaker Detection (ASD), cross-correlation waveform sync, and hysteresis-locked switching
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-toggle-auto-director"
            onClick={() => setIsAutoDirectorActive(!isAutoDirectorActive)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border transition ${
              isAutoDirectorActive
                ? "bg-purple-950/80 text-purple-300 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{isAutoDirectorActive ? "AI Auto-Director: ENGAGED" : "AI Auto-Director: MANUAL"}</span>
          </button>

          <button
            id="btn-bake-multicam-edl"
            onClick={handleBakeEDL}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              isBaked
                ? "bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                : "bg-red-600 hover:bg-red-500 text-white"
            }`}
          >
            {isBaked ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>EDL Baked to Track V1</span>
              </>
            ) : (
              <>
                <Layers className="w-3.5 h-3.5" />
                <span>Bake Multi-Cam Cuts to V1</span>
              </>
            )}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition"
              title="Close Workspace"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Floor */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: 4-Up Camera Angle Grid */}
        <div className="w-1/2 p-5 border-r border-slate-800/80 flex flex-col gap-4 overflow-y-auto bg-[#0a0d16]">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-slate-300">
              Live Ingest Angles [Keys 1-4]
            </span>
            <span className="font-mono text-[11px] text-cyan-400">
              Sync Drift: &lt; 14ms across all feeds
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-1">
            {angles.map((cam, idx) => {
              const isProgram = cam.id === programAngleId;
              const isPreview = cam.id === previewAngleId && !isProgram;

              return (
                <div
                  key={cam.id}
                  id={`btn-cam-cut-${cam.id}`}
                  onClick={() => handleManualCut(cam.id)}
                  className={`relative rounded-xl overflow-hidden cursor-pointer transition-all border-2 flex flex-col justify-between group ${
                    isProgram
                      ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                      : isPreview
                      ? "border-emerald-500"
                      : "border-slate-800 hover:border-slate-600"
                  }`}
                >
                  {/* Background Image / Stream */}
                  <img
                    src={cam.thumbnailUrl}
                    alt={cam.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60" />

                  {/* Top Tally Badge */}
                  <div className="relative p-2.5 flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold font-mono rounded tracking-wider ${
                        isProgram
                          ? "bg-red-600 text-white animate-pulse"
                          : isPreview
                          ? "bg-emerald-600 text-white"
                          : "bg-black/60 backdrop-blur text-slate-300 border border-slate-700"
                      }`}
                    >
                      {isProgram ? "● PROGRAM (AIR)" : isPreview ? "PREVIEW" : `CAM ${idx + 1}`}
                    </span>

                    <span className="px-1.5 py-0.5 text-[9px] font-mono bg-black/60 backdrop-blur text-cyan-300 rounded border border-slate-700">
                      SYNC: {cam.timecodeOffsetMs >= 0 ? `+${cam.timecodeOffsetMs}` : cam.timecodeOffsetMs}ms
                    </span>
                  </div>

                  {/* Bottom Telemetry & Audio Meter */}
                  <div className="relative p-3">
                    <div className="text-xs font-bold text-white truncate drop-shadow">
                      {cam.name}
                    </div>

                    {/* Active Speaker Neural HUD */}
                    <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
                      <span className="text-slate-300">
                        Speaker Prob: {(cam.activeSpeakerScore * 100).toFixed(0)}%
                      </span>
                      <span className="text-slate-400">Hotkey: [{idx + 1}]</span>
                    </div>

                    {/* Audio Bar */}
                    <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-1.5 border border-slate-700">
                      <div
                        className={`h-full transition-all duration-75 ${
                          cam.audioRmsEnergy > 0.75
                            ? "bg-red-500"
                            : cam.audioRmsEnergy > 0.4
                            ? "bg-emerald-400"
                            : "bg-cyan-400"
                        }`}
                        style={{ width: `${Math.round(cam.audioRmsEnergy * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Big Program Monitor & Live Cut EDL History */}
        <div className="w-1/2 p-5 flex flex-col gap-4 bg-[#07090e]">
          {/* Main On-Air Monitor */}
          <div className="relative flex-1 bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
            <img
              src={currentProgram.thumbnailUrl}
              alt={currentProgram.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Overlaid Tally Overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 bg-red-600 text-white font-mono font-bold text-xs rounded tracking-wider flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                ON-AIR: {currentProgram.name}
              </span>
              <span className="px-2.5 py-1 bg-black/70 backdrop-blur text-purple-300 border border-purple-800 text-xs font-mono rounded">
                TC: 00:01:{(currentTimeMs / 1000).toFixed(1)}
              </span>
            </div>

            {/* Simulated Live Playhead Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1.5 bg-black/80 backdrop-blur border border-slate-700 text-white text-xs rounded-lg flex items-center gap-1.5 hover:bg-slate-800 transition"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? "Pause Ingest" : "Resume Ingest"}</span>
              </button>

              <div className="text-xs font-mono text-slate-300 bg-black/80 backdrop-blur px-3 py-1 rounded border border-slate-800">
                Total Cuts Made: <span className="text-emerald-400 font-bold">{cuts.length}</span>
              </div>
            </div>
          </div>

          {/* Bottom Cut History EDL Stream */}
          <div className="h-44 bg-[#0d1017] rounded-xl border border-slate-800 p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-bold uppercase tracking-wider text-slate-300">
                Live Edit Decision List (EDL Stream)
              </span>
              <span className="text-[10px] font-mono text-purple-400">
                Autonomous Hysteresis: 900ms Lock
              </span>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-1 py-1.5 font-mono text-[11px]">
              {cuts.length === 0 ? (
                <div className="text-slate-500 text-center py-4 text-xs">
                  Awaiting speaker activation cuts... Press [1-4] or allow Auto-Director.
                </div>
              ) : (
                cuts.map((cut, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-2 py-1 rounded bg-[#131722] border border-slate-800/80"
                  >
                    <span className="text-cyan-300">
                      00:01:{(cut.timestampMs / 1000).toFixed(1)}
                    </span>
                    <span className="text-white font-semibold">{cut.selectedAngleName}</span>
                    <span className="text-purple-300 text-[10px]">
                      {cut.triggerReason === "manual_operator" ? "MANUAL CUT" : "ACTIVE SPEAKER"}
                    </span>
                    <span className="text-emerald-400">{(cut.confidence * 100).toFixed(0)}% CONF</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
