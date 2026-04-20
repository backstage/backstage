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
import { PluginHeader } from './PluginHeader';
import type { HeaderTab } from './types';
import {
  Container,
  Text,
  ButtonIcon,
  MenuTrigger,
  Menu,
  MenuItem,
} from '../../';
import { MemoryRouter } from 'react-router-dom';
import { BUIProvider } from '../../provider';
import {
  RiHeartLine,
  RiEmotionHappyLine,
  RiCloudy2Line,
  RiMore2Line,
} from '@remixicon/react';

const meta = preview.meta({
  title: 'Backstage UI/PluginHeader',
  component: PluginHeader,
  parameters: {
    layout: 'fullscreen',
  },
});

const withRouter = (Story: StoryFn) => (
  <MemoryRouter>
    <BUIProvider>
      <Story />
    </BUIProvider>
  </MemoryRouter>
);

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

export const Default = meta.story({
  args: {},
  decorators: [withRouter],
});

export const WithTabs = meta.story({
  args: {
    tabs,
  },
  decorators: [withRouter],
});

export const WithCustomActions = meta.story({
  args: {},
  decorators: [withRouter],
  render: args => (
    <PluginHeader
      {...args}
      customActions={
        <>
          <ButtonIcon variant="secondary" icon={<RiCloudy2Line />} />
          <ButtonIcon variant="secondary" icon={<RiEmotionHappyLine />} />
          <ButtonIcon variant="secondary" icon={<RiHeartLine />} />
          <MenuTrigger>
            <ButtonIcon variant="secondary" icon={<RiMore2Line />} />
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

export const WithAllOptionsAndTabs = WithCustomActions.extend({
  args: {
    tabs,
  },
});

export const WithMockedURLCampaigns = meta.story({
  args: {
    tabs,
  },
  render: args => (
    <MemoryRouter initialEntries={['/campaigns']}>
      <BUIProvider>
        <PluginHeader {...args} />
        <Container mt="6">
          <Text as="p">
            Current URL is mocked to be: <strong>/campaigns</strong>
          </Text>
          <Text as="p">
            Notice how the "Campaigns" tab is selected (highlighted) because it
            matches the current path.
          </Text>
        </Container>
      </BUIProvider>
    </MemoryRouter>
  ),
});

export const WithMockedURLIntegrations = meta.story({
  args: {
    tabs,
  },
  render: args => (
    <MemoryRouter initialEntries={['/integrations']}>
      <BUIProvider>
        <PluginHeader {...args} />
        <Container mt="6">
          <Text as="p">
            Current URL is mocked to be: <strong>/integrations</strong>
          </Text>
          <Text as="p">
            Notice how the "Integrations" tab is selected (highlighted) because
            it matches the current path.
          </Text>
        </Container>
      </BUIProvider>
    </MemoryRouter>
  ),
});

export const WithMockedURLNoMatch = meta.story({
  args: {
    tabs,
  },
  render: args => (
    <MemoryRouter initialEntries={['/some-other-page']}>
      <BUIProvider>
        <PluginHeader {...args} />
        <Container mt="6">
          <Text as="p">
            Current URL is mocked to be: <strong>/some-other-page</strong>
          </Text>
          <Text as="p">
            No tab is selected because the current path doesn't match any tab's
            href.
          </Text>
          <Text as="p">
            Tabs without href (like "Overview", "Checks", "Tracks") fall back to
            React Aria's internal state.
          </Text>
        </Container>
      </BUIProvider>
    </MemoryRouter>
  ),
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
      <BUIProvider>
        <PluginHeader {...args} />
        <Container mt="6">
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
            • <strong>Mentorship</strong>: prefix matching - IS active (URL
            starts with /mentorship)
          </Text>
          <Text>
            • <strong>Catalog</strong>: prefix matching - not active
          </Text>
          <Text>
            • <strong>Settings</strong>: exact matching (default) - not active
          </Text>
        </Container>
      </BUIProvider>
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
      <BUIProvider>
        <PluginHeader {...args} />
        <Container mt="6">
          <Text>
            <strong>Current URL:</strong> /mentorship/events
          </Text>
          <br />
          <Text>
            With default exact matching, only the "Events" tab is active because
            it exactly matches the current URL. The "Mentorship" tab is not
            active even though the URL is under /mentorship.
          </Text>
        </Container>
      </BUIProvider>
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
      <BUIProvider>
        <PluginHeader {...args} />
        <Container mt="6">
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
            This demonstrates how prefix matching works with deeply nested
            routes.
          </Text>
        </Container>
      </BUIProvider>
    </MemoryRouter>
  ),
});
