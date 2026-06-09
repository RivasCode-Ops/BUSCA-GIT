import { z } from 'zod'

export const AnalyzeRequestSchema = z.object({
  url: z.string().url().refine(
    u => u.includes('github.com'),
    'URL deve ser do GitHub'
  )
})

export const AnalyzeResponseSchema = z.object({
  metadata: z.object({
    name: z.string(),
    fullName: z.string(),
    description: z.string(),
    url: z.string(),
    language: z.string()
  }),
  stack: z.object({
    language: z.string(),
    framework: z.string().nullable(),
    database: z.string().nullable(),
    hasDocker: z.boolean(),
    hasCI: z.boolean()
  }),
  health: z.object({
    score: z.number(),
    label: z.enum(['ativo', 'pouco ativo', 'inativo'])
  })
})
