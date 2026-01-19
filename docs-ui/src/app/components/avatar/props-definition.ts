import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const avatarPropDefs: Record<string, PropDef> = {
  src: {
    type: 'string',
  },
  name: {
    type: 'string',
    required: true,
  },
  size: {
    type: 'enum',
    values: ['x-small', 'small', 'medium', 'large', 'x-large'],
    default: 'medium',
    responsive: true,
  },
  purpose: {
    type: 'enum',
    values: ['informative', 'decoration'],
    default: 'informative',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
