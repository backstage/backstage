'use client';

import { useEffect, useState } from 'react';
import { composeStories } from '@storybook/react';
import * as TextStories from '../../../packages/canon/src/components/Text/Text.stories';

export const TextSnippet = ({ story }: { story: string }) => {
  const stories = composeStories(TextStories);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, [story]);

  if (!isReady) return null;

  if (story === 'Default') return <stories.Default />;
  if (story === 'AllVariants') return <stories.AllVariants />;
  if (story === 'AllWeights') return <stories.AllWeights />;
  if (story === 'Responsive') return <stories.Responsive />;
  if (story === 'Playground') return <stories.Playground />;

  return null;
};
