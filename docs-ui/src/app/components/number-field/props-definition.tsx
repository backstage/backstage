import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const numberFieldPropDefs: Record<string, PropDef> = {
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
  minValue: {
    type: 'number',
    description: 'Minimum allowed value.',
  },
  maxValue: {
    type: 'number',
    description: 'Maximum allowed value.',
  },
  step: {
    type: 'number',
    description: 'Step increment for arrow key changes.',
  },
  formatOptions: {
    type: 'enum',
    values: ['Intl.NumberFormatOptions'],
    description: (
      <>
        Number formatting options. Defaults to{' '}
        <Chip>{'useGrouping: false'}</Chip>.
      </>
    ),
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
    type: 'number',
    description: 'Controlled value of the input.',
  },
  defaultValue: {
    type: 'number',
    description: 'Default value for uncontrolled usage.',
  },
  onChange: {
    type: 'enum',
    values: ['(value: number) => void'],
    description: 'Handler called when the input value changes.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
