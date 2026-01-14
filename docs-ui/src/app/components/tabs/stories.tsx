'use client';

import * as stories from '@backstage/ui/src/components/Tabs/Tabs.stories';

const {
  Default: DefaultStory,
  WithTabPanels: WithTabPanelsStory,
  WithMockedURLTab2: WithMockedURLTab2Story,
  PrefixMatchingDeepNesting: PrefixMatchingDeepNestingStory,
} = stories;

export const Default = () => <DefaultStory.Component />;
export const WithTabPanels = () => <WithTabPanelsStory.Component />;
export const WithMockedURLTab2 = () => <WithMockedURLTab2Story.Component />;
export const PrefixMatchingDeepNesting = () => (
  <PrefixMatchingDeepNestingStory.Component />
);
