import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OmniCut",
  description: "OmniCut — Professional AI-powered non-linear video editor.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-studio-950 text-slate-100 antialiased overflow-hidden select-none font-sans">
        {children}
      </body>
    </html>
  );
}