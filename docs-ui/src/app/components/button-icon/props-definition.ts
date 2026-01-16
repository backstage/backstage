import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const buttonIconPropDefs: Record<string, PropDef> = {
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
  icon: { type: 'enum', values: ['ReactNode'], responsive: false },
  isDisabled: { type: 'boolean', default: 'false', responsive: false },
  loading: { type: 'boolean', default: 'false', responsive: false },
  type: {
    type: 'enum',
    values: ['button', 'submit', 'reset'],
    default: 'button',
    responsive: false,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
