import React from 'react';
import {
  Database,
  Clipboard,
  CheckCircle2,
  PauseCircle,
  Filter,
  Command,
  Code
} from 'lucide-react';
import { useSnippetStore } from '../store/useSnippetStore';
import { useClipboardStore } from '../store/useClipboardStore';

export const StatusBar: React.FC = () => {
  const { snippets, searchQuery, selectedTag, selectedLanguage, selectedFolderId } = useSnippetStore();
  const { isWatcherActive, toggleWatcher } = useClipboardStore();

  const totalSnippets = snippets.filter((s) => !s.isTrashed).length;
  const isFiltered = Boolean(searchQuery || selectedTag || selectedLanguage || selectedFolderId);

  return (
    <footer className="h-6 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 px-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono select-none z-20 shrink-0">
      <div className="flex items-center gap-4">
        {/* Total Snippets */}
        <div className="flex items-center gap-1.5">
          <Code className="w-3 h-3 text-blue-500" />
          <span>
            <strong className="text-slate-700 dark:text-slate-200">{totalSnippets}</strong> snippets
          </span>
        </div>

        {/* Filter Status */}
        {isFiltered && (
          <div className="flex items-center gap-1 text-indigo-500 dark:text-indigo-400">
            <Filter className="w-3 h-3" />
            <span>Filtered View Active</span>
          </div>
        )}

        {/* Database Status */}
        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
          <Database className="w-3 h-3 text-emerald-500" />
          <span>Local Vault Connected</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Clipboard Watcher Toggle */}
        <button
          onClick={toggleWatcher}
          className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200 transition"
          title="Toggle automatic clipboard watcher"
        >
          <Clipboard className="w-3 h-3 text-slate-400" />
          <span>Clipboard Monitor:</span>
          {isWatcherActive ? (
            <span className="flex items-center gap-1 text-emerald-500 font-medium">
              <CheckCircle2 className="w-3 h-3" /> Active
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-500 font-medium">
              <PauseCircle className="w-3 h-3" /> Paused
            </span>
          )}
        </button>

        {/* Shortcut hint */}
        <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 bg-slate-200/60 dark:bg-slate-800/60 px-1.5 py-0.2 rounded border border-slate-300/40 dark:border-slate-700/40">
          <Command className="w-2.5 h-2.5" />
          <span>K Palette</span>
        </div>
      </div>
    </footer>
  );
};
