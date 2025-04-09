import { classNamePropDefs, stylePropDefs } from '../../../../utils/propDefs';
import type { PropDef } from '../../../../utils/propDefs';

export const inputPropDefs: Record<string, PropDef> = {
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'medium',
    responsive: false,
  },
  label: {
    type: 'string',
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
