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
import { useHref } from '../routing';
import { PageBlueprint } from './PageBlueprint';
import { SubPageBlueprint } from './SubPageBlueprint';
import { usePageMount } from '@internal/frontend';
import { ReactNode, createContext, useContext, useState } from 'react';

const RouterStack = createContext<readonly string[]>([]);

/**
 * A stand-in for a real routing-library adapter, declared the way a real one
 * is: rendered by the loader that produced the content, as ordinary React.
 *
 * It records its own name on a context stack so a test can see which adapters
 * a piece of content is actually inside, and reads the page mount the same way
 * a real adapter does — which is how a test tells a sub-page-scoped adapter
 * apart from a page-scoped one.
 */
function createRouter(name: string) {
  return function Router(props: { children?: ReactNode }) {
    const stack = useContext(RouterStack);
    const mount = usePageMount();
    const [state, setState] = useState(0);
    return (
      <RouterStack.Provider value={[...stack, name]}>
        <div data-testid={`${name}-router`}>
          <span data-testid={`${name}-router-mount`}>{mount?.basePath}</span>
          <span data-testid={`${name}-router-state`}>{state}</span>
          <button type="button" onClick={() => setState(value => value + 1)}>
            Bump {name}
          </button>
          {props.children}
        </div>
      </RouterStack.Provider>
    );
  };
}

describe('SubPageBlueprint', () => {
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

  it('should render subpage content that declares no router at all', async () => {
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

  it('should scope a router a subpage declares to that subpage, and leave siblings without one', async () => {
    const TreeRouter = createRouter('tree');
    const page = PageBlueprint.make({
      params: { path: '/scoped', title: 'Scoped' },
    });
    const ContentProbe = ({ name }: { name: string }) => (
      <div data-testid={`${name}-page`}>
        <span data-testid="router-stack">
          {useContext(RouterStack).join('>')}
        </span>
        <span data-testid="content-mount">{usePageMount()?.basePath}</span>
      </div>
    );
    // The adapter is declared by the loader, which is where the subpage's own
    // mount is already in context — so it scopes itself to the subpage rather
    // than to the page above it, with no wiring to say so.
    const treeSubPage = SubPageBlueprint.make({
      name: 'tree',
      params: {
        path: 'tree',
        title: 'Tree',
        loader: async () => (
          <TreeRouter>
            <ContentProbe name="tree" />
          </TreeRouter>
        ),
      },
    });
    const plainSubPage = SubPageBlueprint.make({
      name: 'plain',
      params: {
        path: 'plain',
        title: 'Plain',
        loader: async () => <ContentProbe name="plain" />,
      },
    });

    const { appHistory } = renderTestApp({
      extensions: [page, treeSubPage, plainSubPage],
      initialRouteEntries: ['/scoped/tree'],
    });

    expect(await screen.findByTestId('tree-page')).toBeInTheDocument();
    expect(screen.getByTestId('router-stack').textContent).toBe('tree');
    expect(screen.getByTestId('tree-router-mount').textContent).toBe(
      '/scoped/tree',
    );
    expect(screen.getByTestId('content-mount').textContent).toBe(
      '/scoped/tree',
    );

    await act(async () => {
      appHistory.navigate('/scoped/plain');
    });

    // A sibling that declared nothing gets nothing: the framework adds no
    // adapter of its own, and the one next door does not leak across.
    expect(await screen.findByTestId('plain-page')).toBeInTheDocument();
    expect(screen.getByTestId('router-stack').textContent).toBe('');
    expect(screen.queryByTestId('tree-router')).not.toBeInTheDocument();
    expect(screen.getByTestId('content-mount').textContent).toBe(
      '/scoped/plain',
    );
  });

  it('preserves native React Router APIs for an unmigrated subpage', async () => {
    const NativeRoutingProbe = () => {
      const nativeSibling = useResolvedPath('../sibling');
      const frameworkSibling = useHref('../sibling');
      const params = useParams();
      return (
        <div data-testid="native-routing-probe">
          <span data-testid="native-sibling">{nativeSibling.pathname}</span>
          <span data-testid="framework-sibling">{frameworkSibling}</span>
          <span data-testid="native-params">{JSON.stringify(params)}</span>
          <Routes>
            <Route
              path="deep"
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

    expect(await screen.findByTestId('native-routing-probe')).toBeVisible();
    expect(screen.getByTestId('nested-route')).toBeInTheDocument();
    expect(screen.getByTestId('native-sibling').textContent).toBe(
      '/native/sibling',
    );
    expect(screen.getByTestId('native-params').textContent).toBe(
      JSON.stringify({ '*': 'deep' }),
    );
    expect(screen.getByTestId('framework-sibling').textContent).toBe(
      '/native/sibling',
    );
  });

  it('should keep the page shell mounted while sibling subpages swap routers', async () => {
    const FirstRouter = createRouter('first');
    const SecondRouter = createRouter('second');
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
    const firstSubPage = SubPageBlueprint.make({
      name: 'first',
      params: {
        path: 'first',
        title: 'First',
        loader: async () => (
          <FirstRouter>
            <ContentProbe name="first" />
          </FirstRouter>
        ),
      },
    });
    const secondSubPage = SubPageBlueprint.make({
      name: 'second',
      params: {
        path: 'second',
        title: 'Second',
        loader: async () => (
          <SecondRouter>
            <ContentProbe name="second" />
          </SecondRouter>
        ),
      },
    });

    const { appHistory } = renderTestApp({
      extensions: [page, firstSubPage, secondSubPage],
      initialRouteEntries: ['/switch/first'],
    });

    expect(await screen.findByTestId('first-page')).toBeInTheDocument();
    expect(screen.getByTestId('router-stack').textContent).toBe('first');
    const shellTab = screen.getByRole('tab', { name: 'First' });

    await act(async () => {
      appHistory.navigate('/switch/second');
    });

    expect(await screen.findByTestId('second-page')).toBeInTheDocument();
    expect(screen.getByTestId('router-stack').textContent).toBe('second');
    expect(screen.queryByTestId('first-router')).not.toBeInTheDocument();
    expect(screen.getByTestId('second-router-mount').textContent).toBe(
      '/switch/second',
    );
    expect(screen.getByTestId('content-mount').textContent).toBe(
      '/switch/second',
    );
    // The subpage content is replaced; the page chrome above it is not.
    expect(screen.getByRole('tab', { name: 'First' })).toBe(shellTab);
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
          {/* Framework href resolution reads the selected subpage mount, so it
              is right whether or not the content declared a router. */}
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
