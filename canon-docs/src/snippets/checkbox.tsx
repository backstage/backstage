'use client';

import { composeStories } from '@storybook/react';
import * as CheckboxStories from '../../../packages/canon/src/components/Checkbox/Checkbox.stories';

export const CheckboxSnippet = ({ story }: { story: string }) => {
  const stories = composeStories(CheckboxStories);

  if (story === 'Default') return <stories.Default />;
  if (story === 'AllVariants') return <stories.AllVariants />;
  if (story === 'Playground') return <stories.Playground />;

  return null;
};
