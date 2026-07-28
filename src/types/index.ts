export interface LanguageMeta {
  label: string;
  color: string;
  icon?: string;
  extension?: string;
}

export type LanguageType =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'bash'
  | 'sql'
  | 'dockerfile'
  | 'json'
  | 'yaml'
  | 'html'
  | 'css'
  | 'java'
  | 'cpp'
  | 'go'
  | 'rust'
  | 'markdown';

export interface Snippet {
  id: string;
  title: string;
  content: string;
  description?: string;
  language: LanguageType;
  folderId: string | null;
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
  isTrashed: boolean;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  icon?: string;
  color?: string;
  isExpanded?: boolean;
}

export interface ClipboardItem {
  id: string;
  text: string;
  type: 'code' | 'text' | 'url' | 'json';
  copiedAt: string;
  isFavorite: boolean;
  sourceApp?: string;
  charCount: number;
  lineCount: number;
  detectedLanguage?: LanguageType;
}

export type ThemeMode = 'dark' | 'light' | 'vscode' | 'monokai';

export interface Settings {
  theme: ThemeMode;
  autoWatchClipboard: boolean;
  maxClipboardItems: number;
  editorFontSize: number;
  editorWordWrap: 'on' | 'off';
  defaultLanguage: LanguageType;
  hotkeyPrefix: string;
  soundEffects: boolean;
  clearTrashOnExit: boolean;
}

export type ViewMode = 'grid' | 'list';
export type ActiveNavigation = 'dashboard' | 'favorites' | 'recent' | 'clipboard' | 'trash' | 'settings';
export type SortOption = 'updatedAt' | 'title' | 'language' | 'usageCount';
export type SortOrder = 'asc' | 'desc';
