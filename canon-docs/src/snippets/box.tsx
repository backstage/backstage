'use client';

import * as BoxStories from '../../../packages/canon/src/components/Box/Box.stories';
import { composeStories } from '@storybook/react';

export const BoxPreview = () => {
  const { Default } = composeStories(BoxStories);

  return <Default />;
};
