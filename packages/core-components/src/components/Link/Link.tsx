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
  forwardRef,
  useContext,
} from 'react';
import {
  createPath,
  createRoutesFromChildren,
  Link as RouterLink,
  LinkProps as RouterLinkProps,
  resolvePath,
  Route,
  UNSAFE_RouteContext as RouteContext,
} from 'react-router-dom';
import OpenInNew from '@material-ui/icons/OpenInNew';
import {
  shouldNavigateViaFramework,
  shouldResolveViaPageMount,
} from './absoluteLinkNavigate';
import { useAppBasePath, usePageMount } from '@internal/frontend';
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

/**
 * Whether a target points outside the app: an absolute URL
 * (`https://example.com/x`), a protocol-relative URL (`//example.com/x`), or an
 * opaque scheme such as `mailto:` or `tel:`.
 *
 * The scheme grammar follows RFC 3986 — a leading letter followed by letters,
 * digits, `+`, `-` or `.` — and schemes are case-insensitive, so `MAILTO:` and
 * `S3://` are classified exactly like their lower-case forms. Anything that is
 * not a well-formed scheme, such as a first path segment starting with `+`, `-`
 * or `.`, stays app-relative, which is also how a browser reads it.
 *
 * Unlike the framework's own equivalent this does not split off the query and
 * fragment first, because it cannot matter: the pattern is anchored and a
 * scheme can contain neither `?` nor `#`, so a target whose query or fragment
 * carries a URL of its own — say `/search?q=https://example.com` — can never be
 * mistaken for one.
 */
export const isExternalUri = (uri: string) =>
  /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(uri) || uri.startsWith('//');

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
  const external = isExternalUri(resolvedPath);
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

/**
 * Whether an ambient React Router context has a route of its own to resolve a
 * relative target against.
 *
 * This is the very context React Router's own `useResolvedPath` reads, so
 * reading it here is what lets `Link` tell a page running the React Router v6
 * adapter — which publishes its own match, and whose answer must not change —
 * from a page hosted by another routing library, where the nearest v6 context
 * is the app-root projection and has no match at all.
 */
function useHasAmbientRouteMatch(): boolean {
  return useContext(RouteContext).matches.length > 0;
}

/**
 * Unstyled link primitive which...
 * - Uses react-router for internal links.
 * - Under the new frontend system, routes absolute / cross-plugin targets, and
 *   relative targets inside a page that React Router cannot resolve, through
 *   the app history (see `absoluteLinkNavigate.ts`).
 * - Captures link clicks as analytics events.
 */
export const UnstyledLink = forwardRef<any, LinkProps>(
  ({ onClick, noTrack, externalLinkIcon, ...props }, ref) => {
    const classes = useStyles();
    const analytics = useAnalytics();
    const appHistory = useOptionalAppHistory();
    const pageMount = usePageMount();
    const basePath = useAppBasePath();
    const hasAmbientRouteMatch = useHasAmbientRouteMatch();

    // Adding the base path to URLs breaks react-router v6 stable, so we only
    // do it for beta. The react router version won't change at runtime so it is
    // fine to ignore the rules of hooks.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const rawTo = isReactRouterBeta() ? useResolvedPath(props.to) : props.to;
    const external = isExternalUri(rawTo);

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
    const to = resolveViaPageMount
      ? createPath(resolvePath(rawTo, basePath || '/'))
      : rawTo;

    const linkText = getNodeText(props.children) || to;
    // Case-insensitive for the same reason as `isExternalUri`: `HTTPS:` is the
    // same scheme as `https:` and has to open the same way.
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
