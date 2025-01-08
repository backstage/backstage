'use client';

import { composeStories } from '@storybook/react';
import * as ContainerStories from '../../../packages/canon/src/components/Container/Container.stories';

export const ContainerPreview = () => {
  const { Preview } = composeStories(ContainerStories);

  return <Preview />;
};
