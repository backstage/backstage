'use client';

import { composeStories } from '@storybook/react';
import * as ButtonStories from '../../../packages/canon/src/components/Button/Button.stories';
import { useEffect, useState } from 'react';

export const ButtonSnippet = ({ story }: { story: string }) => {
  const stories = composeStories(ButtonStories);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, [story]);

  if (!isReady) return null;

  if (story === 'Variants') return <stories.Variants />;
  if (story === 'Sizes') return <stories.Sizes />;
  if (story === 'WithIcons') return <stories.WithIcons />;
  if (story === 'FullWidth') return <stories.FullWidth />;
  if (story === 'Disabled') return <stories.Disabled />;
  if (story === 'Responsive') return <stories.Responsive />;
  if (story === 'Playground') return <stories.Playground />;

  return null;
};
