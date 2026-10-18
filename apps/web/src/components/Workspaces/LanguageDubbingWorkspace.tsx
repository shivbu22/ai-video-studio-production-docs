"use client";

import React, { useState, useEffect } from "react";
import { 
  Globe2, 
  Languages, 
  Mic2, 
  Volume2, 
  Play, 
  Pause, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  RefreshCw, 
  FileText, 
  Sliders, 
  Zap, 
  Layers,
  ArrowRight,
  Headphones
} from "lucide-react";

interface DubbedLanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  speakerName: string;
  durationMs: number;
  syllableRatio: number;
  translatedText: string;
  hasAudio: boolean;
}

interface LanguageDubbingWorkspaceProps {
  projectTitle: string;
  currentTimeMs: number;
  onSeek: (ms: number) => void;
  onApplyDubbedTrackToTimeline?: (langCode: string, langName: string) => void;
  onShowToast?: (msg: string) => void;
}

export const LanguageDubbingWorkspace: React.FC<LanguageDubbingWorkspaceProps> = ({
  projectTitle,
  currentTimeMs,
  onSeek,
  onApplyDubbedTrackToTimeline,
  onShowToast,
}) => {
  const [selectedLang, setSelectedLang] = useState<string>("es");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isDubbing, setIsDubbing] = useState<boolean>(false);
  const [enableLipSync, setEnableLipSync] = useState<boolean>(true);
  const [preserveTimbre, setPreserveTimbre] = useState<boolean>(true);
  const [activeViseme, setActiveViseme] = useState<string>("AH");

  const [languages, setLanguages] = useState<DubbedLanguageOption[]>([
    {
      code: "en",
      name: "English (US)",
      nativeName: "English",
      flag: "🇺🇸",
      speakerName: "Alex (Cloned Master)",
      durationMs: 14000,
      syllableRatio: 1.0,
      translatedText: "In October 2019, Google demonstrated quantum supremacy. Their Sycamore processor performed a benchmark in 200 seconds that would take supercomputers ten thousand years.",
      hasAudio: true,
    },
    {
      code: "es",
      name: "Spanish",
      nativeName: "Español Neutro",
      flag: "🇪🇸",
      speakerName: "Alejandro (Neural Clone)",
      durationMs: 14200,
      syllableRatio: 0.98,
      translatedText: "En octubre de 2019, Google demostró la supremacía cuántica. Su procesador Sycamore realizó un cálculo en 200 segundos que a las supercomputadoras les llevaría diez mil años.",
      hasAudio: true,
    },
    {
      code: "ja",
      name: "Japanese",
      nativeName: "日本語",
      flag: "🇯🇵",
      speakerName: "Kenji (Tokyo Pitch)",
      durationMs: 13900,
      syllableRatio: 0.95,
      translatedText: "2019年10月、Googleは量子超越性を実証しました。彼らのSycamoreプロセッサは、スーパーコンピュータで1万年かかるベンチマークをわずか200秒で実行しました。",
      hasAudio: true,
    },
    {
      code: "fr",
      name: "French",
      nativeName: "Français",
      flag: "🇫🇷",
      speakerName: "Antoine (Parisian)",
      durationMs: 14400,
      syllableRatio: 0.97,
      translatedText: "En octobre 2019, Google a démontré la suprématie quantique. Leur processeur Sycamore a réalisé en 200 secondes un calcul qui prendrait dix mille ans aux superordinateurs.",
      hasAudio: true,
    },
    {
      code: "de",
      name: "German",
      nativeName: "Deutsch",
      flag: "🇩🇪",
      speakerName: "Maximilian (Berlin)",
      durationMs: 14100,
      syllableRatio: 0.96,
      translatedText: "Im Oktober 2019 demonstrierte Google die Quantenüberlegenheit. Der Sycamore-Prozessor führte in 200 Sekunden eine Benchmark durch, für die Supercomputer zehntausend Jahre bräuchten.",
      hasAudio: false,
    },
    {
      code: "zh",
      name: "Mandarin",
      nativeName: "中文 (普通话)",
      flag: "🇨🇳",
      speakerName: "Li Wei (Beijing Standard)",
      durationMs: 13800,
      syllableRatio: 0.94,
      translatedText: "2019年10月，谷歌展示了量子霸权。他们的Sycamore处理器在200秒内完成了一项基准测试，而超级计算机需要一万年才能完成。",
      hasAudio: false,
    },
  ]);

  // Simulate Viseme animation when playing
  useEffect(() => {
    if (!isPlaying) return;
    const visemes = ["AH", "EE", "OH", "MM", "TH", "OO", "FF"];
    const interval = setInterval(() => {
      const randomViseme = visemes[Math.floor(Math.random() * visemes.length)];
      setActiveViseme(randomViseme);
    }, 180);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const activeLangData = languages.find((l) => l.code === selectedLang) || languages[0];

  const handleGenerateDubbing = async () => {
    setIsDubbing(true);
    try {
      const res = await fetch("/api/voice/dub", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clipId: "c_a1_1",
          sourceLanguage: "en",
          targetLanguages: ["es", "ja", "fr", "de", "zh"],
          enableLipSync,
          preserveEmotion: preserveTimbre,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLanguages((prev) =>
          prev.map((l) => ({ ...l, hasAudio: true }))
        );
        if (onShowToast) {
          onShowToast("Neural AI Dubbing Completed for 5 Languages! Viseme Lip-Sync Baked.");
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDubbing(false);
    }
  };

  const handleApplyToTimeline = () => {
    if (onApplyDubbedTrackToTimeline) {
      onApplyDubbedTrackToTimeline(activeLangData.code, activeLangData.name);
    }
    if (onShowToast) {
      onShowToast(`Replaced Track A1 with ${activeLangData.flag} ${activeLangData.name} Audio!`);
    }
  };

  const handleDownloadSubtitles = () => {
    if (onShowToast) {
      onShowToast(`Exported ${activeLangData.code.toUpperCase()} Subtitle Pack (.SRT + .VTT)`);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0c0d11] text-slate-200 select-none font-sans">
      {/* Left: Script Translation & Syllable Matching Column */}
      <div className="w-96 bg-[#101117] border-r border-[#1e2029] flex flex-col shrink-0">
        <div className="p-3 border-b border-[#1e2029] bg-[#14151e] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#3B63FF] flex items-center justify-center text-white shadow-sm">
              <Languages className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white tracking-wide">Multi-Language Dubbing</h2>
              <p className="text-[10px] text-slate-400 font-mono">Neural Voice & Lip-Sync</p>
            </div>
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Wav2Lip HD
          </span>
        </div>

        {/* Language Tabs Strip */}
        <div className="p-2 border-b border-[#1e2029] bg-[#0e0f14] flex gap-1 overflow-x-auto">
          {languages.map((lang) => (
            <button
              key={lang.code}
              id={`tab-dub-${lang.code}`}
              onClick={() => setSelectedLang(lang.code)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                selectedLang === lang.code
                  ? "bg-[#3B63FF] text-white shadow-sm"
                  : "bg-[#161720] text-slate-300 hover:bg-[#1f202c]"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.code.toUpperCase()}</span>
              {lang.hasAudio && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          ))}
        </div>

        {/* Bilingual Script View */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Source English */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1 text-slate-300">
                <span>🇺🇸</span>
                <span>ORIGINAL SCRIPT (EN)</span>
              </span>
              <span className="text-emerald-400">14.0s · 42 syllables</span>
            </div>
            <div className="p-3 rounded bg-[#161720] border border-[#232532] text-slate-300 leading-relaxed font-sans text-xs">
              {languages[0].translatedText}
            </div>
          </div>

          {/* Translated Target Script */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1 text-cyan-300 font-bold">
                <span>{activeLangData.flag}</span>
                <span>TARGET SCRIPT ({activeLangData.name.toUpperCase()})</span>
              </span>
              <span className="text-cyan-400">
                {(activeLangData.durationMs / 1000).toFixed(1)}s ({(activeLangData.syllableRatio * 100).toFixed(0)}% fit)
              </span>
            </div>
            <textarea
              value={activeLangData.translatedText}
              onChange={(e) => {
                const val = e.target.value;
                setLanguages((prev) =>
                  prev.map((l) => (l.code === selectedLang ? { ...l, translatedText: val } : l))
                );
              }}
              rows={4}
              className="w-full bg-[#13141c] border border-[#262838] rounded p-2.5 text-white leading-relaxed font-sans text-xs focus:outline-none focus:border-[#3B63FF] resize-none"
            />
          </div>

          {/* Syllable Lock Meter */}
          <div className="p-3 rounded bg-[#13151f] border border-[#202230] space-y-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-300 font-semibold">Syllable Timing Match</span>
              <span className="font-mono text-emerald-400">{(activeLangData.syllableRatio * 100).toFixed(1)}% Optimal</span>
            </div>
            <div className="w-full h-2 bg-[#202230] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                style={{ width: `${Math.min(100, activeLangData.syllableRatio * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400">
              Auto-calibrated phoneme pacing ensures translated audio does not exceed the video cut boundary.
            </p>
          </div>

          {/* Neural Engine Settings */}
          <div className="space-y-2.5 pt-2 border-t border-[#1e2029]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Mic2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Preserve Speaker Timbre</span>
              </span>
              <input
                type="checkbox"
                checked={preserveTimbre}
                onChange={(e) => setPreserveTimbre(e.target.checked)}
                className="accent-[#3B63FF] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Neural Lip-Sync (Wav2Lip)</span>
              </span>
              <input
                type="checkbox"
                checked={enableLipSync}
                onChange={(e) => setEnableLipSync(e.target.checked)}
                className="accent-[#3B63FF] cursor-pointer"
              />
            </div>
          </div>

          {/* Trigger All Dubbing */}
          <button
            id="btn-run-dubbing"
            onClick={handleGenerateDubbing}
            disabled={isDubbing}
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded font-bold text-xs flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {isDubbing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Generate Neural Dubbing (5 Languages)</span>
          </button>
        </div>

        {/* Bottom Apply Actions */}
        <div className="p-3 border-t border-[#1e2029] bg-[#12131b] space-y-2">
          <button
            id="btn-apply-dub-timeline"
            onClick={handleApplyToTimeline}
            className="w-full py-2 bg-[#3B63FF] hover:bg-[#4d73ff] text-white rounded font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Apply {activeLangData.flag} to Timeline (Track A1)</span>
          </button>

          <button
            onClick={handleDownloadSubtitles}
            className="w-full py-1.5 bg-[#1a1c26] hover:bg-[#232634] text-slate-300 hover:text-white rounded font-medium text-[11px] flex items-center justify-center gap-1.5 transition-colors border border-[#2b2e3e]"
          >
            <Download className="w-3 h-3" />
            <span>Export Multi-Lingual Subtitles (.SRT)</span>
          </button>
        </div>
      </div>

      {/* Center Video & Lip-Sync Viseme Auditioning Player */}
      <div className="flex-1 flex flex-col bg-[#08090c] overflow-hidden">
        {/* Top Control Bar */}
        <div className="h-9 px-4 bg-[#101117] border-b border-[#1e2029] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">AUDITIONING: {activeLangData.flag} {activeLangData.name} ({activeLangData.nativeName})</span>
            <span className="text-cyan-400">48kHz · 24-bit PCM Broadcast Ready</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Timbre Match: 98.4%
            </span>
          </div>
        </div>

        {/* Cinema Video Viewport with Viseme Mouth Tracker */}
        <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden bg-[radial-gradient(#151722_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="relative w-full max-w-4xl aspect-video rounded-lg overflow-hidden border border-[#252836] shadow-2xl bg-black select-none">
            {/* Base Speaker Frame Representation */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
              <div className="relative flex flex-col items-center">
                {/* Speaker Avatar Simulation */}
                <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-slate-800 to-indigo-800 border-2 border-slate-700 flex items-center justify-center shadow-2xl relative">
                  <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center">
                    <span className="text-2xl font-bold text-slate-300">
                      {activeLangData.speakerName.split(" ")[0]}
                    </span>
                  </div>

                  {/* Neural Lip-Sync Viseme Overlay Box */}
                  {enableLipSync && (
                    <div className="absolute bottom-4 w-16 h-8 rounded border-2 border-cyan-400/90 bg-cyan-950/60 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                      <span className="text-[9px] font-mono font-bold text-cyan-200">
                        {isPlaying ? activeViseme : "MUTE"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-center">
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {activeLangData.speakerName}
                  </span>
                  <p className="text-[10px] text-slate-500">
                    Voice Sample Cloned · 0.14s Latency
                  </p>
                </div>
              </div>
            </div>

            {/* Neural Viseme HUD Top Right */}
            <div className="absolute top-4 right-4 bg-black/80 border border-cyan-500/40 rounded-lg p-2.5 font-mono text-[10px] space-y-1 backdrop-blur-md">
              <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>WAV2LIP VISEME SYNC</span>
              </div>
              <div className="text-slate-300">Active Phoneme: <span className="text-emerald-400 font-bold">{activeViseme}</span></div>
              <div className="text-slate-400">Jitter: &lt; 1.2ms</div>
              <div className="text-slate-400">Confidence: 99.1%</div>
            </div>

            {/* Subtitle Teleprompter Strip */}
            <div className="absolute bottom-6 left-8 right-8 text-center bg-black/75 border border-white/10 rounded-lg p-2.5 backdrop-blur-sm">
              <p className="text-xs font-medium text-white tracking-wide">
                {activeLangData.translatedText}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Audio Waveform Scrubber Player */}
        <div className="h-16 px-6 bg-[#101117] border-t border-[#1e2029] flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-[#3B63FF] hover:bg-[#4d73ff] flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>

            <div className="font-mono text-cyan-300 text-xs">
              00:0{Math.floor(currentTimeMs / 1000)}:{(currentTimeMs % 1000).toString().padStart(3, "0")} / 00:14:000
            </div>
          </div>

          {/* Simulated Multi-Channel Waveform */}
          <div className="flex-1 max-w-xl mx-8 flex items-center gap-1 h-8">
            {Array.from({ length: 48 }).map((_, i) => {
              const height = isPlaying
                ? Math.max(15, Math.sin(i / 3 + currentTimeMs / 500) * 100)
                : 20 + ((i * 7) % 50);
              return (
                <div
                  key={i}
                  style={{ height: `${height}%` }}
                  className={`w-1 rounded-full transition-all duration-75 ${
                    i < 20 ? "bg-[#3B63FF]" : "bg-slate-700"
                  }`}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
            <Volume2 className="w-4 h-4 text-slate-400" />
            <span>BGM DUCK: -12.0 dB</span>
          </div>
        </div>
      </div>
    </div>
  );
};
