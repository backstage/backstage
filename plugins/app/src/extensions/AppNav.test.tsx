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
  createRouteRef,
} from '@backstage/frontend-plugin-api';
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
});
