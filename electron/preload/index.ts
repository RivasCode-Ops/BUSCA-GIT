import { contextBridge, ipcRenderer } from 'electron'

const api = {
  analyzeRepo: (url: string) =>
    ipcRenderer.invoke('busca:analyze-repo', { url }),
  getRepoMetadata: (url: string) =>
    ipcRenderer.invoke('busca:get-repo-metadata', url),
  getRepoFiles: (url: string) =>
    ipcRenderer.invoke('busca:get-repo-files', url),
  getSettings: () =>
    ipcRenderer.invoke('busca:settings', 'get'),
  updateSettings: (settings: Record<string, unknown>) =>
    ipcRenderer.invoke('busca:settings', 'set', settings),
  getTokenStatus: () =>
    ipcRenderer.invoke('busca:settings', 'token-status')
}

contextBridge.exposeInMainWorld('buscaGit', api)
