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
  createElement,
  isValidElement,
  type ReactElement,
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
import { NestedRoutingContractProvider } from '../../../packages/frontend-plugin-api/src/routing/NestedRoutingContractProvider';
import { Route, Routes } from 'react-router-dom';
import type {
  CompileRouteDescriptorsApi,
  ReactRouterAdapterBindings,
} from './types';

/**
 * Derives the React Router path for a {@link RouteDescriptor}, appending a
 * splat segment to non-splat paths so descendant routes can still match
 * (e.g. so `NestedRoutingContractProvider` and nested routes resolve
 * correctly).
 *
 * @internal
 */
export function descriptorRoutePath(
  route: RouteDescriptor,
): string | undefined {
  if (route.splat) {
    return route.path;
  }
  if (route.path) {
    return `${route.path}/*`;
  }
  return undefined;
}

/**
 * Compiles a {@link RouteDescriptor} tree into React Router `<Routes>`, using
 * `Route` / `Routes` from the caller's injected bindings.
 *
 * @internal
 */
export function createCompileRouteDescriptors(
  bindings: Pick<ReactRouterAdapterBindings, 'Route' | 'Routes'>,
): CompileRouteDescriptorsApi {
  const { Route: RouteComponent, Routes: RoutesComponent } = bindings;

  function DescriptorRouteElement(props: { route: RouteDescriptor }) {
    const { route } = props;
    const node = useAppNode();
    const loader = resolveRouteDescriptorLoader(route);
    const nested =
      route.children.length > 0 ? (
        <DescriptorRoutes routes={route.children} />
      ) : null;

    let element: ReactNode = null;
    if (loader) {
      element = node ? (
        ExtensionBoundary.lazy(node, loader)
      ) : (
        <LazyDescriptorElement loader={loader} />
      );
    }

    if (!element && !nested) {
      return null;
    }

    return (
      <NestedRoutingContractProvider subPath={route.path ?? ''}>
        {element ? (
          <BreadcrumbEntry
            entry={{
              label: route.title || route.path || route.id || 'index',
              href: route.path ?? '',
            }}
          >
            {element}
            {nested}
          </BreadcrumbEntry>
        ) : (
          nested
        )}
      </NestedRoutingContractProvider>
    );
  }

  function DescriptorRoutes(props: { routes: readonly RouteDescriptor[] }) {
    return (
      <RoutesComponent>{mapDescriptorRoutes(props.routes)}</RoutesComponent>
    );
  }

  function mapDescriptorRoutes(routes: readonly RouteDescriptor[]) {
    return routes.map((route, index) => {
      const element = <DescriptorRouteElement route={route} />;

      if (route.index) {
        return createElement(RouteComponent, {
          key: route.id ?? index,
          index: true,
          element,
        });
      }

      return createElement(RouteComponent, {
        key: route.id ?? index,
        path: descriptorRoutePath(route),
        element,
      });
    });
  }

  function compile(routes: readonly RouteDescriptor[]): ReactElement {
    return <DescriptorRoutes routes={routes} />;
  }

  function withCompiled(
    children: ReactNode,
    routes: readonly RouteDescriptor[] | undefined,
  ): ReactNode {
    if (!routes?.length) {
      return children;
    }

    const compiled = compile(routes);

    if (isValidElement(children) && Children.count(children) === 1) {
      return cloneElement(children, undefined, compiled);
    }

    return (
      <>
        {children}
        {compiled}
      </>
    );
  }

  return {
    compileRouteDescriptors: compile,
    withCompiledRouteDescriptors: withCompiled,
  };
}

const {
  compileRouteDescriptors: compile,
  withCompiledRouteDescriptors: withCompiled,
} = createCompileRouteDescriptors({
  Route: Route as ReactRouterAdapterBindings['Route'],
  Routes,
});

/**
 * Compiles a {@link RouteDescriptor} tree into React Router v6 `<Routes>`.
 *
 * @internal
 */
export function compileRouteDescriptors(
  routes: readonly RouteDescriptor[],
): ReactElement {
  return compile(routes);
}

/**
 * When `routes` are present, inject compiled route elements as the single
 * child's children (e.g. into PageLayout). Otherwise return `children` as-is
 * for the opaque expand-contract path.
 *
 * @internal
 */
export function withCompiledRouteDescriptors(
  children: ReactNode,
  routes: readonly RouteDescriptor[] | undefined,
): ReactNode {
  return withCompiled(children, routes);
}
