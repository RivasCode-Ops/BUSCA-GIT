import { useState, useEffect } from 'react'
import { Home } from './pages/Home'
import { Report } from './pages/Report'
import { Settings } from './pages/Settings'
import { Search } from './pages/Search'
import type { AnalyzeResponse } from '../shared/contracts/analyze'
import './index.css'

type Tab = 'analyze' | 'search'

export default function App() {
  const [tab, setTab] = useState<Tab>('analyze')
  const [view, setView] = useState<'main' | 'report' | 'settings'>('main')
  const [result, setResult] = useState<AnalyzeResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    window.buscaGit.getTokenStatus().then(s => setHasToken(!!s.tokenPreview))
  }, [])

  async function handleAnalyze(url: string) {
    setLoading(true)
    setError('')
    try {
      const res = await window.buscaGit.analyzeRepo(url) as AnalyzeResponse
      setResult(res)
      setView('report')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao analisar repositório')
    } finally {
      setLoading(false)
    }
  }

  function handleBack() {
    setView('main')
    setResult(null)
    setError('')
  }

  return (
    <div className="container">
      <div className="header">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <h1>BUSCA-GIT</h1>
          {view !== 'settings' && (
            <button onClick={() => setView('settings')} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: 18, padding: 4 }} title="Configurações">⚙</button>
          )}
        </div>
        {view === 'main' && (
          <div className="tab-bar" style={{ marginTop: 12 }}>
            <button className={`tab ${tab === 'analyze' ? 'active' : ''}`} onClick={() => setTab('analyze')}>Analisar URL</button>
            <button className={`tab ${tab === 'search' ? 'active' : ''}`} onClick={() => setTab('search')}>Buscar Repos</button>
          </div>
        )}
      </div>

      {!hasToken && view === 'main' && (
        <div style={{ fontSize: 12, color: '#fcd34d', background: '#422006', padding: '6px 12px', borderRadius: 6, textAlign: 'center', marginBottom: 12 }}>
          ⚠ Sem token GitHub — limite de 60 req/h — configure em ⚙
        </div>
      )}

      {error && <div className="error">{error}</div>}

      {view === 'main' && tab === 'analyze' && <Home onAnalyze={handleAnalyze} loading={loading} />}
      {view === 'main' && tab === 'search' && <Search onAnalyze={handleAnalyze} loading={loading} />}
      {view === 'report' && result && <Report result={result} onBack={handleBack} />}
      {view === 'settings' && <Settings onClose={() => { setView('main'); window.buscaGit.getTokenStatus().then(s => setHasToken(!!s.tokenPreview)) }} />}
    </div>
  )
}
