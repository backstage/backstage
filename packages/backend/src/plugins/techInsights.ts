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
  createRouter,
  buildTechInsightsContext,
  createFactRetrieverRegistration,
  createCatalogFactRetriever,
} from '@backstage/plugin-tech-insights-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import {
  JsonRulesEngineFactCheckerFactory,
  JSON_RULE_ENGINE_CHECK_TYPE,
} from '@backstage/plugin-tech-insights-backend-module-jsonfc';

export default async function createPlugin({
  logger,
  config,
  discovery,
  database,
}: PluginEnvironment): Promise<Router> {
  const techInsightsContext = await buildTechInsightsContext({
    logger,
    config,
    database,
    discovery,
    factRetrievers: [
      createFactRetrieverRegistration(
        '* * * * *', // Example cron, every minute
        createCatalogFactRetriever(),
      ),
    ],
    factCheckerFactory: new JsonRulesEngineFactCheckerFactory({
      checks: [
        {
          id: 'simpleTestCheck',
          type: JSON_RULE_ENGINE_CHECK_TYPE,
          name: 'simpleTestCheck',
          description: 'Simple Check For Testing',
          factIds: ['testRetriever'],
          rule: {
            conditions: {
              all: [
                {
                  fact: 'examplenumberfact',
                  operator: 'lessThan',
                  value: 5,
                },
              ],
            },
          },
        },
      ],
      logger,
    }),
  });

  return await createRouter({
    ...techInsightsContext,
    logger,
    config,
  });
}
