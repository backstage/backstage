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

import { screen, waitFor, within } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import {
  PageBlueprint,
  createExtension,
  createFrontendModule,
  createFrontendPlugin,
  createRouteRef,
} from '@backstage/frontend-plugin-api';
import {
  NavContentBlueprint,
  NavElementBlueprint,
} from '@backstage/plugin-app-react';
import { legacyNavItemTargetDataRef } from './legacyNavItem';

const DEFAULT_CONFIG = {
  app: { baseUrl: 'http://localhost:3000' },
  backend: { baseUrl: 'http://localhost:7007' },
};

const mockRouteRef = createRouteRef();

const mockPage = PageBlueprint.make({
  name: 'my-plugin',
  params: {
    title: 'My Plugin',
    icon: <span>icon</span>,
    path: '/my-plugin',
    routeRef: mockRouteRef,
  },
});

const mockLegacyNavItem = createExtension({
  kind: 'nav-item',
  name: 'my-plugin',
  attachTo: { id: 'app/nav', input: 'items' },
  output: [legacyNavItemTargetDataRef],
  factory: () => [
    legacyNavItemTargetDataRef({
      title: 'Legacy Nav Title',
      icon: () => <span>legacy icon</span>,
      routeRef: mockRouteRef,
    }),
  ],
});

describe('AppNav', () => {
  it('should show a nav item for a page with title and icon', async () => {
    renderTestApp({
      extensions: [mockPage],
      config: DEFAULT_CONFIG,
    });

    await waitFor(() => {
      expect(
        within(screen.getByRole('navigation')).getByText('My Plugin'),
      ).toBeInTheDocument();
    });
  });

  it('should merge legacy nav item metadata when page has no explicit title', async () => {
    const pageWithoutTitle = PageBlueprint.make({
      name: 'legacy-plugin',
      params: {
        path: '/legacy-plugin',
        routeRef: mockRouteRef,
        icon: <span>page icon</span>,
      },
    });

    renderTestApp({
      extensions: [pageWithoutTitle, mockLegacyNavItem],
      config: DEFAULT_CONFIG,
    });

    await waitFor(() => {
      expect(
        within(screen.getByRole('navigation')).getByText('Legacy Nav Title'),
      ).toBeInTheDocument();
    });
  });

  it('should pass only navItems to custom navigation content', async () => {
    const customNav = NavContentBlueprint.make({
      params: {
        component: props => (
          <div>
            {'items' in props
              ? 'legacy items provided'
              : `${props.navItems.rest().length} nav item provided`}
          </div>
        ),
      },
    });

    renderTestApp({
      extensions: [mockPage],
      features: [
        createFrontendModule({
          pluginId: 'app',
          extensions: [customNav],
        }),
      ],
      config: DEFAULT_CONFIG,
    });

    await expect(
      screen.findByText('1 nav item provided'),
    ).resolves.toBeInTheDocument();
  });

  it('should render only the nav elements the app lists, by slot and in order', async () => {
    const element = (name: string) =>
      NavElementBlueprint.make({
        name,
        params: { loader: async () => <span>{`element ${name}`}</span> },
      });

    renderTestApp({
      extensions: [mockPage],
      features: [
        createFrontendPlugin({
          pluginId: 'x',
          extensions: [
            element('a'),
            element('b'),
            element('c'),
            element('not-listed'),
          ],
        }),
      ],
      config: {
        ...DEFAULT_CONFIG,
        app: {
          ...DEFAULT_CONFIG.app,
          extensions: [
            {
              'app/nav': {
                config: {
                  elements: {
                    start: ['nav-element:x/c'],
                    // `x/c` is already placed, and unknown IDs are ignored.
                    end: [
                      'nav-element:x/b',
                      'nav-element:x/a',
                      'nav-element:x/c',
                      'nav-element:x/unknown',
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    });

    const nav = await screen.findByRole('navigation');
    await within(nav).findByText('element a');
    const texts = Array.from(
      nav.querySelectorAll('span'),
      span => span.textContent,
    ).filter(text => text?.startsWith('element ') || text === 'My Plugin');

    expect(texts).toEqual(['element c', 'My Plugin', 'element b', 'element a']);
  });
});
