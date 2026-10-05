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

import { useMemo, type ReactNode } from 'react';
import { ApiProvider } from '@backstage/core-app-api';
import {
  routeResolutionApiRef,
  useApiHolder,
  type ApiRef,
  type RouteResolutionApi,
} from '@backstage/frontend-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { RouteResolver } from '../../../frontend-app-api/src/routing/RouteResolver';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import type { BackstageRouteObject } from '../../../frontend-app-api/src/routing/types';

/** Supplies real path matching for isolated extension trees. */
export function TestRouteResolver(props: {
  routeObjects: BackstageRouteObject[];
  children: ReactNode;
}) {
  const parent = useApiHolder();
  const apis = useMemo(() => {
    const resolver = new RouteResolver(
      new Map(),
      new Map(),
      props.routeObjects,
      new Map(),
      '',
      <T,>(ref: T) => ref,
      new Map(),
    );
    const api: RouteResolutionApi = {
      resolve: (...args) => parent.get(routeResolutionApiRef)?.resolve(...args),
      resolvePath: options => resolver.resolvePath(options),
    };
    return {
      get<T>(ref: ApiRef<T>): T | undefined {
        if (ref.id === routeResolutionApiRef.id) {
          return api as T;
        }
        return parent.get(ref);
      },
    };
  }, [parent, props.routeObjects]);
  return <ApiProvider apis={apis}>{props.children}</ApiProvider>;
}
