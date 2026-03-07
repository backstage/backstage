import type { PropDef } from '@/utils/propDefs';

export const timelinePropDefs: Record<string, PropDef> = {
  children: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Timeline items to display',
    required: true,
  },
  className: {
    type: 'string',
    description: 'Additional CSS class name',
  },
};

export const timelineItemPropDefs: Record<string, PropDef> = {
  title: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Item title or heading',
    required: true,
  },
  description: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Item description or content',
  },
  timestamp: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Timestamp or date for the item',
  },
  icon: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Icon or marker for the item',
  },
  className: {
    type: 'string',
    description: 'Additional CSS class name',
  },
};
