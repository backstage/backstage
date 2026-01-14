'use client';

import * as stories from '@backstage/ui/src/components/Select/Select.stories';

const {
  Preview: PreviewStory,
  WithLabelAndDescription: WithLabelAndDescriptionStory,
  Sizes: SizesStory,
  WithIcon: WithIconStory,
  Disabled: DisabledStory,
  DisabledOption: DisabledOptionStory,
  Searchable: SearchableStory,
  MultipleSelection: MultipleSelectionStory,
  SearchableMultiple: SearchableMultipleStory,
} = stories;

export const Preview = () => <PreviewStory.Component />;
export const WithLabelAndDescription = () => (
  <WithLabelAndDescriptionStory.Component />
);
export const Sizes = () => <SizesStory.Component />;
export const WithIcon = () => <WithIconStory.Component />;
export const Disabled = () => <DisabledStory.Component />;
export const DisabledOption = () => <DisabledOptionStory.Component />;
export const Searchable = () => <SearchableStory.Component />;
export const MultipleSelection = () => <MultipleSelectionStory.Component />;
export const SearchableMultiple = () => <SearchableMultipleStory.Component />;
