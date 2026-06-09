import type { AnalyzeResponse } from '../../shared/contracts/analyze'

interface Props {
  result: AnalyzeResponse
  onBack: () => void
}

export function Report({ result, onBack }: Props) {
  const { metadata, stack, health, purpose, importantFiles } = result

  return (
    <div>
      <button onClick={onBack} className="btn btn-primary" style={{ marginBottom: 16 }}>
        ← Nova análise
      </button>

      <div className="card">
        <h2>{metadata.fullName}</h2>
        <p style={{ color: '#a1a1aa', fontSize: 14, marginBottom: 12 }}>
          {metadata.description || 'Sem descrição'}
        </p>
        <a href={metadata.url} style={{ color: '#6366f1', fontSize: 13 }} target="_blank">
          {metadata.url}
        </a>
      </div>

      <div className="grid-2">
        <div className="stat">
          <div className="label">Linguagem</div>
          <div className="value" style={{ color: '#818cf8' }}>{metadata.language}</div>
        </div>
        <div className="stat">
          <div className="label">Saúde</div>
          <div className="value">
            <span className={`badge badge-${health.label === 'ativo' ? 'ativo' : health.label === 'pouco ativo' ? 'pouco' : 'inativo'}`}>
              {health.label}
            </span>
          </div>
        </div>
        <div className="stat">
          <div className="label">Score</div>
          <div className="value" style={{ color: health.score > 70 ? '#86efac' : health.score > 40 ? '#fcd34d' : '#fca5a5' }}>
            {health.score}/100
          </div>
        </div>
        <div className="stat">
          <div className="label">Último commit</div>
          <div className="value" style={{ fontSize: 14 }}>{health.daysSinceLastPush}d atrás</div>
        </div>
      </div>

      <div className="section">
        <h3>Stack</h3>
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 14 }}>
            <div><span style={{ color: '#71717a' }}>Framework:</span> {stack.framework || '—'}</div>
            <div><span style={{ color: '#71717a' }}>Database:</span> {stack.database || '—'}</div>
            <div><span style={{ color: '#71717a' }}>Docker:</span> {stack.hasDocker ? 'Sim' : 'Não'}</div>
            <div><span style={{ color: '#71717a' }}>CI/CD:</span> {stack.hasCI ? 'Sim' : 'Não'}</div>
          </div>
        </div>
      </div>

      <div className="section">
        <h3>Propósito</h3>
        <div className="card">
          <p style={{ fontSize: 14, marginBottom: 12 }}>{purpose.summary}</p>
          <div style={{ fontSize: 13, color: '#71717a', marginBottom: 8 }}>
            Categoria: <span style={{ color: '#e4e4e7' }}>{purpose.category}</span>
          </div>
          <div>
            {purpose.tags.filter(Boolean).map((tag, i) => (
              <span key={i} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <h3>Metadados</h3>
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 14 }}>
            <div><span style={{ color: '#71717a' }}>Stars:</span> {metadata.stars}</div>
            <div><span style={{ color: '#71717a' }}>Forks:</span> {metadata.forks}</div>
            <div><span style={{ color: '#71717a' }}>Issues:</span> {metadata.openIssues}</div>
            <div><span style={{ color: '#71717a' }}>Branch:</span> {metadata.defaultBranch}</div>
            <div><span style={{ color: '#71717a' }}>Licença:</span> {metadata.license || '—'}</div>
            <div><span style={{ color: '#71717a' }}>Criado:</span> {new Date(metadata.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {metadata.lastCommits.length > 0 && (
        <div className="section">
          <h3>Últimos commits</h3>
          <div className="card">
            {metadata.lastCommits.map((c, i) => (
              <div key={i} className="commit-item">
                <div className="msg">{c.message}</div>
                <div className="meta">{c.author} — {new Date(c.date).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {importantFiles.length > 0 && (
        <div className="section">
          <h3>Arquivos importantes ({importantFiles.length})</h3>
          <div className="card file-list">
            {importantFiles.map(f => (
              <div key={f.path} className="file-item">
                <span className="file-imp">{f.path}</span>
                <span style={{ color: '#71717a' }}>{f.size} bytes</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
