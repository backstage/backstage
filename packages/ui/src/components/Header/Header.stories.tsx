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
import { Header } from './Header';
import type { HeaderNavTabItem } from './types';
import { MemoryRouter } from 'react-router-dom';
import { BUIProvider } from '../../provider';
import { Button, ButtonIcon, MenuTrigger, Menu, MenuItem } from '../../';
import { RiMore2Line } from '@remixicon/react';

const meta = preview.meta({
  title: 'Backstage UI/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
});

const tabs: HeaderNavTabItem[] = [
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
  <MemoryRouter initialEntries={['/overview']}>
    <BUIProvider>
      <Story />
    </BUIProvider>
  </MemoryRouter>
);

export const Default = meta.story({
  args: {
    title: 'Page Title',
  },
});

export const WithTabs = meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    tabs,
  },
});

export const WithCustomActions = meta.story({
  decorators: [withRouter],
  render: () => (
    <Header
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
  args: {
    ...Default.input.args,
    tabs,
    customActions: <Button>Custom action</Button>,
    breadcrumbs: [{ label: 'Home', href: '/' }],
  },
});

const groupedTabs: HeaderNavTabItem[] = [
  { id: 'overview', label: 'Overview', href: '/overview' },
  {
    id: 'docs-group',
    label: 'Documentation',
    items: [
      { id: 'docs', label: 'TechDocs', href: '/docs' },
      { id: 'api-docs', label: 'API Reference', href: '/api-docs' },
    ],
  },
  { id: 'ci', label: 'CI/CD', href: '/ci' },
];

export const WithGroupedTabs = meta.story({
  decorators: [
    (Story: StoryFn) => (
      <MemoryRouter initialEntries={['/docs']}>
        <BUIProvider>
          <Story />
        </BUIProvider>
      </MemoryRouter>
    ),
  ],
  args: {
    ...Default.input.args,
    tabs: groupedTabs,
  },
});

export const WithExplicitActiveTab = meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    tabs,
    activeTabId: 'campaigns',
  },
});
