'use client';

import * as stories from '@backstage/ui/src/components/Table/stories/Table.docs.stories';

const {
  TableRockBand: TableRockBandStory,
  SelectionModePlayground: SelectionModePlaygroundStory,
  SelectionBehaviorPlayground: SelectionBehaviorPlaygroundStory,
  SelectionToggleWithActions: SelectionToggleWithActionsStory,
} = stories;

export const TableRockBand = () => <TableRockBandStory.Component />;
export const SelectionModePlayground = () => (
  <SelectionModePlaygroundStory.Component />
);
export const SelectionBehaviorPlayground = () => (
  <SelectionBehaviorPlaygroundStory.Component />
);
export const SelectionToggleWithActions = () => (
  <SelectionToggleWithActionsStory.Component />
);
