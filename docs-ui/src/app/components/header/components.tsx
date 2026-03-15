'use client';

import { Header } from '../../../../../packages/ui/src/components/Header/Header';
import { Button } from '../../../../../packages/ui/src/components/Button/Button';
import { ButtonIcon } from '../../../../../packages/ui/src/components/ButtonIcon/ButtonIcon';
import {
  MenuTrigger,
  Menu,
  MenuItem,
} from '../../../../../packages/ui/src/components/Menu/Menu';
import { DocsRouterProvider } from '@/utils/backstage-router-provider';
import { RiMore2Line } from '@remixicon/react';

const tabs = [
  { id: 'overview', label: 'Overview', href: '/overview' },
  { id: 'checks', label: 'Checks', href: '/checks' },
  { id: 'tracks', label: 'Tracks', href: '/tracks' },
  { id: 'campaigns', label: 'Campaigns', href: '/campaigns' },
  { id: 'integrations', label: 'Integrations', href: '/integrations' },
];

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Long Breadcrumb Name', href: '/long-breadcrumb' },
  { label: 'Another Long Breadcrumb', href: '/another-long-breadcrumb' },
  {
    label: 'Yet Another Long Breadcrumb',
    href: '/yet-another-long-breadcrumb',
  },
];

export const WithEverything = () => (
  <DocsRouterProvider>
    <Header
      title="Page Title"
      tabs={tabs.slice(0, 2)}
      breadcrumbs={breadcrumbs.slice(0, 2)}
      customActions={
        <>
          <Button variant="secondary">Secondary</Button>
          <Button variant="primary">Primary</Button>
        </>
      }
    />
  </DocsRouterProvider>
);

export const WithLongBreadcrumbs = () => (
  <DocsRouterProvider>
    <Header title="Page Title" breadcrumbs={breadcrumbs.slice(0, 2)} />
  </DocsRouterProvider>
);

export const WithTabs = () => (
  <DocsRouterProvider>
    <Header title="Page Title" tabs={tabs.slice(0, 3)} />
  </DocsRouterProvider>
);

export const WithCustomActions = () => (
  <DocsRouterProvider>
    <Header title="Page Title" customActions={<Button>Custom action</Button>} />
  </DocsRouterProvider>
);

export const WithMenu = () => (
  <DocsRouterProvider>
    <Header
      title="Page Title"
      customActions={
        <MenuTrigger>
          <ButtonIcon variant="tertiary" icon={<RiMore2Line />} />
          <Menu placement="bottom end">
            <MenuItem href="/settings">Settings</MenuItem>
            <MenuItem onAction={() => alert('logout')}>Logout</MenuItem>
          </Menu>
        </MenuTrigger>
      }
    />
  </DocsRouterProvider>
);
