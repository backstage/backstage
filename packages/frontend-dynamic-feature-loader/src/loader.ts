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
import { Config } from '@backstage/config';
import {
  FRONTEND_MANIFEST_VERSION,
  FrontendFeatureManifest,
  OpaqueDeferredFrontendFeature,
} from '@internal/frontend';

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
      const deferredRemotes = readDeferredRemotesConfig(config);
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

                // A deferrable plugin is loaded once one of its pages or
                // elements is rendered, rather than before the app starts.
                const manifest = deferredRemotes.isDeferred(remote.packageName)
                  ? readDeferrableManifest(remote, exposedModuleName)
                  : undefined;
                if (manifest) {
                  return createDeferredFeature({
                    name: remote.packageName,
                    manifest,
                    remoteModuleName,
                    instance,
                  });
                }

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

const DEFERRED_REMOTES_KEY = 'app.experimental.deferredRemotes';

function readDeferredRemotesConfig(config: Config) {
  const value = config.getOptional(DEFERRED_REMOTES_KEY);
  if (value === undefined || value === false) {
    return { isDeferred: () => false };
  }
  const exclude =
    value === true
      ? []
      : config.getOptionalStringArray(`${DEFERRED_REMOTES_KEY}.exclude`) ?? [];
  return {
    isDeferred: (packageName: string) => !exclude.includes(packageName),
  };
}

/**
 * Returns the manifest of an exposed module if it is a plugin that can be
 * deferred. A manifest of an unknown version is ignored, which loads the
 * module before the app starts.
 */
function readDeferrableManifest(
  remote: Remote,
  exposedModuleName: string,
): FrontendFeatureManifest | undefined {
  const frontendManifest = remote.frontendManifest;
  if (frontendManifest?.manifestVersion !== FRONTEND_MANIFEST_VERSION) {
    return undefined;
  }
  const manifest = frontendManifest.exposedModules[exposedModuleName] as
    | Partial<FrontendFeatureManifest>
    | undefined;
  if (
    manifest?.manifestVersion !== FRONTEND_MANIFEST_VERSION ||
    manifest.type !== 'plugin' ||
    manifest.deferrable !== true
  ) {
    return undefined;
  }
  return manifest as FrontendFeatureManifest;
}

function createDeferredFeature(options: {
  name: string;
  manifest: FrontendFeatureManifest;
  remoteModuleName: string;
  instance: ModuleFederation;
}): FrontendFeature {
  const { remoteModuleName, instance } = options;
  // The app installs a stand-in for the plugin, which loads the remote
  // module the first time one of its pages or elements is rendered.
  return OpaqueDeferredFrontendFeature.createInstance('v1', {
    name: options.name,
    manifest: options.manifest,
    async load() {
      const module = await instance.loadRemote<Module>(remoteModuleName);
      if (!module) {
        throw new Error(
          `The remote module '${remoteModuleName}' of dynamic plugin '${options.name}' is empty`,
        );
      }
      return { default: module.default };
    },
  }) as unknown as FrontendFeature;
}
