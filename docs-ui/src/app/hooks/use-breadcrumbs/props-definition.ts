import { type PropDef } from '@/utils/propDefs';

export const breadcrumbEntryDefs: Record<string, PropDef> = {
  label: {
    type: 'string',
    description: 'Display text for the breadcrumb.',
  },
  href: {
    type: 'string',
    description: 'Optional URL the breadcrumb links to.',
  },
};
