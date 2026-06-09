import Database from 'better-sqlite3'
import { getDb } from './db'

export function getCache<T>(key: string): T | null {
  const d = getDb()
  const row = d.prepare('SELECT data, expires_at FROM cache WHERE key = ?').get(key) as { data: string; expires_at: string } | undefined
  if (!row) return null
  if (new Date(row.expires_at) < new Date()) {
    d.prepare('DELETE FROM cache WHERE key = ?').run(key)
    return null
  }
  return JSON.parse(row.data)
}

export function setCache(key: string, data: unknown, ttlMinutes = 60): void {
  const d = getDb()
  const expires = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString()
  d.prepare('INSERT OR REPLACE INTO cache (key, data, expires_at) VALUES (?, ?, ?)').run(key, JSON.stringify(data), expires)
}
