import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings, ThemeMode } from '../types';

interface SettingsState {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  setTheme: (theme: ThemeMode) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: {
        theme: 'dark',
        autoWatchClipboard: true,
        maxClipboardItems: 100,
        editorFontSize: 14,
        editorWordWrap: 'on',
        defaultLanguage: 'typescript',
        hotkeyPrefix: '⌘',
        soundEffects: false,
        clearTrashOnExit: false,
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      setTheme: (theme) => {
        set((state) => ({
          settings: { ...state.settings, theme },
        }));
      },
    }),
    {
      name: 'clipvault-settings-storage',
    }
  )
);
