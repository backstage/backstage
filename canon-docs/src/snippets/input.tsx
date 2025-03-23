'use client';

import { composeStories } from '@storybook/react';
import * as InputStories from '../../../packages/canon/src/components/Input/Input.stories';

export const InputSnippet = ({ story }: { story: string }) => {
  const stories = composeStories(InputStories);

  if (story === 'Primary') return <stories.Primary />;
  if (story === 'Sizes') return <stories.Sizes />;

  return null;
};
