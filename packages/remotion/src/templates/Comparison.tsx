import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ComparisonSide {
  title: string;
  points: string[];
  color: string;
}

export interface ComparisonProps {
  title: string;
  sideA: ComparisonSide;
  sideB: ComparisonSide;
}

export const Comparison: React.FC<ComparisonProps> = ({ title, sideA, sideB }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideA = spring({ frame, fps, config: { damping: 14 } });
  const slideB = spring({ frame: frame - 10, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ backgroundColor: '#090d16', padding: '80px', color: '#ffffff', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '48px', fontWeight: 800, textAlign: 'center', marginBottom: '60px', color: '#f8fafc' }}>{title}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', height: '650px' }}>
        <div style={{ transform: `translateX(${(1 - slideA) * -100}px)`, opacity: slideA, backgroundColor: '#0f172a', padding: '40px', borderRadius: '24px', borderLeft: `8px solid ${sideA.color}` }}>
          <h3 style={{ fontSize: '36px', color: sideA.color, marginBottom: '32px' }}>{sideA.title}</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '24px' }}>
            {sideA.points.map((pt, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: sideA.color }}>•</span> {pt}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ transform: `translateX(${(1 - slideB) * 100}px)`, opacity: slideB, backgroundColor: '#0f172a', padding: '40px', borderRadius: '24px', borderLeft: `8px solid ${sideB.color}` }}>
          <h3 style={{ fontSize: '36px', color: sideB.color, marginBottom: '32px' }}>{sideB.title}</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '24px' }}>
            {sideB.points.map((pt, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: sideB.color }}>•</span> {pt}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AbsoluteFill>
  );
};
