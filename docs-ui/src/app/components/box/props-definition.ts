import {
  classNamePropDefs,
  displayPropDefs,
  heightPropDefs,
  positionPropDefs,
  stylePropDefs,
  widthPropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const boxPropDefs: Record<string, PropDef> = {
  as: {
    type: 'enum',
    values: ['div', 'span'],
    default: 'div',
    responsive: true,
  },
  ...widthPropDefs,
  ...heightPropDefs,
  ...positionPropDefs,
  ...displayPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
