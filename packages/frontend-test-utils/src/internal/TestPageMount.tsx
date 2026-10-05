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
  useRouteResolution,
  routeResolutionApiRef,
  useApiHolder,
  type AppNode,
  type ApiRef,
  type RouteResolutionApi,
} from '@backstage/frontend-plugin-api';
import {
  createVersionedContext,
  createVersionedValueMap,
} from '@backstage/version-bridge';
import { type PageMount } from '@internal/frontend';

const AppNodeContext = createVersionedContext<{ 1: { node?: AppNode } }>(
  'app-node-context',
);

/** Supplies fixed route-resolution results for isolated routing-hook tests. */
export function PageMountProvider(props: {
  mount: PageMount;
  isolated?: boolean;
  children: ReactNode;
}) {
  const parent = useApiHolder();
  const parentChain = useRouteResolution().matches;
  const node = useMemo(() => ({} as AppNode), []);
  const { basePath, routePattern, params, contributesPath } = props.mount;
  const apis = useMemo(() => {
    const match = { node, basePath, routePattern, params, contributesPath };
    const result = { matches: [...(props.isolated ? [] : parentChain), match] };
    const api = {
      resolve: (...args: Parameters<RouteResolutionApi['resolve']>) =>
        parent.get(routeResolutionApiRef)?.resolve(...args),
      resolvePath: () => result,
    };
    return {
      get<T>(ref: ApiRef<T>): T | undefined {
        if (ref.id === routeResolutionApiRef.id) {
          return api as T;
        }
        return parent.get(ref);
      },
    };
  }, [
    parent,
    parentChain,
    node,
    basePath,
    routePattern,
    params,
    contributesPath,
    props.isolated,
  ]);
  return (
    <ApiProvider apis={apis}>
      <AppNodeContext.Provider value={createVersionedValueMap({ 1: { node } })}>
        {props.children}
      </AppNodeContext.Provider>
    </ApiProvider>
  );
}
