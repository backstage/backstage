'use client';

import * as stories from '@backstage/ui/src/components/ButtonLink/ButtonLink.stories';

const {
  Variants: VariantsStory,
  Sizes: SizesStory,
  WithIcons: WithIconsStory,
  Disabled: DisabledStory,
} = stories;

export const Variants = () => <VariantsStory.Component />;
export const Sizes = () => <SizesStory.Component />;
export const WithIcons = () => <WithIconsStory.Component />;
export const Disabled = () => <DisabledStory.Component />;
