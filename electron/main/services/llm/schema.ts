import { z } from 'zod'

export const LlmSummarySchema = z.object({
  purpose: z.string(),
  strengths: z.array(z.string()),
  limitations: z.array(z.string()),
  recommendation: z.string()
})

export const AnalyzeResponseSchema = z.object({
  summary: z.string(),
  stack: z.object({
    language: z.string(),
    framework: z.string().nullable(),
    database: z.string().nullable()
  }),
  health: z.object({
    score: z.number().min(0).max(100),
    label: z.enum(['ativo', 'pouco ativo', 'inativo'])
  })
})
