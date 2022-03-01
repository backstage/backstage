/*
 * Copyright 2021 The Backstage Authors
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
  FactRetriever,
  FactRetrieverRegistration,
  FactSchemaDefinition,
  TechInsightFact,
  TechInsightsStore,
} from '@backstage/plugin-tech-insights-node';
import { FactRetrieverRegistry } from './FactRetrieverRegistry';
import { FactRetrieverEngine } from './FactRetrieverEngine';
import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { PluginTaskScheduler } from '@backstage/backend-tasks';

const testFactRetriever: FactRetriever = {
  id: 'test_factretriever',
  version: '0.0.1',
  entityFilter: [{ kind: 'component' }],
  schema: {
    testnumberfact: {
      type: 'integer',
      description: '',
    },
  },
  handler: jest.fn(async () => {
    return [
      {
        entity: {
          namespace: 'a',
          kind: 'a',
          name: 'a',
        },
        facts: {
          testnumberfact: 1,
        },
      },
    ];
  }),
};
const cadence = '1 * * * *';
describe('FactRetrieverEngine', () => {
  let engine: FactRetrieverEngine;
  let factSchemaAssertionCallback: (
    factSchemaDefinition: FactSchemaDefinition,
  ) => void;
  let factInsertionAssertionCallback: (facts: TechInsightFact[]) => void;

  const mockRepository: TechInsightsStore = {
    insertFacts: (facts: TechInsightFact[]) => {
      factInsertionAssertionCallback(facts);
      return Promise.resolve();
    },
    insertFactSchema: (def: FactSchemaDefinition) => {
      factSchemaAssertionCallback(def);
      return Promise.resolve();
    },
  } as unknown as TechInsightsStore;

  const mockFactRetrieverRegistry: FactRetrieverRegistry = {
    listRetrievers(): FactRetriever[] {
      return [testFactRetriever];
    },
    listRegistrations(): FactRetrieverRegistration[] {
      return [{ factRetriever: testFactRetriever, cadence }];
    },
    get: (_: string): FactRetrieverRegistration => {
      return { factRetriever: testFactRetriever, cadence };
    },
  } as unknown as FactRetrieverRegistry;

  const databases = TestDatabases.create({
    ids: ['POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });

  async function defaultEngineConfig(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    const manager = new PluginTaskScheduler(async () => knex, getVoidLogger());
    return {
      factRetrieverContext: {
        logger: getVoidLogger(),
        config: ConfigReader.fromConfigs([]),
        discovery: {
          getBaseUrl: (_: string) => Promise.resolve('http://mock.url'),
          getExternalBaseUrl: (_: string) => Promise.resolve('http://mock.url'),
        },
      },
      factRetrieverRegistry: mockFactRetrieverRegistry,
      repository: mockRepository,
      scheduler: manager,
    };
  }

  it.each(databases.eachSupportedId())(
    'Should update fact retriever schemas on initialization',
    async databaseId => {
      factSchemaAssertionCallback = ({ id, schema, version, entityFilter }) => {
        expect(id).toEqual('test_factretriever');
        expect(version).toEqual('0.0.1');
        expect(entityFilter).toEqual([{ kind: 'component' }]);
        expect(schema).toEqual({
          testnumberfact: {
            type: 'integer',
            description: '',
          },
        });
      };

      engine = await FactRetrieverEngine.create(
        await defaultEngineConfig(databaseId),
      );
    },
  );

  it.each(databases.eachSupportedId())(
    'Should insert facts when scheduled step is run',
    async databaseId => {
      factSchemaAssertionCallback = () => {};
      factInsertionAssertionCallback = facts => {
        expect(facts).toHaveLength(1);
        expect(facts[0]).toEqual({
          ref: 'test_factretriever',
          entity: {
            namespace: 'a',
            kind: 'a',
            name: 'a',
          },
          facts: {
            testnumberfact: 1,
          },
        });
      };
      engine = await FactRetrieverEngine.create(
        await defaultEngineConfig(databaseId),
      );
      engine.schedule();
      const job: FactRetrieverRegistration =
        engine.getJobRegistration('test_factretriever');
      await engine.runJobOnce(job.factRetriever.id);
      expect(job.cadence!!).toEqual(cadence);
      expect(testFactRetriever.handler).toHaveBeenCalledWith(
        expect.objectContaining({
          entityFilter: testFactRetriever.entityFilter,
        }),
      );
    },
  );
});
