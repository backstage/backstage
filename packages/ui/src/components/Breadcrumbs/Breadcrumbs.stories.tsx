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
import { Breadcrumbs } from './Breadcrumbs';
import { Breadcrumb } from './Breadcrumb';
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

export const CollapsingBehaviour = meta.story({
  args: {},
  decorators: [withRouter(['/'])],
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <p style={{ margin: '0 0 4px', opacity: 0.6 }}>1 segment</p>
        <Breadcrumbs>
          <Breadcrumb href="/home">Home</Breadcrumb>
        </Breadcrumbs>
      </div>
      <div>
        <p style={{ margin: '0 0 4px', opacity: 0.6 }}>2 segments</p>
        <Breadcrumbs>
          <Breadcrumb href="/home">Home</Breadcrumb>
          <Breadcrumb href="/home/docs">Docs</Breadcrumb>
        </Breadcrumbs>
      </div>
      <div>
        <p style={{ margin: '0 0 4px', opacity: 0.6 }}>4 segments</p>
        <Breadcrumbs>
          <Breadcrumb href="/home">Home</Breadcrumb>
          <Breadcrumb href="/home/docs">Docs</Breadcrumb>
          <Breadcrumb href="/home/docs/guides">Guides</Breadcrumb>
          <Breadcrumb href="/home/docs/guides/setup">Setup</Breadcrumb>
        </Breadcrumbs>
      </div>
      <div>
        <p style={{ margin: '0 0 4px', opacity: 0.6 }}>
          5 segments — middle items collapse into a menu
        </p>
        <Breadcrumbs>
          <Breadcrumb href="/home">Home</Breadcrumb>
          <Breadcrumb href="/home/docs">Docs</Breadcrumb>
          <Breadcrumb href="/home/docs/guides">Guides</Breadcrumb>
          <Breadcrumb href="/home/docs/guides/setup">Setup</Breadcrumb>
          <Breadcrumb href="/home/docs/guides/setup/intro">
            Introduction
          </Breadcrumb>
        </Breadcrumbs>
      </div>
      <div>
        <p style={{ margin: '0 0 4px', opacity: 0.6 }}>
          7 segments — more items collapse
        </p>
        <Breadcrumbs>
          <Breadcrumb href="/home">Home</Breadcrumb>
          <Breadcrumb href="/home/docs">Docs</Breadcrumb>
          <Breadcrumb href="/home/docs/guides">Guides</Breadcrumb>
          <Breadcrumb href="/home/docs/guides/setup">Setup</Breadcrumb>
          <Breadcrumb href="/home/docs/guides/setup/intro">Intro</Breadcrumb>
          <Breadcrumb href="/home/docs/guides/setup/intro/config">
            Config
          </Breadcrumb>
          <Breadcrumb href="/home/docs/guides/setup/intro/config/advanced">
            Advanced
          </Breadcrumb>
        </Breadcrumbs>
      </div>
    </div>
  ),
});

export const InheritsColourAndFontSize = meta.story({
  args: {},
  decorators: [withRouter(['/'])],
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ fontSize: '12px', color: '#e06c75' }}>
        <p style={{ margin: '0 0 4px', opacity: 0.6 }}>12px, red</p>
        <Breadcrumbs>
          <Breadcrumb href="/home">Home</Breadcrumb>
          <Breadcrumb href="/home/settings">Settings</Breadcrumb>
          <Breadcrumb href="/home/settings/theme">Theme</Breadcrumb>
        </Breadcrumbs>
      </div>
      <div style={{ fontSize: '12px', color: '#e06c75' }}>
        <p style={{ margin: '0 0 4px', opacity: 0.6 }}>
          12px, red — with collapsing
        </p>
        <Breadcrumbs>
          <Breadcrumb href="/home">Home</Breadcrumb>
          <Breadcrumb href="/home/docs">Docs</Breadcrumb>
          <Breadcrumb href="/home/docs/guides">Guides</Breadcrumb>
          <Breadcrumb href="/home/docs/guides/setup">Setup</Breadcrumb>
          <Breadcrumb href="/home/docs/guides/setup/intro">
            Introduction
          </Breadcrumb>
        </Breadcrumbs>
      </div>
      <div style={{ fontSize: '24px', color: '#61afef' }}>
        <p style={{ margin: '0 0 4px', opacity: 0.6 }}>24px, blue</p>
        <Breadcrumbs>
          <Breadcrumb href="/home">Home</Breadcrumb>
          <Breadcrumb href="/home/settings">Settings</Breadcrumb>
          <Breadcrumb href="/home/settings/theme">Theme</Breadcrumb>
        </Breadcrumbs>
      </div>
      <div style={{ fontSize: '24px', color: '#61afef' }}>
        <p style={{ margin: '0 0 4px', opacity: 0.6 }}>
          24px, blue — with collapsing
        </p>
        <Breadcrumbs>
          <Breadcrumb href="/home">Home</Breadcrumb>
          <Breadcrumb href="/home/docs">Docs</Breadcrumb>
          <Breadcrumb href="/home/docs/guides">Guides</Breadcrumb>
          <Breadcrumb href="/home/docs/guides/setup">Setup</Breadcrumb>
          <Breadcrumb href="/home/docs/guides/setup/intro">
            Introduction
          </Breadcrumb>
        </Breadcrumbs>
      </div>
    </div>
  ),
});

export const TruncatesLongSegments = meta.story({
  args: {},
  decorators: [withRouter(['/'])],
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}
    >
      <div>
        <p style={{ margin: '0 0 4px', opacity: 0.6 }}>
          Default size — hover truncated segments to see tooltip. Try resizing
          the window to see tooltips appear/disappear as segments overflow
        </p>
        <Breadcrumbs>
          <Breadcrumb href="/home">Home</Breadcrumb>
          <Breadcrumb href="/home/catalog">
            A very long breadcrumb label that will be truncated by CSS
          </Breadcrumb>
          <Breadcrumb href="/home/catalog/details">
            Another extremely long segment name that overflows its container
          </Breadcrumb>
        </Breadcrumbs>
      </div>
      <div style={{ fontSize: '24px' }}>
        <p style={{ margin: '0 0 4px', opacity: 0.6 }}>24px</p>
        <Breadcrumbs>
          <Breadcrumb href="/home">Home</Breadcrumb>
          <Breadcrumb href="/home/catalog">
            A very long breadcrumb label that will be truncated by CSS
          </Breadcrumb>
          <Breadcrumb href="/home/catalog/details">
            Another extremely long segment name that overflows its container
          </Breadcrumb>
        </Breadcrumbs>
      </div>
    </div>
  ),
});

export const MixedSegmentTypes = meta.story({
  args: {},
  decorators: [withRouter(['/'])],
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

export const CustomStyling = meta.story({
  args: {},
  decorators: [withRouter(['/'])],
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div
        style={
          {
            fontSize: '18px',
            color: '#c678dd',
            '--bui-Breadcrumbs-font-weight-current':
              'var(--bui-font-weight-regular)',
            '--bui-Breadcrumbs-color-current': 'var(--bui-fg-primary)',
          } as Record<string, string>
        }
      >
        <p style={{ margin: '0 0 4px', opacity: 0.6 }}>
          Parent sets 18px purple — current segment overridden to regular weight
          and foreground colour
        </p>
        <Breadcrumbs>
          <Breadcrumb href="/home">Home</Breadcrumb>
          <Breadcrumb href="/home/settings">Settings</Breadcrumb>
          <Breadcrumb href="/home/settings/theme">Theme</Breadcrumb>
        </Breadcrumbs>
      </div>
      <div
        style={
          {
            '--bui-Breadcrumbs-gap': 'var(--bui-space-10)',
            '--bui-Breadcrumbs-separator-size': '1.4em',
          } as Record<string, string>
        }
      >
        <p style={{ margin: '0 0 4px', opacity: 0.6 }}>
          Wider gap and larger separator
        </p>
        <Breadcrumbs>
          <Breadcrumb href="/home">Home</Breadcrumb>
          <Breadcrumb href="/home/settings">Settings</Breadcrumb>
          <Breadcrumb href="/home/settings/theme">Theme</Breadcrumb>
        </Breadcrumbs>
      </div>
      <div
        style={
          {
            '--bui-Breadcrumbs-max-width': '100px',
            '--bui-Breadcrumbs-max-width-current': '200px',
          } as Record<string, string>
        }
      >
        <p style={{ margin: '0 0 4px', opacity: 0.6 }}>
          Custom max-width — segments capped at 100px, current at 200px
        </p>
        <Breadcrumbs>
          <Breadcrumb href="/home">Home</Breadcrumb>
          <Breadcrumb href="/home/catalog">
            A long breadcrumb label that truncates earlier
          </Breadcrumb>
          <Breadcrumb href="/home/catalog/details">
            Current segment also truncates at 200px instead of unlimited
          </Breadcrumb>
        </Breadcrumbs>
      </div>
    </div>
  ),
});
