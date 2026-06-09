import { useState, useEffect } from 'react'

interface Props {
  onClose: () => void
}

export function Settings({ onClose }: Props) {
  const [token, setToken] = useState('')
  const [saved, setSaved] = useState(false)
  const [preview, setPreview] = useState('')

  useEffect(() => {
    window.buscaGit.getTokenStatus().then(s => {
      setPreview(s.tokenPreview)
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    await window.buscaGit.updateSettings({ githubToken: token })
    setSaved(true)
    setPreview(token.slice(0, 8) + '...' + token.slice(-4))
    setToken('')
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <button onClick={onClose} className="btn btn-primary" style={{ marginBottom: 16 }}>
        ← Voltar
      </button>

      <div className="card">
        <h2>Token GitHub</h2>
        <p style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 12 }}>
          Crie um token em github.com/settings/tokens (escopo: repo) e cole abaixo.
        </p>

        {preview && (
          <div style={{ fontSize: 13, color: '#86efac', marginBottom: 12 }}>
            ✅ Token configurado: {preview}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="input-group">
            <input
              type="password"
              placeholder={preview ? 'Cole um novo token para substituir' : 'github_pat_...'}
              value={token}
              onChange={e => setToken(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={!token.trim()}>
              Salvar
            </button>
          </div>
        </form>

        {saved && <div style={{ fontSize: 13, color: '#86efac' }}>Token salvo!</div>}
      </div>

      <div className="card">
        <h2>Sobre</h2>
        <div style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.6 }}>
          <p><strong>BUSCA-GIT</strong> v0.1.0</p>
          <p>Raio-X de repositórios GitHub em português claro.</p>
          <p style={{ marginTop: 8 }}>RivasCode-Ops</p>
        </div>
      </div>
    </div>
  )
}
