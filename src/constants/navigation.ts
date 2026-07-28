import { ActiveNavigation } from '../types';

export interface NavItemConfig {
  id: ActiveNavigation;
  label: string;
  iconName: string;
}

export const NAV_ITEMS: NavItemConfig[] = [
  { id: 'dashboard', label: 'Workspace', iconName: 'LayoutDashboard' },
  { id: 'favorites', label: 'Favorites', iconName: 'Star' },
  { id: 'recent', label: 'Recent', iconName: 'Clock' },
  { id: 'clipboard', label: 'Clipboard History', iconName: 'ClipboardList' },
  { id: 'trash', label: 'Trash', iconName: 'Trash2' },
  { id: 'settings', label: 'Settings', iconName: 'Settings' },
];
