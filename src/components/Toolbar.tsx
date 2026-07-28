import React from 'react';
import {
  Code2,
  Plus,
  FolderPlus,
  Moon,
  Sun,
  Settings as SettingsIcon,
  Command,
  Sparkles
} from 'lucide-react';
import { useSnippetStore } from '../store/useSnippetStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { SearchBar } from './SearchBar';

interface ToolbarProps {
  onOpenNewFolderDialog: () => void;
  onOpenCommandPalette: () => void;
  onOpenSettings: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onOpenNewFolderDialog,
  onOpenCommandPalette,
  onOpenSettings,
}) => {
  const { addSnippet, selectedFolderId, setActiveNavigation } = useSnippetStore();
  const { settings, setTheme } = useSettingsStore();

  const handleCreateNewSnippet = () => {
    addSnippet({
      title: 'Untitled Snippet',
      content: '// Write or paste your snippet code here\n',
      language: settings.defaultLanguage,
      folderId: selectedFolderId,
      tags: ['new'],
      isFavorite: false,
      isPinned: false,
      isTrashed: false,
    });
    setActiveNavigation('dashboard');
  };

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <header className="h-12 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 backdrop-blur-md px-3 flex items-center justify-between gap-3 select-none z-20">
      {/* Brand & Logo */}
      <div className="flex items-center gap-2.5 min-w-[190px]">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-sm shadow-blue-500/20 text-white font-bold text-xs">
          <Code2 className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            ClipVault
            <span className="px-1 py-0.2 text-[9px] font-mono font-medium rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
              DESKTOP
            </span>
          </span>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-xl">
        <SearchBar onCommandKClick={onOpenCommandPalette} />
      </div>

      {/* Quick Action Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleCreateNewSnippet}
          className="h-8 px-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-medium rounded-md flex items-center gap-1.5 shadow-sm transition"
          title="New Snippet (⌘N)"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Snippet</span>
        </button>

        <button
          onClick={onOpenNewFolderDialog}
          className="h-8 px-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-md flex items-center gap-1.5 border border-slate-200 dark:border-slate-700/60 transition"
          title="New Folder"
        >
          <FolderPlus className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span className="hidden sm:inline">New Folder</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-0.5" />

        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={`Switch Theme (Current: ${settings.theme})`}
        >
          {settings.theme === 'dark' ? (
            <Moon className="w-4 h-4 text-indigo-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
        </button>

        <button
          onClick={onOpenSettings}
          className="w-8 h-8 rounded-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
