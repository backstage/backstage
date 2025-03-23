'use client';

import { useEffect, useState } from 'react';
import { composeStories } from '@storybook/react';
import * as BoxStories from '../../../packages/canon/src/components/Box/Box.stories';

export const BoxSnippet = ({ story }: { story: string }) => {
  const stories = composeStories(BoxStories);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, [story]);

  if (!isReady) return null;

  if (story === 'Preview') return <stories.Preview />;

  return null;
};
