import initSqlJs, { Database as SqlJsDatabase } from 'sql.js'
import { join } from 'path'
import { app } from 'electron'
import { readFileSync, writeFileSync, existsSync } from 'fs'

export interface Settings {
  githubToken: string
  llmProvider: string
  llmApiKey: string
  llmModel: string
}

let db: SqlJsDatabase | null = null
let dbPath: string = ''
let SQL: Awaited<ReturnType<typeof initSqlJs>> | null = null

export async function getDb(): Promise<SqlJsDatabase> {
  if (db) return db
  if (!SQL) {
    SQL = await initSqlJs()
  }
  dbPath = join(app.getPath('userData'), 'busca-git.db')
  if (existsSync(dbPath)) {
    const buffer = readFileSync(dbPath)
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
  }
  db.run(`
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
  persist()
  return db
}

function persist(): void {
  if (!db) return
  const data = db.export()
  writeFileSync(dbPath, Buffer.from(data))
}

export async function getSettings(): Promise<Settings> {
  const d = await getDb()
  const result = d.exec('SELECT value FROM settings WHERE key = ?', ['config'])
  if (result.length > 0 && result[0].values.length > 0) {
    return JSON.parse(result[0].values[0][0] as string)
  }
  return { githubToken: '', llmProvider: 'openai', llmApiKey: '', llmModel: 'gpt-4o-mini' }
}

export async function updateSettings(partial: Partial<Settings>): Promise<Settings> {
  const d = await getDb()
  const current = await getSettings()
  const merged = { ...current, ...partial }
  d.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', ['config', JSON.stringify(merged)])
  persist()
  return merged
}

export async function saveHistory(url: string, result: string): Promise<void> {
  const d = await getDb()
  d.run('INSERT INTO history (url, result) VALUES (?, ?)', [url, result])
  persist()
}

export async function getHistory(limit = 20): Promise<Array<{ id: number; url: string; result: string; created_at: string }>> {
  const d = await getDb()
  const result = d.exec(`SELECT id, url, result, created_at FROM history ORDER BY created_at DESC LIMIT ${limit}`)
  if (result.length === 0) return []
  return result[0].values.map(row => ({
    id: row[0] as number,
    url: row[1] as string,
    result: row[2] as string,
    created_at: row[3] as string
  }))
}

export async function getCache<T>(key: string): Promise<T | null> {
  const d = await getDb()
  const result = d.exec('SELECT data, expires_at FROM cache WHERE key = ?', [key])
  if (result.length === 0 || result[0].values.length === 0) return null
  const row = result[0].values[0]
  if (new Date(row[1] as string) < new Date()) {
    d.run('DELETE FROM cache WHERE key = ?', [key])
    return null
  }
  return JSON.parse(row[0] as string) as T
}

export async function setCache(key: string, data: unknown, ttlMinutes = 60): Promise<void> {
  const d = await getDb()
  const expires = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString()
  d.run('INSERT OR REPLACE INTO cache (key, data, expires_at) VALUES (?, ?, ?)', [key, JSON.stringify(data), expires])
  persist()
}
