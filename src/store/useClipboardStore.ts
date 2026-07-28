import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ClipboardItem, LanguageType } from '../types';
import { initialClipboardItems } from '../data/mockClipboard';

const defaultInitialClipboardItems = initialClipboardItems;

interface ClipboardState {
  items: ClipboardItem[];
  isWatcherActive: boolean;

  addClipboardItem: (text: string, sourceApp?: string) => void;
  removeClipboardItem: (id: string) => void;
  clearClipboardHistory: () => void;
  toggleWatcher: () => void;
  toggleFavoriteClipboard: (id: string) => void;
}

function detectLanguage(text: string): LanguageType {
  if (text.includes('function') || text.includes('const ') || text.includes('import ')) return 'typescript';
  if (text.includes('def ') || text.includes('import ') && text.includes('from ')) return 'python';
  if (text.includes('SELECT ') || text.includes('FROM ') || text.includes('WHERE ')) return 'sql';
  if (text.includes('docker ') || text.includes('kubectl ') || text.includes('sudo ')) return 'bash';
  if (text.trim().startsWith('{') || text.trim().startsWith('[')) return 'json';
  return 'bash';
}

export const useClipboardStore = create<ClipboardState>()(
  persist(
    (set) => ({
      items: defaultInitialClipboardItems,
      isWatcherActive: true,

      addClipboardItem: (text, sourceApp = 'System Clipboard') => {
        if (!text.trim()) return;
        const now = new Date().toISOString();
        const lineCount = text.split('\n').length;
        const charCount = text.length;
        const type = text.startsWith('http://') || text.startsWith('https://') ? 'url' : text.trim().startsWith('{') ? 'json' : 'code';

        const newItem: ClipboardItem = {
          id: `clip-${Date.now()}`,
          text,
          type,
          copiedAt: now,
          isFavorite: false,
          sourceApp,
          charCount,
          lineCount,
          detectedLanguage: detectLanguage(text),
        };

        set((state) => ({
          items: [newItem, ...state.items.filter((i) => i.text !== text)],
        }));
        window.electronApi?.addClipboardItem({ text, sourceApp, detectedLanguage: detectLanguage(text) });
      },

      removeClipboardItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      clearClipboardHistory: () => {
        set({ items: [] });
      },

      toggleWatcher: () => {
        set((state) => ({ isWatcherActive: !state.isWatcherActive }));
      },

      toggleFavoriteClipboard: (id) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, isFavorite: !i.isFavorite } : i
          ),
        }));
      },
    }),
    {
      name: 'clipvault-clipboard-storage',
    }
  )
);
