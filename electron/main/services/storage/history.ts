import { saveHistory, getHistory } from './db'

export interface HistoryEntry {
  id: number
  url: string
  result: string
  createdAt: string
}

export function addToHistory(url: string, result: string): void {
  saveHistory(url, result)
}

export function listHistory(limit = 20): HistoryEntry[] {
  return getHistory(limit).map(h => ({
    id: h.id,
    url: h.url,
    result: h.result,
    createdAt: h.created_at
  }))
}
