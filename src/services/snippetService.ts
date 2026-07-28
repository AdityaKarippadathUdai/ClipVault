import { Snippet } from '../types';

export const snippetService = {
  filterSnippets(
    snippets: Snippet[],
    query: string,
    selectedFolderId: string | null,
    activeNavigation: string
  ): Snippet[] {
    return snippets.filter((s) => {
      // Navigation filtering
      if (activeNavigation === 'trash') {
        if (!s.isTrashed) return false;
      } else {
        if (s.isTrashed) return false;
        if (activeNavigation === 'favorites' && !s.isFavorite) return false;
        if (selectedFolderId && s.folderId !== selectedFolderId) return false;
      }

      // Query search
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.content.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  },

  sortSnippets(snippets: Snippet[], sortBy: 'title' | 'updatedAt' | 'createdAt'): Snippet[] {
    return [...snippets].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'createdAt') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  },
};
