import {
  PropDef,
  childrenPropDefs,
  classNamePropDefs,
  stylePropDefs,
} from '../../../../utils/propDefs';

const columnsValues = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
];

export const gridPropDefs: Record<string, PropDef> = {
  columns: {
    type: 'enum | string',
    values: [...columnsValues, 'auto'],
    responsive: true,
    default: 'auto',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const gridItemPropDefs: Record<string, PropDef> = {
  colSpan: {
    type: 'enum | string',
    values: [...columnsValues, 'full'],
    responsive: true,
  },
  rowSpan: {
    type: 'enum | string',
    values: [...columnsValues, 'full'],
    responsive: true,
  },
  start: {
    type: 'enum | string',
    values: [...columnsValues, 'auto'],
    responsive: true,
  },
  end: {
    type: 'enum | string',
    values: [...columnsValues, 'auto'],
    responsive: true,
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
