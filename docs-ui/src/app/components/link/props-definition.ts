import {
  childrenPropDefs,
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const linkPropDefs: Record<string, PropDef> = {
  href: {
    type: 'string',
    required: true,
  },
  target: {
    type: 'enum',
    values: ['_self', '_blank', '_parent', '_top'],
  },
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
  color: {
    type: 'enum',
    values: ['primary', 'secondary', 'tertiary', 'inherit'],
    default: 'primary',
  },
  underline: {
    type: 'enum',
    values: ['always', 'hover', 'none'],
    default: 'hover',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
