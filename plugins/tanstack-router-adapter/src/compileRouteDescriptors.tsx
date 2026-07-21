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
  Children,
  cloneElement,
  isValidElement,
  type MutableRefObject,
  type ReactNode,
} from 'react';
import {
  BreadcrumbEntry,
  ExtensionBoundary,
  useAppNode,
  type RouteDescriptor,
} from '@backstage/frontend-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { LazyDescriptorElement } from '../../../packages/frontend-plugin-api/src/routing/LazyDescriptorElement';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { resolveRouteDescriptorLoader } from '../../../packages/frontend-plugin-api/src/routing/RouteDescriptor';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  getRouteDescriptorParamName,
  isRouteDescriptorParamSegment,
  isRouteDescriptorSplatSegment,
  splitRouteDescriptorPath,
} from '../../../packages/frontend-plugin-api/src/routing/routeDescriptorPath';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { NestedRoutingContractProvider } from '../../../packages/frontend-plugin-api/src/routing/NestedRoutingContractProvider';
import {
  Outlet,
  createRootRoute,
  createRoute,
  type AnyRoute,
} from '@tanstack/react-router';
/**
 * Convert a RouteDescriptor path (`entities/:id`, `docs/*`, `*`) into a
 * TanStack path segment (`/entities/$id`, `/docs/$`, `/$`).
 *
 * @internal
 */
export function descriptorPathToTanStack(path: string | undefined): string {
  const segments = splitRouteDescriptorPath(path);
  if (!segments.length) {
    return '/';
  }
  const withParams = segments
    .map(segment => {
      if (isRouteDescriptorSplatSegment(segment)) {
        return '$';
      }
      if (isRouteDescriptorParamSegment(segment)) {
        return `$${getRouteDescriptorParamName(segment)}`;
      }
      return segment;
    })
    .join('/');
  return `/${withParams}`;
}

function DescriptorRouteElement(props: { route: RouteDescriptor }) {
  const { route } = props;
  const node = useAppNode();
  const loader = resolveRouteDescriptorLoader(route);
  const hasChildren = route.children.length > 0;

  let element: ReactNode = null;
  if (loader) {
    element = node ? (
      ExtensionBoundary.lazy(node, loader)
    ) : (
      <LazyDescriptorElement loader={loader} />
    );
  }

  if (!element && !hasChildren) {
    return null;
  }

  let content: ReactNode = null;
  if (element) {
    content = (
      <BreadcrumbEntry
        entry={{
          label: route.title || route.path || route.id || 'index',
          href: route.path ?? '',
        }}
      >
        {element}
        {hasChildren ? <Outlet /> : null}
      </BreadcrumbEntry>
    );
  } else if (hasChildren) {
    content = <Outlet />;
  }

  return (
    <NestedRoutingContractProvider subPath={route.path ?? ''}>
      {content}
    </NestedRoutingContractProvider>
  );
}

function compileChildRoutes(
  parentRoute: AnyRoute,
  routes: readonly RouteDescriptor[],
  idPrefix: string,
): AnyRoute[] {
  return routes.map((route, index) => {
    const routeId = route.id ?? `${idPrefix}-${index}`;
    // TanStack forbids setting both `id` and `path` on the same route.
    // Prefer path for matching; use id only for pathless layout wrappers.
    const path = route.index ? '/' : descriptorPathToTanStack(route.path);

    const tanstackRoute = createRoute({
      getParentRoute: () => parentRoute,
      path,
      component: () => <DescriptorRouteElement route={route} />,
    });

    if (route.children.length > 0) {
      return tanstackRoute.addChildren(
        compileChildRoutes(tanstackRoute, route.children, routeId),
      );
    }

    return tanstackRoute;
  });
}

/**
 * Options for {@link compileRouteDescriptors}.
 *
 * @internal
 */
export interface CompileRouteDescriptorsOptions {
  /**
   * Optional ref to page shell children (e.g. PageLayout). Read on each render
   * so the route tree can stay stable while children update.
   */
  childrenRef?: MutableRefObject<ReactNode>;
  /** Static children when a ref is not needed. */
  children?: ReactNode;
}

/**
 * Compiles a RouteDescriptor tree into a TanStack `routeTree` rooted at a
 * layout route that renders page children (typically PageLayout) and an Outlet
 * for matched descriptors.
 *
 * @internal
 */
export function compileRouteDescriptors(
  routes: readonly RouteDescriptor[],
  options?: CompileRouteDescriptorsOptions,
): AnyRoute {
  const childrenRef = options?.childrenRef;
  const staticChildren = options?.children;

  const rootRoute = createRootRoute({
    component: () => {
      const pageChildren = childrenRef ? childrenRef.current : staticChildren;
      if (isValidElement(pageChildren) && Children.count(pageChildren) === 1) {
        return cloneElement(pageChildren, undefined, <Outlet />);
      }
      return (
        <>
          {pageChildren}
          <Outlet />
        </>
      );
    },
  });

  if (!routes.length) {
    return rootRoute;
  }

  return rootRoute.addChildren(
    compileChildRoutes(rootRoute, routes, 'descriptor'),
  );
}

/**
 * Inject compiled TanStack routes by returning the route tree for
 * `createRouter`. When `routes` is empty, returns a root-only tree that
 * renders `children`.
 *
 * @internal
 */
export function withCompiledRouteDescriptors(
  children: ReactNode,
  routes: readonly RouteDescriptor[] | undefined,
): AnyRoute {
  return compileRouteDescriptors(routes ?? [], { children });
}
