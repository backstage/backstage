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
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';
import { TaskScheduleDefinition } from '@backstage/backend-tasks';
import { HumanDuration } from '@backstage/types';

/**
 * Options for Linguist backend plugin
 *
 * @public
 */
export interface LinguistPluginOptions {
  schedule?: TaskScheduleDefinition;
  age?: HumanDuration;
  batchSize?: number;
  useSourceLocation?: boolean;
  linguistJsOptions?: Record<string, unknown>;
  kind?: string[];
}

/**
 * Linguist backend plugin
 *
 * @public
 */
export const linguistPlugin = createBackendPlugin(
  (options: LinguistPluginOptions) => ({
    pluginId: 'linguist',
    register(env) {
      env.registerInit({
        deps: {
          logger: coreServices.logger,
          reader: coreServices.urlReader,
          database: coreServices.database,
          discovery: coreServices.discovery,
          scheduler: coreServices.scheduler,
          tokenManager: coreServices.tokenManager,
          httpRouter: coreServices.httpRouter,
        },
        async init({
          logger,
          reader,
          database,
          discovery,
          scheduler,
          tokenManager,
          httpRouter,
        }) {
          httpRouter.use(
            await createRouter(
              {
                ...options,
              },
              {
                logger: loggerToWinstonLogger(logger),
                reader,
                database,
                discovery,
                scheduler,
                tokenManager,
              },
            ),
          );
        },
      });
    },
  }),
);
