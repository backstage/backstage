/*
 * Copyright 2025 The Backstage Authors
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

import { screen } from '@testing-library/react';
import { useSelectedSubRoute } from './EntityTabs';
import {
  MemoryRouter,
  Route,
  Routes,
  Outlet,
  Link,
  useLocation,
  useParams,
} from 'react-router-dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const v7Flags = {
  v7_relativeSplatPath: true,
  v7_startTransition: true,
} as const;

function TestSubRouteHook(props: {
  subRoutes: Array<{
    group: string;
    path: string;
    title: string;
    children: JSX.Element;
  }>;
}) {
  const { index, route, element } = useSelectedSubRoute(props.subRoutes);
  return (
    <div>
      <div data-testid="selected-index">{index}</div>
      <div data-testid="selected-route-title">{route?.title}</div>
      <div data-testid="element-container">{element}</div>
    </div>
  );
}

describe('EntityTabs', () => {
  const subRoutes = [
    {
      group: 'default',
      path: '/overview',
      title: 'Overview',
      children: <div>Overview Content</div>,
    },
    {
      group: 'default',
      path: '/details',
      title: 'Details',
      children: <div>Details Content</div>,
    },
    {
      group: 'docs',
      path: '/docs',
      title: 'Documentation',
      children: <div>Documentation Content</div>,
    },
  ];

  describe('useSelectedSubRoute', () => {
    it('should select first tab at entity root', () => {
      render(
        <MemoryRouter
          initialEntries={['/entity/ns/kind/name']}
          future={v7Flags}
        >
          <Routes>
            <Route path="/entity/:namespace/:kind/:name" element={<Outlet />}>
              <Route
                index
                element={<TestSubRouteHook subRoutes={subRoutes} />}
              />
              <Route
                path="*"
                element={<TestSubRouteHook subRoutes={subRoutes} />}
              />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('selected-index')).toHaveTextContent('0');
      expect(screen.getByTestId('selected-route-title')).toHaveTextContent(
        'Overview',
      );
    });

    it('should select correct tab for a matching path', () => {
      render(
        <MemoryRouter
          initialEntries={['/entity/ns/kind/name/details']}
          future={v7Flags}
        >
          <Routes>
            <Route path="/entity/:namespace/:kind/:name" element={<Outlet />}>
              <Route
                path="*"
                element={<TestSubRouteHook subRoutes={subRoutes} />}
              />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('selected-index')).toHaveTextContent('1');
      expect(screen.getByTestId('selected-route-title')).toHaveTextContent(
        'Details',
      );
      expect(screen.getByTestId('element-container')).toHaveTextContent(
        'Details Content',
      );
    });

    it('should handle nested paths under a matched route', () => {
      render(
        <MemoryRouter
          initialEntries={['/entity/ns/kind/name/details/nested/path']}
          future={v7Flags}
        >
          <Routes>
            <Route path="/entity/:namespace/:kind/:name" element={<Outlet />}>
              <Route
                path="*"
                element={<TestSubRouteHook subRoutes={subRoutes} />}
              />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('selected-index')).toHaveTextContent('1');
      expect(screen.getByTestId('selected-route-title')).toHaveTextContent(
        'Details',
      );
    });

    it('should prefer more specific routes over shorter ones', () => {
      const nestedPathRoutes = [
        {
          group: 'default',
          path: '/catalog/entities',
          title: 'Entities',
          children: <div>Entities Content</div>,
        },
        {
          group: 'default',
          path: '/catalog',
          title: 'Catalog',
          children: <div>Catalog Content</div>,
        },
      ];

      render(
        <MemoryRouter
          initialEntries={['/entity/ns/kind/name/catalog/entities/some-entity']}
          future={v7Flags}
        >
          <Routes>
            <Route path="/entity/:namespace/:kind/:name" element={<Outlet />}>
              <Route
                path="*"
                element={<TestSubRouteHook subRoutes={nestedPathRoutes} />}
              />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('selected-index')).toHaveTextContent('0');
      expect(screen.getByTestId('selected-route-title')).toHaveTextContent(
        'Entities',
      );
    });

    it('should fall back to first route for unknown paths', () => {
      render(
        <MemoryRouter
          initialEntries={['/entity/ns/kind/name/unknown-path']}
          future={v7Flags}
        >
          <Routes>
            <Route path="/entity/:namespace/:kind/:name" element={<Outlet />}>
              <Route
                path="*"
                element={<TestSubRouteHook subRoutes={subRoutes} />}
              />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('selected-index')).toHaveTextContent('0');
      expect(screen.getByTestId('selected-route-title')).toHaveTextContent(
        'Overview',
      );
    });

    it('should generate tab link hrefs that do not duplicate URL segments', () => {
      function LocationDisplay() {
        const location = useLocation();
        return <div data-testid="location">{location.pathname}</div>;
      }

      function TabLinkTest() {
        const { index, element } = useSelectedSubRoute(subRoutes);
        return (
          <div>
            <div data-testid="selected-index">{index}</div>
            {subRoutes.map(t => {
              let to = t.path.replace(/\/\*$/, '').replace(/^\//, '');
              // Same logic as EntityTabs: use ../ when inside a * child
              to = to ? `../${to}` : '..';
              return (
                <Link key={t.path} to={to} data-testid={`tab-${t.title}`}>
                  {t.title}
                </Link>
              );
            })}
            <div data-testid="element-container">{element}</div>
          </div>
        );
      }

      render(
        <MemoryRouter
          initialEntries={['/entity/ns/kind/name/details']}
          future={v7Flags}
        >
          <Routes>
            <Route path="/entity/:namespace/:kind/:name" element={<Outlet />}>
              <Route path="*" element={<TabLinkTest />} />
            </Route>
          </Routes>
          <LocationDisplay />
        </MemoryRouter>,
      );

      // Verify we're on the details tab
      expect(screen.getByTestId('selected-index')).toHaveTextContent('1');
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/entity/ns/kind/name/details',
      );

      // Tab links should resolve to sibling paths, NOT duplicate segments
      expect(screen.getByTestId('tab-Overview')).toHaveAttribute(
        'href',
        '/entity/ns/kind/name/overview',
      );
      expect(screen.getByTestId('tab-Details')).toHaveAttribute(
        'href',
        '/entity/ns/kind/name/details',
      );
      expect(screen.getByTestId('tab-Documentation')).toHaveAttribute(
        'href',
        '/entity/ns/kind/name/docs',
      );
    });

    it('should navigate between tabs without URL duplication', async () => {
      const user = userEvent.setup();

      function LocationDisplay() {
        const location = useLocation();
        return <div data-testid="location">{location.pathname}</div>;
      }

      function TabLinkTest() {
        const { index, element } = useSelectedSubRoute(subRoutes);
        const hasSplatParam = !!useParams()['*'];
        return (
          <div>
            <div data-testid="selected-index">{index}</div>
            {subRoutes.map(t => {
              let to = t.path.replace(/\/\*$/, '').replace(/^\//, '');
              if (hasSplatParam) {
                to = to ? `../${to}` : '..';
              } else {
                to = to || '.';
              }
              return (
                <Link key={t.path} to={to} data-testid={`tab-${t.title}`}>
                  {t.title}
                </Link>
              );
            })}
            <div data-testid="element-container">{element}</div>
          </div>
        );
      }

      render(
        <MemoryRouter
          initialEntries={['/entity/ns/kind/name/overview']}
          future={v7Flags}
        >
          <Routes>
            <Route path="/entity/:namespace/:kind/:name" element={<Outlet />}>
              <Route index element={<TabLinkTest />} />
              <Route path="*" element={<TabLinkTest />} />
            </Route>
          </Routes>
          <LocationDisplay />
        </MemoryRouter>,
      );

      // Start on overview tab
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/entity/ns/kind/name/overview',
      );
      expect(screen.getByTestId('selected-index')).toHaveTextContent('0');

      // Click Details tab
      await user.click(screen.getByTestId('tab-Details'));

      // Should navigate to details, NOT /entity/ns/kind/name/overview/details
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/entity/ns/kind/name/details',
      );
      expect(screen.getByTestId('selected-index')).toHaveTextContent('1');

      // Click Documentation tab
      await user.click(screen.getByTestId('tab-Documentation'));

      // Should navigate to docs, NOT /entity/ns/kind/name/details/docs
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/entity/ns/kind/name/docs',
      );
      expect(screen.getByTestId('selected-index')).toHaveTextContent('2');

      // Click Overview tab
      await user.click(screen.getByTestId('tab-Overview'));

      // Should navigate back to overview
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/entity/ns/kind/name/overview',
      );
      expect(screen.getByTestId('selected-index')).toHaveTextContent('0');
    });
  });
});
