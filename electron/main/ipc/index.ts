import { ipcMain } from 'electron'
import { handleAnalyzeRepo } from './analyzeRepo'
import { handleGetRepoMetadata } from './getRepoMetadata'
import { handleGetRepoFiles } from './getRepoFiles'
import { handleSettings } from './settings'

export function registerIpcHandlers(): void {
  ipcMain.handle('busca:analyze-repo', handleAnalyzeRepo)
  ipcMain.handle('busca:get-repo-metadata', handleGetRepoMetadata)
  ipcMain.handle('busca:get-repo-files', handleGetRepoFiles)
  ipcMain.handle('busca:settings', handleSettings)
}
