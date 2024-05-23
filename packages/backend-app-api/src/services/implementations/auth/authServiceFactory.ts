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

import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { DatabaseKeyStore } from './DatabaseKeyStore';
import { DefaultAuthService } from './DefaultAuthService';
import { PluginTokenHandler } from './plugin/PluginTokenHandler';
import { UserTokenHandler } from './user/UserTokenHandler';
import { ExternalTokenHandler } from './external/ExternalTokenHandler';

/** @public */
export const authServiceFactory = createServiceFactory({
  service: coreServices.auth,
  deps: {
    config: coreServices.rootConfig,
    logger: coreServices.rootLogger,
    discovery: coreServices.discovery,
    plugin: coreServices.pluginMetadata,
    database: coreServices.database,
    // Re-using the token manager makes sure that we use the same generated keys for
    // development as plugins that have not yet been migrated. It's important that this
    // keeps working as long as there are plugins that have not been migrated to the
    // new auth services in the new backend system.
    tokenManager: coreServices.tokenManager,
  },
  async factory({ config, discovery, plugin, tokenManager, logger, database }) {
    const disableDefaultAuthPolicy = Boolean(
      config.getOptionalBoolean(
        'backend.auth.dangerouslyDisableDefaultAuthPolicy',
      ),
    );

    const publicKeyStore = await DatabaseKeyStore.create({
      database,
      logger,
    });

    const userTokens = UserTokenHandler.create({
      discovery,
    });
    const pluginTokens = PluginTokenHandler.create({
      ownPluginId: plugin.getId(),
      keyDuration: { hours: 1 },
      logger,
      publicKeyStore,
      discovery,
    });
    const externalTokens = ExternalTokenHandler.create({
      ownPluginId: plugin.getId(),
      config,
      logger,
    });

    return new DefaultAuthService(
      userTokens,
      pluginTokens,
      externalTokens,
      tokenManager,
      plugin.getId(),
      disableDefaultAuthPolicy,
      publicKeyStore,
    );
  },
});
