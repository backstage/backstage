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

import { loggerToWinstonLogger } from '@backstage/backend-common';
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { techInsightsFactCheckerFactoryExtensionPoint } from '@backstage/plugin-tech-insights-node';
import { JsonRulesEngineFactCheckerFactory } from '../service';

/**
 * Sets a JsonRulesEngineFactCheckerFactory as FactCheckerFactory
 * loading checks from the config.
 *
 * @public
 */
export const techInsightsModuleJsonRulesEngineFactCheckerFactory =
  createBackendModule({
    pluginId: 'tech-insights',
    moduleId: 'json-rules-engine-fact-checker-factory',
    register(env) {
      env.registerInit({
        deps: {
          config: coreServices.rootConfig,
          logger: coreServices.logger,
          techInsights: techInsightsFactCheckerFactoryExtensionPoint,
        },
        async init({ config, logger, techInsights }) {
          const winstonLogger = loggerToWinstonLogger(logger);
          const factory = JsonRulesEngineFactCheckerFactory.fromConfig(config, {
            logger: winstonLogger,
          });
          techInsights.setFactCheckerFactory(factory);
        },
      });
    },
  });
