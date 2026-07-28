import React from 'react';
import { Copy, Check, CopyPlus, Save, Trash2 } from 'lucide-react';

interface EditorToolbarProps {
  copied: boolean;
  saved: boolean;
  isTrashed: boolean;
  onCopy: () => void;
  onDuplicate: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  copied,
  saved,
  isTrashed,
  onCopy,
  onDuplicate,
  onSave,
  onDelete,
}) => {
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={onCopy}
        className="h-8 px-2.5 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/60 flex items-center gap-1.5 transition"
        title="Copy code to clipboard"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>

      <button
        onClick={onDuplicate}
        className="h-8 p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60 transition"
        title="Duplicate snippet"
      >
        <CopyPlus className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={onSave}
        className="h-8 px-3 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-500 transition shadow-sm flex items-center gap-1.5"
      >
        {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
        <span>{saved ? 'Saved!' : 'Save'}</span>
      </button>

      <button
        onClick={onDelete}
        className="h-8 p-2 rounded-md bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-900/40 transition"
        title={isTrashed ? 'Delete permanently' : 'Move to trash'}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
