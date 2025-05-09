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
} from '@backstage/backend-plugin-api';
import { AuthOwnershipResolver } from '@backstage/plugin-auth-node';
import { CatalogService } from '@backstage/plugin-catalog-node';
import { NotFoundError } from '@backstage/errors';
import { bindOidcRouter } from '../identity/router';
import { KeyStores } from '../identity/KeyStores';
import { TokenFactory } from '../identity/TokenFactory';
import { UserInfoDatabaseHandler } from '../identity/UserInfoDatabaseHandler';
import session from 'express-session';
import connectSessionKnex from 'connect-session-knex';
import passport from 'passport';
import { AuthDatabase } from '../database/AuthDatabase';
import { readBackstageTokenExpiration } from './readBackstageTokenExpiration';
import { TokenIssuer } from '../identity/types';
import { StaticTokenIssuer } from '../identity/StaticTokenIssuer';
import { StaticKeyStore } from '../identity/StaticKeyStore';
import { bindProviderRouters, ProviderFactories } from '../providers/router';

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
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const {
    logger,
    config,
    discovery,
    database,
    tokenFactoryAlgorithm,
    providerFactories = {},
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

  const userInfoDatabaseHandler = new UserInfoDatabaseHandler(
    await authDb.get(),
  );

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
        userInfoDatabaseHandler,
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
      userInfoDatabaseHandler,
      omitClaimsFromToken,
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

  bindProviderRouters(router, {
    providers: providerFactories,
    appUrl,
    baseUrl: authUrl,
    tokenIssuer,
    ...options,
    auth: options.auth,
  });

  bindOidcRouter(router, {
    auth: options.auth,
    tokenIssuer,
    baseUrl: authUrl,
    userInfoDatabaseHandler,
  });

  // Gives a more helpful error message than a plain 404
  router.use('/:provider/', req => {
    const { provider } = req.params;
    throw new NotFoundError(`Unknown auth provider '${provider}'`);
  });

  return router;
}
