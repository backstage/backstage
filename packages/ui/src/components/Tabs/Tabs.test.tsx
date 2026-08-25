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
import {
  createVersionedValueMap,
  type VersionedValue,
} from '@backstage/version-bridge';
import { useMemo, type PropsWithChildren } from 'react';
import { RouterProvider } from 'react-aria-components';
import {
  Link as RouterLink,
  MemoryRouter,
  Route,
  Routes,
  useHref,
  useInRouterContext,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom';
import { useResolvedHref } from '../../hooks/useResolvedHref';
import type { BUIRoutingIntegration } from '../../navigation/types';
import { BUIContext, type BUIContextVersions } from '../../provider/BUIContext';
import { BUIProvider } from '../../provider/BUIProvider';
import { Tab, TabList, Tabs } from './Tabs';

function LocationStatus() {
  return <span role="status">{useLocation().pathname}</span>;
}

describe('Tab links', () => {
  it('renders an internal href as a native anchor outside React Router', () => {
    render(
      <Tabs>
        <TabList>
          <Tab id="overview" href="/catalog/overview">
            Overview
          </Tab>
        </TabList>
      </Tabs>,
    );

    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'href',
      '/catalog/overview',
    );
  });

  it('renders the host basename and navigates without a document reload', () => {
    render(
      <MemoryRouter
        basename="/app"
        initialEntries={['/app/catalog']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <BUIProvider>
          <Tabs>
            <TabList>
              <Tab id="overview" href="/catalog/overview">
                Overview
              </Tab>
            </TabList>
          </Tabs>
          <LocationStatus />
        </BUIProvider>
      </MemoryRouter>,
    );

    const tab = screen.getByRole('tab', { name: 'Overview' });
    expect(tab).toHaveAttribute('href', '/app/catalog/overview');
    fireEvent.click(tab);
    expect(screen.getByRole('status')).toHaveTextContent('/catalog/overview');
  });

  it('reports a relative raw href through V1 analytics', () => {
    const captureEvent = jest.fn();
    render(
      <MemoryRouter
        basename="/app"
        initialEntries={['/app/catalog/entity/docs']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <V1AnalyticsProvider captureEvent={captureEvent}>
          <Routes>
            <Route
              path="catalog/entity/docs/*"
              element={
                <Tabs>
                  <TabList>
                    <Tab id="child" href="child">
                      Child
                    </Tab>
                  </TabList>
                </Tabs>
              }
            />
          </Routes>
          <LocationStatus />
        </V1AnalyticsProvider>
      </MemoryRouter>,
    );

    const tab = screen.getByRole('tab', { name: 'Child' });
    expect(tab).toHaveAttribute('href', '/app/catalog/entity/docs/child');
    fireEvent.click(tab);
    expect(screen.getByRole('status')).toHaveTextContent(
      '/catalog/entity/docs/child',
    );
    expect(captureEvent).toHaveBeenCalledWith('click', 'Child', {
      attributes: { to: 'child' },
    });
  });

  it('preserves active-route selection and render state', () => {
    render(
      <MemoryRouter
        basename="/app"
        initialEntries={['/app/catalog/overview']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <BUIProvider>
          <Tabs>
            <TabList>
              <Tab
                id="overview"
                href="/catalog/overview"
                className="consumer-tab"
                style={({ isSelected }) => ({
                  opacity: isSelected ? 1 : 0.5,
                })}
              >
                {({ isSelected }) =>
                  isSelected ? 'Selected overview' : 'Overview'
                }
              </Tab>
            </TabList>
          </Tabs>
        </BUIProvider>
      </MemoryRouter>,
    );

    const tab = screen.getByRole('tab', { name: 'Selected overview' });
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(tab).toHaveClass('consumer-tab');
    expect(tab).toHaveStyle({ opacity: '1' });
  });

  it('matches relative internal tabs whose activation remains browser-owned', () => {
    render(
      <MemoryRouter
        basename="/app"
        initialEntries={['/app/catalog/entity/docs/child']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <BUIProvider>
          <Routes>
            <Route
              path="catalog/entity/docs/*"
              element={
                <>
                  <Tabs>
                    <TabList>
                      <Tab id="target-other" href="other">
                        Target other
                      </Tab>
                      <Tab id="target-child" href="." target="_blank">
                        Target child
                      </Tab>
                    </TabList>
                  </Tabs>
                  <Tabs>
                    <TabList>
                      <Tab id="download-other" href="other">
                        Download other
                      </Tab>
                      <Tab id="download-child" href="." download>
                        Download child
                      </Tab>
                    </TabList>
                  </Tabs>
                </>
              }
            />
          </Routes>
        </BUIProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('tab', { name: 'Target child' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: 'Download child' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('matches an exact tab by pathname when href and location have query and hash', () => {
    render(
      <MemoryRouter
        basename="/app"
        initialEntries={['/app/catalog/entity/docs?view=grid#details']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <BUIProvider>
          <Tabs>
            <TabList>
              <Tab
                id="docs"
                href="/catalog/entity/docs?tab=all#api"
                matchStrategy="exact"
              >
                Docs
              </Tab>
            </TabList>
          </Tabs>
        </BUIProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('tab', { name: 'Docs' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('does not exact-match a nested splat path', () => {
    render(
      <MemoryRouter
        basename="/app"
        initialEntries={['/app/catalog/entity/docs/page']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <BUIProvider>
          <Routes>
            <Route
              path="catalog/entity/docs/*"
              element={
                <Tabs>
                  <TabList>
                    <Tab
                      id="docs"
                      href="/catalog/entity/docs"
                      matchStrategy="exact"
                    >
                      Docs
                    </Tab>
                  </TabList>
                </Tabs>
              }
            />
          </Routes>
        </BUIProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('tab', { name: 'Docs' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('prefix-matches a nested splat path and selects the most-specific tab', () => {
    render(
      <MemoryRouter
        basename="/app"
        initialEntries={['/app/catalog/entity/docs/page']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <BUIProvider>
          <Routes>
            <Route
              path="catalog/entity/*"
              element={
                <Tabs>
                  <TabList>
                    <Tab
                      id="entity"
                      href="/catalog/entity"
                      matchStrategy="prefix"
                    >
                      Entity
                    </Tab>
                    <Tab
                      id="docs"
                      href="/catalog/entity/docs"
                      matchStrategy="prefix"
                    >
                      Docs
                    </Tab>
                  </TabList>
                </Tabs>
              }
            />
          </Routes>
        </BUIProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('tab', { name: 'Docs' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: 'Entity' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('registers tab navigation with the selected routing integration', () => {
    const createRouterOptions = jest.fn(() => ({ replace: true }));
    render(
      <MemoryRouter
        basename="/app"
        initialEntries={['/app/catalog']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <TrackingRoutingProvider createRouterOptions={createRouterOptions}>
          <Tabs>
            <TabList>
              <Tab id="overview" href="/catalog/overview">
                Overview
              </Tab>
            </TabList>
          </Tabs>
        </TrackingRoutingProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'href',
      '/app/catalog/overview',
    );
    expect(createRouterOptions).toHaveBeenCalledTimes(1);
  });
});

function V1AnalyticsProvider({
  children,
  captureEvent,
}: PropsWithChildren<{ captureEvent: jest.Mock }>) {
  const navigate = useNavigate();
  const value = useMemo(
    () =>
      createVersionedValueMap({
        1: { useAnalytics: () => ({ captureEvent }) },
      }) as unknown as VersionedValue<BUIContextVersions>,
    [captureEvent],
  );

  return (
    <RouterProvider navigate={navigate} useHref={useResolvedHref}>
      <BUIContext.Provider value={value}>{children}</BUIContext.Provider>
    </RouterProvider>
  );
}

function TrackingRoutingProvider({
  children,
  createRouterOptions,
}: PropsWithChildren<{
  createRouterOptions: BUIRoutingIntegration['createRouterOptions'];
}>) {
  const routing = useMemo<BUIRoutingIntegration>(
    () => ({
      Link: RouterLink,
      useHref,
      useInRouterContext,
      useLocation,
      useNavigate,
      useResolvedPath,
      createRouterOptions,
    }),
    [createRouterOptions],
  );
  const value = useMemo(
    () => createVersionedValueMap({ 1: {}, 2: { routing } }),
    [routing],
  );
  return <BUIContext.Provider value={value}>{children}</BUIContext.Provider>;
}
