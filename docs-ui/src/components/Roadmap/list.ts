export type RoadmapItem = {
  title: string;
  status: 'notStarted' | 'inProgress' | 'inReview' | 'completed';
};

export const list: RoadmapItem[] = [
  {
    title: 'Remove Vanilla Extract and use pure CSS instead',
    status: 'inProgress',
  },
  {
    title: 'Add collapsing across breakpoints for the Inline component',
    status: 'notStarted',
  },
  {
    title: 'Add reversing the order for the Inline component',
    status: 'notStarted',
  },
  {
    title: 'Set up Storybook',
    status: 'completed',
  },
  {
    title: 'Set up iconography',
    status: 'completed',
  },
  {
    title: 'Set up global tokens',
    status: 'inProgress',
  },
  {
    title: 'Set up theming system',
    status: 'inProgress',
  },
  {
    title: 'Create first pass at box component',
    status: 'completed',
  },
  {
    title: 'Create first pass at stack component',
    status: 'completed',
  },
  {
    title: 'Create first pass at inline component',
    status: 'completed',
  },
];
