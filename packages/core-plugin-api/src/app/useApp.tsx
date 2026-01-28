/*
 * Copyright 2020 The Backstage Authors
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
import { useVersionedContext } from '@backstage/version-bridge';
import {
  appTreeApiRef,
  iconsApiRef,
  useApiHolder,
  ErrorDisplay,
  NotFoundErrorPage,
  Progress,
  createFrontendPlugin,
  FrontendPlugin,
  ApiHolder,
} from '@backstage/frontend-plugin-api';
import {
  AppComponents,
  IconComponent,
  BackstagePlugin,
} from '@backstage/core-plugin-api';
import { getOrCreateGlobalSingleton } from '@backstage/version-bridge';
import { AppContext as AppContextV1 } from './types';

const legacyPluginStore = getOrCreateGlobalSingleton(
  'legacy-plugin-compatibility-store',
  () => new WeakMap<FrontendPlugin, BackstagePlugin>(),
);

function toLegacyPlugin(plugin: FrontendPlugin): BackstagePlugin {
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
      return plugin.pluginId ?? plugin.id;
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

function toNewPlugin(plugin: BackstagePlugin): FrontendPlugin {
  return createFrontendPlugin({
    pluginId: plugin.getId(),
  });
}

function useOptionalApiHolder(): ApiHolder | undefined {
  try {
    return useApiHolder();
  } catch {
    return undefined;
  }
}

/**
 * React hook providing {@link AppContext}.
 *
 * @public
 */
export const useApp = (): AppContextV1 => {
  const apiHolder = useOptionalApiHolder();
  const appTreeApi = apiHolder?.get(appTreeApiRef);
  const iconsApi = apiHolder?.get(iconsApiRef);
  const versionedContext = useVersionedContext<{ 1: AppContextV1 }>(
    'app-context',
  );

  const newAppContext = useMemo<AppContextV1 | undefined>(() => {
    if (!appTreeApi) {
      return undefined;
    }

    if (!iconsApi) {
      return undefined;
    }

    const { tree } = appTreeApi.getTree();

    let gatheredPlugins: BackstagePlugin[] | undefined = undefined;

    const ErrorBoundaryFallbackWrapper: AppComponents['ErrorBoundaryFallback'] =
      ({ plugin, ...rest }) => (
        <ErrorDisplay {...rest} plugin={plugin && toNewPlugin(plugin)} />
      );

    return {
      getPlugins(): BackstagePlugin[] {
        if (gatheredPlugins) {
          return gatheredPlugins;
        }

        const pluginSet = new Set<BackstagePlugin>();
        for (const node of tree.nodes.values()) {
          const plugin = node.spec.plugin;
          if (plugin) {
            pluginSet.add(toLegacyPlugin(plugin));
          }
        }
        gatheredPlugins = Array.from(pluginSet);

        return gatheredPlugins;
      },

      getSystemIcon(key: string): IconComponent | undefined {
        return iconsApi.getIcon(key);
      },

      getSystemIcons(): Record<string, IconComponent> {
        return Object.fromEntries(
          iconsApi.listIconKeys().map(key => [key, iconsApi.getIcon(key)!]),
        );
      },

      getComponents(): AppComponents {
        return {
          NotFoundErrorPage: NotFoundErrorPage,
          BootErrorPage() {
            throw new Error(
              'The BootErrorPage app component should not be accessed by plugins',
            );
          },
          Progress: Progress,
          Router() {
            throw new Error(
              'The Router app component should not be accessed by plugins',
            );
          },
          ErrorBoundaryFallback: ErrorBoundaryFallbackWrapper,
        };
      },
    };
  }, [appTreeApi, iconsApi]);

  if (newAppContext) {
    return newAppContext;
  }

  if (!versionedContext) {
    throw new Error('App context is not available');
  }

  const appContext = versionedContext.atVersion(1);
  if (!appContext) {
    throw new Error('AppContext v1 not available');
  }
  return appContext;
};
