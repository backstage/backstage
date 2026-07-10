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

import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import type {
  RouteDescriptor,
  RoutingContract,
} from '@backstage/frontend-plugin-api';
import {
  RouterProvider,
  createRouter,
  type AnyRouter,
} from '@tanstack/react-router';
import { compileRouteDescriptors } from './compileRouteDescriptors';
import { createContractHistory } from './createContractHistory';

/**
 * Options for creating a TanStack scoped router bound to a contract.
 *
 * @public
 */
export interface CreateTanStackScopedRouterOptions {
  /**
   * Registered page route pattern (for stable contract identity).
   */
  routePattern?: string;
  /**
   * App basename prefix for href creation.
   */
  appBasename?: string;
  /**
   * In-page route descriptors to compile into a route tree.
   */
  routes?: readonly RouteDescriptor[];
  /**
   * Ref to page shell children so the route tree can stay stable across
   * renders.
   */
  childrenRef?: React.MutableRefObject<ReactNode>;
  /**
   * Static page shell children when a ref is not needed.
   */
  children?: ReactNode;
}

/**
 * Result of creating a TanStack scoped router for a page contract.
 *
 * @public
 */
export interface TanStackScopedRouterResult {
  /**
   * The TanStack router instance.
   */
  router: AnyRouter;
  /**
   * Tear down history subscriptions.
   */
  dispose: () => void;
}

/**
 * Creates a TanStack router whose history projects the given routing contract.
 * Never writes `window.history`.
 *
 * @public
 */
export function createTanStackScopedRouter(
  contract: RoutingContract,
  options?: CreateTanStackScopedRouterOptions,
): TanStackScopedRouterResult {
  const history = createContractHistory(contract, {
    appBasename: options?.appBasename,
  });
  const routeTree = compileRouteDescriptors(options?.routes ?? [], {
    childrenRef: options?.childrenRef,
    children: options?.children,
  });

  const router = createRouter({
    routeTree,
    history,
  });

  return {
    router,
    dispose: () => {
      history.destroy();
    },
  };
}

/**
 * Host that creates a TanStack router for the page contract, disposes it on
 * unmount / option change, and renders via TanStack `RouterProvider`.
 *
 * @internal
 */
export function TanStackRouterHost(props: {
  contract: RoutingContract;
  routePattern: string;
  appBasename?: string;
  routes?: readonly RouteDescriptor[];
  children: ReactNode;
}) {
  const { contract, routePattern, appBasename, routes, children } = props;
  const childrenRef = useRef<ReactNode>(children);
  childrenRef.current = children;
  const scopedRef = useRef<TanStackScopedRouterResult | null>(null);

  const scoped = useMemo(() => {
    scopedRef.current?.dispose();
    const created = createTanStackScopedRouter(contract, {
      routePattern,
      appBasename,
      routes,
      childrenRef,
    });
    scopedRef.current = created;
    return created;
  }, [contract, routePattern, appBasename, routes]);

  useEffect(() => {
    return () => {
      scopedRef.current?.dispose();
      scopedRef.current = null;
    };
  }, [scoped]);

  return <RouterProvider router={scoped.router} />;
}
