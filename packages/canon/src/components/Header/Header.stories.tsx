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
import { Header } from './Header';
import { HeaderBreadcrumb, HeaderOption, HeaderTab } from './types';
import { Button } from '../Button';
import { HeaderPage } from '../HeaderPage';
import { MemoryRouter } from 'react-router-dom';

const meta = {
  title: 'Components/Header',
  component: Header,
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

const tabs: HeaderTab[] = [
  {
    label: 'Overview',
  },
  {
    label: 'Checks',
  },
  {
    label: 'Tracks',
  },
  {
    label: 'Campaigns',
    href: '/campaigns',
  },
  {
    label: 'Integrations',
    href: '/integrations',
  },
];

const breadcrumbs: HeaderBreadcrumb[] = [
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

const menuItems: HeaderOption[] = [
  {
    label: 'Settings',
    value: 'settings',
  },
  {
    label: 'Invite new members',
    value: 'invite-new-members',
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
          backgroundColor: 'var(--canon-bg-surface-1)',
          borderRadius: 'var(--sb-panel-radius)',
          border: 'var(--sb-sidebar-border)',
          borderRight: 'var(--sb-sidebar-border-right)',
          zIndex: 1,
        }}
      />
      <div
        style={{
          paddingInline: 'var(--sb-content-padding-inline)',
          minHeight: '200vh',
        }}
      >
        <Story />
      </div>
      <div
        style={{
          width: '250px',
          position: 'fixed',
          right: 'var(--sb-panel-right)',
          top: 'var(--sb-panel-top)',
          bottom: 'var(--sb-panel-bottom)',
          backgroundColor: 'var(--canon-bg-surface-1)',
          borderRadius: 'var(--sb-panel-radius)',
          border: 'var(--sb-options-border)',
          borderLeft: 'var(--sb-options-border-left)',
          zIndex: 1,
        }}
      />
    </>
  ),
];

export const Default: Story = {
  args: {},
};

export const WithTabs: Story = {
  args: {
    tabs,
  },
};

export const WithOptions: Story = {
  args: {
    menuItems,
  },
};

export const WithCustomActions: Story = {
  args: {
    customActions: <Button>Custom action</Button>,
  },
};

export const WithBreadcrumbs: Story = {
  args: {
    breadcrumbs,
  },
};

export const WithAllComponents: Story = {
  args: {
    menuItems,
    tabs,
    breadcrumbs,
  },
};

export const WithLayout: Story = {
  args: {
    menuItems,
    tabs,
    breadcrumbs,
  },
  decorators: layoutDecorator,
  parameters: {
    layout: 'fullscreen',
  },
};

export const WithLayoutAndHeaderPage: Story = {
  args: {
    menuItems,
    tabs,
    breadcrumbs,
  },
  decorators: layoutDecorator,
  parameters: {
    layout: 'fullscreen',
  },
  render: args => (
    <>
      <Header {...args} />
      <HeaderPage
        title="Page title"
        description="Page description"
        options={args.menuItems}
      />
    </>
  ),
};

export const WithLayoutAndHeaderPageNoTabs: Story = {
  args: {
    menuItems,
    breadcrumbs,
  },
  decorators: layoutDecorator,
  parameters: {
    layout: 'fullscreen',
  },
  render: args => (
    <>
      <Header {...args} />
      <HeaderPage
        title="Page title"
        description="Page description"
        options={args.menuItems}
      />
    </>
  ),
};

export const WithMockedURLCampaigns: Story = {
  args: {
    tabs,
  },
  render: args => (
    <MemoryRouter initialEntries={['/campaigns']}>
      <Header {...args} />
      <div style={{ padding: '20px' }}>
        <p>
          Current URL is mocked to be: <strong>/campaigns</strong>
        </p>
        <p>
          Notice how the "Campaigns" tab is selected (highlighted) because it
          matches the current path.
        </p>
      </div>
    </MemoryRouter>
  ),
};

export const WithMockedURLIntegrations: Story = {
  args: {
    tabs,
  },
  render: args => (
    <MemoryRouter initialEntries={['/integrations']}>
      <Header {...args} />
      <div style={{ padding: '20px' }}>
        <p>
          Current URL is mocked to be: <strong>/integrations</strong>
        </p>
        <p>
          Notice how the "Integrations" tab is selected (highlighted) because it
          matches the current path.
        </p>
      </div>
    </MemoryRouter>
  ),
};

export const WithMockedURLNoMatch: Story = {
  args: {
    tabs,
  },
  render: args => (
    <MemoryRouter initialEntries={['/some-other-page']}>
      <Header {...args} />
      <div style={{ padding: '20px' }}>
        <p>
          Current URL is mocked to be: <strong>/some-other-page</strong>
        </p>
        <p>
          No tab is selected because the current path doesn't match any tab's
          href.
        </p>
        <p>
          Tabs without href (like "Overview", "Checks", "Tracks") fall back to
          React Aria's internal state.
        </p>
      </div>
    </MemoryRouter>
  ),
};
