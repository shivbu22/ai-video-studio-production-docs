import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Timeline } from '@ai-video-studio/shared-types';

export interface MainTimelineProps {
  timeline: Timeline;
}

export const MainTimeline: React.FC<MainTimelineProps> = ({ timeline }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617', color: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontSize: 48, fontWeight: 'bold' }}>AI Video Studio Timeline</h1>
      <p style={{ fontSize: 24, color: '#94a3b8' }}>Tracks: {timeline.tracks.length} | FPS: {timeline.fps}</p>
    </AbsoluteFill>
  );
};
