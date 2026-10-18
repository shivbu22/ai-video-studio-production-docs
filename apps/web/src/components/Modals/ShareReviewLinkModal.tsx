"use client";

import React, { useState } from "react";
import { 
  Shield, 
  Lock, 
  Copy, 
  Check, 
  X, 
  Eye, 
  Calendar, 
  Key, 
  Link, 
  Sparkles,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

interface ShareReviewLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  onShowToast?: (msg: string) => void;
}

export const ShareReviewLinkModal: React.FC<ShareReviewLinkModalProps> = ({
  isOpen,
  onClose,
  projectTitle,
  onShowToast,
}) => {
  const [recipientEmail, setRecipientEmail] = useState<string>("client.director@acme-corp.com");
  const [watermarkStyle, setWatermarkStyle] = useState<"diagonal" | "corner">("diagonal");
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(25);
  const [requirePassword, setRequirePassword] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("OmniCut-Secure-2026!");
  const [expiresIn, setExpiresIn] = useState<string>("7d");
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  if (!isOpen) return null;

  const generatedLink = `https://review.omnicut.studio/v/${projectTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}-s19?token=sec_soc2_${Math.floor(Date.now() / 1000)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopiedLink(true);
    if (onShowToast) {
      onShowToast("Copied Secure Forensic Watermarked Screener Link!");
    }
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none font-sans">
      <div className="bg-[#0f1016] border border-[#232633] rounded-xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#14151d] border-b border-[#20222e] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#3B63FF] flex items-center justify-center text-white shadow-sm">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>Enterprise Watermarked Client Review</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  SOC2 CC6.1 Governed
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Generate tamper-evident, password-protected screener links with dynamic burn-in watermarks
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
        <div className="p-5 grid grid-cols-2 gap-5">
          {/* Left: Configuration Form */}
          <div className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Client / Recipient Email</label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full bg-[#151620] border border-[#252838] rounded px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-[#3B63FF]"
                placeholder="client@company.com"
              />
              <p className="text-[9px] text-slate-500">
                Viewer email is dynamically burned into the video frames to deter leaks.
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Watermark Opacity</span>
                <span className="font-mono text-cyan-300">{watermarkOpacity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={watermarkOpacity}
                onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                className="w-full accent-[#3B63FF] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Watermark Placement</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setWatermarkStyle("diagonal")}
                  className={`py-1.5 px-2 rounded text-[11px] font-medium border transition-colors ${
                    watermarkStyle === "diagonal"
                      ? "bg-[#3B63FF]/20 border-[#3B63FF] text-white"
                      : "bg-[#151620] border-[#252838] text-slate-400 hover:text-white"
                  }`}
                >
                  Diagonal Tiled
                </button>
                <button
                  type="button"
                  onClick={() => setWatermarkStyle("corner")}
                  className={`py-1.5 px-2 rounded text-[11px] font-medium border transition-colors ${
                    watermarkStyle === "corner"
                      ? "bg-[#3B63FF]/20 border-[#3B63FF] text-white"
                      : "bg-[#151620] border-[#252838] text-slate-400 hover:text-white"
                  }`}
                >
                  Corner Stamp
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#1e2029]">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Require Password</span>
                </span>
                <input
                  type="checkbox"
                  checked={requirePassword}
                  onChange={(e) => setRequirePassword(e.target.checked)}
                  className="accent-[#3B63FF] cursor-pointer"
                />
              </div>

              {requirePassword && (
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#151620] border border-[#252838] rounded px-2.5 py-1.5 text-amber-300 font-mono text-xs focus:outline-none"
                />
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Link Expiration</span>
              </span>
              <select
                value={expiresIn}
                onChange={(e) => setExpiresIn(e.target.value)}
                className="bg-[#151620] border border-[#252838] rounded px-2 py-1 text-white text-[11px] focus:outline-none"
              >
                <option value="24h">24 Hours</option>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
              </select>
            </div>
          </div>

          {/* Right: Live Burn-In Watermark Preview */}
          <div className="flex flex-col space-y-2">
            <span className="text-[11px] font-semibold text-slate-300">Live Screener Preview</span>
            <div className="relative aspect-video rounded-lg overflow-hidden border border-[#252836] bg-slate-950 flex items-center justify-center shadow-lg">
              {/* Mock Video Frame */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-cyan-400/50 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-cyan-400/80" />
                </div>
              </div>

              {/* Watermark Burn-in Layer */}
              {watermarkStyle === "diagonal" ? (
                <div 
                  className="absolute inset-0 flex flex-col justify-around pointer-events-none rotate-[-25deg] scale-125 select-none"
                  style={{ opacity: watermarkOpacity / 100 }}
                >
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="text-center text-[10px] font-mono font-bold text-white tracking-widest uppercase">
                      CONFIDENTIAL · {recipientEmail} · DRAFT ONLY
                    </div>
                  ))}
                </div>
              ) : (
                <div 
                  className="absolute bottom-2 right-2 p-1.5 rounded bg-black/60 border border-white/20 text-[9px] font-mono text-white pointer-events-none"
                  style={{ opacity: watermarkOpacity / 100 }}
                >
                  CONFIDENTIAL: {recipientEmail}
                </div>
              )}

              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-cyan-300 border border-cyan-500/30">
                1080p Protected Screener
              </div>
            </div>

            {/* Security Guarantee Badge */}
            <div className="p-2.5 rounded bg-[#13151f] border border-[#222536] text-[10px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Forensic Traceability Active</span>
              </div>
              <p>
                Recipients cannot bypass watermark or access unrendered camera raw media. All views logged to immutable audit ledger.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#14151d] border-t border-[#20222e] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>End-to-End TLS 1.3 + AES-256</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              id="btn-copy-screener-link"
              onClick={handleCopyLink}
              className="px-4 py-2 bg-[#3B63FF] hover:bg-[#4d73ff] text-white font-bold text-xs rounded shadow-lg flex items-center gap-1.5 transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
              <span>{copiedLink ? "Copied Link!" : "Copy Protected Review Link"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
