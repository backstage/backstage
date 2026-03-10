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
import { FullPage } from './FullPage';
import { PluginHeader } from '../PluginHeader';
import { Container } from '../Container';
import { Text } from '../Text';
import type { HeaderTab } from '../PluginHeader/types';
import { MemoryRouter } from 'react-router-dom';

const meta = preview.meta({
  title: 'Backstage UI/FullPage',
  component: FullPage,
  parameters: {
    layout: 'fullscreen',
  },
});

const withRouter = (Story: StoryFn) => (
  <MemoryRouter>
    <Story />
  </MemoryRouter>
);

const tabs: HeaderTab[] = [
  { id: 'overview', label: 'Overview', href: '/overview' },
  { id: 'checks', label: 'Checks', href: '/checks' },
  { id: 'tracks', label: 'Tracks', href: '/tracks' },
  { id: 'campaigns', label: 'Campaigns', href: '/campaigns' },
];

const paragraphs = Array.from({ length: 20 }, (_, i) => (
  <Text as="p" key={i}>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
    Pellentesque habitant morbi tristique senectus et netus et malesuada fames
    ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore
    magna aliqua.
  </Text>
));

export const Default = meta.story({
  decorators: [withRouter],
  render: () => (
    <>
      <PluginHeader title="My Plugin" />
      <FullPage style={{ backgroundColor: '#c3f0ff' }}>
        <Container>
          <Text as="p">
            This content fills the remaining viewport height below the Header.
          </Text>
        </Container>
      </FullPage>
    </>
  ),
});

export const WithScrollableContent = meta.story({
  decorators: [withRouter],
  render: () => (
    <>
      <PluginHeader title="My Plugin" />
      <FullPage>
        <Container>
          <Text as="h2" variant="title-medium">
            Scrollable Content
          </Text>
          <Text as="p">
            The content below scrolls independently while the Header stays
            pinned at the top.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
  ),
});

export const WithTabs = meta.story({
  decorators: [withRouter],
  render: () => (
    <>
      <PluginHeader title="My Plugin" tabs={tabs} />
      <FullPage>
        <Container>
          <Text as="p">
            The FullPage height adjusts automatically when the Header includes
            tabs, thanks to the ResizeObserver measuring the Header's actual
            height.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
  ),
});
