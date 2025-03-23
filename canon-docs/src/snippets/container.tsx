'use client';

import { composeStories } from '@storybook/react';
import * as ContainerStories from '../../../packages/canon/src/components/Container/Container.stories';

export const ContainerSnippet = ({ story }: { story: string }) => {
  const stories = composeStories(ContainerStories);

  if (story === 'Preview') return <stories.Preview />;

  return null;
};
