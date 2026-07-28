import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import {
  Copy,
  Check,
  Trash2,
  Star,
  Pin,
  Folder as FolderIcon,
  Save,
  CopyPlus,
  Wand2,
  Maximize2,
  Minimize2,
  Code2
} from 'lucide-react';
import { useSnippetStore } from '../store/useSnippetStore';
import { useFolderStore } from '../store/useFolderStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { LanguageType, Snippet } from '../types';
import { LANGUAGE_META } from '../utils/formatters';
import { TagInput } from './TagInput';

export const SnippetEditor: React.FC = () => {
  const {
    snippets,
    selectedSnippetId,
    updateSnippet,
    deleteSnippet,
    duplicateSnippet,
    toggleFavorite,
    togglePin,
    incrementUsage,
  } = useSnippetStore();

  const { folders } = useFolderStore();
  const { settings } = useSettingsStore();

  const currentSnippet = snippets.find((s) => s.id === selectedSnippetId);

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [panelWidth, setPanelWidth] = useState(520);
  const [isResizing, setIsResizing] = useState(false);

  const [localTitle, setLocalTitle] = useState('');
  const [localContent, setLocalContent] = useState('');
  const [localLanguage, setLocalLanguage] = useState<LanguageType>('typescript');
  const [localFolderId, setLocalFolderId] = useState<string | null>(null);
  const [localTags, setLocalTags] = useState<string[]>([]);

  // Sync local fields when selected snippet changes
  useEffect(() => {
    if (currentSnippet) {
      setLocalTitle(currentSnippet.title);
      setLocalContent(currentSnippet.content);
      setLocalLanguage(currentSnippet.language);
      setLocalFolderId(currentSnippet.folderId);
      setLocalTags(currentSnippet.tags);
    }
  }, [currentSnippet?.id]);

  if (!currentSnippet) {
    return (
      <div className="w-[500px] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-8 text-center text-slate-400 dark:text-slate-500 select-none">
        <Code2 className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-700 stroke-[1.5]" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
          No Snippet Selected
        </p>
        <p className="text-xs max-w-xs">
          Select a snippet from the list or create a new one to start editing in Monaco Editor.
        </p>
      </div>
    );
  }

  const handleSave = () => {
    if (!currentSnippet) return;
    updateSnippet(currentSnippet.id, {
      title: localTitle || 'Untitled Snippet',
      content: localContent,
      language: localLanguage,
      folderId: localFolderId,
      tags: localTags,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(localContent);
    incrementUsage(currentSnippet.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Drag handle to resize right editor panel
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = panelWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(380, Math.min(800, startWidth - (moveEvent.clientX - startX)));
      setPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const monacoTheme = settings.theme === 'light' ? 'vs-light' : 'vs-dark';

  return (
    <aside
      className="relative flex flex-col border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 select-none z-10 shrink-0 h-full overflow-hidden"
      style={{ width: `${panelWidth}px` }}
    >
      {/* Resizable handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/50 transition z-20 ${
          isResizing ? 'bg-blue-500' : ''
        }`}
      />

      {/* Editor Top Bar Actions */}
      <div className="h-12 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-900/80 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            onClick={() => togglePin(currentSnippet.id)}
            className={`p-1.5 rounded-md transition ${
              currentSnippet.isPinned
                ? 'text-amber-500 bg-amber-500/10'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={currentSnippet.isPinned ? 'Unpin snippet' : 'Pin snippet'}
          >
            <Pin className={`w-4 h-4 ${currentSnippet.isPinned ? 'fill-amber-500' : ''}`} />
          </button>

          <button
            onClick={() => toggleFavorite(currentSnippet.id)}
            className={`p-1.5 rounded-md transition ${
              currentSnippet.isFavorite
                ? 'text-amber-400 bg-amber-400/10'
                : 'text-slate-400 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={currentSnippet.isFavorite ? 'Remove favorite' : 'Add favorite'}
          >
            <Star className={`w-4 h-4 ${currentSnippet.isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          <span className="text-xs text-slate-400 font-mono truncate hidden sm:inline">
            ID: {currentSnippet.id}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="h-8 px-2.5 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/60 flex items-center gap-1.5 transition"
            title="Copy code to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => duplicateSnippet(currentSnippet.id)}
            className="h-8 p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60 transition"
            title="Duplicate snippet"
          >
            <CopyPlus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleSave}
            className="h-8 px-3 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-500 transition shadow-sm flex items-center gap-1.5"
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saved ? 'Saved!' : 'Save'}</span>
          </button>

          <button
            onClick={() => deleteSnippet(currentSnippet.id, currentSnippet.isTrashed)}
            className="h-8 p-2 rounded-md bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-900/40 transition"
            title={currentSnippet.isTrashed ? 'Delete permanently' : 'Move to trash'}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Title & Metadata Inputs */}
      <div className="p-4 space-y-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
        {/* Title Field */}
        <input
          type="text"
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          placeholder="Snippet Title..."
          className="w-full text-base font-bold bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none"
        />

        {/* Folder & Language Selectors */}
        <div className="grid grid-cols-2 gap-2">
          {/* Folder Select */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
            <FolderIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <select
              value={localFolderId || ''}
              onChange={(e) => setLocalFolderId(e.target.value || null)}
              className="w-full bg-transparent text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
            >
              <option value="">(No Folder / Root)</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.parentId ? `└ ${f.name}` : f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Language Select */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
            <Code2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <select
              value={localLanguage}
              onChange={(e) => setLocalLanguage(e.target.value as LanguageType)}
              className="w-full bg-transparent text-slate-700 dark:text-slate-200 font-medium focus:outline-none font-mono"
            >
              {Object.entries(LANGUAGE_META).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags Editor */}
        <TagInput tags={localTags} onChange={setLocalTags} />
      </div>

      {/* Large Monaco Editor Container */}
      <div className="flex-1 relative bg-slate-950/90 overflow-hidden min-h-0">
        <Editor
          height="100%"
          language={LANGUAGE_META[localLanguage]?.monacoLang || 'plaintext'}
          theme={monacoTheme}
          value={localContent}
          onChange={(val) => setLocalContent(val || '')}
          options={{
            fontSize: settings.editorFontSize || 14,
            wordWrap: settings.editorWordWrap || 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
            lineNumbersMinChars: 3,
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </aside>
  );
};
