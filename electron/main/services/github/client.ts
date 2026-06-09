import { Octokit } from '@octokit/rest'
import { RepoMetadata } from '@shared/contracts/analyze'

function parseUrl(url: string): { owner: string; repo: string } {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/)
  if (!match) throw new Error('URL inválida')
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') }
}

let octokit: Octokit | null = null

function getClient(): Octokit {
  if (!octokit) {
    octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    })
  }
  return octokit
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
