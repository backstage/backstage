'use client';

import { useEffect, useState } from 'react';
import { composeStories } from '@storybook/react';
import * as ContainerStories from '../../../packages/canon/src/components/Container/Container.stories';

export const ContainerSnippet = ({ story }: { story: string }) => {
  const stories = composeStories(ContainerStories);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, [story]);

  if (!isReady) return null;

  if (story === 'Preview') return <stories.Preview />;

  return null;
};
