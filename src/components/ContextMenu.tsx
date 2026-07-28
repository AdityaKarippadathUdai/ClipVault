import React, { useEffect, useRef } from 'react';
import {
  Copy,
  Star,
  Pin,
  CopyPlus,
  FolderInput,
  Trash2,
  FolderPlus,
  Edit2,
  Plus
} from 'lucide-react';
import { Snippet, Folder } from '../types';
import { useSnippetStore } from '../store/useSnippetStore';
import { useFolderStore } from '../store/useFolderStore';

export interface ContextMenuPosition {
  x: number;
  y: number;
  type: 'snippet' | 'folder';
  snippet?: Snippet;
  folder?: Folder;
}

interface ContextMenuProps {
  position: ContextMenuPosition | null;
  onClose: () => void;
  onOpenNewFolderDialog: (parentId?: string | null) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  position,
  onClose,
  onOpenNewFolderDialog,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const {
    toggleFavorite,
    togglePin,
    duplicateSnippet,
    deleteSnippet,
    incrementUsage,
  } = useSnippetStore();
  const { deleteFolder } = useFolderStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!position) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl p-1 text-xs text-slate-700 dark:text-slate-200 select-none animate-in fade-in zoom-in-95 duration-100"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      {position.type === 'snippet' && position.snippet && (
        <div className="space-y-0.5">
          <button
            onClick={() => {
              if (position.snippet) {
                navigator.clipboard.writeText(position.snippet.content);
                incrementUsage(position.snippet.id);
              }
              onClose();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
          >
            <Copy className="w-3.5 h-3.5 text-blue-500" />
            <span>Copy Snippet Code</span>
          </button>

          <button
            onClick={() => {
              if (position.snippet) toggleFavorite(position.snippet.id);
              onClose();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span>{position.snippet.isFavorite ? 'Remove Favorite' : 'Mark Favorite'}</span>
          </button>

          <button
            onClick={() => {
              if (position.snippet) togglePin(position.snippet.id);
              onClose();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Pin className="w-3.5 h-3.5 text-amber-500" />
            <span>{position.snippet.isPinned ? 'Unpin' : 'Pin to Top'}</span>
          </button>

          <button
            onClick={() => {
              if (position.snippet) duplicateSnippet(position.snippet.id);
              onClose();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <CopyPlus className="w-3.5 h-3.5 text-indigo-500" />
            <span>Duplicate Snippet</span>
          </button>

          <div className="h-[1px] bg-slate-200 dark:bg-slate-800 my-1" />

          <button
            onClick={() => {
              if (position.snippet) deleteSnippet(position.snippet.id, position.snippet.isTrashed);
              onClose();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{position.snippet.isTrashed ? 'Delete Forever' : 'Move to Trash'}</span>
          </button>
        </div>
      )}

      {position.type === 'folder' && position.folder && (
        <div className="space-y-0.5">
          <button
            onClick={() => {
              if (position.folder) onOpenNewFolderDialog(position.folder.id);
              onClose();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
          >
            <Plus className="w-3.5 h-3.5 text-blue-500" />
            <span>Add Subfolder</span>
          </button>

          <div className="h-[1px] bg-slate-200 dark:bg-slate-800 my-1" />

          <button
            onClick={() => {
              if (position.folder) deleteFolder(position.folder.id);
              onClose();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Folder</span>
          </button>
        </div>
      )}
    </div>
  );
};
