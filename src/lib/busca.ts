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

export interface BuscaApi {
  analyzeRepo: (url: string) => Promise<unknown>
  getRepoMetadata: (url: string) => Promise<unknown>
  getRepoFiles: (url: string) => Promise<unknown>
  getSettings: () => Promise<unknown>
  updateSettings: (settings: Record<string, unknown>) => Promise<unknown>
  getTokenStatus: () => Promise<{ githubToken: string; tokenPreview: string }>
  searchRepos: (query: string) => Promise<SearchResult[]>
}

declare global {
  interface Window {
    buscaGit: BuscaApi
  }
}
