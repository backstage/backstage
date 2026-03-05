import { classNamePropDefs, stylePropDefs } from '@/utils/propDefs';
import type { PropDef } from '@/utils/propDefs';

export const switchPropDefs: Record<string, PropDef> = {
  label: {
    type: 'string',
    description: 'Text label displayed next to the switch.',
  },
  isSelected: {
    type: 'boolean',
    description:
      'Controlled selected state. Use with onChange for controlled behavior.',
  },
  defaultSelected: {
    type: 'boolean',
    description: 'Initial selected state for uncontrolled usage.',
  },
  onChange: {
    type: 'enum',
    values: ['(isSelected: boolean) => void'],
    description: 'Called when the switch state changes.',
  },
  isDisabled: {
    type: 'boolean',
    description: 'Prevents user interaction when true.',
  },
  isReadOnly: {
    type: 'boolean',
    description: 'Makes the switch non-interactive but still focusable.',
  },
  name: {
    type: 'string',
    description: 'Form field name for form submission.',
  },
  value: {
    type: 'string',
    description: 'Form field value submitted when selected.',
  },
  autoFocus: {
    type: 'boolean',
    description: 'Focuses the switch on mount.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
