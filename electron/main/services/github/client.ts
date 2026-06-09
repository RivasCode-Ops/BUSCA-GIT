import { Octokit } from '@octokit/rest'
import { RepoMetadata } from '@shared/contracts/analyze'
import { getSettings } from '../storage/db'

let octokit: Octokit | null = null
let currentToken = ''

export function parseUrl(url: string): { owner: string; repo: string } {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/)
  if (!match) throw new Error('URL inválida')
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') }
}

export async function initToken(): Promise<void> {
  const token = process.env.GITHUB_TOKEN || (await getSettings()).githubToken
  if (token) {
    currentToken = token
    octokit = new Octokit({ auth: token })
  } else {
    octokit = new Octokit()
    console.warn('SEM TOKEN — apenas 60 req/h')
  }
}

export async function updateToken(token: string): Promise<void> {
  currentToken = token
  octokit = token ? new Octokit({ auth: token }) : new Octokit()
}

export function getClient(): Octokit {
  if (!octokit) {
    octokit = new Octokit()
  }
  return octokit
}

export function getTokenPreview(): string {
  if (!currentToken) return ''
  return currentToken.slice(0, 8) + '...' + currentToken.slice(-4)
}

export async function getRepoMetadata(url: string): Promise<RepoMetadata> {
  const { owner, repo } = parseUrl(url)
  const client = getClient()

  const { data: repoData } = await client.repos.get({ owner, repo })
  const { data: languages } = await client.repos.listLanguages({ owner, repo })
  const { data: commits } = await client.repos.listCommits({
    owner,
    repo,
    per_page: 5
  })

  return {
    name: repoData.name,
    fullName: repoData.full_name,
    description: repoData.description || '',
    url: repoData.html_url,
    defaultBranch: repoData.default_branch,
    language: repoData.language || 'N/A',
    languages,
    topics: repoData.topics || [],
    stars: repoData.stargazers_count,
    forks: repoData.forks_count,
    openIssues: repoData.open_issues_count,
    createdAt: repoData.created_at,
    updatedAt: repoData.updated_at,
    pushedAt: repoData.pushed_at,
    license: repoData.license?.spdx_id || null,
    lastCommits: commits.map(c => ({
      message: c.commit.message.split('\n')[0],
      date: c.commit.committer?.date || '',
      author: c.commit.author?.name || ''
    }))
  }
}
