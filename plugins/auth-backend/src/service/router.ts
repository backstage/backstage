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

import {
  PluginDatabaseManager,
  PluginEndpointDiscovery,
  TokenManager,
} from '@backstage/backend-common';
import { CatalogClient } from '@backstage/catalog-client';
import { Config } from '@backstage/config';
import { assertError, NotFoundError } from '@backstage/errors';
import cookieParser from 'cookie-parser';
import express from 'express';
import Router from 'express-promise-router';
import session from 'express-session';
import { Minimatch } from 'minimatch';
import passport from 'passport';
import { Logger } from 'winston';
import { createOidcRouter, KeyStores, TokenFactory } from '../identity';
import { CatalogAuthResolverContext } from '../lib/resolvers';
import {
  AuthProviderFactory,
  defaultAuthProviderFactories,
} from '../providers';
import { getRedisClient } from './redisClient';

const RedisStore = require('connect-redis')(session);
const MemoryStore = require('memorystore')(session);

/** @public */
export type ProviderFactories = { [s: string]: AuthProviderFactory };

/** @public */
export interface RouterOptions {
  logger: Logger;
  database: PluginDatabaseManager;
  config: Config;
  discovery: PluginEndpointDiscovery;
  tokenManager: TokenManager;
  tokenFactoryAlgorithm?: string;
  providerFactories?: ProviderFactories;
}

/** @public */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const {
    logger,
    config,
    discovery,
    database,
    tokenManager,
    tokenFactoryAlgorithm,
    providerFactories,
  } = options;
  const router = Router();

  const appUrl = config.getString('app.baseUrl');
  const authUrl = await discovery.getExternalBaseUrl('auth');
  const cacheMemoryType = config.getString('backend.cache.store');
  let cacheStore = null;

  switch (cacheMemoryType) {
    case 'redis':
      {
        const redisClient = await getRedisClient({ config });
        cacheStore = new RedisStore({
          client: redisClient,
        });
      }
      break;

    case 'memory':
    default:
      cacheStore = new MemoryStore({
        checkPeriod: 60 * 60 * 1000, // prune expired entries every 1h
      });
      break;
  }

  const keyStore = await KeyStores.fromConfig(config, { logger, database });
  const keyDurationSeconds = 3600;

  const tokenIssuer = new TokenFactory({
    issuer: authUrl,
    keyStore,
    keyDurationSeconds,
    logger: logger.child({ component: 'token-factory' }),
    algorithm: tokenFactoryAlgorithm,
  });

  const catalogApi = new CatalogClient({ discoveryApi: discovery });

  const secret = config.getOptionalString('auth.session.secret');
  if (secret) {
    router.use(cookieParser(secret));
    // TODO: Configure the server-side session storage.  The default MemoryStore is not designed for production
    const enforceCookieSSL = authUrl.startsWith('https');
    router.use(
      session({
        store: cacheStore,
        secret,
        saveUninitialized: false,
        resave: false,
        cookie: { secure: enforceCookieSSL ? 'auto' : false },
      }),
    );
    router.use(passport.initialize());
    router.use(passport.session());
  } else {
    router.use(cookieParser());
  }
  router.use(express.urlencoded({ extended: false }));
  router.use(express.json());

  const allProviderFactories = {
    ...defaultAuthProviderFactories,
    ...providerFactories,
  };
  const providersConfig = config.getConfig('auth.providers');
  const configuredProviders = providersConfig.keys();

  const isOriginAllowed = createOriginFilter(config);

  for (const [providerId, providerFactory] of Object.entries(
    allProviderFactories,
  )) {
    if (configuredProviders.includes(providerId)) {
      logger.info(`Configuring provider, ${providerId}`);
      try {
        const provider = providerFactory({
          providerId,
          globalConfig: {
            baseUrl: authUrl,
            appUrl,
            isOriginAllowed,
          },
          config: providersConfig.getConfig(providerId),
          logger,
          resolverContext: CatalogAuthResolverContext.create({
            logger,
            catalogApi,
            tokenIssuer,
            tokenManager,
          }),
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
          r.post('/refresh', provider.refresh.bind(provider));
        }

        router.use(`/${providerId}`, r);
      } catch (e) {
        assertError(e);
        if (process.env.NODE_ENV !== 'development') {
          throw new Error(
            `Failed to initialize ${providerId} auth provider, ${e.message}`,
          );
        }

        logger.warn(`Skipping ${providerId} auth provider, ${e.message}`);

        router.use(`/${providerId}`, () => {
          // If the user added the provider under auth.providers but the clientId and clientSecret etc. were not found.
          throw new NotFoundError(
            `Auth provider registered for '${providerId}' is misconfigured. This could mean the configs under ` +
              `auth.providers.${providerId} are missing or the environment variables used are not defined. ` +
              `Check the auth backend plugin logs when the backend starts to see more details.`,
          );
        });
      }
    } else {
      router.use(`/${providerId}`, () => {
        throw new NotFoundError(
          `No auth provider registered for '${providerId}'`,
        );
      });
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
    throw new NotFoundError(`Unknown auth provider '${provider}'`);
  });

  return router;
}

/** @public */
export function createOriginFilter(
  config: Config,
): (origin: string) => boolean {
  const appUrl = config.getString('app.baseUrl');
  const { origin: appOrigin } = new URL(appUrl);

  const allowedOrigins = config.getOptionalStringArray(
    'auth.experimentalExtraAllowedOrigins',
  );

  const allowedOriginPatterns =
    allowedOrigins?.map(
      pattern => new Minimatch(pattern, { nocase: true, noglobstar: true }),
    ) ?? [];

  return origin => {
    if (origin === appOrigin) {
      return true;
    }
    return allowedOriginPatterns.some(pattern => pattern.match(origin));
  };
}
