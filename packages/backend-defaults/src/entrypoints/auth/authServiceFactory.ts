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
  createServiceRef,
} from '@backstage/backend-plugin-api';
import { DefaultAuthService } from './DefaultAuthService';
import { ExternalTokenHandler } from './external/ExternalTokenHandler';
import { PluginTokenHandler } from './plugin/PluginTokenHandler';
import { createPluginKeySource } from './plugin/keys/createPluginKeySource';
import { UserTokenHandler } from './user/UserTokenHandler';
import { TokenHandler } from './external/types';

/**
 * This "non-singleton" service
 * @public
 */
export const authTokenHandlersServiceRef = createServiceRef<TokenHandler>({
  id: `${coreServices.auth.id}.tokenHandlers`,
  singleton: false,
});

/**
 * Handles token authentication and credentials management.
 *
 * See {@link @backstage/code-plugin-api#AuthService}
 * and {@link https://backstage.io/docs/backend-system/core-services/auth | the service docs}
 * for more information.
 *
 * @public
 */
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
    tokenHandlers: authTokenHandlersServiceRef,
  },
  async factory({
    config,
    discovery,
    plugin,
    tokenManager,
    logger,
    database,
    tokenHandlers,
  }) {
    const disableDefaultAuthPolicy =
      config.getOptionalBoolean(
        'backend.auth.dangerouslyDisableDefaultAuthPolicy',
      ) ?? false;

    const keyDuration = { hours: 1 };

    const keySource = await createPluginKeySource({
      config,
      database,
      logger,
      keyDuration,
    });

    const userTokens = UserTokenHandler.create({
      discovery,
    });

    const pluginTokens = PluginTokenHandler.create({
      ownPluginId: plugin.getId(),
      logger,
      keySource,
      keyDuration,
      discovery,
    });

    const externalTokens = ExternalTokenHandler.create({
      ownPluginId: plugin.getId(),
      config,
      logger,
      additionalHandlers: tokenHandlers,
    });

    return new DefaultAuthService(
      userTokens,
      pluginTokens,
      externalTokens,
      tokenManager,
      plugin.getId(),
      disableDefaultAuthPolicy,
      keySource,
    );
  },
});
