import Database from 'better-sqlite3';
import path from 'node:path';
import { app } from 'electron';

const userDataPath = app?.getPath('userData') || process.cwd();
export const db = new Database(path.join(userDataPath, 'clipvault.db'));

db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS snippets (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    description TEXT,
    language TEXT NOT NULL,
    folderId TEXT,
    tags TEXT NOT NULL DEFAULT '[]',
    isFavorite INTEGER NOT NULL DEFAULT 0,
    isPinned INTEGER NOT NULL DEFAULT 0,
    isTrashed INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    usageCount INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS folders (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    parentId TEXT,
    icon TEXT,
    color TEXT,
    isExpanded INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS clipboard_items (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    type TEXT NOT NULL,
    copiedAt TEXT NOT NULL,
    isFavorite INTEGER NOT NULL DEFAULT 0,
    sourceApp TEXT,
    charCount INTEGER NOT NULL,
    lineCount INTEGER NOT NULL,
    detectedLanguage TEXT
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE VIRTUAL TABLE IF NOT EXISTS snippets_fts USING fts5(
    title,
    content,
    tags,
    folderId,
    language,
    content='snippets',
    content_rowid='rowid'
  );
`);

export function initDb() {
  const insert = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  insert.run('theme', JSON.stringify('dark'));
  insert.run('autoWatchClipboard', JSON.stringify(true));
  insert.run('maxClipboardItems', JSON.stringify(100));
  insert.run('editorFontSize', JSON.stringify(14));
  insert.run('editorWordWrap', JSON.stringify('on'));
  insert.run('defaultLanguage', JSON.stringify('typescript'));
  insert.run('hotkey', JSON.stringify('Control+Shift+V'));
  insert.run('launchAtStartup', JSON.stringify(false));
  insert.run('showNotifications', JSON.stringify(true));
  insert.run('autoCleanupDays', JSON.stringify(30));
  insert.run('windowBounds', JSON.stringify({ width: 1280, height: 860, x: 100, y: 100 }));
}

export function runMigrations() {
  // Placeholder for future migrations.
}

export function rebuildFts() {
  db.exec(`
    DELETE FROM snippets_fts;
    INSERT INTO snippets_fts(rowid, title, content, tags, folderId, language)
    SELECT rowid, title, content, tags, folderId, language FROM snippets;
  `);
}
