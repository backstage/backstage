'use client';

import * as stories from '@backstage/ui/src/components/Dialog/Dialog.stories';

const {
  Default: DefaultStory,
  PreviewFixedWidthAndHeight: PreviewFixedWidthAndHeightStory,
  PreviewWithForm: PreviewWithFormStory,
} = stories;

export const Default = () => <DefaultStory.Component />;
export const PreviewFixedWidthAndHeight = () => (
  <PreviewFixedWidthAndHeightStory.Component />
);
export const PreviewWithForm = () => <PreviewWithFormStory.Component />;
