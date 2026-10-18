"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  SlidersVertical, 
  Volume2, 
  VolumeX, 
  Mic, 
  Music, 
  Sparkles, 
  ShieldCheck, 
  RotateCcw,
  Activity,
  Layers,
  Flame,
  Radio
} from "lucide-react";
import { ProgramMonitor } from "../ProgramMonitor";

interface AudioChannel {
  id: string;
  name: string;
  type: "speech" | "music" | "sfx" | "video";
  volumeDb: number; // -60 to +12 dB
  pan: number; // -50 (L) to +50 (R)
  muted: boolean;
  solo: boolean;
  colorClass: string;
  ducked?: boolean;
  highpass?: boolean;
}

interface AudioMixerWorkspaceProps {
  currentTimeMs: number;
  totalDurationMs: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (timeMs: number) => void;
  aspectRatio: "16:9" | "9:16" | "1:1";
  onAspectRatioChange: (ratio: "16:9" | "9:16" | "1:1") => void;
  onShowToast: (msg: string) => void;
}

export const AudioMixerWorkspace: React.FC<AudioMixerWorkspaceProps> = ({
  currentTimeMs,
  totalDurationMs,
  isPlaying,
  onTogglePlay,
  onSeek,
  aspectRatio,
  onAspectRatioChange,
  onShowToast,
}) => {
  // 5 Track Channel Strips
  const [channels, setChannels] = useState<AudioChannel[]>([
    { id: "c1", name: "C1: SFX & Pops", type: "sfx", volumeDb: -2.5, pan: 0, muted: false, solo: false, colorClass: "text-purple-400 border-purple-500/40" },
    { id: "v2", name: "V2: Motion Audio", type: "sfx", volumeDb: -4.0, pan: -10, muted: false, solo: false, colorClass: "text-indigo-400 border-indigo-500/40" },
    { id: "v1", name: "V1: Master Video", type: "video", volumeDb: -6.0, pan: 0, muted: false, solo: false, colorClass: "text-blue-400 border-blue-500/40" },
    { id: "a1", name: "A1: Voiceover (AI)", type: "speech", volumeDb: 0.0, pan: 0, muted: false, solo: false, colorClass: "text-emerald-400 border-emerald-500/40", highpass: true },
    { id: "a2", name: "A2: Music (Ducked)", type: "music", volumeDb: -12.0, pan: 0, muted: false, solo: false, colorClass: "text-teal-400 border-teal-500/40", ducked: true },
  ]);

  const [masterVolumeDb, setMasterVolumeDb] = useState(0.0);
  const [lufsTarget, setLufsTarget] = useState(-14.0); // EBU R128 / YouTube standard
  const [duckingAmountDb, setDuckingAmountDb] = useState(-12.0);
  const [eqLow, setEqLow] = useState(0.5); // dB
  const [eqMid, setEqMid] = useState(1.8); // dB clarity boost for voice
  const [eqHigh, setEqHigh] = useState(1.0); // dB air

  // Animated meter heights for simulated playback
  const [meterLevels, setMeterLevels] = useState<{ [key: string]: number }>({
    c1: 45,
    v2: 50,
    v1: 60,
    a1: 85,
    a2: 40,
    masterL: 78,
    masterR: 76,
  });

  useEffect(() => {
    if (!isPlaying) {
      setMeterLevels({ c1: 0, v2: 0, v1: 0, a1: 0, a2: 0, masterL: 0, masterR: 0 });
      return;
    }
    const interval = setInterval(() => {
      setMeterLevels({
        c1: Math.floor(30 + Math.random() * 35),
        v2: Math.floor(40 + Math.random() * 25),
        v1: Math.floor(50 + Math.random() * 25),
        a1: Math.floor(75 + Math.random() * 20),
        a2: Math.floor(35 + Math.random() * 15), // ducked under speech
        masterL: Math.floor(74 + Math.random() * 16),
        masterR: Math.floor(72 + Math.random() * 18),
      });
    }, 120);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Canvas FFT Frequency Spectrum & EQ Curve Visualizer
  const eqCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = eqCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const renderSpectrum = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Clear with deep studio background
      ctx.fillStyle = "#050609";
      ctx.fillRect(0, 0, w, h);

      // Grid lines (dB & Hz)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      for (let y = 15; y < h; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      for (let x = 30; x < w; x += 45) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // 32-Band FFT Spectrum Bars (Simulated real-time audio)
      const numBars = 32;
      const barWidth = (w - (numBars * 2)) / numBars;

      for (let i = 0; i < numBars; i++) {
        let barHeight = 0;
        if (isPlaying) {
          // Bell curve centered on voice fundamentals (bands 8-18)
          const distFromCenter = Math.abs(i - 12);
          const baseHeight = Math.max(4, 38 - distFromCenter * 2.2);
          barHeight = baseHeight + (Math.sin(Date.now() / 90 + i) * 6) + (Math.random() * 4);
        } else {
          barHeight = 4;
        }

        const barX = i * (barWidth + 2);
        const barY = h - barHeight;

        // Gradient from cyan to emerald
        const grad = ctx.createLinearGradient(0, h, 0, barY);
        grad.addColorStop(0, "rgba(6, 182, 212, 0.2)");
        grad.addColorStop(1, "rgba(16, 185, 129, 0.85)");

        ctx.fillStyle = grad;
        ctx.fillRect(barX, barY, barWidth, barHeight);
      }

      // Smooth Parametric EQ Response Curve
      const lowY = (h / 2) - (eqLow * 4.5);
      const midY = (h / 2) - (eqMid * 5.5);
      const highY = (h / 2) - (eqHigh * 4.5);

      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.bezierCurveTo(w * 0.15, h / 2, w * 0.2, lowY, w * 0.3, lowY);
      ctx.bezierCurveTo(w * 0.4, lowY, w * 0.45, midY, w * 0.55, midY);
      ctx.bezierCurveTo(w * 0.65, midY, w * 0.75, highY, w * 0.85, highY);
      ctx.bezierCurveTo(w * 0.92, highY, w * 0.96, h / 2, w, h / 2);

      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "rgba(56, 189, 248, 0.7)";
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      // Glowing Node Circles
      const nodes = [
        { x: w * 0.25, y: lowY, color: "#06b6d4", label: "100Hz" },
        { x: w * 0.52, y: midY, color: "#10b981", label: "1.5kHz" },
        { x: w * 0.82, y: highY, color: "#c084fc", label: "10kHz" },
      ];

      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      if (isPlaying) {
        animId = requestAnimationFrame(renderSpectrum);
      }
    };

    renderSpectrum();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, eqLow, eqMid, eqHigh]);

  const toggleMute = (id: string) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, muted: !ch.muted } : ch))
    );
  };

  const toggleSolo = (id: string) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, solo: !ch.solo } : ch))
    );
  };

  const updateVolume = (id: string, val: number) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, volumeDb: val } : ch))
    );
  };

  const resetMixer = () => {
    setChannels((prev) =>
      prev.map((ch) => ({ ...ch, volumeDb: ch.id === "a2" ? -12 : 0, pan: 0, muted: false, solo: false }))
    );
    setMasterVolumeDb(0);
    setEqLow(0);
    setEqMid(1.5);
    setEqHigh(0.8);
    onShowToast("Audio mixer reset to default broadcast gain staging.");
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-studio-950 select-none">
      {/* Left 45%: Program Monitor & Dynamic Waveform View */}
      <div className="w-full md:w-[45%] flex flex-col border-r border-studio-800 overflow-hidden">
        {/* Sub-Header */}
        <div className="h-10 px-4 bg-studio-900 border-b border-studio-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-emerald-500/20 text-emerald-400">
              <SlidersVertical className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-100 tracking-wide">Multi-Track Audio Console</span>
            <span className="text-[10px] text-emerald-400/90 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
              -14 LUFS BROADCAST PASS
            </span>
          </div>

          <button
            onClick={resetMixer}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] bg-studio-800 hover:bg-studio-700 text-slate-300 transition-colors active:scale-95"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Mix</span>
          </button>
        </div>

        {/* Video Canvas Stage */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          <div className="flex-1 relative">
            <ProgramMonitor
              currentTimeMs={currentTimeMs}
              totalDurationMs={totalDurationMs}
              isPlaying={isPlaying}
              onTogglePlay={onTogglePlay}
              onSeek={onSeek}
              aspectRatio={aspectRatio}
              onAspectRatioChange={onAspectRatioChange}
              currentSceneTitle="Audio Mastering: Quantum Benchmark"
              currentTemplateName="BarChart"
            />
          </div>

          {/* Real-time Spectrum Analyzer & Voice EQ Visualizer */}
          <div className="h-44 bg-studio-950 border-t border-studio-800 p-3 flex flex-col">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Activity className="w-3 h-3 text-cyan-400" />
                <span>32-BAND FFT SPECTRUM &amp; PARAMETRIC EQ CURVE</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono">
                  GR: -2.4 dB
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-mono">
                  80Hz HPF ON
                </span>
              </div>
            </div>

            {/* Canvas Spectrum Display */}
            <div className="h-20 w-full bg-black rounded border border-studio-800 overflow-hidden mb-2 relative">
              <canvas
                ref={eqCanvasRef}
                width={360}
                height={78}
                className="w-full h-full block"
              />
            </div>

            <div className="bg-black/60 rounded border border-studio-800/80 p-2 flex items-center justify-around gap-4 text-xs">
              {/* Low Shelf */}
              <div className="flex-1 flex flex-col items-center">
                <span className="text-[9px] text-slate-500 mb-1">LOW 100Hz</span>
                <input
                  type="range"
                  min="-6"
                  max="6"
                  step="0.5"
                  value={eqLow}
                  onChange={(e) => setEqLow(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-studio-800 rounded cursor-pointer"
                />
                <span className="font-mono text-[10px] text-cyan-400 mt-1">{eqLow > 0 ? `+${eqLow}` : eqLow} dB</span>
              </div>

              {/* Mid Presence Boost */}
              <div className="flex-1 flex flex-col items-center">
                <span className="text-[9px] text-emerald-400 font-semibold mb-1">MID CLARITY 1.5kHz</span>
                <input
                  type="range"
                  min="-6"
                  max="6"
                  step="0.5"
                  value={eqMid}
                  onChange={(e) => setEqMid(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-studio-800 rounded cursor-pointer"
                />
                <span className="font-mono text-[10px] text-emerald-400 mt-1">{eqMid > 0 ? `+${eqMid}` : eqMid} dB</span>
              </div>

              {/* High Air */}
              <div className="flex-1 flex flex-col items-center">
                <span className="text-[9px] text-slate-500 mb-1">HIGH AIR 10kHz</span>
                <input
                  type="range"
                  min="-6"
                  max="6"
                  step="0.5"
                  value={eqHigh}
                  onChange={(e) => setEqHigh(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 h-1.5 bg-studio-800 rounded cursor-pointer"
                />
                <span className="font-mono text-[10px] text-purple-400 mt-1">{eqHigh > 0 ? `+${eqHigh}` : eqHigh} dB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right 55%: Hardware-Style Channel Strips & Master Bus */}
      <div className="flex-1 bg-studio-900 flex flex-col h-full overflow-x-auto font-sans text-xs">
        {/* Top Control Bar: Sidechain Auto-Ducking Settings */}
        <div className="h-12 px-4 bg-studio-950 border-b border-studio-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-semibold text-slate-200 text-xs">FFmpeg Sidechain Auto-Ducking:</span>
            <span className="font-mono text-teal-300 bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 rounded text-[10px]">
              -12.0 dB Music Ducking during A1 Speech
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400">Duck Depth:</span>
            <input
              type="range"
              min="-24"
              max="-3"
              step="1"
              value={duckingAmountDb}
              onChange={(e) => setDuckingAmountDb(parseFloat(e.target.value))}
              className="w-24 accent-teal-400 h-1.5 bg-studio-800 rounded cursor-pointer"
            />
            <span className="font-mono text-teal-300 text-[10px] w-12">{duckingAmountDb} dB</span>
          </div>
        </div>

        {/* Mixer Fader Console Rack */}
        <div className="flex-1 p-4 flex gap-3 overflow-x-auto items-stretch">
          {/* Individual Tracks C1, V2, V1, A1, A2 */}
          {channels.map((ch) => {
            const meter = meterLevels[ch.id] || 0;
            return (
              <div
                key={ch.id}
                className="w-28 bg-studio-950 rounded-xl border border-studio-800 p-2.5 flex flex-col justify-between items-center shadow-lg relative flex-shrink-0"
              >
                {/* Track Name & Type */}
                <div className="w-full text-center pb-2 border-b border-studio-800/80">
                  <span className={`font-bold text-[10px] block truncate ${ch.colorClass}`}>
                    {ch.name}
                  </span>
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest">
                    {ch.type}
                  </span>
                </div>

                {/* Solo / Mute Toggles */}
                <div className="flex items-center gap-1.5 my-2 w-full justify-center">
                  <button
                    onClick={() => toggleMute(ch.id)}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition-all active:scale-95 ${
                      ch.muted
                        ? "bg-red-600 text-white shadow-md shadow-red-500/30"
                        : "bg-studio-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    M
                  </button>
                  <button
                    onClick={() => toggleSolo(ch.id)}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition-all active:scale-95 ${
                      ch.solo
                        ? "bg-amber-500 text-black shadow-md shadow-amber-500/30 font-black"
                        : "bg-studio-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    S
                  </button>
                </div>

                {/* Stereo Meter & Fader Channel */}
                <div className="flex-1 w-full flex items-center justify-center gap-3 my-2">
                  {/* Fader Slider */}
                  <div className="relative h-44 flex items-center justify-center">
                    <input
                      type="range"
                      min="-48"
                      max="12"
                      step="0.5"
                      value={ch.volumeDb}
                      onChange={(e) => updateVolume(ch.id, parseFloat(e.target.value))}
                      className="h-40 w-1.5 accent-slate-200 bg-studio-800 rounded cursor-pointer -rotate-90"
                    />
                  </div>

                  {/* Peak dB LED Meter */}
                  <div className="w-3 h-40 bg-black/90 rounded border border-studio-800/80 p-0.5 flex flex-col-reverse overflow-hidden relative">
                    <div
                      className="w-full rounded-sm transition-all duration-75 bg-gradient-to-t from-emerald-500 via-yellow-400 to-red-500"
                      style={{ height: `${ch.muted ? 0 : meter}%` }}
                    />
                    {/* dB Graticule lines */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-1 opacity-30 text-[6px] text-white">
                      <div className="w-full h-[1px] bg-red-400" />
                      <div className="w-full h-[1px] bg-yellow-400" />
                      <div className="w-full h-[1px] bg-emerald-400" />
                    </div>
                  </div>
                </div>

                {/* dB Readout & Pan */}
                <div className="w-full text-center pt-2 border-t border-studio-800/80 space-y-1">
                  <div className="font-mono text-[10px] font-bold text-slate-200 bg-studio-900 py-0.5 rounded border border-studio-800">
                    {ch.volumeDb > 0 ? `+${ch.volumeDb.toFixed(1)}` : ch.volumeDb <= -48 ? "-inf" : `${ch.volumeDb.toFixed(1)}`} dB
                  </div>

                  {/* Special Badges */}
                  {ch.ducked && (
                    <span className="text-[8px] bg-teal-500/20 text-teal-300 px-1 rounded block border border-teal-500/30">
                      DUCKED -12dB
                    </span>
                  )}
                  {ch.highpass && (
                    <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1 rounded block border border-emerald-500/30">
                      80Hz HIGHPASS
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Master Bus Channel Strip */}
          <div className="w-36 bg-studio-950 rounded-xl border-2 border-emerald-500/40 p-3 flex flex-col justify-between items-center shadow-2xl relative flex-shrink-0 bg-gradient-to-b from-studio-950 via-studio-950 to-emerald-950/20">
            {/* Master Header */}
            <div className="w-full text-center pb-2 border-b border-emerald-500/30">
              <span className="font-black text-xs text-emerald-400 tracking-wider block">
                MASTER BUS
              </span>
              <span className="text-[8px] text-slate-400 font-mono">
                BROADCAST OUTPUT
              </span>
            </div>

            {/* Target Loudness Indicator */}
            <div className="my-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-1.5 w-full text-center">
              <span className="text-[9px] text-slate-400 block">Loudness Target</span>
              <span className="font-mono text-emerald-300 font-bold text-xs">{lufsTarget} LUFS</span>
            </div>

            {/* Dual Meter & Master Fader */}
            <div className="flex-1 w-full flex items-center justify-around gap-2 my-2">
              {/* Left Meter */}
              <div className="w-2.5 h-40 bg-black/90 rounded border border-studio-800 p-0.5 flex flex-col-reverse overflow-hidden">
                <div
                  className="w-full rounded-sm transition-all duration-75 bg-gradient-to-t from-emerald-500 via-amber-400 to-red-500"
                  style={{ height: `${meterLevels.masterL}%` }}
                />
              </div>

              {/* Master Fader */}
              <div className="relative h-44 flex items-center justify-center">
                <input
                  type="range"
                  min="-48"
                  max="6"
                  step="0.5"
                  value={masterVolumeDb}
                  onChange={(e) => setMasterVolumeDb(parseFloat(e.target.value))}
                  className="h-40 w-2 accent-emerald-400 bg-studio-800 rounded cursor-pointer -rotate-90"
                />
              </div>

              {/* Right Meter */}
              <div className="w-2.5 h-40 bg-black/90 rounded border border-studio-800 p-0.5 flex flex-col-reverse overflow-hidden">
                <div
                  className="w-full rounded-sm transition-all duration-75 bg-gradient-to-t from-emerald-500 via-amber-400 to-red-500"
                  style={{ height: `${meterLevels.masterR}%` }}
                />
              </div>
            </div>

            {/* True Peak Limiter Badge */}
            <div className="w-full text-center pt-2 border-t border-emerald-500/30 space-y-1">
              <div className="font-mono text-xs font-black text-emerald-400 bg-studio-900 py-1 rounded border border-emerald-500/30">
                {masterVolumeDb > 0 ? `+${masterVolumeDb.toFixed(1)}` : `${masterVolumeDb.toFixed(1)}`} dB
              </div>
              <span className="text-[9px] text-emerald-300/90 font-mono flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>TP: -1.0 dBFS Limiter</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
