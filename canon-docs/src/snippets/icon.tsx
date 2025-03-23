'use client';

import { composeStories } from '@storybook/react';
import * as IconStories from '../../../packages/canon/src/components/Icon/Icon.stories';

export const IconSnippet = ({ story }: { story: string }) => {
  const stories = composeStories(IconStories);

  if (story === 'Default') return <stories.Default />;

  return null;
};
