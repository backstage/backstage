/*
 * Copyright 2026 The Backstage Authors
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
import { Breadcrumbs, Breadcrumb } from './Breadcrumbs';
import { MemoryRouter } from 'react-router-dom';
import { BUIProvider } from '../../provider';

const meta = preview.meta({
  title: 'Backstage UI/Breadcrumbs',
  component: Breadcrumbs,
});

const withRouter =
  (initialEntries: string[] = ['/']) =>
  (Story: StoryFn) =>
    (
      <MemoryRouter initialEntries={initialEntries}>
        <BUIProvider>
          <Story />
        </BUIProvider>
      </MemoryRouter>
    );

export const Default = meta.story({
  args: {},
  decorators: [withRouter(['/my-plugin/settings/theme'])],
  render: () => (
    <Breadcrumbs>
      <Breadcrumb href="/my-plugin">My Plugin</Breadcrumb>
      <Breadcrumb href="/my-plugin/settings">Settings</Breadcrumb>
      <Breadcrumb href="/my-plugin/settings/theme">Theme</Breadcrumb>
    </Breadcrumbs>
  ),
});

export const RootOnly = meta.story({
  args: {},
  decorators: [withRouter(['/my-plugin'])],
  render: () => (
    <Breadcrumbs>
      <Breadcrumb href="/my-plugin">My Plugin</Breadcrumb>
    </Breadcrumbs>
  ),
});

export const InheritsStyle = meta.story({
  args: {},
  decorators: [withRouter(['/my-plugin/settings/theme'])],
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ fontSize: '12px', color: '#e06c75' }}>
        <p style={{ margin: '0 0 4px', opacity: 0.6 }}>12px, red</p>
        <Breadcrumbs>
          <Breadcrumb href="/my-plugin">My Plugin</Breadcrumb>
          <Breadcrumb href="/my-plugin/settings">Settings</Breadcrumb>
          <Breadcrumb href="/my-plugin/settings/theme">Theme</Breadcrumb>
        </Breadcrumbs>
      </div>
      <div style={{ fontSize: '16px', color: '#61afef' }}>
        <p style={{ margin: '0 0 4px', opacity: 0.6 }}>16px, blue</p>
        <Breadcrumbs>
          <Breadcrumb href="/my-plugin">My Plugin</Breadcrumb>
          <Breadcrumb href="/my-plugin/settings">Settings</Breadcrumb>
          <Breadcrumb href="/my-plugin/settings/theme">Theme</Breadcrumb>
        </Breadcrumbs>
      </div>
      <div style={{ fontSize: '24px', color: '#98c379' }}>
        <p style={{ margin: '0 0 4px', opacity: 0.6 }}>24px, green</p>
        <Breadcrumbs>
          <Breadcrumb href="/my-plugin">My Plugin</Breadcrumb>
          <Breadcrumb href="/my-plugin/settings">Settings</Breadcrumb>
          <Breadcrumb href="/my-plugin/settings/theme">Theme</Breadcrumb>
        </Breadcrumbs>
      </div>
      <div style={{ fontSize: '36px', color: '#c678dd' }}>
        <p style={{ margin: '0 0 4px', opacity: 0.6 }}>36px, purple</p>
        <Breadcrumbs>
          <Breadcrumb href="/my-plugin">My Plugin</Breadcrumb>
          <Breadcrumb href="/my-plugin/settings">Settings</Breadcrumb>
          <Breadcrumb href="/my-plugin/settings/theme">Theme</Breadcrumb>
        </Breadcrumbs>
      </div>
    </div>
  ),
});

export const TruncatingBehaviour = meta.story({
  args: {},
  decorators: [withRouter(['/create/edit/custom-fields/details'])],
  render: () => (
    <Breadcrumbs>
      <Breadcrumb href="/my-plugin">My Plugin</Breadcrumb>
      <Breadcrumb href="/my-plugin/subpage">Page with short name</Breadcrumb>
      <Breadcrumb href="/my-plugin/subpage/sub-subpage">
        Page with long name that gets truncated
      </Breadcrumb>
      <Breadcrumb href="/my-plugin/subpage/sub-subpage/sub-sub-subpage">
        Page with long name that gets truncated
      </Breadcrumb>
    </Breadcrumbs>
  ),
});

export const MixedSegmentTypes = meta.story({
  args: {},
  decorators: [withRouter(['/create/edit/custom-fields/details'])],
  render: () => (
    <Breadcrumbs>
      <Breadcrumb href="/my-plugin">My Plugin</Breadcrumb>
      <Breadcrumb>Breadcrumb with no href</Breadcrumb>
      <Breadcrumb href="/my-plugin/subpage">Breadcrumb with href</Breadcrumb>
      <Breadcrumb href="/my-plugin/subpage/sub-subpage">
        Breadcrumb with href but is last
      </Breadcrumb>
    </Breadcrumbs>
  ),
});
