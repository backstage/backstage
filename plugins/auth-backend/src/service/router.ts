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
import {
  AuthService,
  DatabaseService,
  DiscoveryService,
  LoggerService,
  RootConfigService,
  SchedulerService,
} from '@backstage/backend-plugin-api';
import { AuthOwnershipResolver } from '@backstage/plugin-auth-node';
import { CatalogService } from '@backstage/plugin-catalog-node';
import { NotFoundError } from '@backstage/errors';
import { KeyStores } from '../identity/KeyStores';
import { TokenFactory } from '../identity/TokenFactory';
import { UserInfoDatabase } from '../database/UserInfoDatabase';
import session from 'express-session';
import connectSessionKnex from 'connect-session-knex';
import passport from 'passport';
import { AuthDatabase } from '../database/AuthDatabase';
import { readBackstageTokenExpiration } from './readBackstageTokenExpiration';
import { TokenIssuer } from '../identity/types';
import { StaticTokenIssuer } from '../identity/StaticTokenIssuer';
import { StaticKeyStore } from '../identity/StaticKeyStore';
import { bindProviderRouters, ProviderFactories } from '../providers/router';
import { OidcRouter } from './OidcRouter';
import { RefreshTokenRouter } from './RefreshTokenRouter';
import { RefreshTokenService } from '../identity/RefreshTokenService';
import { RefreshSessionDatabase } from '../database/RefreshSessionDatabase';
import { readRefreshTokenConfig } from './readRefreshTokenConfig';

interface RouterOptions {
  logger: LoggerService;
  database: DatabaseService;
  config: RootConfigService;
  discovery: DiscoveryService;
  auth: AuthService;
  scheduler: SchedulerService;
  tokenFactoryAlgorithm?: string;
  providerFactories?: ProviderFactories;
  catalog: CatalogService;
  ownershipResolver?: AuthOwnershipResolver;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const {
    logger,
    config,
    discovery,
    database: db,
    scheduler,
    tokenFactoryAlgorithm,
    providerFactories = {},
  } = options;

  const router = Router();

  const appUrl = config.getString('app.baseUrl');
  const authUrl = await discovery.getExternalBaseUrl('auth');
  const backstageTokenExpiration = readBackstageTokenExpiration(config);
  const database = AuthDatabase.create(db);

  const keyStore = await KeyStores.fromConfig(config, {
    logger,
    database,
  });

  const userInfo = await UserInfoDatabase.create({
    database,
  });

  // Read refresh token configuration
  const refreshTokenConfig = readRefreshTokenConfig(config);

  const omitClaimsFromToken = config.getOptionalBoolean(
    'auth.omitIdentityTokenOwnershipClaim',
  )
    ? ['ent']
    : [];

  let tokenIssuer: TokenIssuer;
  if (keyStore instanceof StaticKeyStore) {
    tokenIssuer = new StaticTokenIssuer(
      {
        logger: logger.child({ component: 'token-factory' }),
        issuer: authUrl,
        sessionExpirationSeconds: backstageTokenExpiration,
        omitClaimsFromToken,
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
      omitClaimsFromToken,
    });
  }

  // Initialize refresh token service if enabled
  let refreshTokenService: RefreshTokenService | undefined;
  if (refreshTokenConfig.enabled) {
    const refreshSessionDatabase = await RefreshSessionDatabase.create({
      database,
    });

    refreshTokenService = new RefreshTokenService({
      logger: logger.child({ component: 'refresh-token-service' }),
      refreshSessionDatabase,
      userInfoDatabase: userInfo,
      tokenIssuer,
      defaultRefreshTokenExpirationSeconds:
        refreshTokenConfig.defaultExpirationSeconds,
      maxRefreshTokenExpirationSeconds: refreshTokenConfig.maxExpirationSeconds,
    });

    // Set up periodic cleanup of expired sessions
    scheduler
      .scheduleTask({
        id: 'refresh-token-cleanup',
        frequency: { seconds: refreshTokenConfig.cleanupIntervalSeconds },
        timeout: { minutes: 5 },
        scope: 'global',
        fn: async () => {
          await refreshTokenService!.cleanupExpiredSessions().catch(error => {
            logger.error(
              `Failed to cleanup expired refresh sessions: ${error}`,
            );
          });
        },
      })
      .catch(error => {
        logger.error(`Failed to schedule refresh token cleanup task: ${error}`);
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
          knex: await database.get(),
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

  bindProviderRouters(router, {
    providers: providerFactories,
    appUrl,
    baseUrl: authUrl,
    tokenIssuer,
    ...options,
    auth: options.auth,
    userInfo,
  });

  const oidcRouter = OidcRouter.create({
    auth: options.auth,
    tokenIssuer,
    baseUrl: authUrl,
    userInfo,
  });

  router.use(oidcRouter.getRouter());

  // Add refresh token endpoints if enabled
  if (refreshTokenService) {
    const refreshTokenRouter = RefreshTokenRouter.create({
      logger: logger.child({ component: 'refresh-token-router' }),
      auth: options.auth,
      refreshTokenService,
    });

    router.use(refreshTokenRouter.getRouter());
  }

  // Gives a more helpful error message than a plain 404
  router.use('/:provider/', req => {
    const { provider } = req.params;
    throw new NotFoundError(`Unknown auth provider '${provider}'`);
  });

  return router;
}
