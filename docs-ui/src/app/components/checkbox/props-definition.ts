import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const checkboxPropDefs: Record<string, PropDef> = {
  children: {
    type: 'enum',
    values: ['ReactNode'],
    required: true,
    description: 'Label displayed next to the checkbox.',
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
