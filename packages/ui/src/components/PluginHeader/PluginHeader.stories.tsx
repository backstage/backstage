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
  Button,
  HeaderPage,
  Container,
  Text,
  ButtonIcon,
  MenuTrigger,
  Menu,
  MenuItem,
} from '../../';
import { MemoryRouter } from 'react-router-dom';
import {
  RiHeartLine,
  RiEmotionHappyLine,
  RiCloudy2Line,
  RiMore2Line,
} from '@remixicon/react';
import { HeaderPageBreadcrumb } from '../HeaderPage/types';

const meta = preview.meta({
  title: 'Backstage UI/PluginHeader',
  component: PluginHeader,
  parameters: {
    layout: 'fullscreen',
  },
});

const withRouter = (Story: StoryFn) => (
  <MemoryRouter>
    <Story />
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

const tabs2: HeaderTab[] = [
  {
    id: 'Banana',
    label: 'Banana',
    href: '/banana',
  },
  {
    id: 'Apple',
    label: 'Apple',
    href: '/apple',
  },
  {
    id: 'Orange',
    label: 'Orange',
    href: '/orange',
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

const breadcrumbs: HeaderPageBreadcrumb[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    label: 'Settings',
    href: '/settings',
  },
];

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
          <Text as="p">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
          </Text>
          <Text as="p">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
          </Text>
          <Text as="p">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
          </Text>
          <Text as="p">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
          </Text>
          <Text as="p">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
          </Text>
          <Text as="p">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
          </Text>
          <Text as="p">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
          </Text>
          <Text as="p">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
          </Text>
        </Container>
      </div>
    </>
  ),
  withRouter,
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
          <ButtonIcon variant="tertiary" icon={<RiCloudy2Line />} />
          <ButtonIcon variant="tertiary" icon={<RiEmotionHappyLine />} />
          <ButtonIcon variant="tertiary" icon={<RiHeartLine />} />
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

export const WithHeaderPage = meta.story({
  args: {
    ...WithAllOptionsAndTabs.input.args,
  },
  decorators: [withRouter],
  render: args => (
    <>
      <PluginHeader
        {...args}
        customActions={
          <>
            <ButtonIcon variant="tertiary" icon={<RiCloudy2Line />} />
            <ButtonIcon variant="tertiary" icon={<RiEmotionHappyLine />} />
            <ButtonIcon variant="tertiary" icon={<RiHeartLine />} />
          </>
        }
      />
      <HeaderPage
        title="Page title"
        tabs={tabs2}
        customActions={<Button>Custom action</Button>}
        breadcrumbs={breadcrumbs}
      />
    </>
  ),
});

export const WithLayout = meta.story({
  decorators: layoutDecorator,
  render: args => (
    <>
      <PluginHeader {...args} tabs={tabs} />
      <HeaderPage
        title="Page title"
        tabs={tabs2}
        customActions={<Button>Custom action</Button>}
        breadcrumbs={breadcrumbs}
      />
    </>
  ),
});

export const WithLayoutNoTabs = meta.story({
  decorators: layoutDecorator,
  render: args => (
    <>
      <PluginHeader {...args} />
      <HeaderPage title="Page title" tabs={tabs2} />
    </>
  ),
});

export const WithEverything = meta.story({
  args: {
    tabs,
    titleLink: '/',
  },
  decorators: layoutDecorator,
  render: args => (
    <>
      <PluginHeader
        {...args}
        customActions={
          <>
            <ButtonIcon variant="tertiary" icon={<RiCloudy2Line />} />
            <ButtonIcon variant="tertiary" icon={<RiEmotionHappyLine />} />
            <ButtonIcon variant="tertiary" icon={<RiHeartLine />} />
          </>
        }
      />
      <HeaderPage
        title="Page title"
        tabs={tabs2}
        customActions={
          <>
            <Button variant="secondary">Secondary</Button>
            <Button variant="primary">Primary</Button>
          </>
        }
      />
    </>
  ),
});

export const WithMockedURLCampaigns = meta.story({
  args: {
    tabs,
  },
  render: args => (
    <MemoryRouter initialEntries={['/campaigns']}>
      <PluginHeader {...args} />
      <Container>
        <Text as="p">
          Current URL is mocked to be: <strong>/campaigns</strong>
        </Text>
        <Text as="p">
          Notice how the "Campaigns" tab is selected (highlighted) because it
          matches the current path.
        </Text>
      </Container>
    </MemoryRouter>
  ),
});

export const WithMockedURLIntegrations = meta.story({
  args: {
    tabs,
  },
  render: args => (
    <MemoryRouter initialEntries={['/integrations']}>
      <PluginHeader {...args} />
      <Container>
        <Text as="p">
          Current URL is mocked to be: <strong>/integrations</strong>
        </Text>
        <Text as="p">
          Notice how the "Integrations" tab is selected (highlighted) because it
          matches the current path.
        </Text>
      </Container>
    </MemoryRouter>
  ),
});

export const WithMockedURLNoMatch = meta.story({
  args: {
    tabs,
  },
  render: args => (
    <MemoryRouter initialEntries={['/some-other-page']}>
      <PluginHeader {...args} />
      <Container>
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
      <PluginHeader {...args} />
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
      <PluginHeader {...args} />
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
      <PluginHeader {...args} />
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
