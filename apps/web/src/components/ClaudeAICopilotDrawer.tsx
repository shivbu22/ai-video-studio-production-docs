"use client";

import React, { useState } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Scissors, 
  Film, 
  X,
  Maximize2,
  Minimize2,
  ChevronRight
} from "lucide-react";

interface ClaudeAICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction?: (actionText: string) => void;
}

export const ClaudeAICopilotDrawer: React.FC<ClaudeAICopilotDrawerProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  const [messages, setMessages] = useState([
    {
      id: "m1",
      sender: "user",
      text: "Let’s make a video on Nick Walker’s training. 12 minutes, analysis style.",
      time: "10m ago",
    },
    {
      id: "m2",
      sender: "claude",
      text: "Research is done: I went through 61 of his workouts and extracted Schoenfeld 2021 EMG data. Here’s the script draft with the source under every claim. Read it and tell me what to change.",
      card: {
        type: "script",
        title: "Script: The Real Reason Nick Walker Won Mr. Olympia",
        meta: "12 scenes • 14 citations verified",
      },
      time: "8m ago",
    },
    {
      id: "m3",
      sender: "user",
      text: "Looks good. I recorded the voiceover, it’s in the folder.",
      time: "5m ago",
    },
    {
      id: "m4",
      sender: "claude",
      text: "Cleaned it. Every breath, um and restarted sentence is cut, and 0 words are clipped. Voiceover timing is now 12:48.",
      card: {
        type: "audio",
        title: "voice_clean.wav (Normalized -14 LUFS)",
        meta: "3 cuts made • 0 words clipped",
      },
      time: "4m ago",
    },
    {
      id: "m5",
      sender: "claude",
      text: "Found 170 clips on YouTube, cut each one to the seconds the script needs and saved them in 4K. Remotion 3D bar chart and paper lift-off are ready.",
      time: "2m ago",
    },
  ]);

  const [inputVal, setInputVal] = useState("");

  if (!isOpen) return null;

  const handleSend = () => {
    if (!inputVal.trim()) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: inputVal,
      time: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputVal;
    setInputVal("");

    setTimeout(() => {
      let replyText = "I've updated the timeline and Remotion motion parameters. Ready for 4K render.";
      if (currentInput.toLowerCase().includes("thumbnail")) {
        replyText = "Generated 3 high-impact thumbnail candidates in the Publishing Kit with bold 3D typography and predicted +28% CTR.";
      } else if (currentInput.toLowerCase().includes("short") || currentInput.toLowerCase().includes("reel")) {
        replyText = "Auto-reframed the 9:16 vertical Short with dynamic animated karaoke captions.";
      } else if (currentInput.toLowerCase().includes("faster") || currentInput.toLowerCase().includes("intro")) {
        replyText = "Done, shortened the hook scene by 1.8 seconds and swapped the B-roll cut.";
      }

      const claudeReply = {
        id: `cld_${Date.now()}`,
        sender: "claude",
        text: replyText,
        time: "Just now",
      };
      setMessages((prev) => [...prev, claudeReply]);
    }, 700);
  };

  return (
    <div className="fixed bottom-12 right-6 w-96 max-h-[580px] h-[520px] bg-[#101319] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header */}
      <div className="h-11 px-4 border-b border-slate-800 bg-[#14171d] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
          <span className="text-xs font-bold text-white tracking-wide">CLAUDE AI COPILOT</span>
          <span className="text-[10px] bg-violet-500/20 text-violet-300 px-1.5 py-0.2 rounded font-mono border border-violet-500/30">
            SlotStudio Node
          </span>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#0d0f14]">
        {messages.map((m) => {
          const isUser = m.sender === "user";
          return (
            <div 
              key={m.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <span className="text-[9px] font-mono text-slate-500 mb-0.5">
                {isUser ? "You" : "Claude"} • {m.time}
              </span>
              <div 
                className={`p-2.5 rounded-xl text-xs max-w-[88%] leading-relaxed ${
                  isUser 
                    ? "bg-violet-600 text-white rounded-br-xs" 
                    : "bg-[#161a22] text-slate-200 border border-slate-700/70 rounded-bl-xs"
                }`}
              >
                <p>{m.text}</p>
                {m.card && (
                  <div className="mt-2 p-2 bg-black/40 rounded border border-slate-700/60 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-violet-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-white truncate">{m.card.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{m.card.meta}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Chips */}
      <div className="px-3 py-1.5 bg-[#101319] border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[10px] text-slate-300">
        <button 
          onClick={() => {
            setInputVal("Generate 3 thumbnail variations");
          }}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 shrink-0 border border-slate-700"
        >
          Generate thumbnails
        </button>
        <button 
          onClick={() => {
            setInputVal("Render 9:16 vertical Short");
          }}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 shrink-0 border border-slate-700"
        >
          9:16 Short cut
        </button>
        <button 
          onClick={() => {
            setInputVal("Make the intro faster");
          }}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 shrink-0 border border-slate-700"
        >
          Make intro faster
        </button>
      </div>

      {/* Input Composer */}
      <div className="p-2.5 border-t border-slate-800 bg-[#14171d] flex items-center gap-2 shrink-0">
        <input 
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          placeholder="Ask Claude to edit, find clips, or publish..."
          className="flex-1 bg-[#161a22] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-medium"
        />
        <button 
          onClick={handleSend}
          className="p-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white shadow active:scale-95 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
