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
  FactRetrieverRegistry,
  FactSchemaDefinition,
  TechInsightFact,
  TechInsightsStore,
} from '@backstage/plugin-tech-insights-node';
import {
  DefaultFactRetrieverEngine,
  FactRetrieverEngine,
} from './FactRetrieverEngine';
import {
  DatabaseManager,
  getVoidLogger,
  ServerTokenManager,
} from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { TaskScheduler } from '@backstage/backend-tasks';

jest.setTimeout(60_000);

const testFactRetriever: FactRetriever = {
  id: 'test_factretriever',
  version: '0.0.1',
  title: 'Test 1',
  description: 'testing',
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
      async insertFacts(f: { facts: TechInsightFact[]; id: string }) {
        insertCallback(f);
      },
      async insertFactSchema(def: FactSchemaDefinition) {
        assertionCallback(def);
      },
    } as unknown as TechInsightsStore;
  }

  function createMockFactRetrieverRegistry(
    cadence?: string,
    factRetriever?: FactRetriever,
  ): FactRetrieverRegistry {
    const cron = cadence ?? defaultCadence;
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
    ids: ['POSTGRES_16', 'POSTGRES_12', 'SQLITE_3'],
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
    return await DefaultFactRetrieverEngine.create({
      factRetrieverContext: {
        logger: getVoidLogger(),
        config: ConfigReader.fromConfigs([]),
        tokenManager: ServerTokenManager.noop(),
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
    'Should update fact retriever schemas on initialization with %s',
    async databaseId => {
      const schemaAssertionCallback = jest.fn((def: FactSchemaDefinition) => {
        expect(def.id).toEqual('test_factretriever');
        expect(def.version).toEqual('0.0.1');
        expect(def.entityFilter).toEqual([{ kind: 'component' }]);
        expect(def.schema).toEqual({
          testnumberfact: {
            type: 'integer',
            description: '',
          },
        });
      });

      engine = await createEngine(
        databaseId,
        () => {},
        schemaAssertionCallback,
      );
      expect(schemaAssertionCallback).toHaveBeenCalled();
    },
  );

  it.each(databases.eachSupportedId())(
    'Should insert facts when scheduled step is run with %s',
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

      jest.useFakeTimers();

      try {
        const handler = jest.fn();
        engine = await createEngine(
          databaseId,
          insertCallback,
          () => {},
          undefined,
          { ...testFactRetriever, handler },
        );
        await engine.schedule();
        const job = await engine.getJobRegistration(testFactRetriever.id);
        expect(job.cadence!!).toEqual(defaultCadence);

        await engine.triggerJob(job.factRetriever.id);
        jest.advanceTimersByTime(5000);

        const handlerParam = await new Promise(resolve =>
          handler.mockImplementation(resolve),
        );

        await expect(handlerParam).toEqual(
          expect.objectContaining({
            entityFilter: testFactRetriever.entityFilter,
          }),
        );
      } finally {
        jest.useRealTimers();
      }
    },
  );
});
