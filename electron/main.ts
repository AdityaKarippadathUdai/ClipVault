import { app, BrowserWindow, Menu, nativeImage, Tray, globalShortcut } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initDb, runMigrations } from './database/db';
import { registerClipboardIpc } from './ipc/clipboard';
import { registerFolderIpc } from './ipc/folders';
import { registerSettingsIpc } from './ipc/settings';
import { registerSnippetIpc } from './ipc/snippets';
import { registerWindowIpc } from './ipc/window';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;

type AppWindow = BrowserWindow | null;

let mainWindow: AppWindow = null;
let tray: Tray | null = null;

function createWindow() {
  const iconPath = path.join(__dirname, 'assets', 'icons', 'icon.png');
  const icon = nativeImage.createFromPath(iconPath);

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 1080,
    minHeight: 760,
    show: false,
    frame: false,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#020617',
    roundedCorners: true,
    title: 'ClipVault',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
    },
    icon,
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('close', (event) => {
    const isQuitting = (app as typeof app & { isQuitting?: boolean }).isQuitting;
    if (!isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  createTray();
}

function createTray() {
  const iconPath = path.join(__dirname, 'assets', 'icons', 'icon.png');
  const icon = nativeImage.createFromPath(iconPath);
  tray = new Tray(icon.resize({ width: 24, height: 24 }));
  tray.setToolTip('ClipVault');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Show ClipVault', click: () => mainWindow?.show() },
    { label: 'New Clipboard Entry', click: () => mainWindow?.webContents.send('clipboard:changed', { action: 'new' }) },
    { type: 'separator' },
    { label: 'Quit', click: () => { (app as typeof app & { isQuitting?: boolean }).isQuitting = true; mainWindow?.destroy(); app.quit(); } },
  ]));
  tray.on('click', () => mainWindow?.show());
}

function registerShortcuts() {
  globalShortcut.register('CommandOrControl+Shift+V', () => {
    mainWindow?.show();
    mainWindow?.focus();
    mainWindow?.webContents.send('shortcut:show-search', true);
  });
}

app.whenReady().then(() => {
  initDb();
  runMigrations();
  createWindow();
  registerShortcuts();
  registerClipboardIpc();
  registerFolderIpc();
  registerSettingsIpc();
  registerSnippetIpc();
  registerWindowIpc(mainWindow);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
