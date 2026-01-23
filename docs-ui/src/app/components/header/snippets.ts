export const usage = `import { Header } from '@backstage/ui';

<Header />`;

export const defaultSnippet = `<Header
  title="My plugin"
  titleLink="/"
  tabs={[
    { id: 'overview', label: 'Overview' },
    { id: 'checks', label: 'Checks' },
    { id: 'tracks', label: 'Tracks' },
    { id: 'campaigns', label: 'Campaigns' },
    { id: 'integrations', label: 'Integrations' },
  ]}
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Settings', href: '/settings' },
  ]}
  menuItems={[
    { label: 'Settings', value: 'settings' },
    { label: 'Invite new members', value: 'invite-new-members' },
  ]}
  customActions={
    <>
      <ButtonIcon variant="tertiary" icon={<RiCloudy2Line />} />
      <ButtonIcon variant="tertiary" icon={<RiEmotionHappyLine />} />
      <ButtonIcon variant="tertiary" icon={<RiHeartLine />} />
    </>
  }
/>`;

export const simple = `<Header
  title="My plugin"
  titleLink="/"
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
  customActions={
    <>
      <ButtonIcon variant="tertiary" icon={<RiCloudy2Line />} />
      <ButtonIcon variant="tertiary" icon={<RiEmotionHappyLine />} />
      <ButtonIcon variant="tertiary" icon={<RiHeartLine />} />
    </>
  }
/>`;

export const withTabs = `
<Header
  title="My plugin"
  titleLink="/"
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
  customActions={
    <>
      <ButtonIcon variant="tertiary" icon={<RiCloudy2Line />} />
      <ButtonIcon variant="tertiary" icon={<RiEmotionHappyLine />} />
      <ButtonIcon variant="tertiary" icon={<RiHeartLine />} />
    </>
  }
  tabs={[
    { id: 'overview', label: 'Overview' },
    { id: 'checks', label: 'Checks' },
    { id: 'tracks', label: 'Tracks' },
    { id: 'campaigns', label: 'Campaigns' },
    { id: 'integrations', label: 'Integrations' },
  ]}
/>
`;

export const withBreadcrumbs = `<Header
  title="My plugin"
  titleLink="/"
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Settings', href: '/settings' },
  ]}
  tabs={[
    { id: 'overview', label: 'Overview' },
    { id: 'checks', label: 'Checks' },
    { id: 'tracks', label: 'Tracks' },
    { id: 'campaigns', label: 'Campaigns' },
    { id: 'integrations', label: 'Integrations' },
  ]}
/>`;

export const withHeaderPage = `<Header
  title="My plugin"
  titleLink="/"
  breadcrumbs={...}
  tabs={...}
/>
<HeaderPage
  title="Page title"
  menuItems={...}
  tabs={...}
  customActions={<Button>Custom action</Button>}
/>`;
