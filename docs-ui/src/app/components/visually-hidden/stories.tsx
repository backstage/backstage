'use client';

import * as stories from '@backstage/ui/src/components/VisuallyHidden/VisuallyHidden.stories';

const { Default: DefaultStory, ExampleUsage: ExampleUsageStory } = stories;

export const Default = () => <DefaultStory.Component />;
export const ExampleUsage = () => <ExampleUsageStory.Component />;
