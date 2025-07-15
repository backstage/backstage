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

const meta = {
  title: 'Components/HeaderPage',
  component: HeaderPage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story: StoryFn) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
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

// Extract layout decorator as a reusable constant
const layoutDecorator = [
  (Story: StoryFn) => (
    <>
      <div
        style={{
          width: '250px',
          position: 'fixed',
          left: 8,
          top: 8,
          bottom: 8,
          backgroundColor: 'var(--bui-bg-surface-1',
          borderRadius: 'var(--bui-radius-2)',
          border: '1px solid var(--bui-border)',
          zIndex: 1,
        }}
      />
      <div
        style={{
          paddingInline: '266px',
        }}
      >
        <Story />
      </div>
      <div
        style={{
          width: '250px',
          position: 'fixed',
          right: 8,
          top: 8,
          bottom: 8,
          backgroundColor: 'var(--bui-bg-surface-1',
          borderRadius: 'var(--bui-radius-2)',
          border: '1px solid var(--bui-border)',
          zIndex: 1,
        }}
      />
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
  decorators: layoutDecorator,
};
