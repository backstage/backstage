'use client';

import * as stories from '@backstage/ui/src/components/Checkbox/Checkbox.stories';

const { Default: DefaultStory, AllVariants: AllVariantsStory } = stories;

export const Default = () => <DefaultStory.Component />;
export const AllVariants = () => <AllVariantsStory.Component />;
