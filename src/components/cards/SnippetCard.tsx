import React from 'react';
import { Star, Pin, Copy, Check } from 'lucide-react';
import { Snippet, ViewMode } from '../../types';
import { formatRelativeTime, LANGUAGE_META } from '../../utils/formatters';
import { useSnippetStore } from '../../store/useSnippetStore';

interface SnippetCardProps {
  snippet: Snippet;
  viewMode: ViewMode;
  isSelected: boolean;
  onSelect: () => void;
  onContextMenu?: (e: React.MouseEvent, snippet: Snippet) => void;
}

export const SnippetCard: React.FC<SnippetCardProps> = ({
  snippet,
  viewMode,
  isSelected,
  onSelect,
  onContextMenu,
}) => {
  const { toggleFavorite, togglePin, incrementUsage } = useSnippetStore();
  const [copied, setCopied] = React.useState(false);

  const langMeta = LANGUAGE_META[snippet.language] || {
    label: snippet.language,
    color: '#64748b',
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(snippet.content);
    incrementUsage(snippet.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(snippet.id);
  };

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePin(snippet.id);
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={onSelect}
        onContextMenu={(e) => {
          e.preventDefault();
          onContextMenu?.(e, snippet);
        }}
        className={`group relative flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all select-none ${
          isSelected
            ? 'bg-blue-600/10 border-blue-500/60 dark:border-blue-500/80 shadow-sm'
            : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
          <button
            onClick={handlePinClick}
            className={`p-1 rounded transition ${
              snippet.isPinned
                ? 'text-amber-500'
                : 'text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400'
            }`}
            title={snippet.isPinned ? 'Unpin snippet' : 'Pin snippet'}
          >
            <Pin className={`w-3.5 h-3.5 ${snippet.isPinned ? 'fill-amber-500' : ''}`} />
          </button>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                {snippet.title}
              </span>
              <span
                className="px-1.5 py-0.2 text-[9px] font-mono rounded font-medium shrink-0"
                style={{
                  backgroundColor: `${langMeta.color}18`,
                  color: langMeta.color,
                  border: `1px solid ${langMeta.color}35`,
                }}
              >
                {langMeta.label}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {snippet.content.split('\n')[0]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {snippet.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700/60"
            >
              #{tag}
            </span>
          ))}

          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            {formatRelativeTime(snippet.updatedAt)}
          </span>

          <button
            onClick={handleFavoriteClick}
            className={`p-1 rounded transition ${
              snippet.isFavorite
                ? 'text-amber-400'
                : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${snippet.isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
            title="Copy snippet"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onSelect}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu?.(e, snippet);
      }}
      className={`group relative flex flex-col justify-between p-3.5 rounded-xl border text-xs cursor-pointer transition-all select-none h-44 overflow-hidden ${
        isSelected
          ? 'bg-blue-600/10 border-blue-500/70 dark:border-blue-500/90 shadow-md ring-1 ring-blue-500/30'
          : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-blue-400/50 dark:hover:border-slate-700 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            onClick={handlePinClick}
            className={`p-0.5 rounded transition ${
              snippet.isPinned
                ? 'text-amber-500'
                : 'text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 opacity-0 group-hover:opacity-100'
            }`}
            title={snippet.isPinned ? 'Unpin snippet' : 'Pin snippet'}
          >
            <Pin className={`w-3.5 h-3.5 ${snippet.isPinned ? 'fill-amber-500' : ''}`} />
          </button>
          <span className="font-semibold text-slate-900 dark:text-slate-100 truncate text-sm">
            {snippet.title}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleFavoriteClick}
            className={`p-1 rounded transition ${
              snippet.isFavorite
                ? 'text-amber-400'
                : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'
            }`}
            title={snippet.isFavorite ? 'Remove favorite' : 'Add to favorites'}
          >
            <Star className={`w-3.5 h-3.5 ${snippet.isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="my-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800/80 font-mono text-[11px] text-slate-600 dark:text-slate-300 overflow-hidden flex-1 leading-snug">
        <pre className="line-clamp-3 whitespace-pre-wrap break-all font-mono">
          {snippet.content}
        </pre>
      </div>

      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/50 text-[10px]">
        <div className="flex items-center gap-1.5 overflow-hidden min-w-0">
          <span
            className="px-1.5 py-0.2 rounded font-mono font-medium shrink-0"
            style={{
              backgroundColor: `${langMeta.color}18`,
              color: langMeta.color,
              border: `1px solid ${langMeta.color}30`,
            }}
          >
            {langMeta.label}
          </span>

          {snippet.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="truncate px-1.5 py-0.2 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/70 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>

        <span className="text-slate-400 dark:text-slate-500 font-mono shrink-0">
          {formatRelativeTime(snippet.updatedAt)}
        </span>
      </div>
    </div>
  );
};
