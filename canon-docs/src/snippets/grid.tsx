'use client';

import { composeStories } from '@storybook/react';
import * as GridStories from '../../../packages/canon/src/components/Grid/Grid.stories';

export const GridSnippet = ({ story }: { story: string }) => {
  const stories = composeStories(GridStories);

  if (story === 'Default') return <stories.Default />;

  return null;
};
