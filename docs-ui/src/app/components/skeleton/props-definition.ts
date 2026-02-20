import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const skeletonPropDefs: Record<string, PropDef> = {
  width: {
    type: 'string',
    default: '80',
    description:
      'The width of the skeleton. Accepts a number (pixels) or CSS string value.',
  },
  height: {
    type: 'string',
    default: '24',
    description:
      'The height of the skeleton. Accepts a number (pixels) or CSS string value.',
  },
  rounded: {
    type: 'boolean',
    default: 'false',
    description:
      'Whether to apply fully rounded corners (for circular shapes).',
  },
  children: {
    type: 'enum',
    values: ['ReactNode'],
    required: false,
    responsive: false,
    description:
      'Children elements. When provided, the skeleton will infer its dimensions from the children, preventing layout shift.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
