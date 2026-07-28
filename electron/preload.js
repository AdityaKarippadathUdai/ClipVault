const { contextBridge, ipcRenderer } = require('electron');

const electronApi = {
  getVersion: () => ipcRenderer.invoke('app:get-version'),
  getSettings: () => ipcRenderer.invoke('settings:get'),
  updateSettings: (settings) => ipcRenderer.invoke('settings:update', settings),
  toggleTray: (visible) => ipcRenderer.invoke('window:toggle-tray', visible),
  openWindow: () => ipcRenderer.invoke('window:open'),
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  onClipboardChanged: (callback) => {
    const subscription = (_event, value) => callback(value);
    ipcRenderer.on('clipboard:changed', subscription);
    return () => ipcRenderer.removeListener('clipboard:changed', subscription);
  },
  onSettingsChanged: (callback) => {
    const subscription = (_event, value) => callback(value);
    ipcRenderer.on('settings:changed', subscription);
    return () => ipcRenderer.removeListener('settings:changed', subscription);
  },
  addClipboardItem: (data) => ipcRenderer.invoke('clipboard:add', data),
  getClipboardHistory: () => ipcRenderer.invoke('clipboard:list'),
  clearClipboardHistory: () => ipcRenderer.invoke('clipboard:clear'),
};

contextBridge.exposeInMainWorld('electronApi', electronApi);
