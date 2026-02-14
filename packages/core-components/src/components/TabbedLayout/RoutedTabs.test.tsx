/*
 * Copyright 2020 The Backstage Authors
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

import { renderInTestApp } from '@backstage/test-utils';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  MemoryRouter,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom';
import { RoutedTabs, useSelectedSubRoute } from './RoutedTabs';
import { Link } from '../Link';

const testRoute1 = {
  path: '',
  title: 'tabbed-test-title',
  children: <div>tabbed-test-content</div>,
};
const testRoute2 = {
  title: 'tabbed-test-title-2',
  path: '/some-other-path',
  children: <div>tabbed-test-content-2</div>,
};

const testRoute3 = {
  title: 'tabbed-test-title-3',
  path: 'some-other-path-similar',
  children: <div>tabbed-test-content-3</div>,
};

describe('RoutedTabs', () => {
  it('renders simplest case', async () => {
    const rendered = await renderInTestApp(
      <RoutedTabs routes={[testRoute1]} />,
    );

    expect(rendered.getByText('tabbed-test-title')).toBeInTheDocument();
    expect(rendered.getByText('tabbed-test-content')).toBeInTheDocument();
  });

  it('navigates when user clicks different tab', async () => {
    const rendered = await renderInTestApp(
      <Routes>
        <Route
          path="/*"
          element={<RoutedTabs routes={[testRoute1, testRoute2, testRoute3]} />}
        />
      </Routes>,
    );

    const secondTab = rendered.queryAllByRole('tab')[1];
    act(() => {
      fireEvent.click(secondTab);
    });

    expect(rendered.getByText('tabbed-test-title')).toBeInTheDocument();
    expect(rendered.queryByText('tabbed-test-content')).not.toBeInTheDocument();

    expect(rendered.getByText('tabbed-test-title-2')).toBeInTheDocument();
    expect(rendered.getByText('tabbed-test-content-2')).toBeInTheDocument();

    const thirdTab = rendered.queryAllByRole('tab')[2];
    act(() => {
      fireEvent.click(thirdTab);
    });
    expect(rendered.getByText('tabbed-test-title-3')).toBeInTheDocument();
    expect(rendered.getByText('tabbed-test-content-3')).toBeInTheDocument();
  });

  describe('correctly delegates nested links', () => {
    const renderRoute = (route: string) =>
      renderInTestApp(
        <Routes>
          <Route
            path="/*"
            element={
              <RoutedTabs
                routes={[
                  testRoute1,
                  {
                    ...testRoute2,
                    children: (
                      <div>
                        tabbed-test-content-2
                        <Routes>
                          <Route
                            path="/nested"
                            element={<div>tabbed-test-nested-content-2</div>}
                          />
                        </Routes>
                      </div>
                    ),
                  },
                ]}
              />
            }
          />
        </Routes>,
        { routeEntries: [route] },
      );

    it('works for nested content', async () => {
      const rendered = await renderRoute('/some-other-path/nested');

      expect(
        rendered.queryByText('tabbed-test-content'),
      ).not.toBeInTheDocument();
      expect(rendered.getByText('tabbed-test-content-2')).toBeInTheDocument();
      expect(
        rendered.getByText('tabbed-test-nested-content-2'),
      ).toBeInTheDocument();
    });

    it('works for non-nested content', async () => {
      const rendered = await renderRoute('/some-other-path/');

      expect(
        rendered.queryByText('tabbed-test-content'),
      ).not.toBeInTheDocument();
      expect(rendered.getByText('tabbed-test-content-2')).toBeInTheDocument();
      expect(
        rendered.queryByText('tabbed-test-nested-content-2'),
      ).not.toBeInTheDocument();
    });
  });

  it('shows only one tab contents at a time', async () => {
    const rendered = await renderInTestApp(
      <RoutedTabs routes={[testRoute1, testRoute2]} />,
      { routeEntries: ['/some-other-path'] },
    );

    expect(rendered.getByText('tabbed-test-title')).toBeInTheDocument();
    expect(rendered.queryByText('tabbed-test-content')).not.toBeInTheDocument();

    expect(rendered.getByText('tabbed-test-title-2')).toBeInTheDocument();
    expect(rendered.getByText('tabbed-test-content-2')).toBeInTheDocument();
  });

  it('redirects to the top level when no route is matching the url', async () => {
    const rendered = await renderInTestApp(
      <RoutedTabs routes={[testRoute1, testRoute2]} />,
      { routeEntries: ['/non-existing-path'] },
    );

    expect(rendered.getByText('tabbed-test-title')).toBeInTheDocument();
    expect(rendered.getByText('tabbed-test-content')).toBeInTheDocument();
    expect(rendered.getByText('tabbed-test-title-2')).toBeInTheDocument();

    expect(
      rendered.queryByText('tabbed-test-content-2'),
    ).not.toBeInTheDocument();
  });

  it('should render the tabs as <a> links', async () => {
    const routes = [testRoute1, testRoute2, testRoute3];
    const expectedHrefs = ['/', '/some-other-path', '/some-other-path-similar'];
    const rendered = await renderInTestApp(<RoutedTabs routes={routes} />);

    const tabs = rendered.queryAllByRole('tab');

    for (const [k, v] of Object.entries(tabs)) {
      expect(v.tagName).toBe('A');
      expect(v).toHaveAttribute('href', expectedHrefs[Number(k)]);
    }
  });

  describe('with v7_relativeSplatPath', () => {
    const v7Flags = {
      v7_relativeSplatPath: true,
      v7_startTransition: true,
    } as const;

    const v7SubRoutes = [
      {
        path: 'info',
        title: 'Info',
        children: <div>Info Content</div>,
      },
      {
        path: 'config',
        title: 'Config',
        children: <div>Config Content</div>,
      },
      {
        path: 'tasks',
        title: 'Tasks',
        children: <div>Tasks Content</div>,
      },
    ];

    function TestSubRouteHook(props: {
      subRoutes: Array<{
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

    it('should select correct tab inside parent/child Outlet route', () => {
      render(
        <MemoryRouter initialEntries={['/devtools/config']} future={v7Flags}>
          <Routes>
            <Route path="/devtools" element={<Outlet />}>
              <Route
                path="*"
                element={<TestSubRouteHook subRoutes={v7SubRoutes} />}
              />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('selected-index')).toHaveTextContent('1');
      expect(screen.getByTestId('selected-route-title')).toHaveTextContent(
        'Config',
      );
      expect(screen.getByTestId('element-container')).toHaveTextContent(
        'Config Content',
      );
    });

    it('should select first tab at route root', () => {
      render(
        <MemoryRouter initialEntries={['/devtools']} future={v7Flags}>
          <Routes>
            <Route path="/devtools" element={<Outlet />}>
              <Route
                index
                element={<TestSubRouteHook subRoutes={v7SubRoutes} />}
              />
              <Route
                path="*"
                element={<TestSubRouteHook subRoutes={v7SubRoutes} />}
              />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('selected-index')).toHaveTextContent('0');
      expect(screen.getByTestId('selected-route-title')).toHaveTextContent(
        'Info',
      );
    });

    it('should generate tab link hrefs that do not duplicate URL segments', () => {
      function LocationDisplay() {
        const location = useLocation();
        return <div data-testid="location">{location.pathname}</div>;
      }

      function TabLinkTest() {
        const { index, element } = useSelectedSubRoute(v7SubRoutes);
        const params = useParams();
        const splatParam = params['*'] ?? '';
        const hasSplatParam = splatParam.length > 0;
        return (
          <div>
            <div data-testid="selected-index">{index}</div>
            {v7SubRoutes.map(t => {
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
        <MemoryRouter initialEntries={['/devtools/config']} future={v7Flags}>
          <Routes>
            <Route path="/devtools" element={<Outlet />}>
              <Route path="*" element={<TabLinkTest />} />
            </Route>
          </Routes>
          <LocationDisplay />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('selected-index')).toHaveTextContent('1');
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/devtools/config',
      );

      // Tab links should resolve to sibling paths, NOT duplicate segments
      expect(screen.getByTestId('tab-Info')).toHaveAttribute(
        'href',
        '/devtools/info',
      );
      expect(screen.getByTestId('tab-Config')).toHaveAttribute(
        'href',
        '/devtools/config',
      );
      expect(screen.getByTestId('tab-Tasks')).toHaveAttribute(
        'href',
        '/devtools/tasks',
      );
    });

    it('should navigate between tabs without URL duplication', async () => {
      const user = userEvent.setup();

      function LocationDisplay() {
        const location = useLocation();
        return <div data-testid="location">{location.pathname}</div>;
      }

      function TabLinkTest() {
        const { index, element } = useSelectedSubRoute(v7SubRoutes);
        const params = useParams();
        const splatParam = params['*'] ?? '';
        const hasSplatParam = splatParam.length > 0;
        return (
          <div>
            <div data-testid="selected-index">{index}</div>
            {v7SubRoutes.map(t => {
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
        <MemoryRouter initialEntries={['/devtools/info']} future={v7Flags}>
          <Routes>
            <Route path="/devtools" element={<Outlet />}>
              <Route index element={<TabLinkTest />} />
              <Route path="*" element={<TabLinkTest />} />
            </Route>
          </Routes>
          <LocationDisplay />
        </MemoryRouter>,
      );

      // Start on info tab
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/devtools/info',
      );
      expect(screen.getByTestId('selected-index')).toHaveTextContent('0');

      // Click Config tab
      await user.click(screen.getByTestId('tab-Config'));

      // Should navigate to config, NOT /devtools/info/config
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/devtools/config',
      );
      expect(screen.getByTestId('selected-index')).toHaveTextContent('1');

      // Click Tasks tab
      await user.click(screen.getByTestId('tab-Tasks'));

      // Should navigate to tasks, NOT /devtools/config/tasks
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/devtools/tasks',
      );
      expect(screen.getByTestId('selected-index')).toHaveTextContent('2');

      // Click Info tab
      await user.click(screen.getByTestId('tab-Info'));

      // Should navigate back to info
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/devtools/info',
      );
      expect(screen.getByTestId('selected-index')).toHaveTextContent('0');
    });
  });
});
