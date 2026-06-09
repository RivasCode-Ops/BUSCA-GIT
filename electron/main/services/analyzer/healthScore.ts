import { RepoMetadata } from '@shared/contracts/analyze'

export interface HealthReport {
  score: number
  label: 'ativo' | 'pouco ativo' | 'inativo'
  lastCommit: string
  daysSinceLastPush: number
}

export function analyzeHealth(metadata: RepoMetadata): HealthReport {
  const lastPush = new Date(metadata.pushedAt)
  const now = new Date()
  const daysSinceLastPush = Math.floor(
    (now.getTime() - lastPush.getTime()) / (1000 * 60 * 60 * 24)
  )

  let score = 100
  if (daysSinceLastPush > 365) score -= 40
  else if (daysSinceLastPush > 180) score -= 25
  else if (daysSinceLastPush > 90) score -= 10

  if (metadata.openIssues > 50) score -= 15
  if (metadata.stars > 100) score += 10
  if (metadata.stars > 1000) score += 10
  if (metadata.forks > 20) score += 10

  const label = daysSinceLastPush > 365 ? 'inativo'
    : daysSinceLastPush > 90 ? 'pouco ativo'
    : 'ativo'

  return {
    score: Math.max(0, Math.min(100, score)),
    label,
    lastCommit: lastPush.toISOString(),
    daysSinceLastPush
  }
}
