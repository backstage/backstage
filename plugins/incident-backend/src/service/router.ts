/*
 * Copyright 2023 The Backstage Authors
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
  PluginEndpointDiscovery,
  errorHandler,
} from '@backstage/backend-common';
import {
  PluginTaskScheduler,
  TaskScheduleDefinition,
} from '@backstage/backend-tasks';
import { CatalogClient } from '@backstage/catalog-client';
import { execFile } from 'child_process';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';

export interface PluginOptions {
  apiKey: string;
  endpoint: string;
  schedule?: TaskScheduleDefinition;
}

export interface RouterOptions {
  logger: Logger;
  discovery: PluginEndpointDiscovery;
  scheduler?: PluginTaskScheduler;
}

export async function createRouter(
  pluginOptions: PluginOptions,
  routerOptions: RouterOptions,
): Promise<express.Router> {
  const { apiKey, endpoint, schedule } = pluginOptions;
  const { logger, discovery, scheduler } = routerOptions;

  if (scheduler && schedule) {
    logger.info(
      `Scheduling sync of incident.io catalog with: ${JSON.stringify(
        schedule,
      )}`,
    );
    await scheduler.scheduleTask({
      id: 'incident_catalog_sync',
      frequency: schedule.frequency,
      timeout: schedule.timeout,
      initialDelay: schedule.initialDelay,
      scope: schedule.scope,
      fn: async () => {
        const catalogEndpoint = await discovery.getExternalBaseUrl('catalog');
        const args: string[] = [
          'backstage',
          '--api-endpoint',
          endpoint,
          '--backstage-endpoint',
          `${catalogEndpoint}/entities`,
        ];

        logger.info('Running catalog-importer', { args });
        const result = execFile('catalog-importer', args, {
          stdio: 'inherit',
          env: {
            INCIDENT_API_KEY: apiKey,
          },
        });

        if (result.exitCode !== 0) {
          logger.info(
            `Syncing with the catalog-importer failed with exit status: ${result.exitCode}`,
          );
        }
      },
    });
  }

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });
  router.use(errorHandler());
  return router;
}
