import React, { useState, useEffect } from 'react';
import {
  Search,
  Code2,
  FolderPlus,
  Plus,
  Moon,
  Sun,
  Trash2,
  X,
  Command,
  Star
} from 'lucide-react';
import { useSnippetStore } from '../store/useSnippetStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { LANGUAGE_META } from '../utils/formatters';

interface QuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFolderDialog: () => void;
}

export const QuickActionsModal: React.FC<QuickActionsModalProps> = ({
  isOpen,
  onClose,
  onOpenFolderDialog,
}) => {
  const { snippets, selectSnippet, addSnippet, setActiveNavigation } = useSnippetStore();
  const { settings, setTheme } = useSettingsStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredSnippets = snippets
    .filter((s) => !s.isTrashed)
    .filter((s) => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.content.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
      );
    })
    .slice(0, 7);

  const handleSelectSnippet = (id: string) => {
    selectSnippet(id);
    setActiveNavigation('dashboard');
    onClose();
  };

  const handleCreateSnippet = () => {
    addSnippet({
      title: query.trim() || 'New Snippet',
      content: '// Code snippet\n',
      language: settings.defaultLanguage,
      folderId: null,
      tags: ['quick'],
      isFavorite: false,
      isPinned: false,
      isTrashed: false,
    });
    setActiveNavigation('dashboard');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4 animate-in fade-in duration-100">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col select-none">
        {/* Search Header */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search snippets..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Actions Bar */}
        <div className="px-3 py-2 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={handleCreateSnippet}
            className="px-2.5 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-500 font-medium flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Snippet</span>
          </button>

          <button
            onClick={() => {
              onOpenFolderDialog();
              onClose();
            }}
            className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-300 dark:hover:bg-slate-700 font-medium flex items-center gap-1.5 shrink-0"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>New Folder</span>
          </button>

          <button
            onClick={() => {
              setTheme(settings.theme === 'dark' ? 'light' : 'dark');
              onClose();
            }}
            className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-300 dark:hover:bg-slate-700 font-medium flex items-center gap-1.5 shrink-0"
          >
            {settings.theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span>Toggle Theme</span>
          </button>
        </div>

        {/* Snippets Results */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredSnippets.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching snippets found for "{query}".
            </div>
          ) : (
            filteredSnippets.map((snippet) => (
              <div
                key={snippet.id}
                onClick={() => handleSelectSnippet(snippet.id)}
                className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer flex items-center justify-between gap-3 text-xs transition"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Code2 className="w-4 h-4 text-blue-500 shrink-0" />
                  <div className="truncate">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 block truncate">
                      {snippet.title}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 truncate block">
                      {snippet.content.split('\n')[0]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
                  <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {LANGUAGE_META[snippet.language]?.label || snippet.language}
                  </span>
                  {snippet.isFavorite && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
