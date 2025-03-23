'use client';

import { useEffect, useState } from 'react';
import { composeStories } from '@storybook/react';
import * as FlexStories from '../../../packages/canon/src/components/Flex/Flex.stories';

export const FlexSnippet = ({ story }: { story: string }) => {
  const stories = composeStories(FlexStories);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, [story]);

  if (!isReady) return null;

  if (story === 'Default') return <stories.Default />;

  return null;
};
