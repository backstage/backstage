/*
 * Copyright 2024 The Backstage Authors
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

import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { HeaderPage } from './HeaderPage';
import type { HeaderTab, HeaderMenuItem } from '../Header/types';
import { MemoryRouter } from 'react-router-dom';
import { Button } from '../Button';
import { Container } from '../Container';
import { Text } from '../Text';

const meta = {
  title: 'Components/HeaderPage',
  component: HeaderPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HeaderPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const tabs: HeaderTab[] = [
  {
    id: 'overview',
    label: 'Overview',
  },
  {
    id: 'checks',
    label: 'Checks',
  },
  {
    id: 'tracks',
    label: 'Tracks',
  },
  {
    id: 'campaigns',
    label: 'Campaigns',
  },
  {
    id: 'integrations',
    label: 'Integrations',
  },
];

const menuItems: HeaderMenuItem[] = [
  {
    label: 'Settings',
    value: 'settings',
  },
  {
    label: 'Invite new members',
    value: 'invite-new-members',
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

export const Default: Story = {
  args: {
    title: 'Header Page',
  },
};

export const WithTabs: Story = {
  args: {
    ...Default.args,
    tabs,
  },
  decorators: [withRouter],
};

export const WithMenuItems: Story = {
  args: {
    ...Default.args,
    menuItems,
  },
};

export const WithCustomActions: Story = {
  render: () => (
    <HeaderPage
      {...Default.args}
      menuItems={menuItems}
      customActions={<Button>Custom action</Button>}
    />
  ),
};

export const WithEverything: Story = {
  decorators: [withRouter],
  render: () => (
    <HeaderPage
      {...Default.args}
      menuItems={menuItems}
      tabs={tabs}
      customActions={<Button>Custom action</Button>}
    />
  ),
};

export const WithLayout: Story = {
  args: {
    ...WithEverything.args,
  },
  decorators: [withRouter, ...layoutDecorator],
  render: WithEverything.render,
};

export const WithTabsMatchingStrategies: Story = {
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
};

export const WithTabsExactMatching: Story = {
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
};

export const WithTabsPrefixMatchingDeep: Story = {
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
        <Text>
          <strong>Current URL:</strong> /catalog/users/john/details
        </Text>
        <br />
        <Text>Both "Catalog" and "Users" tabs are active because:</Text>
        <Text>
          • <strong>Catalog</strong>: URL starts with /catalog
        </Text>
        <Text>
          • <strong>Users</strong>: URL starts with /catalog/users
        </Text>
        <Text>
          • <strong>Components</strong>: not active (URL doesn't start with
          /catalog/components)
        </Text>
        <br />
        <Text>
          This demonstrates how prefix matching works with deeply nested routes.
        </Text>
      </Container>
    </MemoryRouter>
  ),
};
