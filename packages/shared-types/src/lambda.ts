import { z } from "zod";

export const LambdaRenderJobSchema = z.object({
  jobId: z.string(),
  projectId: z.string(),
  compositionId: z.string().default("MainVideo"),
  resolution: z.enum(["540p", "1080p", "4k"]).default("1080p"),
  fps: z.number().default(60),
  durationInFrames: z.number(),
  concurrencyPerRender: z.number().default(50),
  frameRange: z.tuple([z.number(), z.number()]).optional(),
  inputProps: z.record(z.any()),
  bucketName: z.string().optional(),
  region: z.string().default("us-east-1"),
  status: z.enum(["queued", "rendering", "stitching", "completed", "failed"]).default("queued"),
  progress: z.number().min(0).max(100).default(0),
  outputUrl: z.string().nullable().default(null),
  error: z.string().nullable().default(null),
  renderTimeMs: z.number().optional(),
  createdAt: z.string(),
  completedAt: z.string().nullable().default(null),
});

export type LambdaRenderJob = z.infer<typeof LambdaRenderJobSchema>;

export interface LambdaChunkProgress {
  chunkIndex: number;
  totalChunks: number;
  framesRendered: number;
  totalFrames: number;
  progressPercent: number;
}