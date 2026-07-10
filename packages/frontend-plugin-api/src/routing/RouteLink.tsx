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
  AnchorHTMLAttributes,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  forwardRef,
} from 'react';
import { AnyRouteRefParams } from './types';
import { RouteRef } from './RouteRef';
import { SubRouteRef } from './SubRouteRef';
import { ExternalRouteRef } from './ExternalRouteRef';
import { useRouteRef } from './useRouteRef';
import { useFrameworkNavigate } from './useFrameworkNavigation';

/**
 * Props for {@link RouteLink}.
 *
 * @public
 */
export type RouteLinkProps<TParams extends AnyRouteRefParams> = {
  routeRef:
    | RouteRef<TParams>
    | SubRouteRef<TParams>
    | ExternalRouteRef<TParams>;
  /**
   * Route parameters. Required when the route ref declares params; omit when
   * the route has none.
   */
  params?: TParams;
  /** When true, replace the current history entry instead of pushing. */
  replace?: boolean;
  children?: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

function isModifiedEvent(event: ReactMouseEvent): boolean {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

/**
 * A framework-owned link that resolves a {@link RouteRef} and navigates via
 * the navigation controller. Prefer this for cross-plugin navigation instead
 * of React Router's `Link` or a scoped `useNavigate` with an absolute path.
 *
 * @public
 */
export const RouteLink = forwardRef(function RouteLink<
  TParams extends AnyRouteRefParams,
>(props: RouteLinkProps<TParams>, ref: React.ForwardedRef<HTMLAnchorElement>) {
  const { routeRef, params, replace, children, onClick, ...rest } = props;
  const routeFunc = useRouteRef(routeRef);
  const navigate = useFrameworkNavigate();

  if (!routeFunc) {
    return <>{children}</>;
  }

  const to =
    params === undefined
      ? (routeFunc as unknown as () => string)()
      : (routeFunc as unknown as (p: TParams) => string)(params);

  const handleClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      isModifiedEvent(event) ||
      rest.target === '_blank'
    ) {
      return;
    }
    event.preventDefault();
    navigate(to, replace ? { replace: true } : undefined);
  };

  return (
    <a {...rest} ref={ref} href={to} onClick={handleClick}>
      {children}
    </a>
  );
}) as <TParams extends AnyRouteRefParams>(
  props: RouteLinkProps<TParams> & {
    ref?: React.ForwardedRef<HTMLAnchorElement>;
  },
) => JSX.Element | null;
