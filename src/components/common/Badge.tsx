import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'amber' | 'emerald' | 'gray' | 'purple';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  className = '',
}) => {
  const variants = {
    blue: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50',
    amber: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
    gray: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/50',
    purple: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/50',
  };

  return (
    <span
      className={`px-1.5 py-0.5 text-[10px] font-mono font-medium rounded border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
