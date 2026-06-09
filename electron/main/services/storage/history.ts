export interface HistoryEntry {
  id: number
  url: string
  result: string
  createdAt: string
}

import { getHistory, saveHistory } from './db'

export async function addToHistory(url: string, result: string): Promise<void> {
  await saveHistory(url, result)
}

export async function listHistory(limit = 20): Promise<HistoryEntry[]> {
  const rows = await getHistory(limit)
  return rows.map(r => ({ ...r, createdAt: r.created_at }))
}
