import { Octokit } from '@octokit/rest'
import { getClient } from './client'
import { parseUrl } from './client'
import { RepoFile } from '@shared/contracts/analyze'

const IMPORTANT_FILES = new Set([
  'README.md', 'package.json', 'requirements.txt', 'Dockerfile',
  'docker-compose.yml', 'composer.json', 'Cargo.toml', 'go.mod',
  'Gemfile', 'Makefile', 'CMakeLists.txt', 'pyproject.toml',
  'tsconfig.json', 'vite.config.ts', 'next.config.js',
  '.env.example', '.env.sample', 'docker-compose.yaml',
  '.github/workflows', '.gitlab-ci.yml', 'Jenkinsfile',
  'LICENSE', 'CONTRIBUTING.md', 'CHANGELOG.md'
])

export async function getRepoFiles(url: string): Promise<RepoFile[]> {
  const { owner, repo } = parseUrl(url)
  const client = getClient()

  const { data } = await client.git.getTree({
    owner,
    repo,
    tree_sha: 'HEAD',
    recursive: '1'
  })

  return data.tree
    .filter(item => item.type === 'blob')
    .map(item => ({
      path: item.path || '',
      sha: item.sha || '',
      size: item.size || 0,
      isImportant: IMPORTANT_FILES.has(item.path || '')
    }))
}
