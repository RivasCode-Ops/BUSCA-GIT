import { IpcMainInvokeEvent } from 'electron'
import { getSettings, updateSettings, Settings } from '../services/storage/db'
import { updateToken, getTokenPreview } from '../services/github/client'

export async function handleSettings(
  _event: IpcMainInvokeEvent,
  action: 'get' | 'set' | 'token-status',
  payload?: Partial<Settings>
): Promise<Settings & { tokenPreview: string }> {
  if (action === 'set' && payload) {
    const updated = await updateSettings(payload)
    if (payload.githubToken) {
      await updateToken(payload.githubToken)
    }
    return { ...updated, tokenPreview: getTokenPreview() }
  }
  if (action === 'token-status') {
    const s = await getSettings()
    return { ...s, tokenPreview: getTokenPreview() }
  }
  const s = await getSettings()
  return { ...s, tokenPreview: getTokenPreview() }
}
