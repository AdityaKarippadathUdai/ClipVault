import React from 'react';
import {
  ChevronRight,
  ChevronDown,
  Folder as FolderIcon,
  FolderOpen,
  Plus,
  Trash2,
  MoreVertical,
  FolderPlus
} from 'lucide-react';
import { useFolderStore } from '../store/useFolderStore';
import { useSnippetStore } from '../store/useSnippetStore';
import { Folder } from '../types';

interface FolderTreeProps {
  onAddSubfolder: (parentId: string) => void;
  onContextMenu?: (e: React.MouseEvent, folder: Folder) => void;
}

export const FolderTree: React.FC<FolderTreeProps> = ({
  onAddSubfolder,
  onContextMenu,
}) => {
  const { folders, toggleExpand } = useFolderStore();
  const { snippets, selectedFolderId, setSelectedFolderId } = useSnippetStore();

  // Get active non-trashed snippets count for a folder (including descendants)
  const getSnippetCount = (folderId: string): number => {
    const getSubfolderIds = (id: string): string[] => {
      const children = folders.filter((f) => f.parentId === id);
      return [id, ...children.flatMap((c) => getSubfolderIds(c.id))];
    };
    const allFolderIds = getSubfolderIds(folderId);
    return snippets.filter((s) => !s.isTrashed && s.folderId && allFolderIds.includes(s.folderId)).length;
  };

  const renderFolderNode = (folder: Folder, depth = 0) => {
    const childFolders = folders.filter((f) => f.parentId === folder.id);
    const hasChildren = childFolders.length > 0;
    const isSelected = selectedFolderId === folder.id;
    const isExpanded = folder.isExpanded ?? true;
    const count = getSnippetCount(folder.id);

    return (
      <div key={folder.id} className="select-none">
        <div
          onClick={() => setSelectedFolderId(folder.id)}
          onContextMenu={(e) => {
            e.preventDefault();
            onContextMenu?.(e, folder);
          }}
          className={`group flex items-center justify-between py-1 px-2 rounded-md text-xs cursor-pointer transition-colors ${
            isSelected
              ? 'bg-blue-600/15 text-blue-600 dark:text-blue-400 font-medium'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          <div className="flex items-center gap-1.5 truncate min-w-0">
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(folder.id);
                }}
                className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700/60 text-slate-400"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
            ) : (
              <span className="w-3.5 h-3.5" />
            )}

            {isExpanded && hasChildren ? (
              <FolderOpen className="w-3.5 h-3.5 shrink-0" style={{ color: folder.color || '#3b82f6' }} />
            ) : (
              <FolderIcon className="w-3.5 h-3.5 shrink-0" style={{ color: folder.color || '#3b82f6' }} />
            )}

            <span className="truncate">{folder.name}</span>
          </div>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
            {count > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                {count}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddSubfolder(folder.id);
              }}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition rounded hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
              title="Add subfolder"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="flex flex-col">
            {childFolders.map((child) => renderFolderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootFolders = folders.filter((f) => f.parentId === null);

  return (
    <div className="space-y-0.5">
      {rootFolders.map((root) => renderFolderNode(root, 0))}
    </div>
  );
};
