import { clipboard, ipcMain, Notification } from 'electron';
import { db } from '../database/db';
import { listSettings } from '../repositories/settingsRepository';

function detectType(text: string) {
  if (!text) return 'text';
  if (/^https?:\/\//i.test(text)) return 'url';
  if (/^\s*[{\[]/.test(text)) return 'json';
  if (/\n/.test(text)) return 'code';
  return 'text';
}

export function registerClipboardIpc() {
  ipcMain.handle('clipboard:list', () => {
    const rows = db.prepare('SELECT * FROM clipboard_items ORDER BY copiedAt DESC').all() as Record<string, unknown>[];
    return rows.map((row) => ({
      id: String(row.id),
      text: String(row.text),
      type: String(row.type),
      copiedAt: String(row.copiedAt),
      isFavorite: Number(row.isFavorite) === 1,
      sourceApp: row.sourceApp ? String(row.sourceApp) : undefined,
      charCount: Number(row.charCount),
      lineCount: Number(row.lineCount),
      detectedLanguage: row.detectedLanguage ? String(row.detectedLanguage) : undefined,
    }));
  });

  ipcMain.handle('clipboard:clear', () => {
    db.prepare('DELETE FROM clipboard_items').run();
    return true;
  });

  ipcMain.handle('clipboard:add', (_event, data: Record<string, unknown>) => {
    const text = String(data.text || '');
    if (!text.trim()) return false;

    const now = new Date().toISOString();
    const entry = {
      id: `clip-${Date.now()}`,
      text,
      type: detectType(text),
      copiedAt: now,
      isFavorite: 0,
      sourceApp: data.sourceApp ? String(data.sourceApp) : 'System Clipboard',
      charCount: text.length,
      lineCount: text.split(/\r?\n/).length,
      detectedLanguage: data.detectedLanguage ? String(data.detectedLanguage) : 'text',
    };

    db.prepare(`
      INSERT INTO clipboard_items (id, text, type, copiedAt, isFavorite, sourceApp, charCount, lineCount, detectedLanguage)
      VALUES (@id, @text, @type, @copiedAt, @isFavorite, @sourceApp, @charCount, @lineCount, @detectedLanguage)
      ON CONFLICT(id) DO NOTHING
    `).run(entry);

    const settings = listSettings();
    if (settings.showNotifications) {
      new Notification({ title: 'Clipboard captured', body: text.slice(0, 80) }).show();
    }
    return true;
  });

  clipboard.on('text-changed', () => {
    const text = clipboard.readText();
    if (text) {
      db.prepare(`
        INSERT INTO clipboard_items (id, text, type, copiedAt, isFavorite, sourceApp, charCount, lineCount, detectedLanguage)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO NOTHING
      `).run(`clip-${Date.now()}`, text, detectType(text), new Date().toISOString(), 0, 'System Clipboard', text.length, text.split(/\r?\n/).length, 'text');
    }
  });
}
