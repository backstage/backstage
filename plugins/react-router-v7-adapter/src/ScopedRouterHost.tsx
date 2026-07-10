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
  ScopedRouterHostProps,
  ScopedRouterWithBindingsResult,
} from './types';

/**
 * Shared page-router host: creates a scoped router for the page contract,
 * disposes it on unmount / option change, and optionally injects compiled
 * route descriptors into children.
 *
 * @internal
 */
export function ScopedRouterHost(props: ScopedRouterHostProps): ReactNode {
  const {
    contract,
    routePattern,
    appBasename,
    routes,
    children,
    createScopedRouter,
    withCompiledRouteDescriptors,
  } = props;
  const scopedRouterRef = useRef<ScopedRouterWithBindingsResult | null>(null);

  const scopedRouter = useMemo(() => {
    scopedRouterRef.current?.dispose();
    const created = createScopedRouter(contract, {
      routePattern,
      appBasename,
    });
    scopedRouterRef.current = created;
    return created;
  }, [contract, routePattern, appBasename, createScopedRouter]);

  useEffect(() => {
    return () => {
      scopedRouterRef.current?.dispose();
      scopedRouterRef.current = null;
    };
  }, [scopedRouter]);

  return (
    <scopedRouter.Router>
      {withCompiledRouteDescriptors(children, routes)}
    </scopedRouter.Router>
  );
}
