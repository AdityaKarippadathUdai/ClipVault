import { contextBridge, ipcRenderer } from 'electron';

const electronApi = {
  getVersion: () => ipcRenderer.invoke('app:get-version'),
  getSettings: () => ipcRenderer.invoke('settings:get'),
  updateSettings: (settings: Record<string, unknown>) => ipcRenderer.invoke('settings:update', settings),
  toggleTray: (visible: boolean) => ipcRenderer.invoke('window:toggle-tray', visible),
  openWindow: () => ipcRenderer.invoke('window:open'),
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  onClipboardChanged: (callback: (data: unknown) => void) => {
    const subscription = (_event: unknown, value: unknown) => callback(value);
    ipcRenderer.on('clipboard:changed', subscription);
    return () => ipcRenderer.removeListener('clipboard:changed', subscription);
  },
  onSettingsChanged: (callback: (settings: Record<string, unknown>) => void) => {
    const subscription = (_event: unknown, value: Record<string, unknown>) => callback(value);
    ipcRenderer.on('settings:changed', subscription);
    return () => ipcRenderer.removeListener('settings:changed', subscription);
  },
  addClipboardItem: (data: Record<string, unknown>) => ipcRenderer.invoke('clipboard:add', data),
  getClipboardHistory: () => ipcRenderer.invoke('clipboard:list'),
  clearClipboardHistory: () => ipcRenderer.invoke('clipboard:clear'),
};

contextBridge.exposeInMainWorld('electronApi', electronApi);
