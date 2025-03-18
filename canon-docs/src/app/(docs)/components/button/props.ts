import { classNamePropDefs, stylePropDefs } from '../../../../utils/propDefs';
import type { PropDef } from '../../../../utils/propDefs';

export const buttonPropDefs: Record<string, PropDef> = {
  variant: {
    type: 'enum',
    values: ['primary', 'secondary'],
    default: 'primary',
    responsive: true,
  },
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'medium',
    responsive: true,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
