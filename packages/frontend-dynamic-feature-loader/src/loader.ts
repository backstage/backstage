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
import { Manifest } from '@module-federation/sdk';
import { DefaultApiClient } from './schema/openapi';
import { FrontendHostDiscovery } from '@backstage/core-app-api';

/**
 * A loader of frontend features exposed as module federation remotes
 * from the backend dynamic features service.
 *
 * @public
 */
export const dynamicFrontendFeaturesLoader: CreateAppFeatureLoader = {
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

    const appPackageName = config.getOptionalString('app.packageName') ?? 'app';
    try {
      const apiClient = new DefaultApiClient({
        discoveryApi: FrontendHostDiscovery.fromConfig(config),
        fetchApi: {
          fetch(input) {
            return global.fetch(input);
          },
        },
      });

      const frontendPluginManifests: {
        [key: string]: string;
      } = await (await apiClient.getManifests({})).json();

      init({
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

      const features = (
        await Promise.all(
          Object.entries(frontendPluginManifests).map(
            async ([name, manifestLocation]) => {
              // eslint-disable-next-line no-console
              console.info(
                `Loading dynamic plugin '${name}' from '${manifestLocation}'`,
              );
              const manifest = (await (
                await fetch(manifestLocation)
              ).json()) as Manifest;

              const moduleFeatures = await Promise.all(
                manifest.exposes.map(async expose => {
                  const remote =
                    expose.name === '.' ? name : `${name}/${expose.name}`;
                  const module = await loadRemote<any>(remote);
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
              return moduleFeatures.filter(
                (feature): feature is FrontendFeature => feature !== undefined,
              );
            },
          ),
        )
      ).flat();

      return { features };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(
        `Failed to fetch module federation configuration of dynamic frontend plugins: ${JSON.stringify(
          err,
        )}`,
      );
      return { features: [] };
    }
  },
};
