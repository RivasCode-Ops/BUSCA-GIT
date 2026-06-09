import { IpcMainInvokeEvent } from 'electron'
import { getClient } from '../services/github/client'

export interface SearchResult {
  name: string
  fullName: string
  description: string
  url: string
  stars: number
  forks: number
  language: string
  topics: string[]
  updatedAt: string
  score: number
}

export async function handleSearchRepos(
  _event: IpcMainInvokeEvent,
  query: string
): Promise<SearchResult[]> {
  const client = getClient()

  const { data } = await client.rest.search.repos({
    q: query,
    sort: 'stars',
    order: 'desc',
    per_page: 20
  })

  return data.items.map(repo => ({
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || '',
    url: repo.html_url,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language || 'N/A',
    topics: repo.topics || [],
    updatedAt: repo.updated_at,
    score: calcScore(repo)
  }))
}

function calcScore(repo: {
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  updated_at: string
}): number {
  let s = 0
  if (repo.stargazers_count > 10) s += 20
  if (repo.stargazers_count > 50) s += 15
  if (repo.stargazers_count > 200) s += 15
  if (repo.forks_count > 5) s += 10
  if (repo.forks_count > 20) s += 10
  const days = (Date.now() - new Date(repo.updated_at).getTime()) / 86400000
  if (days < 30) s += 20
  else if (days < 90) s += 10
  else if (days < 365) s += 5
  if (repo.open_issues_count < 10) s += 10
  return Math.min(100, s)
}
