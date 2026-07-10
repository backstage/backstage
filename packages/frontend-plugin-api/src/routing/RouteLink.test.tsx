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

import { fireEvent, render, screen } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { TestApiProvider } from '@backstage/test-utils';
import {
  createMockNavigationController,
  createMockRouteResolutionApi,
} from '@backstage/frontend-test-utils';
import { RouteLink } from './RouteLink';
import { createRouteRef } from './RouteRef';
import { navigationControllerApiRef } from './NavigationControllerApi';
import { routeResolutionApiRef } from '../apis';

describe('RouteLink', () => {
  const catalogRouteRef = createRouteRef({
    params: ['namespace', 'kind', 'name'],
  });
  const navigate = jest.fn();

  const wrapper = ({ children }: PropsWithChildren<{}>) => (
    <TestApiProvider
      apis={[
        [
          routeResolutionApiRef,
          createMockRouteResolutionApi({
            routes: [[catalogRouteRef, '/catalog/:namespace/:kind/:name']],
          }),
        ],
        [
          navigationControllerApiRef,
          createMockNavigationController({ navigate }),
        ],
      ]}
    >
      <MemoryRouter>{children}</MemoryRouter>
    </TestApiProvider>
  );

  beforeEach(() => {
    navigate.mockClear();
  });

  it('renders an href for the resolved route and navigates via the framework controller', () => {
    render(
      <RouteLink
        routeRef={catalogRouteRef}
        params={{
          namespace: 'default',
          kind: 'component',
          name: 'widget',
        }}
      >
        Widget
      </RouteLink>,
      { wrapper },
    );

    const link = screen.getByRole('link', { name: 'Widget' });
    expect(link).toHaveAttribute('href', '/catalog/default/component/widget');

    fireEvent.click(link);

    expect(navigate).toHaveBeenCalledWith(
      '/catalog/default/component/widget',
      undefined,
    );
  });

  it('supports parameter-less route refs and replace navigation', () => {
    const homeRouteRef = createRouteRef();
    render(
      <RouteLink routeRef={homeRouteRef} replace>
        Home
      </RouteLink>,
      {
        wrapper: ({ children }: PropsWithChildren<{}>) => (
          <TestApiProvider
            apis={[
              [
                routeResolutionApiRef,
                createMockRouteResolutionApi({
                  routes: [[homeRouteRef, '/catalog']],
                }),
              ],
              [
                navigationControllerApiRef,
                createMockNavigationController({ navigate }),
              ],
            ]}
          >
            <MemoryRouter>{children}</MemoryRouter>
          </TestApiProvider>
        ),
      },
    );

    fireEvent.click(screen.getByRole('link', { name: 'Home' }));
    expect(navigate).toHaveBeenCalledWith('/catalog', { replace: true });
  });

  it('does not navigate when the route cannot be resolved', () => {
    render(
      <RouteLink
        routeRef={catalogRouteRef}
        params={{
          namespace: 'default',
          kind: 'component',
          name: 'missing',
        }}
      >
        Missing
      </RouteLink>,
      {
        wrapper: ({ children }: PropsWithChildren<{}>) => (
          <TestApiProvider
            apis={[
              [
                routeResolutionApiRef,
                createMockRouteResolutionApi({
                  resolve: () => undefined,
                }),
              ],
              [
                navigationControllerApiRef,
                createMockNavigationController({ navigate }),
              ],
            ]}
          >
            <MemoryRouter>{children}</MemoryRouter>
          </TestApiProvider>
        ),
      },
    );

    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText('Missing')).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('allows modified clicks to use the native href (no framework navigate)', () => {
    render(
      <RouteLink
        routeRef={catalogRouteRef}
        params={{
          namespace: 'default',
          kind: 'component',
          name: 'widget',
        }}
      >
        Widget
      </RouteLink>,
      { wrapper },
    );

    fireEvent.click(screen.getByRole('link', { name: 'Widget' }), {
      metaKey: true,
    });
    expect(navigate).not.toHaveBeenCalled();
  });
});
