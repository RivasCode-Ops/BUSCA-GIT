import { app } from 'electron'
import { join } from 'path'

export function getDataPath(...segments: string[]): string {
  return join(app.getPath('userData'), ...segments)
}

export function getLogPath(): string {
  return getDataPath('logs')
}

export function getDbPath(): string {
  return getDataPath('busca-git.db')
}
