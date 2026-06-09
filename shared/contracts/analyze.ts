export interface AnalyzeRequest {
  url: string
}

export interface RepoMetadata {
  name: string
  fullName: string
  description: string
  url: string
  defaultBranch: string
  language: string
  languages: Record<string, number>
  topics: string[]
  stars: number
  forks: number
  openIssues: number
  createdAt: string
  updatedAt: string
  pushedAt: string
  license: string | null
  lastCommits: Array<{ message: string; date: string; author: string }>
}

export interface RepoFile {
  path: string
  sha: string
  size: number
  isImportant: boolean
}

export interface StackInfo {
  language: string
  framework: string | null
  database: string | null
  hasDocker: boolean
  hasCI: boolean
}

export interface HealthInfo {
  score: number
  label: 'ativo' | 'pouco ativo' | 'inativo'
  lastCommit: string
  daysSinceLastPush: number
}

export interface PurposeInfo {
  summary: string
  category: string
  estimatedEffort: 'baixo' | 'médio' | 'alto'
  tags: string[]
}

export interface AnalyzeResponse {
  metadata: RepoMetadata
  stack: StackInfo
  purpose: PurposeInfo
  health: HealthInfo
  importantFiles: RepoFile[]
}
