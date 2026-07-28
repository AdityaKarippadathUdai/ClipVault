import React, { useState } from 'react';
import {
  LayoutDashboard,
  Star,
  Clock,
  ClipboardList,
  Trash2,
  FolderPlus,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useSnippetStore } from '../store/useSnippetStore';
import { useClipboardStore } from '../store/useClipboardStore';
import { useFolderStore } from '../store/useFolderStore';
import { FolderTree } from './FolderTree';
import { Folder, ActiveNavigation } from '../types';

interface SidebarProps {
  onOpenNewFolderDialog: (parentId?: string | null) => void;
  onFolderContextMenu?: (e: React.MouseEvent, folder: Folder) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenNewFolderDialog,
  onFolderContextMenu,
}) => {
  const {
    snippets,
    selectedFolderId,
    setSelectedFolderId,
    activeNavigation,
    setActiveNavigation,
  } = useSnippetStore();
  const { items: clipboardItems } = useClipboardStore();

  const [width, setWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Counts calculation
  const totalWorkspaceSnippets = snippets.filter((s) => !s.isTrashed).length;
  const favoriteCount = snippets.filter((s) => !s.isTrashed && s.isFavorite).length;
  const trashCount = snippets.filter((s) => s.isTrashed).length;
  const clipboardCount = clipboardItems.length;

  // Handle sidebar resize drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(180, Math.min(360, startWidth + (moveEvent.clientX - startX)));
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const navItems = [
    {
      id: 'dashboard' as ActiveNavigation,
      label: 'Workspace',
      icon: LayoutDashboard,
      count: totalWorkspaceSnippets,
      action: () => {
        setSelectedFolderId(null);
        setActiveNavigation('dashboard');
      },
      isActive: activeNavigation === 'dashboard' && selectedFolderId === null,
    },
    {
      id: 'favorites' as ActiveNavigation,
      label: 'Favorites',
      icon: Star,
      count: favoriteCount,
      action: () => setActiveNavigation('favorites'),
      isActive: activeNavigation === 'favorites',
    },
    {
      id: 'recent' as ActiveNavigation,
      label: 'Recent',
      icon: Clock,
      action: () => setActiveNavigation('recent'),
      isActive: activeNavigation === 'recent',
    },
    {
      id: 'clipboard' as ActiveNavigation,
      label: 'Clipboard History',
      icon: ClipboardList,
      count: clipboardCount,
      action: () => setActiveNavigation('clipboard'),
      isActive: activeNavigation === 'clipboard',
    },
    {
      id: 'trash' as ActiveNavigation,
      label: 'Trash',
      icon: Trash2,
      count: trashCount,
      action: () => setActiveNavigation('trash'),
      isActive: activeNavigation === 'trash',
    },
  ];

  if (isCollapsed) {
    return (
      <aside className="w-12 border-r border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex flex-col items-center py-3 gap-3 z-10">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500"
          title="Expand Sidebar"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <div className="w-6 h-[1px] bg-slate-200 dark:bg-slate-800" />
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={`p-2 rounded-md transition ${
              item.isActive
                ? 'bg-blue-600/15 text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
            title={item.label}
          >
            <item.icon className="w-4 h-4" />
          </button>
        ))}
      </aside>
    );
  }

  return (
    <aside
      className="relative flex flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 backdrop-blur-sm select-none z-10 shrink-0"
      style={{ width: `${width}px` }}
    >
      {/* Top Header Controls */}
      <div className="p-3 pb-2 flex items-center justify-between text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        <span>Navigation</span>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400"
          title="Collapse Sidebar"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Views Navigation */}
      <div className="px-2 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition ${
              item.isActive
                ? 'bg-blue-600/15 text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <item.icon className={`w-4 h-4 ${item.isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </div>
            {item.count !== undefined && (
              <span
                className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono ${
                  item.isActive
                    ? 'bg-blue-600/20 text-blue-600 dark:text-blue-300'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mx-3 my-3 h-[1px] bg-slate-200 dark:bg-slate-800" />

      {/* Folders Section */}
      <div className="flex-1 flex flex-col min-h-0 px-2 overflow-y-auto">
        <div className="flex items-center justify-between px-1 mb-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Folders</span>
          </div>
          <button
            onClick={() => onOpenNewFolderDialog(null)}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
            title="Create root folder"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>

        <FolderTree
          onAddSubfolder={(parentId) => onOpenNewFolderDialog(parentId)}
          onContextMenu={onFolderContextMenu}
        />
      </div>

      {/* Resizable handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/50 transition ${
          isResizing ? 'bg-blue-500' : ''
        }`}
      />
    </aside>
  );
};
