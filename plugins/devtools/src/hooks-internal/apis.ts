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

import { useMemo } from 'react';
import { BackstageApp } from '@backstage/core-app-api';

import { DevToolApiWithPlugin } from '../types';
import { useMemoArray } from '../hooks/memo-array';
import { useDevToolsPlugins } from '../hooks/plugins';
import { parseApis, parseApiGraph, sortCompareApis } from '../utils/api';

export function useDevToolsApis(app: BackstageApp): DevToolApiWithPlugin[] {
  const { plugins, apiMap } = useDevToolsPlugins();

  const apis = useMemoArray(app.getApis());

  return useMemo(() => {
    const visitedSet = new Set<string>();

    const parsedApis = parseApiGraph([
      ...parseApis(apis),
      ...plugins.flatMap(plugin => plugin.parsedApis),
    ]);

    // First iterate all known APIs
    const ret = parsedApis.map((api): DevToolApiWithPlugin => {
      const plugin = apiMap.get(api.id);
      const devtoolApi: DevToolApiWithPlugin = {
        ...api,
        loaded: true,
        plugin,
      };
      visitedSet.add(devtoolApi.id);
      return devtoolApi;
    });

    ret.sort(sortCompareApis);

    // Then iterate all plugins to get their apis, if there such that aren't
    // loaded into the app
    // plugins.forEach(plugin => {
    //   plugin.apis.forEach(api => {
    //     if (!visitedSet.has(api.id)) {
    //       ret.push({
    //         ...api,
    //         plugin,
    //         loaded: false,
    //       });
    //     }
    //   });
    // });

    return ret;
  }, [plugins, apiMap, apis]);
}
