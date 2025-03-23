'use client';

import { useEffect, useState } from 'react';
import { composeStories } from '@storybook/react';
import * as InputStories from '../../../packages/canon/src/components/Input/Input.stories';

export const InputSnippet = ({ story }: { story: string }) => {
  const stories = composeStories(InputStories);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, [story]);

  if (!isReady) return null;

  if (story === 'Primary') return <stories.Primary />;
  if (story === 'Sizes') return <stories.Sizes />;

  return null;
};
