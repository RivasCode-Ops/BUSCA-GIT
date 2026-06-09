import { getClient } from './client'

export interface LanguageBreakdown {
  language: string
  bytes: number
  percentage: number
}

export async function getLanguageBreakdown(
  owner: string,
  repo: string
): Promise<LanguageBreakdown[]> {
  const client = getClient()
  const { data } = await client.repos.listLanguages({ owner, repo })
  const total = Object.values(data).reduce((a, b) => a + b, 0)

  return Object.entries(data)
    .map(([language, bytes]) => ({
      language,
      bytes,
      percentage: Math.round((bytes / total) * 100)
    }))
    .sort((a, b) => b.bytes - a.bytes)
}
