'use client';

import * as stories from '@backstage/ui/src/components/Switch/Switch.stories';

const { Default: DefaultStory, Disabled: DisabledStory } = stories;

export const Default = () => <DefaultStory.Component />;
export const Disabled = () => <DisabledStory.Component />;
