'use client';

import * as stories from '@backstage/ui/src/components/Avatar/Avatar.stories';

const {
  Default: DefaultStory,
  Sizes: SizesStory,
  Fallback: FallbackStory,
  Purpose: PurposeStory,
} = stories;

export const Default = () => <DefaultStory.Component />;
export const Sizes = () => <SizesStory.Component />;
export const Fallback = () => <FallbackStory.Component />;
export const Purpose = () => <PurposeStory.Component />;
