/*
 * Copyright 2026 The Backstage Authors
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
  createBackendPlugin,
  createServiceFactory,
  coreServices,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';
import type { ServiceRef } from '@backstage/backend-plugin-api';
import {
  providerTokenRefresherExtensionPoint,
  type ProviderTokenRefresher,
  type ProviderTokenService,
} from '@devhub/plugin-provider-token-node';
import {
  DefaultProviderTokenService,
  sharedRefreshLocks,
} from './DefaultProviderTokenService';
import { deriveKey } from './crypto';

/**
 * Module-internal refresher registry.
 * Populated by refresher modules during their registerInit (before this plugin's registerInit runs).
 * NOT exported — access is only via the plugin closure and the service factory below.
 * Tests that exercise DefaultProviderTokenService directly should pass their own Map via constructor.
 */
const refreshers = new Map<string, ProviderTokenRefresher>();

/**
 * The provider-token backend plugin.
 * Registers the providerTokenRefresherExtensionPoint and runs DB migrations.
 *
 * @public
 */
export const providerTokenPlugin = createBackendPlugin({
  pluginId: 'provider-token',
  register(env) {
    env.registerExtensionPoint(providerTokenRefresherExtensionPoint, {
      addRefresher(refresher: ProviderTokenRefresher) {
        refreshers.set(refresher.providerId, refresher);
      },
    });

    env.registerInit({
      deps: {
        database: coreServices.database,
        config: coreServices.rootConfig,
      },
      async init({ database, config }) {
        // Validate required config at startup — fail fast with clear attribution to this plugin
        // rather than surfacing the error lazily from a consuming plugin's initialization.
        config.getString('providerToken.encryptionSecret');

        const db = await database.getClient();
        await db.migrate.latest({
          directory: resolvePackagePath(
            '@devhub/plugin-provider-token-backend',
            'migrations',
          ),
        });
      },
    });
  },
});

/**
 * Creates the Backstage ServiceFactory for ProviderTokenService.
 * Called by the defaultFactory in providerTokenServiceRef (in provider-token-node).
 *
 * The `refreshers` Map is captured from the module-level closure. By the time this factory's
 * factory() function is invoked, all refresher modules' registerInit callbacks have run and
 * the map is fully populated (Backstage guarantees modules run before any plugin registerInit).
 *
 * @public
 */
export function createProviderTokenServiceFactory(
  service: ServiceRef<ProviderTokenService, 'plugin'>,
) {
  return createServiceFactory({
    service,
    deps: {
      database: coreServices.database,
      config: coreServices.rootConfig,
      logger: coreServices.logger,
    },
    async factory({ database, config, logger }) {
      const db = await database.getClient();
      // Migrations are run exclusively in providerTokenPlugin.registerInit above.
      // The service factory assumes the schema already exists.
      const secret = config.getString('providerToken.encryptionSecret');
      const hkdfSalt =
        config.getOptionalString('providerToken.hkdfSalt') ?? undefined;
      const encKey = deriveKey(secret, hkdfSalt);
      const refreshBufferSeconds =
        config.getOptionalNumber('providerToken.refreshBufferSeconds') ?? 300;

      return new DefaultProviderTokenService(
        db,
        encKey,
        refreshers,
        refreshBufferSeconds,
        logger,
        sharedRefreshLocks,
      );
    },
  });
}
