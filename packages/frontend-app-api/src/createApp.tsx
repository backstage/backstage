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

import React from 'react';
import { ConfigReader } from '@backstage/config';
import {
  BackstagePlugin,
  coreExtensionData,
} from '@backstage/frontend-plugin-api';
import { CoreRouter } from './extensions/CoreRouter';
import { Core } from './extensions/Core';
import {
  createExtensionInstance,
  ExtensionInstance,
} from './createExtensionInstance';
import {
  ExtensionInstanceParameters,
  mergeExtensionParameters,
  readAppExtensionParameters,
} from './wiring/parameters';
import { RoutingProvider } from './routing/RoutingContext';
import {
  ApiHolder,
  appThemeApiRef,
  ConfigApi,
  configApiRef,
  RouteRef,
} from '@backstage/core-plugin-api';
import { getAvailablePlugins } from './wiring/discovery';
import {
  ApiFactoryRegistry,
  ApiProvider,
  ApiResolver,
  AppThemeSelector,
} from '@backstage/core-app-api';

// TODO: Get rid of all of these
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppThemeProvider } from '../../core-app-api/src/app/AppThemeProvider';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { defaultConfigLoaderSync } from '../../core-app-api/src/app/defaultConfigLoader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { overrideBaseUrlConfigs } from '../../core-app-api/src/app/overrideBaseUrlConfigs';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { themes } from '../../app-defaults/src/defaults/themes';

/** @public */
export function createApp(options: {
  plugins: BackstagePlugin[];
  config?: ConfigApi;
}): {
  createRoot(): JSX.Element;
} {
  const appConfig =
    options?.config ??
    ConfigReader.fromConfigs(overrideBaseUrlConfigs(defaultConfigLoaderSync()));

  const builtinExtensions = [CoreRouter, Core];
  const discoveredPlugins = getAvailablePlugins();

  // pull in default extension instance from discovered packages
  // apply config to adjust default extension instances and add more
  const extensionParams = mergeExtensionParameters({
    sources: [...options.plugins, ...discoveredPlugins],
    builtinExtensions,
    parameters: readAppExtensionParameters(appConfig),
  });

  // TODO: validate the config of all extension instances
  // We do it at this point to ensure that merging (if any) of config has already happened

  // Create attachment map so that we can look attachments up during instance creation
  const attachmentMap = new Map<
    string,
    Map<string, ExtensionInstanceParameters[]>
  >();
  for (const instanceParams of extensionParams) {
    const [extensionId, pointId = 'default'] = instanceParams.at.split('/');

    let pointMap = attachmentMap.get(extensionId);
    if (!pointMap) {
      pointMap = new Map();
      attachmentMap.set(extensionId, pointMap);
    }

    let instances = pointMap.get(pointId);
    if (!instances) {
      instances = [];
      pointMap.set(pointId, instances);
    }

    instances.push(instanceParams);
  }

  const instances = new Map<string, ExtensionInstance>();

  function createInstance(
    instanceParams: ExtensionInstanceParameters,
  ): ExtensionInstance {
    const existingInstance = instances.get(instanceParams.extension.id);
    if (existingInstance) {
      return existingInstance;
    }

    const attachments = new Map(
      Array.from(
        attachmentMap.get(instanceParams.extension.id)?.entries() ?? [],
      ).map(([inputName, attachmentConfigs]) => [
        inputName,
        attachmentConfigs.map(createInstance),
      ]),
    );

    const newInstance = createExtensionInstance({
      extension: instanceParams.extension,
      source: instanceParams.source,
      config: instanceParams.config,
      attachments,
    });

    instances.set(instanceParams.extension.id, newInstance);

    return newInstance;
  }

  const rootConfigs = attachmentMap.get('root')?.get('default') ?? [];
  const rootInstances = rootConfigs.map(instanceParams =>
    createInstance(instanceParams),
  );

  const routePaths = extractRouteInfoFromInstanceTree(rootInstances);

  const coreInstance = rootInstances.find(({ id }) => id === 'core');
  if (!coreInstance) {
    throw Error('Unable to find core extension instance');
  }

  const apiHolder = createApiHolder(coreInstance, appConfig);

  return {
    createRoot() {
      const rootComponents = rootInstances
        .map(
          e =>
            e.data.get(
              coreExtensionData.reactComponent.id,
            ) as typeof coreExtensionData.reactComponent.T,
        )
        .filter(Boolean);
      return (
        <ApiProvider apis={apiHolder}>
          <AppThemeProvider>
            <RoutingProvider routePaths={routePaths}>
              {rootComponents.map((Component, i) => (
                <Component key={i} />
              ))}
            </RoutingProvider>
          </AppThemeProvider>
        </ApiProvider>
      );
    },
  };
}

function createApiHolder(
  coreExtension: ExtensionInstance,
  configApi: ConfigApi,
): ApiHolder {
  const factoryRegistry = new ApiFactoryRegistry();

  const apiFactories =
    coreExtension.attachments
      .get('apis')
      ?.map(
        e =>
          e.data.get(
            coreExtensionData.apiFactory.id,
          ) as typeof coreExtensionData.apiFactory.T,
      )
      .filter(Boolean) ?? [];

  for (const factory of apiFactories) {
    factoryRegistry.register('default', factory);
  }

  factoryRegistry.register('static', {
    api: appThemeApiRef,
    deps: {},
    // TODO: add extension for registering themes
    factory: () => AppThemeSelector.createWithStorage(themes),
  });

  factoryRegistry.register('static', {
    api: configApiRef,
    deps: {},
    factory: () => configApi,
  });

  ApiResolver.validateFactories(factoryRegistry, factoryRegistry.getAllApis());

  return new ApiResolver(factoryRegistry);
}

/** @internal */
export function extractRouteInfoFromInstanceTree(
  roots: ExtensionInstance[],
): Map<RouteRef, string> {
  const results = new Map<RouteRef, string>();

  function visit(current: ExtensionInstance, basePath: string) {
    const routePath = current.data.get(coreExtensionData.routePath.id) ?? '';
    const routeRef = current.data.get(
      coreExtensionData.routeRef.id,
    ) as RouteRef;

    // TODO: join paths in a more robust way
    const fullPath = basePath + routePath;
    if (routeRef) {
      const routeRefId = (routeRef as any).id; // TODO: properly
      if (routeRefId !== current.id) {
        throw new Error(
          `Route ref '${routeRefId}' must have the same ID as extension '${current.id}'`,
        );
      }
      results.set(routeRef, fullPath);
    }

    for (const children of current.attachments.values()) {
      for (const child of children) {
        visit(child, fullPath);
      }
    }
  }

  for (const root of roots) {
    visit(root, '');
  }
  return results;
}
