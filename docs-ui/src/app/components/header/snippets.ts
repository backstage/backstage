export const usage = `import { Header } from '@backstage/ui';

<Header title="Page Title" />`;

export const defaultSnippet = `import { Header, HeaderMetadataUsers, HeaderMetadataStatus } from '@backstage/ui';

<Header
  title="Page Title"
  tags={[
    { label: 'TypeScript' },
    { label: 'Platform', href: '/platform' },
  ]}
  description="A short description. Supports [inline links](https://backstage.io)."
  metadata={[
    { label: 'Type', value: 'website' },
    {
      label: 'Status',
      value: <HeaderMetadataStatus label="Passing" color="success" />,
    },
    {
      label: 'Owner',
      value: <HeaderMetadataUsers users={[{ name: 'Giles Peyton-Nicoll', src: '...', href: '/users/giles' }]} />,
    },
    {
      label: 'Contributors',
      value: (
        <HeaderMetadataUsers
          users={[
            { name: 'Alice Johnson', src: '...', href: '/users/alice' },
            { name: 'Bob Smith', src: '...', href: '/users/bob' },
            { name: 'Carol Williams', src: '...', href: '/users/carol' },
          ]}
        />
      ),
    },
  ]}
  tabs={[
    { id: 'overview', label: 'Overview', href: '/overview' },
    { id: 'checks', label: 'Checks', href: '/checks' },
  ]}
  customActions={
    <>
      <Button variant="secondary">Secondary</Button>
      <Button variant="primary">Primary</Button>
    </>
  }
/>`;

export const withBreadcrumbs = `<Header
  title="Page Title"
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Long Breadcrumb Name', href: '/long-breadcrumb' },
  ]}
/>`;

export const withTabs = `<Header
  title="Page Title"
  tabs={[
    { id: 'overview', label: 'Overview', href: '/overview' },
    { id: 'checks', label: 'Checks', href: '/checks' },
    { id: 'tracks', label: 'Tracks', href: '/tracks' },
  ]}
/>`;

export const withCustomActions = `<Header
  title="Page Title"
  customActions={<Button>Custom action</Button>}
/>`;

export const withMenu = `<Header
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

export const withTags = `<Header
  title="Page Title"
  tags={[
    { label: 'TypeScript' },
    { label: 'Platform', href: '/platform' },
    { label: 'Gold' },
  ]}
/>`;

export const withDescription = `<Header
  title="Page Title"
  description="A short description. Supports [inline links](https://backstage.io)."
/>`;

export const withMetadata = `<Header
  title="Page Title"
  metadata={[
    { label: 'Owner', value: 'platform-team' },
    { label: 'Type', value: 'website' },
  ]}
/>`;

export const withMetadataStatus = `import { Header, HeaderMetadataStatus } from '@backstage/ui';

<Header
  title="Page Title"
  metadata={[
    {
      label: 'Status',
      value: <HeaderMetadataStatus label="Passing" color="success" />,
    },
    {
      label: 'Build',
      value: <HeaderMetadataStatus label="Failed" color="danger" href="/builds/123" />,
    },
    {
      label: 'Coverage',
      value: <HeaderMetadataStatus label="Warning" color="warning" />,
    },
  ]}
/>`;

export const withMetadataUsers = `import { Header, HeaderMetadataUsers } from '@backstage/ui';

<Header
  title="Page Title"
  metadata={[
    { label: 'Type', value: 'website' },
    {
      label: 'Owner',
      value: <HeaderMetadataUsers users={[{ name: 'Giles Peyton-Nicoll', src: '...', href: '/users/giles' }]} />,
    },
    {
      label: 'Contributors',
      value: (
        <HeaderMetadataUsers
          users={[
            { name: 'Alice Johnson', src: '...', href: '/users/alice' },
            { name: 'Bob Smith', src: '...', href: '/users/bob' },
            { name: 'Carol Williams', src: '...', href: '/users/carol' },
          ]}
        />
      ),
    },
  ]}
/>`;
