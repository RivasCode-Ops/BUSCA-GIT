declare global {
  interface Window {
    buscaGit: {
      analyzeRepo: (url: string) => Promise<unknown>
      getRepoMetadata: (url: string) => Promise<unknown>
      getRepoFiles: (url: string) => Promise<unknown>
      getSettings: () => Promise<unknown>
      updateSettings: (settings: Record<string, unknown>) => Promise<unknown>
    }
  }
}

export async function analyzeRepo(url: string) {
  return window.buscaGit.analyzeRepo(url)
}
