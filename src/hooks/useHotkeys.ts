import { useEffect } from 'react';

type KeyCombo = string;

export function useHotkeys(keyCombo: KeyCombo, callback: (e: KeyboardEvent) => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = keyCombo.toLowerCase().split('+');
      const isCmdOrCtrl = keys.includes('cmd') || keys.includes('ctrl') || keys.includes('meta');
      const targetKey = keys[keys.length - 1];

      const matchMeta = isCmdOrCtrl ? e.metaKey || e.ctrlKey : true;
      const matchKey = e.key.toLowerCase() === targetKey;

      if (matchMeta && matchKey) {
        e.preventDefault();
        callback(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyCombo, callback]);
}
