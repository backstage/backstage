/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import preview from '../../../../../.storybook/preview';
import type { StoryFn } from '@storybook/react-vite';
import { HeaderPage } from './HeaderPage';
import type { HeaderTab } from '../Header/types';
import { MemoryRouter } from 'react-router-dom';
import {
  Button,
  Container,
  Text,
  ButtonIcon,
  MenuTrigger,
  Menu,
  MenuItem,
} from '../../';
import { RiMore2Line } from '@remixicon/react';

const meta = preview.meta({
  title: 'Backstage UI/HeaderPage',
  component: HeaderPage,
  parameters: {
    layout: 'fullscreen',
  },
});

const tabs: HeaderTab[] = [
  {
    id: 'overview',
    label: 'Overview',
    href: '/overview',
  },
  {
    id: 'checks',
    label: 'Checks',
    href: '/checks',
  },
  {
    id: 'tracks',
    label: 'Tracks',
    href: '/tracks',
  },
  {
    id: 'campaigns',
    label: 'Campaigns',
    href: '/campaigns',
  },
  {
    id: 'integrations',
    label: 'Integrations',
    href: '/integrations',
  },
];

const menuItems = [
  {
    label: 'Settings',
    value: 'settings',
    href: '/settings',
  },
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

const withRouter = (Story: StoryFn) => (
  <MemoryRouter>
    <Story />
  </MemoryRouter>
);

// Extract layout decorator as a reusable constant
const layoutDecorator = [
  (Story: StoryFn) => (
    <>
      <div
        style={{
          width: '250px',
          position: 'fixed',
          left: 'var(--sb-panel-left)',
          top: 'var(--sb-panel-top)',
          bottom: 'var(--sb-panel-bottom)',
          backgroundColor: 'var(--sb-sidebar-bg)',
          borderRadius: 'var(--sb-panel-radius)',
          border: 'var(--sb-sidebar-border)',
          borderRight: 'var(--sb-sidebar-border-right)',
          zIndex: 1,
        }}
      />
      <div
        style={{
          paddingLeft: 'var(--sb-content-padding-inline)',
          minHeight: '200vh',
        }}
      >
        <Story />
        <Container>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
          </Text>
        </Container>
      </div>
    </>
  ),
];

export const Default = meta.story({
  args: {
    title: 'Page Title',
  },
});

export const WithTabs = meta.story({
  args: {
    ...Default.input.args,
    tabs,
  },
  decorators: [withRouter],
});

export const WithCustomActions = meta.story({
  decorators: [withRouter],
  render: () => (
    <HeaderPage
      {...Default.input.args}
      customActions={
        <>
          <Button>Custom action</Button>
          <MenuTrigger>
            <ButtonIcon
              variant="tertiary"
              icon={<RiMore2Line />}
              aria-label="More options"
            />
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
        </>
      }
    />
  ),
});

export const WithBreadcrumbs = meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    breadcrumbs: [{ label: 'Home', href: '/' }],
  },
});

export const WithLongBreadcrumbs = meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Long Breadcrumb Name', href: '/long-breadcrumb' },
    ],
  },
});

export const WithEverything = meta.story({
  decorators: [withRouter],
  render: () => (
    <HeaderPage
      {...Default.input.args}
      tabs={tabs}
      customActions={<Button>Custom action</Button>}
      breadcrumbs={[{ label: 'Home', href: '/' }]}
    />
  ),
});

export const WithLayout = WithEverything.extend({
  decorators: [...layoutDecorator],
});

export const WithTabsMatchingStrategies = meta.story({
  args: {
    title: 'Route Matching Demo',
    tabs: [
      {
        id: 'home',
        label: 'Home',
        href: '/home',
      },
      {
        id: 'mentorship',
        label: 'Mentorship',
        href: '/mentorship',
        matchStrategy: 'prefix',
      },
      {
        id: 'catalog',
        label: 'Catalog',
        href: '/catalog',
        matchStrategy: 'prefix',
      },
      {
        id: 'settings',
        label: 'Settings',
        href: '/settings',
      },
    ],
  },
  render: args => (
    <MemoryRouter initialEntries={['/mentorship/events']}>
      <HeaderPage {...args} />
      <Container>
        <Text>
          <strong>Current URL:</strong> /mentorship/events
        </Text>
        <br />
        <Text>
          Notice how the "Mentorship" tab is active even though we're on a
          nested route. This is because it uses{' '}
          <code>matchStrategy="prefix"</code>.
        </Text>
        <br />
        <Text>
          • <strong>Home</strong>: exact matching (default) - not active
        </Text>
        <Text>
          • <strong>Mentorship</strong>: prefix matching - IS active (URL starts
          with /mentorship)
        </Text>
        <Text>
          • <strong>Catalog</strong>: prefix matching - not active
        </Text>
        <Text>
          • <strong>Settings</strong>: exact matching (default) - not active
        </Text>
      </Container>
    </MemoryRouter>
  ),
});

export const WithTabsExactMatching = meta.story({
  args: {
    title: 'Exact Matching Demo',
    tabs: [
      {
        id: 'mentorship',
        label: 'Mentorship',
        href: '/mentorship',
      },
      {
        id: 'events',
        label: 'Events',
        href: '/mentorship/events',
      },
      {
        id: 'mentors',
        label: 'Mentors',
        href: '/mentorship/mentors',
      },
    ],
  },
  render: args => (
    <MemoryRouter initialEntries={['/mentorship/events']}>
      <HeaderPage {...args} />
      <Container>
        <Text>
          <strong>Current URL:</strong> /mentorship/events
        </Text>
        <br />
        <Text>
          With default exact matching, only the "Events" tab is active because
          it exactly matches the current URL. The "Mentorship" tab is not active
          even though the URL is under /mentorship.
        </Text>
      </Container>
    </MemoryRouter>
  ),
});

export const WithTabsPrefixMatchingDeep = meta.story({
  args: {
    title: 'Deep Nesting Demo',
    tabs: [
      {
        id: 'catalog',
        label: 'Catalog',
        href: '/catalog',
        matchStrategy: 'prefix',
      },
      {
        id: 'users',
        label: 'Users',
        href: '/catalog/users',
        matchStrategy: 'prefix',
      },
      {
        id: 'components',
        label: 'Components',
        href: '/catalog/components',
        matchStrategy: 'prefix',
      },
    ],
  },
  render: args => (
    <MemoryRouter initialEntries={['/catalog/users/john/details']}>
      <HeaderPage {...args} />
      <Container>
        <Text as="p">
          <strong>Current URL:</strong> /catalog/users/john/details
        </Text>
        <br />
        <Text as="p">
          Active tab is <strong>Users</strong> because:
        </Text>
        <ul>
          <li>
            <strong>Catalog</strong>: Matches since URL starts with /catalog
          </li>
          <li>
            <strong>Users</strong>: Is active since URL starts with
            /catalog/users, and is more specific (has more url segments) than
            "Catalog"
          </li>
          <li>
            <strong>Components</strong>: not active (URL doesn't start with
            /catalog/components)
          </li>
        </ul>
        <Text as="p">
          This demonstrates how prefix matching works with deeply nested routes.
        </Text>
      </Container>
    </MemoryRouter>
  ),
});
