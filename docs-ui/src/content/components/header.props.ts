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
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

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

export const flexSimpleSnippet = `<Flex gap="md">
  <Box>Hello World</Box>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
</Flex>`;

export const flexResponsiveSnippet = `<Flex gap={{ xs: 'xs', md: 'md' }}>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
</Flex>`;

export const flexAlignSnippet = `<Flex align={{ xs: 'start', md: 'center' }}>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
  <Box>Hello World</Box>
</Flex>`;
