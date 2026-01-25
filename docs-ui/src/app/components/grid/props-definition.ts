import {
  childrenPropDefs,
  classNamePropDefs,
  gapPropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const gridPropDefs: Record<string, PropDef> = {
  columns: {
    type: 'string',
    responsive: true,
  },
  rows: {
    type: 'string',
    responsive: true,
  },
  ...gapPropDefs,
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
