import { classNamePropDefs, stylePropDefs } from '@/utils/propDefs';
import type { PropDef } from '@/utils/propDefs';

export const linkPropDefs: Record<string, PropDef> = {
  to: {
    type: 'string',
  },
  variant: {
    type: 'enum',
    values: ['subtitle', 'body', 'caption', 'label'],
    default: 'body',
    responsive: true,
  },
  weight: {
    type: 'enum',
    values: ['regular', 'bold'],
    default: 'regular',
    responsive: true,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
