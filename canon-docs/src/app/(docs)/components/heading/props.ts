import { classNamePropDefs, stylePropDefs } from '../../../../utils/propDefs';
import type { PropDef } from '../../../../utils/propDefs';

export const headingPropDefs: Record<string, PropDef> = {
  variant: {
    type: 'enum',
    values: ['display', 'title1', 'title2', 'title3', 'title4', 'title5'],
    responsive: true,
  },
  children: {
    type: 'enum',
    values: ['ReactNode'],
    responsive: false,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
