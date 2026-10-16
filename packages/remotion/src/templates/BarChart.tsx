import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BarChartItem {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartProps {
  title: string;
  items: BarChartItem[];
  maxValue?: number;
  unit?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ title, items, maxValue, unit = '' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const max = maxValue || Math.max(...items.map((i) => i.value), 100);

  return (
    <AbsoluteFill style={{ backgroundColor: '#090d16', padding: '80px', color: '#ffffff', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '48px', fontWeight: 800, marginBottom: '60px', color: '#38bdf8' }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', maxWidth: '1400px' }}>
        {items.map((item, idx) => {
          const progress = spring({
            frame: frame - idx * 8,
            fps,
            config: { damping: 14, stiffness: 100 }
          });

          const currentVal = Math.round(interpolate(progress, [0, 1], [0, item.value], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
          const widthPct = (item.value / max) * 100 * progress;

          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '24px', fontWeight: 600 }}>
                <span>{item.label}</span>
                <span style={{ color: item.color || '#38bdf8' }}>{currentVal}{unit}</span>
              </div>
              <div style={{ width: '100%', height: '36px', backgroundColor: '#1e293b', borderRadius: '18px', overflow: 'hidden' }}>
                <div style={{ width: `${widthPct}%`, height: '100%', backgroundColor: item.color || '#38bdf8', borderRadius: '18px' }} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
