import {
  childrenPropDefs,
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const toggleButtonGroupPropDefs: Record<string, PropDef> = {
  selectionMode: {
    type: 'enum',
    values: ['single', 'multiple'],
    required: true,
  },
  selectedKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
  },
  defaultSelectedKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
  },
  onSelectionChange: {
    type: 'enum',
    values: ['(keys: Selection) => void'],
  },
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'medium',
    responsive: true,
  },
  isDisabled: {
    type: 'boolean',
    default: 'false',
  },
  disabledKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
