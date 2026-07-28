import { LanguageMeta } from '../types';

export const LANGUAGE_META: Record<string, LanguageMeta> = {
  javascript: { label: 'JavaScript', extension: '.js', color: '#f7df1e' },
  typescript: { label: 'TypeScript', extension: '.ts', color: '#3178c6' },
  python: { label: 'Python', extension: '.py', color: '#3572A5' },
  html: { label: 'HTML', extension: '.html', color: '#e34c26' },
  css: { label: 'CSS', extension: '.css', color: '#563d7c' },
  json: { label: 'JSON', extension: '.json', color: '#292929' },
  sql: { label: 'SQL', extension: '.sql', color: '#e38c00' },
  shell: { label: 'Shell / Bash', extension: '.sh', color: '#89e051' },
  markdown: { label: 'Markdown', extension: '.md', color: '#083fa1' },
  yaml: { label: 'YAML', extension: '.yaml', color: '#cb171e' },
  rust: { label: 'Rust', extension: '.rs', color: '#dea584' },
  go: { label: 'Go', extension: '.go', color: '#00ADD8' },
  csharp: { label: 'C#', extension: '.cs', color: '#178600' },
  cpp: { label: 'C++', extension: '.cpp', color: '#f34b7d' },
};
