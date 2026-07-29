import { BrowserWindow, ipcMain, app } from 'electron';

type WindowGetter = () => BrowserWindow | null;

export function registerWindowIpc(getMainWindow: WindowGetter) {
  ipcMain.handle('window:open', () => {
    const mainWindow = getMainWindow();
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
    return true;
  });

  ipcMain.handle('window:minimize', () => {
    getMainWindow()?.minimize();
    return true;
  });

  ipcMain.handle('window:close', () => {
    getMainWindow()?.close();
    return true;
  });

  ipcMain.handle('window:toggle-tray', (_event, visible: boolean) => {
    const mainWindow = getMainWindow();
    if (mainWindow) {
      if (visible) mainWindow.hide();
      else mainWindow.show();
    }
    return true;
  });

  ipcMain.handle('app:get-version', () => app.getVersion());
}
