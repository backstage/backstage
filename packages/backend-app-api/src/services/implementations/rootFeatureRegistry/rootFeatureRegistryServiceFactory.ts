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
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { DefaultRootFeatureRegistryService } from './DefaultRootFeatureRegistry';
import fetch from 'node-fetch';
import { HostDiscovery } from '../discovery';

/** @public */
export const rootFeatureRegistryServiceFactory = createServiceFactory({
  service: coreServices.rootFeatureRegistry,
  deps: {
    rootConfig: coreServices.rootConfig,
  },
  async factory({ rootConfig }) {
    const baseUrl = rootConfig.getString('backend.baseUrl');
    const gatewayUrl = rootConfig.getOptionalString('backend.gatewayUrl');
    const registry = new DefaultRootFeatureRegistryService();
    const discovery = HostDiscovery.fromConfig(rootConfig);

    if (gatewayUrl && baseUrl !== gatewayUrl) {
      const intervalId = setInterval(
        async () =>
          await new Promise(async (res, rej) => {
            const features = await registry.getFeatures();
            const pluginIds = new Set(features.map(e => e.pluginId));
            const pluginUrls: Record<
              string,
              { internal: string; external: string }
            > = {};
            for (const pluginId of pluginIds) {
              pluginUrls[pluginId] = {
                external: await discovery.getExternalBaseUrl(pluginId),
                internal: await discovery.getBaseUrl(pluginId),
              };
            }
            try {
              const response = await fetch(
                `${gatewayUrl}/api/discovery/install`,
                {
                  method: 'POST',
                  body: JSON.stringify(pluginUrls),
                  headers: {
                    'Content-Type': 'application/json',
                  },
                },
              );
              if (response.ok) {
                console.log('removing interval', response.statusText);
                clearInterval(intervalId);
              }
            } catch (err) {
              // skip network errors.
            }
            res();
          }),
        5000,
      );
    }
    return registry;
  },
});
