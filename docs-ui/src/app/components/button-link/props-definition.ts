import {
  classNamePropDefs,
  stylePropDefs,
  childrenPropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const buttonLinkPropDefs: Record<string, PropDef> = {
  variant: {
    type: 'enum',
    values: ['primary', 'secondary', 'tertiary'],
    default: 'primary',
    responsive: true,
  },
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'medium',
    responsive: true,
  },
  iconStart: { type: 'enum', values: ['ReactNode'], responsive: false },
  iconEnd: { type: 'enum', values: ['ReactNode'], responsive: false },
  isDisabled: { type: 'boolean', default: 'false', responsive: false },
  href: { type: 'string', required: true },
  target: {
    type: 'enum',
    values: ['_self', '_blank', '_parent', '_top'],
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
