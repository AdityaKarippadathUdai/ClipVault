import React from 'react';
import { Folder as FolderIcon, ChevronRight } from 'lucide-react';
import { Folder } from '../../types';

interface FolderCardProps {
  folder: Folder;
  itemCount: number;
  onClick: () => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  itemCount,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-400 dark:hover:border-slate-700 cursor-pointer transition shadow-xs flex items-center justify-between"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className="p-2 rounded-lg text-white font-bold"
          style={{ backgroundColor: folder.color || '#3b82f6' }}
        >
          <FolderIcon className="w-4 h-4" />
        </div>
        <div className="truncate">
          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block truncate">
            {folder.name}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {itemCount} snippets
          </span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-400" />
    </div>
  );
};
