import { ClipboardItem } from '../types';

export const initialClipboardItems: ClipboardItem[] = [
  {
    id: 'clip-1',
    text: 'const apiKey = process.env.GEMINI_API_KEY;',
    type: 'code',
    copiedAt: '2026-07-28T09:40:00Z',
    isFavorite: true,
    sourceApp: 'VS Code',
    charCount: 42,
    lineCount: 1,
    detectedLanguage: 'typescript'
  },
  {
    id: 'clip-2',
    text: 'docker run -d -p 8080:80 nginx:latest',
    type: 'code',
    copiedAt: '2026-07-28T09:32:00Z',
    isFavorite: false,
    sourceApp: 'Terminal',
    charCount: 37,
    lineCount: 1,
    detectedLanguage: 'bash'
  },
  {
    id: 'clip-3',
    text: '{"status": 200, "message": "Clipboard history synced successfully"}',
    type: 'json',
    copiedAt: '2026-07-28T09:25:00Z',
    isFavorite: true,
    sourceApp: 'Chrome',
    charCount: 68,
    lineCount: 1,
    detectedLanguage: 'json'
  },
  {
    id: 'clip-4',
    text: 'https://github.com/google-gemini/generative-ai-js',
    type: 'url',
    copiedAt: '2026-07-28T09:10:00Z',
    isFavorite: false,
    sourceApp: 'Arc Browser',
    charCount: 49,
    lineCount: 1
  },
  {
    id: 'clip-5',
    text: 'git commit -m "feat: add nested folders and instant snippet search"',
    type: 'code',
    copiedAt: '2026-07-28T08:50:00Z',
    isFavorite: false,
    sourceApp: 'iTerm2',
    charCount: 67,
    lineCount: 1,
    detectedLanguage: 'bash'
  }
];
