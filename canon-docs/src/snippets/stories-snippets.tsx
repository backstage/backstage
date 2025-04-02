'use client';

import { composeStories } from '@storybook/react';
import * as BoxStories from '../../../packages/canon/src/components/Box/Box.stories';
import * as ButtonStories from '../../../packages/canon/src/components/Button/Button.stories';
import * as CheckboxStories from '../../../packages/canon/src/components/Checkbox/Checkbox.stories';
import * as ContainerStories from '../../../packages/canon/src/components/Container/Container.stories';
import * as FieldStories from '../../../packages/canon/src/components/Field/Field.stories';
import * as GridStories from '../../../packages/canon/src/components/Grid/Grid.stories';
import * as HeadingStories from '../../../packages/canon/src/components/Heading/Heading.stories';
import * as IconButtonStories from '../../../packages/canon/src/components/IconButton/IconButton.stories';
import * as IconStories from '../../../packages/canon/src/components/Icon/Icon.stories';
import * as InputStories from '../../../packages/canon/src/components/Input/Input.stories';
import * as TextStories from '../../../packages/canon/src/components/Text/Text.stories';
import * as FlexStories from '../../../packages/canon/src/components/Flex/Flex.stories';
import * as SelectStories from '../../../packages/canon/src/components/Select/Select.stories';

export const BoxSnippet = ({ story }: { story: keyof typeof BoxStories }) => {
  const stories = composeStories(BoxStories);
  const StoryComponent = stories[story as keyof typeof stories];

  return StoryComponent ? <StoryComponent /> : null;
};

export const ButtonSnippet = ({
  story,
}: {
  story: keyof typeof ButtonStories;
}) => {
  const stories = composeStories(ButtonStories);
  const StoryComponent = stories[story as keyof typeof stories];

  return StoryComponent ? <StoryComponent /> : null;
};

export const CheckboxSnippet = ({
  story,
}: {
  story: keyof typeof CheckboxStories;
}) => {
  const stories = composeStories(CheckboxStories);
  const StoryComponent = stories[story as keyof typeof stories];

  return StoryComponent ? <StoryComponent /> : null;
};

export const ContainerSnippet = ({
  story,
}: {
  story: keyof typeof ContainerStories;
}) => {
  const stories = composeStories(ContainerStories);
  const StoryComponent = stories[story as keyof typeof stories];

  return StoryComponent ? <StoryComponent /> : null;
};

export const FlexSnippet = ({ story }: { story: keyof typeof FlexStories }) => {
  const stories = composeStories(FlexStories);
  const StoryComponent = stories[story as keyof typeof stories];

  return StoryComponent ? <StoryComponent /> : null;
};

export const FieldSnippet = ({
  story,
}: {
  story: keyof typeof FieldStories;
}) => {
  const stories = composeStories(FieldStories);
  const StoryComponent = stories[story as keyof typeof stories];

  return StoryComponent ? <StoryComponent /> : null;
};

export const GridSnippet = ({ story }: { story: keyof typeof GridStories }) => {
  const stories = composeStories(GridStories);
  const StoryComponent = stories[story as keyof typeof stories];

  return StoryComponent ? <StoryComponent /> : null;
};

export const HeadingSnippet = ({
  story,
}: {
  story: keyof typeof HeadingStories;
}) => {
  const stories = composeStories(HeadingStories);
  const StoryComponent = stories[story as keyof typeof stories];

  return StoryComponent ? <StoryComponent /> : null;
};

export const IconButtonSnippet = ({
  story,
}: {
  story: keyof typeof IconButtonStories;
}) => {
  const stories = composeStories(IconButtonStories);
  const StoryComponent = stories[story as keyof typeof stories];

  return StoryComponent ? <StoryComponent /> : null;
};

export const IconSnippet = ({ story }: { story: keyof typeof IconStories }) => {
  const stories = composeStories(IconStories);
  const StoryComponent = stories[story as keyof typeof stories];

  return StoryComponent ? <StoryComponent /> : null;
};

export const InputSnippet = ({
  story,
}: {
  story: keyof typeof InputStories;
}) => {
  const stories = composeStories(InputStories);
  const StoryComponent = stories[story as keyof typeof stories];

  return StoryComponent ? <StoryComponent /> : null;
};

export const TextSnippet = ({ story }: { story: keyof typeof TextStories }) => {
  const stories = composeStories(TextStories);
  const StoryComponent = stories[story as keyof typeof stories];

  return StoryComponent ? <StoryComponent /> : null;
};

export const SelectSnippet = ({
  story,
}: {
  story: keyof typeof SelectStories;
}) => {
  const stories = composeStories(SelectStories);
  const StoryComponent = stories[story as keyof typeof stories];

  return StoryComponent ? <StoryComponent /> : null;
};
