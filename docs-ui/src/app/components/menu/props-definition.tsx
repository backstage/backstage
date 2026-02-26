import { classNamePropDefs, type PropDef } from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const menuTriggerPropDefs: Record<string, PropDef> = {
  isOpen: {
    type: 'boolean',
    description: 'Controlled open state of the menu.',
  },
  defaultOpen: {
    type: 'boolean',
    description: 'Whether the menu is open by default.',
  },
  onOpenChange: {
    type: 'enum',
    values: ['(isOpen: boolean) => void'],
    description: 'Handler called when the open state changes.',
  },
};

export const submenuTriggerPropDefs: Record<string, PropDef> = {
  delay: {
    type: 'number',
    default: '200',
    description: 'Delay in milliseconds before the submenu opens on hover.',
  },
};

export const menuPropDefs: Record<string, PropDef> = {
  placement: {
    type: 'enum',
    values: [
      'top',
      'bottom',
      'left',
      'right',
      'top start',
      'top end',
      'bottom start',
      'bottom end',
      'left start',
      'left end',
      'right start',
      'right end',
    ],
    description: 'Position of the menu relative to the trigger.',
  },
  onAction: {
    type: 'enum',
    values: ['(key: Key) => void'],
    description:
      'Handler called when an item is activated. Receives the item key.',
  },
  selectionMode: {
    type: 'enum',
    values: ['none', 'single', 'multiple'],
    description: 'How items can be selected.',
  },
  selectedKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
    description: 'Controlled selected keys.',
  },
  defaultSelectedKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
    description: 'Default selected keys for uncontrolled usage.',
  },
  disabledKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
    description: 'Keys of items that are disabled.',
  },
  virtualized: {
    type: 'boolean',
    default: false,
    description: 'Enable virtualization for large lists.',
  },
  maxWidth: {
    type: 'string',
    description: 'Maximum width of the menu popover.',
  },
  maxHeight: {
    type: 'string',
    description: 'Maximum height of the menu popover.',
  },
  ...classNamePropDefs,
};

export const menuListBoxPropDefs: Record<string, PropDef> = {
  placement: {
    type: 'enum',
    values: [
      'top',
      'bottom',
      'left',
      'right',
      'top start',
      'top end',
      'bottom start',
      'bottom end',
      'left start',
      'left end',
      'right start',
      'right end',
    ],
    description: 'Position of the list box relative to the trigger.',
  },
  selectionMode: {
    type: 'enum',
    values: ['none', 'single', 'multiple'],
    description: 'How items can be selected.',
  },
  selectedKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
    description: 'Controlled selected keys.',
  },
  defaultSelectedKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
    description: 'Default selected keys for uncontrolled usage.',
  },
  onSelectionChange: {
    type: 'enum',
    values: ['(keys: Selection) => void'],
    description: 'Handler called when selection changes.',
  },
  disabledKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
    description: 'Keys of items that are disabled.',
  },
  virtualized: {
    type: 'boolean',
    default: false,
    description: 'Enable virtualization for large lists.',
  },
  maxWidth: {
    type: 'string',
    description: 'Maximum width of the list box popover.',
  },
  maxHeight: {
    type: 'string',
    description: 'Maximum height of the list box popover.',
  },
  ...classNamePropDefs,
};

export const menuAutocompletePropDefs: Record<string, PropDef> = {
  placeholder: {
    type: 'string',
    description: 'Placeholder text for the search input.',
  },
  placement: {
    type: 'enum',
    values: [
      'top',
      'bottom',
      'left',
      'right',
      'top start',
      'top end',
      'bottom start',
      'bottom end',
      'left start',
      'left end',
      'right start',
      'right end',
    ],
    description: 'Position of the menu relative to the trigger.',
  },
  onAction: {
    type: 'enum',
    values: ['(key: Key) => void'],
    description:
      'Handler called when an item is activated. Receives the item key.',
  },
  selectionMode: {
    type: 'enum',
    values: ['none', 'single', 'multiple'],
    description: 'How items can be selected.',
  },
  selectedKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
    description: 'Controlled selected keys.',
  },
  defaultSelectedKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
    description: 'Default selected keys for uncontrolled usage.',
  },
  disabledKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
    description: 'Keys of items that are disabled.',
  },
  onSelectionChange: {
    type: 'enum',
    values: ['(keys: Selection) => void'],
    description: 'Handler called when selection changes.',
  },
  virtualized: {
    type: 'boolean',
    default: false,
    description: 'Enable virtualization for large lists.',
  },
  maxWidth: {
    type: 'string',
    description: 'Maximum width of the menu popover.',
  },
  maxHeight: {
    type: 'string',
    description: 'Maximum height of the menu popover.',
  },
  ...classNamePropDefs,
};

export const menuAutocompleteListboxPropDefs: Record<string, PropDef> = {
  placeholder: {
    type: 'string',
    description: 'Placeholder text for the search input.',
  },
  placement: {
    type: 'enum',
    values: [
      'top',
      'bottom',
      'left',
      'right',
      'top start',
      'top end',
      'bottom start',
      'bottom end',
      'left start',
      'left end',
      'right start',
      'right end',
    ],
    description: 'Position of the list box relative to the trigger.',
  },
  selectionMode: {
    type: 'enum',
    values: ['none', 'single', 'multiple'],
    description: 'How items can be selected.',
  },
  selectedKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
    description: 'Controlled selected keys.',
  },
  defaultSelectedKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
    description: 'Default selected keys for uncontrolled usage.',
  },
  onSelectionChange: {
    type: 'enum',
    values: ['(keys: Selection) => void'],
    description: 'Handler called when selection changes.',
  },
  virtualized: {
    type: 'boolean',
    default: false,
    description: 'Enable virtualization for large lists.',
  },
  maxWidth: {
    type: 'string',
    description: 'Maximum width of the list box popover.',
  },
  maxHeight: {
    type: 'string',
    description: 'Maximum height of the list box popover.',
  },
  ...classNamePropDefs,
};

export const menuItemPropDefs: Record<string, PropDef> = {
  children: {
    type: 'enum',
    values: ['ReactNode'],
    required: true,
    description: 'Content displayed in the menu item.',
  },
  id: {
    type: 'enum',
    values: ['Key'],
    description: 'Unique key for the item.',
  },
  iconStart: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Icon displayed before the item content.',
  },
  color: {
    type: 'enum',
    values: ['primary', 'danger'],
    description: (
      <>
        Color variant. Use <Chip>danger</Chip> for destructive actions.
      </>
    ),
  },
  href: {
    type: 'string',
    description: 'URL to navigate to when the item is clicked.',
  },
  isDisabled: {
    type: 'boolean',
    description: 'Whether the item is disabled.',
  },
  textValue: {
    type: 'string',
    description: 'Text used for typeahead and accessibility.',
  },
  onAction: {
    type: 'enum',
    values: ['() => void'],
    description: 'Handler called when the item is activated.',
  },
  ...classNamePropDefs,
};

export const menuListBoxItemPropDefs: Record<string, PropDef> = {
  children: {
    type: 'enum',
    values: ['ReactNode'],
    required: true,
    description: 'Content displayed in the list box item.',
  },
  id: {
    type: 'enum',
    values: ['Key'],
    description: 'Unique key for the item.',
  },
  textValue: {
    type: 'string',
    description: 'Text used for typeahead and accessibility.',
  },
  isDisabled: {
    type: 'boolean',
    description: 'Whether the item is disabled.',
  },
  ...classNamePropDefs,
};

export const menuSectionPropDefs: Record<string, PropDef> = {
  title: {
    type: 'string',
    required: true,
    description: 'Heading displayed above the section.',
  },
  children: {
    type: 'enum',
    values: ['ReactNode'],
    required: true,
    description: 'Menu items within the section.',
  },
  ...classNamePropDefs,
};

export const menuSeparatorPropDefs: Record<string, PropDef> = {
  ...classNamePropDefs,
};
