import {
  childrenPropDefs,
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const toggleButtonPropDefs: Record<string, PropDef> = {
  isSelected: {
    type: 'boolean',
    required: true,
  },
  onChange: {
    type: 'enum',
    values: ['(isSelected: boolean) => void'],
    required: true,
  },
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'medium',
    responsive: true,
  },
  icon: {
    type: 'enum',
    values: ['ReactNode'],
  },
  isDisabled: {
    type: 'boolean',
    default: 'false',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
