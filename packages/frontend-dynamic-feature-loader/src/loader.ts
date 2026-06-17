/*
 * Copyright 2024 The Backstage Authors
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

import {
  ModuleFederationRuntimePlugin,
  createInstance,
  ModuleFederation,
} from '@module-federation/enhanced/runtime';
import { Module } from '@module-federation/sdk';
import { DefaultApiClient, Remote } from './schema/openapi';
import {
  FrontendFeature,
  FrontendFeatureLoader,
  createFrontendFeatureLoader,
} from '@backstage/frontend-plugin-api';
import { ShareStrategy, UserOptions } from '@module-federation/runtime/types';
import { loadModuleFederationHostShared } from '@backstage/module-federation-common';

/**
 *
 * @public
 */
export type DynamicFrontendFeaturesLoaderOptions = {
  /**
   * Additional module federation arguments for the Module Federation runtime initialization.
   */
  moduleFederation: {
    shared?: UserOptions['shared'];
    shareStrategy?: ShareStrategy;
    plugins?: Array<ModuleFederationRuntimePlugin>;
    instance?: ModuleFederation;
  };
};

/**
 * A function providing a loader of frontend features exposed as module federation remotes
 * from the backend dynamic features service.
 *
 * @public
 */
export function dynamicFrontendFeaturesLoader(
  options?: DynamicFrontendFeaturesLoaderOptions,
): FrontendFeatureLoader {
  return createFrontendFeatureLoader({
    async loader({ config }) {
      const dynamicPLuginsConfig = config.getOptionalConfig('dynamicPlugins');
      if (!dynamicPLuginsConfig) {
        return [];
      }

      function error(message: string, err: unknown) {
        // eslint-disable-next-line no-console
        console.error(
          `${message}: ${
            err instanceof Error ? err.toString() : JSON.stringify(err)
          }`,
        );
      }

      const backendBaseUrl = config.getString('backend.baseUrl');

      const appPackageName =
        config.getOptionalString('app.packageName') ?? 'app';
      let frontendPluginRemotes: Array<Remote>;
      try {
        const apiClient = new DefaultApiClient({
          discoveryApi: {
            getBaseUrl: async rootPath => `${backendBaseUrl}/${rootPath}`,
          },
          fetchApi: {
            fetch(input) {
              return global.fetch(input);
            },
          },
        });

        const response = await apiClient.getRemotes({});
        if (!response.ok) {
          throw new Error(`${response.status} - ${response.statusText}`);
        }
        frontendPluginRemotes = await response.json();
      } catch (err) {
        error(
          `Failed fetching module federation configuration of dynamic frontend plugins`,
          err,
        );
        return [];
      }

      let instance: ModuleFederation;
      try {
        if (options?.moduleFederation?.instance) {
          instance = options.moduleFederation.instance;
        } else {
          const shared = await loadModuleFederationHostShared({
            onError: err => error(err.message, err.cause),
          });

          const createOptions: UserOptions = {
            name: appPackageName
              .replaceAll('@', '')
              .replaceAll('/', '__')
              .replaceAll('-', '_'),
            shared,
            remotes: [],
          };
          if (options?.moduleFederation?.shareStrategy) {
            createOptions.shareStrategy =
              options.moduleFederation.shareStrategy;
          }
          instance = createInstance(createOptions);
        }

        const userOptions: UserOptions = {
          name: instance.name,
          remotes: [],
        };

        if (options?.moduleFederation?.plugins) {
          userOptions.plugins = options.moduleFederation.plugins;
        }
        if (options?.moduleFederation?.shareStrategy) {
          userOptions.shareStrategy = options.moduleFederation.shareStrategy;
        }
        if (options?.moduleFederation?.shared) {
          userOptions.shared = options.moduleFederation.shared;
        }
        userOptions.remotes = frontendPluginRemotes.map(remote => ({
          alias: remote.packageName,
          ...remote.remoteInfo,
        }));
        instance.initOptions(userOptions);
      } catch (err) {
        error(`Failed initializing module federation`, err);
        return [];
      }

      const features = (
        await Promise.all(
          frontendPluginRemotes.map(async remote => {
            // eslint-disable-next-line no-console
            console.debug(
              `Loading dynamic plugin '${remote.packageName}' from '${remote.remoteInfo.entry}'`,
            );

            const moduleFeatures = await Promise.all(
              remote.exposedModules.map(async exposedModuleName => {
                const remoteModuleName =
                  exposedModuleName === '.'
                    ? remote.remoteInfo.name
                    : `${remote.remoteInfo.name}/${exposedModuleName}`;
                let module: Module;
                try {
                  module = await instance.loadRemote<Module>(remoteModuleName);
                } catch (err) {
                  error(
                    `Failed loading remote module '${remoteModuleName}' of dynamic plugin '${remote.packageName}'`,
                    err,
                  );
                  return undefined;
                }
                if (!module) {
                  // eslint-disable-next-line no-console
                  console.warn(
                    `Skipping empty dynamic plugin remote module '${remoteModuleName}'.`,
                  );
                  return undefined;
                }
                // eslint-disable-next-line no-console
                console.info(
                  `Remote module '${remoteModuleName}' of dynamic plugin '${remote.packageName}' loaded from ${remote.remoteInfo.entry}`,
                );
                const defaultEntry = module.default;
                if (!isLoadable(defaultEntry)) {
                  // eslint-disable-next-line no-console
                  console.debug(
                    `Skipping dynamic plugin remote module '${remote}' since it doesn't export a new 'FrontendFeature' as default export.`,
                  );
                  return undefined;
                }
                return defaultEntry;
              }),
            );
            return moduleFeatures;
          }),
        )
      )
        .flat()
        .filter((feature): feature is FrontendFeature => feature !== undefined);

      return [...features];
    },
  });
}

function isLoadable(obj: unknown): obj is FrontendFeature {
  if (obj !== null && typeof obj === 'object' && '$$type' in obj) {
    return (
      obj.$$type === '@backstage/FrontendPlugin' ||
      obj.$$type === '@backstage/FrontendModule'
    );
  }
  return false;
}
