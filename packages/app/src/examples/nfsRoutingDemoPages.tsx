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

/**
 * Adopter-facing demo of page router adapters (RFC #33603).
 *
 * Three sibling pages, each leading with a different routing library, and eight
 * tabs that between them cover the combinations that used to be impossible or
 * suspect — including the case where a tab declares nothing at all. No two tabs
 * demonstrate the same thing:
 *
 * | Page (nominal library)                        | Tab            | Combination proved                       |
 * | --------------------------------------------- | -------------- | ---------------------------------------- |
 * | `/nfs-routing-demo` (React Router v6)         | `nested-v6`    | a nested v6 route tree in a sub-page     |
 * |                                               | `tanstack`     | a TanStack sub-page beside a v6 one      |
 * |                                               | `deep-link`    | links 3 segments below the page base     |
 * |                                               | `unscoped`     | implicit v6 compatibility, no adapter declared  |
 * | `/nfs-routing-demo-tanstack` (TanStack)       | `tanstack`     | a plugin-owned nested TanStack tree      |
 * |                                               | `v6-guest`     | v6 content beside TanStack content       |
 * | `/nfs-routing-demo-v7` (React Router v7)      | `v6-guest`     | v6 content beside v7 content             |
 * |                                               | `v7-only`      | v7 content beside the root v6 projection         |
 *
 * Every panel prints the resolved app-absolute URL and the resolved `href` of
 * each link it renders, so a doubled base path (`/page/page/sub`) is visible
 * on screen instead of only in devtools.
 *
 * Existing pages retain an implicit v6 fallback while adopting explicit adapters.
 * Tabs using explicit adapters declare their library by rendering its
 * page router inside the lazy component, which scopes
 * the adapter to the sub-page that declared it. Adapters are added rather than
 * selected, so the pairings in the table are genuine coexistence rather than
 * one library standing down for another.
 *
 * See https://github.com/backstage/backstage/issues/33603
 */

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {
  RouteLink,
  appHistoryApiRef,
  useApi,
  useHref,
} from '@backstage/frontend-plugin-api';
import { Link } from '@backstage/core-components';
import {
  Link as RouterLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom';
import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  useRouterState,
} from '@tanstack/react-router';
import { ReactRouterV6PageRouter } from '@backstage/plugin-app-react-router-v6';
import { ReactRouterV7PageRouter } from '@backstage/plugin-app-react-router-v7';
import {
  TanStackPageContent,
  TanStackPageRouter,
  createTanStackPageRouter,
} from '@backstage/plugin-app-tanstack-router';
import Typography from '@material-ui/core/Typography';

import {
  V6_PAGE_PATH,
  TANSTACK_PAGE_PATH,
  V7_PAGE_PATH,
  nfsRoutingDemoTanstackRouteRef,
  nestedV6RouteRef,
  deepLinkRouteRef,
  tanstackV6GuestRouteRef,
  v7V6GuestRouteRef,
} from './nfsRoutingDemoRoutes';
/**
 * The current app-absolute location, read straight from the framework's app
 * history rather than from any routing library — the demo has to be able to
 * print the truth even inside a panel whose library disagrees with it.
 */
function useAppPathname(): string {
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
  const getSnapshot = useCallback(() => appHistory.location, [appHistory]);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).pathname;
}

/**
 * How many times `base` occurs in `pathname` as a run of whole segments.
 *
 * Segment-wise rather than substring-wise so that `/nfs-routing-demo` is not
 * counted inside `/nfs-routing-demo-tanstack`. Anything above one means the
 * page base was applied twice, which is the failure this demo exists to make
 * visible.
 */
function countBaseOccurrences(pathname: string, base: string): number {
  const baseSegments = base.split('/').filter(Boolean);
  const segments = pathname.split('/').filter(Boolean);
  if (baseSegments.length === 0) {
    return 0;
  }
  let count = 0;
  for (let i = 0; i + baseSegments.length <= segments.length; i += 1) {
    if (baseSegments.every((segment, j) => segments[i + j] === segment)) {
      count += 1;
    }
  }
  return count;
}

const codeStyle = { background: 'rgba(127,127,127,0.15)', padding: '0 4px' };

/** Prints the live app-absolute URL and flags a doubled page base. */
function UrlReadout(props: { base: string }) {
  const pathname = useAppPathname();
  const occurrences = countBaseOccurrences(pathname, props.base);

  return (
    <Typography component="p" gutterBottom>
      Resolved URL: <code style={codeStyle}>{pathname}</code>{' '}
      {occurrences > 1 ? (
        <strong>
          PATH DOUBLED: "{props.base}" appears {occurrences} times
        </strong>
      ) : (
        <span>(page base appears once)</span>
      )}
    </Typography>
  );
}

/**
 * Renders a link and reads the `href` the DOM actually received back out of
 * it, so what the routing library resolved is on the page next to the link.
 *
 * Reading the rendered anchor keeps this honest across adapters: the same
 * readout works for a framework `Link`, a React Router `Link`, or anything
 * else that ends up as an `<a href>`.
 */
function HrefReadout(props: {
  note: string;
  expected?: string;
  children: ReactNode;
}) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [href, setHref] = useState('...');
  // Every link's resolved target is a function of the current location, so
  // that is what the readout has to be re-taken on.
  const pathname = useAppPathname();

  useLayoutEffect(() => {
    setHref(
      containerRef.current?.querySelector('a')?.getAttribute('href') ??
        '(no href)',
    );
  }, [pathname]);

  return (
    <li>
      <span ref={containerRef}>{props.children}</span> resolves to{' '}
      <code style={codeStyle}>{href}</code>
      {props.expected !== undefined &&
        (href === props.expected ? (
          <span> as expected</span>
        ) : (
          <strong> — expected {props.expected}</strong>
        ))}
      <br />
      <Typography variant="caption">{props.note}</Typography>
    </li>
  );
}

/**
 * An anchor whose href comes from the framework's own resolver rather than from
 * a routing library. `useHref` reads the page mount, so it is the one relative
 * link that resolves the same way under every adapter — and under none.
 */
function RelativeFrameworkLink(props: { to: string; children: ReactNode }) {
  return <a href={useHref(props.to)}>{props.children}</a>;
}

/** Shared frame so every tab states what it proves before proving it. */
function Panel(props: {
  title: string;
  proves: string;
  base: string;
  children?: ReactNode;
}) {
  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h5" gutterBottom>
        {props.title}
      </Typography>
      <Typography paragraph>
        <strong>Proves:</strong> {props.proves}
      </Typography>
      <UrlReadout base={props.base} />
      {props.children}
    </div>
  );
}

const NESTED_V6_BASE = `${V6_PAGE_PATH}/nested-v6`;

function NestedV6Index() {
  return (
    <>
      <Typography paragraph>
        This tab declares React Router v6 in its own{' '}
        <code style={codeStyle}>component</code> and owns a{' '}
        <code style={codeStyle}>&lt;Routes&gt;</code> tree inside it. The
        adapter is scoped to this sub-page, so the nested routes are written
        relative to the tab rather than to the page, and the adapter never
        writes browser history.
      </Typography>
      <ul>
        <HrefReadout
          expected={`${NESTED_V6_BASE}/widget/blue`}
          note="react-router-dom Link, resolved against the inner route match"
        >
          <RouterLink to="widget/blue">widget/blue</RouterLink>
        </HrefReadout>
        <HrefReadout
          expected={`${NESTED_V6_BASE}/widget/green`}
          note="core-components Link, relative — Backstage resolves it from the tab mount and navigates through app history"
        >
          <Link to="widget/green">widget/green</Link>
        </HrefReadout>
      </ul>
    </>
  );
}

function NestedV6Widget() {
  const { widgetId } = useParams();
  const { pathname } = useLocation();

  return (
    <>
      <Typography paragraph>
        Inner route matched, <code style={codeStyle}>useParams().widgetId</code>{' '}
        = <strong>{widgetId}</strong>.
      </Typography>
      <Typography paragraph>
        <code style={codeStyle}>useLocation().pathname</code> inside the inner
        tree is <code style={codeStyle}>{pathname}</code> — app-absolute,
        because the adapter hands React Router the real location instead of a
        rewritten one. That is what stops the base being re-applied on the way
        back out.
      </Typography>
      <ul>
        <HrefReadout note="react-router-dom Link, one route level up">
          <RouterLink to="..">back to the tab root</RouterLink>
        </HrefReadout>
      </ul>
    </>
  );
}

export function NestedV6PanelPage() {
  return (
    <ReactRouterV6PageRouter>
      <Panel
        title="Nested routes under React Router v6"
        proves="a v6 sub-page can declare its own adapter and run a nested route tree without the page base being applied twice"
        base={V6_PAGE_PATH}
      >
        <Routes>
          <Route index element={<NestedV6Index />} />
          <Route path="widget/:widgetId" element={<NestedV6Widget />} />
        </Routes>
      </Panel>
    </ReactRouterV6PageRouter>
  );
}

function TanStackGuestPanel() {
  const scopedPathname = useRouterState({
    select: state => state.location.pathname,
  });

  return (
    <Panel
      title="TanStack sub-page inside a React Router v6 page"
      proves="a sub-page can pick a routing library its host page does not use"
      base={V6_PAGE_PATH}
    >
      <Typography paragraph>
        The tab next door declares React Router v6. This one rendered{' '}
        <code style={codeStyle}>TanStackPageRouter</code> in its own{' '}
        <code style={codeStyle}>component</code> instead, so the two libraries
        sit side by side under one page and neither had to stand down.
      </Typography>
      <Typography paragraph>
        TanStack's <code style={codeStyle}>useRouterState()</code> reports{' '}
        <code style={codeStyle}>{scopedPathname}</code> — scoped to this
        sub-page's mount, while the app URL above is the real one. Two
        libraries, one browser history, no disagreement.
      </Typography>
      <ul>
        <HrefReadout
          expected={NESTED_V6_BASE}
          note="RouteLink, resolved from the route ref with no routing library involved"
        >
          <RouteLink routeRef={nestedV6RouteRef}>
            the v6 tab next door
          </RouteLink>
        </HrefReadout>
        <HrefReadout
          expected={TANSTACK_PAGE_PATH}
          note="core-components Link with an app-absolute cross-page target, which goes through the app history"
        >
          <Link to={TANSTACK_PAGE_PATH}>the TanStack page</Link>
        </HrefReadout>
      </ul>
    </Panel>
  );
}

const UNSCOPED_BASE = `${V6_PAGE_PATH}/unscoped`;

/**
 * The default a plugin gets when it declares nothing, kept on screen on
 * purpose: this is what every unmigrated page now looks like.
 */
export function UnscopedPanel() {
  const params = useParams();
  return (
    <Panel
      title="No router declared"
      proves="existing React Router pages keep working before they adopt an explicit adapter"
      base={V6_PAGE_PATH}
    >
      <Typography paragraph>
        This tab renders no adapter in its component , so it uses the implicit
        React Router v6 fallback. Its parameters are{' '}
        <code style={codeStyle}>{JSON.stringify(params)}</code>, and relative
        links and nested routes still resolve from this tab.
      </Typography>
      <Routes>
        <Route
          path="widget/:widgetId"
          element={
            <Typography paragraph>Implicit nested route works</Typography>
          }
        />
      </Routes>
      <Typography paragraph>
        Development builds warn once when this tab uses the implicit fallback.
        Add an explicit adapter when ready to migrate. Pages that use only
        framework routing need no adapter and do not receive this warning.
      </Typography>
      <ul>
        <HrefReadout
          expected={`${UNSCOPED_BASE}/widget/blue`}
          note="React Router Link uses the implicit compatibility match"
        >
          <RouterLink to="widget/blue">widget/blue</RouterLink>
        </HrefReadout>
        <HrefReadout
          expected={`${UNSCOPED_BASE}/widget/blue`}
          note="framework useHref with the same relative target — resolved against this tab's mount"
        >
          <RelativeFrameworkLink to="widget/blue">
            widget/blue
          </RelativeFrameworkLink>
        </HrefReadout>
        <HrefReadout
          expected={NESTED_V6_BASE}
          note="RouteLink to the sibling tab, resolved from the route ref"
        >
          <RouteLink routeRef={nestedV6RouteRef}>
            the v6 tab next door
          </RouteLink>
        </HrefReadout>
      </ul>
    </Panel>
  );
}

const DEEP_LINK_BASE = `${V6_PAGE_PATH}/deep-link`;

function DeepLinkIndex() {
  return (
    <>
      <Typography paragraph>
        Follow the link below to a URL three segments under this tab, and four
        under the page base. That depth is where a base path that gets applied
        once too often stops being subtle.
      </Typography>
      <ul>
        <HrefReadout
          expected={`${DEEP_LINK_BASE}/area/north/item/42`}
          note="react-router-dom Link into the deep route"
        >
          <RouterLink to="area/north/item/42">area/north/item/42</RouterLink>
        </HrefReadout>
      </ul>
    </>
  );
}

function DeepLinkLeaf() {
  const { area, item } = useParams();
  const { pathname } = useLocation();

  return (
    <>
      <Typography paragraph>
        Matched <code style={codeStyle}>area/:area/item/:item</code> with area ={' '}
        <strong>{area}</strong> and item = <strong>{item}</strong>. React
        Router's own <code style={codeStyle}>useLocation().pathname</code> here
        is <code style={codeStyle}>{pathname}</code>.
      </Typography>
      <Typography paragraph>
        Every link below is resolved from this deep URL, and each one takes a
        different route through the stack. None of them may pick up a second
        copy of <code style={codeStyle}>{V6_PAGE_PATH}</code>.
      </Typography>
      <ul>
        <HrefReadout
          expected={DEEP_LINK_BASE}
          note="RouteLink to this tab's own route ref, resolved by the framework from the route tree"
        >
          <RouteLink routeRef={deepLinkRouteRef}>this tab's root</RouteLink>
        </HrefReadout>
        <HrefReadout
          expected={TANSTACK_PAGE_PATH}
          note="RouteLink to another page's route ref, from three segments down"
        >
          <RouteLink routeRef={nfsRoutingDemoTanstackRouteRef}>
            the TanStack page by route ref
          </RouteLink>
        </HrefReadout>
        <HrefReadout
          expected={`${DEEP_LINK_BASE}/area/south/item/7`}
          note="core-components Link, app-absolute and inside this page — Backstage preserves the target and navigates through app history"
        >
          <Link to={`${DEEP_LINK_BASE}/area/south/item/7`}>a sibling area</Link>
        </HrefReadout>
        <HrefReadout
          expected={TANSTACK_PAGE_PATH}
          note="core-components Link, app-absolute and outside this page — routed through the app history instead"
        >
          <Link to={TANSTACK_PAGE_PATH}>
            the TanStack page by absolute path
          </Link>
        </HrefReadout>
        <HrefReadout
          expected={`${DEEP_LINK_BASE}/area/south/item/7`}
          note="react-router-dom Link, relative — React Router resolves it against the route one level above this leaf, which is this tab's own mount"
        >
          <RouterLink to="../area/south/item/7">one route level up</RouterLink>
        </HrefReadout>
      </ul>
    </>
  );
}

export function DeepLinkPanelPage() {
  return (
    <ReactRouterV6PageRouter>
      <Panel
        title="Links from three segments down"
        proves="relative and absolute targets resolved deep inside a page do not accumulate the page base"
        base={V6_PAGE_PATH}
      >
        <Routes>
          <Route index element={<DeepLinkIndex />} />
          <Route path="area/:area/item/:item" element={<DeepLinkLeaf />} />
        </Routes>
      </Panel>
    </ReactRouterV6PageRouter>
  );
}

const TANSTACK_V6_GUEST_BASE = `${TANSTACK_PAGE_PATH}/v6-guest`;

function TanStackTabsPanel() {
  const scopedPathname = useRouterState({
    select: state => state.location.pathname,
  });

  return (
    <Panel
      title="TanStack all the way down"
      proves="a framework-selected tab can declare a plugin-owned nested TanStack route tree"
      base={TANSTACK_PAGE_PATH}
    >
      <Typography paragraph>
        The framework selected this tab by ordinary route matching, one level
        above. The adapter this tab declared was created with{' '}
        <code style={codeStyle}>createTanStackPageRouter</code> and binds the
        plugin's own route tree to the app-owned history.
      </Typography>
      <Typography paragraph>
        <code style={codeStyle}>TanStackPageContent</code> renders this panel at
        the root, while the nested <code style={codeStyle}>extra/deep</code>{' '}
        route renders through an outlet. The inner router reports{' '}
        <code style={codeStyle}>{scopedPathname}</code>.
      </Typography>
      <ul>
        <HrefReadout
          expected={`${TANSTACK_PAGE_PATH}/tanstack/extra/deep`}
          note="two segments below this tab — TanStack's splat route keeps the tab mounted and the scoped path above changes"
        >
          <Link to={`${TANSTACK_PAGE_PATH}/tanstack/extra/deep`}>
            two segments deeper
          </Link>
        </HrefReadout>
        <HrefReadout
          expected={TANSTACK_V6_GUEST_BASE}
          note="RouteLink to the sibling tab — the framework resolves it without using React Router"
        >
          <RouteLink routeRef={tanstackV6GuestRouteRef}>
            the v6 tab next door
          </RouteLink>
        </HrefReadout>
      </ul>
    </Panel>
  );
}

function TanStackDeepRoute() {
  return (
    <Typography paragraph>
      The plugin-owned TanStack route tree matched{' '}
      <code style={codeStyle}>extra/deep</code>.
    </Typography>
  );
}

const tanStackSubPageRootRoute = createRootRoute({
  component: () => (
    <>
      <TanStackPageContent />
      <Outlet />
    </>
  ),
});
const tanStackSubPageDeepRoute = createRoute({
  getParentRoute: () => tanStackSubPageRootRoute,
  path: '/extra/deep',
  component: TanStackDeepRoute,
});
const tanStackSubPageRouteTree = tanStackSubPageRootRoute.addChildren([
  tanStackSubPageDeepRoute,
]);
const TanStackNestedPageRouter = createTanStackPageRouter({
  createRouter: ({ history }) =>
    createRouter({ routeTree: tanStackSubPageRouteTree, history }),
});

function TanStackV6GuestIndex() {
  return (
    <>
      <Typography paragraph>
        React Router v6 content declares React Router v6, wherever it happens to
        sit. This tab renders{' '}
        <code style={codeStyle}>ReactRouterV6PageRouter</code> in its own{' '}
        <code style={codeStyle}>component</code>, on a page whose other tab
        declares TanStack.
      </Typography>
      <ul>
        <HrefReadout
          expected={`${TANSTACK_V6_GUEST_BASE}/report/q3`}
          note="react-router-dom Link inside a framework-selected tab rendered by v6"
        >
          <RouterLink to="report/q3">report/q3</RouterLink>
        </HrefReadout>
      </ul>
    </>
  );
}

function TanStackV6GuestReport() {
  const { reportId } = useParams();
  const { pathname } = useLocation();

  return (
    <Typography paragraph>
      React Router v6 matched <code style={codeStyle}>report/:reportId</code>{' '}
      with reportId = <strong>{reportId}</strong> at{' '}
      <code style={codeStyle}>{pathname}</code>, inside a page whose other tab
      declares TanStack Router. The v6 tree sees the real app location, so two
      libraries in one app do not create a second browser history.
    </Typography>
  );
}

export function TanStackV6GuestPanelPage() {
  return (
    <ReactRouterV6PageRouter>
      <Panel
        title="React Router v6 sub-page inside a TanStack page"
        proves="the reverse direction: a TanStack page hosting a React Router v6 sub-page with its own nested routes"
        base={TANSTACK_PAGE_PATH}
      >
        <Routes>
          <Route index element={<TanStackV6GuestIndex />} />
          <Route path="report/:reportId" element={<TanStackV6GuestReport />} />
        </Routes>
      </Panel>
    </ReactRouterV6PageRouter>
  );
}

const V7_V6_GUEST_BASE = `${V7_PAGE_PATH}/v6-guest`;

function V7V6GuestIndex() {
  return (
    <>
      <Typography paragraph>
        The sibling tab declares React Router <strong>v7</strong>. React Router{' '}
        <strong>v6</strong> content on this tab declares v6 for itself. The two
        versions publish different React contexts, so they coexist without
        either shadowing the other, and both project the same app history rather
        than owning <code style={codeStyle}>window.history</code> themselves.
      </Typography>
      <ul>
        <HrefReadout
          expected={`${V7_V6_GUEST_BASE}/release/1-42`}
          note="react-router-dom v6 Link inside a v6 tab on a page whose sibling tab is v7"
        >
          <RouterLink to="release/1-42">release/1-42</RouterLink>
        </HrefReadout>
      </ul>
    </>
  );
}

function V7V6GuestRelease() {
  const { releaseId } = useParams();
  const { pathname } = useLocation();

  return (
    <Typography paragraph>
      React Router v6 matched <code style={codeStyle}>release/:releaseId</code>{' '}
      with releaseId = <strong>{releaseId}</strong> at{' '}
      <code style={codeStyle}>{pathname}</code>, on a page whose other tab uses
      React Router v7.
    </Typography>
  );
}

export function V7V6GuestPanelPage() {
  return (
    <ReactRouterV6PageRouter>
      <Panel
        title="React Router v6 on a React Router v7 page"
        proves="one page can carry a v6 tab and a v7 tab, each declaring its own adapter"
        base={V7_PAGE_PATH}
      >
        <Routes>
          <Route index element={<V7V6GuestIndex />} />
          <Route path="release/:releaseId" element={<V7V6GuestRelease />} />
        </Routes>
      </Panel>
    </ReactRouterV6PageRouter>
  );
}

export function V7OnlyPanelPage() {
  return (
    <ReactRouterV7PageRouter>
      <Panel
        title="React Router v7 only"
        proves="framework links and v7 routing share app history while the root v6 projection supports shared UI"
        base={V7_PAGE_PATH}
      >
        <Typography paragraph>
          This tab declares React Router v7 in its lazy component. Its route
          matches come from v7. The app also retains a root v6 context for
          shared UI; that context has no page match. Framework links and both
          projections observe the same app history.
        </Typography>
        <Typography paragraph>
          The page header, the tab strip, the breadcrumbs and the links below
          nevertheless resolve correctly, because framework chrome reads the
          page mount and the app history rather than any routing library.
        </Typography>
        <Typography paragraph>
          A <em>relative</em> target works here as well, as long as it is
          resolved by something that reads the page mount. The framework's{' '}
          <code style={codeStyle}>useHref</code> does:{' '}
          <code style={codeStyle}>'../v6-guest'</code> lands on the sibling tab
          rather than escaping to <code style={codeStyle}>/v6-guest</code> at
          the app root. A <code style={codeStyle}>react-router-dom</code> v6{' '}
          <code style={codeStyle}>Link</code> would escape, because the root v6
          context has no tab match to resolve against — which is why
          framework-resolved links are the ones that work under every adapter.
        </Typography>
        <ul>
          <HrefReadout
            expected={V7_V6_GUEST_BASE}
            note="RouteLink to the sibling tab, resolved by Backstage independently of the root React Router v6 context"
          >
            <RouteLink routeRef={v7V6GuestRouteRef}>
              the v6 tab next door
            </RouteLink>
          </HrefReadout>
          <HrefReadout
            expected={V7_V6_GUEST_BASE}
            note="framework useHref with a relative target — resolved against this tab's mount, not against the app root"
          >
            <RelativeFrameworkLink to="../v6-guest">
              the v6 tab, relatively
            </RelativeFrameworkLink>
          </HrefReadout>
          <HrefReadout
            expected={TANSTACK_PAGE_PATH}
            note="core-components Link with an app-absolute cross-page target, routed through the app history"
          >
            <Link to={TANSTACK_PAGE_PATH}>the TanStack page</Link>
          </HrefReadout>
        </ul>
      </Panel>
    </ReactRouterV7PageRouter>
  );
}

export function TanStackGuestPanelPage() {
  return (
    <TanStackPageRouter>
      <TanStackGuestPanel />
    </TanStackPageRouter>
  );
}

export function TanStackTabsPanelPage() {
  return (
    <TanStackNestedPageRouter>
      <TanStackTabsPanel />
    </TanStackNestedPageRouter>
  );
}
