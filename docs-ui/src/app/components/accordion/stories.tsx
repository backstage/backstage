'use client';

import * as stories from '@backstage/ui/src/components/Accordion/Accordion.stories';

const {
  Default: DefaultStory,
  WithSubtitle: WithSubtitleStory,
  CustomTrigger: CustomTriggerStory,
  DefaultExpanded: DefaultExpandedStory,
  GroupSingleOpen: GroupSingleOpenStory,
  GroupMultipleOpen: GroupMultipleOpenStory,
} = stories;

export const Default = () => <DefaultStory.Component />;
export const WithSubtitle = () => <WithSubtitleStory.Component />;
export const CustomTrigger = () => <CustomTriggerStory.Component />;
export const DefaultExpanded = () => <DefaultExpandedStory.Component />;
export const GroupSingleOpen = () => <GroupSingleOpenStory.Component />;
export const GroupMultipleOpen = () => <GroupMultipleOpenStory.Component />;
