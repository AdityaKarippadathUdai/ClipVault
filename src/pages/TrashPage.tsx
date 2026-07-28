import React from 'react';
import { SnippetGrid } from '../components/cards/SnippetGrid';
import { SnippetEditor } from '../components/editor/SnippetEditor';
import { Snippet } from '../types';

interface TrashPageProps {
  onSnippetContextMenu?: (e: React.MouseEvent, snippet: Snippet) => void;
}

export const TrashPage: React.FC<TrashPageProps> = ({ onSnippetContextMenu }) => {
  return (
    <>
      <SnippetGrid onSnippetContextMenu={onSnippetContextMenu} />
      <SnippetEditor />
    </>
  );
};
