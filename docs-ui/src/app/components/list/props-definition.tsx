import {
  classNamePropDefs,
  childrenPropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const listPropDefs: Record<string, PropDef> = {
  items: {
    type: 'enum',
    values: ['Iterable<T>'],
    description: 'Item objects in the collection.',
  },
  renderEmptyState: {
    type: 'enum',
    values: ['(props: GridListRenderProps) => ReactNode'],
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

export const listRowPropDefs: Record<string, PropDef> = {
  id: {
    type: 'string',
    description: 'Unique identifier for the row.',
  },
  textValue: {
    type: 'string',
    description:
      'Text value for accessibility. Derived from children if string.',
  },
  icon: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Icon displayed before the row label.',
  },
  description: {
    type: 'string',
    description: 'Secondary description text displayed below the label.',
  },
  isDisabled: {
    type: 'boolean',
    description: 'Whether the row is disabled.',
  },
  menuItems: {
    type: 'enum',
    values: ['ReactNode'],
    description:
      'Menu items rendered inside an automatically managed dropdown. Pass MenuItem nodes.',
  },
  customActions: {
    type: 'enum',
    values: ['ReactNode'],
    description:
      'Custom action elements displayed on the right side of the row, e.g. tags.',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
};
