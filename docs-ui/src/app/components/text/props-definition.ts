import {
  childrenPropDefs,
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const textPropDefs: Record<string, PropDef> = {
  variant: {
    type: 'enum',
    values: [
      'title-large',
      'title-medium',
      'title-small',
      'title-x-small',
      'body-large',
      'body-medium',
      'body-small',
      'body-x-small',
    ],
    default: 'body-medium',
    responsive: true,
  },
  weight: {
    type: 'enum',
    values: ['regular', 'bold'],
    default: 'regular',
    responsive: true,
  },
  color: {
    type: 'enum',
    values: [
      'primary',
      'secondary',
      'tertiary',
      'danger',
      'warning',
      'success',
    ],
    default: 'primary',
    responsive: true,
  },
  as: {
    type: 'enum',
    values: ['p', 'span', 'div', 'label', 'legend'],
    default: 'span',
  },
  truncate: {
    type: 'boolean',
    default: 'false',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
