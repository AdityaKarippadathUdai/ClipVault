import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Folder as FolderIcon, Code2 } from 'lucide-react';
import { useSnippetStore } from '../../store/useSnippetStore';
import { useFolderStore } from '../../store/useFolderStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { LanguageType } from '../../types';
import { LANGUAGE_META } from '../../utils/formatters';
import { TagInput } from '../common/TagInput';
import { EditorHeader } from './EditorHeader';
import { EditorToolbar } from './EditorToolbar';

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
      <div
        onMouseDown={handleMouseDown}
        className={`absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/50 transition z-20 ${
          isResizing ? 'bg-blue-500' : ''
        }`}
      />

      <div className="h-12 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-900/80 shrink-0">
        <EditorHeader
          snippet={currentSnippet}
          onTogglePin={togglePin}
          onToggleFavorite={toggleFavorite}
        />
        <EditorToolbar
          copied={copied}
          saved={saved}
          isTrashed={currentSnippet.isTrashed}
          onCopy={handleCopy}
          onDuplicate={() => duplicateSnippet(currentSnippet.id)}
          onSave={handleSave}
          onDelete={() => deleteSnippet(currentSnippet.id, currentSnippet.isTrashed)}
        />
      </div>

      <div className="p-4 space-y-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <input
          type="text"
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          placeholder="Snippet Title..."
          className="w-full text-base font-bold bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none"
        />

        <div className="grid grid-cols-2 gap-2">
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

        <TagInput tags={localTags} onChange={setLocalTags} />
      </div>

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
