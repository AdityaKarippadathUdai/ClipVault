import React from 'react';
import { Moon } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { ThemeMode } from '../../types';

export const ThemeSettings: React.FC = () => {
  const { settings, setTheme } = useSettingsStore();

  const themeOptions = [
    { id: 'dark' as ThemeMode, name: 'Dark Default', bg: '#181825', border: '#313244' },
    { id: 'light' as ThemeMode, name: 'Light Mode', bg: '#ffffff', border: '#e5e7eb' },
    { id: 'vscode' as ThemeMode, name: 'VS Code Dark', bg: '#1e1e1e', border: '#007acc' },
    { id: 'monokai' as ThemeMode, name: 'Monokai', bg: '#272822', border: '#f92672' },
  ];

  return (
    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 space-y-3">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Moon className="w-4 h-4 text-indigo-400" />
        <span>Appearance & Theme</span>
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {themeOptions.map((themeOpt) => (
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
  );
};
