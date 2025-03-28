import {
  childrenPropDefs,
  classNamePropDefs,
  stylePropDefs,
} from '../../../../utils/propDefs';
import type { PropDef } from '../../../../utils/propDefs';

export const textPropDefs: Record<string, PropDef> = {
  variant: {
    type: 'enum',
    values: ['display', 'title1', 'title2', 'title3', 'title4', 'title5'],
    responsive: true,
  },
  weight: {
    type: 'enum',
    values: ['regular', 'bold'],
    responsive: true,
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
