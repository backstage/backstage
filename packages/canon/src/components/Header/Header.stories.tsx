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

const options: HeaderOption[] = [
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
          backgroundColor: 'var(--canon-bg-surface-1',
          borderRadius: 'var(--canon-radius-2)',
          border: '1px solid var(--canon-border)',
          zIndex: 1,
        }}
      />
      <div
        style={{
          paddingInline: '266px',
          minHeight: '200vh',
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
          backgroundColor: 'var(--canon-bg-surface-1',
          borderRadius: 'var(--canon-radius-2)',
          border: '1px solid var(--canon-border)',
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
    options,
  },
};

export const WithBreadcrumbs: Story = {
  args: {
    breadcrumbs,
  },
};

export const WithAllComponents: Story = {
  args: {
    options,
    tabs,
    breadcrumbs,
  },
};

export const WithLayout: Story = {
  args: {
    options,
    tabs,
    breadcrumbs,
  },
  decorators: layoutDecorator,
  parameters: {
    layout: 'fullscreen',
  },
};
