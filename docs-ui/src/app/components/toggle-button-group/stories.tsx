'use client';

import * as stories from '@backstage/ui/src/components/ToggleButtonGroup/ToggleButtonGroup.stories';

const {
  SingleSelection: SingleSelectionStory,
  Surfaces: SurfacesStory,
  MultipleSelection: MultipleSelectionStory,
  WithIcons: WithIconsStory,
  IconsOnly: IconsOnlyStory,
  DisallowEmptySelection: DisallowEmptySelectionStory,
  Orientation: OrientationStory,
  DisabledGroup: DisabledGroupStory,
} = stories;

export const SingleSelection = () => <SingleSelectionStory.Component />;
export const Surfaces = () => <SurfacesStory.Component />;
export const MultipleSelection = () => <MultipleSelectionStory.Component />;
export const WithIcons = () => <WithIconsStory.Component />;
export const IconsOnly = () => <IconsOnlyStory.Component />;
export const DisallowEmptySelection = () => (
  <DisallowEmptySelectionStory.Component />
);
export const Orientation = () => <OrientationStory.Component />;
export const DisabledGroup = () => <DisabledGroupStory.Component />;
