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
import { TestRouter, useTestRouter } from '../../testUtils/TestRouter';
import {
  createVersionedValueMap,
  type VersionedValue,
} from '@backstage/version-bridge';
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { RouterProvider } from 'react-aria-components';
import { Route, Routes, useLocation } from 'react-router-dom';
import { BUIContext, type BUIContextVersions } from '../../provider/BUIContext';
import { BUIProvider, type BUIRouter } from '../../provider';
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
      <TestRouter
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
      </TestRouter>,
    );

    const tab = screen.getByRole('tab', { name: 'Overview' });
    expect(tab).toHaveAttribute('href', '/app/catalog/overview');
    fireEvent.click(tab);
    expect(screen.getByRole('status')).toHaveTextContent('/catalog/overview');
  });

  it('reports a relative raw href through V1 analytics', () => {
    const captureEvent = jest.fn();
    render(
      <TestRouter
        basename="/app"
        initialEntries={['/app/catalog/entity/docs']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route
            path="catalog/entity/docs/*"
            element={
              <V1AnalyticsProvider captureEvent={captureEvent}>
                <Tabs>
                  <TabList>
                    <Tab id="child" href="child">
                      Child
                    </Tab>
                  </TabList>
                </Tabs>
              </V1AnalyticsProvider>
            }
          />
        </Routes>
        <LocationStatus />
      </TestRouter>,
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
      <TestRouter
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
      </TestRouter>,
    );

    const tab = screen.getByRole('tab', { name: 'Selected overview' });
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(tab).toHaveClass('consumer-tab');
    expect(tab).toHaveStyle({ opacity: '1' });
  });

  it('matches relative internal tabs whose activation remains browser-owned', () => {
    render(
      <TestRouter
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
      </TestRouter>,
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
      <TestRouter
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
      </TestRouter>,
    );

    expect(screen.getByRole('tab', { name: 'Docs' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('does not exact-match a nested splat path', () => {
    render(
      <TestRouter
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
      </TestRouter>,
    );

    expect(screen.getByRole('tab', { name: 'Docs' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('prefix-matches a nested splat path and selects the most-specific tab', () => {
    render(
      <TestRouter
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
      </TestRouter>,
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
});

function V1AnalyticsProvider({
  children,
  captureEvent,
}: PropsWithChildren<{ captureEvent: jest.Mock }>) {
  const router = useTestRouter();
  const value = useMemo(
    () =>
      createVersionedValueMap({
        1: { useAnalytics: () => ({ captureEvent }) },
      }) as unknown as VersionedValue<BUIContextVersions>,
    [captureEvent],
  );

  return (
    <RouterProvider navigate={router.navigate} useHref={router.resolveHref}>
      <BUIContext.Provider value={value}>{children}</BUIContext.Provider>
    </RouterProvider>
  );
}

describe('Tabs', () => {
  it('uses the collection route scope for hrefs, navigation, and active selection', () => {
    const Scope = createContext('/outer');
    const Location = createContext({
      pathname: '/base/inner/details',
      navigate: (_pathname: string) => {},
    });
    function useHostRouter(): BUIRouter {
      const scope = useContext(Scope);
      const location = useContext(Location);
      const resolveHref = (href: string) => `/base${scope}/${href}`;
      return {
        pathname: location.pathname,
        resolveHref,
        navigate: href => location.navigate(resolveHref(href)),
      };
    }
    function Host() {
      const [pathname, navigate] = useState('/base/inner/details');
      return (
        <Location.Provider value={{ pathname, navigate }}>
          <BUIProvider useRouter={useHostRouter}>
            <Tabs>
              <TabList>
                <Scope.Provider value="/inner">
                  <Tab id="details" href="details">
                    Details
                  </Tab>
                </Scope.Provider>
              </TabList>
            </Tabs>
            <span role="status">{pathname}</span>
          </BUIProvider>
        </Location.Provider>
      );
    }

    render(<Host />);

    const tab = screen.getByRole('tab', { name: 'Details' });
    expect(tab).toHaveAttribute('href', '/base/outer/details');
    expect(tab).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('status')).toHaveTextContent('/base/inner/details');

    fireEvent.click(tab);

    expect(screen.getByRole('status')).toHaveTextContent('/base/outer/details');
    expect(tab).toHaveAttribute('href', '/base/outer/details');
    expect(tab).toHaveAttribute('aria-selected', 'true');
  });

  it('passes native activation and router options through the explicit host', () => {
    const router: BUIRouter = {
      navigate: jest.fn(),
      resolveHref: href => `/app/catalog/${href}`,
      pathname: '/app/catalog/overview',
    };
    const routerOptions = { replace: true, state: { from: 'tab' } };
    render(
      <BUIProvider useRouter={() => router}>
        <Tabs>
          <TabList>
            <Tab id="settings" href="settings" routerOptions={routerOptions}>
              Settings
            </Tab>
          </TabList>
        </Tabs>
      </BUIProvider>,
    );

    const tab = screen.getByRole('tab', { name: 'Settings' });
    expect(tab).toHaveAttribute('href', '/app/catalog/settings');
    fireEvent.click(tab, { ctrlKey: true });
    expect(router.navigate).not.toHaveBeenCalled();
    fireEvent.click(tab);
    expect(router.navigate).toHaveBeenCalledWith('settings', routerOptions);
  });

  it('selects routed tabs from the injected router without React Router context', async () => {
    const router: BUIRouter = {
      navigate: jest.fn(),
      resolveHref: href => href,
      pathname: '/catalog/entity/overview/details',
    };

    render(
      <BUIProvider useRouter={() => router}>
        <Tabs>
          <TabList>
            <Tab
              id="overview"
              href="/catalog/entity/overview"
              matchStrategy="prefix"
            >
              Overview
            </Tab>
            <Tab
              id="settings"
              href="/catalog/entity/settings"
              matchStrategy="prefix"
            >
              Settings
            </Tab>
          </TabList>
        </Tabs>
      </BUIProvider>,
    );

    expect(
      await screen.findByRole('tab', { name: 'Overview' }),
    ).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('resolves relative routed tabs through the injected router for active selection', async () => {
    const router: BUIRouter = {
      navigate: jest.fn(),
      resolveHref: href =>
        href.startsWith('/') ? `/app${href}` : `/app/catalog/${href}`,
      pathname: '/app/catalog/settings/details',
    };

    render(
      <BUIProvider useRouter={() => router}>
        <Tabs>
          <TabList>
            <Tab id="overview" href="overview" matchStrategy="prefix">
              Overview
            </Tab>
            <Tab id="settings" href="settings" matchStrategy="prefix">
              Settings
            </Tab>
          </TabList>
        </Tabs>
      </BUIProvider>,
    );

    expect(
      await screen.findByRole('tab', { name: 'Settings' }),
    ).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/app/catalog/settings',
    );
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('keeps an explicit React Router adapter basename and relative-route selection', async () => {
    render(
      <TestRouter
        basename="/app"
        initialEntries={['/app/catalog/settings/details']}
      >
        <BUIProvider>
          <Routes>
            <Route
              path="/catalog/*"
              element={
                <Tabs>
                  <TabList>
                    <Tab id="overview" href="overview" matchStrategy="prefix">
                      Overview
                    </Tab>
                    <Tab id="settings" href="settings" matchStrategy="prefix">
                      Settings
                    </Tab>
                  </TabList>
                </Tabs>
              }
            />
          </Routes>
        </BUIProvider>
      </TestRouter>,
    );

    expect(
      await screen.findByRole('tab', { name: 'Settings' }),
    ).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/app/catalog/settings',
    );
  });
});
