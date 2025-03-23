'use client';

import { useEffect, useState } from 'react';
import { composeStories } from '@storybook/react';
import * as HeadingStories from '../../../packages/canon/src/components/Heading/Heading.stories';

export const HeadingSnippet = ({ story }: { story: string }) => {
  const stories = composeStories(HeadingStories);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, [story]);

  if (!isReady) return null;

  if (story === 'Default') return <stories.Default />;
  if (story === 'Title1') return <stories.Title1 />;
  if (story === 'AllVariants') return <stories.AllVariants />;
  if (story === 'Responsive') return <stories.Responsive />;
  if (story === 'Playground') return <stories.Playground />;

  return null;
};
