"use client";

import React, { useState } from "react";
import { X, Sparkles, Key, Check, ShieldCheck, Zap, Video, Mic, Image as ImageIcon, ExternalLink } from "lucide-react";

interface ConnectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectionsModal: React.FC<ConnectionsModalProps> = ({ isOpen, onClose }) => {
  const [openAIConnected, setOpenAIConnected] = useState(true);
  const [ytConnected, setYtConnected] = useState(true);
  const [elevenLabsConnected, setElevenLabsConnected] = useState(true);
  const [voiceCloneConnected, setVoiceCloneConnected] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [savedKey, setSavedKey] = useState(false);

  if (!isOpen) return null;

  const countActive = (openAIConnected ? 1 : 0) + (ytConnected ? 1 : 0) + (elevenLabsConnected ? 1 : 0) + (voiceCloneConnected ? 1 : 0);

  const handleSaveKey = () => {
    setSavedKey(true);
    setTimeout(() => setSavedKey(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b0d14] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-[#10131b] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* OmniCut 3-pill logo */}
            <svg viewBox="0 0 64 36" className="w-6 h-3.5">
              <rect x="1.5" y="1.5" width="16" height="33" rx="6.5" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="3"/>
              <rect x="24" y="0" width="16" height="36" rx="7" fill="#3B63FF"/>
              <rect x="25.5" y="1.5" width="13" height="10" rx="5" fill="#fff" opacity="0.3"/>
              <rect x="46.5" y="1.5" width="16" height="33" rx="6.5" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="3"/>
            </svg>
            <h2 className="text-sm font-bold text-white tracking-wide">
              Connections & AI Tools
            </h2>
            <span className="text-[10px] bg-[#3B63FF]/20 text-cyan-300 font-mono font-bold px-2 py-0.5 rounded-full border border-[#3B63FF]/30">
              {countActive} of 4 on
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-xs text-slate-200">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Plug in your AI tools once. OmniCut uses them directly inside the edit—no manual exporting or importing.
          </p>

          {/* Toggle List */}
          <div className="space-y-2.5">
            {/* 1. AI Images */}
            <div className="p-3 bg-[#10131b] rounded-xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">AI Images</h4>
                  <span className="text-[10px] text-slate-400">{openAIConnected ? "OpenAI / Fal.ai · connected" : "Off"}</span>
                </div>
              </div>
              <button
                onClick={() => setOpenAIConnected(!openAIConnected)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  openAIConnected ? "bg-[#3B63FF]" : "bg-slate-800"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    openAIConnected ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* 2. Clip Downloader */}
            <div className="p-3 bg-[#10131b] rounded-xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Clip Downloader</h4>
                  <span className="text-[10px] text-slate-400">{ytConnected ? "YouTube 4K · connected" : "Off"}</span>
                </div>
              </div>
              <button
                onClick={() => setYtConnected(!ytConnected)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  ytConnected ? "bg-[#3B63FF]" : "bg-slate-800"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    ytConnected ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* 3. AI Voice */}
            <div className="p-3 bg-[#10131b] rounded-xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">AI Voice</h4>
                  <span className="text-[10px] text-slate-400">{elevenLabsConnected ? "ElevenLabs · connected" : "Off"}</span>
                </div>
              </div>
              <button
                onClick={() => setElevenLabsConnected(!elevenLabsConnected)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  elevenLabsConnected ? "bg-[#3B63FF]" : "bg-slate-800"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    elevenLabsConnected ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* 4. Voice Clone */}
            <div className="p-3 bg-[#10131b] rounded-xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Your Own Voice</h4>
                  <span className="text-[10px] text-slate-400">{voiceCloneConnected ? "Voice Clone · connected" : "Clone your voice (ElevenLabs)"}</span>
                </div>
              </div>
              <button
                onClick={() => setVoiceCloneConnected(!voiceCloneConnected)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  voiceCloneConnected ? "bg-[#3B63FF]" : "bg-slate-800"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    voiceCloneConnected ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Quick API Key Setup */}
          <div className="bg-[#10131b] p-3.5 rounded-xl border border-white/5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Custom Provider Key</span>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="sk-ant-... or elevenlabs-key"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="flex-1 bg-[#05060a] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#3B63FF]"
              />
              <button
                onClick={handleSaveKey}
                className="px-3 py-1.5 bg-[#3B63FF] hover:bg-[#4f73ff] text-white font-bold text-xs rounded-lg transition-all"
              >
                {savedKey ? "Saved!" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
