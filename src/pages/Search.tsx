import { useState } from 'react'
import type { SearchResult } from '../lib/busca'

const SUGGESTIONS = [
  'licitação+pncp',
  'compras+governamentais',
  'licitacao+brasil',
  'comprasnet',
  'gestao+publica',
  'pregao+eletronico'
]

interface Props {
  onAnalyze: (url: string) => void
  loading: boolean
}

export function Search({ onAnalyze, loading }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[] | null>(null)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    setError('')
    try {
      const res = await window.buscaGit.searchRepos(query.trim())
      setResults(res)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro na busca')
    } finally {
      setSearching(false)
    }
  }

  function handleSuggestion(s: string) {
    setQuery(s)
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div className="input-group">
          <input
            type="text"
            placeholder="licitação+pncp, compras+governamentais..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            disabled={searching}
          />
          <button type="submit" className="btn btn-primary" disabled={searching || !query.trim()}>
            {searching ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </form>

      <div style={{ marginBottom: 16 }}>
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => handleSuggestion(s)} className="tag" style={{ cursor: 'pointer', border: 'none', marginBottom: 4 }}>
            {s}
          </button>
        ))}
      </div>

      {searching && <div className="spinner" />}
      {error && <div className="error">{error}</div>}

      {results !== null && !searching && (
        <>
          <div style={{ fontSize: 13, color: '#71717a', marginBottom: 12 }}>
            {results.length} resultados para "{query}"
          </div>
          {results.length === 0 && (
            <div className="card" style={{ textAlign: 'center', color: '#71717a' }}>
              Nenhum resultado encontrado
            </div>
          )}
          {results.map(r => (
            <div key={r.fullName} className="search-result" onClick={() => onAnalyze(r.url)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3>{r.fullName}</h3>
                  <p>{r.description || 'Sem descrição'}</p>
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: r.score > 70 ? '#86efac' : r.score > 40 ? '#fcd34d' : '#fca5a5', minWidth: 40, textAlign: 'right' }}>
                  {r.score}
                </div>
              </div>
              <div className="meta" style={{ marginTop: 8 }}>
                <span>⭐ {r.stars}</span>
                <span>⑂ {r.forks}</span>
                <span style={{ color: '#818cf8' }}>{r.language}</span>
                <span>🕐 {new Date(r.updatedAt).toLocaleDateString()}</span>
              </div>
              {r.topics.length > 0 && (
                <div style={{ marginTop: 6 }}>
                  {r.topics.slice(0, 5).map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  )
}
