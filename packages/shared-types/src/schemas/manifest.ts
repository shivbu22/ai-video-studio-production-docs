import { z } from 'zod';

export const ManifestItemSchema = z.object({
  storage_key: z.string(),
  checksum: z.string().length(64), // SHA-256
  size_bytes: z.number().int().nonnegative(),
  media_type: z.string()
});

export const RightsItemSchema = z.object({
  asset_key: z.string(),
  source: z.enum(['user_upload', 'stock_pexels', 'stock_pixabay', 'ai_generated', 'youtube_opt_in']),
  licence_type: z.string(),
  attribution_url: z.string().url().optional()
});

export const ManifestSchema = z.object({
  project_id: z.string().startsWith('proj_'),
  stage: z.string(),
  stage_version: z.number().int().positive().default(1),
  inputs: z.array(ManifestItemSchema).default([]),
  outputs: z.array(ManifestItemSchema).default([]),
  rights: z.array(RightsItemSchema).default([]),
  model_telemetry: z.object({
    provider: z.string(),
    model: z.string(),
    compute_device: z.string().optional(),
    inference_time_ms: z.number().int().optional()
  }).optional(),
  status: z.enum(['queued', 'running', 'needs_review', 'passed', 'failed']),
  error: z.object({
    code: z.string(),
    message: z.string()
  }).nullable().default(null)
});

export type Manifest = z.infer<typeof ManifestSchema>;
