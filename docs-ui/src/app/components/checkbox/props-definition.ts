import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const checkboxPropDefs: Record<string, PropDef> = {
  children: {
    type: 'enum',
    values: ['React.ReactNode'],
    responsive: false,
  },
  isSelected: {
    type: 'enum',
    values: ['boolean'],
    responsive: false,
  },
  defaultSelected: {
    type: 'enum',
    values: ['boolean'],
    responsive: false,
  },
  onChange: {
    type: 'enum',
    values: ['(isSelected: boolean) => void'],
    responsive: false,
  },
  isDisabled: {
    type: 'enum',
    values: ['boolean'],
    responsive: false,
  },
  isRequired: {
    type: 'enum',
    values: ['boolean'],
    responsive: false,
  },
  name: {
    type: 'string',
    responsive: false,
  },
  value: {
    type: 'string',
    responsive: false,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
