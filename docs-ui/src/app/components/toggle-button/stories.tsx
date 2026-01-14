'use client';

import * as stories from '@backstage/ui/src/components/ToggleButton/ToggleButton.stories';

const {
  Default: DefaultStory,
  Surfaces: SurfacesStory,
  Sizes: SizesStory,
  WithIcons: WithIconsStory,
  Disabled: DisabledStory,
  Controlled: ControlledStory,
  DynamicContent: DynamicContentStory,
} = stories;

export const Default = () => <DefaultStory.Component />;
export const Surfaces = () => <SurfacesStory.Component />;
export const Sizes = () => <SizesStory.Component />;
export const WithIcons = () => <WithIconsStory.Component />;
export const Disabled = () => <DisabledStory.Component />;
export const Controlled = () => <ControlledStory.Component />;
export const DynamicContent = () => <DynamicContentStory.Component />;
