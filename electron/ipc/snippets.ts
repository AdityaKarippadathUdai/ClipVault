import { ipcMain } from 'electron';
import { deleteSnippet, listSnippets, restoreSnippet, upsertSnippet } from '../repositories/snippetRepository';
import { Snippet } from '../../src/types';

export function registerSnippetIpc() {
  ipcMain.handle('snippets:list', () => listSnippets());

  ipcMain.handle('snippets:save', (_event, snippet: Snippet) => {
    upsertSnippet(snippet);
    return true;
  });

  ipcMain.handle('snippets:delete', (_event, id: string, permanent = false) => {
    deleteSnippet(id, permanent);
    return true;
  });

  ipcMain.handle('snippets:restore', (_event, id: string) => {
    restoreSnippet(id);
    return true;
  });
}
