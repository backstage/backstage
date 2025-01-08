'use client';

import * as HeadingStories from '../../../packages/canon/src/components/Heading/Heading.stories';
import { composeStories } from '@storybook/react';

export const HeadingPreview = () => {
  const { Title1 } = composeStories(HeadingStories);

  return <Title1 />;
};

export const HeadingAllVariants = () => {
  const { AllVariants } = composeStories(HeadingStories);

  return <AllVariants />;
};

export const HeadingResponsive = () => {
  const { Responsive } = composeStories(HeadingStories);

  // TODO: Add responsive heading
  return null;
  return <Responsive />;
};

export const HeadingPlayground = () => {
  const { Playground } = composeStories(HeadingStories);

  return <Playground />;
};
