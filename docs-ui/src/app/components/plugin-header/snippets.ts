export const usage = `import { PluginHeader } from '@backstage/ui';

<PluginHeader title="My plugin" />`;

export const defaultSnippet = `<PluginHeader
  title="My plugin"
  titleLink="/"
  tabs={[
    { id: 'overview', label: 'Overview', href: '/overview' },
    { id: 'checks', label: 'Checks', href: '/checks' },
    { id: 'tracks', label: 'Tracks', href: '/tracks' },
  ]}
  customActions={
    <>
      <ButtonIcon variant="tertiary" icon={<RiCloudy2Line />} />
      <ButtonIcon variant="tertiary" icon={<RiEmotionHappyLine />} />
      <ButtonIcon variant="tertiary" icon={<RiHeartLine />} />
    </>
  }
/>`;

export const simple = `<PluginHeader
  title="My plugin"
  titleLink="/"
  customActions={
    <>
      <ButtonIcon variant="tertiary" icon={<RiCloudy2Line />} />
      <ButtonIcon variant="tertiary" icon={<RiEmotionHappyLine />} />
      <ButtonIcon variant="tertiary" icon={<RiHeartLine />} />
    </>
  }
/>`;

export const withTabs = `<PluginHeader
  title="My plugin"
  titleLink="/"
  tabs={[
    { id: 'overview', label: 'Overview', href: '/overview' },
    { id: 'checks', label: 'Checks', href: '/checks' },
    { id: 'tracks', label: 'Tracks', href: '/tracks' },
    { id: 'campaigns', label: 'Campaigns', href: '/campaigns' },
    { id: 'integrations', label: 'Integrations', href: '/integrations' },
  ]}
/>`;

export const withHeaderPage = `<PluginHeader
  title="My plugin"
  titleLink="/"
  tabs={[
    { id: 'overview', label: 'Overview', href: '/overview' },
    { id: 'checks', label: 'Checks', href: '/checks' },
  ]}
/>
<HeaderPage
  title="Page title"
  tabs={[
    { id: 'banana', label: 'Banana', href: '/banana' },
    { id: 'apple', label: 'Apple', href: '/apple' },
  ]}
  customActions={<Button>Custom action</Button>}
/>`;
