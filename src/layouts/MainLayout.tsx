import React, { useState, useEffect } from 'react';
import { Toolbar } from '../components/Toolbar';
import { Sidebar } from '../components/Sidebar';
import { SnippetGrid } from '../components/SnippetGrid';
import { SnippetEditor } from '../components/Editor';
import { StatusBar } from '../components/StatusBar';
import { ClipboardHistoryView } from '../components/ClipboardHistoryView';
import { SettingsPanel } from '../components/SettingsPanel';
import { FolderDialog } from '../components/FolderDialog';
import { ContextMenu, ContextMenuPosition } from '../components/ContextMenu';
import { QuickActionsModal } from '../components/QuickActionsModal';
import { useSnippetStore } from '../store/useSnippetStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { Folder, Snippet } from '../types';

export const MainLayout: React.FC = () => {
  const { activeNavigation } = useSnippetStore();
  const { settings } = useSettingsStore();

  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [folderParentId, setFolderParentId] = useState<string | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState<ContextMenuPosition | null>(null);

  // Apply dark mode class to root HTML
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  }, [settings.theme]);

  // Global hotkeys (⌘K command palette, ⌘N new snippet)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenFolderDialog = (parentId: string | null = null) => {
    setFolderParentId(parentId);
    setFolderDialogOpen(true);
  };

  const handleSnippetContextMenu = (e: React.MouseEvent, snippet: Snippet) => {
    e.preventDefault();
    setContextMenuPos({
      x: e.clientX,
      y: e.clientY,
      type: 'snippet',
      snippet,
    });
  };

  const handleFolderContextMenu = (e: React.MouseEvent, folder: Folder) => {
    e.preventDefault();
    setContextMenuPos({
      x: e.clientX,
      y: e.clientY,
      type: 'folder',
      folder,
    });
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      {/* Top Application Toolbar */}
      <Toolbar
        onOpenNewFolderDialog={() => handleOpenFolderDialog(null)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenSettings={() => useSnippetStore.getState().setActiveNavigation('settings')}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        <Sidebar
          onOpenNewFolderDialog={(parentId) => handleOpenFolderDialog(parentId || null)}
          onFolderContextMenu={handleFolderContextMenu}
        />

        {/* Center / Right Content Area */}
        <main className="flex-1 flex overflow-hidden min-w-0">
          {activeNavigation === 'clipboard' ? (
            <ClipboardHistoryView />
          ) : activeNavigation === 'settings' ? (
            <SettingsPanel />
          ) : (
            <>
              {/* Snippets Grid / List Middle Panel */}
              <SnippetGrid onSnippetContextMenu={handleSnippetContextMenu} />

              {/* Monaco Code Editor Right Panel */}
              <SnippetEditor />
            </>
          )}
        </main>
      </div>

      {/* Bottom Status Bar */}
      <StatusBar />

      {/* Dialogs & Context Menus */}
      <FolderDialog
        isOpen={folderDialogOpen}
        parentId={folderParentId}
        onClose={() => setFolderDialogOpen(false)}
      />

      <ContextMenu
        position={contextMenuPos}
        onClose={() => setContextMenuPos(null)}
        onOpenNewFolderDialog={handleOpenFolderDialog}
      />

      <QuickActionsModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenFolderDialog={() => handleOpenFolderDialog(null)}
      />
    </div>
  );
};
