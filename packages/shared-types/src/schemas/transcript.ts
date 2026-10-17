import { z } from 'zod';

export const TranscriptWordSchema = z.object({
  word: z.string(),
  start_ms: z.number().int().nonnegative(),
  end_ms: z.number().int().positive(),
  confidence: z.number().min(0).max(1).default(0.9)
});

export type TranscriptWord = z.infer<typeof TranscriptWordSchema>;

export const TranscriptSilenceSchema = z.object({
  start_ms: z.number().int().nonnegative(),
  end_ms: z.number().int().positive(),
  duration_ms: z.number().int().positive()
});

export type TranscriptSilence = z.infer<typeof TranscriptSilenceSchema>;

export const TranscriptCleanupSchema = z.object({
  project_id: z.string(),
  original_duration_ms: z.number().int().nonnegative(),
  clean_duration_ms: z.number().int().nonnegative(),
  silences_cut: z.number().int().nonnegative(),
  words: z.array(TranscriptWordSchema)
});

export type TranscriptCleanup = z.infer<typeof TranscriptCleanupSchema>;
