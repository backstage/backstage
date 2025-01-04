'use client';

import * as ButtonStories from '../../canon/src/components/Button/Button.stories';
import { composeStories } from '@storybook/react';

export const ButtonPreview = () => {
  const { Variants } = composeStories(ButtonStories);

  return <Variants />;
};

export const ButtonSizes = () => {
  const { Sizes } = composeStories(ButtonStories);

  return <Sizes />;
};

export const ButtonWithIcons = () => {
  const { WithIcons } = composeStories(ButtonStories);

  return <WithIcons />;
};

export const ButtonFullWidth = () => {
  const { FullWidth } = composeStories(ButtonStories);

  return <FullWidth />;
};

export const ButtonDisabled = () => {
  const { Disabled } = composeStories(ButtonStories);

  return <Disabled />;
};

export const ButtonResponsive = () => {
  const { Responsive } = composeStories(ButtonStories);

  // TODO: Add responsive button
  return null;
  return <Responsive />;
};

export const ButtonPlayground = () => {
  const { Playground } = composeStories(ButtonStories);

  return <Playground />;
};
