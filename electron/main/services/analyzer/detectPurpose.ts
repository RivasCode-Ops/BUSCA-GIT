import { RepoMetadata, RepoFile } from '@shared/contracts/analyze'

export interface PurposeResult {
  summary: string
  category: string
  estimatedEffort: 'baixo' | 'médio' | 'alto'
  tags: string[]
}

export async function detectPurpose(
  metadata: RepoMetadata,
  files: RepoFile[]
): Promise<PurposeResult> {
  const readmeContent = files.find(f => f.path === 'README.md')
  const topics = metadata.topics

  const category = classifyByTopics(topics)
  const hasConfig = files.some(f => f.isImportant)
  const effort = hasConfig ? 'médio' : 'alto'

  return {
    summary: metadata.description || 'Sem descrição disponível',
    category,
    estimatedEffort: effort,
    tags: [metadata.language, ...topics]
  }
}

function classifyByTopics(topics: string[]): string {
  const topicLower = topics.map(t => t.toLowerCase())
  if (topicLower.some(t => ['framework', 'library', 'sdk'].includes(t))) return 'biblioteca/ferramenta'
  if (topicLower.some(t => ['app', 'application', 'webapp'].includes(t))) return 'aplicação'
  if (topicLower.some(t => ['cli', 'api', 'service'].includes(t))) return 'serviço/API'
  if (topicLower.some(t => ['template', 'starter', 'boilerplate'].includes(t))) return 'template'
  return 'projeto genérico'
}
