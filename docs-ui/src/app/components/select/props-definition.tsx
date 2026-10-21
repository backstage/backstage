import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const optionPropDefs: Record<string, PropDef> = {
  id: {
    type: 'string',
    description:
      'Preferred unique identity for the option. Required for new option features and async option sources.',
  },
  value: {
    type: 'string',
    deprecated: true,
    description:
      'Deprecated compatibility identity for static option arrays. Use id instead.',
  },
  label: {
    type: 'string',
    required: true,
    description: 'Display text for the option.',
  },
  disabled: {
    type: 'boolean',
    description: 'Whether the option is disabled.',
  },
  description: {
    type: 'string',
    description:
      'Secondary text displayed below the option label. Requires id instead of the deprecated value field.',
  },
  leadingIcon: {
    type: 'enum',
    values: ['ReactNode'],
    description:
      'Icon displayed before the option text. Requires id instead of the deprecated value field.',
  },
};

export const optionSectionPropDefs: Record<string, PropDef> = {
  title: {
    type: 'string',
    required: true,
    description: 'Heading displayed above the grouped options.',
  },
  options: {
    type: 'enum',
    values: ['Option[]'],
    required: true,
    description: 'Options nested inside the section.',
  },
};

export const selectItemPropDefs: Record<string, PropDef> = {
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
      'Plain text used for search, keyboard navigation, and accessibility.',
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

export const selectItemTextPropDefs: Record<string, PropDef> = {
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

export const selectItemProfilePropDefs: Record<string, PropDef> = {
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

export const selectPropDefs: Record<string, PropDef> = {
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
    values: ['true', 'SelectSearch<T>', 'SelectAsyncSearch<T>'],
    description:
      'Enables the search field and configures client or server search behavior. Client filters receive the full item.',
  },
  loading: {
    type: 'enum',
    values: ['{ state: LoadingState; onLoadMore?: () => void }'],
    description:
      'Manual loading state for non-async collections. Async sources provide this automatically.',
  },
  selectionMode: {
    type: 'enum',
    values: ['single', 'multiple'],
    default: 'single',
    description: 'Single or multiple selection mode.',
  },
  value: {
    type: 'enum',
    values: ['Key', 'Key[]', 'null'],
    description:
      'Controlled selected keys. Use one key for single selection or an array for multiple selection.',
  },
  defaultValue: {
    type: 'enum',
    values: ['Key', 'Key[]'],
    description:
      'Initial selected keys for uncontrolled usage. Use one key for single selection or an array for multiple selection.',
  },
  onChange: {
    type: 'enum',
    values: ['(key: Key | null) => void', '(keys: Key[]) => void'],
    description: 'Called when selection changes.',
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
  label: {
    type: 'string',
    description: 'Visible label above the select.',
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
    default: 'Select an option',
    description: 'Text shown when no option is selected.',
  },
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'small',
    responsive: true,
    description: 'Visual size of the select field.',
  },
  icon: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Icon displayed before the selected value.',
  },
  searchable: {
    type: 'boolean',
    default: false,
    deprecated: true,
    description:
      'Deprecated compatibility prop for static option arrays. Use search instead.',
  },
  searchPlaceholder: {
    type: 'string',
    default: 'Search...',
    deprecated: true,
    description:
      'Deprecated compatibility prop for static option arrays. Use search.placeholder instead.',
  },
  isOpen: {
    type: 'boolean',
    description: 'Controlled open state. Use with onOpenChange.',
  },
  defaultOpen: {
    type: 'boolean',
    description: 'Initial open state for uncontrolled usage.',
  },
  onOpenChange: {
    type: 'enum',
    values: ['(isOpen: boolean) => void'],
    description: 'Called when the dropdown opens or closes.',
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
    description: 'Displays the select in an error state.',
  },
  name: {
    type: 'string',
    description: 'Form field name for form submission.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
