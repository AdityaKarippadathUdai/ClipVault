import React from 'react';
import { SnippetGrid } from '../components/cards/SnippetGrid';
import { SnippetEditor } from '../components/editor/SnippetEditor';
import { Snippet } from '../types';

interface FavoritesPageProps {
  onSnippetContextMenu?: (e: React.MouseEvent, snippet: Snippet) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ onSnippetContextMenu }) => {
  return (
    <>
      <SnippetGrid onSnippetContextMenu={onSnippetContextMenu} />
      <SnippetEditor />
    </>
  );
};
