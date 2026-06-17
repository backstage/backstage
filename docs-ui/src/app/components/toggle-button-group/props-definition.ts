import {
  childrenPropDefs,
  classNamePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const toggleButtonGroupPropDefs: Record<string, PropDef> = {
  selectionMode: {
    type: 'enum',
    values: ['single', 'multiple'],
    description: 'Whether to allow single or multiple selection.',
  },
  selectedKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
    description: 'The currently selected keys (controlled).',
  },
  defaultSelectedKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
    description: 'The initial selected keys (uncontrolled).',
  },
  onSelectionChange: {
    type: 'enum',
    values: ['(keys: Selection) => void'],
    description: 'Handler called when the selection changes.',
  },
  orientation: {
    type: 'enum',
    values: ['horizontal', 'vertical'],
    default: 'horizontal',
    description: 'The layout orientation of the button group.',
  },
  disallowEmptySelection: {
    type: 'boolean',
    description:
      'Whether to prevent deselecting when at least one button is selected.',
  },
  isDisabled: {
    type: 'boolean',
    default: 'false',
    description: 'Disables all buttons in the group.',
  },
  disabledKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
    description: 'Keys of buttons that should be disabled.',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
};
