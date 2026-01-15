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
