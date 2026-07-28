import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings, ThemeMode } from '../types';

const defaultSettings: Settings = {
  theme: 'dark',
  autoWatchClipboard: true,
  maxClipboardItems: 100,
  editorFontSize: 14,
  editorWordWrap: 'on',
  defaultLanguage: 'typescript',
  hotkeyPrefix: '⌘',
  soundEffects: false,
  clearTrashOnExit: false,
};

interface SettingsState {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  setTheme: (theme: ThemeMode) => void;
  hydrateFromElectron: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
        window.electronApi?.updateSettings(newSettings as Record<string, unknown>);
      },

      setTheme: (theme) => {
        set((state) => ({
          settings: { ...state.settings, theme },
        }));
        window.electronApi?.updateSettings({ theme });
      },

      hydrateFromElectron: async () => {
        const electronSettings = await window.electronApi?.getSettings();
        if (electronSettings) {
          set((state) => ({
            settings: { ...state.settings, ...electronSettings } as Settings,
          }));
        }
      },
    }),
    {
      name: 'clipvault-settings-storage',
    }
  )
);
