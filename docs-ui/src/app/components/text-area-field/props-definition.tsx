import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const textAreaFieldPropDefs: Record<string, PropDef> = {
  label: {
    type: 'string',
    description: 'Visible label displayed above the text area.',
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
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'small',
    responsive: true,
    description: (
      <>
        Visual size of the text area. Use <Chip>small</Chip> for dense layouts,{' '}
        <Chip>medium</Chip> for prominent fields.
      </>
    ),
  },
  rows: {
    type: 'number',
    default: '3',
    description:
      'Number of visible text lines, controlling the initial and minimum height.',
  },
  placeholder: {
    type: 'string',
    description: 'Text displayed when the text area is empty.',
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
    description: 'Whether the text area is disabled.',
  },
  isReadOnly: {
    type: 'boolean',
    description: 'Whether the text area is read-only.',
  },
  value: {
    type: 'string',
    description: 'Controlled value of the text area.',
  },
  defaultValue: {
    type: 'string',
    description: 'Default value for uncontrolled usage.',
  },
  onChange: {
    type: 'enum',
    values: ['(value: string) => void'],
    description: 'Handler called when the text area value changes.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
