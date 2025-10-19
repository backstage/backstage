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
import { OfflineSessionDatabase } from '../database/OfflineSessionDatabase';
import { OfflineAccessService } from './OfflineAccessService';
import { HumanDuration } from '@backstage/types';

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

  const tokenLifetime =
    config.getOptionalString('auth.refreshToken.tokenLifetime') ?? '30 days';
  const maxRotationLifetime =
    config.getOptionalString('auth.refreshToken.maxRotationLifetime') ??
    '1 year';

  // Parse durations to seconds
  const tokenLifetimeSeconds = parseDurationToSeconds(tokenLifetime);
  const maxRotationLifetimeSeconds =
    parseDurationToSeconds(maxRotationLifetime);

  const offlineSessionDb = new OfflineSessionDatabase(
    await database.get(),
    tokenLifetimeSeconds,
    maxRotationLifetimeSeconds,
  );

  const offlineAccess = OfflineAccessService.create({
    offlineSessionDb,
    logger: logger.child({ component: 'offline-access' }),
  });

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
    offlineAccess,
  });

  router.use(oidcRouter.getRouter());

  // Gives a more helpful error message than a plain 404
  router.use('/:provider/', req => {
    const { provider } = req.params;
    throw new NotFoundError(`Unknown auth provider '${provider}'`);
  });

  return router;
}

/**
 * Parse a duration string to seconds
 * @internal
 */
function parseDurationToSeconds(duration: string | HumanDuration): number {
  if (typeof duration === 'object') {
    // Handle HumanDuration object format
    let seconds = 0;
    if (duration.years) seconds += duration.years * 365 * 24 * 60 * 60;
    if (duration.months) seconds += duration.months * 30 * 24 * 60 * 60;
    if (duration.weeks) seconds += duration.weeks * 7 * 24 * 60 * 60;
    if (duration.days) seconds += duration.days * 24 * 60 * 60;
    if (duration.hours) seconds += duration.hours * 60 * 60;
    if (duration.minutes) seconds += duration.minutes * 60;
    if (duration.seconds) seconds += duration.seconds;
    if (duration.milliseconds) seconds += duration.milliseconds / 1000;
    return seconds;
  }

  // Handle string format like "30 days", "1 year"
  const match = duration.match(
    /^(\d+)\s*(year|years|month|months|week|weeks|day|days|hour|hours|minute|minutes|second|seconds|ms|milliseconds)$/i,
  );
  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 'year':
    case 'years':
      return value * 365 * 24 * 60 * 60;
    case 'month':
    case 'months':
      return value * 30 * 24 * 60 * 60;
    case 'week':
    case 'weeks':
      return value * 7 * 24 * 60 * 60;
    case 'day':
    case 'days':
      return value * 24 * 60 * 60;
    case 'hour':
    case 'hours':
      return value * 60 * 60;
    case 'minute':
    case 'minutes':
      return value * 60;
    case 'second':
    case 'seconds':
      return value;
    case 'ms':
    case 'milliseconds':
      return value / 1000;
    default:
      throw new Error(`Unknown duration unit: ${unit}`);
  }
}
