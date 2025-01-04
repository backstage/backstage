'use client';

import * as IconStories from '../../canon/src/components/Icon/Icon.stories';
import { composeStories } from '@storybook/react';

export const IconPreview = () => {
  const { Default } = composeStories(IconStories);

  return <Default />;
};
