"use client";

import React, { useState } from "react";
import { 
  MessageSquare, 
  X, 
  Send, 
  CheckCircle2, 
  Clock, 
  CornerDownRight, 
  Filter,
  Check,
  Pin
} from "lucide-react";

export interface ReviewComment {
  id: string;
  author: string;
  authorRole: string;
  avatarColor: string;
  timestampMs: number;
  text: string;
  createdAt: string;
  resolved: boolean;
  replies?: Array<{ author: string; text: string; createdAt: string }>;
}

interface ReviewCommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTimeMs: number;
  onSeek: (ms: number) => void;
  onShowToast?: (msg: string) => void;
}

export const ReviewCommentsDrawer: React.FC<ReviewCommentsDrawerProps> = ({
  isOpen,
  onClose,
  currentTimeMs,
  onSeek,
  onShowToast,
}) => {
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");
  const [newCommentText, setNewCommentText] = useState("");

  const [comments, setComments] = useState<ReviewComment[]>([
    {
      id: "c_1",
      author: "Sarah Lin",
      authorRole: "Lead VFX",
      avatarColor: "bg-emerald-600",
      timestampMs: 1200,
      text: "Bloom on the cryostat chandelier looks great, let's bump the glow radius +15%.",
      createdAt: "10m ago",
      resolved: false,
      replies: [
        { author: "You", text: "Added bloom LUT layer on track V2.", createdAt: "5m ago" }
      ]
    },
    {
      id: "c_2",
      author: "Marcus Vance",
      authorRole: "Sound Engineer",
      avatarColor: "bg-purple-600",
      timestampMs: 4500,
      text: "Check -14 LUFS ducking under voiceover speech peak here.",
      createdAt: "25m ago",
      resolved: true,
      replies: []
    },
    {
      id: "c_3",
      author: "Alex Chen",
      authorRole: "Executive Director",
      avatarColor: "bg-amber-600",
      timestampMs: 8100,
      text: "Add kinetic zoom burst on the 'Summit vs Sycamore' speedup stat.",
      createdAt: "1h ago",
      resolved: false,
      replies: []
    },
  ]);

  if (!isOpen) return null;

  const filteredComments = comments.filter((c) => {
    if (filter === "active") return !c.resolved;
    if (filter === "resolved") return c.resolved;
    return true;
  });

  const toggleResolve = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, resolved: !c.resolved } : c))
    );
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: ReviewComment = {
      id: `c_${Date.now()}`,
      author: "You",
      authorRole: "Editor",
      avatarColor: "bg-blue-600",
      timestampMs: Math.round(currentTimeMs),
      text: newCommentText.trim(),
      createdAt: "Just now",
      resolved: false,
      replies: [],
    };

    setComments((prev) => [newComment, ...prev]);
    setNewCommentText("");
    if (onShowToast) {
      onShowToast(`Pinned review comment at ${(currentTimeMs / 1000).toFixed(1)}s`);
    }
  };

  const formatTimecode = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const frames = Math.floor((ms % 1000) / 33.33);
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}:${frames.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed top-9 right-0 bottom-5 w-84 bg-[#0d0e13] border-l border-[#222530] shadow-2xl flex flex-col z-50 select-none font-sans animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="h-10 px-3.5 bg-[#111217] border-b border-[#1c1e27] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#3B63FF]" />
          <span className="text-xs font-bold text-white tracking-wide">Review Comments</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#252836] text-slate-300">
            {comments.filter((c) => !c.resolved).length} Open
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="px-3 py-1.5 bg-[#0a0b0e] border-b border-[#161820] flex items-center gap-1 text-[11px]">
        {(["all", "active", "resolved"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-2 py-0.5 rounded font-medium capitalize transition-colors ${
              filter === tab ? "bg-[#252836] text-white font-semibold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* New Comment Input pinned to current playhead */}
      <form onSubmit={handlePostComment} className="p-3 border-b border-[#1c1e27] bg-[#121319] space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1 text-cyan-400">
            <Pin className="w-3 h-3" />
            <span>Pin at Playhead</span>
          </span>
          <span className="text-slate-300 font-bold">{formatTimecode(currentTimeMs)}</span>
        </div>
        <div className="flex gap-1.5">
          <input
            type="text"
            placeholder="Add review note..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            className="flex-1 bg-[#090a0e] border border-[#232633] rounded px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#3B63FF]"
          />
          <button
            type="submit"
            disabled={!newCommentText.trim()}
            className="px-2.5 py-1 bg-[#3B63FF] hover:bg-[#4f73ff] disabled:opacity-40 text-white rounded flex items-center justify-center transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredComments.map((item) => (
          <div
            key={item.id}
            onClick={() => onSeek(item.timestampMs)}
            className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
              item.resolved 
                ? "bg-[#0b0c10] border-[#181a22] opacity-60 hover:opacity-90" 
                : "bg-[#14151d] border-[#222432] hover:border-[#3B63FF]/50 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className={`w-5 h-5 rounded-full ${item.avatarColor} flex items-center justify-center text-[9px] font-bold text-white`}>
                  {item.author.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block leading-tight">{item.author}</span>
                  <span className="text-[9px] text-slate-400 block">{item.authorRole}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                  {formatTimecode(item.timestampMs)}
                </span>
                <button
                  onClick={(e) => toggleResolve(item.id, e)}
                  title={item.resolved ? "Mark Active" : "Resolve"}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    item.resolved ? "bg-emerald-600 border-emerald-500 text-white" : "border-slate-600 hover:border-emerald-400 text-transparent"
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed pl-1">
              {item.text}
            </p>

            {/* Replies */}
            {item.replies && item.replies.length > 0 && (
              <div className="mt-2 pl-3 border-l-2 border-[#2b2e3e] space-y-1">
                {item.replies.map((r, idx) => (
                  <div key={idx} className="text-[11px] text-slate-300">
                    <strong className="text-blue-400">{r.author}: </strong>
                    <span>{r.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
