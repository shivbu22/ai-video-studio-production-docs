import { z } from 'zod';

export const TrackTypeEnum = z.enum(['video', 'motion_graphic', 'voiceover', 'music', 'captions']);
export type TrackType = z.infer<typeof TrackTypeEnum>;

export const ClipSchema = z.object({
  id: z.string(),
  asset_id: z.string().startsWith('ast_').optional(),
  type: z.enum(['video', 'image', 'graphic', 'audio', 'caption']),
  start_ms: z.number().int().nonnegative(),
  end_ms: z.number().int().positive(),
  trim_start_ms: z.number().int().nonnegative().default(0),
  trim_end_ms: z.number().int().nonnegative().default(0),
  properties: z.record(z.any()).default({})
});

export type Clip = z.infer<typeof ClipSchema>;

export const TrackSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: TrackTypeEnum,
  volume: z.number().min(0).max(1).default(1),
  muted: z.boolean().default(false),
  clips: z.array(ClipSchema).default([])
});

export type Track = z.infer<typeof TrackSchema>;

export const TimelineSchema = z.object({
  id: z.string().startsWith('tml_'),
  project_id: z.string().startsWith('proj_'),
  version: z.number().int().positive().default(1),
  schema_version: z.number().int().default(1),
  duration_ms: z.number().int().nonnegative(),
  fps: z.number().int().default(30),
  width: z.number().int().default(1920),
  height: z.number().int().default(1080),
  tracks: z.array(TrackSchema).default([]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export type Timeline = z.infer<typeof TimelineSchema>;
