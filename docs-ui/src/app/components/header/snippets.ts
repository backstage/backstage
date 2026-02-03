export const usage = `import { Header } from '@backstage/ui';

<Header title="My plugin" />`;

export const defaultSnippet = `<Header
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

export const simple = `<Header
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

export const withTabs = `<Header
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

export const withHeaderPage = `<Header
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
