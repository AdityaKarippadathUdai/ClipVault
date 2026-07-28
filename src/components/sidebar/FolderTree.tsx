import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Folder as FolderIcon,
  FolderOpen,
  Plus,
  Trash2
} from 'lucide-react';
import { useFolderStore } from '../../store/useFolderStore';
import { useSnippetStore } from '../../store/useSnippetStore';
import { Folder } from '../../types';

interface FolderTreeProps {
  onAddSubfolder: (parentId: string) => void;
  onContextMenu?: (e: React.MouseEvent, folder: Folder) => void;
}

export const FolderTree: React.FC<FolderTreeProps> = ({
  onAddSubfolder,
  onContextMenu,
}) => {
  const { folders, toggleExpand } = useFolderStore();
  const { selectedFolderId, setSelectedFolderId, snippets } = useSnippetStore();

  const renderFolderNode = (folder: Folder, depth = 0) => {
    const isExpanded = folder.isExpanded ?? false;
    const isSelected = selectedFolderId === folder.id;
    const subfolders = folders.filter((f) => f.parentId === folder.id);
    const hasSubfolders = subfolders.length > 0;

    const snippetCount = snippets.filter((s) => !s.isTrashed && s.folderId === folder.id).length;

    return (
      <div key={folder.id} className="select-none">
        <div
          onClick={() => setSelectedFolderId(folder.id)}
          onContextMenu={(e) => onContextMenu?.(e, folder)}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          className={`group flex items-center justify-between py-1 pr-2 rounded-md text-xs cursor-pointer transition ${
            isSelected
              ? 'bg-blue-600/15 text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {hasSubfolders ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(folder.id);
                }}
                className="p-0.5 rounded hover:bg-slate-300/50 dark:hover:bg-slate-700/50 text-slate-400"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
            ) : (
              <span className="w-3.5 h-3.5 shrink-0" />
            )}

            {isExpanded ? (
              <FolderOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            ) : (
              <FolderIcon className="w-3.5 h-3.5 text-blue-500/80 shrink-0" />
            )}

            <span className="truncate">{folder.name}</span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddSubfolder(folder.id);
              }}
              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              title="Add Subfolder"
            >
              <Plus className="w-3 h-3" />
            </button>
            {snippetCount > 0 && (
              <span className="text-[10px] font-mono text-slate-400 px-1">
                {snippetCount}
              </span>
            )}
          </div>
        </div>

        {isExpanded && hasSubfolders && (
          <div className="space-y-0.5 mt-0.5">
            {subfolders.map((sub) => renderFolderNode(sub, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootFolders = folders.filter((f) => f.parentId === null);

  if (rootFolders.length === 0) {
    return (
      <div className="px-2 py-4 text-center text-xs text-slate-400 dark:text-slate-500">
        No folders yet.
      </div>
    );
  }

  return <div className="space-y-0.5">{rootFolders.map((f) => renderFolderNode(f, 0))}</div>;
};
