import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const inputPropDefs: Record<string, PropDef> = {
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'small',
    responsive: true,
  },
  label: {
    type: 'string',
  },
  icon: {
    type: 'enum',
    values: ['ReactNode'],
  },
  description: {
    type: 'string',
  },
  name: {
    type: 'string',
    required: true,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
