"use client";

import React, { useState } from "react";
import { 
  Users, 
  Copy, 
  Check, 
  X, 
  Shield, 
  Globe, 
  UserPlus, 
  Crown,
  CheckCircle2,
  Lock
} from "lucide-react";

interface CollaboratorEntry {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Editor" | "Reviewer" | "Viewer";
  color: string;
  avatarText: string;
  status: "Online" | "Idle";
}

interface CollaborationInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
}

export const CollaborationInviteModal: React.FC<CollaborationInviteModalProps> = ({
  isOpen,
  onClose,
  projectTitle,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<"Editor" | "Reviewer" | "Viewer">("Editor");
  const [inviteSent, setInviteSent] = useState(false);

  const roomUrl = `http://localhost:3000/?room=omnicut-${projectTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

  const collaborators: CollaboratorEntry[] = [
    { id: "1", name: "You", email: "creator@omnicut.studio", role: "Owner", color: "bg-blue-600", avatarText: "ME", status: "Online" },
    { id: "2", name: "Sarah Lin", email: "sarah.vfx@studio.com", role: "Editor", color: "bg-emerald-600", avatarText: "SL", status: "Online" },
    { id: "3", name: "Marcus Vance", email: "marcus.audio@studio.com", role: "Reviewer", color: "bg-purple-600", avatarText: "MV", status: "Online" },
    { id: "4", name: "Alex Chen", email: "alex.dir@agency.com", role: "Viewer", color: "bg-amber-600", avatarText: "AC", status: "Idle" },
  ];

  if (!isOpen) return null;

  const copyRoomLink = () => {
    navigator.clipboard.writeText(roomUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviteSent(true);
    setTimeout(() => {
      setInviteSent(false);
      setInviteEmail("");
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none font-sans">
      <div className="bg-[#0f1016] border border-[#232633] rounded-xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#14151d] border-b border-[#20222e] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#3B63FF] flex items-center justify-center text-white shadow-sm">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>Multiplayer Timeline Collaboration</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  CRDT Live
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Figma-style real-time peer editing for &apos;{projectTitle}&apos;
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Shareable Link Box */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300">Direct Session Link</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#14151d] border border-[#252838] rounded px-2.5 py-1.5 text-slate-300 font-mono text-[11px] truncate">
                {roomUrl}
              </div>
              <button
                onClick={copyRoomLink}
                className="px-3 py-1.5 bg-[#3B63FF] hover:bg-[#4f73ff] text-white text-xs font-bold rounded flex items-center gap-1.5 transition-colors shadow-sm"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Invite by Email */}
          <form onSubmit={handleSendInvite} className="space-y-1.5 pt-2 border-t border-[#20222e]">
            <label className="text-[11px] font-semibold text-slate-300">Invite Team Members</label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="colleague@studio.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 bg-[#14151d] border border-[#252838] rounded px-2.5 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#3B63FF]"
              />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                className="bg-[#14151d] border border-[#252838] rounded px-2 py-1.5 text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="Editor">Editor</option>
                <option value="Reviewer">Reviewer</option>
                <option value="Viewer">Viewer</option>
              </select>
              <button
                type="submit"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded flex items-center gap-1 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Invite</span>
              </button>
            </div>
            {inviteSent && (
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 pt-0.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>Invite sent to {inviteEmail}!</span>
              </p>
            )}
          </form>

          {/* Active Collaborators Roster */}
          <div className="space-y-2 pt-2 border-t border-[#20222e]">
            <span className="text-[11px] font-semibold text-slate-300">
              Active in this Session ({collaborators.length})
            </span>
            <div className="space-y-1.5">
              {collaborators.map((c) => (
                <div
                  key={c.id}
                  className="bg-[#14151d] p-2 rounded-lg border border-[#20222e] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full ${c.color} flex items-center justify-center font-bold text-[10px] text-white relative`}>
                      {c.avatarText}
                      <span className={`w-2 h-2 rounded-full absolute -bottom-0.5 -right-0.5 border border-[#14151d] ${
                        c.status === "Online" ? "bg-emerald-400" : "bg-amber-400"
                      }`} />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-xs flex items-center gap-1">
                        <span>{c.name}</span>
                        {c.role === "Owner" && <Crown className="w-3 h-3 text-amber-400" />}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">{c.email}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                    {c.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
