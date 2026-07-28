import React, { useState } from 'react';
import { Tag as TagIcon, X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export const TagInput: React.FC<TagInputProps> = ({ tags, onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim().replace(/^#/, '');
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg min-h-[36px]">
      <TagIcon className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 rounded-md"
        >
          #{tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="hover:text-red-500 rounded p-0.5"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? 'Add tags (press Enter or comma)...' : '+ tag'}
        className="flex-1 min-w-[100px] bg-transparent text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none px-1"
      />
    </div>
  );
};
