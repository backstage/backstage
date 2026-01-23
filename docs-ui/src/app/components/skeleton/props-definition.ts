import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const skeletonPropDefs: Record<string, PropDef> = {
  width: {
    type: 'number',
    default: '80',
    responsive: false,
  },
  height: {
    type: 'number',
    default: '24',
    responsive: false,
  },
  rounded: {
    type: 'boolean',
    default: 'false',
    responsive: false,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
