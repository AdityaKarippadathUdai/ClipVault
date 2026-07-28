import { BrowserWindow, ipcMain, app } from 'electron';

export function registerWindowIpc(mainWindow: BrowserWindow | null) {
  ipcMain.handle('window:open', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
    return true;
  });

  ipcMain.handle('window:minimize', () => {
    mainWindow?.minimize();
    return true;
  });

  ipcMain.handle('window:close', () => {
    mainWindow?.close();
    return true;
  });

  ipcMain.handle('window:toggle-tray', (_event, visible: boolean) => {
    if (mainWindow) {
      if (visible) mainWindow.hide();
      else mainWindow.show();
    }
    return true;
  });

  ipcMain.handle('app:get-version', () => app.getVersion());
}
