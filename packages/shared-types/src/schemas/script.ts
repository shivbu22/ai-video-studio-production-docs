import { z } from 'zod';

export const SceneSchema = z.object({
  id: z.string(),
  order: z.number().int().positive(),
  hook: z.string(),
  narration: z.string().min(1),
  duration_sec: z.number().positive(),
  template: z.enum([
    'BarChart',
    'LineChart',
    'Comparison',
    'TierList',
    'QuoteCard',
    'StatCounter',
    'RawFootage'
  ]),
  visual_intent: z.string().optional().default(''),
  props: z.record(z.any()).default({})
});

export type Scene = z.infer<typeof SceneSchema>;

export const ScriptSchema = z.object({
  id: z.string(),
  project_id: z.string().startsWith('proj_'),
  version: z.number().int().positive().default(1),
  scenes: z.array(SceneSchema).min(1),
  created_at: z.string().datetime().optional()
});

export type Script = z.infer<typeof ScriptSchema>;
