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
 * Three sibling pages, each hosted by a different routing library, and seven
 * tabs that between them cover the combinations that used to be impossible or
 * suspect. No two tabs demonstrate the same thing:
 *
 * | Page (host adapter)                          | Tab            | Combination proved                       |
 * | -------------------------------------------- | -------------- | ---------------------------------------- |
 * | `/nfs-routing-demo` (React Router v6)         | `nested-v6`    | React Router v6 nested inside v6         |
 * |                                               | `tanstack`     | a TanStack sub-page inside a v6 page     |
 * |                                               | `deep-link`    | links 3 segments below the page base     |
 * | `/nfs-routing-demo-tanstack` (TanStack)       | `tanstack`     | a plugin-owned nested TanStack tree       |
 * |                                               | `v6-guest`     | a React Router v6 sub-page inside it     |
 * | `/nfs-routing-demo-v7` (React Router v7)      | `v6-guest`     | v6 and v7 route trees in one app         |
 * |                                               | `v7-only`      | framework chrome with no v6 in context   |
 *
 * Every panel prints the resolved app-absolute URL and the resolved `href` of
 * each link it renders, so a doubled base path (`/page/page/sub`) is visible
 * on screen instead of only in devtools.
 *
 * The three host adapters are attached individually via `PageRouterBlueprint`;
 * there is no app-wide default router swap. Sub-pages that attach their own
 * `router` input run their content under that adapter, and sub-pages that do
 * not fall back to the app-plugin default (React Router v6) — which is how a
 * TanStack or v7 page ends up hosting a v6 guest.
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
  PageBlueprint,
  PageRouterBlueprint,
  RouteLink,
  SubPageBlueprint,
  appHistoryApiRef,
  createRouteRef,
  useApi,
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
import { ReactRouterV7PageRouter } from '@backstage/plugin-react-router-v7-adapter';
import {
  TanStackPageContent,
  TanStackPageRouter,
  createTanStackPageRouter,
} from '@backstage/plugin-tanstack-router-adapter';
import Typography from '@material-ui/core/Typography';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';

const V6_PAGE_PATH = '/nfs-routing-demo';
const TANSTACK_PAGE_PATH = '/nfs-routing-demo-tanstack';
const V7_PAGE_PATH = '/nfs-routing-demo-v7';

// Declared up front because the panels link to each other's mounts through
// `RouteLink`, which is the one link primitive that resolves without any
// routing library in context — the only kind that works in every panel below.
const nfsRoutingDemoRouteRef = createRouteRef();
const nfsRoutingDemoTanstackRouteRef = createRouteRef();
const nfsRoutingDemoV7RouteRef = createRouteRef();
const nestedV6RouteRef = createRouteRef();
const deepLinkRouteRef = createRouteRef();
const tanstackV6GuestRouteRef = createRouteRef();
const v7V6GuestRouteRef = createRouteRef();

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
        This tab owns a <code style={codeStyle}>&lt;Routes&gt;</code> tree of
        its own, mounted inside the sub-page's React Router v6 adapter, which is
        itself mounted inside the page's React Router v6 adapter. Two scoped v6
        routers are stacked here, and neither one writes browser history.
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
          note="core-components Link, relative — handed to the same scoped React Router, so it lands on the same base"
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

function NestedV6Panel() {
  return (
    <Panel
      title="React Router v6 inside React Router v6"
      proves="a v6 page can host a v6 sub-page that runs its own nested route tree, without the page base being applied twice"
      base={V6_PAGE_PATH}
    >
      <Routes>
        <Route index element={<NestedV6Index />} />
        <Route path="widget/:widgetId" element={<NestedV6Widget />} />
      </Routes>
    </Panel>
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
        The page above is React Router v6. This tab attached a{' '}
        <code style={codeStyle}>PageRouterBlueprint</code> of its own, so its
        content runs under a live TanStack router.
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
          note="core-components Link, app-absolute and inside this page — handed to the scoped React Router, which must not prefix it again"
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
        <HrefReadout note="react-router-dom Link, relative — React Router resolves it against the innermost route match, not against the tab mount">
          <RouterLink to="../../south/item/7">one route level up</RouterLink>
        </HrefReadout>
      </ul>
    </>
  );
}

function DeepLinkPanel() {
  return (
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
      proves="a framework-selected tab can host a plugin-owned nested TanStack route tree"
      base={TANSTACK_PAGE_PATH}
    >
      <Typography paragraph>
        The framework selected this tab before handing its opaque content to the
        adapter. The adapter was created with{' '}
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
          note="RouteLink to the sibling tab — the framework resolves it with no React Router in this subtree"
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
        This tab attached no router of its own, so it fell back to the
        app-plugin default — React Router v6 — even though the page hosting it
        is TanStack. The framework selected the tab, and its <em>content</em> is
        running v6.
      </Typography>
      <ul>
        <HrefReadout
          expected={`${TANSTACK_V6_GUEST_BASE}/report/q3`}
          note="react-router-dom Link inside a tab whose route TanStack created"
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
      <code style={codeStyle}>{pathname}</code>, inside a page whose tab routing
      is TanStack's. The v6 tree sees the real app location, so the TanStack
      page above and the v6 content below never disagree about where the browser
      is.
    </Typography>
  );
}

function TanStackV6GuestPanel() {
  return (
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
  );
}

const V7_V6_GUEST_BASE = `${V7_PAGE_PATH}/v6-guest`;

function V7V6GuestIndex() {
  return (
    <>
      <Typography paragraph>
        The page's tabs are React Router <strong>v7</strong> routes. This tab's
        content is React Router <strong>v6</strong>, from a different copy of
        the library with its own contexts. Both are projections of the same app
        history, so neither owns <code style={codeStyle}>window.history</code>{' '}
        and neither can fight the other for it.
      </Typography>
      <ul>
        <HrefReadout
          expected={`${V7_V6_GUEST_BASE}/release/1-42`}
          note="react-router-dom v6 Link inside a v7-routed tab"
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
      <code style={codeStyle}>{pathname}</code>, two React Router majors deep.
    </Typography>
  );
}

function V7V6GuestPanel() {
  return (
    <Panel
      title="React Router v6 inside React Router v7"
      proves="two React Router majors coexisting in one app, on one page"
      base={V7_PAGE_PATH}
    >
      <Routes>
        <Route index element={<V7V6GuestIndex />} />
        <Route path="release/:releaseId" element={<V7V6GuestRelease />} />
      </Routes>
    </Panel>
  );
}

function V7OnlyPanel() {
  return (
    <Panel
      title="React Router v7 only"
      proves="framework chrome and links keep working where no React Router v6 context exists at all"
      base={V7_PAGE_PATH}
    >
      <Typography paragraph>
        This tab attached the v7 adapter, so the only React Router context here
        is v7's. The <code style={codeStyle}>react-router-dom</code> v6 hooks
        the rest of this app uses would throw in this subtree — deliberately,
        none are used below.
      </Typography>
      <Typography paragraph>
        The page header, the tab strip, the breadcrumbs and the links below
        nevertheless resolve correctly, because framework chrome reads the page
        mount and the app history rather than any routing library.
      </Typography>
      <Typography paragraph>
        A <em>relative</em> <code style={codeStyle}>Link</code> target works
        here as well. There is no React Router v6 match in this subtree for one
        to be resolved against, so <code style={codeStyle}>Link</code> resolves
        it against this tab's mount instead:{' '}
        <code style={codeStyle}>to="../v6-guest"</code> lands on the sibling tab
        rather than escaping to <code style={codeStyle}>/v6-guest</code> at the
        app root, and the click is navigated through the app history.
      </Typography>
      <ul>
        <HrefReadout
          expected={V7_V6_GUEST_BASE}
          note="RouteLink to the sibling tab, resolved with no React Router v6 anywhere in this subtree"
        >
          <RouteLink routeRef={v7V6GuestRouteRef}>
            the v6 tab next door
          </RouteLink>
        </HrefReadout>
        <HrefReadout
          expected={V7_V6_GUEST_BASE}
          note="core-components Link with a relative target — resolved against this tab's mount, not against the app root"
        >
          <Link to="../v6-guest">the v6 tab, relatively</Link>
        </HrefReadout>
        <HrefReadout
          expected={TANSTACK_PAGE_PATH}
          note="core-components Link with an app-absolute cross-page target, routed through the app history"
        >
          <Link to={TANSTACK_PAGE_PATH}>the TanStack page</Link>
        </HrefReadout>
      </ul>
    </Panel>
  );
}

/**
 * `/nfs-routing-demo` — hosted by the app-plugin default React Router v6
 * adapter, so it attaches no `PageRouterBlueprint` of its own.
 */
const V6HostPage = PageBlueprint.make({
  name: 'nfsRoutingDemo',
  params: {
    path: V6_PAGE_PATH,
    title: 'NFS Routing (React Router v6 host)',
    icon: <AccountTreeIcon />,
    routeRef: nfsRoutingDemoRouteRef,
  },
});

const V6HostNestedSubPage = SubPageBlueprint.make({
  name: 'nfsRoutingDemo-nested-v6',
  attachTo: { id: 'page:pages/nfsRoutingDemo', input: 'pages' },
  params: {
    path: 'nested-v6',
    title: 'v6 in v6',
    routeRef: nestedV6RouteRef,
    loader: async () => <NestedV6Panel />,
  },
});

const V6HostTanStackSubPage = SubPageBlueprint.make({
  name: 'nfsRoutingDemo-tanstack',
  attachTo: { id: 'page:pages/nfsRoutingDemo', input: 'pages' },
  params: {
    path: 'tanstack',
    title: 'TanStack guest',
    loader: async () => <TanStackGuestPanel />,
  },
});

const V6HostTanStackSubPageRouter = PageRouterBlueprint.make({
  name: 'nfsRoutingDemo-tanstack',
  attachTo: { id: 'sub-page:pages/nfsRoutingDemo-tanstack', input: 'router' },
  params: { component: TanStackPageRouter },
});

const V6HostDeepLinkSubPage = SubPageBlueprint.make({
  name: 'nfsRoutingDemo-deep-link',
  attachTo: { id: 'page:pages/nfsRoutingDemo', input: 'pages' },
  params: {
    path: 'deep-link',
    title: 'Deep links',
    routeRef: deepLinkRouteRef,
    loader: async () => <DeepLinkPanel />,
  },
});

/** `/nfs-routing-demo-tanstack` — hosted by the TanStack Router adapter. */
const TanStackHostPage = PageBlueprint.make({
  name: 'nfsRoutingDemoTanstack',
  params: {
    path: TANSTACK_PAGE_PATH,
    title: 'NFS Routing (TanStack host)',
    icon: <DeviceHubIcon />,
    routeRef: nfsRoutingDemoTanstackRouteRef,
  },
});

const TanStackHostPageRouter = PageRouterBlueprint.make({
  name: 'nfsRoutingDemoTanstack',
  attachTo: { id: 'page:pages/nfsRoutingDemoTanstack', input: 'router' },
  params: { component: TanStackPageRouter },
});

const TanStackHostTanStackSubPage = SubPageBlueprint.make({
  name: 'nfsRoutingDemoTanstack-tanstack',
  attachTo: { id: 'page:pages/nfsRoutingDemoTanstack', input: 'pages' },
  params: {
    path: 'tanstack',
    title: 'TanStack tabs',
    loader: async () => <TanStackTabsPanel />,
  },
});

const TanStackHostTanStackSubPageRouter = PageRouterBlueprint.make({
  name: 'nfsRoutingDemoTanstack-tanstack',
  attachTo: {
    id: 'sub-page:pages/nfsRoutingDemoTanstack-tanstack',
    input: 'router',
  },
  params: { component: TanStackNestedPageRouter },
});

const TanStackHostV6SubPage = SubPageBlueprint.make({
  name: 'nfsRoutingDemoTanstack-v6-guest',
  attachTo: { id: 'page:pages/nfsRoutingDemoTanstack', input: 'pages' },
  params: {
    path: 'v6-guest',
    title: 'v6 guest',
    routeRef: tanstackV6GuestRouteRef,
    loader: async () => <TanStackV6GuestPanel />,
  },
});

/** `/nfs-routing-demo-v7` — hosted by the React Router v7 adapter. */
const V7HostPage = PageBlueprint.make({
  name: 'nfsRoutingDemoV7',
  params: {
    path: V7_PAGE_PATH,
    title: 'NFS Routing (React Router v7 host)',
    icon: <CallSplitIcon />,
    routeRef: nfsRoutingDemoV7RouteRef,
  },
});

const V7HostPageRouter = PageRouterBlueprint.make({
  name: 'nfsRoutingDemoV7',
  attachTo: { id: 'page:pages/nfsRoutingDemoV7', input: 'router' },
  params: { component: ReactRouterV7PageRouter },
});

const V7HostV6SubPage = SubPageBlueprint.make({
  name: 'nfsRoutingDemoV7-v6-guest',
  attachTo: { id: 'page:pages/nfsRoutingDemoV7', input: 'pages' },
  params: {
    path: 'v6-guest',
    title: 'v6 guest',
    routeRef: v7V6GuestRouteRef,
    loader: async () => <V7V6GuestPanel />,
  },
});

const V7HostV7SubPage = SubPageBlueprint.make({
  name: 'nfsRoutingDemoV7-v7-only',
  attachTo: { id: 'page:pages/nfsRoutingDemoV7', input: 'pages' },
  params: {
    path: 'v7-only',
    title: 'v7 only',
    loader: async () => <V7OnlyPanel />,
  },
});

const V7HostV7SubPageRouter = PageRouterBlueprint.make({
  name: 'nfsRoutingDemoV7-v7-only',
  attachTo: { id: 'sub-page:pages/nfsRoutingDemoV7-v7-only', input: 'router' },
  params: { component: ReactRouterV7PageRouter },
});

/**
 * Every extension the demo contributes, in the order the tabs should appear.
 */
export const nfsRoutingDemoExtensions = [
  V6HostPage,
  V6HostNestedSubPage,
  V6HostTanStackSubPage,
  V6HostTanStackSubPageRouter,
  V6HostDeepLinkSubPage,
  TanStackHostPage,
  TanStackHostPageRouter,
  TanStackHostTanStackSubPage,
  TanStackHostTanStackSubPageRouter,
  TanStackHostV6SubPage,
  V7HostPage,
  V7HostPageRouter,
  V7HostV6SubPage,
  V7HostV7SubPage,
  V7HostV7SubPageRouter,
];
