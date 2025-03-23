'use client';

import { composeStories } from '@storybook/react';
import * as IconButtonStories from '../../../packages/canon/src/components/IconButton/IconButton.stories';

export const IconButtonSnippet = ({ story }: { story: string }) => {
  const stories = composeStories(IconButtonStories);

  if (story === 'Variants') return <stories.Variants />;
  if (story === 'Sizes') return <stories.Sizes />;
  if (story === 'Disabled') return <stories.Disabled />;
  if (story === 'Responsive') return <stories.Responsive />;
  if (story === 'Playground') return <stories.Playground />;

  return null;
};
