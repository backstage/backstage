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
import {
  configApiRef,
  useAnalytics,
  useApi,
  useApp,
} from '@backstage/core-plugin-api';
// eslint-disable-next-line no-restricted-imports
import MaterialLink, {
  LinkProps as MaterialLinkProps,
} from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';
import { trimEnd } from 'lodash';
import {
  ReactNode,
  ReactElement,
  MouseEvent as ReactMouseEvent,
  ElementType,
  createContext,
  forwardRef,
  useContext,
  type ContextType,
} from 'react';
import {
  createRoutesFromChildren,
  Link as RouterLink,
  LinkProps as RouterLinkProps,
  Route,
  useInRouterContext,
  UNSAFE_RouteContext,
} from 'react-router-dom';
import OpenInNew from '@material-ui/icons/OpenInNew';
import type { AppHistoryApi } from '@backstage/frontend-plugin-api';
import {
  shouldNavigateViaFramework,
  shouldResolveViaPageMount,
} from './absoluteLinkNavigate';
// `createPath` and `resolvePath` come from here rather than from
// `react-router-dom` above: the v6 beta this package still supports exports no
// `createPath`, so calling it would throw the moment a relative target resolved
// against the page mount. `@internal/frontend` vendors both verbatim — that
// package carries no React Router of its own — and `AppRouting.test.tsx` pins
// the copies against React Router's own.
import {
  climbPageBase,
  createPath,
  isExternalTarget,
  pageBasePaths,
  resolvePath,
  useAppHistoryLocation,
  usePageMount,
  type PageMount,
} from '@internal/frontend';
import { useOptionalAppHistory } from '../../hooks/useOptionalAppHistory';

export function isReactRouterBeta(): boolean {
  const [obj] = createRoutesFromChildren(<Route index element={<div />} />);
  return !obj.index;
}

/** @public */
export type LinkClassKey = 'visuallyHidden' | 'externalLink';

const useStyles = makeStyles(
  theme => ({
    visuallyHidden: {
      clip: 'rect(0 0 0 0)',
      clipPath: 'inset(50%)',
      overflow: 'hidden',
      position: 'absolute',
      userSelect: 'none',
      whiteSpace: 'nowrap',
      height: 1,
      width: 1,
    },
    externalLink: {
      position: 'relative',
    },
    externalLinkIcon: {
      verticalAlign: 'bottom',
      marginLeft: theme.spacing(0.5),
    },
  }),
  { name: 'Link' },
);

const ExternalLinkIcon = () => {
  const app = useApp();
  const Icon = app.getSystemIcon('externalLink') || OpenInNew;
  const classes = useStyles();
  return <Icon className={classes.externalLinkIcon} />;
};

// See https://github.com/facebook/react/blob/f0cf832e1d0c8544c36aa8b310960885a11a847c/packages/react-dom-bindings/src/shared/sanitizeURL.js
const scriptProtocolPattern =
  // eslint-disable-next-line no-control-regex
  /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i;

// We install this globally in order to prevent javascript: URL XSS attacks via window.open
const originalWindowOpen = window.open as typeof window.open & {
  __backstage?: true;
};
if (originalWindowOpen && !originalWindowOpen.__backstage) {
  const newOpen = function open(
    this: Window,
    ...args: Parameters<typeof window.open>
  ) {
    const url = String(args[0]);
    if (scriptProtocolPattern.test(url)) {
      throw new Error(
        'Rejected window.open() with a javascript: URL as a security precaution',
      );
    }
    return originalWindowOpen.apply(this, args);
  };
  newOpen.__backstage = true;
  window.open = newOpen;
}

export type LinkProps = Omit<MaterialLinkProps, 'to'> &
  Omit<RouterLinkProps, 'to'> & {
    to: string;
    component?: ElementType<any>;
    noTrack?: boolean;
    externalLinkIcon?: boolean;
  };

/**
 * Returns the app base url that could be empty if the Config API is not properly implemented.
 * The only cases there would be no Config API are in tests and in storybook stories, and in those cases, it's unlikely that callers would rely on this subpath behavior.
 */
const useBaseUrl = () => {
  try {
    const config = useApi(configApiRef);
    return config.getOptionalString('app.baseUrl');
  } catch {
    return undefined;
  }
};

/**
 * Get the app base path from the configured app baseUrl.
 * The returned path does not have a trailing slash.
 */
const useBasePath = () => {
  // baseUrl can be specified as just a path
  const base = 'http://sample.dev';
  const url = useBaseUrl() ?? '/';
  const { pathname } = new URL(url, base);
  return trimEnd(pathname, '/');
};

/** @deprecated Remove once we no longer support React Router v6 beta */
export const useResolvedPath = (uri: LinkProps['to']) => {
  let resolvedPath = String(uri);

  const basePath = useBasePath();
  const external = isExternalTarget(resolvedPath);
  const startsWithBasePath = resolvedPath.startsWith(basePath);

  if (!external && !startsWithBasePath) {
    resolvedPath = basePath.concat(resolvedPath);
  }

  return resolvedPath;
};

/**
 * Given a react node, try to retrieve its text content.
 */
const getNodeText = (node: ReactNode): string => {
  // If the node is an array of children, recurse and join.
  if (node instanceof Array) {
    return node.map(getNodeText).join(' ').trim();
  }

  // If the node is a react element, recurse on its children.
  if (typeof node === 'object' && node) {
    return getNodeText((node as ReactElement)?.props?.children);
  }

  // Base case: the node is just text. Return it.
  if (['string', 'number'].includes(typeof node)) {
    return String(node);
  }

  // Base case: just return an empty string.
  return '';
};

function isModifiedEvent(event: ReactMouseEvent): boolean {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

// Named rather than written inline below, because the `??` narrows
// `UNSAFE_RouteContext` to `never` on its right-hand side.
type RouteContextValue = ContextType<typeof UNSAFE_RouteContext>;

/**
 * React Router's own route context, or a stand-in for it.
 *
 * The `UNSAFE_*` context objects only exist from React Router v6 stable
 * onwards. The v6 beta this package still supports — see the
 * `'6.0.0-beta.0 || ^6.3.0'` range the migration CLI writes, and the beta arm
 * of `Link.test.tsx` — exports no `UNSAFE_` name at all, so the import is
 * `undefined` there and handing it to `useContext` throws before a single link
 * can render.
 *
 * Resolving the context once, here at import time, keeps `useContext`
 * unconditional and always called with a real context object. Nothing ever
 * provides the stand-in, so under beta every read returns its default of no
 * matches, which is the correct degraded answer: beta cannot report a match
 * stack at all.
 */
const RouteContext =
  UNSAFE_RouteContext ??
  createContext<RouteContextValue>({
    outlet: null,
    matches: [],
    isDataRoute: false,
  });

/**
 * Whether an ambient React Router context has a route of its own to resolve a
 * relative target against.
 *
 * This is the very context React Router's own `useResolvedPath` reads, so
 * reading it here is what lets `Link` tell a page or sub-page running the
 * React Router v6 adapter — which publishes its own match on top of the ones
 * it is mounted inside, and whose answer must not change — from a page hosted
 * by another routing library, where the nearest v6 context is the app-root
 * projection and has no match at all.
 */
function useHasAmbientRouteMatch(): boolean {
  return useContext(RouteContext).matches.length > 0;
}

/**
 * Whether there is an ambient React Router at all.
 *
 * React Router's `Link` renders through `useHref` and `useNavigate`, both of
 * which throw outside a router, and app chrome is allowed to render without
 * one: `RouterBlueprint` may be swapped for a passthrough, and
 * `createSpecializedApp` without `@backstage/plugin-app` has no router at all.
 * `useInRouterContext` is React Router's own probe for exactly that: it returns
 * `false` instead of throwing, and unlike the `UNSAFE_*` context objects it is
 * exported by every v6 release including the beta, which is why `RouteTracker`
 * asks the same way. It reads the location context, so a link re-renders when
 * the router navigates — which is what React Router's own `Link` already does
 * through `useHref`.
 */
function useHasAmbientRouter(): boolean {
  return useInRouterContext();
}

/**
 * Splits a target's leading `..` off the base that climb lands on, over the
 * stack the page it is written in publishes.
 *
 * A `..` climbs one route *match*, and only the page's route pattern says where
 * a match ends: a page mounted at `/catalog/:namespace/:kind/:name` is a single
 * match spanning four segments, so one `..` climbs off the page rather than
 * into `/catalog/default/component`, which no route claims. Resolving against
 * the page's concrete base path alone climbs one path *segment* instead, and
 * only agrees where the pattern happens to claim one segment per match.
 *
 * This is `useHref`'s climb over `useHref`'s stack, which is what keeps a
 * target from rendering as one href here and a different one in the chrome
 * beside it. Everything left of the climb belongs to whoever owns the location
 * and the deploy basename, so the pair is handed on rather than resolved here.
 */
function climbInPage(
  to: string,
  pageMount: PageMount | undefined,
): { to: string; basePath: string } {
  return climbPageBase(
    to,
    pageBasePaths(pageMount?.basePath, pageMount?.routePattern),
  );
}

/**
 * Resolves a relative target written inside a page to an app-absolute path.
 *
 * The climb is {@link climbInPage}'s; what is left of the target is ordinary
 * path resolution against the base that climb landed on. Only targets with a
 * pathname of their own get here — `?tab=readme` and `#section` are relative to
 * the location rather than to any base, and are left for whoever owns the
 * location — so the base is the whole answer.
 */
function resolveInPage(to: string, pageMount: PageMount | undefined): string {
  const climbed = climbInPage(to, pageMount);
  return createPath(resolvePath(climbed.to, climbed.basePath));
}

/**
 * Props that only React Router's `Link` implements, and that a plain anchor
 * therefore has to drop.
 */
const ROUTER_ONLY_PROPS = [
  'state',
  'replace',
  'relative',
  'preventScrollReset',
  'reloadDocument',
] as const;

/**
 * Renders an internal target with no ambient React Router to hand it to.
 *
 * The href comes from the app history, which resolves the target against the
 * page it is written in and applies the app's deploy basename; with no app
 * history either, the target is handed back as written, which is all that is
 * left to say about it. React Router is deliberately not consulted — this
 * component only renders where there is none. Split out so that the hooks it
 * needs only run on the path that needs them, leaving the React Router path
 * untouched.
 *
 * The props React Router implements on top of an anchor cannot be honoured
 * here, so each one that was passed is named in a development-only warning
 * rather than silently dropped.
 */
const RouterlessLink = forwardRef<
  any,
  LinkProps & { appHistory: AppHistoryApi | undefined }
>(({ appHistory, ...props }, ref) => {
  const {
    // Consumed here as the href. `to` is React Router's own prop, so leaving it
    // in the spread would forward it to the DOM as an unknown attribute.
    to,
    state,
    replace,
    relative,
    preventScrollReset,
    reloadDocument,
    ...anchorProps
  } = props;
  // Which base a leading `..` lands on is the one part of the answer only this
  // tree can give — the page publishes its mount and its pattern here and
  // nowhere else — so the climb is resolved here and the app history is handed
  // the base it landed on, exactly as `useHref` does.
  const climbed = climbInPage(to, usePageMount());
  // Subscribes to the app history. A target with no pathname of its own —
  // `?tab=readme`, `#section` — is resolved against the current location, so
  // the href has to be recomputed when the app navigates.
  useAppHistoryLocation(appHistory);
  const href = appHistory
    ? appHistory.createHref(climbed.to, { basePath: climbed.basePath })
    : to;

  if (process.env.NODE_ENV !== 'production') {
    for (const name of ROUTER_ONLY_PROPS) {
      if (props[name] !== undefined) {
        // eslint-disable-next-line no-console
        console.warn(
          `Link ignored the '${name}' prop for the link to '${to}', ` +
            'because it is implemented by React Router and this link rendered ' +
            'outside of one, as a plain anchor.',
        );
      }
    }
  }

  return (
    <a {...anchorProps} ref={ref} href={href}>
      {props.children}
    </a>
  );
});

/**
 * Unstyled link primitive which...
 * - Uses react-router for internal links.
 * - Under the new frontend system, routes absolute / cross-plugin targets, and
 *   relative targets inside a page that React Router cannot resolve, through
 *   the app history (see `absoluteLinkNavigate.ts`).
 * - Captures link clicks as analytics events.
 */
export const UnstyledLink = forwardRef<any, LinkProps>(
  // `to` is destructured out rather than read off `props`, because three of the
  // four branches below render a plain anchor and spread the rest of the props
  // onto it — where `to` is not an attribute a browser knows.
  ({ onClick, noTrack, externalLinkIcon, to: writtenTo, ...props }, ref) => {
    const classes = useStyles();
    const analytics = useAnalytics();
    const appHistory = useOptionalAppHistory();
    const pageMount = usePageMount();
    const hasAmbientRouteMatch = useHasAmbientRouteMatch();
    const hasAmbientRouter = useHasAmbientRouter();

    // Adding the base path to URLs breaks react-router v6 stable, so we only
    // do it for beta. The react router version won't change at runtime so it is
    // fine to ignore the rules of hooks.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const rawTo = isReactRouterBeta() ? useResolvedPath(writtenTo) : writtenTo;
    const external = isExternalTarget(rawTo);

    // Inside a page that is not hosted by React Router v6 there is no v6 route
    // match to resolve a relative target against, so React Router would resolve
    // it against the app root and send the link out of the page. Those resolve
    // against the page mount instead, and are navigated by the framework, since
    // the resolved path is app-absolute and no scoped router is there to take
    // it. Everywhere else the target is handed on exactly as before.
    const resolveViaPageMount =
      !external &&
      shouldResolveViaPageMount({
        to: rawTo,
        appHistory,
        pageMount,
        hasAmbientRouteMatch,
      });
    const to = resolveViaPageMount ? resolveInPage(rawTo, pageMount) : rawTo;

    const linkText = getNodeText(props.children) || to;
    // Case-insensitive for the same reason as `isExternalTarget`: `HTTPS:` is
    // the same scheme as `https:` and has to open the same way.
    const newWindow = external && !!/^https?:/i.exec(to);
    const navigateViaFramework =
      !external &&
      (resolveViaPageMount ||
        shouldNavigateViaFramework({
          to,
          appHistory,
          pageMount,
        }));

    if (scriptProtocolPattern.test(to)) {
      throw new Error(
        'Link component rejected javascript: URL as a security precaution',
      );
    }

    const handleClick = (event: ReactMouseEvent<any, MouseEvent>) => {
      onClick?.(event);
      if (!noTrack) {
        analytics.captureEvent('click', linkText, { attributes: { to } });
      }
      if (
        navigateViaFramework &&
        appHistory &&
        !event.defaultPrevented &&
        event.button === 0 &&
        !isModifiedEvent(event) &&
        props.target !== '_blank'
      ) {
        event.preventDefault();
        appHistory.navigate(to);
      }
    };

    if (external) {
      return (
        <a
          {...(newWindow ? { target: '_blank', rel: 'noopener' } : {})}
          {...props}
          {...(props['aria-label']
            ? { 'aria-label': `${props['aria-label']}, Opens in a new window` }
            : {})}
          ref={ref}
          href={to}
          onClick={handleClick}
          className={classnames(classes.externalLink, props.className)}
        >
          {props.children}
          {externalLinkIcon && <ExternalLinkIcon />}
          <Typography component="span" className={classes.visuallyHidden}>
            , Opens in a new window
          </Typography>
        </a>
      );
    }

    if (navigateViaFramework && appHistory) {
      // Cross-plugin targets, and relative targets resolved against the page
      // mount above, navigate through the app history. The href still has to be
      // a real browser URL, including the app's deploy basename, so
      // middle-click, "open in new tab" and crawlers work.
      return (
        <a
          {...props}
          ref={ref}
          href={appHistory.createHref(to)}
          onClick={handleClick}
        >
          {props.children}
        </a>
      );
    }

    if (!hasAmbientRouter) {
      // Nothing left to hand the target to: React Router's `Link` would throw
      // here, and everything above has already been ruled out. Chrome that
      // renders with no router at all still gets a working anchor.
      return (
        <RouterlessLink
          {...props}
          ref={ref}
          to={to}
          onClick={handleClick}
          appHistory={appHistory}
        />
      );
    }

    // Interact with React Router for internal links
    return <RouterLink {...props} ref={ref} to={to} onClick={handleClick} />;
  },
);

/**
 * Thin wrapper combining UnstyledLink with material-ui's Link component.
 */
export const Link = forwardRef<any, LinkProps>((props, ref) => {
  return <MaterialLink {...props} ref={ref} component={UnstyledLink} />;
}) as (props: LinkProps) => JSX.Element;
