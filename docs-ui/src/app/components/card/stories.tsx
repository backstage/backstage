'use client';

import * as stories from '@backstage/ui/src/components/Card/Card.stories';

const {
  CustomSize: CustomSizeStory,
  WithLongBody: WithLongBodyStory,
  WithListRow: WithListRowStory,
} = stories;

export const CustomSize = () => <CustomSizeStory.Component />;
export const WithLongBody = () => <WithLongBodyStory.Component />;
export const WithListRow = () => <WithListRowStory.Component />;
