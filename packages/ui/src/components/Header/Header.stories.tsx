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
import { HeaderMetadataUsers } from './HeaderMetadataUsers';
import { HeaderMetadataStatus } from './HeaderMetadataStatus';
import type { HeaderNavTabItem } from './types';
import { MemoryRouter } from 'react-router-dom';
import { BUIProvider } from '../../provider';
import { Button, ButtonIcon, MenuTrigger, Menu, MenuItem } from '../../';
import { RiMore2Line } from '@remixicon/react';
import { Container } from '../Container';

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

export const WithDescription = meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    description:
      'This is a description of the page. It can include [inline links](https://backstage.io).',
  },
});

export const WithTags = meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    tags: [
      { label: 'TypeScript' },
      { label: 'Platform', href: '/platform' },
      { label: 'Gold' },
    ],
  },
});

export const WithMetadata = meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    metadata: [
      { label: 'Owner', value: 'platform-team' },
      { label: 'Type', value: 'website' },
    ],
  },
});

const users = {
  giles: {
    name: 'Giles Peyton-Nicoll',
    src: 'https://i.pravatar.cc/150?u=giles',
    href: '/users/giles',
  },
  alice: {
    name: 'Alice Johnson',
    src: 'https://i.pravatar.cc/150?u=alicej',
    href: '/users/alice',
  },
  bob: {
    name: 'Bob Smith',
    src: 'https://i.pravatar.cc/150?u=bob',
    href: '/users/bob',
  },
  carol: {
    name: 'Carol Williams',
    src: 'https://i.pravatar.cc/150?u=carol',
    href: '/users/carol',
  },
};

export const WithMetadataUsers = meta.story({
  decorators: [withRouter],
  render: () => (
    <Header
      {...Default.input.args}
      metadata={[
        {
          label: 'Owner',
          value: <HeaderMetadataUsers users={[users.giles]} />,
        },
        {
          label: 'Contributors',
          value: (
            <HeaderMetadataUsers
              users={[users.alice, users.bob, users.carol]}
            />
          ),
        },
      ]}
    />
  ),
});

export const WithMetadataUsersNoLinks = meta.story({
  decorators: [withRouter],
  render: () => (
    <Header
      {...Default.input.args}
      metadata={[
        {
          label: 'Owner',
          value: (
            <HeaderMetadataUsers
              users={[{ name: users.giles.name, src: users.giles.src }]}
            />
          ),
        },
        {
          label: 'Contributors',
          value: (
            <HeaderMetadataUsers
              users={[
                { name: users.alice.name, src: users.alice.src },
                { name: users.bob.name, src: users.bob.src },
                { name: users.carol.name, src: users.carol.src },
              ]}
            />
          ),
        },
      ]}
    />
  ),
});

export const WithMetadataStatus = meta.story({
  decorators: [withRouter],
  render: () => (
    <Header
      {...Default.input.args}
      metadata={[
        {
          label: 'Status',
          value: <HeaderMetadataStatus label="Passing" color="success" />,
        },
        {
          label: 'Build',
          value: (
            <HeaderMetadataStatus
              label="Failed"
              color="danger"
              href="/builds/123"
            />
          ),
        },
        {
          label: 'Coverage',
          value: <HeaderMetadataStatus label="Warning" color="warning" />,
        },
      ]}
    />
  ),
});

export const WithDescriptionTagsAndMetadata = meta.story({
  decorators: [withRouter],
  render: () => (
    <Header
      {...Default.input.args}
      description="This is a description of the page. It can include [inline links](https://backstage.io)."
      tags={[
        { label: 'TypeScript' },
        { label: 'Platform', href: '/platform' },
        { label: 'Gold' },
      ]}
      metadata={[
        {
          label: 'Owner',
          value: <HeaderMetadataUsers users={[users.giles]} />,
        },
        {
          label: 'Contributors',
          value: (
            <HeaderMetadataUsers
              users={[users.alice, users.bob, users.carol]}
            />
          ),
        },
        { label: 'Type', value: 'website' },
        { label: 'Tier', value: 'gold' },
      ]}
    />
  ),
});

export const WithEverything = meta.story({
  decorators: [withRouter],
  render: () => (
    <Header
      {...Default.input.args}
      tabs={tabs}
      customActions={<Button>Custom action</Button>}
      breadcrumbs={[{ label: 'Home', href: '/' }]}
      description="This is a description of the page. It can include [inline links](https://backstage.io)."
      tags={[
        { label: 'TypeScript' },
        { label: 'Platform', href: '/platform' },
        { label: 'Gold' },
      ]}
      metadata={[
        { label: 'Type', value: 'website' },
        {
          label: 'Owner',
          value: <HeaderMetadataUsers users={[users.giles]} />,
        },
        {
          label: 'Contributors',
          value: (
            <HeaderMetadataUsers
              users={[users.alice, users.bob, users.carol]}
            />
          ),
        },
      ]}
    />
  ),
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

export const NonSticky = meta.story({
  decorators: [withRouter],
  render: () => (
    <>
      <Header
        title="Sticky Page Title"
        description="This is a description of the page that scrolls away when you scroll down."
        tags={[
          { label: 'TypeScript' },
          { label: 'Platform', href: '/platform' },
        ]}
        metadata={[
          { label: 'Owner', value: 'platform-team' },
          { label: 'Type', value: 'website' },
        ]}
        customActions={<Button>Custom action</Button>}
      />
      <Container pb="3">
        {Array.from({ length: 60 }, (_, i) => (
          <p key={i} style={{ marginBottom: '16px' }}>
            Scroll down to see the entire header scroll away with the rest of
            the page content. Line {i + 1}.
          </p>
        ))}
      </Container>
    </>
  ),
});

export const Sticky = meta.story({
  decorators: [withRouter],
  render: () => (
    <>
      <Header
        title="Sticky Page Title"
        sticky
        description="This is a description of the page that scrolls away when you scroll down."
        tags={[
          { label: 'TypeScript' },
          { label: 'Platform', href: '/platform' },
        ]}
        metadata={[
          { label: 'Owner', value: 'platform-team' },
          { label: 'Type', value: 'website' },
        ]}
        customActions={<Button>Custom action</Button>}
      />
      <Container pb="3">
        {Array.from({ length: 60 }, (_, i) => (
          <p key={i} style={{ marginBottom: '16px' }}>
            Scroll down to see the title bar stick to the top while the tags,
            description, and metadata scroll away. Line {i + 1}.
          </p>
        ))}
      </Container>
    </>
  ),
});

export const StickyWithLongTitle = meta.story({
  decorators: [withRouter],
  render: () => (
    <>
      <Header
        title="This is a very long page title that should demonstrate how the sticky Header behaves when the title takes up significantly more horizontal space than usual"
        sticky
        description="This is a description of the page that scrolls away when you scroll down."
        tags={[
          { label: 'TypeScript' },
          { label: 'Platform', href: '/platform' },
        ]}
        metadata={[
          { label: 'Owner', value: 'platform-team' },
          { label: 'Type', value: 'website' },
        ]}
        customActions={<Button>Custom action</Button>}
      />
      <Container pb="3">
        {Array.from({ length: 60 }, (_, i) => (
          <p key={i} style={{ marginBottom: '16px' }}>
            Scroll down to see the long title bar stick to the top while the
            tags, description, and metadata scroll away. Line {i + 1}.
          </p>
        ))}
      </Container>
    </>
  ),
});

export const StickyWithBreadcrumbsAndLongTitle = meta.story({
  decorators: [withRouter],
  render: () => (
    <>
      <Header
        title="This is a very long page title that should demonstrate how sticky breadcrumbs and titles behave when both need to fit in the compact stuck state"
        sticky
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Very Long Breadcrumb Name', href: '/long-breadcrumb' },
        ]}
        description="This is a description of the page that scrolls away when you scroll down."
        tags={[
          { label: 'TypeScript' },
          { label: 'Platform', href: '/platform' },
        ]}
        metadata={[
          { label: 'Owner', value: 'platform-team' },
          { label: 'Type', value: 'website' },
        ]}
        customActions={<Button>Custom action</Button>}
      />
      <Container pb="3">
        {Array.from({ length: 60 }, (_, i) => (
          <p key={i} style={{ marginBottom: '16px' }}>
            Scroll down to see the breadcrumb and long title bar stick to the
            top while the tags, description, and metadata scroll away. Line{' '}
            {i + 1}.
          </p>
        ))}
      </Container>
    </>
  ),
});
