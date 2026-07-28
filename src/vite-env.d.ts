/// <reference types="vite/client" />

declare global {
  interface Window {
    electronApi?: {
      getVersion: () => Promise<string>;
      getSettings: () => Promise<Record<string, unknown>>;
      updateSettings: (settings: Record<string, unknown>) => Promise<Record<string, unknown>>;
      toggleTray: (visible: boolean) => Promise<boolean>;
      openWindow: () => Promise<boolean>;
      minimizeWindow: () => Promise<boolean>;
      closeWindow: () => Promise<boolean>;
      onClipboardChanged: (callback: (data: unknown) => void) => () => void;
      onSettingsChanged: (callback: (settings: Record<string, unknown>) => void) => () => void;
      addClipboardItem: (data: Record<string, unknown>) => Promise<boolean>;
      getClipboardHistory: () => Promise<unknown[]>;
      clearClipboardHistory: () => Promise<boolean>;
    };
  }
}

export {};
