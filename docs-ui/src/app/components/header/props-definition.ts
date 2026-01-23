import {
  childrenPropDefs,
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const propDefs: Record<string, PropDef> = {
  icon: {
    type: 'enum',
    values: ['ReactNode'],
  },
  title: {
    type: 'string',
    default: 'Your plugin',
  },
  titleLink: {
    type: 'string',
    default: '/',
  },
  customActions: {
    type: 'enum',
    values: ['ReactNode'],
  },
  menuItems: {
    type: 'complex',
    complexType: {
      name: 'MenuItem[]',
      properties: {
        label: {
          type: 'string',
          required: true,
          description: 'Display text for the menu item',
        },
        value: {
          type: 'string',
          required: true,
          description: 'Unique value for the menu item',
        },
        onClick: {
          type: '() => void',
          required: false,
          description: 'Callback function when menu item is clicked',
        },
      },
    },
  },
  tabs: {
    type: 'complex',
    complexType: {
      name: 'HeaderTab[]',
      properties: {
        id: {
          type: 'string',
          required: true,
          description: 'Unique identifier for the tab',
        },
        label: {
          type: 'string',
          required: true,
          description: 'Display text for the tab',
        },
        href: {
          type: 'string',
          required: false,
          description: 'URL to navigate to when tab is clicked',
        },
        matchStrategy: {
          type: "'exact' | 'prefix'",
          required: false,
          description: 'How to match the current route to highlight the tab',
        },
      },
    },
  },
  onTabSelectionChange: {
    type: 'enum',
    values: ['(key: string) => void'],
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
