import { db, rebuildFts } from '../database/db';
import { Snippet } from '../../src/types';

function normalizeSnippet(row: Record<string, unknown>): Snippet {
  return {
    id: String(row.id),
    title: String(row.title),
    content: String(row.content),
    description: row.description ? String(row.description) : undefined,
    language: (row.language as Snippet['language']) || 'typescript',
    folderId: row.folderId ? String(row.folderId) : null,
    tags: JSON.parse(String(row.tags || '[]')),
    isFavorite: Number(row.isFavorite) === 1,
    isPinned: Number(row.isPinned) === 1,
    isTrashed: Number(row.isTrashed) === 1,
    createdAt: String(row.createdAt),
    updatedAt: String(row.updatedAt),
    usageCount: Number(row.usageCount || 0),
  };
}

export function listSnippets(): Snippet[] {
  const rows = db.prepare('SELECT * FROM snippets ORDER BY updatedAt DESC').all() as Record<string, unknown>[];
  return rows.map(normalizeSnippet);
}

export function upsertSnippet(snippet: Snippet) {
  const stmt = db.prepare(`
    INSERT INTO snippets (id, title, content, description, language, folderId, tags, isFavorite, isPinned, isTrashed, createdAt, updatedAt, usageCount)
    VALUES (@id, @title, @content, @description, @language, @folderId, @tags, @isFavorite, @isPinned, @isTrashed, @createdAt, @updatedAt, @usageCount)
    ON CONFLICT(id) DO UPDATE SET
      title=excluded.title,
      content=excluded.content,
      description=excluded.description,
      language=excluded.language,
      folderId=excluded.folderId,
      tags=excluded.tags,
      isFavorite=excluded.isFavorite,
      isPinned=excluded.isPinned,
      isTrashed=excluded.isTrashed,
      updatedAt=excluded.updatedAt,
      usageCount=excluded.usageCount
  `);
  stmt.run({
    ...snippet,
    tags: JSON.stringify(snippet.tags),
    isFavorite: snippet.isFavorite ? 1 : 0,
    isPinned: snippet.isPinned ? 1 : 0,
    isTrashed: snippet.isTrashed ? 1 : 0,
  });
  rebuildFts();
}

export function deleteSnippet(id: string, permanent = false) {
  if (permanent) {
    db.prepare('DELETE FROM snippets WHERE id = ?').run(id);
  } else {
    db.prepare('UPDATE snippets SET isTrashed = 1, updatedAt = ? WHERE id = ?').run(new Date().toISOString(), id);
  }
  rebuildFts();
}

export function restoreSnippet(id: string) {
  db.prepare('UPDATE snippets SET isTrashed = 0, updatedAt = ? WHERE id = ?').run(new Date().toISOString(), id);
  rebuildFts();
}
