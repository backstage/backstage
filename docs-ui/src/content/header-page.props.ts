import {
  childrenPropDefs,
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const propDefs: Record<string, PropDef> = {
  title: {
    type: 'string',
    default: 'Your plugin',
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
  breadcrumbs: {
    type: 'complex',
    complexType: {
      name: 'Breadcrumb[]',
      properties: {
        label: {
          type: 'string',
          required: true,
          description: 'Display text for the breadcrumb',
        },
        href: {
          type: 'string',
          required: true,
          description: 'URL for the breadcrumb link',
        },
      },
    },
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const usage = `import { HeaderPage } from '@backstage/ui';

<HeaderPage />`;

export const defaultSnippet = `<HeaderPage
  title="Page Title"
  tabs={[
    { id: 'overview', label: 'Overview' },
    { id: 'checks', label: 'Checks' },
    { id: 'tracks', label: 'Tracks' },
    { id: 'campaigns', label: 'Campaigns' },
    { id: 'integrations', label: 'Integrations' },
  ]}
  menuItems={[
    { label: 'Settings', value: 'settings' },
    { label: 'Invite new members', value: 'invite-new-members' },
  ]}
  customActions={<Button>Custom action</Button>}
/>`;

export const withBreadcrumbs = `<HeaderPage
  title="Page Title"
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Long Breadcrumb Name', href: '/long-breadcrumb' },
  ]}
/>`;

export const withTabs = `<HeaderPage
  title="Page Title"
  tabs={[
    { id: 'overview', label: 'Overview', href: '/overview' },
    { id: 'checks', label: 'Checks', href: '/checks' },
    { id: 'tracks', label: 'Tracks', href: '/tracks' },
    { id: 'campaigns', label: 'Campaigns', href: '/campaigns' },
    { id: 'integrations', label: 'Integrations', href: '/integrations' },
  ]}
/>`;

export const withCustomActions = `<HeaderPage
  title="Page Title"
  customActions={<Button>Custom action</Button>}
/>`;

export const withMenuItems = `<HeaderPage
  title="Page Title"
  menuItems={[
    { label: 'Settings', value: 'settings', onClick: () => {} },
    { label: 'Invite new members', value: 'invite-new-members', onClick: () => {} },
  ]}
/>`;
