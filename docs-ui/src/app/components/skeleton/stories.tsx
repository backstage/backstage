'use client';

import * as stories from '@backstage/ui/src/components/Skeleton/Skeleton.stories';

const { Demo1: Demo1Story, Demo2: Demo2Story } = stories;

export const Demo1 = () => <Demo1Story.Component />;
export const Demo2 = () => <Demo2Story.Component />;
