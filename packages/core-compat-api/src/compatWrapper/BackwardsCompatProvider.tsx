/*
 * Copyright 2023 The Backstage Authors
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

import React, { useMemo } from 'react';
import { ReactNode } from 'react';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppContextProvider } from '../../../core-app-api/src/app/AppContext';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  components as defaultComponents,
  icons as defaultIcons,
} from '../../../app-defaults/src/defaults';
import {
  BackstagePlugin as NewBackstagePlugin,
  appTreeApiRef,
  useApi,
} from '@backstage/frontend-plugin-api';
import {
  AppComponents,
  IconComponent,
  BackstagePlugin as LegacyBackstagePlugin,
} from '@backstage/core-plugin-api';
import { getOrCreateGlobalSingleton } from '@backstage/version-bridge';

// Make sure that we only convert each new plugin instance to its legacy equivalent once
const legacyPluginStore = getOrCreateGlobalSingleton(
  'legacy-plugin-compatibility-store',
  () => new WeakMap<NewBackstagePlugin, LegacyBackstagePlugin>(),
);

function toLegacyPlugin(plugin: NewBackstagePlugin): LegacyBackstagePlugin {
  let legacy = legacyPluginStore.get(plugin);
  if (legacy) {
    return legacy;
  }

  const errorMsg = 'Not implemented in legacy plugin compatibility layer';
  const notImplemented = () => {
    throw new Error(errorMsg);
  };

  legacy = {
    getId(): string {
      return plugin.id;
    },
    get routes() {
      return {};
    },
    get externalRoutes() {
      return {};
    },
    getApis: notImplemented,
    getFeatureFlags: notImplemented,
    provide: notImplemented,
  };

  legacyPluginStore.set(plugin, legacy);
  return legacy;
}

// Recreates the old AppContext APIs using the various new APIs that replaced it
function LegacyAppContextProvider(props: { children: ReactNode }) {
  const appTreeApi = useApi(appTreeApiRef);

  const appContext = useMemo(() => {
    const { tree } = appTreeApi.getTree();

    let gatheredPlugins: LegacyBackstagePlugin[] | undefined = undefined;

    return {
      getPlugins(): LegacyBackstagePlugin[] {
        if (gatheredPlugins) {
          return gatheredPlugins;
        }

        const pluginSet = new Set<LegacyBackstagePlugin>();
        for (const node of tree.nodes.values()) {
          const plugin = node.spec.source;
          if (plugin) {
            pluginSet.add(toLegacyPlugin(plugin));
          }
        }
        gatheredPlugins = Array.from(pluginSet);

        return gatheredPlugins;
      },

      // TODO: Grab these from new API once it exists
      getSystemIcon(key: string): IconComponent | undefined {
        return key in defaultIcons
          ? defaultIcons[key as keyof typeof defaultIcons]
          : undefined;
      },

      // TODO: Grab these from new API once it exists
      getSystemIcons(): Record<string, IconComponent> {
        return defaultIcons;
      },

      // TODO: Grab these from new API once it exists
      getComponents(): AppComponents {
        return defaultComponents;
      },
    };
  }, [appTreeApi]);

  return (
    <AppContextProvider appContext={appContext}>
      {props.children}
    </AppContextProvider>
  );
}

export function BackwardsCompatProvider(props: { children: ReactNode }) {
  return <LegacyAppContextProvider>{props.children}</LegacyAppContextProvider>;
}
