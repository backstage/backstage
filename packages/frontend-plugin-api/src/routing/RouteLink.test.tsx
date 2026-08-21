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

import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { TestApiProvider } from '@backstage/test-utils';
import {
  createMockAppHistory,
  createMockRouteResolutionApi,
} from '@backstage/frontend-test-utils';
import { RouteLink } from './RouteLink';
import { createRouteRef } from './RouteRef';
import { appHistoryApiRef } from './AppHistoryApi';
import { routeResolutionApiRef } from '../apis';

describe('RouteLink', () => {
  const catalogRouteRef = createRouteRef({
    params: ['namespace', 'kind', 'name'],
  });
  const navigate = jest.fn();

  const widgetLink = (
    <RouteLink
      routeRef={catalogRouteRef}
      params={{
        namespace: 'default',
        kind: 'component',
        name: 'widget',
      }}
    >
      Widget
    </RouteLink>
  );

  const routeResolution = createMockRouteResolutionApi({
    routes: [[catalogRouteRef, '/catalog/:namespace/:kind/:name']],
  });

  // The app is deployed under a sub-path, so hrefs have to carry the basename
  // even though route refs resolve to app-relative paths.
  const wrapper = ({ children }: PropsWithChildren<{}>) => (
    <TestApiProvider
      apis={[
        [routeResolutionApiRef, routeResolution],
        [
          appHistoryApiRef,
          createMockAppHistory({ navigate, basename: '/backstage' }),
        ],
      ]}
    >
      <MemoryRouter>{children}</MemoryRouter>
    </TestApiProvider>
  );

  // Old frontend system: no app history is registered, so the basename comes
  // from the router instead.
  const legacyWrapper = ({ children }: PropsWithChildren<{}>) => (
    <TestApiProvider apis={[[routeResolutionApiRef, routeResolution]]}>
      <MemoryRouter basename="/backstage" initialEntries={['/backstage']}>
        {children}
      </MemoryRouter>
    </TestApiProvider>
  );

  beforeEach(() => {
    navigate.mockClear();
  });

  it('renders an href for the resolved route and navigates via the app history', () => {
    render(widgetLink, { wrapper });

    const link = screen.getByRole('link', { name: 'Widget' });
    // The href is what the browser would follow, so it includes the deploy
    // basename ...
    expect(link).toHaveAttribute(
      'href',
      '/backstage/catalog/default/component/widget',
    );

    fireEvent.click(link);

    // ... while navigate still receives the app-relative path.
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
              [appHistoryApiRef, createMockAppHistory({ navigate })],
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
              [appHistoryApiRef, createMockAppHistory({ navigate })],
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

  it('leaves a browser-followable href for clicks it does not handle', () => {
    const { unmount } = render(widgetLink, { wrapper });

    // A modified click is left to the browser, which follows the href.
    const frameworkLink = screen.getByRole('link', { name: 'Widget' });
    const modifiedClick = createEvent.click(frameworkLink, { metaKey: true });
    fireEvent(frameworkLink, modifiedClick);

    expect(navigate).not.toHaveBeenCalled();
    expect(modifiedClick.defaultPrevented).toBe(false);
    expect(frameworkLink).toHaveAttribute(
      'href',
      '/backstage/catalog/default/component/widget',
    );
    unmount();

    // Same under the old frontend system, where there is no app history to
    // handle any click at all.
    render(widgetLink, { wrapper: legacyWrapper });
    const legacyLink = screen.getByRole('link', { name: 'Widget' });
    const plainClick = createEvent.click(legacyLink);
    fireEvent(legacyLink, plainClick);

    expect(navigate).not.toHaveBeenCalled();
    expect(plainClick.defaultPrevented).toBe(false);
    expect(legacyLink).toHaveAttribute(
      'href',
      '/backstage/catalog/default/component/widget',
    );
  });
});
