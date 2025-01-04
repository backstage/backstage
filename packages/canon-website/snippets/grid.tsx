'use client';

import { composeStories } from '@storybook/react';
import * as GridStories from '../../canon/src/components/Grid/Grid.stories';

export const GridPreview = () => {
  const { Default } = composeStories(GridStories);

  return <Default />;
};
