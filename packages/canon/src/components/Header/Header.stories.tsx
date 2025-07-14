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
import { HeaderBreadcrumb, HeaderMenuItem, HeaderTab } from './types';
import { Button } from '../Button';
import { HeaderPage } from '../HeaderPage';
import { MemoryRouter } from 'react-router-dom';
import { Container } from '../Container';
import { Text } from '../Text';
import { ButtonIcon } from '../ButtonIcon';
import {
  RiHeartLine,
  RiEmotionHappyLine,
  RiCloudy2Line,
} from '@remixicon/react';

const meta = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Header>;

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
  },
  {
    id: 'Apple',
    label: 'Apple',
  },
  {
    id: 'Orange',
    label: 'Orange',
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
  args: {},
  decorators: [withRouter],
};

export const WithTabs: Story = {
  args: {
    tabs,
  },
  decorators: [withRouter],
};

export const WithOptions: Story = {
  args: {
    menuItems,
  },
  decorators: [withRouter],
};

export const WithCustomActions: Story = {
  args: {
    customActions: <Button>Custom action</Button>,
    menuItems,
  },
  decorators: [withRouter],
};

export const WithBreadcrumbs: Story = {
  args: {
    breadcrumbs,
  },
  decorators: [withRouter],
};

export const WithAllComponents: Story = {
  args: {
    menuItems,
    tabs,
    breadcrumbs,
  },
  decorators: [withRouter],
};

export const WithLayout: Story = {
  args: {
    menuItems,
    breadcrumbs,
  },
  decorators: layoutDecorator,
  render: args => (
    <>
      <Header {...args} tabs={tabs} />
      <HeaderPage
        title="Page title"
        menuItems={args.menuItems}
        tabs={tabs2}
        customActions={<Button>Custom action</Button>}
      />
    </>
  ),
};

export const WithLayoutNoTabs: Story = {
  args: {
    menuItems,
    breadcrumbs,
  },
  decorators: layoutDecorator,
  render: args => (
    <>
      <Header {...args} />
      <HeaderPage title="Page title" menuItems={args.menuItems} tabs={tabs2} />
    </>
  ),
};

export const WithEverything: Story = {
  args: {
    menuItems,
    breadcrumbs,
    tabs,
  },
  decorators: layoutDecorator,
  render: args => (
    <>
      <Header
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
        menuItems={args.menuItems}
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
};

export const WithMockedURLCampaigns: Story = {
  args: {
    tabs,
  },
  render: args => (
    <MemoryRouter initialEntries={['/campaigns']}>
      <Header {...args} />
      <Container>
        <Text>
          Current URL is mocked to be: <strong>/campaigns</strong>
        </Text>
        <Text>
          Notice how the "Campaigns" tab is selected (highlighted) because it
          matches the current path.
        </Text>
      </Container>
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
      <Container>
        <Text>
          Current URL is mocked to be: <strong>/integrations</strong>
        </Text>
        <Text>
          Notice how the "Integrations" tab is selected (highlighted) because it
          matches the current path.
        </Text>
      </Container>
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
      <Container>
        <Text>
          Current URL is mocked to be: <strong>/some-other-page</strong>
        </Text>
        <Text>
          No tab is selected because the current path doesn't match any tab's
          href.
        </Text>
        <Text>
          Tabs without href (like "Overview", "Checks", "Tracks") fall back to
          React Aria's internal state.
        </Text>
      </Container>
    </MemoryRouter>
  ),
};
