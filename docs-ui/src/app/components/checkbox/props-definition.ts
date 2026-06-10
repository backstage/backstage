import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const checkboxPropDefs: Record<string, PropDef> = {
  children: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Inline label displayed next to the checkbox.',
  },
  label: {
    type: 'string',
    description: 'Visible label displayed above the checkbox.',
  },
  secondaryLabel: {
    type: 'string',
    description:
      'Secondary text shown next to the label. If not provided and isRequired is true, displays "Required".',
  },
  description: {
    type: 'string',
    description: 'Help text displayed below the label.',
  },
  isSelected: {
    type: 'boolean',
    description: 'Controls checked state (controlled mode).',
  },
  defaultSelected: {
    type: 'boolean',
    description: 'Initial checked state (uncontrolled mode).',
  },
  onChange: {
    type: 'enum',
    values: ['(isSelected: boolean) => void'],
    description: 'Called when the checked state changes.',
  },
  isDisabled: {
    type: 'boolean',
    description: 'Prevents interaction and applies disabled styling.',
  },
  isRequired: {
    type: 'boolean',
    description: 'Marks the checkbox as required for form validation.',
  },
  isIndeterminate: {
    type: 'boolean',
    description: 'Shows a mixed state, typically for "select all" checkboxes.',
  },
  name: {
    type: 'string',
    description: 'Name attribute for form submission.',
  },
  value: {
    type: 'string',
    description: 'Value attribute for form submission.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
