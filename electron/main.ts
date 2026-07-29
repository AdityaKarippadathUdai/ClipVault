import { app, BrowserWindow, Menu, nativeImage, Tray, globalShortcut } from 'electron';
import fs from 'node:fs';
import http from 'node:http';
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
const DEV_SERVER_URLS = ['http://127.0.0.1:3000', 'http://localhost:3000'];
const PROD_INDEX_PATH = path.resolve(__dirname, '../dist/index.html');
const START_URL = process.env.VITE_DEV_SERVER_URL || process.env.ELECTRON_START_URL || '';

function log(message: string, ...args: unknown[]) {
  console.log(`[electron] ${message}`, ...args);
}

app.disableHardwareAcceleration();
app.setName('ClipVault');
app.setAppUserModelId('com.clipvault.desktop');

if (process.platform === 'linux') {
  app.commandLine.appendSwitch('disable-gpu');
  app.commandLine.appendSwitch('disable-gpu-compositing');
  app.commandLine.appendSwitch('disable-accelerated-2d-canvas');
  app.commandLine.appendSwitch('disable-accelerated-video-decode');
  app.commandLine.appendSwitch('disable-accelerated-video-encode');
  app.commandLine.appendSwitch('disable-gpu-rasterization');
  app.commandLine.appendSwitch('ignore-gpu-blocklist');
  app.commandLine.appendSwitch('disable-dev-shm-usage');
  app.commandLine.appendSwitch('disable-features', 'VizDisplayCompositor,AcceleratedVideoDecode,AcceleratedVideoEncode,CanvasOopRasterization,UseSkiaRenderer');
}

app.on('uncaughtException', (error) => {
  log('uncaught exception', error);
});

app.on('render-process-gone', (_event, webContents, details) => {
  log('renderer process gone', details);
  if (webContents) {
    webContents.reloadIgnoringCache();
  }
});

process.on('unhandledRejection', (reason) => {
  log('unhandled rejection', reason);
});

type AppWindow = BrowserWindow | null;

let mainWindow: AppWindow = null;
let tray: Tray | null = null;
let rendererReady = false;

function getAppIcon() {
  const candidates = [
    path.resolve(__dirname, '../assets/Icon.png'),
    path.join(process.resourcesPath || '', 'assets', 'Icon.png'),
    path.resolve(__dirname, '../assets/icon.png'),
    path.join(process.resourcesPath || '', 'assets', 'icon.png'),
  ];

  for (const iconPath of candidates) {
    if (fs.existsSync(iconPath)) {
      return nativeImage.createFromPath(iconPath);
    }
  }

  return nativeImage.createEmpty();
}

function createTray() {
  const icon = getAppIcon();
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

function showErrorScreen(message: string) {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  const html = `<!doctype html><html><head><meta charset="utf-8" /><meta http-equiv="Content-Security-Policy" content="default-src 'self' data: 'unsafe-inline';" /><title>ClipVault</title></head><body style="font-family: sans-serif; margin: 0; padding: 2rem; background: #020617; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; box-sizing: border-box;"><div style="max-width: 560px; line-height: 1.6;"> <h1 style="margin-bottom: 0.5rem;">ClipVault failed to start</h1><p>${message}</p></div></body></html>`;
  void mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
}

function canReachUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const request = http.get(url, { timeout: 1500 }, () => {
      request.destroy();
      resolve(true);
    });

    request.on('error', () => resolve(false));
    request.on('timeout', () => {
      request.destroy();
      resolve(false);
    });
  });
}

async function resolveRendererUrl(): Promise<string> {
  if (START_URL) {
    return START_URL;
  }

  for (const url of DEV_SERVER_URLS) {
    if (await canReachUrl(url)) {
      return url;
    }
  }

  if (fs.existsSync(PROD_INDEX_PATH)) {
    return `file://${PROD_INDEX_PATH}`;
  }

  return 'data:text/html;charset=utf-8,<!doctype html><html><body>ClipVault is starting…</body></html>';
}

async function showWindowWhenReady() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  if (rendererReady) {
    mainWindow.show();
    mainWindow.focus();
    return;
  }

  for (let attempt = 0; attempt < 10; attempt += 1) {
    try {
      const ready = await mainWindow.webContents.executeJavaScript('globalThis.__clipvaultRenderReady === true');
      if (ready) {
        rendererReady = true;
        log('renderer signalled ready');
        mainWindow.show();
        mainWindow.focus();
        return;
      }
    } catch (error) {
      log('renderer readiness check failed', error);
    }

    await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
  }

  rendererReady = true;
  log('renderer did not signal readiness, showing window anyway');
  mainWindow.show();
  mainWindow.focus();
}

async function createWindow() {
  const icon = getAppIcon();

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 1080,
    minHeight: 760,
    show: false,
    frame: true,
    backgroundColor: '#020617',
    title: 'ClipVault',
    webPreferences: {
      preload: path.resolve(
        __dirname,
        __dirname.endsWith('electron') ? '../dist-electron/preload.js' : 'preload.js'
      ),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      spellcheck: false,
    },
    icon,
  });

  log('browser window created');
  mainWindow.setMenuBarVisibility(false);
  mainWindow.setAutoHideMenuBar(true);

  mainWindow.once('ready-to-show', () => {
    log('ready-to-show received');
  });

  mainWindow.on('close', (event) => {
    const isQuitting = (app as typeof app & { isQuitting?: boolean }).isQuitting;
    if (!isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.webContents.on('did-finish-load', () => {
    log('renderer finished load');
    void showWindowWhenReady();
  });

  mainWindow.webContents.on('did-navigate', (_event, url) => {
    log('renderer navigated to', url);
  });

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
    log('renderer failed to load', errorCode, errorDescription);
    showErrorScreen(`The renderer could not be loaded (${errorCode}: ${errorDescription}).`);
  });

  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    log('renderer process gone', details);
    showErrorScreen('The renderer crashed and needs to be restarted.');
  });

  mainWindow.webContents.on('console-message', (_event, level, message, line, sourceId) => {
    if (level >= 2) {
      log(`renderer console [${level}] ${message} (${sourceId}:${line})`);
    }
  });

  const startUrl = await resolveRendererUrl();
  log(`loading renderer from ${startUrl}`);

  try {
    await mainWindow.loadURL(startUrl);
  } catch (error) {
    log('initial renderer load failed', error);
    showErrorScreen('The renderer could not be loaded.');
  }

  createTray();
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  log('electron app ready');
  initDb();
  runMigrations();
  registerClipboardIpc();
  registerFolderIpc();
  registerSettingsIpc();
  registerSnippetIpc();
  registerWindowIpc(() => mainWindow);
  void createWindow();
  registerShortcuts();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) void createWindow();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
