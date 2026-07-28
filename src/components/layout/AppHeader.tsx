import React from 'react';
import { Code2 } from 'lucide-react';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title = 'ClipVault',
  subtitle = 'DESKTOP',
  children,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-sm text-white font-bold text-xs">
          <Code2 className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-semibold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            {title}
            {subtitle && (
              <span className="px-1 py-0.2 text-[9px] font-mono font-medium rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
                {subtitle}
              </span>
            )}
          </span>
        </div>
      </div>
      {children}
    </div>
  );
};
