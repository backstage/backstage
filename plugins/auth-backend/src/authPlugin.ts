/*
 * Copyright 2023 The Backstage Authors
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
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import {
  authOwnershipResolutionExtensionPoint,
  AuthOwnershipResolver,
  AuthProviderFactory,
  authProvidersExtensionPoint,
} from '@backstage/plugin-auth-node';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import { createRouter } from './service/router';
import { OfflineSessionDatabase } from './database/OfflineSessionDatabase';
import { OfflineAccessService } from './service/OfflineAccessService';
import { readDurationFromConfig } from '@backstage/config';
import { durationToMilliseconds } from '@backstage/types';

/**
 * Auth plugin
 *
 * @public
 */
export const authPlugin = createBackendPlugin({
  pluginId: 'auth',
  register(reg) {
    const providers = new Map<string, AuthProviderFactory>();
    let ownershipResolver: AuthOwnershipResolver | undefined = undefined;

    reg.registerExtensionPoint(authProvidersExtensionPoint, {
      registerProvider({ providerId, factory }) {
        if (providers.has(providerId)) {
          throw new Error(
            `Auth provider '${providerId}' was already registered`,
          );
        }
        providers.set(providerId, factory);
      },
    });

    reg.registerExtensionPoint(authOwnershipResolutionExtensionPoint, {
      setAuthOwnershipResolver(resolver) {
        if (ownershipResolver) {
          throw new Error('Auth ownership resolver is already set');
        }
        ownershipResolver = resolver;
      },
    });

    reg.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        database: coreServices.database,
        discovery: coreServices.discovery,
        auth: coreServices.auth,
        httpAuth: coreServices.httpAuth,
        lifecycle: coreServices.lifecycle,
        catalog: catalogServiceRef,
      },
      async init({
        httpRouter,
        logger,
        config,
        database,
        discovery,
        auth,
        httpAuth,
        lifecycle,
        catalog,
      }) {
        let offlineAccess: OfflineAccessService | undefined;
        const refreshTokensEnabled = config.getOptionalBoolean(
          'auth.experimentalRefreshToken.enabled',
        );

        if (refreshTokensEnabled) {
          const dcrEnabled = config.getOptionalBoolean(
            'auth.experimentalDynamicClientRegistration.enabled',
          );
          if (!dcrEnabled) {
            logger.warn(
              'Refresh tokens are enabled but dynamic client registration is not. ' +
                'The refresh token endpoint requires DCR to be enabled.',
            );
          }

          const tokenLifetime = config.has(
            'auth.experimentalRefreshToken.tokenLifetime',
          )
            ? readDurationFromConfig(config, {
                key: 'auth.experimentalRefreshToken.tokenLifetime',
              })
            : { days: 30 };

          const maxRotationLifetime = config.has(
            'auth.experimentalRefreshToken.maxRotationLifetime',
          )
            ? readDurationFromConfig(config, {
                key: 'auth.experimentalRefreshToken.maxRotationLifetime',
              })
            : { years: 1 };

          const tokenLifetimeSeconds = Math.floor(
            durationToMilliseconds(tokenLifetime) / 1000,
          );
          const maxRotationLifetimeSeconds = Math.floor(
            durationToMilliseconds(maxRotationLifetime) / 1000,
          );

          if (tokenLifetimeSeconds <= 0) {
            throw new Error(
              'auth.experimentalRefreshToken.tokenLifetime must be a positive duration',
            );
          }
          if (maxRotationLifetimeSeconds <= 0) {
            throw new Error(
              'auth.experimentalRefreshToken.maxRotationLifetime must be a positive duration',
            );
          }
          if (maxRotationLifetimeSeconds <= tokenLifetimeSeconds) {
            throw new Error(
              'auth.experimentalRefreshToken.maxRotationLifetime must be greater than tokenLifetime',
            );
          }

          const maxTokensPerUser =
            config.getOptionalNumber(
              'auth.experimentalRefreshToken.maxTokensPerUser',
            ) ?? 20;

          if (maxTokensPerUser <= 0) {
            throw new Error(
              'auth.experimentalRefreshToken.maxTokensPerUser must be a positive number',
            );
          }

          const knex = await database.getClient();

          if (
            knex.client.config.client.includes('sqlite') ||
            knex.client.config.client.includes('better-sqlite')
          ) {
            logger.warn(
              'Refresh tokens are enabled with SQLite, which does not support row-level locking. ' +
                'Concurrent token rotation may not be fully protected against race conditions. ' +
                'Use PostgreSQL for production deployments.',
            );
          }

          const offlineSessionDb = OfflineSessionDatabase.create({
            knex,
            tokenLifetimeSeconds,
            maxRotationLifetimeSeconds,
            maxTokensPerUser,
          });

          offlineAccess = OfflineAccessService.create({
            offlineSessionDb,
            logger,
          });

          // Periodically clean up expired sessions every hour
          const cleanupIntervalMs = 60 * 60 * 1000;
          const cleanupInterval = setInterval(async () => {
            try {
              const deleted = await offlineSessionDb.cleanupExpiredSessions();
              if (deleted > 0) {
                logger.info(`Cleaned up ${deleted} expired offline sessions`);
              }
            } catch (error) {
              logger.error('Failed to cleanup expired offline sessions', error);
            }
          }, cleanupIntervalMs);
          cleanupInterval.unref();

          lifecycle.addShutdownHook(() => {
            clearInterval(cleanupInterval);
          });
        }

        const router = await createRouter({
          logger,
          config,
          database,
          discovery,
          auth,
          catalog,
          providerFactories: Object.fromEntries(providers),
          ownershipResolver,
          httpAuth,
          offlineAccess,
        });
        httpRouter.addAuthPolicy({
          path: '/',
          allow: 'unauthenticated',
        });
        httpRouter.use(router);
      },
    });
  },
});
