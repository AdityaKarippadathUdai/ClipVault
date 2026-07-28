import React, { useState } from 'react';
import { FolderPlus, X, Palette } from 'lucide-react';
import { useFolderStore } from '../store/useFolderStore';

interface FolderDialogProps {
  isOpen: boolean;
  parentId?: string | null;
  onClose: () => void;
}

const COLOR_OPTIONS = [
  '#3b82f6', // Blue
  '#e95420', // Ubuntu Orange
  '#2496ed', // Docker Blue
  '#f05032', // Git Red
  '#61dafb', // React Cyan
  '#3776ab', // Python Blue
  '#a855f7', // AI Purple
  '#10b981', // Emerald Green
  '#f59e0b', // Amber
];

export const FolderDialog: React.FC<FolderDialogProps> = ({
  isOpen,
  parentId = null,
  onClose,
}) => {
  const { addFolder, folders } = useFolderStore();
  const [folderName, setFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');

  if (!isOpen) return null;

  const parentFolder = parentId ? folders.find((f) => f.id === parentId) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    addFolder(folderName.trim(), parentId, selectedColor);
    setFolderName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {parentFolder ? `New Subfolder in "${parentFolder.name}"` : 'Create New Folder'}
              </h3>
              <p className="text-[11px] text-slate-400">Organize your code snippets into workspaces</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Folder Name
            </label>
            <input
              type="text"
              autoFocus
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="e.g., Microservices, Kubernetes, Scripts..."
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              <span>Color Tag</span>
            </label>
            <div className="flex items-center gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-5 h-5 rounded-full transition transform hover:scale-110 ${
                    selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!folderName.trim()}
              className="px-4 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg transition shadow-sm"
            >
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
