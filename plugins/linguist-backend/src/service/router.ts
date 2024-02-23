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
  createLegacyAuthAdapters,
  errorHandler,
  PluginDatabaseManager,
  PluginEndpointDiscovery,
  TokenManager,
  UrlReader,
} from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { LinguistBackendApi } from '../api';
import { LinguistBackendDatabase } from '../db';
import {
  PluginTaskScheduler,
  readTaskScheduleDefinitionFromConfig,
  TaskScheduleDefinition,
} from '@backstage/backend-tasks';
import { HumanDuration } from '@backstage/types';
import { CatalogClient } from '@backstage/catalog-client';
import { LinguistBackendClient } from '../api/LinguistBackendClient';
import { Config } from '@backstage/config';
import { AuthService, HttpAuthService } from '@backstage/backend-plugin-api';

/** @public */
export interface PluginOptions {
  schedule?: TaskScheduleDefinition;
  age?: HumanDuration;
  batchSize?: number;
  useSourceLocation?: boolean;
  linguistJsOptions?: Record<string, unknown>;
  kind?: string[];
}

/** @public */
export interface RouterOptions {
  linguistBackendApi?: LinguistBackendApi;
  logger: Logger;
  reader: UrlReader;
  tokenManager: TokenManager;
  database: PluginDatabaseManager;
  discovery: PluginEndpointDiscovery;
  scheduler?: PluginTaskScheduler;
  config?: Config;
  auth?: AuthService;
  httpAuth?: HttpAuthService;
}

/** @public */
export async function createRouter(
  pluginOptions: PluginOptions,
  routerOptions: RouterOptions,
): Promise<express.Router> {
  const { logger, reader, database, discovery, scheduler, tokenManager, auth } =
    routerOptions;

  const {
    schedule,
    age,
    batchSize,
    useSourceLocation,
    kind,
    linguistJsOptions,
  } = pluginOptions;

  const linguistBackendStore = await LinguistBackendDatabase.create(
    await database.getClient(),
  );

  const catalogClient = new CatalogClient({ discoveryApi: discovery });

  const { auth: adaptedAuth } = createLegacyAuthAdapters({
    auth,
    tokenManager: tokenManager,
    discovery: discovery,
  });

  const linguistBackendClient =
    routerOptions.linguistBackendApi ||
    new LinguistBackendClient(
      logger,
      linguistBackendStore,
      reader,
      adaptedAuth,
      catalogClient,
      age,
      batchSize,
      useSourceLocation,
      kind,
      linguistJsOptions,
    );

  if (scheduler && schedule) {
    logger.info(
      `Scheduling processing of entities with: ${JSON.stringify(schedule)}`,
    );
    await scheduler.scheduleTask({
      id: 'linguist_process_entities',
      frequency: schedule.frequency,
      timeout: schedule.timeout,
      initialDelay: schedule.initialDelay,
      scope: schedule.scope,
      fn: async () => {
        await linguistBackendClient.processEntities();
      },
    });
  }

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    response.send({ status: 'ok' });
  });

  /**
   * /entity-languages?entity=component:default/my-component
   */
  router.get('/entity-languages', async (req, res) => {
    const { entityRef: entityRef } = req.query;

    if (!entityRef) {
      throw new Error('No entityRef was provided');
    }

    const entityLanguages = await linguistBackendClient.getEntityLanguages(
      entityRef as string,
    );
    res.status(200).json(entityLanguages);
  });

  router.use(errorHandler());
  return router;
}

/** @public */
export async function createRouterFromConfig(routerOptions: RouterOptions) {
  const { config } = routerOptions;
  const pluginOptions: PluginOptions = {};
  if (config) {
    if (config.has('linguist.schedule')) {
      pluginOptions.schedule = readTaskScheduleDefinitionFromConfig(
        config.getConfig('linguist.schedule'),
      );
    }
    pluginOptions.batchSize = config.getOptionalNumber('linguist.batchSize');
    pluginOptions.useSourceLocation =
      config.getOptionalBoolean('linguist.useSourceLocation') ?? false;
    pluginOptions.age = config.getOptionalConfig('linguist.age') as
      | HumanDuration
      | undefined;
    pluginOptions.kind = config.getOptionalStringArray('linguist.kind');
    pluginOptions.linguistJsOptions = config.getOptionalConfig(
      'linguist.linguistJsOptions',
    );
  }
  return createRouter(pluginOptions, routerOptions);
}
