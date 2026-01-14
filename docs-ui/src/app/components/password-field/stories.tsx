'use client';

import * as stories from '@backstage/ui/src/components/PasswordField/PasswordField.stories';

const {
  WithLabel: WithLabelStory,
  Sizes: SizesStory,
  WithDescription: WithDescriptionStory,
} = stories;

export const WithLabel = () => <WithLabelStory.Component />;
export const Sizes = () => <SizesStory.Component />;
export const WithDescription = () => <WithDescriptionStory.Component />;
