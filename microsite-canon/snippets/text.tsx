'use client';

import * as TextStories from '../../packages/canon/src/components/Text/Text.stories';
import { composeStories } from '@storybook/react';

export const TextPreview = () => {
  const { Default } = composeStories(TextStories);

  return <Default />;
};

export const TextAllVariants = () => {
  const { AllVariants } = composeStories(TextStories);

  return <AllVariants />;
};

export const TextAllWeights = () => {
  const { AllWeights } = composeStories(TextStories);

  return <AllWeights />;
};

export const TextResponsive = () => {
  const { Responsive } = composeStories(TextStories);

  // TODO: Add responsive text
  return null;
  return <Responsive />;
};

export const TextPlayground = () => {
  const { Playground } = composeStories(TextStories);

  return <Playground />;
};
