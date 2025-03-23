'use client';

import { useEffect, useState } from 'react';
import { composeStories } from '@storybook/react';
import * as IconButtonStories from '../../../packages/canon/src/components/IconButton/IconButton.stories';

export const IconButtonSnippet = ({ story }: { story: string }) => {
  const stories = composeStories(IconButtonStories);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, [story]);

  if (!isReady) return null;

  if (story === 'Variants') return <stories.Variants />;
  if (story === 'Sizes') return <stories.Sizes />;
  if (story === 'Disabled') return <stories.Disabled />;
  if (story === 'Responsive') return <stories.Responsive />;
  if (story === 'Playground') return <stories.Playground />;

  return null;
};
