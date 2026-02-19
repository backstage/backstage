import {
  childrenPropDefs,
  classNamePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const tabsPropDefs: Record<string, PropDef> = {
  orientation: {
    type: 'enum',
    values: ['horizontal', 'vertical'],
    default: 'horizontal',
    description:
      'Layout direction. Use horizontal for top navigation, vertical for sidebar-style.',
  },
  selectedKey: {
    type: 'string',
    description: 'The currently selected tab key (controlled).',
  },
  defaultSelectedKey: {
    type: 'string',
    description: 'The default selected tab key (uncontrolled).',
  },
  onSelectionChange: {
    type: 'enum',
    values: ['(key: Key) => void'],
    description: 'Handler called when the selected tab changes.',
  },
  isDisabled: {
    type: 'boolean',
    default: 'false',
    description:
      'Disables all tabs. Use when an entire section is unavailable.',
  },
  disabledKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
    description: 'Keys of tabs that should be disabled.',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
};

export const tabListPropDefs: Record<string, PropDef> = {
  ...childrenPropDefs,
  ...classNamePropDefs,
};

export const tabPropDefs: Record<string, PropDef> = {
  id: {
    type: 'string',
    required: true,
    description: 'Unique identifier matching the corresponding TabPanel.',
  },
  href: {
    type: 'string',
    description:
      'URL to navigate to. When set, tab selection is controlled by the current route.',
  },
  matchStrategy: {
    type: 'enum',
    values: ['exact', 'prefix'],
    default: 'exact',
    description:
      'URL matching strategy. Use exact for leaf routes, prefix for parent routes.',
  },
  isDisabled: {
    type: 'boolean',
    default: 'false',
    description: 'Disables this tab. Use for temporarily unavailable options.',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
};

export const tabPanelPropDefs: Record<string, PropDef> = {
  id: {
    type: 'string',
    required: true,
    description: 'Unique identifier matching the corresponding Tab.',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
};
