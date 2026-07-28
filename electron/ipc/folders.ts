import { ipcMain } from 'electron';
import { deleteFolder, listFolders, upsertFolder } from '../repositories/folderRepository';
import { Folder } from '../../src/types';

export function registerFolderIpc() {
  ipcMain.handle('folders:list', () => listFolders());

  ipcMain.handle('folders:save', (_event, folder: Folder) => {
    upsertFolder(folder);
    return true;
  });

  ipcMain.handle('folders:delete', (_event, id: string) => {
    deleteFolder(id);
    return true;
  });
}
