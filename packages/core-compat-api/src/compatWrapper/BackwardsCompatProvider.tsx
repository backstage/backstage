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
import { RouteResolver } from '../../../core-plugin-api/src/routing/useRouteRef';
import {
  createPlugin as createNewPlugin,
  BackstagePlugin as NewBackstagePlugin,
  appTreeApiRef,
  componentsApiRef,
  coreComponentRefs,
  iconsApiRef,
  useApi,
  routeResolutionApiRef,
} from '@backstage/frontend-plugin-api';
import {
  AppComponents,
  IconComponent,
  BackstagePlugin as LegacyBackstagePlugin,
  RouteRef,
} from '@backstage/core-plugin-api';
import {
  VersionedValue,
  createVersionedContext,
  createVersionedValueMap,
  getOrCreateGlobalSingleton,
} from '@backstage/version-bridge';
import { convertLegacyRouteRef } from '../convertLegacyRouteRef';

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

// TODO: Currently a very naive implementation, may need some more work
function toNewPlugin(plugin: LegacyBackstagePlugin): NewBackstagePlugin {
  return createNewPlugin({
    id: plugin.getId(),
  });
}

// Recreates the old AppContext APIs using the various new APIs that replaced it
function LegacyAppContextProvider(props: { children: ReactNode }) {
  const appTreeApi = useApi(appTreeApiRef);
  const componentsApi = useApi(componentsApiRef);
  const iconsApi = useApi(iconsApiRef);

  const appContext = useMemo(() => {
    const { tree } = appTreeApi.getTree();

    let gatheredPlugins: LegacyBackstagePlugin[] | undefined = undefined;

    const ErrorBoundaryFallback = componentsApi.getComponent(
      coreComponentRefs.errorBoundaryFallback,
    );
    const ErrorBoundaryFallbackWrapper: AppComponents['ErrorBoundaryFallback'] =
      ({ plugin, ...rest }) => (
        <ErrorBoundaryFallback
          {...rest}
          plugin={plugin && toNewPlugin(plugin)}
        />
      );

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
          NotFoundErrorPage: componentsApi.getComponent(
            coreComponentRefs.notFoundErrorPage,
          ),
          BootErrorPage() {
            throw new Error(
              'The BootErrorPage app component should not be accessed by plugins',
            );
          },
          Progress: componentsApi.getComponent(coreComponentRefs.progress),
          Router() {
            throw new Error(
              'The Router app component should not be accessed by plugins',
            );
          },
          ErrorBoundaryFallback: ErrorBoundaryFallbackWrapper,
        };
      },
    };
  }, [appTreeApi, componentsApi, iconsApi]);

  return (
    <AppContextProvider appContext={appContext}>
      {props.children}
    </AppContextProvider>
  );
}

const RoutingContext = createVersionedContext<{ 1: RouteResolver }>(
  'routing-context',
);

function LegacyRoutingProvider(props: { children: ReactNode }) {
  const routeResolutionApi = useApi(routeResolutionApiRef);

  const value = useMemo<VersionedValue<{ 1: RouteResolver }>>(() => {
    return createVersionedValueMap({
      1: {
        resolve(anyRouteRef, location) {
          const sourcePath =
            typeof location === 'string' ? location : location.pathname ?? '';

          return routeResolutionApi.resolve(
            // This removes the requirement to use convertLegacyRouteRef inside plugins, but
            // they still need to converted when passed to the plugin instance
            convertLegacyRouteRef(anyRouteRef as RouteRef),
            { sourcePath },
          );
        },
      },
    });
  }, [routeResolutionApi]);

  return (
    <RoutingContext.Provider value={value}>
      {props.children}
    </RoutingContext.Provider>
  );
}

export function BackwardsCompatProvider(props: { children: ReactNode }) {
  return (
    <LegacyRoutingProvider>
      <LegacyAppContextProvider>{props.children}</LegacyAppContextProvider>
    </LegacyRoutingProvider>
  );
}
