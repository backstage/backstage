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
    ref: 'test-schema',
    version: '0.0.1-test',
    schema: JSON.stringify({
      testNumberFact: {
        type: 'integer',
        description: 'Test fact with a number type',
        entityKinds: ['component'],
      },
    }),
  },
];
const additionalFactSchemas = [
  {
    ref: 'test-schema',
    version: '1.2.1-test',
    schema: JSON.stringify({
      testNumberFact: {
        type: 'integer',
        description: 'Test fact with a number type',
        entityKinds: ['component'],
      },
      testStringFact: {
        type: 'string',
        description: 'Test fact with a string type',
        entityKinds: ['service'],
      },
    }),
  },
  {
    ref: 'test-schema',
    version: '1.1.1-test',
    schema: JSON.stringify({
      testStringFact: {
        type: 'string',
        description: 'Test fact with a string type',
        entityKinds: ['service'],
      },
    }),
  },
];

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
    ref: 'test-fact',
    version: '0.0.1-test',
    entity: 'a/a/a',
    facts: JSON.stringify({
      testNumberFact: 1,
    }),
  },
  {
    timestamp: shortlyInTheFuture,
    ref: 'test-fact',
    version: '0.0.1-test',
    entity: 'a/a/a',
    facts: JSON.stringify({
      testNumberFact: 2,
    }),
  },
];

const additionalFacts = [
  {
    timestamp: farInTheFuture,
    ref: 'test-fact',
    version: '0.0.1-test',
    entity: 'a/a/a',
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
    ref: 'test-fact',
    entity: { namespace: 'a', kind: 'a', name: 'a' },
    timestamp: DateTime.fromISO(shortlyInTheFuture),
    version: '0.0.1-test',
    facts: { testNumberFact: 2 },
  };

  it('should be able to return latest schema', async () => {
    const schemas = await store.getLatestSchemas();
    expect(schemas[0]).toMatchObject({
      ref: 'test-schema',
      version: '0.0.1-test',
      schema: {
        testNumberFact: {
          type: 'integer',
          description: 'Test fact with a number type',
          entityKinds: ['component'],
        },
      },
    });
  });

  it('should return last schema based on semver', async () => {
    await testDbClient.batchInsert('fact_schemas', additionalFactSchemas);

    const schemas = await store.getLatestSchemas();
    expect(schemas[0]).toMatchObject({
      ref: 'test-schema',
      version: '1.2.1-test',
      schema: {
        testNumberFact: {
          type: 'integer',
          description: 'Test fact with a number type',
          entityKinds: ['component'],
        },
        testStringFact: {
          type: 'string',
          description: 'Test fact with a string type',
          entityKinds: ['service'],
        },
      },
    });
  });

  it('should return latest facts only for the correct ref', async () => {
    const returnedFact = await store.getLatestFactsForRefs(
      ['test-fact'],
      'a/a/a',
    );
    expect(returnedFact['test-fact']).toMatchObject(baseAssertionFact);
  });

  it('should return latest facts for multiple refs', async () => {
    await testDbClient.batchInsert(
      'facts',
      additionalFacts.map(fact => ({
        ...fact,
        ref: 'second-test-fact',
        timestamp: farInTheFuture,
      })),
    );
    const returnedFacts = await store.getLatestFactsForRefs(
      ['test-fact', 'second-test-fact'],
      'a/a/a',
    );

    expect(returnedFacts['test-fact']).toMatchObject({
      ...baseAssertionFact,
    });
    expect(returnedFacts['second-test-fact']).toMatchObject({
      ...baseAssertionFact,
      ref: 'second-test-fact',
      timestamp: DateTime.fromISO(farInTheFuture),
      facts: { testNumberFact: 3 },
    });
  });

  it('should return facts correctly between time range', async () => {
    await testDbClient.batchInsert('facts', additionalFacts);
    const returnedFacts = await store.getFactsBetweenTimestampsForRefs(
      ['test-fact'],
      'a/a/a',
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
