import { useState } from 'react'

interface Props {
  onAnalyze: (url: string) => void
  loading: boolean
}

export function Home({ onAnalyze, loading }: Props) {
  const [url, setUrl] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (url.trim()) onAnalyze(url.trim())
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="text"
          placeholder="https://github.com/usuario/repositorio"
          value={url}
          onChange={e => setUrl(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn btn-primary" disabled={loading || !url.trim()}>
          {loading ? 'Analisando...' : 'Analisar'}
        </button>
      </div>
      {loading && <div className="spinner" />}
    </form>
  )
}
