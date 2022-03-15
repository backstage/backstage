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
import {
  LogEntry,
  PluginInfo,
  PluginContext,
} from '@backstage/core-plugin-api';
import { useDevToolsPlugins, DevToolPlugin } from '@backstage/plugin-devtools';
import { cleanOwnerEntityRef } from '../utils/owner-entity-ref';

/**
 * Returns the owners (as catalog entity refs) of the plugins in the context
 * stack of the log entry
 */
export function useLogEntryOwners(entry: LogEntry | undefined): string[] {
  const { apiMap } = useDevToolsPlugins();

  return useMemo(() => {
    const { contextStack = [] } = entry ?? {};

    const pluginInfos = [
      ...new Set(
        contextStack.flatMap(({ dependent, pluginStack }) => [
          ...pluginInfosByApi(apiMap, dependent?.id),
          ...pluginInfosByPlugins(pluginStack),
        ]),
      ),
    ];

    return pluginInfos
      .map(info => info.ownerEntityRef)
      .filter((v): v is NonNullable<typeof v> => !!v)
      .map(ownerEntityRef => cleanOwnerEntityRef(ownerEntityRef));
  }, [entry, apiMap]);
}

/**
 * Returns the owner as a catalog entity ref of the _last_ plugin in the context
 * stack of the log entry. This is the plugin that is ultimately responsible for
 * the log entry.
 */
export function useLogEntryFinalOwner(
  entry: LogEntry | undefined,
): string | undefined {
  const owners = useLogEntryOwners(entry);
  return owners.length === 0 ? undefined : owners[owners.length - 1];
}

function pluginInfosByApi(
  apiMap: Map<string, DevToolPlugin>,
  apiId: string | undefined,
): PluginInfo[] {
  if (!apiId) return [];

  const info = apiMap.get(apiId)?.plugin.info;
  return info ? [info] : [];
}

function pluginInfosByPlugins(
  plugins: PluginContext[] | undefined,
): PluginInfo[] {
  return !plugins ? [] : plugins.map(({ plugin }) => plugin.info);
}
