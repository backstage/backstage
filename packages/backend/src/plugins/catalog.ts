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

import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { UnprocessedEntitiesModule } from '@backstage/plugin-catalog-backend-module-unprocessed';
import { AwsS3EntityProvider } from '@backstage/plugin-catalog-backend-module-aws';
import { BitbucketCloudEntityProvider } from '@backstage/plugin-catalog-backend-module-bitbucket-cloud';
import { CatalogClient } from '@backstage/catalog-client';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  builder.addProcessor(new ScaffolderEntitiesProcessor());

  // const demoProvider = new DemoEventBasedEntityProvider({
  //   logger: env.logger,
  //   topics: ['example'],
  //   eventBroker: env.eventBroker,
  // });
  builder.addEntityProvider(
    AwsS3EntityProvider.fromConfig(env.config, {
      logger: env.logger,
      // optional: alternatively, use scheduler with schedule defined in app-config.yaml
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 30 },
        timeout: { minutes: 3 },
      }),
      // optional: alternatively, use schedule
      scheduler: env.scheduler,
    }),
  );
  const bitbucketCloudProvider = BitbucketCloudEntityProvider.fromConfig(
    env.config,
    {
      catalogApi: new CatalogClient({ discoveryApi: env.discovery }),
      logger: env.logger,
      scheduler: env.scheduler,
      tokenManager: env.tokenManager,
    },
  );
  env.eventBroker.subscribe(bitbucketCloudProvider);
  builder.addEntityProvider(bitbucketCloudProvider);
  const { processingEngine, router } = await builder.build();

  const unprocessed = new UnprocessedEntitiesModule(
    await env.database.getClient(),
    router,
  );
  unprocessed.registerRoutes();
  await processingEngine.start();
  return router;
}
