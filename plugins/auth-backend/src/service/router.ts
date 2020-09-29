/*
 * Copyright 2020 Spotify AB
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

import express from 'express';
import Router from 'express-promise-router';
import cookieParser from 'cookie-parser';
import Knex from 'knex';
import { Logger } from 'winston';
import { createAuthProvider } from '../providers';
import { Config } from '@backstage/config';
import { DatabaseKeyStore, TokenFactory, createOidcRouter } from '../identity';
import {
  NotFoundError,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';

export interface RouterOptions {
  logger: Logger;
  database: Knex;
  config: Config;
  discovery: PluginEndpointDiscovery;
}

export async function createRouter({
  logger,
  config,
  discovery,
  database,
}: RouterOptions): Promise<express.Router> {
  const router = Router();

  const appUrl = config.getString('app.baseUrl');
  const authUrl = await discovery.getExternalBaseUrl('auth');

  const keyDurationSeconds = 3600;

  const keyStore = await DatabaseKeyStore.create({ database });
  const tokenIssuer = new TokenFactory({
    issuer: authUrl,
    keyStore,
    keyDurationSeconds,
    logger: logger.child({ component: 'token-factory' }),
  });

  router.use(cookieParser());
  router.use(express.urlencoded({ extended: false }));
  router.use(express.json());

  const providersConfig = config.getConfig('auth.providers');
  const providers = providersConfig.keys();

  for (const providerId of providers) {
    logger.info(`Configuring provider, ${providerId}`);
    try {
      const provider = createAuthProvider(providerId, {
        globalConfig: { baseUrl: authUrl, appUrl },
        config: providersConfig.getConfig(providerId),
        logger,
        tokenIssuer,
        discovery,
      });

      const r = Router();

      r.get('/start', provider.start.bind(provider));
      r.get('/handler/frame', provider.frameHandler.bind(provider));
      r.post('/handler/frame', provider.frameHandler.bind(provider));
      if (provider.logout) {
        r.post('/logout', provider.logout.bind(provider));
      }
      if (provider.refresh) {
        r.get('/refresh', provider.refresh.bind(provider));
      }

      router.use(`/${providerId}`, r);
    } catch (e) {
      if (process.env.NODE_ENV !== 'development') {
        throw new Error(
          `Failed to initialize ${providerId} auth provider, ${e.message}`,
        );
      }

      logger.warn(`Skipping ${providerId} auth provider, ${e.message}`);
    }
  }

  router.use(
    createOidcRouter({
      tokenIssuer,
      baseUrl: authUrl,
    }),
  );

  router.use('/:provider/', req => {
    const { provider } = req.params;
    throw new NotFoundError(`No auth provider registered for '${provider}'`);
  });

  return router;
}
