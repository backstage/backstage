'use client';

import * as stories from '@backstage/ui/src/components/Text/Text.stories';

const {
  Default: DefaultStory,
  AllVariants: AllVariantsStory,
  AllWeights: AllWeightsStory,
  AllColors: AllColorsStory,
  Truncate: TruncateStory,
} = stories;

export const Default = () => <DefaultStory.Component />;
export const AllVariants = () => <AllVariantsStory.Component />;
export const AllWeights = () => <AllWeightsStory.Component />;
export const AllColors = () => <AllColorsStory.Component />;
export const Truncate = () => <TruncateStory.Component />;
