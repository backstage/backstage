'use client';

import { composeStories } from '@storybook/react';
import * as BoxStories from '../../../packages/canon/src/components/Box/Box.stories';
import * as ButtonStories from '../../../packages/canon/src/components/Button/Button.stories';
import * as CheckboxStories from '../../../packages/canon/src/components/Checkbox/Checkbox.stories';
import * as ContainerStories from '../../../packages/canon/src/components/Container/Container.stories';
import * as GridStories from '../../../packages/canon/src/components/Grid/Grid.stories';
import * as HeadingStories from '../../../packages/canon/src/components/Heading/Heading.stories';
import * as IconButtonStories from '../../../packages/canon/src/components/IconButton/IconButton.stories';
import * as IconStories from '../../../packages/canon/src/components/Icon/Icon.stories';
import * as TextFieldStories from '../../../packages/canon/src/components/TextField/TextField.stories';
import * as TextStories from '../../../packages/canon/src/components/Text/Text.stories';
import * as FlexStories from '../../../packages/canon/src/components/Flex/Flex.stories';
import * as SelectStories from '../../../packages/canon/src/components/Select/Select.stories';
import * as MenuStories from '../../../packages/canon/src/components/Menu/Menu.stories';
import * as LinkStories from '../../../packages/canon/src/components/Link/Link.stories';
import * as AvatarStories from '../../../packages/canon/src/components/Avatar/Avatar.stories';
import * as CollapsibleStories from '../../../packages/canon/src/components/Collapsible/Collapsible.stories';
import * as TabsStories from '../../../packages/canon/src/components/Tabs/Tabs.stories';
import * as SwitchStories from '../../../packages/canon/src/components/Switch/Switch.stories';

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

export const TextFieldSnippet = ({
  story,
}: {
  story: keyof typeof TextFieldStories;
}) => {
  const stories = composeStories(TextFieldStories);
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

export const MenuSnippet = ({ story }: { story: keyof typeof MenuStories }) => {
  const stories = composeStories(MenuStories);
  const StoryComponent = stories[story as keyof typeof stories];

  return StoryComponent ? <StoryComponent /> : null;
};

export const LinkSnippet = ({ story }: { story: keyof typeof LinkStories }) => {
  const stories = composeStories(LinkStories);
  const StoryComponent = stories[story as keyof typeof stories];

  return StoryComponent ? <StoryComponent /> : null;
};

export const AvatarSnippet = ({
  story,
}: {
  story: keyof typeof AvatarStories;
}) => {
  const stories = composeStories(AvatarStories);
  const StoryComponent = stories[story as keyof typeof stories];

  return StoryComponent ? <StoryComponent /> : null;
};

export const CollapsibleSnippet = ({
  story,
}: {
  story: keyof typeof CollapsibleStories;
}) => {
  const stories = composeStories(CollapsibleStories);
  const StoryComponent = stories[story as keyof typeof stories];

  return StoryComponent ? <StoryComponent /> : null;
};

export const TabsSnippet = ({ story }: { story: keyof typeof TabsStories }) => {
  const stories = composeStories(TabsStories);
  const StoryComponent = stories[story as keyof typeof stories];

  return StoryComponent ? <StoryComponent /> : null;
};

export const SwitchSnippet = ({
  story,
}: {
  story: keyof typeof SwitchStories;
}) => {
  const stories = composeStories(SwitchStories);
  const StoryComponent = stories[story as keyof typeof stories];

  return StoryComponent ? <StoryComponent /> : null;
};
