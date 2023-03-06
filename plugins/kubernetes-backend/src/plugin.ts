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

import { loggerToWinstonLogger } from '@backstage/backend-common';
import {
  createBackendPlugin,
  coreServices,
} from '@backstage/backend-plugin-api';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';

import { KubernetesBuilder } from '@backstage/plugin-kubernetes-backend';

/**
 * This is the backend plugin that provides the Kubernetes integration.
 * @public
 */
export const kubernetesPlugin = createBackendPlugin({
  pluginId: 'kubernetes-backend',
  register(env) {
    env.registerInit({
      deps: {
        http: coreServices.httpRouter,
        logger: coreServices.logger,
        config: coreServices.config,
        catalogApi: catalogServiceRef,
      },
      async init({ http, logger, config, catalogApi }) {
        const winstonLogger = loggerToWinstonLogger(logger);
        const { router } = await KubernetesBuilder.createBuilder({
          logger: winstonLogger,
          config,
          catalogApi,
        }).build();
        http.use(router);
      },
    });
  },
});
