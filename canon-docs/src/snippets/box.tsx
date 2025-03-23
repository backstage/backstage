'use client';

import { composeStories } from '@storybook/react';
import * as BoxStories from '../../../packages/canon/src/components/Box/Box.stories';

export const BoxSnippet = ({ story }: { story: string }) => {
  const stories = composeStories(BoxStories);

  if (story === 'Preview') return <stories.Preview />;

  return null;
};
