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

import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { VaultApi, vaultExtensionPoint } from '@backstage/plugin-vault-node';
import { VaultBuilder } from './VaultBuilder';
import { TaskScheduleDefinitionConfig } from '@backstage/backend-tasks';

/**
 * Vault backend plugin
 *
 * @public
 */
export const vaultPlugin = createBackendPlugin({
  pluginId: 'vault',
  register(env) {
    let client: VaultApi | undefined;

    env.registerExtensionPoint(vaultExtensionPoint, {
      setClient(vaultClient) {
        if (client) {
          throw new Error('The vault client has been already set');
        }
        client = vaultClient;
      },
    });

    env.registerInit({
      deps: {
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        scheduler: coreServices.scheduler,
        httpRouter: coreServices.httpRouter,
      },
      async init({ logger, config, scheduler, httpRouter }) {
        let builder = VaultBuilder.createBuilder({
          logger,
          config,
          scheduler,
        });

        if (client) {
          builder = builder.setVaultClient(client);
        }

        const scheduleCfg = config.getOptional<
          boolean | TaskScheduleDefinitionConfig
        >('vault.schedule');
        if (scheduleCfg !== undefined && scheduleCfg !== false) {
          builder = await builder.enableTokenRenew();
        }

        const { router } = builder.build();
        httpRouter.use(router);
        httpRouter.addAuthPolicy({
          path: '/health',
          allow: 'unauthenticated',
        });
      },
    });
  },
});
