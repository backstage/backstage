'use client';

import * as InlineStories from '../../canon/src/components/Inline/Inline.stories';
import { composeStories } from '@storybook/react';

export const InlinePreview = () => {
  const { Default } = composeStories(InlineStories);

  return <Default />;
};
