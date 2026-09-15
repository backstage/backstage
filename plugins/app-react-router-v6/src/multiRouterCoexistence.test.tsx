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

import { ReactNode, useCallback, useSyncExternalStore } from 'react';
import { act, screen, waitFor } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import {
  PageBlueprint,
  RouteLink,
  SubPageBlueprint,
  appHistoryApiRef,
  createFrontendPlugin,
  createRouteRef,
  useApi,
  useAppNavigate,
  useHref as useFrameworkHref,
} from '@backstage/frontend-plugin-api';
import {
  Link as TanStackLink,
  useLocation as useTanStackLocation,
} from '@tanstack/react-router';
import {
  Link as V6Link,
  useParams as useV6Params,
  useResolvedPath as useV6ResolvedPath,
} from 'react-router-dom';
import { TanStackPageRouter } from '@backstage/plugin-app-tanstack-router';
import { ReactRouterV6PageRouter } from './ReactRouterV6PageRouter';

/**
 * Subscribes to the app-absolute location, without going through either
 * routing library — the demo of coexistence has to be able to state the truth
 * about where the app is, whichever library is answering nearby.
 */
function useAppLocation() {
  const appHistory = useApi(appHistoryApiRef);
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const subscription = appHistory.location$.subscribe(() =>
        onStoreChange(),
      );
      return () => subscription.unsubscribe();
    },
    [appHistory],
  );
  // `AppHistoryApi.location` is a stable reference, so it is the snapshot.
  const getSnapshot = useCallback(() => appHistory.location, [appHistory]);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Pudding-style coexistence: React Router v6 and TanStack in one app, each
 * declared by the content that wants it.
 *
 * The framework retains a root v6 context for shared UI. Each loader declares
 * the adapter that supplies its page matches. Adapters can nest, and the cases
 * below cover the three
 * shapes that has to hold in: two pages side by side, two sibling sub-pages of
 * one page, and one adapter genuinely nested inside another. The group at the
 * bottom then asks the question those three do not — not which library is
 * answering, but where the target it answers with actually lands.
 *
 * Lives in this package rather than in `plugin-app-tanstack-router`, because
 * `react-router-dom` resolves to v6 from here while the TanStack adapter
 * deliberately carries no React Router dependency at all. Both libraries are
 * therefore genuinely themselves, which is the whole point: they publish
 * different React context objects and so do not fight over one.
 */
describe('TanStack + RR v6 coexistence', () => {
  const catalogRouteRef = createRouteRef();
  const toolsRouteRef = createRouteRef();

  it('should coexist as peer pages, each declaring its own adapter', async () => {
    const CatalogV6Page = () => {
      const location = useAppLocation();
      // A v6 hook, answered by the v6 adapter this page declared. Without
      // one it would resolve from the app root and come back as `/deep`.
      const resolved = useV6ResolvedPath('./deep');
      return (
        <div data-testid="catalog-page">
          <div data-testid="adapter">v6</div>
          <div data-testid="pathname">{location.pathname}</div>
          <div data-testid="v6-resolved">{resolved.pathname}</div>
          <RouteLink routeRef={toolsRouteRef} data-testid="to-tools">
            Tools (TanStack)
          </RouteLink>
        </div>
      );
    };

    const ToolsPage = () => {
      const location = useAppLocation();
      const scoped = useTanStackLocation();
      return (
        <div data-testid="tools-page">
          <div data-testid="adapter">tanstack</div>
          <div data-testid="pathname">{location.pathname}</div>
          <div data-testid="scoped-pathname">{scoped.pathname}</div>
          <RouteLink routeRef={catalogRouteRef} data-testid="to-catalog">
            Catalog (v6)
          </RouteLink>
        </div>
      );
    };

    const catalogPlugin = createFrontendPlugin({
      pluginId: 'catalog-pudding-ts',
      routes: { root: catalogRouteRef },
      extensions: [
        PageBlueprint.make({
          name: 'index',
          params: {
            path: '/catalog-pudding-ts',
            routeRef: catalogRouteRef,
            loader: async () => (
              <ReactRouterV6PageRouter>
                <CatalogV6Page />
              </ReactRouterV6PageRouter>
            ),
          },
        }),
      ],
    });

    const toolsPlugin = createFrontendPlugin({
      pluginId: 'tools-pudding-ts',
      routes: { root: toolsRouteRef },
      extensions: [
        PageBlueprint.make({
          name: 'index',
          params: {
            path: '/tools-pudding-ts',
            routeRef: toolsRouteRef,
            loader: async () => (
              <TanStackPageRouter>
                <ToolsPage />
              </TanStackPageRouter>
            ),
          },
        }),
      ],
    });

    const { appHistory } = renderTestApp({
      features: [catalogPlugin, toolsPlugin],
      initialRouteEntries: ['/catalog-pudding-ts'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('catalog-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6');
    });
    expect(screen.getByTestId('v6-resolved').textContent).toBe(
      '/catalog-pudding-ts/deep',
    );

    await act(async () => {
      screen.getByTestId('to-tools').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('tools-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('tanstack');
      expect(screen.getByTestId('pathname').textContent).toBe(
        '/tools-pudding-ts',
      );
      // Scoped to its own page mount, not to the app root.
      expect(screen.getByTestId('scoped-pathname')).toHaveTextContent('/');
    });

    await act(async () => {
      screen.getByTestId('to-catalog').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('catalog-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6');
    });

    // AppHistoryApi has no programmatic `go` — navigate directly instead.
    await act(async () => {
      appHistory.navigate('/tools-pudding-ts');
    });

    await waitFor(() => {
      expect(screen.getByTestId('tools-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('tanstack');
    });

    await act(async () => {
      appHistory.navigate('/catalog-pudding-ts');
    });

    await waitFor(() => {
      expect(screen.getByTestId('catalog-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6');
    });
    expect(screen.getByTestId('v6-resolved').textContent).toBe(
      '/catalog-pudding-ts/deep',
    );
  });

  it('should mix a v6 sub-page and a TanStack sub-page under one page', async () => {
    // The maintainer's mixed case, at the granularity the new model actually
    // has: a tabbed page owns no content region of its own and so declares no
    // adapter, and each sub-page picks its own library. Navigating between the
    // tabs exercises the pairing in both directions.
    const homeRouteRef = createRouteRef();

    const HomeV6Page = () => {
      const location = useAppLocation();
      const navigate = useAppNavigate();
      return (
        <div data-testid="home-page">
          <div data-testid="adapter">v6</div>
          <div data-testid="pathname">{location.pathname}</div>
          <button
            type="button"
            data-testid="to-tree"
            onClick={() => navigate('/visualizer-pudding-ts/tree')}
          >
            Tree subpage
          </button>
        </div>
      );
    };

    const TreeTanStackSubPage = () => {
      const appLocation = useAppLocation();
      const scopedLocation = useTanStackLocation();
      return (
        <div data-testid="tree-subpage">
          <div data-testid="adapter">tanstack</div>
          <div data-testid="pathname">{appLocation.pathname}</div>
          {/* Scoped to the sub-page's own mount, not to its parent page. */}
          <div data-testid="scoped-pathname">{scopedLocation.pathname}</div>
          <RouteLink routeRef={homeRouteRef} data-testid="to-home">
            Home (v6)
          </RouteLink>
        </div>
      );
    };

    const GraphV6SubPage = () => {
      const appLocation = useAppLocation();
      const params = useV6Params();
      return (
        <div data-testid="graph-subpage">
          <div data-testid="adapter">v6</div>
          <div data-testid="pathname">{appLocation.pathname}</div>
          {/* The v6 adapter of a sub-page matches from the sub-page's own
              pattern, so the tail below it lands in the splat rather than
              leaking the parent page's prefix. */}
          <div data-testid="v6-splat">{params['*'] ?? ''}</div>
        </div>
      );
    };

    const homePage = PageBlueprint.make({
      name: 'home',
      params: {
        path: '/home-pudding-ts',
        routeRef: homeRouteRef,
        loader: async () => (
          <ReactRouterV6PageRouter>
            <HomeV6Page />
          </ReactRouterV6PageRouter>
        ),
      },
    });

    const visualizerPage = PageBlueprint.make({
      name: 'visualizer',
      params: {
        path: '/visualizer-pudding-ts',
        title: 'Visualizer',
      },
    });

    const treeSubPage = SubPageBlueprint.make({
      name: 'tree',
      attachTo: { id: 'page:test/visualizer', input: 'pages' },
      params: {
        path: 'tree',
        title: 'Tree',
        loader: async () => (
          <TanStackPageRouter>
            <TreeTanStackSubPage />
          </TanStackPageRouter>
        ),
      },
    });

    const graphSubPage = SubPageBlueprint.make({
      name: 'graph',
      attachTo: { id: 'page:test/visualizer', input: 'pages' },
      params: {
        path: 'graph',
        title: 'Graph',
        loader: async () => (
          <ReactRouterV6PageRouter>
            <GraphV6SubPage />
          </ReactRouterV6PageRouter>
        ),
      },
    });

    const { appHistory } = renderTestApp({
      extensions: [homePage, visualizerPage, treeSubPage, graphSubPage],
      initialRouteEntries: ['/home-pudding-ts'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6');
    });

    await act(async () => {
      screen.getByTestId('to-tree').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('tree-subpage')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('tanstack');
      expect(screen.getByTestId('pathname').textContent).toBe(
        '/visualizer-pudding-ts/tree',
      );
      expect(screen.getByTestId('scoped-pathname')).toHaveTextContent('/');
    });

    // Tab across to the sibling that chose the other library. Both tabs belong
    // to one page, so this is the mixed case in both directions.
    await act(async () => {
      appHistory.navigate('/visualizer-pudding-ts/graph/deeper');
    });

    await waitFor(() => {
      expect(screen.getByTestId('graph-subpage')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6');
    });
    expect(screen.getByTestId('v6-splat').textContent).toBe('deeper');
    expect(screen.queryByTestId('tree-subpage')).not.toBeInTheDocument();

    await act(async () => {
      appHistory.navigate('/visualizer-pudding-ts/tree');
    });

    await waitFor(() => {
      expect(screen.getByTestId('tree-subpage')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('tanstack');
      expect(screen.getByTestId('scoped-pathname')).toHaveTextContent('/');
    });

    await act(async () => {
      screen.getByTestId('to-home').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.getByTestId('adapter')).toHaveTextContent('v6');
      expect(screen.getByTestId('pathname').textContent).toBe(
        '/home-pudding-ts',
      );
    });
  });

  it('should nest one adapter inside the other, in both orders', async () => {
    // Adapters are added, not selected. Two libraries publish two different
    // React context objects, so an inner adapter cannot displace an outer one
    // — and the content between them keeps working with both. A test that only
    // ever put one adapter on screen at a time could not tell that apart from
    // the old behaviour, where the framework picked exactly one.
    const Both = (props: { order: string }) => {
      const v6Params = useV6Params();
      const tanStackLocation = useTanStackLocation();
      return (
        <div data-testid="both">
          <span data-testid="order">{props.order}</span>
          <span data-testid="v6-id">{v6Params.id}</span>
          <span data-testid="tanstack-pathname">
            {tanStackLocation.pathname}
          </span>
        </div>
      );
    };

    const outerFirst = (
      Outer: (props: { children?: ReactNode }) => JSX.Element,
      Inner: (props: { children?: ReactNode }) => JSX.Element,
      order: string,
    ) => (
      <Outer>
        <Inner>
          <Both order={order} />
        </Inner>
      </Outer>
    );

    const v6OuterPage = PageBlueprint.make({
      name: 'v6-outer',
      params: {
        path: '/v6-outer/:id',
        loader: async () =>
          outerFirst(
            ReactRouterV6PageRouter,
            TanStackPageRouter,
            'v6>tanstack',
          ),
      },
    });
    const tanStackOuterPage = PageBlueprint.make({
      name: 'tanstack-outer',
      params: {
        path: '/tanstack-outer/:id',
        loader: async () =>
          outerFirst(
            TanStackPageRouter,
            ReactRouterV6PageRouter,
            'tanstack>v6',
          ),
      },
    });

    const { appHistory } = renderTestApp({
      extensions: [v6OuterPage, tanStackOuterPage],
      initialRouteEntries: ['/v6-outer/alpha'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('both')).toBeInTheDocument();
      expect(screen.getByTestId('order')).toHaveTextContent('v6>tanstack');
    });
    // Both libraries answer at once: v6 still has the page params it matched,
    // and TanStack still has the page-scoped location it built.
    expect(screen.getByTestId('v6-id')).toHaveTextContent('alpha');
    expect(screen.getByTestId('tanstack-pathname')).toHaveTextContent('/');

    await act(async () => {
      appHistory.navigate('/tanstack-outer/beta');
    });

    await waitFor(() => {
      expect(screen.getByTestId('order')).toHaveTextContent('tanstack>v6');
    });
    expect(screen.getByTestId('v6-id')).toHaveTextContent('beta');
    expect(screen.getByTestId('tanstack-pathname')).toHaveTextContent('/');
  });

  /**
   * Where a target written on a mixed-library page actually lands.
   *
   * The cases above establish that two libraries can be on screen without
   * displacing one another. They do not say what either one *resolves* to,
   * which is the half a user sees: the tab that navigates to the wrong place,
   * or to `/catalog/catalog/x`.
   *
   * Sub-page depth is where that is hardest. A page composed of tabs owns no
   * content region of its own, so it declares no adapter — the sub-page's
   * does. The sub-page adapter therefore scopes to the sub-page, while the
   * page above it has contributed a mount and no adapter of its own, in either
   * library. Neither library can read the page's segment out of a context that
   * nobody published, so each reaches it a different way: the v6 adapter falls
   * through to the framework's chain of page mounts (`projectAncestorMounts`
   * in `createAppHistoryRouter`, which runs precisely when the mount above
   * published no route context of this library), and the TanStack adapter
   * derives its prefix from the sub-page's own full route pattern, page
   * segment included. Two mechanisms, one answer required.
   *
   * Every case below therefore checks three answers for the same mount:
   *
   *  - what the sub-page's own library resolves a target to;
   *  - what the framework's `useHref` resolves the same target to, walking
   *    page mounts with no routing library involved — the two are documented
   *    to agree, so they are required to agree;
   *  - what the page mount alone would give, which is the same target one
   *    segment shallower, so the extra segment is visibly the sub-page's.
   *
   * `duplicatePathSegments.test.tsx` next door sweeps every relative spelling
   * against a real `react-router-dom` route tree for the v6 side. What is new
   * here is the same question asked with the other library present: TanStack
   * resolving from a sub-page mount, and v6 resolving from a sub-page mount of
   * a page whose other tab is TanStack.
   */
  describe('where a target written at sub-page depth lands', () => {
    const PAGE_PATTERN = '/catalog-mix';
    /** A target below wherever it is written, spelled for each library. */
    const V6_BELOW = 'edit';
    const TANSTACK_BELOW = '/edit';

    /**
     * A TanStack consumer's own answers: the location it is given, and the
     * app-absolute href its `<Link>` produces.
     *
     * TanStack targets are router-absolute rather than relative — `/edit`
     * means this router's own root, which is the mount the adapter scoped
     * itself to — so `selfSegment` is spelled the same way. The framework href
     * beside it is the same target expressed the framework's way, and has to
     * come out identical.
     */
    function TanStackTargetProbe(props: { selfSegment: string }) {
      const location = useTanStackLocation();
      const frameworkHref = useFrameworkHref(V6_BELOW);
      return (
        <div data-testid="tanstack-probe">
          <span data-testid="tanstack-pathname">{location.pathname}</span>
          <span data-testid="tanstack-framework-href">{frameworkHref}</span>
          <TanStackLink to={TANSTACK_BELOW} data-testid="tanstack-below">
            Edit
          </TanStackLink>
          {/* A target whose own first segment repeats the page's. The second
              copy is the one the caller asked for; a third, or a copy the
              caller did not ask for, is the bug. */}
          <TanStackLink
            to={`/${props.selfSegment}`}
            data-testid="tanstack-self-naming"
          >
            Self
          </TanStackLink>
        </div>
      );
    }

    /** The same questions asked of React Router v6. */
    function V6TargetProbe(props: { selfSegment: string }) {
      const frameworkHref = useFrameworkHref(V6_BELOW);
      return (
        <div data-testid="v6-probe">
          <span data-testid="v6-below">
            {useV6ResolvedPath(V6_BELOW).pathname}
          </span>
          {/* The climb. This is the assertion `projectAncestorMounts` exists
              for: one level up from a sub-page is the page, not the app root,
              even though the page published no v6 route context to climb
              through. */}
          <span data-testid="v6-up">{useV6ResolvedPath('..').pathname}</span>
          <span data-testid="v6-self-naming">
            {useV6ResolvedPath(props.selfSegment).pathname}
          </span>
          <span data-testid="v6-framework-href">{frameworkHref}</span>
          <V6Link to={V6_BELOW} data-testid="v6-below-link">
            Edit
          </V6Link>
        </div>
      );
    }

    function renderMixedCatalog(initialPath: string) {
      // Declares no adapter, because a page with sub-pages has no content
      // region of its own to declare one for. Its segment still has to end up
      // in everything its sub-pages resolve.
      const catalogPage = PageBlueprint.make({
        name: 'catalog-mix',
        params: { path: PAGE_PATTERN, title: 'Catalog' },
      });

      const overviewSubPage = SubPageBlueprint.make({
        name: 'overview',
        attachTo: { id: 'page:test/catalog-mix', input: 'pages' },
        params: {
          path: 'overview',
          title: 'Overview',
          loader: async () => (
            <TanStackPageRouter>
              <TanStackTargetProbe selfSegment="catalog-mix" />
            </TanStackPageRouter>
          ),
        },
      });

      const createSubPage = SubPageBlueprint.make({
        name: 'create',
        attachTo: { id: 'page:test/catalog-mix', input: 'pages' },
        params: {
          path: 'create',
          title: 'Create',
          loader: async () => (
            <ReactRouterV6PageRouter>
              <V6TargetProbe selfSegment="catalog-mix" />
            </ReactRouterV6PageRouter>
          ),
        },
      });

      // Pages that own their whole content region, one per library. Same
      // probes, one mount shallower — the control for how much of each answer
      // above came from the sub-page.
      const toolsPage = PageBlueprint.make({
        name: 'tools-mix',
        params: {
          path: '/tools-mix',
          loader: async () => (
            <TanStackPageRouter>
              <TanStackTargetProbe selfSegment="tools-mix" />
            </TanStackPageRouter>
          ),
        },
      });

      const shopPage = PageBlueprint.make({
        name: 'shop-mix',
        params: {
          path: '/shop-mix',
          loader: async () => (
            <ReactRouterV6PageRouter>
              <V6TargetProbe selfSegment="shop-mix" />
            </ReactRouterV6PageRouter>
          ),
        },
      });

      return renderTestApp({
        extensions: [
          catalogPage,
          overviewSubPage,
          createSubPage,
          toolsPage,
          shopPage,
        ],
        initialRouteEntries: [initialPath],
      });
    }

    it('should resolve a TanStack sub-page target against the page and the sub-page', async () => {
      const { appHistory } = renderMixedCatalog('/catalog-mix/overview');

      await waitFor(() => {
        expect(screen.getByTestId('tanstack-probe')).toBeInTheDocument();
      });

      // Scoped to the sub-page's own mount: the page mount would leave
      // `/overview` here, and the app root `/catalog-mix/overview`.
      expect(screen.getByTestId('tanstack-pathname').textContent).toBe('/');

      // The target lands under both segments — the page's and the sub-page's.
      // Losing the first gives `/overview/edit`, losing both `/edit`.
      expect(screen.getByTestId('tanstack-below')).toHaveAttribute(
        'href',
        '/catalog-mix/overview/edit',
      );
      // The framework resolves the same target by walking page mounts instead,
      // and has to agree with the library.
      expect(screen.getByTestId('tanstack-framework-href').textContent).toBe(
        '/catalog-mix/overview/edit',
      );
      // Asking for the page's own segment by name gets exactly the one copy
      // that was asked for, appended below the mount — the bug is the mount
      // being re-applied instead, i.e. `/catalog-mix/catalog-mix`.
      expect(screen.getByTestId('tanstack-self-naming')).toHaveAttribute(
        'href',
        '/catalog-mix/overview/catalog-mix',
      );

      // Following the link has to land where the href said it would: href and
      // navigation go through different halves of the projected history.
      await act(async () => {
        screen.getByTestId('tanstack-below').click();
      });

      await waitFor(() => {
        expect(appHistory.location.pathname).toBe('/catalog-mix/overview/edit');
      });
      // Still the same sub-page, one segment deeper inside it, with no
      // accumulation in the scoped location.
      expect(screen.getByTestId('tanstack-pathname').textContent).toBe('/edit');
      expect(screen.getByTestId('tanstack-below')).toHaveAttribute(
        'href',
        '/catalog-mix/overview/edit',
      );
    });

    it('should resolve a v6 sub-page target against the page and the sub-page, beside a TanStack tab', async () => {
      const { appHistory } = renderMixedCatalog('/catalog-mix/overview');
      await waitFor(() => {
        expect(screen.getByTestId('tanstack-probe')).toBeInTheDocument();
      });

      // Tab across to the sibling that chose the other library. The page above
      // published no v6 route context on the way here — the tab that did the
      // publishing was TanStack's — so everything below is the framework's
      // mount chain answering.
      await act(async () => {
        appHistory.navigate('/catalog-mix/create');
      });

      await waitFor(() => {
        expect(screen.getByTestId('v6-probe')).toBeInTheDocument();
      });
      expect(screen.queryByTestId('tanstack-probe')).not.toBeInTheDocument();

      // One level up is the page, not the app root: the page's mount is in the
      // stack even though its adapter never was.
      expect(screen.getByTestId('v6-up').textContent).toBe('/catalog-mix');
      expect(screen.getByTestId('v6-below').textContent).toBe(
        '/catalog-mix/create/edit',
      );
      expect(screen.getByTestId('v6-framework-href').textContent).toBe(
        '/catalog-mix/create/edit',
      );
      expect(screen.getByTestId('v6-below-link')).toHaveAttribute(
        'href',
        '/catalog-mix/create/edit',
      );
      expect(screen.getByTestId('v6-self-naming').textContent).toBe(
        '/catalog-mix/create/catalog-mix',
      );

      await act(async () => {
        screen.getByTestId('v6-below-link').click();
      });
      await waitFor(() => {
        expect(appHistory.location.pathname).toBe('/catalog-mix/create/edit');
      });
      expect(screen.getByTestId('v6-up').textContent).toBe('/catalog-mix');
      expect(screen.getByTestId('v6-below').textContent).toBe(
        '/catalog-mix/create/edit',
      );

      // Back to the TanStack tab. Having had the other library mounted at this
      // page in between must not move where its targets land.
      await act(async () => {
        appHistory.navigate('/catalog-mix/overview');
      });
      await waitFor(() => {
        expect(screen.getByTestId('tanstack-probe')).toBeInTheDocument();
      });
      expect(screen.getByTestId('tanstack-pathname').textContent).toBe('/');
      expect(screen.getByTestId('tanstack-below')).toHaveAttribute(
        'href',
        '/catalog-mix/overview/edit',
      );
    });

    it("should resolve a page's own content against the page mount, in either library", async () => {
      // The control for both cases above: the same probes, the same targets,
      // at a page that owns its content rather than at a sub-page of one. Each
      // answer is the sub-page answer with the sub-page's segment removed, so
      // the segment demonstrably came from the sub-page mount and not from the
      // page's pattern being applied twice or from the target itself.
      const { appHistory } = renderMixedCatalog('/tools-mix');

      await waitFor(() => {
        expect(screen.getByTestId('tanstack-probe')).toBeInTheDocument();
      });
      expect(screen.getByTestId('tanstack-pathname').textContent).toBe('/');
      expect(screen.getByTestId('tanstack-below')).toHaveAttribute(
        'href',
        '/tools-mix/edit',
      );
      expect(screen.getByTestId('tanstack-framework-href').textContent).toBe(
        '/tools-mix/edit',
      );
      expect(screen.getByTestId('tanstack-self-naming')).toHaveAttribute(
        'href',
        '/tools-mix/tools-mix',
      );

      await act(async () => {
        appHistory.navigate('/shop-mix');
      });

      await waitFor(() => {
        expect(screen.getByTestId('v6-probe')).toBeInTheDocument();
      });
      // A page is one match deep, so the climb lands at the app root — the
      // sub-page cases above climb to the page instead, which is the whole
      // difference between the two mounts.
      expect(screen.getByTestId('v6-up').textContent).toBe('/');
      expect(screen.getByTestId('v6-below').textContent).toBe('/shop-mix/edit');
      expect(screen.getByTestId('v6-framework-href').textContent).toBe(
        '/shop-mix/edit',
      );
      expect(screen.getByTestId('v6-self-naming').textContent).toBe(
        '/shop-mix/shop-mix',
      );
    });
  });
});
