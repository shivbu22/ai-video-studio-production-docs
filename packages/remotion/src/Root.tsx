import React from 'react';
import { Composition } from 'remotion';
import { MainTimeline } from './compositions/MainTimeline';
import { BarChart } from './templates/BarChart';
import { StatCounter } from './templates/StatCounter';
import { QuoteCard } from './templates/QuoteCard';
import { Comparison } from './templates/Comparison';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MainTimeline"
        component={MainTimeline}
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
        component={BarChart}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Top AI Frameworks 2026',
          items: [
            { label: 'Next.js', value: 45, color: '#3b82f6' },
            { label: 'FastAPI', value: 35, color: '#10b981' },
            { label: 'Remotion', value: 20, color: '#f59e0b' }
          ],
          unit: '%'
        }}
      />
      <Composition
        id="StatCounter"
        component={StatCounter}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Total Active Creators',
          value: 50000,
          prefix: '+'
        }}
      />
      <Composition
        id="QuoteCard"
        component={QuoteCard}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          quote: 'The future of video is programmable and prompt-driven.',
          author: 'AI Video Studio Team'
        }}
      />
      <Composition
        id="Comparison"
        component={Comparison}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Desktop Packs vs Web Studio',
          sideA: {
            title: 'Slot Studio (Desktop)',
            points: ['Mac Only (M1+)', '95 Min Local Renders', 'Bring Claude Plan'],
            color: '#ef4444'
          },
          sideB: {
            title: 'AI Video Studio (Web)',
            points: ['Any OS (Windows/Mac)', 'Server Render Queue', 'Fast 540p Previews'],
            color: '#10b981'
          }
        }}
      />
    </>
  );
};
