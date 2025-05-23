import { classNamePropDefs, stylePropDefs } from '@/utils/propDefs';
import type { PropDef } from '@/utils/propDefs';

export const avatarPropDefs: Record<string, PropDef> = {
  src: {
    type: 'string',
  },
  name: {
    type: 'string',
  },
  size: {
    type: 'enum',
    values: ['small', 'medium', 'large'],
    default: 'medium',
    responsive: true,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
