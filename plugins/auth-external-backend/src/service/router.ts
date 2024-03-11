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
  createLegacyAuthAdapters,
  errorHandler,
} from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Config } from '@backstage/config';
import {
  AuthService,
  BackstageCredentials,
  BackstageServicePrincipal,
  DiscoveryService,
  LoggerService,
} from '@backstage/backend-plugin-api';

/**
 * @public
 */
export interface RouterOptions {
  logger: LoggerService;
  config: Config;
  discovery: DiscoveryService;
  auth?: AuthService;
}

/**
 * @public
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;
  const { auth } = createLegacyAuthAdapters(options);

  const router = Router();
  router.use(express.json());

  const allowedCallers = config.getOptionalConfigArray('auth.external') ?? [];

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/token/:pluginId', async (request, response) => {
    const apiKey = request.get('X-Api-Key');
    if (!apiKey) {
      response.status(401).send();
      return;
    }

    const caller = allowedCallers.find(c => c.getString('apiKey') === apiKey);
    if (!caller) {
      response.status(401).send();
      return;
    }

    const { pluginId } = request.params;
    const allowedPlugins = caller.getOptionalStringArray('allowedPlugins');
    if (allowedPlugins && allowedPlugins.length > 0) {
      if (!allowedPlugins.includes(pluginId)) {
        response.status(401).send();
        return;
      }
    }

    const credentials: BackstageCredentials<BackstageServicePrincipal> = {
      $$type: '@backstage/BackstageCredentials',
      principal: {
        type: 'service',
        subject: `external:${caller.getString('name')}`,
      },
    };

    const { token } = await auth.getPluginRequestToken({
      onBehalfOf: credentials,
      targetPluginId: pluginId,
    });

    response.status(200).send({ token });
  });

  router.use(errorHandler());
  return router;
}
