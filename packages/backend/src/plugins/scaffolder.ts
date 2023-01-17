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

import { CatalogClient } from '@backstage/catalog-client';
import { ScmIntegrations } from '@backstage/integration';
import {
  createRouter,
  createTemplateAction,
  createBuiltinActions,
} from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });

  const defaultActions = createBuiltinActions({
    catalogClient,
    reader: env.reader,
    config: env.config,
    integrations: ScmIntegrations.fromConfig(env.config),
  });

  const delayAction = createTemplateAction({
    id: 'mock:delay',
    async handler(ctx) {
      const interval = setInterval(
        () => ctx.logger.info('Writing something', new Date().toISOString()),
        1000,
      );

      await new Promise(resolve => setTimeout(resolve, 5000));
      clearTimeout(interval);
    },
  });

  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    catalogClient: catalogClient,
    reader: env.reader,
    identity: env.identity,
    scheduler: env.scheduler,
    actions: [...defaultActions, delayAction],
  });
}
