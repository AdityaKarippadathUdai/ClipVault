import React, { useRef, useEffect } from 'react';
import { Search, X, Command } from 'lucide-react';
import { useSnippetStore } from '../../store/useSnippetStore';

interface SearchBarProps {
  placeholder?: string;
  onCommandKClick?: () => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search snippets, tags, code, language...',
  onCommandKClick,
  className = '',
}) => {
  const { searchQuery, setSearchQuery } = useSnippetStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <Search className="absolute left-3 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-20 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-md border border-slate-200 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
      />
      {searchQuery ? (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-12 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
          title="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      ) : null}
      
      {onCommandKClick && (
        <button
          onClick={onCommandKClick}
          className="absolute right-2 px-1.5 py-0.5 flex items-center gap-1 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-200 dark:bg-slate-700/50 rounded border border-slate-300/50 dark:border-slate-600/40 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
          title="Open Command Palette (⌘K)"
        >
          <Command className="w-2.5 h-2.5" />
          <span>K</span>
        </button>
      )}
    </div>
  );
};
