'use client';

import { composeStories } from '@storybook/react';
import * as BoxStories from '../../../packages/ui/src/components/Box/Box.stories';
import * as ButtonStories from '../../../packages/ui/src/components/Button/Button.stories';
import * as ButtonIconStories from '../../../packages/ui/src/components/ButtonIcon/ButtonIcon.stories';
import * as ButtonLinkStories from '../../../packages/ui/src/components/ButtonLink/ButtonLink.stories';
import * as CheckboxStories from '../../../packages/ui/src/components/Checkbox/Checkbox.stories';
import * as ContainerStories from '../../../packages/ui/src/components/Container/Container.stories';
import * as GridStories from '../../../packages/ui/src/components/Grid/Grid.stories';
import * as HeadingStories from '../../../packages/ui/src/components/Heading/Heading.stories';
import * as IconStories from '../../../packages/ui/src/components/Icon/Icon.stories';
import * as TextFieldStories from '../../../packages/ui/src/components/TextField/TextField.stories';
import * as TextStories from '../../../packages/ui/src/components/Text/Text.stories';
import * as FlexStories from '../../../packages/ui/src/components/Flex/Flex.stories';
import * as SelectStories from '../../../packages/ui/src/components/Select/Select.stories';
import * as MenuStories from '../../../packages/ui/src/components/Menu/Menu.stories';
import * as LinkStories from '../../../packages/ui/src/components/Link/Link.stories';
import * as AvatarStories from '../../../packages/ui/src/components/Avatar/Avatar.stories';
import * as CollapsibleStories from '../../../packages/ui/src/components/Collapsible/Collapsible.stories';
import * as RadioGroupStories from '../../../packages/ui/src/components/RadioGroup/RadioGroup.stories';
import * as TabsStories from '../../../packages/ui/src/components/Tabs/Tabs.stories';
import * as SwitchStories from '../../../packages/ui/src/components/Switch/Switch.stories';
import * as SearchFieldStories from '../../../packages/ui/src/components/SearchField/SearchField.stories';
import * as TooltipStories from '../../../packages/ui/src/components/Tooltip/Tooltip.stories';
import * as SkeletonStories from '../../../packages/ui/src/components/Skeleton/Skeleton.stories';
import * as CardStories from '../../../packages/ui/src/components/Card/Card.stories';

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

export const ButtonIconSnippet = ({
  story,
}: {
  story: keyof typeof ButtonIconStories;
}) => {
  const stories = composeStories(ButtonIconStories);
  const StoryComponent = stories[story as keyof typeof stories];

  return StoryComponent ? <StoryComponent /> : null;
};

export const ButtonLinkSnippet = ({
  story,
}: {
  story: keyof typeof ButtonLinkStories;
}) => {
  const stories = composeStories(ButtonLinkStories);
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

export const RadioGroupSnippet = ({
  story,
}: {
  story: keyof typeof RadioGroupStories;
}) => {
  const stories = composeStories(RadioGroupStories);
  const StoryComponent = stories[story as keyof typeof stories];

  return StoryComponent ? <StoryComponent /> : null;
};

export const SearchFieldSnippet = ({
  story,
}: {
  story: keyof typeof SearchFieldStories;
}) => {
  const stories = composeStories(SearchFieldStories);
  const StoryComponent = stories[story as keyof typeof stories];

  return StoryComponent ? <StoryComponent /> : null;
};

export const TooltipSnippet = ({
  story,
}: {
  story: keyof typeof TooltipStories;
}) => {
  const stories = composeStories(TooltipStories);
  const StoryComponent = stories[story as keyof typeof stories];

  return StoryComponent ? <StoryComponent /> : null;
};

export const SkeletonSnippet = ({
  story,
}: {
  story: keyof typeof SkeletonStories;
}) => {
  const stories = composeStories(SkeletonStories);
  const StoryComponent = stories[story as keyof typeof stories];

  return StoryComponent ? <StoryComponent /> : null;
};

export const CardSnippet = ({ story }: { story: keyof typeof CardStories }) => {
  const stories = composeStories(CardStories);
  const StoryComponent = stories[story as keyof typeof stories];

  return StoryComponent ? <StoryComponent /> : null;
};
