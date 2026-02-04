export const usage = `import { HeaderPage } from '@backstage/ui';

<HeaderPage title="Page Title" />`;

export const defaultSnippet = `<HeaderPage
  title="Page Title"
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
  ]}
  tabs={[
    { id: 'overview', label: 'Overview', href: '/overview' },
    { id: 'settings', label: 'Settings', href: '/settings' },
  ]}
  customActions={
    <>
      <Button variant="secondary">Secondary</Button>
      <Button variant="primary">Primary</Button>
    </>
  }
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
  ]}
/>`;

export const withCustomActions = `<HeaderPage
  title="Page Title"
  customActions={<Button>Custom action</Button>}
/>`;

export const withMenu = `<HeaderPage
  title="Page Title"
  customActions={
    <MenuTrigger>
      <ButtonIcon variant="tertiary" icon={<RiMore2Line />} />
      <Menu placement="bottom end">
        <MenuItem href="/settings">Settings</MenuItem>
        <MenuItem onAction={() => {}}>Logout</MenuItem>
      </Menu>
    </MenuTrigger>
  }
/>`;
