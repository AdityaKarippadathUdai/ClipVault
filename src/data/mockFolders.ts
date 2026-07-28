import { Folder } from '../types';

export const initialFolders: Folder[] = [
  { id: 'ubuntu', name: 'Ubuntu', parentId: null, color: '#E95420', isExpanded: true },
  { id: 'ubuntu-networking', name: 'Networking', parentId: 'ubuntu', color: '#38BDF8' },
  { id: 'ubuntu-docker', name: 'Docker', parentId: 'ubuntu', color: '#2496ED' },
  { id: 'ubuntu-git', name: 'Git', parentId: 'ubuntu', color: '#F05032' },
  { id: 'react', name: 'React', parentId: null, color: '#61DAFB', isExpanded: true },
  { id: 'python', name: 'Python', parentId: null, color: '#3776AB', isExpanded: true },
  { id: 'sql', name: 'SQL', parentId: null, color: '#4479A1' },
  { id: 'linux', name: 'Linux', parentId: null, color: '#FCC624' },
  { id: 'ai', name: 'AI & ML', parentId: null, color: '#A855F7', isExpanded: true },
  { id: 'java', name: 'Java', parentId: null, color: '#ED8B00' },
];
