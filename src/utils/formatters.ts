import { LanguageType } from '../types';

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export interface LanguageMeta {
  label: string;
  color: string;
  monacoLang: string;
}

export const LANGUAGE_META: Record<LanguageType, LanguageMeta> = {
  typescript: { label: 'TypeScript', color: '#3178C6', monacoLang: 'typescript' },
  javascript: { label: 'JavaScript', color: '#F7DF1E', monacoLang: 'javascript' },
  python: { label: 'Python', color: '#3776AB', monacoLang: 'python' },
  bash: { label: 'Shell', color: '#4E5D6C', monacoLang: 'shell' },
  sql: { label: 'SQL', color: '#336791', monacoLang: 'sql' },
  dockerfile: { label: 'Dockerfile', color: '#2496ED', monacoLang: 'dockerfile' },
  json: { label: 'JSON', color: '#292929', monacoLang: 'json' },
  yaml: { label: 'YAML', color: '#CB171E', monacoLang: 'yaml' },
  html: { label: 'HTML', color: '#E34F26', monacoLang: 'html' },
  css: { label: 'CSS', color: '#1572B6', monacoLang: 'css' },
  java: { label: 'Java', color: '#B07219', monacoLang: 'java' },
  cpp: { label: 'C++', color: '#f34b7d', monacoLang: 'cpp' },
  go: { label: 'Go', color: '#00ADD8', monacoLang: 'go' },
  rust: { label: 'Rust', color: '#dea584', monacoLang: 'rust' },
  markdown: { label: 'Markdown', color: '#083fa1', monacoLang: 'markdown' },
};
