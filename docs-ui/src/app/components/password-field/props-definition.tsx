import { classNamePropDefs, type PropDef } from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const passwordFieldPropDefs: Record<string, PropDef> = {
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'small',
    responsive: true,
    description: (
      <>
        Visual size of the input. Use <Chip>small</Chip> for dense layouts,{' '}
        <Chip>medium</Chip> for prominent fields.
      </>
    ),
  },
  label: {
    type: 'string',
    description: 'Visible label displayed above the input.',
  },
  secondaryLabel: {
    type: 'string',
    description: (
      <>
        Secondary text shown next to the label. If not provided and isRequired
        is true, displays <Chip>Required</Chip>.
      </>
    ),
  },
  description: {
    type: 'string',
    description: 'Help text displayed below the label.',
  },
  icon: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Icon rendered before the input.',
  },
  placeholder: {
    type: 'string',
    description: 'Text displayed when the input is empty.',
  },
  name: {
    type: 'string',
    description: 'Form field name for submission.',
  },
  isRequired: {
    type: 'boolean',
    description: 'Whether the field is required for form submission.',
  },
  isDisabled: {
    type: 'boolean',
    description: 'Whether the input is disabled.',
  },
  isReadOnly: {
    type: 'boolean',
    description: 'Whether the input is read-only.',
  },
  value: {
    type: 'string',
    description: 'Controlled value of the input.',
  },
  defaultValue: {
    type: 'string',
    description: 'Default value for uncontrolled usage.',
  },
  onChange: {
    type: 'enum',
    values: ['(value: string) => void'],
    description: 'Handler called when the input value changes.',
  },
  isInvalid: {
    type: 'boolean',
    description: 'Whether the field is in an invalid state.',
  },
  ...classNamePropDefs,
};
