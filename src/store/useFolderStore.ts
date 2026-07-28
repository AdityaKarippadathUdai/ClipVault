import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Folder } from '../types';
import { initialFolders } from '../data/mockFolders';

interface FolderState {
  folders: Folder[];
  
  addFolder: (name: string, parentId?: string | null, color?: string) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  toggleExpand: (id: string) => void;
  moveFolder: (folderId: string, newParentId: string | null) => void;
}

export const useFolderStore = create<FolderState>()(
  persist(
    (set, get) => ({
      folders: initialFolders,

      addFolder: (name, parentId = null, color = '#89b4fa') => {
        const newFolder: Folder = {
          id: `folder-${Date.now()}`,
          name,
          parentId,
          color,
          isExpanded: true,
        };
        set((state) => ({
          folders: [...state.folders, newFolder],
        }));
      },

      updateFolder: (id, updates) => {
        set((state) => ({
          folders: state.folders.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        }));
      },

      deleteFolder: (id) => {
        // Recursively find subfolder IDs
        const getAllSubfolderIds = (folderId: string): string[] => {
          const subs = get().folders.filter((f) => f.parentId === folderId);
          return [folderId, ...subs.flatMap((s) => getAllSubfolderIds(s.id))];
        };

        const idsToDelete = getAllSubfolderIds(id);
        set((state) => ({
          folders: state.folders.filter((f) => !idsToDelete.includes(f.id)),
        }));
      },

      toggleExpand: (id) => {
        set((state) => ({
          folders: state.folders.map((f) =>
            f.id === id ? { ...f, isExpanded: !f.isExpanded } : f
          ),
        }));
      },

      moveFolder: (folderId, newParentId) => {
        if (folderId === newParentId) return;
        set((state) => ({
          folders: state.folders.map((f) =>
            f.id === folderId ? { ...f, parentId: newParentId } : f
          ),
        }));
      },
    }),
    {
      name: 'clipvault-folders-storage',
    }
  )
);
