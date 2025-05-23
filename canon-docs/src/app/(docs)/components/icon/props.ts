import { classNamePropDefs, stylePropDefs } from '../../../../utils/propDefs';
import type { PropDef } from '../../../../utils/propDefs';

export const iconPropDefs: Record<string, PropDef> = {
  name: {
    type: 'enum',
    values: 'icon',
    responsive: false,
  },
  size: {
    type: 'number',
    responsive: false,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
