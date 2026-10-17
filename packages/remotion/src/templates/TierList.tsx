import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TierRow {
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  label: string;
  items: string[];
  color: string;
}

export interface TierListProps {
  title: string;
  tiers: TierRow[];
}

export const TierList: React.FC<TierListProps> = ({ title, tiers }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const defaultTiers: TierRow[] = tiers?.length
    ? tiers
    : [
        { tier: 'S', label: 'God Tier', items: ['AI Video Studio', 'Remotion Realtime'], color: '#ef4444' },
        { tier: 'A', label: 'Great', items: ['Direct API Pipelines', 'Automated Ducking'], color: '#f97316' },
        { tier: 'B', label: 'Viable', items: ['Manual Clip Splitting', 'Cloud TTS'], color: '#eab308' },
        { tier: 'C', label: 'Obsolete', items: ['90-min Desktop Local Renders', 'Legacy Premiere Scripts'], color: '#64748b' }
      ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#090d16',
        padding: '70px 100px',
        color: '#ffffff',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      <h2 style={{ fontSize: '44px', fontWeight: 800, marginBottom: '40px', color: '#f8fafc' }}>
        {title || 'Category Tier Ranking'}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '1400px' }}>
        {defaultTiers.map((row, idx) => {
          const rowSpring = spring({
            frame: frame - idx * 8,
            fps,
            config: { damping: 14, stiffness: 100 }
          });

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'stretch',
                backgroundColor: '#111827',
                borderRadius: '16px',
                border: '1px solid #1f2937',
                overflow: 'hidden',
                transform: `translateX(${(1 - rowSpring) * 60}px)`,
                opacity: rowSpring
              }}
            >
              {/* Tier Badge */}
              <div
                style={{
                  width: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: row.color,
                  color: '#ffffff',
                  fontSize: '42px',
                  fontWeight: 900
                }}
              >
                {row.tier}
              </div>

              {/* Items container */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 28px', flexWrap: 'wrap' }}>
                {row.items.map((item, itemIdx) => (
                  <span
                    key={itemIdx}
                    style={{
                      backgroundColor: '#1f2937',
                      color: '#f1f5f9',
                      padding: '10px 20px',
                      borderRadius: '10px',
                      fontSize: '20px',
                      fontWeight: 600,
                      border: '1px solid #374151'
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
