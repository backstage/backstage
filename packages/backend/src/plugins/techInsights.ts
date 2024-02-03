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
import { FactRetriever, FactRetrieverContext } from '@backstage/plugin-tech-insights-node';
import { CatalogClient } from '@backstage/catalog-client';

async function fetchProductsDomainFacts(ctx: FactRetrieverContext) {
  // Handler function that retrieves the fact
  const { discovery } = ctx;
  const catalogClient = new CatalogClient({
    discoveryApi: discovery,
  });

  const entities = await catalogClient.getEntities(
    {
      filter: [{ kind: 'component' }],
    }
  );


  // Respond with an array of entity/fact values
  return entities.items.map(it => {
    const systemCount = 10
    const systemNoDomainCount = 8
    return {
      // Entity information that this fact relates to
      entity: {
        namespace: it.metadata.namespace,
        kind: it.kind,
        name: it.metadata.name,
      },

      facts: {
        systemCount: systemCount,
        systemNoDomainCount: systemNoDomainCount,
        fraction: systemNoDomainCount/systemCount
      },
    };
  });
}

const domainFactRetriever: FactRetriever = {
  id: 'product-domain-check',
  version: '0.1.1',
  entityFilter: [{ kind: 'service' }], //we're only going to define these metrics against the group entity
  schema: {
      systemNoDomainCount: { type: 'integer', description: 'Number of Products Not Mapped to Domains' },
      systemCount: { type: 'integer', description: 'Number of systems owned by group' },
      fraction: {type:'float', description:'ration of satisfactory/unsatisfactory'}
    },
  handler: fetchProductsDomainFacts
};

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const techInsightsContext = await buildTechInsightsContext({
    logger: env.logger,
    config: env.config,
    database: env.database,
    scheduler: env.scheduler,
    discovery: env.discovery,
    tokenManager: env.tokenManager,
    factRetrievers: [
      createFactRetrieverRegistration({
        cadence: '1 1 1 * *',
        factRetriever: entityOwnershipFactRetriever,
      }),
      createFactRetrieverRegistration({
        cadence: '1 1 1 * *',
        factRetriever: domainFactRetriever
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
            id: 'domainCheck', 
            type: JSON_RULE_ENGINE_CHECK_TYPE,
            name: 'Domain Check for Products',
            description: 'Verifies that the number of domainless Product is zero',
            factIds: ['product-domain-check'],
            rule: {
                conditions: {
                    all: [ { fact: 'systemNoDomainCount', operator: 'equal', value: 0 }  ],
                },
            },
        },
        {
          id: 'titleCheck',
          type: JSON_RULE_ENGINE_CHECK_TYPE,
          name: 'Title Check',
          description:
            'Verifies that a Title, used to improve readability, has been set for this entity',
          factIds: ['entityMetadataFactRetriever'],
          rule: {
            conditions: {
              all: [
                {
                  fact: 'hasTitle',
                  operator: 'equal',
                  value: true,
                },
              ],
            },
          },
        },
        {
          id: 'techDocsCheck',
          type: JSON_RULE_ENGINE_CHECK_TYPE,
          name: 'TechDocs Check',
          description:
            'Verifies that TechDocs has been enabled for this entity',
          factIds: ['techdocsFactRetriever'],
          rule: {
            conditions: {
              all: [
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