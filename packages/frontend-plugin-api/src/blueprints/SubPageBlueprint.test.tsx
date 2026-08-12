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

import { act, screen, waitFor } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import {
  Route,
  Routes,
  useLocation,
  useParams,
  useResolvedPath,
} from 'react-router-dom';
import {
  pageRouterApiRef,
  type PageRouterComponent,
} from '../apis/definitions/PageRouterApi';
import { useHref } from '../routing';
import { PageBlueprint } from './PageBlueprint';
import { PageRouterBlueprint } from './PageRouterBlueprint';
import { SubPageBlueprint } from './SubPageBlueprint';
import { usePageMount } from '@internal/frontend';
import { createContext, useContext, useState } from 'react';

describe('SubPageBlueprint', () => {
  it('should expose an optional singleton router input', () => {
    const subPage = SubPageBlueprint.make({
      name: 'overview',
      params: {
        path: 'overview',
        title: 'Overview',
        loader: async () => <div>Overview</div>,
      },
    });

    expect(subPage.inputs.router).toEqual(
      expect.objectContaining({
        $$type: '@backstage/ExtensionInput',
        config: expect.objectContaining({
          optional: true,
          singleton: true,
        }),
      }),
    );
  });

  it('should give each subpage its own PageMount at parentBase + / + subPath', async () => {
    // Unnamed parent → page:test; named subpages attach relatively (same as
    // production plugins such as app-visualizer).
    const parentPage = PageBlueprint.make({
      params: {
        path: '/devtools',
        title: 'DevTools',
      },
    });

    const infoSubPage = SubPageBlueprint.make({
      name: 'info',
      params: {
        path: 'info',
        title: 'Info',
        loader: async () => {
          const Probe = () => {
            const mount = usePageMount();
            return (
              <div data-testid="info-page">
                <div data-testid="mount-base">{mount?.basePath}</div>
              </div>
            );
          };
          return <Probe />;
        },
      },
    });

    const configSubPage = SubPageBlueprint.make({
      name: 'config',
      params: {
        path: 'config',
        title: 'Config',
        loader: async () => {
          const Probe = () => {
            const mount = usePageMount();
            return (
              <div data-testid="config-page">
                <div data-testid="mount-base">{mount?.basePath}</div>
              </div>
            );
          };
          return <Probe />;
        },
      },
    });

    const { unmount } = renderTestApp({
      extensions: [parentPage, infoSubPage, configSubPage],
      initialRouteEntries: ['/devtools/info'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('info-page')).toBeInTheDocument();
      expect(screen.getByTestId('mount-base')).toHaveTextContent(
        '/devtools/info',
      );
    });

    unmount();

    renderTestApp({
      extensions: [parentPage, infoSubPage, configSubPage],
      initialRouteEntries: ['/devtools/config'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('config-page')).toBeInTheDocument();
      expect(screen.getByTestId('mount-base')).toHaveTextContent(
        '/devtools/config',
      );
    });
  });

  it('should render subpage content without a router override', async () => {
    const parentPage = PageBlueprint.make({
      params: {
        path: '/settings',
        title: 'Settings',
      },
    });

    const generalSubPage = SubPageBlueprint.make({
      name: 'general',
      params: {
        path: 'general',
        title: 'General',
        loader: async () => {
          const Probe = () => {
            const location = useLocation();
            const mount = usePageMount();
            return (
              <div data-testid="general-page">
                <div data-testid="pathname">{location.pathname}</div>
                <div data-testid="mount-base">{mount?.basePath}</div>
              </div>
            );
          };
          return <Probe />;
        },
      },
    });

    renderTestApp({
      extensions: [parentPage, generalSubPage],
      initialRouteEntries: ['/settings/general'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('general-page')).toBeInTheDocument();
      expect(screen.getByTestId('mount-base')).toHaveTextContent(
        '/settings/general',
      );
      expect(screen.getByTestId('pathname')).toHaveTextContent(
        '/settings/general',
      );
    });
  });

  it('should inherit one page router while giving ordinary subpage content its own mount', async () => {
    const RouterStack = createContext<readonly string[]>([]);

    const createRouter = (name: string): PageRouterComponent => {
      return ({ children }) => {
        const stack = useContext(RouterStack);
        const mount = usePageMount();
        const [state, setState] = useState(0);
        return (
          <RouterStack.Provider value={[...stack, name]}>
            <div data-testid={`${name}-router`}>
              <span data-testid={`${name}-router-mount`}>
                {mount?.basePath}
              </span>
              <span data-testid={`${name}-router-state`}>{state}</span>
              <button
                type="button"
                onClick={() => setState(value => value + 1)}
              >
                Bump {name}
              </button>
              {children}
            </div>
          </RouterStack.Provider>
        );
      };
    };

    const DefaultRouter = createRouter('default');
    const PageRouter = createRouter('page');
    const page = PageBlueprint.make({
      params: { path: '/inherit', title: 'Inheritance' },
    });
    const pageRouter = PageRouterBlueprint.make({
      name: 'page-router',
      attachTo: { id: 'page:test', input: 'router' },
      params: { component: PageRouter },
    });
    const createSubPage = (name: string) =>
      SubPageBlueprint.make({
        name,
        params: {
          path: name,
          title: name,
          loader: async () => {
            const Probe = () => (
              <div data-testid={`${name}-page`}>
                <span data-testid="router-stack">
                  {useContext(RouterStack).join('>')}
                </span>
                <span data-testid="content-mount">
                  {usePageMount()?.basePath}
                </span>
              </div>
            );
            return <Probe />;
          },
        },
      });

    const { appHistory } = renderTestApp({
      apis: [[pageRouterApiRef, DefaultRouter]],
      extensions: [
        page,
        pageRouter,
        createSubPage('overview'),
        createSubPage('settings'),
      ],
      initialRouteEntries: ['/inherit/overview'],
    });

    expect(await screen.findByTestId('overview-page')).toBeInTheDocument();
    expect(screen.getByTestId('router-stack').textContent).toBe('page');
    expect(screen.getByTestId('page-router-mount').textContent).toBe(
      '/inherit',
    );
    expect(screen.getByTestId('content-mount').textContent).toBe(
      '/inherit/overview',
    );
    expect(screen.queryByTestId('default-router')).not.toBeInTheDocument();

    await act(async () => {
      screen.getByRole('button', { name: 'Bump page' }).click();
      screen.getByRole('button', { name: 'Bump page' }).click();
    });
    expect(screen.getByTestId('page-router-state')).toHaveTextContent('2');

    await act(async () => {
      appHistory.navigate('/inherit/settings');
    });

    expect(await screen.findByTestId('settings-page')).toBeInTheDocument();
    expect(screen.getByTestId('router-stack').textContent).toBe('page');
    expect(screen.getByTestId('page-router-mount').textContent).toBe(
      '/inherit',
    );
    expect(screen.getByTestId('content-mount').textContent).toBe(
      '/inherit/settings',
    );
    expect(screen.getByTestId('page-router-state')).toHaveTextContent('2');
  });

  it('should keep native React Router APIs at page scope for an inherited subpage', async () => {
    const NativeRoutingProbe = () => {
      const nativeSibling = useResolvedPath('../sibling');
      const frameworkSibling = useHref('../sibling');
      const params = useParams();
      return (
        <div data-testid="native-routing-probe">
          <span data-testid="native-sibling">{nativeSibling.pathname}</span>
          <span data-testid="framework-sibling">{frameworkSibling}</span>
          <span data-testid="native-splat">{params['*']}</span>
          <Routes>
            <Route
              path="first/*"
              element={<span data-testid="nested-route">Nested route</span>}
            />
          </Routes>
        </div>
      );
    };
    const page = PageBlueprint.make({
      params: { path: '/native', title: 'Native routing' },
    });
    const firstSubPage = SubPageBlueprint.make({
      name: 'first',
      params: {
        path: 'first',
        title: 'First',
        loader: async () => <NativeRoutingProbe />,
      },
    });

    renderTestApp({
      extensions: [page, firstSubPage],
      initialRouteEntries: ['/native/first/deep'],
    });

    expect(await screen.findByTestId('nested-route')).toBeInTheDocument();
    expect(screen.getByTestId('native-sibling').textContent).toBe('/sibling');
    expect(screen.getByTestId('framework-sibling').textContent).toBe(
      '/native/sibling',
    );
    expect(screen.getByTestId('native-splat').textContent).toBe('first/deep');
  });

  it('should replace the page router with one explicit subpage router without remounting the page shell', async () => {
    const RouterStack = createContext<readonly string[]>([]);
    const createRouter = (name: string): PageRouterComponent => {
      return ({ children }) => {
        const stack = useContext(RouterStack);
        const mount = usePageMount();
        return (
          <RouterStack.Provider value={[...stack, name]}>
            <div data-testid={`${name}-router`}>
              <span data-testid={`${name}-router-mount`}>
                {mount?.basePath}
              </span>
              {children}
            </div>
          </RouterStack.Provider>
        );
      };
    };
    const ContentProbe = ({ name }: { name: string }) => (
      <div data-testid={`${name}-page`}>
        <span data-testid="router-stack">
          {useContext(RouterStack).join('>')}
        </span>
        <span data-testid="content-mount">{usePageMount()?.basePath}</span>
      </div>
    );

    const page = PageBlueprint.make({
      params: { path: '/switch', title: 'Switcher' },
    });
    const pageRouter = PageRouterBlueprint.make({
      name: 'page-router',
      attachTo: { id: 'page:test', input: 'router' },
      params: { component: createRouter('page') },
    });
    const inheritedSubPage = SubPageBlueprint.make({
      name: 'inherited',
      params: {
        path: 'inherited',
        title: 'Inherited',
        loader: async () => <ContentProbe name="inherited" />,
      },
    });
    const overriddenSubPage = SubPageBlueprint.make({
      name: 'overridden',
      params: {
        path: 'overridden',
        title: 'Overridden',
        loader: async () => <ContentProbe name="overridden" />,
      },
    });
    const subPageRouter = PageRouterBlueprint.make({
      name: 'subpage-router',
      attachTo: { id: 'sub-page:test/overridden', input: 'router' },
      params: { component: createRouter('subpage') },
    });

    const { appHistory } = renderTestApp({
      extensions: [
        page,
        pageRouter,
        inheritedSubPage,
        overriddenSubPage,
        subPageRouter,
      ],
      initialRouteEntries: ['/switch/inherited'],
    });

    expect(await screen.findByTestId('inherited-page')).toBeInTheDocument();
    expect(screen.getByTestId('router-stack').textContent).toBe('page');
    const shellTab = screen.getByRole('tab', { name: 'Inherited' });

    await act(async () => {
      appHistory.navigate('/switch/overridden');
    });

    expect(await screen.findByTestId('overridden-page')).toBeInTheDocument();
    expect(screen.getByTestId('router-stack').textContent).toBe('subpage');
    expect(screen.queryByTestId('page-router')).not.toBeInTheDocument();
    expect(screen.getByTestId('subpage-router-mount').textContent).toBe(
      '/switch/overridden',
    );
    expect(screen.getByTestId('content-mount').textContent).toBe(
      '/switch/overridden',
    );
    expect(screen.getByRole('tab', { name: 'Inherited' })).toBe(shellTab);
  });

  it('should allow a subpage router override while the parent stays on the default', async () => {
    const CustomSubpageRouter: PageRouterComponent = ({ children }) => (
      <div data-testid="custom-subpage-router">{children}</div>
    );

    const parentPage = PageBlueprint.make({
      params: {
        path: '/visualizer',
        title: 'Visualizer',
      },
    });

    const treeSubPage = SubPageBlueprint.make({
      name: 'tree',
      params: {
        path: 'tree',
        title: 'Tree',
        loader: async () => {
          const Probe = () => {
            const mount = usePageMount();
            return (
              <div data-testid="tree-page">
                <div data-testid="tree-mount">{mount?.basePath}</div>
              </div>
            );
          };
          return <Probe />;
        },
      },
    });

    // renderTestApp mounts extensions under pluginId "test"
    const treeRouter = PageRouterBlueprint.make({
      name: 'tree-router',
      attachTo: { id: 'sub-page:test/tree', input: 'router' },
      params: {
        component: CustomSubpageRouter,
      },
    });

    const detailedSubPage = SubPageBlueprint.make({
      name: 'detailed',
      params: {
        path: 'detailed',
        title: 'Detailed',
        loader: async () => {
          const Probe = () => {
            const mount = usePageMount();
            return (
              <div data-testid="detailed-page">
                <div data-testid="detailed-mount">{mount?.basePath}</div>
              </div>
            );
          };
          return <Probe />;
        },
      },
    });

    const { unmount } = renderTestApp({
      extensions: [parentPage, treeSubPage, treeRouter, detailedSubPage],
      initialRouteEntries: ['/visualizer/tree'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('tree-page')).toBeInTheDocument();
      expect(screen.getByTestId('custom-subpage-router')).toBeInTheDocument();
      expect(screen.getByTestId('tree-mount')).toHaveTextContent(
        '/visualizer/tree',
      );
    });

    unmount();

    renderTestApp({
      extensions: [parentPage, treeSubPage, treeRouter, detailedSubPage],
      initialRouteEntries: ['/visualizer/detailed'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('detailed-page')).toBeInTheDocument();
      expect(
        screen.queryByTestId('custom-subpage-router'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('detailed-mount')).toHaveTextContent(
        '/visualizer/detailed',
      );
    });
  });

  it('should keep framework hrefs and tabbed layouts scoped to the selected subpage', async () => {
    const parentPage = PageBlueprint.make({
      params: {
        path: '/create',
        title: 'Scaffolder',
      },
    });

    const templatesSubPage = SubPageBlueprint.make({
      name: 'templates',
      params: {
        path: 'templates',
        title: 'Templates',
        loader: async () => {
          const Templates = () => {
            const location = useLocation();
            const mount = usePageMount();
            return (
              <div data-testid="templates-page">
                <div data-testid="pathname">{location.pathname}</div>
                <div data-testid="mount-base">{mount?.basePath}</div>
                <a href={useHref('./actions')} data-testid="relative-link">
                  Actions
                </a>
              </div>
            );
          };
          return <Templates />;
        },
      },
    });

    const tasksSubPage = SubPageBlueprint.make({
      name: 'tasks',
      params: {
        path: 'tasks',
        title: 'Tasks',
        loader: async () => <div data-testid="tasks-page">Tasks</div>,
      },
    });

    const { appHistory } = renderTestApp({
      extensions: [parentPage, templatesSubPage, tasksSubPage],
      initialRouteEntries: ['/create/templates'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('templates-page')).toBeInTheDocument();
      expect(screen.getByTestId('pathname')).toHaveTextContent(
        '/create/templates',
      );
      expect(screen.getByTestId('mount-base')).toHaveTextContent(
        '/create/templates',
      );
      expect(screen.getByTestId('relative-link')).toHaveAttribute(
        'href',
        '/create/templates/actions',
      );
      // Tabbed layout still renders sibling tabs from the parent page.
      expect(
        screen.getByRole('tab', { name: 'Templates' }),
      ).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Tasks' })).toBeInTheDocument();
    });

    await act(async () => {
      appHistory.navigate('/create/tasks');
    });

    await waitFor(() => {
      expect(screen.getByTestId('tasks-page')).toBeInTheDocument();
    });
  });

  it('should mount a subpage of a splat page where routing matched it, from a location below the subpage', async () => {
    // A splat page says "everything below here is mine", and a sub-page claims
    // a piece of exactly that. Appending the sub-path to the page's *pattern*
    // instead of reading the match would give `/docs/*/intro` — a pattern with
    // a literal `*` in the middle, which matches no location at all and leaves
    // the sub-page's content with nothing to resolve against.
    //
    // Read from a location one level below the sub-page's own base, which is
    // the only place the base can be told apart from the current pathname.
    const Probe = () => {
      const mount = usePageMount();
      return (
        <div data-testid="intro-page">
          <div data-testid="mount-base">{mount?.basePath}</div>
          <div data-testid="mount-pattern">{mount?.routePattern}</div>
          {/* Framework href resolution uses the selected subpage mount even
              though an inherited adapter remains mounted at the page. */}
          <div data-testid="framework-href">{useHref('detail')}</div>
        </div>
      );
    };

    const docsPage = PageBlueprint.make({
      name: 'docs',
      params: { path: '/docs/*', title: 'Docs' },
    });
    const introSubPage = SubPageBlueprint.make({
      name: 'intro',
      attachTo: { id: 'page:test/docs', input: 'pages' },
      params: {
        path: 'intro',
        title: 'Intro',
        loader: async () => <Probe />,
      },
    });

    renderTestApp({
      extensions: [docsPage, introSubPage],
      initialRouteEntries: ['/docs/intro/chapter-1'],
    });

    expect(await screen.findByTestId('intro-page')).toBeInTheDocument();
    // Exact, since every wrong answer here is the right one with the tail
    // still on the end of it.
    expect(screen.getByTestId('mount-base').textContent).toBe('/docs/intro');
    expect(screen.getByTestId('mount-pattern').textContent).toBe('/docs/intro');
    expect(screen.getByTestId('framework-href').textContent).toBe(
      '/docs/intro/detail',
    );
  });
});
