import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CaptionWord {
  word: string;
  start_ms: number;
  end_ms: number;
}

export interface AnimatedCaptionsProps {
  words: CaptionWord[];
  highlightColor?: string;
  fontSize?: number;
  bottomOffset?: number;
  wordsPerPhrase?: number;
}

export const AnimatedCaptions: React.FC<AnimatedCaptionsProps> = ({
  words,
  highlightColor = '#38bdf8',
  fontSize = 48,
  bottomOffset = 140,
  wordsPerPhrase = 5
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Current playhead time in milliseconds
  const currentMs = (frame / fps) * 1000;

  if (!words || words.length === 0) return null;

  // Group words into phrases
  const phrases: CaptionWord[][] = [];
  for (let i = 0; i < words.length; i += wordsPerPhrase) {
    phrases.push(words.slice(i, i + wordsPerPhrase));
  }

  // Find the phrase that covers currentMs
  const activePhrase = phrases.find((phrase) => {
    const start = phrase[0].start_ms;
    const end = phrase[phrase.length - 1].end_ms + 400; // grace window
    return currentMs >= start && currentMs <= end;
  });

  if (!activePhrase) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: `${bottomOffset}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
        maxWidth: '85%',
        padding: '16px 32px',
        borderRadius: '24px',
        backgroundColor: 'rgba(9, 13, 22, 0.75)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      {activePhrase.map((w, idx) => {
        const isCurrent = currentMs >= w.start_ms && currentMs <= w.end_ms;
        const isPast = currentMs > w.end_ms;

        // Word pop spring
        const wordFrame = ((currentMs - w.start_ms) / 1000) * fps;
        const wordSpring = spring({
          frame: Math.max(0, wordFrame),
          fps,
          config: { damping: 10, stiffness: 180 }
        });

        const scale = isCurrent ? interpolate(wordSpring, [0, 1], [1, 1.12]) : 1.0;
        const color = isCurrent ? highlightColor : isPast ? '#ffffff' : 'rgba(255, 255, 255, 0.45)';
        const shadow = isCurrent ? `0 0 24px ${highlightColor}88` : 'none';

        return (
          <span
            key={idx}
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: isCurrent ? 900 : 700,
              color,
              textShadow: shadow,
              transform: `scale(${scale})`,
              display: 'inline-block',
              transition: 'color 0.1s ease-out, transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {w.word}
          </span>
        );
      })}
    </div>
  );
};
