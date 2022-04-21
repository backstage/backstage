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
  entityOwnershipFactRetriever,
  entityMetadataFactRetriever,
  techdocsFactRetriever,
} from '@backstage/plugin-tech-insights-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import {
  JsonRulesEngineFactCheckerFactory,
  JSON_RULE_ENGINE_CHECK_TYPE,
} from '@backstage/plugin-tech-insights-backend-module-jsonfc';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const techInsightsContext = await buildTechInsightsContext({
    logger: env.logger,
    config: env.config,
    database: env.database,
    scheduler: env.scheduler,
    discovery: env.discovery,
    factRetrievers: [
      createFactRetrieverRegistration({
        cadence: '1 1 1 * *', // Example cron, At 01:01 on day-of-month 1.
        factRetriever: entityOwnershipFactRetriever,
      }),
      createFactRetrieverRegistration({
        cadence: '1 1 1 * *',
        factRetriever: entityMetadataFactRetriever,
      }),
      createFactRetrieverRegistration({
        cadence: '1 1 1 * *',
        factRetriever: techdocsFactRetriever,
      }),
    ],
    factCheckerFactory: new JsonRulesEngineFactCheckerFactory({
      logger: env.logger,
      checks: [
        {
          id: 'simpleTestCheck',
          type: JSON_RULE_ENGINE_CHECK_TYPE,
          name: 'simpleTestCheck',
          description: 'Simple Check For Testing',
          factIds: [
            'entityMetadataFactRetriever',
            'techdocsFactRetriever',
            'entityOwnershipFactRetriever',
          ],
          rule: {
            conditions: {
              all: [
                {
                  fact: 'hasGroupOwner',
                  operator: 'equal',
                  value: true,
                },
                {
                  fact: 'hasTitle',
                  operator: 'equal',
                  value: true,
                },
                {
                  fact: 'hasDescription',
                  operator: 'equal',
                  value: true,
                },
                {
                  fact: 'hasAnnotationBackstageIoTechdocsRef',
                  operator: 'equal',
                  value: true,
                },
              ],
            },
          },
        },
      ],
    }),
  });

  return await createRouter({
    ...techInsightsContext,
    logger: env.logger,
    config: env.config,
  });
}
