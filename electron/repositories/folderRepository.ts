import { db } from '../database/db';
import { Folder } from '../../src/types';

export function listFolders(): Folder[] {
  const rows = db.prepare('SELECT * FROM folders ORDER BY name ASC').all() as Record<string, unknown>[];
  return rows.map((row) => ({
    id: String(row.id),
    name: String(row.name),
    parentId: row.parentId ? String(row.parentId) : null,
    icon: row.icon ? String(row.icon) : undefined,
    color: row.color ? String(row.color) : undefined,
    isExpanded: Number(row.isExpanded) !== 0,
  }));
}

export function upsertFolder(folder: Folder) {
  const stmt = db.prepare(`
    INSERT INTO folders (id, name, parentId, icon, color, isExpanded)
    VALUES (@id, @name, @parentId, @icon, @color, @isExpanded)
    ON CONFLICT(id) DO UPDATE SET
      name=excluded.name,
      parentId=excluded.parentId,
      icon=excluded.icon,
      color=excluded.color,
      isExpanded=excluded.isExpanded
  `);
  stmt.run({
    ...folder,
    isExpanded: folder.isExpanded ? 1 : 0,
  });
}

export function deleteFolder(id: string) {
  db.prepare('DELETE FROM folders WHERE id = ?').run(id);
}
