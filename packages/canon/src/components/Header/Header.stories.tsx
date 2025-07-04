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
  },
  {
    label: 'Integrations',
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
