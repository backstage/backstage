'use client';

import { composeStories } from '@storybook/react';
import * as BoxStories from '../../../packages/ui/src/components/Box/Box.stories';
import * as ButtonStories from '../../../packages/ui/src/components/Button/Button.stories';
import * as ButtonIconStories from '../../../packages/ui/src/components/ButtonIcon/ButtonIcon.stories';
import * as ButtonLinkStories from '../../../packages/ui/src/components/ButtonLink/ButtonLink.stories';
import * as CheckboxStories from '../../../packages/ui/src/components/Checkbox/Checkbox.stories';
import * as ContainerStories from '../../../packages/ui/src/components/Container/Container.stories';
import * as GridStories from '../../../packages/ui/src/components/Grid/Grid.stories';
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
import * as HeaderStories from '../../../packages/ui/src/components/Header/Header.stories';
import * as HeaderPageStories from '../../../packages/ui/src/components/HeaderPage/HeaderPage.stories';
import * as TableStories from '../../../packages/ui/src/components/Table/Table.stories';

// Helper function to create snippet components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createSnippetComponent = (stories: any) => {
  return function SnippetComponent({ story }: { story: string }) {
    const composedStories = composeStories(stories);
    const StoryComponent = composedStories[
      story as keyof typeof composedStories
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any;

    return StoryComponent ? <StoryComponent /> : null;
  };
};

// Create snippet components using the helper function
export const BoxSnippet = createSnippetComponent(BoxStories);
export const ButtonSnippet = createSnippetComponent(ButtonStories);
export const ButtonIconSnippet = createSnippetComponent(ButtonIconStories);
export const ButtonLinkSnippet = createSnippetComponent(ButtonLinkStories);
export const CheckboxSnippet = createSnippetComponent(CheckboxStories);
export const ContainerSnippet = createSnippetComponent(ContainerStories);
export const GridSnippet = createSnippetComponent(GridStories);
export const IconSnippet = createSnippetComponent(IconStories);
export const TextFieldSnippet = createSnippetComponent(TextFieldStories);
export const TextSnippet = createSnippetComponent(TextStories);
export const FlexSnippet = createSnippetComponent(FlexStories);
export const SelectSnippet = createSnippetComponent(SelectStories);
export const MenuSnippet = createSnippetComponent(MenuStories);
export const LinkSnippet = createSnippetComponent(LinkStories);
export const AvatarSnippet = createSnippetComponent(AvatarStories);
export const CollapsibleSnippet = createSnippetComponent(CollapsibleStories);
export const RadioGroupSnippet = createSnippetComponent(RadioGroupStories);
export const TabsSnippet = createSnippetComponent(TabsStories);
export const SwitchSnippet = createSnippetComponent(SwitchStories);
export const SearchFieldSnippet = createSnippetComponent(SearchFieldStories);
export const TooltipSnippet = createSnippetComponent(TooltipStories);
export const SkeletonSnippet = createSnippetComponent(SkeletonStories);
export const CardSnippet = createSnippetComponent(CardStories);
export const HeaderSnippet = createSnippetComponent(HeaderStories);
export const HeaderPageSnippet = createSnippetComponent(HeaderPageStories);
export const TableSnippet = createSnippetComponent(TableStories);
