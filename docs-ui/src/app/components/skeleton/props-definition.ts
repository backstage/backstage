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
  children: {
    type: 'string',
    default: 'undefined',
    responsive: false,
    description:
      'Children elements. When provided, the skeleton will infer its dimensions from the children, preventing layout shift.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
