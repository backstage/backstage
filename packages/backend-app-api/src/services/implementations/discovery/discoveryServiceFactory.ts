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

import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import Router from 'express-promise-router';
import { SplitBackendHostDiscovery } from './SplitBackendHostDiscovery';
import { json } from 'express';

/** @public */
export const discoveryServiceFactory = createServiceFactory({
  service: coreServices.discovery,
  deps: {
    config: coreServices.rootConfig,
    rootFeatureRegistry: coreServices.rootFeatureRegistry,
    rootHttpRouter: coreServices.rootHttpRouter,
  },
  async factory({ config, rootFeatureRegistry, rootHttpRouter }) {
    const router = Router();
    const discovery = SplitBackendHostDiscovery.fromConfig(config, {
      rootFeatureRegistry,
    });

    if (discovery.isGateway) {
      router.post('/install', json(), (req, res) => {
        console.log(req.body);
        const plugins = req.body as Record<
          string,
          { external: string; internal: string }
        >;
        discovery.addPlugins(plugins);
        res.send().status(200);
      });
      router.get('/installed', (_, res) => {
        res.json(discovery.plugins);
      });
      router.get('/:pluginId', async (req, res) => {
        const { pluginId } = req.params;
        res.json({
          baseUrl: await discovery.getBaseUrl(pluginId),
          externalBaseUrl: await discovery.getExternalBaseUrl(pluginId),
        });
      });
      rootHttpRouter.use('/api/discovery', router);
    }
    return discovery;
  },
});
