import {
  PropDef,
  classNamePropDefs,
  displayPropDefs,
  stylePropDefs,
} from '../../../../utils/propDefs';

export const gridPropDefs: Record<string, PropDef> = {
  columns: {
    type: 'enum | string',
    values: [
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
      'auto',
    ],
    responsive: true,
    default: 'auto',
  },
  children: {
    type: 'enum',
    values: ['ReactNode'],
    required: true,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
