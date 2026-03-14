import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const autocompletePropDefs: Record<string, PropDef> = {
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
  options: {
    type: 'enum',
    values: ['Array<{value: string, label: string, disabled?: boolean}>'],
    description: 'The list of options available in the dropdown.',
  },
  placeholder: {
    type: 'string',
    description: 'Text displayed when the input is empty.',
  },
  name: {
    type: 'string',
    description: 'Form field name for submission.',
  },
  allowsCustomValue: {
    type: 'boolean',
    default: 'false',
    description:
      'Whether the autocomplete allows custom values that are not in the options list.',
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
  inputValue: {
    type: 'string',
    description: 'Controlled input value (what user types).',
  },
  defaultInputValue: {
    type: 'string',
    description: 'Default input value for uncontrolled usage.',
  },
  selectedKey: {
    type: 'string',
    description: 'Controlled selected option key.',
  },
  defaultSelectedKey: {
    type: 'string',
    description: 'Default selected option key for uncontrolled usage.',
  },
  onInputChange: {
    type: 'enum',
    values: ['(value: string) => void'],
    description: 'Handler called when the input value changes.',
  },
  onSelectionChange: {
    type: 'enum',
    values: ['(key: string | null) => void'],
    description: 'Handler called when an option is selected.',
  },
  displayMode: {
    type: 'enum',
    values: ['listbox', 'menu', 'grid', 'tags', 'table'],
    default: 'listbox',
    description: (
      <>
        Display mode for the dropdown options. <Chip>listbox</Chip> shows a
        simple list, <Chip>menu</Chip> adds icons and descriptions,{' '}
        <Chip>grid</Chip> arranges items in a grid, <Chip>tags</Chip> displays
        as tag-like items, and <Chip>table</Chip> shows data in columns.
      </>
    ),
  },
  gridConfig: {
    type: 'enum',
    values: ['{columns?: number | "auto", gap?: string}'],
    description: (
      <>
        Configuration for grid display mode. Set <Chip>columns</Chip> to a
        number or <Chip>auto</Chip>, and <Chip>gap</Chip> for spacing.
      </>
    ),
  },
  tableColumns: {
    type: 'enum',
    values: ['Array<{key, label, width?, render?}>'],
    description:
      'Column configuration for table display mode. Each column defines a key, label, optional width, and optional render function.',
  },
  renderOption: {
    type: 'enum',
    values: ['(item: AutocompleteOption) => ReactNode'],
    description:
      'Custom render function for options. Overrides default rendering.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
