'use client';

import { composeStories } from '@storybook/react';
import * as HeadingStories from '../../../packages/canon/src/components/Heading/Heading.stories';

export const HeadingSnippet = ({ story }: { story: string }) => {
  const stories = composeStories(HeadingStories);

  if (story === 'Default') return <stories.Default />;
  if (story === 'Title1') return <stories.Title1 />;
  if (story === 'AllVariants') return <stories.AllVariants />;
  if (story === 'Responsive') return <stories.Responsive />;
  if (story === 'Playground') return <stories.Playground />;

  return null;
};
