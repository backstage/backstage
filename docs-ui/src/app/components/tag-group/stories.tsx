'use client';

import * as stories from '@backstage/ui/src/components/TagGroup/TagGroup.stories';

const {
  Default: DefaultStory,
  WithLink: WithLinkStory,
  WithIcon: WithIconStory,
  Sizes: SizesStory,
  RemovingTags: RemovingTagsStory,
  Disabled: DisabledStory,
} = stories;

export const Default = () => <DefaultStory.Component />;
export const WithLink = () => <WithLinkStory.Component />;
export const WithIcon = () => <WithIconStory.Component />;
export const Sizes = () => <SizesStory.Component />;
export const RemovingTags = () => <RemovingTagsStory.Component />;
export const Disabled = () => <DisabledStory.Component />;
