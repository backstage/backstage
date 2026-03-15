import {
  classNamePropDefs,
  childrenPropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const listBoxPropDefs: Record<string, PropDef> = {
  items: {
    type: 'enum',
    values: ['Iterable<T>'],
    description: 'Item objects in the collection.',
  },
  renderEmptyState: {
    type: 'enum',
    values: ['() => ReactNode'],
    description: 'Content to display when the collection is empty.',
  },
  selectionMode: {
    type: 'enum',
    values: ['none', 'single', 'multiple'],
    description: 'The type of selection allowed.',
  },
  selectedKeys: {
    type: 'enum',
    values: ['all', 'Iterable<Key>'],
    description: 'The currently selected keys (controlled).',
  },
  defaultSelectedKeys: {
    type: 'enum',
    values: ['all', 'Iterable<Key>'],
    description: 'The initial selected keys (uncontrolled).',
  },
  disabledKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
    description: 'Keys of items that should be disabled.',
  },
  onSelectionChange: {
    type: 'enum',
    values: ['(keys: Selection) => void'],
    description: 'Handler called when the selection changes.',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
};

export const listBoxItemPropDefs: Record<string, PropDef> = {
  id: {
    type: 'string',
    description: 'Unique identifier for the item.',
  },
  textValue: {
    type: 'string',
    description:
      'Text value for accessibility. Derived from children if string.',
  },
  icon: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Icon displayed before the item label.',
  },
  description: {
    type: 'string',
    description: 'Secondary description text displayed below the label.',
  },
  isDisabled: {
    type: 'boolean',
    description: 'Whether the item is disabled.',
  },
  menuItems: {
    type: 'enum',
    values: ['Iterable<MenuItemConfig>'],
    description: 'Menu items displayed for this list box item.',
  },
  customActions: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Custom action elements displayed alongside the item.',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
};
