import { z } from 'zod';

export const ClaimSchema = z.object({
  claim: z.string().min(1),
  source_url: z.string().url(),
  source_title: z.string().optional().default('Verified Source'),
  confidence: z.number().min(0).max(1).optional().default(0.95)
});

export type Claim = z.infer<typeof ClaimSchema>;

export const ResearchBriefSchema = z.object({
  topic: z.string().min(1),
  target_length_sec: z.number().int().positive().default(180),
  claims: z.array(ClaimSchema).min(1),
  generated_at: z.string().datetime().optional()
});

export type ResearchBrief = z.infer<typeof ResearchBriefSchema>;
