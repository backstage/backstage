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

import express from 'express';
import Router from 'express-promise-router';
import cookieParser from 'cookie-parser';
import { LoggerService } from '@backstage/backend-plugin-api';
import {
  defaultAuthProviderFactories,
  AuthProviderFactory,
} from '../providers';
import {
  PluginDatabaseManager,
  PluginEndpointDiscovery,
  TokenManager,
} from '@backstage/backend-common';
import { assertError, NotFoundError } from '@backstage/errors';
import { CatalogApi, CatalogClient } from '@backstage/catalog-client';
import { createOidcRouter, TokenFactory, KeyStores } from '../identity';
import session from 'express-session';
import connectSessionKnex from 'connect-session-knex';
import passport from 'passport';
import { Minimatch } from 'minimatch';
import { CatalogAuthResolverContext } from '../lib/resolvers';
import { AuthDatabase } from '../database/AuthDatabase';
import { readBackstageTokenExpiration } from './readBackstageTokenExpiration';
import { TokenIssuer } from '../identity/types';
import { StaticTokenIssuer } from '../identity/StaticTokenIssuer';
import { StaticKeyStore } from '../identity/StaticKeyStore';
import { Config } from '@backstage/config';

/** @public */
export type ProviderFactories = { [s: string]: AuthProviderFactory };

/** @public */
export interface RouterOptions {
  logger: LoggerService;
  database: PluginDatabaseManager;
  config: Config;
  discovery: PluginEndpointDiscovery;
  tokenManager: TokenManager;
  tokenFactoryAlgorithm?: string;
  providerFactories?: ProviderFactories;
  disableDefaultProviderFactories?: boolean;
  catalogApi?: CatalogApi;
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
    providerFactories = {},
    catalogApi,
  } = options;
  const router = Router();

  const appUrl = config.getString('app.baseUrl');
  const authUrl = await discovery.getExternalBaseUrl('auth');
  const backstageTokenExpiration = readBackstageTokenExpiration(config);
  const authDb = AuthDatabase.create(database);

  const keyStore = await KeyStores.fromConfig(config, {
    logger,
    database: authDb,
  });

  let tokenIssuer: TokenIssuer;
  if (keyStore instanceof StaticKeyStore) {
    tokenIssuer = new StaticTokenIssuer(
      {
        logger: logger.child({ component: 'token-factory' }),
        issuer: authUrl,
        sessionExpirationSeconds: backstageTokenExpiration,
      },
      keyStore as StaticKeyStore,
    );
  } else {
    tokenIssuer = new TokenFactory({
      issuer: authUrl,
      keyStore,
      keyDurationSeconds: backstageTokenExpiration,
      logger: logger.child({ component: 'token-factory' }),
      algorithm:
        tokenFactoryAlgorithm ??
        config.getOptionalString('auth.identityTokenAlgorithm'),
    });
  }
  const secret = config.getOptionalString('auth.session.secret');
  if (secret) {
    router.use(cookieParser(secret));
    const enforceCookieSSL = authUrl.startsWith('https');
    const KnexSessionStore = connectSessionKnex(session);
    router.use(
      session({
        secret,
        saveUninitialized: false,
        resave: false,
        cookie: { secure: enforceCookieSSL ? 'auto' : false },
        store: new KnexSessionStore({
          createtable: false,
          knex: await authDb.get(),
        }),
      }),
    );
    router.use(passport.initialize());
    router.use(passport.session());
  } else {
    router.use(cookieParser());
  }
  router.use(express.urlencoded({ extended: false }));
  router.use(express.json());

  const allProviderFactories = options.disableDefaultProviderFactories
    ? providerFactories
    : {
        ...defaultAuthProviderFactories,
        ...providerFactories,
      };

  const providersConfig = config.getOptionalConfig('auth.providers');

  const isOriginAllowed = createOriginFilter(config);

  for (const [providerId, providerFactory] of Object.entries(
    allProviderFactories,
  )) {
    if (providersConfig?.has(providerId)) {
      logger.info(`Configuring auth provider: ${providerId}`);
      try {
        const provider = providerFactory({
          providerId,
          appUrl,
          baseUrl: authUrl,
          isOriginAllowed,
          globalConfig: {
            baseUrl: authUrl,
            appUrl,
            isOriginAllowed,
          },
          config: providersConfig.getConfig(providerId),
          logger,
          resolverContext: CatalogAuthResolverContext.create({
            logger,
            catalogApi:
              catalogApi ?? new CatalogClient({ discoveryApi: discovery }),
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
