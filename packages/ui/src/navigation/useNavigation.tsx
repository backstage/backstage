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

import {
  useCallback,
  useMemo,
  type HTMLAttributeAnchorTarget,
  type JSX,
  type MouseEvent,
  type ReactElement,
} from 'react';
import { createPath, type NavigateOptions } from 'react-router-dom';
import { isBrowserOwnedHref } from '../utils/linkUtils';
import type { BUIRoutingIntegration } from './types';
import {
  fallbackRoutingIntegration,
  useRoutingIntegration,
} from './useRouting';

/** @internal */
export type NavigationProps = {
  href?: string;
  target?: HTMLAttributeAnchorTarget;
  download?: boolean | string;
  routerOptions?: NavigateOptions;
};

/** @internal */
export type AnchorNavigation = { canMatchRoute: boolean } & (
  | { type: 'none' }
  | { type: 'native'; ariaHref: string; browserHref: string }
  | {
      type: 'router';
      ariaHref: string;
      to: string;
      Link: BUIRoutingIntegration['Link'];
      routerOptions?: NavigateOptions;
      routerLinkOptions: Omit<NavigateOptions, 'flushSync'> | undefined;
      navigateWithFullOptions?: () => void;
    }
);

type PolymorphicRenderFunction = (...args: any[]) => ReactElement;

export { isBrowserOwnedHref } from '../utils/linkUtils';

/** @internal */
export function isNativeNavigation(props: NavigationProps): boolean {
  const { href, target, download } = props;
  return Boolean(
    (href !== undefined && isBrowserOwnedHref(href)) ||
      (target && target !== '_self') ||
      (download !== undefined && download !== false),
  );
}

/**
 * A BUI component may come from a plugin that was built and released
 * independently from the application. We therefore cannot assume that the
 * component and the application's BUIProvider use the same BUI version or the
 * same installed copy of React Aria.
 *
 * These are two separate compatibility concerns:
 *
 * 1. BUIProvider version. A provider with routing support supplies the
 *    application's React Router hooks and Link component. An older provider
 *    does not, so the component falls back to directly imported React Router
 *    APIs. This fallback can be removed when providers without routing support
 *    are no longer supported.
 *
 * 2. React Aria package instance. React context is only visible to components
 *    using the same React Aria copy. A plugin using another copy cannot see the
 *    application's React Aria RouterProvider.
 *
 * Internal links render a React Router Link, either directly or through React
 * Aria's render prop. In both cases, React Aria's generated props, including its
 * click handler, are passed to that Link. React Router runs this supplied click
 * handler before its own navigation handler.
 *
 * - If the component can see the application's React Aria RouterProvider,
 *   React Aria prevents the click's default behavior and delegates navigation
 *   through that provider. React Router sees the prevented event and does not
 *   navigate a second time.
 * - If the component uses a separate React Aria copy, it cannot see that
 *   provider. React Aria leaves the event unhandled, so the rendered React
 *   Router Link performs the navigation.
 *
 * Navigation options are provided to both paths so they behave consistently.
 * React Router Link does not support `flushSync`, so when that option is
 * enabled, BUI calls `navigate` directly if React Aria did not already handle
 * an ordinary click. Modified clicks and other browser-owned activation still
 * reach the rendered anchor unchanged.
 *
 * This dual click handling exists for compatibility with older BUI components
 * and older BUIProvider implementations. Once supported applications and
 * plugins are required to use both a routing-capable BUIProvider and BUI
 * components that render React Router links, the React Aria RouterProvider and
 * its delegated-navigation path can be removed. The rendered React Router Link
 * can then become the only client-side navigation path for anchors.
 *
 * After selecting the routing integration, this hook determines who should
 * handle the destination. React Router handles ordinary internal links. The
 * browser handles external URLs, custom URL schemes, downloads, and links with
 * a non-self target. Route matching is tracked separately: an internal tab can
 * still match the current route even when its activation is browser-owned. A
 * missing href does not navigate.
 *
 * @internal
 */
export function useAnchorNavigation(props: NavigationProps): AnchorNavigation {
  const { href, routerOptions: navigateOptions } = props;
  const routingIntegration = useRoutingIntegration();
  const routing = routingIntegration ?? fallbackRoutingIntegration;
  const navigate = routing.useNavigate();
  // React hooks must be called in the same order on every render. Missing hrefs,
  // external URLs, and custom URL schemes do not need route resolution, so "."
  // is used as a harmless placeholder when calling the router hooks.
  const routerHref =
    href !== undefined && !isBrowserOwnedHref(href) ? href : '.';
  const relativeOptions = { relative: navigateOptions?.relative };
  const resolvedPath = routing.useResolvedPath(routerHref, relativeOptions);
  const resolvedHref = routing.useHref(routerHref, relativeOptions);
  const navigateWithOptions = useCallback(() => {
    if (href !== undefined) {
      navigate(href, navigateOptions);
    }
  }, [navigate, href, navigateOptions]);
  const delegatedRouterOptions = useMemo(() => {
    if (!routingIntegration || href === undefined) {
      return undefined;
    }
    return routingIntegration.createRouterOptions(
      navigateWithOptions,
      navigateOptions,
    );
  }, [routingIntegration, navigateWithOptions, href, navigateOptions]);
  let routerLinkOptions: Omit<NavigateOptions, 'flushSync'> | undefined;
  if (navigateOptions) {
    // React Aria accepts all NavigateOptions when it delegates through its
    // RouterProvider. React Router Link accepts the same options except
    // flushSync, so omit that option from the props passed to the rendered Link.
    const { flushSync: _flushSync, ...supportedOptions } = navigateOptions;
    routerLinkOptions = supportedOptions;
  }
  const navigateWithFullOptions =
    navigateOptions?.flushSync === true ? navigateWithOptions : undefined;

  if (href === undefined) {
    return { type: 'none', canMatchRoute: false };
  }
  const canMatchRoute = !isBrowserOwnedHref(href);
  if (isNativeNavigation(props)) {
    return {
      type: 'native',
      canMatchRoute,
      ariaHref: href,
      browserHref: isBrowserOwnedHref(href) ? href : resolvedHref,
    };
  }
  if (routingIntegration) {
    return {
      type: 'router',
      canMatchRoute,
      ariaHref: href,
      to: href,
      Link: routingIntegration.Link,
      routerOptions: delegatedRouterOptions,
      routerLinkOptions,
      navigateWithFullOptions,
    };
  }
  return {
    type: 'router',
    canMatchRoute,
    ariaHref: createPath(resolvedPath),
    to: href,
    Link: fallbackRoutingIntegration.Link,
    routerOptions: navigateOptions,
    routerLinkOptions,
    navigateWithFullOptions,
  };
}

/**
 * Completes an eligible click with the one navigation option that React Router
 * Link cannot represent. Callers invoke this after React Aria's click handler.
 *
 * @internal
 */
export function handleRouterLinkClick(
  event: MouseEvent<HTMLAnchorElement>,
  navigation: AnchorNavigation,
) {
  const navigateWithFullOptions =
    navigation.type === 'router'
      ? navigation.navigateWithFullOptions
      : undefined;
  if (
    !navigateWithFullOptions ||
    event.defaultPrevented ||
    event.button !== 0 ||
    (event.currentTarget.target && event.currentTarget.target !== '_self') ||
    event.metaKey ||
    event.altKey ||
    event.ctrlKey ||
    event.shiftKey
  ) {
    return;
  }

  event.preventDefault();
  navigateWithFullOptions();
}

/**
 * Converts the selected navigation behavior into props understood by React
 * Aria.
 *
 * Internal destinations are rendered as the selected React Router Link.
 * `routerOptions` are used when React Aria delegates the click through its
 * RouterProvider. The equivalent Link props are also applied to the rendered
 * React Router Link for components that cannot see that provider.
 *
 * Destinations handled by the browser are rendered as plain anchors. Their
 * final href includes any React Router basename exactly once.
 *
 * @internal
 */
export function getReactAriaAnchorProps(
  navigation: AnchorNavigation,
  props: {
    href?: string;
    routerOptions?: NavigateOptions;
  },
): {
  href?: string;
  routerOptions?: NavigateOptions;
  render?: PolymorphicRenderFunction;
} {
  switch (navigation.type) {
    case 'none':
      return {
        href: props.href,
        routerOptions: props.routerOptions,
        render: undefined,
      };
    case 'router':
      return {
        href: navigation.ariaHref,
        routerOptions: navigation.routerOptions,
        render: (domProps: JSX.IntrinsicElements['a']) => {
          const {
            href: _href,
            onClick: reactAriaOnClick,
            ...routerLinkProps
          } = domProps;
          const onClick = navigation.navigateWithFullOptions
            ? (event: MouseEvent<HTMLAnchorElement>) => {
                reactAriaOnClick?.(event);
                handleRouterLinkClick(event, navigation);
              }
            : reactAriaOnClick;
          return (
            <navigation.Link
              {...routerLinkProps}
              {...navigation.routerLinkOptions}
              {...(onClick ? { onClick } : {})}
              to={navigation.to}
            />
          );
        },
      };
    case 'native':
      return {
        href: navigation.ariaHref,
        routerOptions: props.routerOptions,
        // React Aria classifies the raw href, while the final DOM anchor needs
        // the router-resolved href so a basename is applied exactly once.
        render: (domProps: JSX.IntrinsicElements['a']) => (
          <a {...domProps} href={navigation.browserHref} />
        ),
      };
  }
}
