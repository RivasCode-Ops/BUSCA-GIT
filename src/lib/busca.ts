export interface BuscaApi {
  analyzeRepo: (url: string) => Promise<unknown>
  getRepoMetadata: (url: string) => Promise<unknown>
  getRepoFiles: (url: string) => Promise<unknown>
  getSettings: () => Promise<unknown>
  updateSettings: (settings: Record<string, unknown>) => Promise<unknown>
  getTokenStatus: () => Promise<{ githubToken: string; tokenPreview: string }>
}

declare global {
  interface Window {
    buscaGit: BuscaApi
  }
}
