import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface QuoteCardProps {
  quote: string;
  author: string;
  role?: string;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote, author, role }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const scale = spring({ frame, fps, config: { damping: 15 } });

  return (
    <AbsoluteFill style={{ backgroundColor: '#090d16', padding: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <div style={{ opacity, transform: `scale(${scale})`, maxWidth: '1200px' }}>
        <span style={{ fontSize: '120px', color: '#38bdf8', lineHeight: 0.5, display: 'block', marginBottom: '20px' }}>“</span>
        <blockquote style={{ fontSize: '48px', fontWeight: 700, lineHeight: 1.3, color: '#f8fafc', margin: '0 0 40px 0' }}>
          {quote}
        </blockquote>
        <div style={{ fontSize: '28px', color: '#38bdf8', fontWeight: 600 }}>{author}</div>
        {role && <div style={{ fontSize: '20px', color: '#94a3b8', marginTop: '6px' }}>{role}</div>}
      </div>
    </AbsoluteFill>
  );
};
