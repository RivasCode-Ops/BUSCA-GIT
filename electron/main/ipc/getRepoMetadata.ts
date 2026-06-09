import { IpcMainInvokeEvent } from 'electron'
import { getRepoMetadata } from '../services/github/client'

export async function handleGetRepoMetadata(
  _event: IpcMainInvokeEvent,
  url: string
) {
  return getRepoMetadata(url)
}
