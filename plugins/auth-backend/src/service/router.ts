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
  HttpAuthService,
  LoggerService,
  RootConfigService,
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
import {
  readBackstageTokenExpiration,
  readDcrTokenExpiration,
} from './readTokenExpiration.ts';
import { StaticTokenIssuer } from '../identity/StaticTokenIssuer';
import { StaticKeyStore } from '../identity/StaticKeyStore';
import { bindProviderRouters, ProviderFactories } from '../providers/router';
import { OidcRouter } from './OidcRouter';
import { OidcDatabase } from '../database/OidcDatabase';
import { offlineSessionDatabaseRef } from '../database/OfflineSessionDatabase';
import { offlineAccessServiceRef } from './OfflineAccessService';

interface RouterOptions {
  logger: LoggerService;
  database: DatabaseService;
  config: RootConfigService;
  discovery: DiscoveryService;
  auth: AuthService;
  tokenFactoryAlgorithm?: string;
  providerFactories?: ProviderFactories;
  catalog: CatalogService;
  ownershipResolver?: AuthOwnershipResolver;
  httpAuth: HttpAuthService;
  offlineSessionDb: typeof offlineSessionDatabaseRef.T;
  offlineAccess: typeof offlineAccessServiceRef.T;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const {
    logger,
    config,
    discovery,
    database: db,
    tokenFactoryAlgorithm,
    providerFactories = {},
    httpAuth,
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

  const omitClaimsFromToken = config.getOptionalBoolean(
    'auth.omitIdentityTokenOwnershipClaim',
  )
    ? ['ent']
    : [];

  const createTokenIssuer = (opts: {
    logger: LoggerService;
    expirationSeconds: number;
  }) => {
    if (keyStore instanceof StaticKeyStore) {
      return new StaticTokenIssuer(
        {
          logger: opts.logger,
          issuer: authUrl,
          sessionExpirationSeconds: opts.expirationSeconds,
          omitClaimsFromToken,
        },
        keyStore as StaticKeyStore,
      );
    }
    return new TokenFactory({
      issuer: authUrl,
      keyStore,
      keyDurationSeconds: opts.expirationSeconds,
      logger: opts.logger,
      algorithm:
        tokenFactoryAlgorithm ??
        config.getOptionalString('auth.identityTokenAlgorithm'),
      omitClaimsFromToken,
    });
  };

  const tokenIssuer = createTokenIssuer({
    logger: logger.child({ component: 'token-factory' }),
    expirationSeconds: backstageTokenExpiration,
  });

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

  const dcrTokenExpiration = readDcrTokenExpiration(config);

  const oidcTokenIssuer = createTokenIssuer({
    logger: logger.child({ component: 'oidc-token-factory' }),
    expirationSeconds: dcrTokenExpiration,
  });

  const oidc = await OidcDatabase.create({ database });

  const oidcRouter = OidcRouter.create({
    auth: options.auth,
    tokenIssuer: oidcTokenIssuer,
    baseUrl: authUrl,
    appUrl,
    userInfo,
    oidc,
    logger,
    httpAuth,
    config,
    offlineAccess: options.offlineAccess,
  });

  router.use(oidcRouter.getRouter());

  // Gives a more helpful error message than a plain 404
  router.use('/:provider/', req => {
    const { provider } = req.params;
    throw new NotFoundError(`Unknown auth provider '${provider}'`);
  });

  return router;
}
