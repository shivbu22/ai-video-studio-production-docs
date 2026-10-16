import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface StatCounterProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
}

export const StatCounter: React.FC<StatCounterProps> = ({ title, value, prefix = '', suffix = '' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ frame, fps, config: { damping: 16, stiffness: 80 } });
  const currentValue = Math.round(interpolate(progress, [0, 1], [0, value]));

  return (
    <AbsoluteFill style={{ backgroundColor: '#090d16', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <p style={{ fontSize: '36px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '24px' }}>
        {title}
      </p>
      <h1 style={{ fontSize: '130px', fontWeight: 900, color: '#38bdf8', margin: 0, textShadow: '0 0 50px rgba(56, 189, 248, 0.4)' }}>
        {prefix}{currentValue.toLocaleString()}{suffix}
      </h1>
    </AbsoluteFill>
  );
};
