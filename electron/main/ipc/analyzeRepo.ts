import { IpcMainInvokeEvent } from 'electron'
import { AnalyzeRequest, AnalyzeResponse } from '@shared/contracts/analyze'
import { getRepoMetadata } from '../services/github/client'
import { getRepoFiles } from '../services/github/repoTree'
import { detectStack } from '../services/analyzer/detectStack'
import { detectPurpose } from '../services/analyzer/detectPurpose'
import { analyzeHealth } from '../services/analyzer/healthScore'

export async function handleAnalyzeRepo(
  _event: IpcMainInvokeEvent,
  request: AnalyzeRequest
): Promise<AnalyzeResponse> {
  const metadata = await getRepoMetadata(request.url)
  const files = await getRepoFiles(request.url)
  const stack = detectStack(files)
  const purpose = await detectPurpose(metadata, files)
  const health = analyzeHealth(metadata)

  return {
    metadata,
    stack,
    purpose,
    health,
    importantFiles: files.filter(f => f.isImportant)
  }
}
