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

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderTestApp } from '@backstage/frontend-test-utils';
import {
  createRouteRef,
  PageBlueprint,
  useRouteRef,
  useNavigation,
  useAppNavigate,
  RouterLink,
} from '@backstage/frontend-plugin-api';

import {
  Routes,
  Route,
  Outlet,
  Link,
  NavLink,
  BrowserRouter,
  useLocation,
} from 'react-router-dom';
import { ReactRouterV6PageRouter } from './ReactRouterV6PageRouter';

it('binds neutral anchors and collection navigation to nested routes', async () => {
  const user = userEvent.setup();
  const otherRef = createRouteRef();
  function Controls() {
    const other = useRouteRef(otherRef)!();
    const navigation = useNavigation();
    const strictNavigate = useAppNavigate();
    const activate = () =>
      navigation.navigate('../sibling', { state: { source: 'collection' } });
    return (
      <>
        <RouterLink href="../sibling">Relative anchor</RouterLink>
        <RouterLink href={other}>Other page anchor</RouterLink>
        <RouterLink href="https://example.com">External</RouterLink>
        <output aria-label="Collection href">
          {navigation.createHref('../sibling')}
        </output>
        <output aria-label="Pathname">{navigation.pathname}</output>
        <div role="grid">
          <div
            role="row"
            tabIndex={0}
            onClick={activate}
            onKeyDown={event => {
              if (event.key === 'Enter') activate();
            }}
          >
            <span role="gridcell">Collection relative</span>
          </div>
        </div>
        <button
          onClick={() =>
            navigation.navigate('?view=docs#intro', { replace: true })
          }
        >
          Query
        </button>
        <button
          onClick={() => {
            expect(() => strictNavigate('../sibling')).toThrow(
              'App routing requires',
            );
            strictNavigate('/catalog');
          }}
        >
          Strict navigation
        </button>
      </>
    );
  }

  const page = PageBlueprint.make({
    name: 'tools',
    params: {
      path: '/tools/:name',
      loader: async () => (
        <ReactRouterV6PageRouter>
          <Routes>
            <Route path="section" element={<Outlet />}>
              <Route path="item" element={<Controls />} />
              <Route path="sibling" element={<Controls />} />
            </Route>
          </Routes>
        </ReactRouterV6PageRouter>
      ),
    },
  });
  const other = PageBlueprint.make({
    name: 'other',
    params: {
      path: '/catalog',
      routeRef: otherRef,
      loader: async () => <div>Other page</div>,
    },
  });
  const { appHistory } = renderTestApp({
    extensions: [page, other],
    initialRouteEntries: ['/tools/alpha/section/item'],
    config: {
      app: { baseUrl: 'https://example.com/base' },
      backend: { baseUrl: 'http://localhost:7007' },
    },
  });
  expect(
    await screen.findByRole('link', { name: 'Relative anchor' }),
  ).toHaveAttribute('href', '/base/tools/alpha/section/sibling');
  expect(
    screen.getByRole('status', { name: 'Collection href' }),
  ).toHaveTextContent('/base/tools/alpha/section/sibling');
  expect(screen.getByRole('status', { name: 'Pathname' })).toHaveTextContent(
    '/base/tools/alpha/section/item',
  );
  expect(
    screen.getByRole('link', { name: 'Other page anchor' }),
  ).toHaveAttribute('href', '/base/catalog');
  expect(screen.getByRole('link', { name: 'External' })).toHaveAttribute(
    'href',
    'https://example.com',
  );
  await user.click(screen.getByRole('button', { name: 'Query' }));
  expect(appHistory.getSnapshot().location).toMatchObject({
    pathname: '/tools/alpha/section/item',
    search: '?view=docs',
    hash: '#intro',
  });
  await user.click(screen.getByRole('row', { name: 'Collection relative' }));
  expect(appHistory.getSnapshot().location).toMatchObject({
    pathname: '/tools/alpha/section/sibling',
    state: { source: 'collection' },
  });
  await act(async () => appHistory.navigate('/tools/alpha/section/item'));
  await user.click(
    await screen.findByRole('link', { name: 'Relative anchor' }),
  );
  expect(appHistory.getSnapshot().location.pathname).toBe(
    '/tools/alpha/section/sibling',
  );
  await user.click(screen.getByRole('link', { name: 'Other page anchor' }));
  expect(await screen.findByText('Other page')).toBeInTheDocument();
  expect(appHistory.getSnapshot().location.pathname).toBe('/catalog');
  await act(async () => appHistory.navigate('/tools/alpha/section/item'));
  await user.click(
    await screen.findByRole('button', { name: 'Strict navigation' }),
  );
  expect(await screen.findByText('Other page')).toBeInTheDocument();
  expect(appHistory.getSnapshot().location.pathname).toBe('/catalog');
});

it('reconciles same-origin absolute links with exactly one deployment basename', async () => {
  const user = userEvent.setup();
  function Controls() {
    const location = useLocation();
    return (
      <>
        <output aria-label="Router pathname">{location.pathname}</output>
        <Link to={`${window.location.origin}/base/catalog?q=1#item`}>
          Same origin
        </Link>
        <Link to={`${window.location.origin}/base/base/foo`}>
          Repeated absolute
        </Link>
        <Link to="/base/foo" replace>
          Repeated app path
        </Link>
        <NavLink to="/catalog">Catalog active state</NavLink>
        <Link to="/baseball">Prefix boundary</Link>
        <Link to="https://elsewhere.example/base/catalog">Cross origin</Link>
      </>
    );
  }
  const page = PageBlueprint.make({
    name: 'links',
    params: {
      path: '/*',
      loader: async () => (
        <ReactRouterV6PageRouter>
          <Controls />
        </ReactRouterV6PageRouter>
      ),
    },
  });
  const { appHistory } = renderTestApp({
    extensions: [page],
    config: {
      app: { baseUrl: `${window.location.origin}/base` },
      backend: { baseUrl: 'http://localhost:7007' },
    },
  });
  expect(
    await screen.findByRole('link', { name: 'Same origin' }),
  ).toHaveAttribute('href', `${window.location.origin}/base/catalog?q=1#item`);
  expect(
    screen.getByRole('link', { name: 'Repeated app path' }),
  ).toHaveAttribute('href', '/base/base/foo');
  expect(screen.getByRole('link', { name: 'Prefix boundary' })).toHaveAttribute(
    'href',
    '/base/baseball',
  );
  const external = screen.getByRole('link', { name: 'Cross origin' });
  expect(external).toHaveAttribute(
    'href',
    'https://elsewhere.example/base/catalog',
  );
  // Prevent jsdom's document navigation while verifying RR leaves this external.
  let externalPrevented = false;
  external.addEventListener('click', event => {
    externalPrevented = event.defaultPrevented;
    event.preventDefault();
  });
  await user.click(external);
  expect(externalPrevented).toBe(false);
  expect(appHistory.getSnapshot().location.pathname).toBe('/');
  await user.click(screen.getByRole('link', { name: 'Same origin' }));
  expect(appHistory.getSnapshot().location).toMatchObject({
    pathname: '/catalog',
    search: '?q=1',
    hash: '#item',
  });
  expect(
    screen.getByRole('status', { name: 'Router pathname' }),
  ).toHaveTextContent('/catalog');
  expect(
    screen.getByRole('link', { name: 'Catalog active state' }),
  ).toHaveAttribute('aria-current', 'page');
  await user.click(screen.getByRole('link', { name: 'Repeated absolute' }));
  expect(appHistory.getSnapshot().location.pathname).toBe('/base/foo');
  await user.click(screen.getByRole('link', { name: 'Repeated app path' }));
  expect(appHistory.getSnapshot().location.pathname).toBe('/base/foo');
});

it('matches BrowserRouter encoded-path NavLink active state with a basename', async () => {
  const link = (
    <NavLink to="/docs/hello world" end>
      Encoded document
    </NavLink>
  );
  window.history.replaceState(null, '', '/base/docs/hello%20world');
  const native = render(<BrowserRouter basename="/base">{link}</BrowserRouter>);
  expect(
    screen.getByRole('link', { name: 'Encoded document' }),
  ).toHaveAttribute('aria-current', 'page');
  const href = (
    screen.getByRole('link', { name: 'Encoded document' }) as HTMLAnchorElement
  ).href;
  native.unmount();
  const page = PageBlueprint.make({
    name: 'encoded',
    params: {
      path: '/docs/:name',
      loader: async () => (
        <ReactRouterV6PageRouter>{link}</ReactRouterV6PageRouter>
      ),
    },
  });
  renderTestApp({
    extensions: [page],
    initialRouteEntries: ['/docs/hello%20world'],
    config: { app: { baseUrl: 'http://localhost/base' } },
  });
  const projected = await screen.findByRole('link', {
    name: 'Encoded document',
  });
  expect(projected).toHaveAttribute('aria-current', 'page');
  expect((projected as HTMLAnchorElement).href).toBe(href);
  window.history.replaceState(null, '', '/');
});
