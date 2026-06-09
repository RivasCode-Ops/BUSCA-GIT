import { RepoFile } from '@shared/contracts/analyze'

interface DetectedStack {
  language: string
  framework: string | null
  database: string | null
  hasDocker: boolean
  hasCI: boolean
}

const STACK_SIGNATURES: Record<string, { framework?: string; db?: string }> = {
  'package.json': { framework: 'Node.js' },
  'requirements.txt': { framework: 'Python' },
  'Cargo.toml': { framework: 'Rust' },
  'go.mod': { framework: 'Go' },
  'Gemfile': { framework: 'Ruby' },
  'composer.json': { framework: 'PHP' },
  'pyproject.toml': { framework: 'Python' },
  'CMakeLists.txt': { framework: 'C/C++' }
}

export function detectStack(files: RepoFile[]): DetectedStack {
  const filePaths = files.map(f => f.path)
  const framework = findFramework(filePaths)
  const database = detectDatabase(filePaths)

  return {
    language: framework || 'Indeterminada',
    framework,
    database,
    hasDocker: filePaths.some(p => p.includes('Dockerfile')),
    hasCI: filePaths.some(p => p.includes('.github/workflows') || p.includes('.gitlab-ci'))
  }
}

function findFramework(paths: string[]): string | null {
  for (const [file, info] of Object.entries(STACK_SIGNATURES)) {
    if (paths.includes(file)) return info.framework || null
  }
  return null
}

function detectDatabase(paths: string[]): string | null {
  const dbFiles = paths.filter(p => p.startsWith('prisma/') || p === 'schema.sql' || p.includes('migrations'))
  if (dbFiles.length > 0) return 'SQL (provável)'
  return null
}
