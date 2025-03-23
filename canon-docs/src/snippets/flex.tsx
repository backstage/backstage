'use client';

import { composeStories } from '@storybook/react';
import * as FlexStories from '../../../packages/canon/src/components/Flex/Flex.stories';

export const FlexSnippet = ({ story }: { story: string }) => {
  const stories = composeStories(FlexStories);

  if (story === 'Default') return <stories.Default />;

  return null;
};
