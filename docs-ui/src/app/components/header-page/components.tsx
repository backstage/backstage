'use client';

import { HeaderPage } from '../../../../../packages/ui/src/components/HeaderPage/HeaderPage';
import { Button } from '../../../../../packages/ui/src/components/Button/Button';
import { ButtonIcon } from '../../../../../packages/ui/src/components/ButtonIcon/ButtonIcon';
import {
  MenuTrigger,
  Menu,
  MenuItem,
} from '../../../../../packages/ui/src/components/Menu/Menu';
import { MemoryRouter } from 'react-router-dom';
import { RiMore2Line } from '@remixicon/react';

const tabs = [
  { id: 'overview', label: 'Overview', href: '/overview' },
  { id: 'checks', label: 'Checks', href: '/checks' },
  { id: 'tracks', label: 'Tracks', href: '/tracks' },
  { id: 'campaigns', label: 'Campaigns', href: '/campaigns' },
  { id: 'integrations', label: 'Integrations', href: '/integrations' },
];

const menuItems = [
  { label: 'Settings', value: 'settings', href: '/settings' },
  {
    label: 'Invite new members',
    value: 'invite-new-members',
    href: '/invite-new-members',
  },
  {
    label: 'Logout',
    value: 'logout',
    onClick: () => {
      alert('logout');
    },
  },
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
  <MemoryRouter>
    <HeaderPage
      title="Page Title"
      tabs={tabs}
      breadcrumbs={breadcrumbs}
      customActions={
        <>
          <Button variant="secondary">Secondary</Button>
          <Button variant="primary">Primary</Button>
        </>
      }
    />
  </MemoryRouter>
);

export const WithLongBreadcrumbs = () => (
  <MemoryRouter>
    <HeaderPage title="Page Title" breadcrumbs={breadcrumbs} />
  </MemoryRouter>
);

export const WithTabs = () => (
  <MemoryRouter>
    <HeaderPage title="Page Title" tabs={tabs} />
  </MemoryRouter>
);

export const WithCustomActions = () => (
  <MemoryRouter>
    <HeaderPage
      title="Page Title"
      customActions={<Button>Custom action</Button>}
    />
  </MemoryRouter>
);

export const WithMenuItems = () => (
  <MemoryRouter>
    <HeaderPage
      title="Page Title"
      customActions={
        <MenuTrigger>
          <ButtonIcon variant="tertiary" icon={<RiMore2Line />} />
          <Menu placement="bottom end">
            {menuItems.map(option => (
              <MenuItem
                key={option.value}
                onAction={option.onClick}
                href={option.href}
              >
                {option.label}
              </MenuItem>
            ))}
          </Menu>
        </MenuTrigger>
      }
    />
  </MemoryRouter>
);
