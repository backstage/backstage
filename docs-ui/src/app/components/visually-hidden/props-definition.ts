import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const visuallyHiddenPropDefs: Record<string, PropDef> = {
  children: {
    type: 'enum',
    values: ['ReactNode'],
    responsive: false,
    description:
      'Content to hide visually while remaining accessible to screen readers.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
