'use client';

import { Header } from '../../../../../packages/ui/src/components/Header/Header';
import { HeaderMetadataUsers } from '../../../../../packages/ui/src/components/Header/HeaderMetadataUsers';
import { HeaderMetadataStatus } from '../../../../../packages/ui/src/components/Header/HeaderMetadataStatus';
import { Button } from '../../../../../packages/ui/src/components/Button/Button';
import { ButtonIcon } from '../../../../../packages/ui/src/components/ButtonIcon/ButtonIcon';
import {
  MenuTrigger,
  Menu,
  MenuItem,
} from '../../../../../packages/ui/src/components/Menu/Menu';
import { MemoryRouter } from 'react-router-dom';
import { RiMore2Line } from '@remixicon/react';

const users = {
  giles: {
    name: 'Giles Peyton-Nicoll',
    src: 'https://i.pravatar.cc/150?u=giles',
    href: '/users/giles',
  },
  alice: {
    name: 'Alice Johnson',
    src: 'https://i.pravatar.cc/150?u=alice42',
    href: '/users/alice',
  },
  bob: {
    name: 'Bob Smith',
    src: 'https://i.pravatar.cc/150?u=bob',
    href: '/users/bob',
  },
  carol: {
    name: 'Carol Williams',
    src: 'https://i.pravatar.cc/150?u=carol',
    href: '/users/carol',
  },
};

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

const tags = [
  { label: 'TypeScript' },
  { label: 'Platform', href: '/platform' },
];

const metadataUsers = [
  { label: 'Type', value: 'website' },
  {
    label: 'Status',
    value: <HeaderMetadataStatus label="Passing" color="success" />,
  },
  {
    label: 'Owner',
    value: <HeaderMetadataUsers users={[users.giles]} />,
  },
  {
    label: 'Contributors',
    value: (
      <HeaderMetadataUsers users={[users.alice, users.bob, users.carol]} />
    ),
  },
];

export const WithEverything = () => (
  <MemoryRouter initialEntries={['/overview']}>
    <Header
      title="Page Title"
      tags={tags}
      description="A short description of this page. Supports [inline links](https://backstage.io)."
      metadata={metadataUsers}
      tabs={tabs.slice(0, 2)}
      customActions={
        <>
          <Button variant="secondary">Secondary</Button>
          <Button variant="primary">Primary</Button>
        </>
      }
    />
  </MemoryRouter>
);

export const WithMetadataUsers = () => (
  <MemoryRouter>
    <Header
      title="Page Title"
      metadata={[
        { label: 'Type', value: 'website' },
        {
          label: 'Owner',
          value: <HeaderMetadataUsers users={[users.giles]} />,
        },
        {
          label: 'Contributors',
          value: (
            <HeaderMetadataUsers
              users={[users.alice, users.bob, users.carol]}
            />
          ),
        },
      ]}
    />
  </MemoryRouter>
);

export const WithTags = () => (
  <MemoryRouter>
    <Header title="Page Title" tags={tags} />
  </MemoryRouter>
);

export const WithDescription = () => (
  <MemoryRouter>
    <Header
      title="Page Title"
      description="A short description of this page. Supports [inline links](https://backstage.io)."
    />
  </MemoryRouter>
);

export const WithMetadata = () => (
  <MemoryRouter>
    <Header
      title="Page Title"
      metadata={[
        { label: 'Owner', value: 'platform-team' },
        { label: 'Type', value: 'website' },
      ]}
    />
  </MemoryRouter>
);

export const WithMetadataStatus = () => (
  <MemoryRouter>
    <Header
      title="Page Title"
      metadata={[
        {
          label: 'Status',
          value: <HeaderMetadataStatus label="Passing" color="success" />,
        },
        {
          label: 'Build',
          value: (
            <HeaderMetadataStatus
              label="Failed"
              color="danger"
              href="/builds/123"
            />
          ),
        },
        {
          label: 'Coverage',
          value: <HeaderMetadataStatus label="Warning" color="warning" />,
        },
      ]}
    />
  </MemoryRouter>
);

export const WithLongBreadcrumbs = () => (
  <MemoryRouter>
    <Header title="Page Title" breadcrumbs={breadcrumbs.slice(0, 2)} />
  </MemoryRouter>
);

export const WithTabs = () => (
  <MemoryRouter initialEntries={['/overview']}>
    <Header title="Page Title" tabs={tabs.slice(0, 3)} />
  </MemoryRouter>
);

export const WithCustomActions = () => (
  <MemoryRouter>
    <Header title="Page Title" customActions={<Button>Custom action</Button>} />
  </MemoryRouter>
);

export const WithMenu = () => (
  <MemoryRouter>
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
  </MemoryRouter>
);
