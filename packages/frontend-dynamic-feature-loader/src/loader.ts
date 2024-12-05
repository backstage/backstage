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

import { FrontendFeature } from '@backstage/frontend-app-api';
import {
  CreateAppFeatureLoader,
  isBackstageFeature,
} from '@backstage/frontend-defaults';
import { init, loadRemote } from '@module-federation/enhanced/runtime';
import { Manifest, Module } from '@module-federation/sdk';
import { DefaultApiClient } from './schema/openapi';
import { FrontendHostDiscovery } from '@backstage/core-app-api';

/**
 *
 * @public
 */
export type DynamicFrontendFeaturesLoaderOptions = {
  /**
   * Additional module federation arguments for the Module Federation runtime initialization.
   */
  moduleFederation: Omit<Parameters<typeof init>[0], 'name' | 'remotes'>;
};

/**
 * A function providing a loader of frontend features exposed as module federation remotes
 * from the backend dynamic features service.
 *
 * @public
 */
export function dynamicFrontendFeaturesLoader(
  options?: DynamicFrontendFeaturesLoaderOptions,
): CreateAppFeatureLoader {
  return {
    getLoaderName() {
      return 'dynamic-plugins-loader';
    },

    async load({ config }) {
      const dynamicPLuginsConfig = config.getOptionalConfig('dynamicPlugins');
      if (!dynamicPLuginsConfig) {
        return {
          features: [],
        };
      }

      function error(message: string, err: unknown) {
        // eslint-disable-next-line no-console
        console.error(
          `${message}: ${
            err instanceof Error ? err.toString() : JSON.stringify(err)
          }`,
        );
      }

      const appPackageName =
        config.getOptionalString('app.packageName') ?? 'app';
      let frontendPluginManifests: {
        [key: string]: string;
      };
      try {
        const apiClient = new DefaultApiClient({
          discoveryApi: FrontendHostDiscovery.fromConfig(config),
          fetchApi: {
            fetch(input) {
              return global.fetch(input);
            },
          },
        });

        const response = await apiClient.getManifests({});
        if (!response.ok) {
          throw new Error(`${response.status} - ${response.statusText}`);
        }
        frontendPluginManifests = await response.json();
        if (typeof frontendPluginManifests !== 'object') {
          throw new Error(`Invalid Json content: should be a Json object`);
        }
      } catch (err) {
        error(
          `Failed fetching module federation configuration of dynamic frontend plugins`,
          err,
        );
        return { features: [] };
      }

      try {
        init({
          ...options?.moduleFederation,
          name: appPackageName
            .replaceAll('@', '')
            .replaceAll('/', '__')
            .replaceAll('-', '_'),
          remotes: Object.entries(frontendPluginManifests).map(
            ([name, manifestLocation]) => ({
              name: name,
              entry: manifestLocation,
            }),
          ),
        });
      } catch (err) {
        error(`Failed initializing module federation`, err);
        return { features: [] };
      }

      const features = (
        await Promise.all(
          Object.entries(frontendPluginManifests).map(
            async ([name, manifestLocation]) => {
              // eslint-disable-next-line no-console
              console.info(
                `Loading dynamic plugin '${name}' from '${manifestLocation}'`,
              );
              let manifest: Manifest;
              try {
                const response = await fetch(manifestLocation);
                if (!response.ok) {
                  throw new Error(
                    `${response.status} - ${response.statusText}`,
                  );
                }
                manifest = await response.json();
                if (typeof manifest !== 'object') {
                  throw new Error(
                    `Invalid Json content: should be a Json object`,
                  );
                }
              } catch (err) {
                error(
                  `Failed fetching module federation manifest from '${manifestLocation}'`,
                  err,
                );
                return undefined;
              }

              const moduleFeatures = await Promise.all(
                manifest.exposes.map(async expose => {
                  const remote =
                    expose.name === '.' ? name : `${name}/${expose.name}`;
                  let module: Module;
                  try {
                    module = await loadRemote<Module>(remote);
                  } catch (err) {
                    error(
                      `Failed loading dynamic plugin remote module '${remote}'`,
                      err,
                    );
                    return undefined;
                  }
                  if (!module) {
                    // eslint-disable-next-line no-console
                    console.warn(
                      `Skipping empty dynamic plugin remote module '${remote}'.`,
                    );
                    return undefined;
                  }
                  // eslint-disable-next-line no-console
                  console.info(
                    `Dynamic plugin remote module '${remote}' loaded from ${manifestLocation}`,
                  );
                  const defaultEntry = module.default;
                  if (!isBackstageFeature(defaultEntry)) {
                    // eslint-disable-next-line no-console
                    console.warn(
                      `Skipping dynamic plugin remote module '${remote}' since it doesn't export a new 'FrontendFeature' as default export.`,
                    );
                    return undefined;
                  }
                  return defaultEntry;
                }),
              );
              return moduleFeatures;
            },
          ),
        )
      )
        .flat()
        .filter((feature): feature is FrontendFeature => feature !== undefined);

      return { features };
    },
  };
}
