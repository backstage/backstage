import { classNamePropDefs, stylePropDefs } from '@/utils/propDefs';

export const tagGroupPropDefs: Record<string, PropDef> = {
  disabledKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
    description: 'A list of row keys to disable.',
  },
  selectionMode: {
    type: 'enum',
    values: ['none', 'single', 'multiple'],
    description: 'The type of selection that is allowed in the collection.',
  },
  selectedKeys: {
    type: 'enum',
    values: ['all', 'Iterable<Key>'],
    description: 'The currently selected keys in the collection (controlled).',
  },
  defaultSelectedKeys: {
    type: 'enum',
    values: ['all', 'Iterable<Key>'],
    description: 'The initial selected keys in the collection (uncontrolled).',
  },
  onRemove: {
    type: 'enum',
    values: ['(keys: Set<Key>) => void'],
    description: 'Handler that is called when a tag is removed.',
  },
  onSelectionChange: {
    type: 'enum',
    values: ['(keys: Selection) => void'],
    description: 'Handler that is called when the selection changes.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const tagPropDefs: Record<string, PropDef> = {
  id: {
    type: 'string',
    description: 'The id of the tag.',
  },
  textValue: {
    type: 'string',
    description: 'The text value of the tag.',
  },
  isDisabled: {
    type: 'boolean',
    description: 'Whether the tag is disabled.',
  },
  href: {
    type: 'string',
    description: 'The href of the tag.',
  },
  icon: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'The icon of the tag.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
