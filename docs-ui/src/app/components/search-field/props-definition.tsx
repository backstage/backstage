import { classNamePropDefs, type PropDef } from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const searchFieldPropDefs: Record<string, PropDef> = {
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'small',
    responsive: true,
    description: (
      <>
        Visual size of the input. Use <Chip>small</Chip> for inline or dense
        layouts, <Chip>medium</Chip> for standalone fields.
      </>
    ),
  },
  label: {
    type: 'string',
    description: 'The visible label for the search field.',
  },
  secondaryLabel: {
    type: 'string',
    description: (
      <>
        Secondary label text. Defaults to <Chip>Required</Chip> when isRequired
        is true.
      </>
    ),
  },
  description: {
    type: 'string',
    description: 'Helper text displayed below the label.',
  },
  placeholder: {
    type: 'string',
    default: 'Search',
    description: 'Placeholder text shown when the field is empty.',
  },
  icon: {
    type: 'enum',
    values: ['ReactNode', 'false'],
    description:
      'Icon displayed before the input. Set to false to hide the icon.',
  },
  startCollapsed: {
    type: 'boolean',
    default: 'false',
    description:
      'Whether the search field starts in a collapsed state. Expands on focus.',
  },
  name: {
    type: 'string',
    description: 'The name of the input for form submission.',
  },
  value: {
    type: 'string',
    description: 'The current value (controlled).',
  },
  defaultValue: {
    type: 'string',
    description: 'The default value (uncontrolled).',
  },
  onChange: {
    type: 'enum',
    values: ['(value: string) => void'],
    description: 'Handler called when the value changes.',
  },
  isDisabled: {
    type: 'boolean',
    description: 'Whether the search field is disabled.',
  },
  isReadOnly: {
    type: 'boolean',
    description: 'Whether the search field is read-only.',
  },
  isRequired: {
    type: 'boolean',
    description: 'Whether a value is required before form submission.',
  },
  isInvalid: {
    type: 'boolean',
    description: 'Whether the search field is in an invalid state.',
  },
  ...classNamePropDefs,
};
