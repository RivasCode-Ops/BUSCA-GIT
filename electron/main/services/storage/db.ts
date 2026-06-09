import Database from 'better-sqlite3'
import { join } from 'path'
import { app } from 'electron'

export interface Settings {
  githubToken: string
  llmProvider: string
  llmApiKey: string
  llmModel: string
}

let db: Database.Database | null = null

function getDb(): Database.Database {
  if (!db) {
    const dbPath = join(app.getPath('userData'), 'busca-git.db')
    db = new Database(dbPath)
    db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT,
        result TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS cache (
        key TEXT PRIMARY KEY,
        data TEXT,
        expires_at TEXT
      );
    `)
  }
  return db
}

export function getSettings(): Settings {
  const d = getDb()
  const row = d.prepare('SELECT value FROM settings WHERE key = ?').get('config') as { value: string } | undefined
  return row ? JSON.parse(row.value) : { githubToken: '', llmProvider: 'openai', llmApiKey: '', llmModel: 'gpt-4o-mini' }
}

export function updateSettings(partial: Partial<Settings>): Settings {
  const d = getDb()
  const current = getSettings()
  const merged = { ...current, ...partial }
  d.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('config', JSON.stringify(merged))
  return merged
}

export function saveHistory(url: string, result: string): void {
  getDb().prepare('INSERT INTO history (url, result) VALUES (?, ?)').run(url, result)
}

export function getHistory(limit = 20): Array<{ id: number; url: string; result: string; created_at: string }> {
  return getDb().prepare('SELECT * FROM history ORDER BY created_at DESC LIMIT ?').all(limit)
}
