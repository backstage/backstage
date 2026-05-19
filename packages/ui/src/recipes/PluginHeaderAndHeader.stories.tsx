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

import preview from '../../../../.storybook/preview';
import {
  Header as CoreHeader,
  Page as CorePage,
} from '@backstage/core-components';
import type { StoryFn } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { BUIProvider } from '../provider';
import type { HeaderNavTabItem } from '../components/Header/types';
import {
  PluginHeader,
  Header,
  Button,
  ButtonIcon,
  Card,
  Container,
  Flex,
  MenuTrigger,
  Menu,
  MenuItem,
} from '..';
import {
  RiBox3Line,
  RiCodeSSlashLine,
  RiDownloadLine,
  RiEdit2Line,
  RiGitBranchLine,
  RiMore2Line,
  RiPlayLine,
  RiRefreshLine,
  RiSettings4Line,
  RiShareBoxLine,
} from '@remixicon/react';

// ---------------------------------------------------------------------------
// Shared page content placeholder
// ---------------------------------------------------------------------------

const PageContent = () => (
  <Container style={{ gridArea: 'pageContent' }}>
    <Flex direction="row" gap="4">
      <Card style={{ minHeight: 120, flex: 1 }} />
      <Card style={{ minHeight: 120, flex: 1 }} />
      <Card style={{ minHeight: 120, flex: 1 }} />
    </Flex>
  </Container>
);

const LongPageContent = () => (
  <Container pb="3">
    <Flex direction="row" gap="4" mb="4">
      <Card style={{ minHeight: 200, flex: 1 }} />
      <Card style={{ minHeight: 200, flex: 1 }} />
      <Card style={{ minHeight: 200, flex: 1 }} />
    </Flex>
    {Array.from({ length: 40 }, (_, i) => (
      <Card key={i} style={{ minHeight: 200, marginBottom: 16 }} />
    ))}
  </Container>
);

// ---------------------------------------------------------------------------
// Shared layout decorator
// ---------------------------------------------------------------------------

const withLayout = (Story: StoryFn) => (
  <MemoryRouter>
    <BUIProvider>
      <Story />
    </BUIProvider>
  </MemoryRouter>
);

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = preview.meta({
  title: 'Recipes/PluginHeader and Header',
  parameters: {
    layout: 'fullscreen',
  },
});

export const NoHeader = meta.story({
  decorators: [withLayout],
  render: () => (
    <>
      <PluginHeader icon={<RiCodeSSlashLine />} title="APIs" />
      <PageContent />
    </>
  ),
});

export const NoHeaderWithTabs = meta.story({
  decorators: [withLayout],
  render: () => (
    <>
      <PluginHeader
        icon={<RiCodeSSlashLine />}
        title="APIs"
        tabs={[
          { id: 'overview', label: 'Overview', href: '/apis' },
          {
            id: 'definitions',
            label: 'Definitions',
            href: '/apis/definitions',
          },
          { id: 'consumers', label: 'Consumers', href: '/apis/consumers' },
        ]}
      />
      <PageContent />
    </>
  ),
});

export const SimpleHeader = meta.story({
  decorators: [withLayout],
  render: () => (
    <>
      <PluginHeader icon={<RiCodeSSlashLine />} title="APIs" />
      <Header title="payments-api" />
      <PageContent />
    </>
  ),
});

export const CoreComponentsHeader = meta.story({
  decorators: [withLayout],
  render: () => (
    <>
      <PluginHeader icon={<RiCodeSSlashLine />} title="APIs" />
      <CorePage themeId="home">
        <CoreHeader title="payments-api" />
        <PageContent />
      </CorePage>
    </>
  ),
});

export const CoreComponentsHeaderWithTabs = meta.story({
  decorators: [withLayout],
  render: () => (
    <>
      <PluginHeader
        icon={<RiCodeSSlashLine />}
        title="APIs"
        tabs={[
          { id: 'overview', label: 'Overview', href: '/apis' },
          {
            id: 'definitions',
            label: 'Definitions',
            href: '/apis/definitions',
          },
          { id: 'consumers', label: 'Consumers', href: '/apis/consumers' },
        ]}
      />
      <CorePage themeId="home">
        <CoreHeader title="payments-api" />
        <PageContent />
      </CorePage>
    </>
  ),
});

export const WithTabs = meta.story({
  decorators: [withLayout],
  render: () => (
    <>
      <PluginHeader
        icon={<RiBox3Line />}
        title="Catalog"
        titleLink="/"
        tabs={[
          { id: 'catalog', label: 'Catalog', href: '/catalog' },
          { id: 'apis', label: 'APIs', href: '/apis' },
          { id: 'resources', label: 'Resources', href: '/resources' },
          { id: 'templates', label: 'Templates', href: '/templates' },
          { id: 'docs', label: 'Docs', href: '/docs' },
        ]}
        customActions={
          <>
            <ButtonIcon
              variant="secondary"
              icon={<RiSettings4Line />}
              aria-label="Settings"
            />
            <MenuTrigger>
              <ButtonIcon
                variant="secondary"
                icon={<RiMore2Line />}
                aria-label="More options"
              />
              <Menu placement="bottom end">
                <MenuItem href="/catalog/import">Import component</MenuItem>
                <MenuItem href="/catalog/register">Register existing</MenuItem>
                <MenuItem href="/catalog/docs">View documentation</MenuItem>
              </Menu>
            </MenuTrigger>
          </>
        }
      />
      <Header
        title="payment-service"
        customActions={
          <>
            <Button variant="secondary" iconStart={<RiEdit2Line />}>
              Edit
            </Button>
            <Button variant="primary" iconStart={<RiShareBoxLine />}>
              Unregister
            </Button>
          </>
        }
      />
      <PageContent />
    </>
  ),
});

const subTabs: HeaderNavTabItem[] = [
  { id: 'summary', label: 'Summary', href: '/summary' },
  { id: 'steps', label: 'Steps', href: '/steps' },
  { id: 'artifacts', label: 'Artifacts', href: '/artifacts' },
  { id: 'logs', label: 'Logs', href: '/logs' },
];

export const WithSubTabs = meta.story({
  decorators: [
    (Story: StoryFn) => (
      <MemoryRouter initialEntries={['/summary']}>
        <BUIProvider>
          <Story />
        </BUIProvider>
      </MemoryRouter>
    ),
  ],
  render: () => {
    return (
      <>
        <PluginHeader
          icon={<RiGitBranchLine />}
          title="CI/CD"
          titleLink="/"
          tabs={[
            { id: 'builds', label: 'Builds', href: '/builds' },
            { id: 'pipelines', label: 'Pipelines', href: '/pipelines' },
            { id: 'deployments', label: 'Deployments', href: '/deployments' },
            { id: 'settings', label: 'Settings', href: '/settings' },
          ]}
          customActions={
            <>
              <ButtonIcon
                variant="secondary"
                icon={<RiRefreshLine />}
                aria-label="Refresh"
              />
            </>
          }
        />
        <Header
          title="Production deployment pipeline run"
          tabs={subTabs}
          customActions={
            <>
              <Button variant="secondary" iconStart={<RiDownloadLine />}>
                Download logs
              </Button>
              <Button variant="primary" iconStart={<RiPlayLine />}>
                Re-run pipeline
              </Button>
            </>
          }
        />
        <PageContent />
      </>
    );
  },
});

export const WithSubTabsAndTags = meta.story({
  decorators: [
    (Story: StoryFn) => (
      <MemoryRouter initialEntries={['/summary']}>
        <BUIProvider>
          <Story />
        </BUIProvider>
      </MemoryRouter>
    ),
  ],
  render: () => {
    return (
      <>
        <PluginHeader
          icon={<RiGitBranchLine />}
          title="CI/CD"
          titleLink="/"
          tabs={[
            { id: 'builds', label: 'Builds', href: '/builds' },
            { id: 'pipelines', label: 'Pipelines', href: '/pipelines' },
            { id: 'deployments', label: 'Deployments', href: '/deployments' },
            { id: 'settings', label: 'Settings', href: '/settings' },
          ]}
          customActions={
            <>
              <ButtonIcon
                variant="secondary"
                icon={<RiRefreshLine />}
                aria-label="Refresh"
              />
            </>
          }
        />
        <Header
          title="Production deployment pipeline run"
          tabs={subTabs}
          tags={[
            { label: 'Production' },
            { label: 'Owner: Platform', href: '/catalog?owner=platform' },
            { label: 'Tier 1' },
          ]}
          customActions={
            <>
              <Button variant="secondary" iconStart={<RiDownloadLine />}>
                Download logs
              </Button>
              <Button variant="primary" iconStart={<RiPlayLine />}>
                Re-run pipeline
              </Button>
            </>
          }
        />
        <PageContent />
      </>
    );
  },
});

export const WithStickyHeader = meta.story({
  decorators: [
    (Story: StoryFn) => (
      <MemoryRouter initialEntries={['/summary']}>
        <BUIProvider>
          <Story />
        </BUIProvider>
      </MemoryRouter>
    ),
  ],
  render: () => {
    return (
      <>
        <PluginHeader
          icon={<RiGitBranchLine />}
          title="CI/CD"
          titleLink="/"
          tabs={[
            { id: 'builds', label: 'Builds', href: '/builds' },
            { id: 'pipelines', label: 'Pipelines', href: '/pipelines' },
            { id: 'deployments', label: 'Deployments', href: '/deployments' },
            { id: 'settings', label: 'Settings', href: '/settings' },
          ]}
          customActions={
            <>
              <ButtonIcon
                variant="secondary"
                icon={<RiRefreshLine />}
                aria-label="Refresh"
              />
            </>
          }
        />
        <Header
          title="Production deployment pipeline run"
          sticky
          tabs={subTabs}
          customActions={
            <>
              <Button variant="secondary" iconStart={<RiDownloadLine />}>
                Download logs
              </Button>
              <Button variant="primary" iconStart={<RiPlayLine />}>
                Re-run pipeline
              </Button>
            </>
          }
        />
        <LongPageContent />
      </>
    );
  },
});
