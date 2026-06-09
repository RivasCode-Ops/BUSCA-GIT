import { IpcMainInvokeEvent } from 'electron'
import { getRepoFiles } from '../services/github/repoTree'

export async function handleGetRepoFiles(
  _event: IpcMainInvokeEvent,
  url: string
) {
  return getRepoFiles(url)
}
