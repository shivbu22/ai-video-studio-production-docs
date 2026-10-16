import { z } from 'zod';

export const StageEnum = z.enum([
  'intake',
  'research',
  'script',
  'voice',
  'cleanup',
  'visual_plan',
  'assets',
  'motion',
  'timeline',
  'render',
  'publish'
]);

export type Stage = z.infer<typeof StageEnum>;

export const ProjectStatusEnum = z.enum([
  'draft',
  'researching',
  'scripting',
  'awaiting_script_approval',
  'voice_processing',
  'visual_planning',
  'awaiting_visual_approval',
  'rendering_preview',
  'awaiting_master_approval',
  'rendering_master',
  'published',
  'failed'
]);

export type ProjectStatus = z.infer<typeof ProjectStatusEnum>;

export const ProjectSchema = z.object({
  id: z.string().startsWith('proj_'),
  user_id: z.string().startsWith('usr_'),
  title: z.string().min(1).max(255),
  status: ProjectStatusEnum.default('draft'),
  schema_version: z.number().int().default(1),
  brief: z.object({
    topic: z.string().min(1),
    target_length_sec: z.number().int().min(30).max(1800).default(180),
    language: z.string().default('en'),
    preset: z.string().default('educational_tech')
  }),
  youtube_opt_in: z.boolean().default(false),
  youtube_opt_in_at: z.string().datetime().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable().optional()
});

export type Project = z.infer<typeof ProjectSchema>;
