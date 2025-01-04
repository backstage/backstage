'use client';

import * as CheckboxStories from '../../canon/src/components/Checkbox/Checkbox.stories';
import { composeStories } from '@storybook/react';

export const CheckboxPreview = () => {
  const { Default } = composeStories(CheckboxStories);

  return <Default />;
};

export const CheckboxAllVariants = () => {
  const { AllVariants } = composeStories(CheckboxStories);

  return <AllVariants />;
};

export const CheckboxPlayground = () => {
  const { Playground } = composeStories(CheckboxStories);

  return <Playground />;
};
