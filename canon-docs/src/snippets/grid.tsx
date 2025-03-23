'use client';

import { useEffect, useState } from 'react';
import { composeStories } from '@storybook/react';
import * as GridStories from '../../../packages/canon/src/components/Grid/Grid.stories';

export const GridSnippet = ({ story }: { story: string }) => {
  const stories = composeStories(GridStories);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, [story]);

  if (!isReady) return null;

  if (story === 'Default') return <stories.Default />;

  return null;
};
