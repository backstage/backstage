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
import { EntityProvider } from '@backstage/plugin-catalog-node';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

import { ConflictHandlerOptions } from '@backstage/plugin-catalog-backend';
import { Knex } from 'knex';
import { GithubEntityProvider } from '@backstage/plugin-catalog-backend-module-github';
import { Entity, stringifyEntityRef } from '@backstage/plugin-catalog-model';

export default async function createPlugin(
  env: PluginEnvironment,
  providers?: Array<EntityProvider>,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  const githubEntityProviders = GithubEntityProvider.fromConfig(env.config, {
    logger: env.logger,
    // optional: alternatively, use scheduler with schedule defined in app-config.yaml
    schedule: env.scheduler.createScheduledTaskRunner({
      frequency: { minutes: 5 },
      timeout: { minutes: 3 },
    }),
    // optional: alternatively, use schedule
    scheduler: env.scheduler,
  });
  builder.addEntityProvider(githubEntityProviders);
  builder.addProcessor(new ScaffolderEntitiesProcessor());
  builder.addEntityProvider(providers ?? []);
  const conflictHandler = async (options: ConflictHandlerOptions) => {
    options.logger.info('Handling conflict with custom overwite handler');

    const dbClient = await env.database.getClient();
    async function overwriteEntity(params: {
      db: Knex;
      entity: Entity;
      hash: string;
      originalLocationKey: string;
      newLocationKey: string;
    }): Promise<void> {
      const { db, entity, hash, originalLocationKey, newLocationKey } = params;

      const entityRef = stringifyEntityRef(entity);
      const serializedEntity = JSON.stringify(entity);
      const now = db.fn.now();

      await db('refresh_state')
        .update({
          unprocessed_entity: serializedEntity,
          unprocessed_hash: hash,
          location_key: newLocationKey,
          last_discovery_at: now,
          next_update_at: now,
        })
        .where('entity_ref', entityRef)
        .where('location_key', originalLocationKey);
    }

    return await overwriteEntity({
      db: dbClient,
      entity: options.entity,
      hash: options.hash,
      newLocationKey: options.newLocationKey,
      originalLocationKey: options.originalLocationKey,
    });
  };
  const { processingEngine, router } = await builder.build(conflictHandler);
  await processingEngine.start();
  return router;
}
