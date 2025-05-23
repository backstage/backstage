import { classNamePropDefs, stylePropDefs } from '../../../../utils/propDefs';
import type { PropDef } from '../../../../utils/propDefs';

export const selectPropDefs: Record<string, PropDef> = {
  label: {
    type: 'string',
    default: 'Select an option',
    responsive: false,
  },
  description: {
    type: 'string',
    responsive: false,
  },
  name: {
    type: 'string',
    responsive: false,
    required: true,
  },
  options: {
    type: 'enum',
    values: ['Array<{ value: string, label: string }>'],
    required: true,
  },
  value: {
    type: 'string',
    responsive: false,
  },
  defaultValue: {
    type: 'string',
    responsive: false,
  },
  placeholder: {
    type: 'string',
    responsive: false,
  },
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'medium',
    responsive: true,
  },
  onValueChange: {
    type: 'enum',
    values: ['(value: string) => void'],
    responsive: false,
  },
  onOpenChange: {
    type: 'enum',
    values: ['(open: boolean) => void'],
    responsive: false,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
