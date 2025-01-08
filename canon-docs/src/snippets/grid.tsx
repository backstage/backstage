'use client';

import { composeStories } from '@storybook/react';
import * as GridStories from '../../../packages/canon/src/components/Grid/Grid.stories';

export const GridPreview = () => {
  const { Default } = composeStories(GridStories);

  return <Default />;
};
