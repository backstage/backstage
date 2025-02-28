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

import { TokenManager } from '@backstage/backend-common';
import {
  AuthService,
  DiscoveryService,
  HttpAuthService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { CatalogApi, CatalogClient } from '@backstage/catalog-client';
import { Config } from '@backstage/config';
import { assertError, NotFoundError } from '@backstage/errors';
import {
  AuthOwnershipResolver,
  AuthProviderFactory,
} from '@backstage/plugin-auth-node';
import express from 'express';
import Router from 'express-promise-router';
import { Minimatch } from 'minimatch';
import { CatalogAuthResolverContext } from '../lib/resolvers/CatalogAuthResolverContext';
import { TokenIssuer } from '../identity/types';

/**
 * @public
 * @deprecated Migrate the auth plugin to the new backend system https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
 */
export type ProviderFactories = { [s: string]: AuthProviderFactory };

export function bindProviderRouters(
  targetRouter: express.Router,
  options: {
    providers: ProviderFactories;
    appUrl: string;
    baseUrl: string;
    config: Config;
    logger: LoggerService;
    discovery: DiscoveryService;
    auth: AuthService;
    httpAuth: HttpAuthService;
    tokenManager?: TokenManager;
    tokenIssuer: TokenIssuer;
    ownershipResolver?: AuthOwnershipResolver;
    catalogApi?: CatalogApi;
  },
) {
  const {
    providers,
    appUrl,
    baseUrl,
    config,
    logger,
    discovery,
    auth,
    httpAuth,
    tokenManager,
    tokenIssuer,
    catalogApi,
    ownershipResolver,
  } = options;

  const providersConfig = config.getOptionalConfig('auth.providers');

  const isOriginAllowed = createOriginFilter(config);

  for (const [providerId, providerFactory] of Object.entries(providers)) {
    if (providersConfig?.has(providerId)) {
      logger.info(`Configuring auth provider: ${providerId}`);
      try {
        const provider = providerFactory({
          providerId,
          appUrl,
          baseUrl,
          isOriginAllowed,
          globalConfig: {
            baseUrl,
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
            discovery,
            auth,
            httpAuth,
            ownershipResolver,
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

        targetRouter.use(`/${providerId}`, r);
      } catch (e) {
        assertError(e);
        if (process.env.NODE_ENV !== 'development') {
          throw new Error(
            `Failed to initialize ${providerId} auth provider, ${e.message}`,
          );
        }

        logger.warn(`Skipping ${providerId} auth provider, ${e.message}`);

        targetRouter.use(`/${providerId}`, () => {
          // If the user added the provider under auth.providers but the clientId and clientSecret etc. were not found.
          throw new NotFoundError(
            `Auth provider registered for '${providerId}' is misconfigured. This could mean the configs under ` +
              `auth.providers.${providerId} are missing or the environment variables used are not defined. ` +
              `Check the auth backend plugin logs when the backend starts to see more details.`,
          );
        });
      }
    } else {
      targetRouter.use(`/${providerId}`, () => {
        throw new NotFoundError(
          `No auth provider registered for '${providerId}'`,
        );
      });
    }
  }
}

/**
 * @public
 * @deprecated this export will be removed
 */
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
