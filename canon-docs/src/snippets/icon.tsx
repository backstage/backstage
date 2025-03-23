'use client';

import { useEffect, useState } from 'react';
import { composeStories } from '@storybook/react';
import * as IconStories from '../../../packages/canon/src/components/Icon/Icon.stories';

export const IconSnippet = ({ story }: { story: string }) => {
  const stories = composeStories(IconStories);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, [story]);

  if (!isReady) return null;

  if (story === 'Default') return <stories.Default />;

  return null;
};
