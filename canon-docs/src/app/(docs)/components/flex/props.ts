import {
  PropDef,
  childrenPropDefs,
  classNamePropDefs,
  stylePropDefs,
} from '../../../../utils/propDefs';

export const flexPropDefs: Record<string, PropDef> = {
  align: {
    type: 'enum',
    values: ['start', 'center', 'end', 'baseline', 'stretch'],
    responsive: true,
  },
  direction: {
    type: 'enum',
    values: ['row', 'column', 'row-reverse', 'column-reverse'],
    responsive: true,
  },
  justify: {
    type: 'enum',
    values: ['start', 'center', 'end', 'between'],
    responsive: true,
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
