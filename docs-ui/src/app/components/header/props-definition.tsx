import { classNamePropDefs, type PropDef } from '@/utils/propDefs';

export const headerPagePropDefs: Record<string, PropDef> = {
  title: {
    type: 'string',
    description: 'Page heading displayed in the header.',
  },
  customActions: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Custom elements rendered in the actions area.',
  },
  tabs: {
    type: 'complex',
    description: 'Navigation items displayed below the title.',
    complexType: {
      name: 'HeaderNavTabItem[]',
      properties: {
        id: {
          type: 'string',
          required: true,
          description: 'Unique identifier for the tab.',
        },
        label: {
          type: 'string',
          required: true,
          description: 'Display text for the tab.',
        },
        href: {
          type: 'string',
          required: false,
          description:
            'URL to navigate to when tab is clicked. Present on flat tabs, absent on groups.',
        },
        items: {
          type: 'HeaderNavTab[]',
          required: false,
          description:
            'Child tabs rendered as a dropdown menu. Present on groups, absent on flat tabs.',
        },
      },
    },
  },
  activeTabId: {
    type: 'enum',
    values: ['string', 'null'],
    description:
      'ID of the currently active tab. Omit to auto-detect from the current route. Set to null for no active tab.',
  },
  breadcrumbs: {
    type: 'complex',
    description: 'Breadcrumb trail displayed above the title.',
    complexType: {
      name: 'HeaderBreadcrumb[]',
      properties: {
        label: {
          type: 'string',
          required: true,
          description: 'Display text for the breadcrumb. Truncated at 240px.',
        },
        href: {
          type: 'string',
          required: true,
          description: 'URL for the breadcrumb link.',
        },
      },
    },
  },
  ...classNamePropDefs,
};
