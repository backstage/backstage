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
  Link,
  Route,
  Routes,
  useLocation,
  useParams,
  useResolvedPath,
} from 'react-router-dom';
import type { PageRouterComponent } from '../apis/definitions/PageRouterApi';
import { useHref } from '../routing';
import { PageBlueprint } from './PageBlueprint';
import { PageRouterBlueprint } from './PageRouterBlueprint';
import { SubPageBlueprint } from './SubPageBlueprint';
import { usePageMount } from '@internal/frontend';

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

  it('should allow a subpage router override while the parent stays on the default', async () => {
    const CustomSubpageRouter: PageRouterComponent = ({
      basePath,
      children,
    }) => (
      <div data-testid="custom-subpage-router" data-base={basePath}>
        {children}
      </div>
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
      expect(screen.getByTestId('custom-subpage-router')).toHaveAttribute(
        'data-base',
        '/visualizer/tree',
      );
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

  it('should give a subpage of a parameterized page its own params and nested routes', async () => {
    const entityPage = PageBlueprint.make({
      name: 'entity',
      params: {
        path: '/entities/:namespace/:kind/:name',
        title: 'Entity',
      },
    });

    const overviewSubPage = SubPageBlueprint.make({
      name: 'overview',
      attachTo: { id: 'page:test/entity', input: 'pages' },
      params: {
        path: 'overview',
        title: 'Overview',
        loader: async () => {
          const Probe = () => {
            const mount = usePageMount();
            return (
              <div data-testid="overview-page">
                <div data-testid="params">{JSON.stringify(useParams())}</div>
                <div data-testid="mount-base">{mount?.basePath}</div>
                <Routes>
                  <Route
                    path="deep/:section"
                    element={<span data-testid="deep">deep</span>}
                  />
                </Routes>
              </div>
            );
          };
          return <Probe />;
        },
      },
    });

    const { appHistory } = renderTestApp({
      extensions: [entityPage, overviewSubPage],
      initialRouteEntries: ['/entities/default/component/foo/overview'],
    });

    expect(await screen.findByTestId('overview-page')).toBeInTheDocument();
    expect(screen.getByTestId('mount-base')).toHaveTextContent(
      '/entities/default/component/foo/overview',
    );
    // The page's params reach the subpage, and the tail below the subpage is
    // the subpage's own splat rather than the page's.
    expect(JSON.parse(screen.getByTestId('params').textContent!)).toEqual({
      namespace: 'default',
      kind: 'component',
      name: 'foo',
      '*': '',
    });
    expect(screen.queryByTestId('deep')).not.toBeInTheDocument();

    await act(async () => {
      appHistory.navigate('/entities/default/component/foo/overview/deep/spec');
    });

    expect(await screen.findByTestId('deep')).toBeInTheDocument();
    expect(JSON.parse(screen.getByTestId('params').textContent!)).toEqual({
      namespace: 'default',
      kind: 'component',
      name: 'foo',
      '*': 'deep/spec',
    });
  });

  it('should keep relative subpage routes and tabbed layouts working under parent/child scopes', async () => {
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
                <Link to="./actions" data-testid="relative-link">
                  Actions
                </Link>
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

  /**
   * `../sibling` is the tab-to-tab idiom in a sub-page, and `..` means "up one
   * route match" — so a sub-page has to sit one match below its parent page,
   * the same as content composed with a plain nested `<Routes>`. A sub-page
   * that published a single match of its own instead would send every `..` to
   * the app root.
   */
  const RelativeTargetsProbe = () => (
    <div data-testid="templates-page">
      <div data-testid="up">{useResolvedPath('..').pathname}</div>
      <div data-testid="self">{useResolvedPath('.').pathname}</div>
      <Link to="..">Parent page</Link>
      <Link to="../tasks">Tasks tab</Link>
      <Link to="./actions">Actions</Link>
      <Routes>
        <Route
          path="actions/:name"
          element={<Link to="../preview">Up from a nested route</Link>}
        />
      </Routes>
    </div>
  );

  const relativeTargetsPage = PageBlueprint.make({
    params: { path: '/create', title: 'Scaffolder' },
  });
  const relativeTargetsSubPage = SubPageBlueprint.make({
    name: 'templates',
    params: {
      path: 'templates',
      title: 'Templates',
      loader: async () => <RelativeTargetsProbe />,
    },
  });
  const relativeTargetsSiblingSubPage = SubPageBlueprint.make({
    name: 'tasks',
    params: {
      path: 'tasks',
      title: 'Tasks',
      loader: async () => <div data-testid="tasks-page">Tasks</div>,
    },
  });
  const relativeTargetsSoloPage = PageBlueprint.make({
    name: 'solo',
    params: {
      path: '/solo',
      title: 'Solo',
      loader: async () => {
        const Solo = () => (
          <div data-testid="solo-page">
            <div data-testid="solo-up">{useResolvedPath('..').pathname}</div>
            <Link to="..">Above the page</Link>
          </div>
        );
        return <Solo />;
      },
    },
  });
  const relativeTargetsExtensions = [
    relativeTargetsPage,
    relativeTargetsSubPage,
    relativeTargetsSiblingSubPage,
    relativeTargetsSoloPage,
  ];

  it('should resolve relative targets in a subpage against the subpage, and `..` against the parent page', async () => {
    const { appHistory } = renderTestApp({
      extensions: relativeTargetsExtensions,
      initialRouteEntries: ['/create/templates'],
    });

    expect(await screen.findByTestId('templates-page')).toBeInTheDocument();
    expect(screen.getByTestId('up')).toHaveTextContent('/create');
    expect(screen.getByTestId('self')).toHaveTextContent('/create/templates');
    expect(screen.getByRole('link', { name: 'Parent page' })).toHaveAttribute(
      'href',
      '/create',
    );
    expect(screen.getByRole('link', { name: 'Tasks tab' })).toHaveAttribute(
      'href',
      '/create/tasks',
    );
    expect(screen.getByRole('link', { name: 'Actions' })).toHaveAttribute(
      'href',
      '/create/templates/actions',
    );

    // One match deeper again, `..` lands back on the sub-page rather than on
    // the page above it.
    await act(async () => {
      appHistory.navigate('/create/templates/actions/build');
    });
    expect(
      await screen.findByRole('link', { name: 'Up from a nested route' }),
    ).toHaveAttribute('href', '/create/templates/preview');

    // The href is not just decoration — following it has to land on the tab.
    await act(async () => {
      appHistory.navigate('/create/templates');
    });
    await act(async () => {
      screen.getByRole('link', { name: 'Tasks tab' }).click();
    });
    expect(await screen.findByTestId('tasks-page')).toBeInTheDocument();
    expect(appHistory.location.pathname).toBe('/create/tasks');

    // A page is the root of its own match stack, so its own `..` still leaves
    // the page entirely.
    await act(async () => {
      appHistory.navigate('/solo');
    });
    expect(await screen.findByTestId('solo-page')).toBeInTheDocument();
    expect(screen.getByTestId('solo-up')).toHaveTextContent('/');
    expect(
      screen.getByRole('link', { name: 'Above the page' }),
    ).toHaveAttribute('href', '/');
  });

  it('should include the app deploy basename in targets resolved from a subpage', async () => {
    renderTestApp({
      extensions: relativeTargetsExtensions,
      initialRouteEntries: ['/create/templates'],
      config: {
        app: { baseUrl: 'http://localhost:3000/backstage' },
        backend: { baseUrl: 'http://localhost:7007' },
      },
    });

    expect(await screen.findByTestId('templates-page')).toBeInTheDocument();
    // Relative resolution happens in app-relative space, and only the href
    // carries the deploy basename — so it appears exactly once.
    expect(screen.getByTestId('up')).toHaveTextContent('/create');
    expect(screen.getByRole('link', { name: 'Tasks tab' })).toHaveAttribute(
      'href',
      '/backstage/create/tasks',
    );
    expect(screen.getByRole('link', { name: 'Actions' })).toHaveAttribute(
      'href',
      '/backstage/create/templates/actions',
    );
  });

  /**
   * The same relative targets, with the page above the sub-page routed by a
   * different library.
   *
   * A sub-page's own adapter publishes a match for the sub-page mount, and how
   * far `..` climbs is decided by how deep that match sits. Reading the depth
   * out of the surrounding library context only answers while the page above
   * happens to use the same library — under a TanStack or React Router v7
   * parent there is no v6 context to read, and the sub-page would look like the
   * only match there is. The nesting itself is the framework's, not the
   * library's, so it has to hold whichever adapter the page above picked.
   *
   * The stand-in parent adapter is deliberately not another real router: what
   * the sub-page must survive is the *absence* of its own library's context,
   * which is exactly what any foreign adapter leaves behind.
   */
  const ForeignPageRouter: PageRouterComponent = ({ children }) => (
    <div data-testid="foreign-page-router">{children}</div>
  );
  const foreignParentPage = PageBlueprint.make({
    name: 'foreign',
    params: { path: '/mixed', title: 'Mixed' },
  });
  const foreignPageRouter = PageRouterBlueprint.make({
    name: 'foreign',
    attachTo: { id: 'page:test/foreign', input: 'router' },
    params: { component: ForeignPageRouter },
  });
  const foreignParentSubPage = SubPageBlueprint.make({
    name: 'mixed-templates',
    attachTo: { id: 'page:test/foreign', input: 'pages' },
    params: {
      path: 'templates',
      title: 'Templates',
      loader: async () => <RelativeTargetsProbe />,
    },
  });
  const foreignParentSiblingSubPage = SubPageBlueprint.make({
    name: 'mixed-tasks',
    attachTo: { id: 'page:test/foreign', input: 'pages' },
    params: {
      path: 'tasks',
      title: 'Tasks',
      loader: async () => <div data-testid="tasks-page">Tasks</div>,
    },
  });

  it('should resolve relative targets in a subpage against the subpage when the page above it uses another routing library', async () => {
    const { appHistory } = renderTestApp({
      extensions: [
        foreignParentPage,
        foreignPageRouter,
        foreignParentSubPage,
        foreignParentSiblingSubPage,
      ],
      initialRouteEntries: ['/mixed/templates'],
    });

    expect(await screen.findByTestId('templates-page')).toBeInTheDocument();
    // The page really is routed by the foreign adapter, so the sub-page below
    // it has no context of its own library to inherit.
    expect(screen.getByTestId('foreign-page-router')).toContainElement(
      screen.getByTestId('templates-page'),
    );
    expect(screen.getByTestId('up').textContent).toBe('/mixed');
    expect(screen.getByTestId('self').textContent).toBe('/mixed/templates');
    expect(screen.getByRole('link', { name: 'Parent page' })).toHaveAttribute(
      'href',
      '/mixed',
    );
    expect(screen.getByRole('link', { name: 'Tasks tab' })).toHaveAttribute(
      'href',
      '/mixed/tasks',
    );
    expect(screen.getByRole('link', { name: 'Actions' })).toHaveAttribute(
      'href',
      '/mixed/templates/actions',
    );

    // A route the sub-page composed itself is a match deeper again, and `..`
    // from there lands back on the sub-page.
    await act(async () => {
      appHistory.navigate('/mixed/templates/actions/build');
    });
    expect(
      await screen.findByRole('link', { name: 'Up from a nested route' }),
    ).toHaveAttribute('href', '/mixed/templates/preview');

    // Following the sibling href has to land on the sibling tab.
    await act(async () => {
      appHistory.navigate('/mixed/templates');
    });
    await act(async () => {
      screen.getByRole('link', { name: 'Tasks tab' }).click();
    });
    expect(await screen.findByTestId('tasks-page')).toBeInTheDocument();
    expect(appHistory.location.pathname).toBe('/mixed/tasks');
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
          {/* The framework's own resolution, which every `Link` and `useHref`
              written in this sub-page goes through. */}
          <div data-testid="framework-href">{useHref('detail')}</div>
          <div data-testid="self">{useResolvedPath('.').pathname}</div>
          <Link to="./chapter-2">Next chapter</Link>
          <Routes>
            <Route
              path="chapter-1"
              element={<span data-testid="chapter">chapter one</span>}
            />
          </Routes>
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
    expect(screen.getByTestId('self').textContent).toBe('/docs/intro');
    expect(screen.getByRole('link', { name: 'Next chapter' })).toHaveAttribute(
      'href',
      '/docs/intro/chapter-2',
    );
    // The tail below the sub-page belongs to the sub-page, not to the splat
    // page above it.
    expect(screen.getByTestId('chapter')).toBeInTheDocument();
  });
});
