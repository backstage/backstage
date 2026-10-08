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

import { act, fireEvent, render, screen } from '@testing-library/react';
import { useVersionedContext } from '@backstage/version-bridge';
import {
  BUIProvider,
  Link as BuiLink,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  MenuTrigger,
  Menu,
  MenuItem,
  Button,
} from '@backstage/ui';
import {
  appHistoryApiRef,
  NavigationProvider,
  useNavigation,
  useAppLocation,
  useAppNavigate,
} from '@backstage/frontend-plugin-api';
import {
  createMockAppHistory,
  TestApiProvider,
} from '@backstage/frontend-test-utils';
import { Link as AriaLink } from 'react-aria-components';
import {
  Link,
  Route,
  Routes,
  useHref,
  useInRouterContext,
  useLocation,
  useNavigate,
  useResolvedPath,
  type NavigateOptions,
} from 'react-router-dom';
// Exercise the same private compatibility projection as AppRoot.
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { RootHistoryRouter } from '../../../../packages/frontend-app-api/src/routing/RootHistoryRouter';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { WorkaroundNavLink } from '../../../../packages/core-components/src/layout/Sidebar/Items';
import { LegacyBUIProvider } from './LegacyBUIProvider';

// Frozen consumer contract: do not derive this type from the provider implementation.
type LegacyRouting = {
  Link: typeof Link;
  useHref: typeof useHref;
  useInRouterContext: typeof useInRouterContext;
  useLocation: typeof useLocation;
  useNavigate: typeof useNavigate;
  useResolvedPath: typeof useResolvedPath;
  createRouterOptions(
    action: () => void,
    options?: NavigateOptions,
  ): NavigateOptions;
};

function LegacyConsumer() {
  const routing = useVersionedContext<{ 2: { routing: LegacyRouting } }>(
    'bui',
  )!.atVersion(2)!.routing;
  const navigate = routing.useNavigate();
  const href = routing.useHref('details');
  const empty = routing.useResolvedPath('');
  const location = routing.useLocation();
  const options = routing.createRouterOptions(() =>
    navigate('details', { state: { legacy: true } }),
  );
  return (
    <>
      <output>
        {JSON.stringify({
          href,
          empty: empty.pathname,
          pathname: location.pathname,
          inRouter: routing.useInRouterContext(),
        })}
      </output>
      <routing.Link to="../other">Parent route</routing.Link>
      <AriaLink href="details" routerOptions={options as never}>
        Delegated route
      </AriaLink>
      <button onClick={() => navigate('')}>Empty route</button>
    </>
  );
}

function FrameworkConsumer() {
  const { pathname: href } = useAppLocation();
  const navigate = useAppNavigate();
  return (
    <>
      <BuiLink href={href}>Current pathname</BuiLink>
      <BuiLink href="">Empty href</BuiLink>
      <button onClick={() => navigate('')}>Empty framework</button>
    </>
  );
}

it('preserves the frozen V2 contract through nested providers overriding V3', async () => {
  const history = createMockAppHistory({
    basename: '/app',
    initialLocation: '/app/catalog/items/42/deep?q=1#hash',
  });
  render(
    <TestApiProvider apis={[[appHistoryApiRef, history]]}>
      <RootHistoryRouter history={history}>
        <LegacyBUIProvider>
          <BUIProvider useNavigation={useNavigation}>
            <Routes>
              <Route path="catalog">
                <Route
                  path="items/:id/*"
                  element={
                    <BUIProvider useNavigation={useNavigation}>
                      <NavigationProvider
                        useNavigation={() => ({
                          createHref: () => '/unrelated',
                          navigate: () => {},
                          pathname: '/unrelated',
                        })}
                      >
                        <LegacyConsumer />
                      </NavigationProvider>
                      <FrameworkConsumer />
                      <WorkaroundNavLink to="details">
                        Legacy sidebar
                      </WorkaroundNavLink>
                      <MenuTrigger>
                        <Button>Actions</Button>
                        <Menu>
                          <MenuItem onAction={() => {}}>Action only</MenuItem>
                        </Menu>
                      </MenuTrigger>
                      <Tabs defaultSelectedKey="overview">
                        <TabList>
                          <Tab id="overview">Overview</Tab>
                          <Tab id="settings">Settings</Tab>
                        </TabList>
                        <TabPanel id="overview">Overview content</TabPanel>
                        <TabPanel id="settings">Settings content</TabPanel>
                      </Tabs>
                    </BUIProvider>
                  }
                />
              </Route>
            </Routes>
          </BUIProvider>
        </LegacyBUIProvider>
      </RootHistoryRouter>
    </TestApiProvider>,
  );
  expect(JSON.parse(screen.getByRole('status').textContent!)).toEqual({
    href: '/app/catalog/items/42/details',
    empty: '/catalog/items/42',
    pathname: '/catalog/items/42/deep',
    inRouter: true,
  });
  expect(screen.getByRole('link', { name: 'Parent route' })).toHaveAttribute(
    'href',
    '/app/catalog/other',
  );
  expect(screen.getByRole('link', { name: 'Delegated route' })).toHaveAttribute(
    'href',
    '/app/catalog/items/42/details',
  );
  expect(
    screen.getByRole('link', { name: 'Current pathname' }),
  ).toHaveAttribute('href', '/app/catalog/items/42/deep');
  expect(screen.getByRole('link', { name: 'Legacy sidebar' })).toHaveAttribute(
    'href',
    '/app/catalog/items/42/details',
  );
  fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
  fireEvent.click(await screen.findByRole('menuitem', { name: 'Action only' }));
  fireEvent.click(screen.getByRole('tab', { name: 'Settings' }));
  expect(await screen.findByText('Settings content')).toBeVisible();
  fireEvent.click(screen.getByRole('link', { name: 'Delegated route' }));
  expect(history.location).toMatchObject({
    pathname: '/catalog/items/42/details',
    state: { legacy: true },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Empty route' }));
  expect(history.location).toMatchObject({
    pathname: '/catalog/items/42',
    search: '',
    hash: '',
  });
  act(() => history.navigate('/catalog/items/42/deep?q=1#hash'));
  fireEvent.click(screen.getByRole('button', { name: 'Empty framework' }));
  expect(history.location).toMatchObject({
    pathname: '/catalog/items/42/deep',
    search: '',
    hash: '',
  });
});
