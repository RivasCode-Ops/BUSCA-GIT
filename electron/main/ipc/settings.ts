import { IpcMainInvokeEvent } from 'electron'
import { getSettings, updateSettings, Settings } from '../services/storage/db'

export async function handleSettings(
  _event: IpcMainInvokeEvent,
  action: 'get' | 'set',
  payload?: Partial<Settings>
): Promise<Settings> {
  if (action === 'set' && payload) {
    return updateSettings(payload)
  }
  return getSettings()
}
