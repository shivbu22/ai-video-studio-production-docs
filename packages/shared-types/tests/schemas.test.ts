import { describe, it, expect } from 'vitest';
import { ProjectSchema, TimelineSchema, ManifestSchema } from '../src';

describe('Canonical Shared Schemas', () => {
  it('validates a valid project schema', () => {
    const validProject = {
      id: 'proj_01J9XYZ',
      user_id: 'usr_01J9ABC',
      title: 'How AI Agents Work',
      status: 'draft',
      schema_version: 1,
      brief: {
        topic: 'AI Agents in 2026',
        target_length_sec: 180,
        language: 'en',
        preset: 'educational_tech'
      },
      youtube_opt_in: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const res = ProjectSchema.safeParse(validProject);
    expect(res.success).toBe(true);
  });

  it('validates a valid timeline schema', () => {
    const validTimeline = {
      id: 'tml_01J9XYZ',
      project_id: 'proj_01J9XYZ',
      version: 1,
      schema_version: 1,
      duration_ms: 180000,
      fps: 30,
      width: 1920,
      height: 1080,
      tracks: [
        {
          id: 'track-v1',
          name: 'Video 1',
          type: 'video',
          volume: 1,
          muted: false,
          clips: []
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const res = TimelineSchema.safeParse(validTimeline);
    expect(res.success).toBe(true);
  });
});
