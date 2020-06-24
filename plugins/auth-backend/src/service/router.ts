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
import bodyParser from 'body-parser';
import Knex from 'knex';
import { Logger } from 'winston';
import { createAuthProviderRouter } from '../providers';
import { Config } from '@backstage/config';
import { DatabaseKeyStore, TokenFactory, createOidcRouter } from '../identity';

export interface RouterOptions {
  logger: Logger;
  database: Knex;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = Router();
  const logger = options.logger.child({ plugin: 'auth' });

  const baseUrl = `${options.config.getString('backend.baseUrl')}/auth`;
  const keyDurationSeconds = 3600;

  const keyStore = await DatabaseKeyStore.create({
    database: options.database,
  });
  const tokenIssuer = new TokenFactory({
    issuer: baseUrl,
    keyStore,
    keyDurationSeconds,
    logger: logger.child({ component: 'token-factory' }),
  });

  router.use(cookieParser());
  router.use(bodyParser.urlencoded({ extended: false }));
  router.use(bodyParser.json());

  // TODO: read from app config
  const config = {
    backend: {
      baseUrl: options.config.getString('backend.baseUrl'),
    },
    auth: {
      providers: {
        google: {
          development: {
            appOrigin: 'http://localhost:3000',
            secure: false,
            clientId: process.env.AUTH_GOOGLE_CLIENT_ID!,
            clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
          },
        },
        github: {
          development: {
            appOrigin: 'http://localhost:3000',
            secure: false,
            clientId: process.env.AUTH_GITHUB_CLIENT_ID!,
            clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET!,
          },
        },
        saml: {
          development: {
            entryPoint: 'http://localhost:7001/',
            issuer: 'passport-saml',
          },
        },
      },
    },
  };

  const providerConfigs = config.auth.providers;

  for (const [providerId, providerConfig] of Object.entries(providerConfigs)) {
    logger.info(`Configuring provider, ${providerId}`);
    try {
      const providerRouter = createAuthProviderRouter(
        providerId,
        { baseUrl },
        providerConfig,
        logger,
        tokenIssuer,
      );
      router.use(`/${providerId}`, providerRouter);
    } catch (e) {
      logger.error(e.message);
    }
  }

  router.use(
    createOidcRouter({
      tokenIssuer,
      baseUrl,
    }),
  );

  return router;
}
