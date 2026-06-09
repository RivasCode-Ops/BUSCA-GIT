import { Octokit } from '@octokit/rest'
import { getClient } from './client'

export interface CommitActivity {
  totalCommits: number
  lastMonth: number
  weekly: number[]
}

export async function getCommitActivity(
  owner: string,
  repo: string
): Promise<CommitActivity> {
  const client = getClient()
  const { data } = await client.repos.getCommitActivityStats({ owner, repo })
  const weekly = data?.map(w => w.total) || []
  const totalCommits = weekly.reduce((a, b) => a + b, 0)
  const lastMonth = weekly.slice(-4).reduce((a, b) => a + b, 0)

  return { totalCommits, lastMonth, weekly }
}
