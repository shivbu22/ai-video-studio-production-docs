import React from 'react';
import { Composition } from 'remotion';
import { MainTimeline } from './compositions/MainTimeline';
import { BarChart } from './templates/BarChart';
import { StatCounter } from './templates/StatCounter';
import { QuoteCard } from './templates/QuoteCard';
import { Comparison } from './templates/Comparison';
import { LineChart } from './templates/LineChart';
import { TierList } from './templates/TierList';
import { AnimatedCaptions } from './components/AnimatedCaptions';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MainTimeline"
        component={MainTimeline as React.ComponentType<any>}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          timeline: {
            id: 'tml_root',
            project_id: 'proj_root',
            version: 1,
            schema_version: 1,
            duration_ms: 10000,
            fps: 30,
            width: 1920,
            height: 1080,
            tracks: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }}
      />
      <Composition
        id="BarChart"
        component={BarChart as React.ComponentType<any>}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Throughput & Efficiency Gains',
          items: [
            { label: 'Legacy Workflow', value: 1, color: '#ef4444' },
            { label: 'Semi-Automated', value: 3.5, color: '#f59e0b' },
            { label: 'AI Autonomous', value: 10, color: '#10b981' }
          ],
          unit: 'x'
        }}
      />
      <Composition
        id="LineChart"
        component={LineChart as React.ComponentType<any>}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Inference Cost Reduction (2024-2026)',
          data: [
            { label: '2024 Q1', value: 100 },
            { label: '2024 Q3', value: 72 },
            { label: '2025 Q1', value: 48 },
            { label: '2025 Q3', value: 35 },
            { label: '2026 Q1', value: 25 }
          ],
          unit: '$'
        }}
      />
      <Composition
        id="StatCounter"
        component={StatCounter as React.ComponentType<any>}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Turnaround Time Reduction',
          value: 80,
          prefix: '-',
          suffix: '%'
        }}
      />
      <Composition
        id="QuoteCard"
        component={QuoteCard as React.ComponentType<any>}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          quote: 'The real bottleneck in video is manual timeline assembly.',
          author: 'AI Video Studio Production Report'
        }}
      />
      <Composition
        id="Comparison"
        component={Comparison as React.ComponentType<any>}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Legacy Approach vs Autonomous Studio',
          sideA: {
            title: 'Legacy Stack',
            points: ['Manual keyframing', '90-min render times', 'Fragmented tools'],
            color: '#ef4444'
          },
          sideB: {
            title: 'Autonomous Studio',
            points: ['Instant text-to-video', 'Sub-2min fast preview', 'Clean-room Route B'],
            color: '#10b981'
          }
        }}
      />
      <Composition
        id="TierList"
        component={TierList as React.ComponentType<any>}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Video Architecture Tier Ranking',
          tiers: [
            { tier: 'S', label: 'God Tier', items: ['Remotion Cloud', 'faster-whisper'], color: '#ef4444' },
            { tier: 'A', label: 'Great', items: ['Direct S3 Presign', 'MCP Agents'], color: '#f97316' },
            { tier: 'B', label: 'Viable', items: ['Local FFmpeg', 'Cloud TTS'], color: '#eab308' },
            { tier: 'C', label: 'Obsolete', items: ['90-min Desktop Local Renders'], color: '#64748b' }
          ]
        }}
      />
      <Composition
        id="AnimatedCaptions"
        component={AnimatedCaptions as React.ComponentType<any>}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          words: [
            { word: 'Traditional', start_ms: 200, end_ms: 600 },
            { word: 'video', start_ms: 650, end_ms: 950 },
            { word: 'production', start_ms: 1000, end_ms: 1450 },
            { word: 'has', start_ms: 1500, end_ms: 1700 },
            { word: 'hit', start_ms: 1750, end_ms: 2000 },
            { word: 'a', start_ms: 2050, end_ms: 2200 },
            { word: 'wall.', start_ms: 2250, end_ms: 2800 }
          ],
          highlightColor: '#38bdf8'
        }}
      />
    </>
  );
};
