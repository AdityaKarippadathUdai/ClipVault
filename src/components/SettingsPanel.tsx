import React from 'react';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Clipboard,
  Code2,
  Type,
  FileJson,
  Download,
  Upload,
  Trash2,
  Check
} from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useSnippetStore } from '../store/useSnippetStore';
import { useFolderStore } from '../store/useFolderStore';
import { LanguageType, ThemeMode } from '../types';
import { LANGUAGE_META } from '../utils/formatters';

export const SettingsPanel: React.FC = () => {
  const { settings, updateSettings, setTheme } = useSettingsStore();
  const { snippets, addSnippet } = useSnippetStore();
  const { folders } = useFolderStore();

  const [importStatus, setImportStatus] = React.useState<string | null>(null);

  const handleExportJSON = () => {
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      snippets,
      folders,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clipvault-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data.snippets)) {
          data.snippets.forEach((importedSnippet: any) => {
            addSnippet({
              title: importedSnippet.title || 'Imported Snippet',
              content: importedSnippet.content || '',
              language: importedSnippet.language || 'typescript',
              folderId: null,
              tags: importedSnippet.tags || ['imported'],
              isFavorite: false,
              isPinned: false,
              isTrashed: false,
            });
          });
          setImportStatus(`Successfully imported ${data.snippets.length} snippets!`);
          setTimeout(() => setImportStatus(null), 3000);
        }
      } catch (err) {
        setImportStatus('Invalid JSON backup file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-2xl mx-auto space-y-6 text-slate-800 dark:text-slate-200">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Preferences & Customization</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure Monaco editor, theme appearance, hotkeys, and database backups.
          </p>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Moon className="w-4 h-4 text-indigo-400" />
          <span>Appearance & Theme</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'dark' as ThemeMode, name: 'Dark Default', bg: '#181825', border: '#313244' },
            { id: 'light' as ThemeMode, name: 'Light Mode', bg: '#ffffff', border: '#e5e7eb' },
            { id: 'vscode' as ThemeMode, name: 'VS Code Dark', bg: '#1e1e1e', border: '#007acc' },
            { id: 'monokai' as ThemeMode, name: 'Monokai', bg: '#272822', border: '#f92672' },
          ].map((themeOpt) => (
            <button
              key={themeOpt.id}
              onClick={() => setTheme(themeOpt.id)}
              className={`p-3 rounded-lg border text-left flex flex-col justify-between gap-2 transition ${
                settings.theme === themeOpt.id
                  ? 'ring-2 ring-blue-500 border-blue-500'
                  : 'hover:border-slate-400 dark:hover:border-slate-700'
              }`}
              style={{ backgroundColor: themeOpt.bg, color: themeOpt.id === 'light' ? '#111827' : '#f8f8f2' }}
            >
              <span className="text-xs font-medium">{themeOpt.name}</span>
              <div className="h-2 w-full rounded" style={{ backgroundColor: themeOpt.border }} />
            </button>
          ))}
        </div>
      </div>

      {/* Editor Preferences */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Code2 className="w-4 h-4 text-blue-500" />
          <span>Monaco Code Editor</span>
        </h3>

        <div className="space-y-3 text-xs">
          {/* Font size */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="font-medium block">Font Size</span>
              <span className="text-slate-400">Current: {settings.editorFontSize}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="22"
              value={settings.editorFontSize}
              onChange={(e) => updateSettings({ editorFontSize: Number(e.target.value) })}
              className="w-32"
            />
          </div>

          {/* Word wrap */}
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="font-medium block">Word Wrapping</span>
              <span className="text-slate-400">Wrap long lines inside editor canvas</span>
            </div>
            <button
              onClick={() =>
                updateSettings({ editorWordWrap: settings.editorWordWrap === 'on' ? 'off' : 'on' })
              }
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                settings.editorWordWrap === 'on'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {settings.editorWordWrap === 'on' ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Default Language */}
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="font-medium block">Default New Snippet Language</span>
              <span className="text-slate-400">Language selected for new snippets</span>
            </div>
            <select
              value={settings.defaultLanguage}
              onChange={(e) => updateSettings({ defaultLanguage: e.target.value as LanguageType })}
              className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-mono focus:outline-none"
            >
              {Object.entries(LANGUAGE_META).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Backup & Export */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <FileJson className="w-4 h-4 text-emerald-500" />
          <span>Backup & Data Export</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Export all snippets, folders, and settings into a JSON backup file or restore from a previous backup.
        </p>

        {importStatus && (
          <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs text-blue-400 font-medium">
            {importStatus}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg flex items-center gap-2 transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON Backup</span>
          </button>

          <label className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg flex items-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700 transition">
            <Upload className="w-4 h-4" />
            <span>Import JSON Backup</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
};
