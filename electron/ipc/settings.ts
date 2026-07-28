import { ipcMain } from 'electron';
import { getSetting, listSettings, setSetting } from '../repositories/settingsRepository';

export function registerSettingsIpc() {
  ipcMain.handle('settings:get', () => listSettings());

  ipcMain.handle('settings:update', (_event, updates: Record<string, unknown>) => {
    Object.entries(updates).forEach(([key, value]) => setSetting(key, value));
    return listSettings();
  });

  ipcMain.handle('settings:get-one', (_event, key: string, fallback: unknown) => getSetting(key, fallback));
}
