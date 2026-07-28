import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  count?: number;
  isActive?: boolean;
  onClick: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  count,
  isActive = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition ${
        isActive
          ? 'bg-blue-600/15 text-blue-600 dark:text-blue-400 font-semibold'
          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/60'
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
        <span>{label}</span>
      </div>
      {count !== undefined && (
        <span
          className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono ${
            isActive
              ? 'bg-blue-600/20 text-blue-600 dark:text-blue-300'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};
