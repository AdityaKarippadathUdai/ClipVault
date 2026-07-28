import React from 'react';
import { SnippetGrid } from '../components/cards/SnippetGrid';
import { SnippetEditor } from '../components/editor/SnippetEditor';
import { Snippet } from '../types';

interface DashboardPageProps {
  onSnippetContextMenu?: (e: React.MouseEvent, snippet: Snippet) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onSnippetContextMenu }) => {
  return (
    <>
      <SnippetGrid onSnippetContextMenu={onSnippetContextMenu} />
      <SnippetEditor />
    </>
  );
};
