import { ClipboardItem } from '../types';

export const clipboardService = {
  copyToClipboard(text: string): Promise<boolean> {
    if (!navigator.clipboard) return Promise.resolve(false);
    return navigator.clipboard
      .writeText(text)
      .then(() => true)
      .catch((err) => {
        console.error('Failed to copy text: ', err);
        return false;
      });
  },

  formatClipboardPreview(text: string, maxLength = 80): string {
    const singleLine = text.replace(/\s+/g, ' ').trim();
    if (singleLine.length <= maxLength) return singleLine;
    return singleLine.slice(0, maxLength) + '...';
  },
};
