import { classNamePropDefs, stylePropDefs } from '../../../../utils/propDefs';
import type { PropDef } from '../../../../utils/propDefs';

export const checkboxPropDefs: Record<string, PropDef> = {
  label: {
    type: 'string',
    responsive: false,
  },
  defaultChecked: {
    type: 'enum',
    values: ['boolean', "'indeterminate'"],
    responsive: false,
  },
  checked: {
    type: 'enum',
    values: ['boolean', "'indeterminate'"],
    responsive: false,
  },
  onChange: {
    type: 'enum',
    values: ["(checked: boolean | 'indeterminate') => void"],
    responsive: false,
  },
  disabled: {
    type: 'enum',
    values: ['boolean'],
    responsive: false,
  },
  required: {
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
