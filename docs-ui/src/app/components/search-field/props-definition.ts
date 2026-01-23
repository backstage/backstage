import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const searchFieldPropDefs: Record<string, PropDef> = {
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
  startCollapsed: {
    type: 'boolean',
    default: 'false',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
