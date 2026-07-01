import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const comboboxItemPropDefs: Record<string, PropDef> = {
  id: {
    type: 'enum',
    values: ['Key'],
    description:
      'Item identity for static composition. Dynamic items receive the id from their source item.',
  },
  textValue: {
    type: 'string',
    required: true,
    description:
      'Plain text used for filtering, keyboard navigation, and accessibility.',
  },
  children: {
    type: 'enum',
    values: ['ReactNode', '(values: ListBoxItemRenderProps) => ReactNode'],
    required: true,
    description:
      'Custom item content. Use the render function to respond to item state.',
  },
  showSelectionIndicator: {
    type: 'boolean',
    default: 'false',
    description:
      'Uses the standard BUI selection indicator and item content layout.',
  },
  isDisabled: {
    type: 'boolean',
    default: 'false',
    description: 'Whether the item is disabled.',
  },
  ...classNamePropDefs,
};

export const comboboxItemTextPropDefs: Record<string, PropDef> = {
  id: {
    type: 'enum',
    values: ['Key'],
    description:
      'Item identity for static composition. Dynamic items receive the id from their source item.',
  },
  title: {
    type: 'string',
    required: true,
    description: 'Primary item text.',
  },
  description: {
    type: 'string',
    description: 'Secondary text displayed below the title.',
  },
  leadingIcon: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Icon displayed before the item text.',
  },
  isDisabled: {
    type: 'boolean',
    default: 'false',
    description: 'Whether the item is disabled.',
  },
  ...classNamePropDefs,
};

export const comboboxItemProfilePropDefs: Record<string, PropDef> = {
  id: {
    type: 'enum',
    values: ['Key'],
    description:
      'Item identity for static composition. Dynamic items receive the id from their source item.',
  },
  name: {
    type: 'string',
    required: true,
    description: 'Profile name.',
  },
  src: {
    type: 'string',
    description:
      'Avatar image source. The avatar displays initials when omitted.',
  },
  isDisabled: {
    type: 'boolean',
    default: 'false',
    description: 'Whether the item is disabled.',
  },
  ...classNamePropDefs,
};

export const comboboxPropDefs: Record<string, PropDef> = {
  options: {
    type: 'enum',
    values: ['(Option | OptionSection)[]', 'AsyncListSource<IdentifiedOption>'],
    description: (
      <>
        Options to display in the dropdown. Pass <Chip>Option</Chip> objects
        directly, or <Chip>OptionSection</Chip> objects to render grouped
        options under section headings. Pass a <Chip>useAsyncList</Chip> result
        directly for flat async options.
      </>
    ),
  },
  items: {
    type: 'enum',
    values: ['Iterable<T>', 'AsyncListSource<T>'],
    description:
      'Domain objects to render with a child function. Every item must have an id.',
  },
  children: {
    type: 'enum',
    values: ['ReactElement', 'ReactElement[]', '(item: T) => ReactElement'],
    description:
      'Static item components, or a render function used together with items.',
  },
  dependencies: {
    type: 'enum',
    values: ['ReadonlyArray<unknown>'],
    description:
      'Values outside each item that invalidate cached dynamic item rendering.',
  },
  search: {
    type: 'enum',
    values: ['true', 'ComboboxSearch<T>', 'ComboboxAsyncSearch<T>'],
    description:
      'Configures client or server search behavior. Omit it to filter loaded items with the default contains match.',
  },
  loading: {
    type: 'enum',
    values: ['{ state: LoadingState; onLoadMore?: () => void }'],
    description:
      'Manual loading state for non-async collections. Async sources provide this automatically.',
  },
  allowsCustomValue: {
    type: 'boolean',
    default: 'false',
    description:
      'Allows unmatched text to remain in the input when committed. No option is selected for the custom text.',
  },
  value: {
    type: 'enum',
    values: ['Key', 'T', 'null'],
    description:
      'Controlled selection. Regular collections use an item key; direct async server collections use the full selected item.',
  },
  defaultValue: {
    type: 'enum',
    values: ['Key', 'T', 'null'],
    description:
      'Initial uncontrolled selection. Regular collections use an item key; direct async server collections use the full selected item.',
  },
  onChange: {
    type: 'enum',
    values: ['(value: Key | null) => void', '(item: T | null) => void'],
    description:
      'Called when selection changes. Direct async server collections emit the full selected item.',
  },
  selectedKey: {
    type: 'enum',
    values: ['Key'],
    deprecated: true,
    description: 'Deprecated compatibility alias for value.',
  },
  defaultSelectedKey: {
    type: 'enum',
    values: ['Key'],
    deprecated: true,
    description: 'Deprecated compatibility alias for defaultValue.',
  },
  onSelectionChange: {
    type: 'enum',
    values: ['(key: Key | null) => void'],
    deprecated: true,
    description: 'Deprecated compatibility alias for onChange.',
  },
  inputValue: {
    type: 'string',
    deprecated: true,
    description:
      'Deprecated compatibility prop for static option arrays. Use search.inputValue instead.',
  },
  defaultInputValue: {
    type: 'string',
    deprecated: true,
    description:
      'Deprecated compatibility prop for static option arrays. Use search.defaultInputValue instead.',
  },
  onInputChange: {
    type: 'enum',
    values: ['(value: string) => void'],
    deprecated: true,
    description:
      'Deprecated compatibility prop for static option arrays. Use search.onInputChange instead.',
  },
  defaultFilter: {
    type: 'enum',
    values: ['(textValue: string, inputValue: string) => boolean'],
    deprecated: true,
    description:
      'Deprecated compatibility prop for static option arrays. Use search.filter instead.',
  },
  label: {
    type: 'string',
    description: 'Visible label above the combobox.',
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
    description: 'Helper text displayed below the label.',
  },
  placeholder: {
    type: 'string',
    description: 'Text shown when the input is empty.',
  },
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'small',
    responsive: true,
    description: 'Visual size of the combobox field.',
  },
  icon: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Icon displayed before the input.',
  },
  onOpenChange: {
    type: 'enum',
    values: ['(isOpen: boolean) => void'],
    description: 'Called when the dropdown opens or closes.',
  },
  isOpen: {
    type: 'boolean',
    description: 'Controlled open state. Use with onOpenChange.',
  },
  defaultOpen: {
    type: 'boolean',
    description: 'Initial open state for uncontrolled usage.',
  },
  isDisabled: {
    type: 'boolean',
    description: 'Prevents user interaction when true.',
  },
  disabledKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
    description: 'Keys of options that should be disabled.',
  },
  isRequired: {
    type: 'boolean',
    description: 'Marks the field as required for form validation.',
  },
  isInvalid: {
    type: 'boolean',
    description: 'Displays the combobox in an error state.',
  },
  name: {
    type: 'string',
    description: 'Form field name for form submission.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
