import {
  childrenPropDefs,
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const tabsPropDefs: Record<string, PropDef> = {
  orientation: {
    type: 'enum',
    values: ['horizontal', 'vertical'],
    default: 'horizontal',
  },
  selectedKey: {
    type: 'string',
  },
  defaultSelectedKey: {
    type: 'string',
  },
  onSelectionChange: {
    type: 'enum',
    values: ['(key: Key) => void'],
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

export const tabListPropDefs: Record<string, PropDef> = {
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const tabPropDefs: Record<string, PropDef> = {
  id: {
    type: 'string',
    required: true,
  },
  isDisabled: {
    type: 'boolean',
    default: 'false',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const tabPanelPropDefs: Record<string, PropDef> = {
  id: {
    type: 'string',
    required: true,
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
