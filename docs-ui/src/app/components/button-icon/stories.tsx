'use client';

import * as stories from '@backstage/ui/src/components/ButtonIcon/ButtonIcon.stories';

const {
  Variants: VariantsStory,
  Sizes: SizesStory,
  Disabled: DisabledStory,
  Loading: LoadingStory,
} = stories;

export const Variants = () => <VariantsStory.Component />;
export const Sizes = () => <SizesStory.Component />;
export const Disabled = () => <DisabledStory.Component />;
export const Loading = () => <LoadingStory.Component />;
