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
import { readTaskScheduleDefinitionFromConfig } from '@backstage/backend-tasks';
import { HumanDuration } from '@backstage/types';

import { createRouter } from './service/router';

/**
 * Linguist backend plugin
 *
 * @public
 */
export const linguistPlugin = createBackendPlugin({
  pluginId: 'linguist',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        reader: coreServices.urlReader,
        database: coreServices.database,
        discovery: coreServices.discovery,
        scheduler: coreServices.scheduler,
        tokenManager: coreServices.tokenManager,
        httpRouter: coreServices.httpRouter,
      },
      async init({
        logger,
        config,
        reader,
        database,
        discovery,
        scheduler,
        tokenManager,
        httpRouter,
      }) {
        let schedule;
        if (config.has('linguist.schedule')) {
          schedule = readTaskScheduleDefinitionFromConfig(
            config.getConfig('linguist.schedule'),
          );
        }
        const batchSize = config.getOptionalNumber('linguist.batchSize');
        const useSourceLocation = config.getBoolean(
          'linguist.useSourceLocation',
        );
        const age = config.getOptionalConfig('linguist.age') as
          | HumanDuration
          | undefined;
        const kind = config.getOptionalStringArray('linguist.kind');
        const linguistJsOptions = config.getOptionalConfig(
          'linguist.linguistJsOptions',
        );

        httpRouter.use(
          await createRouter(
            {
              schedule,
              batchSize,
              useSourceLocation,
              age,
              kind,
              linguistJsOptions,
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
});
