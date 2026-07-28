import React, { useMemo } from 'react';
import {
  Grid,
  List,
  ArrowUpDown,
  Plus,
  SearchX
} from 'lucide-react';
import { useSnippetStore } from '../../store/useSnippetStore';
import { useFolderStore } from '../../store/useFolderStore';
import { SnippetCard } from './SnippetCard';
import { Snippet, SortOption, LanguageType } from '../../types';
import { LANGUAGE_META } from '../../utils/formatters';

interface SnippetGridProps {
  onSnippetContextMenu?: (e: React.MouseEvent, snippet: Snippet) => void;
}

export const SnippetGrid: React.FC<SnippetGridProps> = ({
  onSnippetContextMenu,
}) => {
  const {
    snippets,
    selectedSnippetId,
    selectSnippet,
    searchQuery,
    selectedFolderId,
    selectedTag,
    setSelectedTag,
    selectedLanguage,
    setSelectedLanguage,
    viewMode,
    setViewMode,
    sortOption,
    setSortOption,
    sortOrder,
    setSortOrder,
    activeNavigation,
    addSnippet,
  } = useSnippetStore();

  const { folders } = useFolderStore();

  const folderBreadcrumbs = useMemo(() => {
    if (!selectedFolderId) return ['Workspace'];
    const path: string[] = [];
    let currentId: string | null = selectedFolderId;

    while (currentId) {
      const folder = folders.find((f) => f.id === currentId);
      if (folder) {
        path.unshift(folder.name);
        currentId = folder.parentId;
      } else {
        break;
      }
    }
    return ['Workspace', ...path];
  }, [selectedFolderId, folders]);

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    snippets.forEach((s) => !s.isTrashed && s.tags.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [snippets]);

  const filteredSnippets = useMemo(() => {
    return snippets.filter((s) => {
      if (activeNavigation === 'trash') {
        if (!s.isTrashed) return false;
      } else {
        if (s.isTrashed) return false;
      }

      if (activeNavigation === 'favorites' && !s.isFavorite) return false;

      if (selectedFolderId) {
        const getDescendantFolderIds = (id: string): string[] => {
          const children = folders.filter((f) => f.parentId === id);
          return [id, ...children.flatMap((c) => getDescendantFolderIds(c.id))];
        };
        const allowedFolderIds = getDescendantFolderIds(selectedFolderId);
        if (!s.folderId || !allowedFolderIds.includes(s.folderId)) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = s.title.toLowerCase().includes(q);
        const matchesContent = s.content.toLowerCase().includes(q);
        const matchesDescription = s.description?.toLowerCase().includes(q) || false;
        const matchesTags = s.tags.some((t) => t.toLowerCase().includes(q));
        const matchesLang = s.language.toLowerCase().includes(q);
        if (!matchesTitle && !matchesContent && !matchesDescription && !matchesTags && !matchesLang) {
          return false;
        }
      }

      if (selectedTag && !s.tags.includes(selectedTag)) return false;
      if (selectedLanguage && s.language !== selectedLanguage) return false;

      return true;
    });
  }, [snippets, activeNavigation, selectedFolderId, folders, searchQuery, selectedTag, selectedLanguage]);

  const sortedSnippets = useMemo(() => {
    const sorted = [...filteredSnippets].sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }

      let comparison = 0;
      if (sortOption === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortOption === 'language') {
        comparison = a.language.localeCompare(b.language);
      } else if (sortOption === 'usageCount') {
        comparison = b.usageCount - a.usageCount;
      } else {
        comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }

      return sortOrder === 'asc' ? comparison * -1 : comparison;
    });
    return sorted;
  }, [filteredSnippets, sortOption, sortOrder]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50 dark:bg-slate-950/40 border-r border-slate-200 dark:border-slate-800">
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
            {folderBreadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb}>
                {idx > 0 && <span className="text-slate-300 dark:text-slate-700">/</span>}
                <span className={idx === folderBreadcrumbs.length - 1 ? 'text-slate-800 dark:text-slate-200 font-semibold' : ''}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
            <span className="ml-2 px-1.5 py-0.2 text-[10px] rounded-full bg-slate-100 dark:bg-slate-800 font-mono text-slate-500">
              {sortedSnippets.length}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md border border-slate-200 dark:border-slate-700/60">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="bg-transparent text-[11px] text-slate-700 dark:text-slate-200 font-medium px-1 py-0.5 focus:outline-none"
              >
                <option value="updatedAt">Updated</option>
                <option value="title">Title</option>
                <option value="language">Language</option>
                <option value="usageCount">Popularity</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
              >
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md border border-slate-200 dark:border-slate-700/60">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded transition ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="Grid view"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded transition ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="List view"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
          {selectedTag || selectedLanguage ? (
            <button
              onClick={() => {
                setSelectedTag(null);
                setSelectedLanguage(null);
              }}
              className="px-2 py-0.5 text-[10px] font-medium bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-md border border-red-200 dark:border-red-900/50 hover:bg-red-200 dark:hover:bg-red-900/50 transition shrink-0"
            >
              Clear Filters ✕
            </button>
          ) : null}

          {['typescript', 'python', 'bash', 'sql', 'dockerfile'].map((lang) => {
            const isSel = selectedLanguage === lang;
            const meta = LANGUAGE_META[lang as LanguageType];
            return (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(isSel ? null : lang)}
                className={`px-2 py-0.5 text-[11px] rounded-md font-mono transition shrink-0 ${
                  isSel
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/80'
                }`}
              >
                {meta?.label || lang}
              </button>
            );
          })}

          <div className="h-3 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 shrink-0" />

          {allTags.slice(0, 6).map((tag) => {
            const isSel = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isSel ? null : tag)}
                className={`px-2 py-0.5 text-[10px] rounded-md transition shrink-0 ${
                  isSel
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {sortedSnippets.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
            <SearchX className="w-10 h-10 mb-3 text-slate-300 dark:text-slate-600 stroke-[1.5]" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              No snippets found
            </p>
            <p className="text-xs max-w-xs mb-4">
              Try clearing search filters or create a new snippet in this workspace.
            </p>
            <button
              onClick={() => {
                addSnippet({
                  title: 'New Snippet',
                  content: '// Paste code snippet here\n',
                  language: 'typescript',
                  folderId: selectedFolderId,
                  tags: ['code'],
                  isFavorite: false,
                  isPinned: false,
                  isTrashed: false,
                });
              }}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-500 transition shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Snippet
            </button>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3'
                : 'flex flex-col gap-2'
            }
          >
            {sortedSnippets.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                viewMode={viewMode}
                isSelected={selectedSnippetId === snippet.id}
                onSelect={() => selectSnippet(snippet.id)}
                onContextMenu={onSnippetContextMenu}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
