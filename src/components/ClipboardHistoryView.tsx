import React, { useState } from 'react';
import {
  ClipboardList,
  Copy,
  Check,
  Plus,
  Trash2,
  Search,
  Code,
  Link,
  FileJson,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { useClipboardStore } from '../store/useClipboardStore';
import { useSnippetStore } from '../store/useSnippetStore';
import { formatRelativeTime, LANGUAGE_META } from '../utils/formatters';

export const ClipboardHistoryView: React.FC = () => {
  const { items, removeClipboardItem, clearClipboardHistory } = useClipboardStore();
  const { addSnippet, setActiveNavigation } = useSnippetStore();

  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (search.trim()) {
      return item.text.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleConvertToSnippet = (text: string, lang?: string) => {
    const lines = text.trim().split('\n');
    const firstLine = lines[0].slice(0, 40) || 'Clipboard Snippet';
    addSnippet({
      title: firstLine,
      content: text,
      language: (lang as any) || 'typescript',
      folderId: null,
      tags: ['clipboard', 'quick-save'],
      isFavorite: false,
      isPinned: false,
      isTrashed: false,
    });
    setActiveNavigation('dashboard');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/40 border-r border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Clipboard Manager
              <span className="px-2 py-0.2 text-[10px] font-mono rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">
                {items.length} clips
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">Captured text and code fragments from system clipboard</p>
          </div>
        </div>

        <button
          onClick={clearClipboardHistory}
          disabled={items.length === 0}
          className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition self-start sm:self-auto flex items-center gap-1.5 disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="px-4 py-2 bg-slate-100/70 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1">
          {[
            { id: 'all', label: 'All Clips' },
            { id: 'code', label: 'Code' },
            { id: 'json', label: 'JSON' },
            { id: 'url', label: 'Links' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                filterType === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-48">
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clipboard..."
            className="w-full pl-8 pr-2 py-1 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-md focus:outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <ClipboardList className="w-10 h-10 mb-2 stroke-[1.5] text-slate-300 dark:text-slate-700" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No clipboard items captured yet
            </p>
            <p className="text-xs max-w-xs mt-1">
              Copy any code, text, or JSON anywhere on your system to view it listed here.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col gap-2"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-100 dark:border-slate-800/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.2 rounded font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 font-semibold uppercase text-[9px]">
                    {item.type}
                  </span>
                  <span>{item.sourceApp || 'Clipboard'}</span>
                  <span>• {item.lineCount} lines ({item.charCount} chars)</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px]">
                    {formatRelativeTime(item.copiedAt)}
                  </span>
                  <button
                    onClick={() => removeClipboardItem(item.id)}
                    className="hover:text-red-500 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Code/Text Content */}
              <pre className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 line-clamp-4 whitespace-pre-wrap break-all">
                {item.text}
              </pre>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => handleConvertToSnippet(item.text, item.detectedLanguage)}
                  className="px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Convert to Saved Snippet</span>
                </button>

                <button
                  onClick={() => handleCopy(item.id, item.text)}
                  className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition flex items-center gap-1"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === item.id ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
