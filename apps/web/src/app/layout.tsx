import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Video Studio — Route B NLE Platform",
  description: "Transform voiceover & topic brief into high-retention 1080p master videos, Shorts, and publish packs with Remotion and MCP agent editing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="h-full bg-studio-950 text-slate-100 antialiased overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
