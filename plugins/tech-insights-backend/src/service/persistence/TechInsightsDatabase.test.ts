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
import { DatabaseManager } from './DatabaseManager';
import { DateTime, Duration } from 'luxon';
import { TechInsightsStore } from '@backstage/plugin-tech-insights-common';
import { Knex } from 'knex';

const factSchemas = [
  {
    id: 'test-fact',
    version: '0.0.1-test',
    entityTypes: ['component'],
    schema: JSON.stringify({
      testNumberFact: {
        type: 'integer',
        description: 'Test fact with a number type',
      },
    }),
  },
];
const additionalFactSchemas = [
  {
    id: 'test-fact',
    version: '1.2.1-test',
    entityTypes: ['component'],
    schema: JSON.stringify({
      testNumberFact: {
        type: 'integer',
        description: 'Test fact with a number type',
      },
      testStringFact: {
        type: 'string',
        description: 'Test fact with a string type',
      },
    }),
  },
  {
    id: 'test-fact',
    version: '1.1.1-test',
    entityTypes: ['component'],
    schema: JSON.stringify({
      testStringFact: {
        type: 'string',
        description: 'Test fact with a string type',
      },
    }),
  },
];

const secondSchema = {
  id: 'second-test-fact',
  version: '0.0.1-test',
  entityTypes: ['service'],
  schema: JSON.stringify({
    testStringFact: {
      type: 'string',
      description: 'Test fact with a string type',
    },
  }),
};

const now = DateTime.now().toISO();
const shortlyInTheFuture = DateTime.now()
  .plus(Duration.fromMillis(555))
  .toISO();
const farInTheFuture = DateTime.now()
  .plus(Duration.fromMillis(555666777))
  .toISO();

const facts = [
  {
    timestamp: now,
    id: 'test-fact',
    version: '0.0.1-test',
    entity: 'a:a/a',
    facts: JSON.stringify({
      testNumberFact: 1,
    }),
  },
  {
    timestamp: shortlyInTheFuture,
    id: 'test-fact',
    version: '0.0.1-test',
    entity: 'a:a/a',
    facts: JSON.stringify({
      testNumberFact: 2,
    }),
  },
];

const additionalFacts = [
  {
    timestamp: farInTheFuture,
    id: 'test-fact',
    version: '0.0.1-test',
    entity: 'a:a/a',
    facts: JSON.stringify({
      testNumberFact: 3,
    }),
  },
];

describe('Tech Insights database', () => {
  let store: TechInsightsStore;
  let testDbClient: Knex<any, unknown[]>;
  beforeAll(async () => {
    testDbClient = await DatabaseManager.createTestDatabaseConnection();
    store = (await DatabaseManager.createTestDatabase(testDbClient))
      .techInsightsStore;
    await testDbClient.batchInsert('fact_schemas', factSchemas);
    await testDbClient.batchInsert('facts', facts);
  });

  const baseAssertionFact = {
    id: 'test-fact',
    entity: { namespace: 'a', kind: 'a', name: 'a' },
    timestamp: DateTime.fromISO(shortlyInTheFuture),
    version: '0.0.1-test',
    facts: { testNumberFact: 2 },
  };

  it('should be able to return latest schema', async () => {
    const schemas = await store.getLatestSchemas();
    expect(schemas[0]).toMatchObject({
      id: 'test-fact',
      version: '0.0.1-test',
      entityTypes: ['component'],
      testNumberFact: {
        type: 'integer',
        description: 'Test fact with a number type',
      },
    });
  });

  it('should return last schema based on semver', async () => {
    await testDbClient.batchInsert('fact_schemas', additionalFactSchemas);

    const schemas = await store.getLatestSchemas();
    expect(schemas[0]).toMatchObject({
      id: 'test-fact',
      version: '1.2.1-test',
      entityTypes: ['component'],
      testNumberFact: {
        type: 'integer',
        description: 'Test fact with a number type',
      },
      testStringFact: {
        type: 'string',
        description: 'Test fact with a string type',
      },
    });
  });

  it('should return multiple schemas if those exists', async () => {
    await testDbClient.batchInsert('fact_schemas', [
      {
        ...secondSchema,
        id: 'second',
      },
    ]);

    const schemas = await store.getLatestSchemas();
    expect(schemas).toHaveLength(2);
    expect(schemas[0]).toMatchObject({
      id: 'test-fact',
      version: '1.2.1-test',
      entityTypes: ['component'],
      testNumberFact: {
        type: 'integer',
        description: 'Test fact with a number type',
      },
      testStringFact: {
        type: 'string',
        description: 'Test fact with a string type',
      },
    });
    expect(schemas[1]).toMatchObject({
      id: 'second',
      version: '0.0.1-test',
      entityTypes: ['service'],
      testStringFact: {
        type: 'string',
        description: 'Test fact with a string type',
      },
    });
  });

  it('should return latest facts only for the correct id', async () => {
    const returnedFact = await store.getLatestFactsByIds(
      ['test-fact'],
      'a:a/a',
    );
    expect(returnedFact['test-fact']).toMatchObject(baseAssertionFact);
  });

  it('should return latest facts for multiple ids', async () => {
    await testDbClient.batchInsert('fact_schemas', [secondSchema]);
    await testDbClient.batchInsert(
      'facts',
      additionalFacts.map(fact => ({
        ...fact,
        id: 'second-test-fact',
        timestamp: farInTheFuture,
      })),
    );
    const returnedFacts = await store.getLatestFactsByIds(
      ['test-fact', 'second-test-fact'],
      'a:a/a',
    );

    expect(returnedFacts['test-fact']).toMatchObject({
      ...baseAssertionFact,
    });
    expect(returnedFacts['second-test-fact']).toMatchObject({
      ...baseAssertionFact,
      id: 'second-test-fact',
      timestamp: DateTime.fromISO(farInTheFuture),
      facts: { testNumberFact: 3 },
    });
  });

  it('should return facts correctly between time range', async () => {
    await testDbClient.batchInsert('facts', additionalFacts);
    const returnedFacts = await store.getFactsBetweenTimestampsByIds(
      ['test-fact'],
      'a:a/a',
      DateTime.fromISO(now),
      DateTime.fromISO(shortlyInTheFuture).plus(Duration.fromMillis(10)),
    );
    expect(returnedFacts['test-fact']).toHaveLength(2);

    expect(returnedFacts['test-fact'][0]).toMatchObject({
      ...baseAssertionFact,
      timestamp: DateTime.fromISO(now),
      facts: { testNumberFact: 1 },
    });
    expect(returnedFacts['test-fact'][1]).toMatchObject({
      ...baseAssertionFact,
    });
    expect(returnedFacts['test-fact']).not.toContainEqual({
      ...baseAssertionFact,
      timestamp: DateTime.fromISO(farInTheFuture),
      facts: { testNumberFact: 3 },
    });
  });
});
