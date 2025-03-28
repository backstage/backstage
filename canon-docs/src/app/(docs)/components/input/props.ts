import { classNamePropDefs, stylePropDefs } from '../../../../utils/propDefs';
import type { PropDef } from '../../../../utils/propDefs';

export const inputPropDefs: Record<string, PropDef> = {
  size: {
    type: 'enum',
    values: ['sm', 'md'],
    default: 'md',
    responsive: false,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
