/*
 * Copyright 2022 The Backstage Authors
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

import type { AnyApiFactory } from '@backstage/core-plugin-api';

import type { DevToolApi, DevToolApiDependency } from '../types';

export function sortCompareApis(a: DevToolApi, b: DevToolApi) {
  const aPrefix = a.id.split('.')[0];
  const bPrefix = b.id.split('.')[0];

  if (aPrefix !== bPrefix) {
    if (aPrefix === 'internal') return -1;
    else if (bPrefix === 'internal') return 1;
    else if (aPrefix === 'plugin') return -1;
    else if (bPrefix === 'plugin') return 1;
    else if (aPrefix === 'core') return -1;
    else if (bPrefix === 'core') return 1;
  }
  return a.id.localeCompare(b.id);
}

export function parseApis(apis: Iterable<AnyApiFactory>): DevToolApi[] {
  const ret = [...apis].map(api => parseApi(api));

  return parseApiGraph(ret);
}

export function parseApi(api: AnyApiFactory): DevToolApi {
  return {
    id: api.api.id,
    dependencies: Object.entries(api.deps).map(([name, depApi]) => ({
      id: depApi.id,
      name,
    })),
    dependents: [],
  };
}

function uniqDevToolApiDependencies(
  apis: DevToolApiDependency[],
): DevToolApiDependency[] {
  const visited = new Set<string>();
  return apis.filter(api => {
    if (visited.has(api.id)) return false;
    visited.add(api.id);
    return true;
  });
}

// Finds all dependencies/dependents and strips duplicates
export function parseApiGraph(apis: DevToolApi[]): DevToolApi[] {
  const condencedMap = new Map<string, DevToolApi>();
  apis.forEach(api => {
    const devtoolApi = condencedMap.get(api.id) ?? {
      id: api.id,
      dependencies: [],
      dependents: [],
    };

    devtoolApi.dependencies = uniqDevToolApiDependencies([
      ...devtoolApi.dependencies,
      ...api.dependencies,
    ]);

    devtoolApi.dependents = uniqDevToolApiDependencies([
      ...devtoolApi.dependents,
      ...api.dependents,
    ]);

    // devtoolApi.dependents.forEach(dep => {
    //   condencedMap.get(dep.id)
    // });

    condencedMap.set(api.id, devtoolApi);
  });

  const condenced = [...condencedMap.values()];

  // Some apis aren't exposed but can be inferred from deps
  const known = new Set(apis.map(api => api.id));
  const inferred = new Set<string>();

  condenced.forEach(api => {
    api.dependencies.forEach(dep => {
      if (!known.has(dep.id)) {
        inferred.add(dep.id);
      }
    });
  });
  const inferredApis = [...inferred].map(
    (id): DevToolApi => ({ id, dependencies: [], dependents: [] }),
  );
  condenced.push(...inferredApis);

  //   const inferredApis = [...inferred].map((id): DevToolApi=>({id, dependencies: [], dependents: []}));
  //   console.log("KNOWN", [...known], "APIS", [...apis], "INFERRED", inferredApis);
  //   apis.push(...inferredApis);

  const inverseDepsMap = new Map<string, DevToolApiDependency[]>();
  condenced.forEach(api => {
    api.dependencies.forEach(dep => {
      const list = inverseDepsMap.get(dep.id) ?? [];
      list.push({ id: api.id, name: dep.name });
      inverseDepsMap.set(dep.id, list);
    });
  });

  return condenced.map(api => ({
    ...api,
    dependents: inverseDepsMap.get(api.id) ?? [],
  }));
}
