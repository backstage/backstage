'use client';

import * as stories from '@backstage/ui/src/components/TextField/TextField.stories';

const {
  WithLabel: WithLabelStory,
  Sizes: SizesStory,
  WithDescription: WithDescriptionStory,
} = stories;

export const WithLabel = () => <WithLabelStory.Component />;
export const Sizes = () => <SizesStory.Component />;
export const WithDescription = () => <WithDescriptionStory.Component />;
