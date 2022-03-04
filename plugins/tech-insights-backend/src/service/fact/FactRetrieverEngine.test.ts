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
import { DatabaseManager, getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { TaskScheduler } from '@backstage/backend-tasks';
import waitForExpect from 'wait-for-expect';

function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

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
const defaultCadence = '1 * * * *';
describe('FactRetrieverEngine', () => {
  let engine: FactRetrieverEngine;
  type FactSchemaAssertionCallback = (
    factSchemaDefinition: FactSchemaDefinition,
  ) => void;

  jest.setTimeout(15000);

  type FactInsertionAssertionCallback = ({
    facts,
    id,
  }: {
    id: string;
    facts: TechInsightFact[];
  }) => void;

  function createMockRepository(
    insertCallback: FactInsertionAssertionCallback,
    assertionCallback: FactSchemaAssertionCallback,
  ): TechInsightsStore {
    return {
      insertFacts: ({
        facts,
        id,
      }: {
        facts: TechInsightFact[];
        id: string;
      }) => {
        insertCallback({ facts, id });
        return Promise.resolve();
      },
      insertFactSchema: (def: FactSchemaDefinition) => {
        assertionCallback(def);
        return Promise.resolve();
      },
    } as unknown as TechInsightsStore;
  }

  function createMockFactRetrieverRegistry(
    cadence?: string,
    factRetriever?: FactRetriever,
  ): FactRetrieverRegistry {
    const cron = cadence ? cadence : defaultCadence;
    const retriever: FactRetriever = factRetriever
      ? factRetriever
      : testFactRetriever;
    return {
      listRetrievers(): FactRetriever[] {
        return [retriever];
      },
      listRegistrations(): FactRetrieverRegistration[] {
        return [{ factRetriever: retriever, cadence: cron }];
      },
      get: (_: string): FactRetrieverRegistration => {
        return { factRetriever: retriever, cadence: cron };
      },
    } as unknown as FactRetrieverRegistry;
  }

  const databases = TestDatabases.create({
    ids: ['POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });

  async function createEngine(
    databaseId: TestDatabaseId,
    insert: FactInsertionAssertionCallback,
    schema: FactSchemaAssertionCallback,
    cadence?: string,
    factRetriever?: FactRetriever,
  ): Promise<FactRetrieverEngine> {
    const knex = await databases.init(databaseId);
    const databaseManager: Partial<DatabaseManager> = {
      forPlugin: (_: string) => ({
        getClient: async () => knex,
      }),
    };
    const manager = databaseManager as DatabaseManager;
    const scheduler = new TaskScheduler(manager, getVoidLogger());
    return await FactRetrieverEngine.create({
      factRetrieverContext: {
        logger: getVoidLogger(),
        config: ConfigReader.fromConfigs([]),
        discovery: {
          getBaseUrl: (_: string) => Promise.resolve('http://mock.url'),
          getExternalBaseUrl: (_: string) => Promise.resolve('http://mock.url'),
        },
      },
      factRetrieverRegistry: createMockFactRetrieverRegistry(
        cadence,
        factRetriever,
      ),
      repository: createMockRepository(insert, schema),
      scheduler: scheduler.forPlugin('tech-insights'),
    });
  }

  it.each(databases.eachSupportedId())(
    'Should update fact retriever schemas on initialization',
    async databaseId => {
      function schemaAssertionCallback(def: FactSchemaDefinition) {
        expect(def.id).toEqual('test_factretriever');
        expect(def.version).toEqual('0.0.1');
        expect(def.entityFilter).toEqual([{ kind: 'component' }]);
        expect(def.schema).toEqual({
          testnumberfact: {
            type: 'integer',
            description: '',
          },
        });
      }

      engine = await createEngine(
        databaseId,
        () => {},
        schemaAssertionCallback,
      );
    },
  );

  it.each(databases.eachSupportedId())(
    'Should insert facts when scheduled step is run',
    async databaseId => {
      function insertCallback({
        facts,
        id,
      }: {
        id: string;
        facts: TechInsightFact[];
      }) {
        expect(facts).toHaveLength(1);
        expect(id).toEqual('test_factretriever');
        expect(facts[0]).toEqual({
          entity: {
            namespace: 'a',
            kind: 'a',
            name: 'a',
          },
          facts: {
            testnumberfact: 1,
          },
        });
      }

      engine = await createEngine(databaseId, insertCallback, () => {});
      engine.schedule();
      const job: FactRetrieverRegistration = engine.getJobRegistration(
        testFactRetriever.id,
      );
      await engine.triggerJob(job.factRetriever.id);
      await sleep(6000);
      expect(job.cadence!!).toEqual(defaultCadence);
      expect(testFactRetriever.handler).toHaveBeenCalledWith(
        expect.objectContaining({
          entityFilter: testFactRetriever.entityFilter,
        }),
      );
    },
  );

  it.each(databases.eachSupportedId())(
    'Should run fact retriever manually twice',
    async databaseId => {
      function insertCallback({
        facts,
        id,
      }: {
        id: string;
        facts: TechInsightFact[];
      }) {
        expect(facts).toHaveLength(1);
        expect(id).toEqual(testFactRetriever.id);
        expect(facts[0]).toEqual({
          entity: {
            namespace: 'a',
            kind: 'a',
            name: 'a',
          },
          facts: {
            testnumberfact: 1,
          },
        });
      }
      // testing with a cron that is valid, but will allow us to manually trigger the job.
      const leapCron = '0 0 29 2 1';

      const copy = JSON.parse(
        JSON.stringify(testFactRetriever),
      ) as typeof testFactRetriever;
      let called = 0;
      copy.handler = jest.fn(async () => {
        called++;
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
      });
      engine = await createEngine(
        databaseId,
        insertCallback,
        () => {},
        leapCron,
      );
      engine.schedule();
      const job: FactRetrieverRegistration = engine.getJobRegistration(
        testFactRetriever.id,
      );
      expect(job.cadence!!).toEqual(leapCron);
      await engine.triggerJob(job.factRetriever.id);
      while (!(await engine.triggerJob(job.factRetriever.id))) {
        await sleep(6000);
      }
      await waitForExpect(() => {
        expect(called).toBeGreaterThanOrEqual(2);
      });
      expect(testFactRetriever.handler).toHaveBeenCalledWith(
        expect.objectContaining({
          entityFilter: testFactRetriever.entityFilter,
        }),
      );
    },
  );
});
