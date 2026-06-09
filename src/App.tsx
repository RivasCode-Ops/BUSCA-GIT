import { useState } from 'react'
import { Home } from './pages/Home'
import { Report } from './pages/Report'
import type { AnalyzeResponse } from '../shared/contracts/analyze'
import './index.css'

export default function App() {
  const [view, setView] = useState<'home' | 'report'>('home')
  const [result, setResult] = useState<AnalyzeResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    setView('home')
    setResult(null)
    setError('')
  }

  return (
    <div className="container">
      <div className="header">
        <h1>BUSCA-GIT</h1>
        <p>Cole a URL de um repositório GitHub para analisar</p>
      </div>

      {error && <div className="error">{error}</div>}

      {view === 'home' && (
        <Home onAnalyze={handleAnalyze} loading={loading} />
      )}

      {view === 'report' && result && (
        <Report result={result} onBack={handleBack} />
      )}
    </div>
  )
}
