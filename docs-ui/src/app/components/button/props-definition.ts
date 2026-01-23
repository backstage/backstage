import { classNamePropDefs, stylePropDefs } from '@/utils/propDefs';
import type { PropDef } from '@/utils/propDefs';

export const buttonPropDefs: Record<string, PropDef> = {
  variant: {
    type: 'enum',
    values: ['primary', 'secondary'],
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
  loading: { type: 'boolean', default: 'false', responsive: false },
  children: { type: 'enum', values: ['ReactNode'], responsive: false },
  type: {
    type: 'enum',
    values: ['button', 'submit', 'reset'],
    default: 'button',
    responsive: false,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
