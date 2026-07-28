import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Snippet, ViewMode, ActiveNavigation, SortOption, SortOrder, LanguageType } from '../types';
import { initialSnippets } from '../data/mockSnippets';

const defaultInitialSnippets = initialSnippets;

interface SnippetState {
  snippets: Snippet[];
  selectedSnippetId: string | null;
  searchQuery: string;
  selectedFolderId: string | null;
  selectedTag: string | null;
  selectedLanguage: string | null;
  viewMode: ViewMode;
  sortOption: SortOption;
  sortOrder: SortOrder;
  activeNavigation: ActiveNavigation;

  // Actions
  addSnippet: (snippet: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => string;
  updateSnippet: (id: string, updates: Partial<Snippet>) => void;
  deleteSnippet: (id: string, permanent?: boolean) => void;
  restoreSnippet: (id: string) => void;
  toggleFavorite: (id: string) => void;
  togglePin: (id: string) => void;
  selectSnippet: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedFolderId: (folderId: string | null) => void;
  setSelectedTag: (tag: string | null) => void;
  setSelectedLanguage: (lang: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setSortOption: (option: SortOption) => void;
  setSortOrder: (order: SortOrder) => void;
  setActiveNavigation: (nav: ActiveNavigation) => void;
  duplicateSnippet: (id: string) => void;
  moveSnippetToFolder: (snippetId: string, folderId: string | null) => void;
  incrementUsage: (id: string) => void;
  emptyTrash: () => void;
}

export const useSnippetStore = create<SnippetState>()(
  persist(
    (set, get) => ({
      snippets: defaultInitialSnippets,
      selectedSnippetId: 'snip-1',
      searchQuery: '',
      selectedFolderId: null,
      selectedTag: null,
      selectedLanguage: null,
      viewMode: 'grid',
      sortOption: 'updatedAt',
      sortOrder: 'desc',
      activeNavigation: 'dashboard',

      addSnippet: (snippetData) => {
        const newId = `snip-${Date.now()}`;
        const now = new Date().toISOString();
        const newSnippet: Snippet = {
          ...snippetData,
          id: newId,
          createdAt: now,
          updatedAt: now,
          usageCount: 0,
        };
        set((state) => ({
          snippets: [newSnippet, ...state.snippets],
          selectedSnippetId: newId,
        }));
        window.electronApi?.addClipboardItem({ text: newSnippet.content, sourceApp: 'ClipVault' });
        return newId;
      },

      updateSnippet: (id, updates) => {
        const now = new Date().toISOString();
        set((state) => ({
          snippets: state.snippets.map((s) =>
            s.id === id ? { ...s, ...updates, updatedAt: now } : s
          ),
        }));
      },

      deleteSnippet: (id, permanent = false) => {
        set((state) => {
          if (permanent) {
            const remaining = state.snippets.filter((s) => s.id !== id);
            return {
              snippets: remaining,
              selectedSnippetId: state.selectedSnippetId === id ? (remaining[0]?.id || null) : state.selectedSnippetId,
            };
          } else {
            return {
              snippets: state.snippets.map((s) =>
                s.id === id ? { ...s, isTrashed: true, updatedAt: new Date().toISOString() } : s
              ),
            };
          }
        });
      },

      restoreSnippet: (id) => {
        set((state) => ({
          snippets: state.snippets.map((s) =>
            s.id === id ? { ...s, isTrashed: false, updatedAt: new Date().toISOString() } : s
          ),
        }));
      },

      toggleFavorite: (id) => {
        set((state) => ({
          snippets: state.snippets.map((s) =>
            s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
          ),
        }));
      },

      togglePin: (id) => {
        set((state) => ({
          snippets: state.snippets.map((s) =>
            s.id === id ? { ...s, isPinned: !s.isPinned } : s
          ),
        }));
      },

      selectSnippet: (id) => set({ selectedSnippetId: id }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedFolderId: (folderId) => set({ selectedFolderId: folderId, activeNavigation: 'dashboard' }),
      setSelectedTag: (tag) => set({ selectedTag: tag }),
      setSelectedLanguage: (lang) => set({ selectedLanguage: lang }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setSortOption: (option) => set({ sortOption: option }),
      setSortOrder: (order) => set({ sortOrder: order }),
      setActiveNavigation: (nav) => set({ activeNavigation: nav, selectedFolderId: nav === 'dashboard' ? get().selectedFolderId : null }),

      duplicateSnippet: (id) => {
        const snippet = get().snippets.find((s) => s.id === id);
        if (!snippet) return;
        const now = new Date().toISOString();
        const dup: Snippet = {
          ...snippet,
          id: `snip-${Date.now()}`,
          title: `${snippet.title} (Copy)`,
          createdAt: now,
          updatedAt: now,
          usageCount: 0,
        };
        set((state) => ({
          snippets: [dup, ...state.snippets],
          selectedSnippetId: dup.id,
        }));
      },

      moveSnippetToFolder: (snippetId, folderId) => {
        get().updateSnippet(snippetId, { folderId });
      },

      incrementUsage: (id) => {
        set((state) => ({
          snippets: state.snippets.map((s) =>
            s.id === id ? { ...s, usageCount: s.usageCount + 1 } : s
          ),
        }));
      },

      emptyTrash: () => {
        set((state) => ({
          snippets: state.snippets.filter((s) => !s.isTrashed),
        }));
      },
    }),
    {
      name: 'clipvault-snippets-storage',
    }
  )
);
