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
import {
  DefaultPluginTokenHandler,
  PluginTokenHandler,
} from './plugin/PluginTokenHandler';
import { createPluginKeySource } from './plugin/keys/createPluginKeySource';
import { UserTokenHandler } from './user/UserTokenHandler';

/**
 * @public
 * This service is used to decorate the default plugin token handler with custom logic.
 */
export const pluginTokenHandlerDecoratorServiceRef = createServiceRef<
  (defaultImplementation: PluginTokenHandler) => PluginTokenHandler
>({
  id: 'core.auth.pluginTokenHandlerDecorator',
  defaultFactory: async service =>
    createServiceFactory({
      service,
      deps: {},
      factory: async () => {
        return impl => impl;
      },
    }),
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
    logger: coreServices.logger,
    discovery: coreServices.discovery,
    plugin: coreServices.pluginMetadata,
    database: coreServices.database,
    pluginTokenHandlerDecorator: pluginTokenHandlerDecoratorServiceRef,
  },
  async factory({
    config,
    discovery,
    plugin,
    logger,
    database,
    pluginTokenHandlerDecorator,
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
      logger,
    });

    const pluginTokens = pluginTokenHandlerDecorator(
      DefaultPluginTokenHandler.create({
        ownPluginId: plugin.getId(),
        logger,
        keySource,
        keyDuration,
        discovery,
      }),
    );

    const externalTokens = ExternalTokenHandler.create({
      ownPluginId: plugin.getId(),
      config,
      logger,
    });

    return new DefaultAuthService(
      userTokens,
      pluginTokens,
      externalTokens,
      plugin.getId(),
      disableDefaultAuthPolicy,
      keySource,
    );
  },
});
