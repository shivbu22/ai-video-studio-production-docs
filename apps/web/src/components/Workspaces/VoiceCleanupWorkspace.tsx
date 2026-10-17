"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Mic, 
  Volume2, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Scissors, 
  Sparkles, 
  Sliders, 
  Activity,
  AudioLines,
  UploadCloud,
  Check,
  Radio,
  FileAudio,
  Square
} from "lucide-react";

interface WordToken {
  id: string;
  text: string;
  isCut: boolean;
  cutType?: "breath" | "filler" | "falsestart" | "custom";
  durationMs: number;
  reason?: string;
}

interface VoiceCleanupWorkspaceProps {
  onApplyCleanAudio?: () => void;
  onShowToast?: (msg: string) => void;
}

export const VoiceCleanupWorkspace: React.FC<VoiceCleanupWorkspaceProps> = ({
  onApplyCleanAudio,
  onShowToast,
}) => {
  const [activeTake, setActiveTake] = useState<"raw" | "clean">("clean");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [debreathSensitivity, setDebreathSensitivity] = useState(85);
  const [fillerCutThreshold, setFillerCutThreshold] = useState(90);
  const [highpassEnabled, setHighpassEnabled] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [activeFileName, setActiveFileName] = useState("take_01_raw.wav (48kHz, 24-bit)");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Dynamic Word Tokens with Interactive Click-to-Cut Toggle
  const [tokens, setTokens] = useState<WordToken[]>([
    { id: "w_1", text: "(breath)", isCut: true, cutType: "breath", durationMs: 420, reason: "Inhale breath (-18dB)" },
    { id: "w_2", text: "So", isCut: false, durationMs: 380 },
    { id: "w_3", text: "um,", isCut: true, cutType: "filler", durationMs: 510, reason: "Hesitation filler token" },
    { id: "w_4", text: "the best way—", isCut: true, cutType: "falsestart", durationMs: 1780, reason: "Healed false start sentence" },
    { id: "w_5", text: "the", isCut: false, durationMs: 210 },
    { id: "w_6", text: "best", isCut: false, durationMs: 340 },
    { id: "w_7", text: "way", isCut: false, durationMs: 290 },
    { id: "w_8", text: "to", isCut: false, durationMs: 180 },
    { id: "w_9", text: "grow", isCut: false, durationMs: 420 },
    { id: "w_10", text: "is", isCut: false, durationMs: 190 },
    { id: "w_11", text: "to", isCut: false, durationMs: 180 },
    { id: "w_12", text: "stay", isCut: false, durationMs: 390 },
    { id: "w_13", text: "consistent.", isCut: false, durationMs: 650 },
  ]);

  // Derived metrics
  const rawDurationMs = tokens.reduce((sum, t) => sum + t.durationMs, 0);
  const cutDurationMs = tokens.filter((t) => t.isCut).reduce((sum, t) => sum + t.durationMs, 0);
  const cleanDurationMs = rawDurationMs - cutDurationMs;
  const cutsCount = tokens.filter((t) => t.isCut).length;

  // Toggle word cut status interactively
  const handleToggleWordCut = (id: string) => {
    setTokens((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const newCutState = !t.isCut;
        if (onShowToast) {
          onShowToast(newCutState ? `Excised token '${t.text}' from voice track.` : `Restored token '${t.text}' into speech.`);
        }
        return {
          ...t,
          isCut: newCutState,
          cutType: newCutState ? (t.cutType || "custom") : undefined,
        };
      })
    );
  };

  // Playback timer and synthesized speech / acoustic tone feedback
  useEffect(() => {
    if (!isPlaying) return;
    const durationMs = activeTake === "raw" ? rawDurationMs : cleanDurationMs;
    const interval = setInterval(() => {
      setPlayProgress((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 0;
        }
        return prev + (100 / (durationMs / 40));
      });
    }, 40);
    return () => clearInterval(interval);
  }, [isPlaying, activeTake, rawDurationMs, cleanDurationMs]);

  // Real Speech Synthesis or Web Audio tone upon Play
  const playAuditoryFeedback = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = activeTake === "raw" 
        ? "So... um, the best way... the best way to grow is to stay consistent."
        : tokens.filter((t) => !t.isCut).map((t) => t.text).join(" ");
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTogglePlay = () => {
    if (!isPlaying) {
      if (playProgress >= 100) setPlayProgress(0);
      playAuditoryFeedback();
    } else {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }
    setIsPlaying(!isPlaying);
  };

  // Mic Recording with Live Canvas Frequency Simulation
  useEffect(() => {
    let animId: number;
    let timerId: NodeJS.Timeout;

    if (isRecording) {
      setRecordSeconds(0);
      timerId = setInterval(() => {
        setRecordSeconds((s) => s + 0.1);
      }, 100);

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        const draw = () => {
          if (!ctx) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const bars = 32;
          const barWidth = canvas.width / bars;
          for (let i = 0; i < bars; i++) {
            const h = Math.random() * (canvas.height * 0.8) + 4;
            const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
            grad.addColorStop(0, "#059669");
            grad.addColorStop(1, "#34d399");
            ctx.fillStyle = grad;
            ctx.fillRect(i * barWidth + 2, canvas.height - h, barWidth - 4, h);
          }
          animId = requestAnimationFrame(draw);
        };
        draw();
      }
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (timerId) clearInterval(timerId);
    };
  }, [isRecording]);

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setActiveFileName("live_mic_take_02.wav (Recorded Clean)");
      if (onShowToast) {
        onShowToast("🎙️ Captured live take! faster-whisper aligned & extracted timestamps.");
      }
    } else {
      setIsRecording(true);
      if (onShowToast) {
        onShowToast("Recording live mic audio... speak freely.");
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setActiveFileName(`${file.name} (Uploaded)`);
      if (onShowToast) {
        onShowToast(`Uploaded ${file.name}. Faster-whisper processed word diffs.`);
      }
    }
  };

  const handleApply = () => {
    setHasApplied(true);
    if (onApplyCleanAudio) {
      onApplyCleanAudio();
    }
    if (onShowToast) {
      onShowToast("Clean voiceover applied: 0 words clipped, -14.0 LUFS broadcast normalized.");
    }
    setTimeout(() => setHasApplied(false), 3000);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0b0e14] text-slate-200 select-none">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* LEFT COLUMN: Audio Ingestion & DSP Controls */}
      <div className="w-88 border-r border-slate-800/80 bg-[#101319] flex flex-col shrink-0">
        <div className="p-3 border-b border-slate-800 bg-[#14171d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AudioLines className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white tracking-wide">VOICEOVER SURGICAL DSP</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">
            faster-whisper
          </span>
        </div>

        {/* Input Methods: Mic Recording or File Upload */}
        <div className="p-4 border-b border-slate-800 bg-[#0d0f14] space-y-3">
          <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            <span>Audio Track Intake</span>
            <span className="text-emerald-400 font-mono truncate max-w-[140px]">{activeFileName.split(" ")[0]}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={handleToggleRecord}
              className={`p-2.5 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                isRecording 
                  ? "bg-red-950/40 border-red-500 text-red-300 animate-pulse shadow-lg shadow-red-950/50" 
                  : "bg-[#161a22] border-slate-700/60 text-slate-300 hover:border-slate-600 hover:bg-[#1b202a]"
              }`}
            >
              {isRecording ? <Square className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4 text-slate-400" />}
              <span>{isRecording ? `Stop (${recordSeconds.toFixed(1)}s)` : "Record Mic"}</span>
            </button>

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-lg border border-slate-700/60 bg-[#161a22] text-xs font-semibold text-slate-300 hover:border-slate-600 hover:bg-[#1b202a] flex flex-col items-center gap-1.5 transition-all"
            >
              <UploadCloud className="w-4 h-4 text-slate-400" />
              <span>Upload WAV/MP3</span>
            </button>
          </div>

          {/* Live Recording Canvas */}
          {isRecording && (
            <div className="p-2 bg-[#090b0e] border border-red-500/40 rounded-lg space-y-1">
              <div className="flex justify-between items-center text-[10px] text-red-400 font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  Capturing 48kHz Stream
                </span>
                <span>{recordSeconds.toFixed(2)}s</span>
              </div>
              <canvas ref={canvasRef} width={240} height={40} className="w-full h-10 rounded bg-black/40" />
            </div>
          )}

          <p className="text-[10px] text-slate-400 leading-tight">
            Record once and keep talking. SlotStudio cuts every breath, filler word, and false start without clipping a single phoneme.
          </p>
        </div>

        {/* Surgical Threshold Knobs */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            AI Removal Filters
          </div>

          {/* Breath Reduction */}
          <div className="space-y-1.5 bg-[#14171d] p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-200">Breath Attenuation</span>
              <span className="font-mono text-emerald-400">{debreathSensitivity}% (-28 dB)</span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              value={debreathSensitivity}
              onChange={(e) => setDebreathSensitivity(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <p className="text-[10px] text-slate-500">
              Isolates deep inhalations via spectral formants and silences them.
            </p>
          </div>

          {/* Filler Um/Uh Cuts */}
          <div className="space-y-1.5 bg-[#14171d] p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-200">Filler Word Detection</span>
              <span className="font-mono text-amber-400">{fillerCutThreshold}% Strict</span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              value={fillerCutThreshold}
              onChange={(e) => setFillerCutThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <p className="text-[10px] text-slate-500">
              Excises hesitation tokens (&quot;um&quot;, &quot;uh&quot;, &quot;like&quot;, &quot;you know&quot;) with zero clip pop.
            </p>
          </div>

          {/* Highpass filter toggle */}
          <div className="p-3 bg-[#14171d] rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-200">80Hz Subsonic Highpass</p>
              <p className="text-[10px] text-slate-400">Eliminates desk rumble &amp; plosives</p>
            </div>
            <button
              onClick={() => setHighpassEnabled(!highpassEnabled)}
              className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                highpassEnabled 
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" 
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              {highpassEnabled ? "Enabled" : "Bypassed"}
            </button>
          </div>

          {/* Cloud Voice Option */}
          <div className="p-3 bg-gradient-to-br from-violet-950/20 to-slate-900 rounded-lg border border-violet-500/30">
            <p className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              ElevenLabs AI Voice Synthesizer
            </p>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Synthesize script scenes with high-fidelity clone voices. Words are automatically aligned with faster-whisper.
            </p>
          </div>
        </div>
      </div>

      {/* CENTER STAGE: Dual Waveform Display & Word Transcript */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#0d0f14]">
        {/* Top Playback & Cut Counter Header */}
        <div className="h-12 px-6 border-b border-slate-800 bg-[#12151b] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button 
              onClick={handleTogglePlay}
              className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-950/40 active:scale-95 transition-all"
              title="Listen to audio take"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            {/* Raw vs Clean Toggle */}
            <div className="flex items-center bg-[#161a22] border border-slate-700/80 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => {
                  setActiveTake("raw");
                  setPlayProgress(0);
                }}
                className={`px-3 py-1 rounded font-medium transition-all ${
                  activeTake === "raw"
                    ? "bg-amber-600/90 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Raw Take ({(rawDurationMs / 1000).toFixed(1)}s)
              </button>
              <button
                onClick={() => {
                  setActiveTake("clean");
                  setPlayProgress(0);
                }}
                className={`px-3 py-1 rounded font-medium transition-all ${
                  activeTake === "clean"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Clean Take ({(cleanDurationMs / 1000).toFixed(1)}s)
              </button>
            </div>
          </div>

          {/* Cut Statistics Pill */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#161a22] border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-mono">
              <span className="text-amber-400 font-bold">{cutsCount} cuts</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                -{(cutDurationMs / 1000).toFixed(1)}s trimmed
              </span>
            </div>

            <button 
              onClick={handleApply}
              className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3.5 py-1.5 rounded-lg shadow-lg shadow-emerald-950/40 active:scale-95 transition-all"
            >
              {hasApplied ? <Check className="w-3.5 h-3.5" /> : <Scissors className="w-3.5 h-3.5" />}
              <span>{hasApplied ? "Applied to Timeline!" : "Apply to A1 Track"}</span>
            </button>
          </div>
        </div>

        {/* Main Stage: Waveform Visualizer & Transcript */}
        <div className="flex-1 flex flex-col p-8 items-center justify-center space-y-6 overflow-y-auto">
          {/* SlotStudio Headline Callout */}
          <div className="text-center max-w-xl">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Every breath. Every um. Gone.
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              It cuts every breath, every um and every sentence you started twice, without clipping a single word. Click any word below to restore or cut it manually.
            </p>
          </div>

          {/* Dual Waveform Card */}
          <div className="w-full max-w-2xl bg-[#14171d] rounded-xl border border-slate-800 p-5 space-y-4 shadow-2xl">
            {/* Raw Take Waveform */}
            <div className={`space-y-1 transition-opacity ${activeTake === "raw" ? "opacity-100 ring-1 ring-amber-500/40 rounded-lg p-1" : "opacity-60"}`}>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  Raw Take Waveform
                </span>
                <span className="text-red-400 font-bold">0:0{(rawDurationMs / 1000).toFixed(1)}</span>
              </div>
              <div className="h-14 bg-[#0a0c10] rounded border border-slate-800 p-2 flex items-center justify-between relative overflow-hidden">
                {/* Scanning Playhead Needle */}
                {activeTake === "raw" && (
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-20 shadow-[0_0_8px_rgba(251,191,36,0.8)] pointer-events-none transition-[left] duration-75"
                    style={{ left: `${playProgress}%` }}
                  />
                )}
                {/* Waveform Bars with breath bursts in red */}
                <div className="w-full flex items-center justify-around h-full">
                  <span className="w-1.5 h-10 bg-red-500 rounded-full animate-pulse" title="Inhale Breath (-12dB)"></span>
                  <span className="w-1 h-3 bg-slate-600 rounded-full"></span>
                  <span className="w-1.5 h-6 bg-slate-500 rounded-full"></span>
                  <span className="w-2 h-11 bg-amber-400 rounded-full" title="Hesitation 'um'"></span>
                  <span className="w-1 h-4 bg-slate-600 rounded-full"></span>
                  <span className="w-2 h-9 bg-red-400 rounded-full" title="False start sentence"></span>
                  <span className="w-1.5 h-7 bg-slate-500 rounded-full"></span>
                  <span className="w-2 h-12 bg-slate-400 rounded-full"></span>
                  <span className="w-1.5 h-8 bg-slate-500 rounded-full"></span>
                  <span className="w-2 h-11 bg-slate-400 rounded-full"></span>
                  <span className="w-1.5 h-5 bg-slate-600 rounded-full"></span>
                </div>
                <div className="absolute top-1 left-2 text-[9px] font-mono text-red-400 bg-red-950/40 px-1 rounded border border-red-800/40">
                  Breath &amp; Fillers Tagged
                </div>
              </div>
            </div>

            {/* Clean Take Waveform */}
            <div className={`space-y-1 transition-opacity ${activeTake === "clean" ? "opacity-100 ring-1 ring-emerald-500/40 rounded-lg p-1" : "opacity-60"}`}>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Clean Take (voice_clean.wav)
                </span>
                <span className="text-emerald-400 font-bold">0:0{(cleanDurationMs / 1000).toFixed(1)} (-{(cutDurationMs / 1000).toFixed(1)}s cut)</span>
              </div>
              <div className="h-14 bg-[#0a0c10] rounded border border-emerald-500/30 p-2 flex items-center justify-between relative overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.08)]">
                {/* Scanning Playhead Needle */}
                {activeTake === "clean" && (
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-emerald-400 z-20 shadow-[0_0_8px_rgba(52,211,153,0.8)] pointer-events-none transition-[left] duration-75"
                    style={{ left: `${playProgress}%` }}
                  />
                )}
                {/* Pristine Clean Bars without gaps */}
                <div className="w-full flex items-center justify-around h-full">
                  <span className="w-1.5 h-6 bg-emerald-400 rounded-full"></span>
                  <span className="w-2 h-10 bg-emerald-400 rounded-full"></span>
                  <span className="w-1.5 h-7 bg-emerald-400 rounded-full"></span>
                  <span className="w-2 h-12 bg-emerald-400 rounded-full"></span>
                  <span className="w-1.5 h-9 bg-emerald-400 rounded-full"></span>
                  <span className="w-2 h-11 bg-emerald-400 rounded-full"></span>
                  <span className="w-1.5 h-6 bg-emerald-400 rounded-full"></span>
                </div>
                <div className="absolute top-1 left-2 text-[9px] font-mono text-emerald-300 bg-emerald-950/40 px-1 rounded border border-emerald-800/40">
                  Normalized -14.0 LUFS • 0 Words Clipped
                </div>
              </div>
            </div>

            {/* Interactive Word Strikethrough Transcript */}
            <div className="pt-3 border-t border-slate-800">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase text-slate-400 mb-2">
                <span>Interactive Transcript Diff (Click Word to Toggle Cut)</span>
                <span className="text-emerald-400 font-semibold">{tokens.filter(t => !t.isCut).length} Active Words</span>
              </div>
              <div className="bg-[#0e1117] p-4 rounded-lg border border-slate-800 text-sm leading-loose flex flex-wrap gap-1.5 items-center">
                {tokens.map((tok) => (
                  <button
                    key={tok.id}
                    onClick={() => handleToggleWordCut(tok.id)}
                    className={`transition-all rounded px-2 py-0.5 text-xs font-mono border ${
                      tok.isCut
                        ? tok.cutType === "breath"
                          ? "line-through text-red-400 bg-red-950/40 border-red-800/40 opacity-80 hover:opacity-100"
                          : tok.cutType === "filler"
                          ? "line-through text-amber-400 bg-amber-950/40 border-amber-800/40 opacity-80 hover:opacity-100"
                          : "line-through text-red-400 bg-red-950/40 border-red-800/40 opacity-80 hover:opacity-100"
                        : "text-emerald-300 font-semibold bg-emerald-950/30 border-emerald-500/20 hover:bg-emerald-900/40"
                    }`}
                    title={tok.isCut ? `Cut token (${tok.reason || "Trimmed"}). Click to restore.` : "Active word. Click to excise."}
                  >
                    {tok.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
