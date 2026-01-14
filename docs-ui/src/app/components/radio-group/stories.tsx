'use client';

import * as stories from '@backstage/ui/src/components/RadioGroup/RadioGroup.stories';

const {
  Default: DefaultStory,
  Horizontal: HorizontalStory,
  Disabled: DisabledStory,
  DisabledSingle: DisabledSingleStory,
  Validation: ValidationStory,
  ReadOnly: ReadOnlyStory,
} = stories;

export const Default = () => <DefaultStory.Component />;
export const Horizontal = () => <HorizontalStory.Component />;
export const Disabled = () => <DisabledStory.Component />;
export const DisabledSingle = () => <DisabledSingleStory.Component />;
export const Validation = () => <ValidationStory.Component />;
export const ReadOnly = () => <ReadOnlyStory.Component />;
