import React from 'react';
import { Pin, Star } from 'lucide-react';
import { Snippet } from '../../types';

interface EditorHeaderProps {
  snippet: Snippet;
  onTogglePin: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  snippet,
  onTogglePin,
  onToggleFavorite,
}) => {
  return (
    <div className="flex items-center gap-1.5 min-w-0">
      <button
        onClick={() => onTogglePin(snippet.id)}
        className={`p-1.5 rounded-md transition ${
          snippet.isPinned
            ? 'text-amber-500 bg-amber-500/10'
            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
        title={snippet.isPinned ? 'Unpin snippet' : 'Pin snippet'}
      >
        <Pin className={`w-4 h-4 ${snippet.isPinned ? 'fill-amber-500' : ''}`} />
      </button>

      <button
        onClick={() => onToggleFavorite(snippet.id)}
        className={`p-1.5 rounded-md transition ${
          snippet.isFavorite
            ? 'text-amber-400 bg-amber-400/10'
            : 'text-slate-400 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
        title={snippet.isFavorite ? 'Remove favorite' : 'Add favorite'}
      >
        <Star className={`w-4 h-4 ${snippet.isFavorite ? 'fill-amber-400' : ''}`} />
      </button>

      <span className="text-xs text-slate-400 font-mono truncate hidden sm:inline">
        ID: {snippet.id}
      </span>
    </div>
  );
};
