import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/remotion/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          950: "#090d16",
          900: "#0f172a",
          850: "#141e33",
          800: "#1e293b",
          700: "#334155",
          600: "#475569",
        },
        premiere: {
          video: "#0ea5e9", // V1 b-roll
          motion: "#8b5cf6", // V2 motion graphics
          captions: "#f59e0b", // V3 subtitles
          dialogue: "#10b981", // A1 voice
          music: "#ec4899", // A2 music
          needle: "#ef4444", // Playhead scrubber
        }
      },
    },
  },
  plugins: [],
};

export default config;
