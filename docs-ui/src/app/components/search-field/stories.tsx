'use client';

import * as stories from '@backstage/ui/src/components/SearchField/SearchField.stories';

const {
  WithLabel: WithLabelStory,
  Sizes: SizesStory,
  WithDescription: WithDescriptionStory,
  StartCollapsed: StartCollapsedStory,
} = stories;

export const WithLabel = () => <WithLabelStory.Component />;
export const Sizes = () => <SizesStory.Component />;
export const WithDescription = () => <WithDescriptionStory.Component />;
export const StartCollapsed = () => <StartCollapsedStory.Component />;
