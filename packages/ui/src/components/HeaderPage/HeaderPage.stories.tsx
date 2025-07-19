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

import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { HeaderPage } from './HeaderPage';
import type { HeaderTab, HeaderMenuItem } from '../Header/types';
import { Button } from '../Button';
import { MemoryRouter } from 'react-router-dom';
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

const withRouter = (Story: StoryFn) => (
  <MemoryRouter>
    <Story />
  </MemoryRouter>
);

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
export const layoutDecorator = [
  (Story: StoryFn) => (
    <>
      <div
        style={{
          width: '250px',
          position: 'fixed',
          left: 'var(--sb-panel-left)',
          top: 'var(--sb-panel-top)',
          bottom: 'var(--sb-panel-bottom)',
          backgroundColor: 'var(--bui-bg-surface-1)',
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
        <Container>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
          </Text>
        </Container>
      </div>
      <div
        style={{
          width: '250px',
          position: 'fixed',
          right: 'var(--sb-panel-right)',
          top: 'var(--sb-panel-top)',
          bottom: 'var(--sb-panel-bottom)',
          backgroundColor: 'var(--bui-bg-surface-1)',
          borderRadius: 'var(--sb-panel-radius)',
          border: 'var(--sb-options-border)',
          borderLeft: 'var(--sb-options-border-left)',
          zIndex: 1,
        }}
      />
    </>
  ),
  withRouter,
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
  decorators: layoutDecorator,
  render: () => (
    <HeaderPage
      {...Default.args}
      menuItems={menuItems}
      tabs={tabs}
      customActions={<Button>Custom action</Button>}
    />
  ),
};
