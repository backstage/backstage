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
import { DateTime, Duration } from 'luxon';
import { TechInsightsStore } from '@backstage/plugin-tech-insights-node';
import { Knex } from 'knex';
import { TestDatabases } from '@backstage/backend-test-utils';
import { getVoidLogger } from '@backstage/backend-common';
import { initializePersistenceContext } from './persistenceContext';

const factSchemas = [
  {
    id: 'test-fact',
    version: '0.0.1-test',
    entityFilter: JSON.stringify([{ kind: 'component' }]),
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
    entityFilter: JSON.stringify([{ kind: 'component' }]),
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
    entityFilter: JSON.stringify([{ kind: 'component' }]),
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
  entityFilter: JSON.stringify([{ kind: 'service' }]),
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

const sameFactsDiffDateSchema = {
  id: 'same-fact-diff-date-test',
  version: '0.0.1-test',
  entityFilter: JSON.stringify([{ kind: 'service' }]),
  schema: JSON.stringify({
    testStringFact: {
      type: 'string',
      description: 'Test fact with a string type',
    },
  }),
};

const sameFactsDiffDateNow = DateTime.now().toISO();
const sameFactsDiffDateNearFuture = DateTime.now()
  .plus(Duration.fromMillis(555))
  .toISO();
const sameFactsDiffDateFuture = DateTime.now()
  .plus(Duration.fromMillis(1000))
  .toISO();

const multipleSameFacts = [
  {
    timestamp: sameFactsDiffDateNow,
    id: sameFactsDiffDateSchema.id,
    version: '0.0.1-test',
    entity: 'a:a/a',
    facts: JSON.stringify({
      testNumberFact: 1,
    }),
  },
  {
    timestamp: sameFactsDiffDateNearFuture,
    id: sameFactsDiffDateSchema.id,
    version: '0.0.1-test',
    entity: 'a:a/a',
    facts: JSON.stringify({
      testNumberFact: 2,
    }),
  },
  {
    timestamp: sameFactsDiffDateFuture,
    id: 'multiple-same-facts',
    version: '0.0.1-test',
    entity: 'a:a/a',
    facts: JSON.stringify({
      testNumberFact: 3,
    }),
  },
];

describe('Tech Insights database', () => {
  const databases = TestDatabases.create();
  let store: TechInsightsStore;
  let testDbClient: Knex<any, unknown[]>;
  beforeAll(async () => {
    testDbClient = await databases.init('SQLITE_3');

    store = (
      await initializePersistenceContext(testDbClient, {
        logger: getVoidLogger(),
      })
    ).techInsightsStore;
  });
  beforeEach(async () => {
    await testDbClient.batchInsert('fact_schemas', factSchemas);
    await testDbClient.batchInsert('facts', facts);
  });
  afterEach(async () => {
    await testDbClient('facts').delete();
    await testDbClient('fact_schemas').delete();
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
      entityFilter: [{ kind: 'component' }],
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
      entityFilter: [{ kind: 'component' }],
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
      version: '0.0.1-test',
      entityFilter: [{ kind: 'component' }],
      testNumberFact: {
        type: 'integer',
        description: 'Test fact with a number type',
      },
    });
    expect(schemas[1]).toMatchObject({
      id: 'second',
      version: '0.0.1-test',
      entityFilter: [{ kind: 'service' }],
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

  it('should return latest fact with multiple entries', async () => {
    await testDbClient.batchInsert('fact_schemas', [sameFactsDiffDateSchema]);
    await testDbClient.batchInsert(
      'facts',
      multipleSameFacts.map(fact => ({
        ...fact,
        id: sameFactsDiffDateSchema.id,
      })),
    );

    const returnedFacts = await store.getLatestFactsByIds(
      ['test-fact', sameFactsDiffDateSchema.id],
      'a:a/a',
    );

    expect(returnedFacts['test-fact']).toMatchObject({
      ...baseAssertionFact,
    });

    expect(returnedFacts[sameFactsDiffDateSchema.id]).toMatchObject({
      ...baseAssertionFact,
      id: sameFactsDiffDateSchema.id,
      timestamp: DateTime.fromISO(sameFactsDiffDateFuture),
      facts: { testNumberFact: 3 },
    });
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

  it('should delete extraneous rows when MaxItems is defined. Should leave only n latest', async () => {
    const deviledFact = (it: {}) => ({
      ...it,
      facts: JSON.stringify({
        testNumberFact: 666,
      }),
    });
    await testDbClient.batchInsert('facts', additionalFacts.map(deviledFact));

    const preInsertionFacts = await testDbClient('facts').select();
    expect(preInsertionFacts).toHaveLength(3);

    const timestamp = DateTime.now().plus(Duration.fromMillis(1111));
    const factToBeInserted = {
      timestamp: timestamp,
      entity: {
        namespace: 'a',
        kind: 'a',
        name: 'a',
      },
      facts: {
        testNumberFact: 555,
      },
    };
    const maxItems = 2;
    await store.insertFacts({
      id: 'test-fact',
      facts: [factToBeInserted],
      lifecycle: { maxItems },
    });

    const afterInsertionFacts = await testDbClient('facts').select();
    expect(afterInsertionFacts).toHaveLength(maxItems);
    expect(afterInsertionFacts[0]).toMatchObject(
      deviledFact(additionalFacts[0]),
    );
    expect(afterInsertionFacts[1]).toMatchObject({
      id: 'test-fact',
      version: '0.0.1-test',
      timestamp: timestamp.toISO(),
      entity: 'a:a/a',
      facts: JSON.stringify({ testNumberFact: 555 }),
    });
  });

  it('should delete extraneous rows for each entity when MaxItems is defined. Should leave only n latest', async () => {
    const deviledFact = (it: {}) => ({
      ...it,
      facts: JSON.stringify({
        testNumberFact: 666,
      }),
    });
    await testDbClient.batchInsert('facts', additionalFacts.map(deviledFact));

    const preInsertionFacts = await testDbClient('facts').select();

    expect(preInsertionFacts).toHaveLength(3);

    await testDbClient.batchInsert(
      'facts',
      preInsertionFacts.map(it => ({ ...it, entity: 'b:b/b' })),
    );

    const timestamp = DateTime.now().plus(Duration.fromMillis(1111));
    const factsToBeInserted = [
      {
        timestamp: timestamp,
        entity: {
          namespace: 'a',
          kind: 'a',
          name: 'a',
        },
        facts: {
          testNumberFact: 555,
        },
      },
      {
        timestamp: timestamp,
        entity: {
          namespace: 'b',
          kind: 'b',
          name: 'b',
        },
        facts: {
          testNumberFact: 555,
        },
      },
    ];
    const maxItems = 2;
    await store.insertFacts({
      id: 'test-fact',
      facts: factsToBeInserted,
      lifecycle: { maxItems },
    });

    const afterInsertionFacts = await testDbClient('facts').select();

    const inserted = {
      id: 'test-fact',
      version: '0.0.1-test',
      timestamp: timestamp.toISO(),
      entity: 'a:a/a',
      facts: JSON.stringify({ testNumberFact: 555 }),
    };
    expect(afterInsertionFacts).toHaveLength(maxItems * 2);
    expect(afterInsertionFacts[0]).toMatchObject(
      deviledFact(additionalFacts[0]),
    );

    expect(afterInsertionFacts[1]).toMatchObject({
      ...deviledFact(additionalFacts[0]),
      entity: 'b:b/b',
    });
    expect(afterInsertionFacts[2]).toMatchObject(inserted);
    expect(afterInsertionFacts[3]).toMatchObject({
      ...inserted,
      entity: 'b:b/b',
    });
  });

  it('should delete extraneous rows when TTL is defined. Should leave only items with timestamp greater than TTL', async () => {
    const oldStaledOutFact = (it: {}) => ({
      ...it,
      facts: JSON.stringify({
        testNumberFact: 666,
      }),
      timestamp: DateTime.now().minus({ weeks: 3 }).toISO(),
    });
    await testDbClient.batchInsert(
      'facts',
      additionalFacts.map(oldStaledOutFact),
    );

    const preInsertionFacts = await testDbClient('facts').select();
    expect(preInsertionFacts).toHaveLength(3);

    const timestamp = DateTime.now().plus(Duration.fromMillis(1111));
    const factToBeInserted = {
      timestamp: timestamp,
      entity: {
        namespace: 'a',
        kind: 'a',
        name: 'a',
      },
      facts: {
        testNumberFact: 555,
      },
    };
    await store.insertFacts({
      id: 'test-fact',
      facts: [factToBeInserted],
      lifecycle: { timeToLive: { weeks: 2 } },
    });

    const afterInsertionFacts = await testDbClient('facts')
      .select()
      .orderBy('timestamp', 'desc');
    expect(afterInsertionFacts).toHaveLength(3);
    expect(afterInsertionFacts[0]).toMatchObject({
      id: 'test-fact',
      version: '0.0.1-test',
      timestamp: timestamp.toISO(),
      entity: 'a:a/a',
      facts: JSON.stringify({ testNumberFact: 555 }),
    });
    expect(afterInsertionFacts[1]).toMatchObject(facts[1]);
    expect(afterInsertionFacts[2]).toMatchObject(facts[0]);

    expect(afterInsertionFacts).not.toContainEqual(
      oldStaledOutFact(additionalFacts[0]),
    );
  });

  it('should delete extraneous rows for each entity when TTL expired', async () => {
    const oldStaledOutFact = (it: {}) => ({
      ...it,
      facts: JSON.stringify({
        testNumberFact: 666,
      }),
      timestamp: DateTime.now().minus({ weeks: 3 }).toISO(),
    });
    await testDbClient.batchInsert(
      'facts',
      additionalFacts.map(oldStaledOutFact),
    );

    const preInsertionFacts = await testDbClient('facts').select();
    expect(preInsertionFacts).toHaveLength(3);

    await testDbClient.batchInsert(
      'facts',
      preInsertionFacts.map(it => ({ ...it, entity: 'b:b/b' })),
    );

    const timestamp = DateTime.now().plus(Duration.fromMillis(1111));
    const factsToBeInserted = [
      {
        timestamp: timestamp,
        entity: {
          namespace: 'a',
          kind: 'a',
          name: 'a',
        },
        facts: {
          testNumberFact: 555,
        },
      },
      {
        timestamp: timestamp,
        entity: {
          namespace: 'b',
          kind: 'b',
          name: 'b',
        },
        facts: {
          testNumberFact: 555,
        },
      },
    ];
    await store.insertFacts({
      id: 'test-fact',
      facts: factsToBeInserted,
      lifecycle: { timeToLive: { weeks: 2 } },
    });

    const afterInsertionFacts = await testDbClient('facts')
      .select()
      .orderBy('timestamp', 'desc');

    expect(afterInsertionFacts).toHaveLength(6);
    expect(afterInsertionFacts[0]).toMatchObject({
      id: 'test-fact',
      version: '0.0.1-test',
      timestamp: timestamp.toISO(),
      entity: 'a:a/a',
      facts: JSON.stringify({ testNumberFact: 555 }),
    });
    expect(afterInsertionFacts[1]).toMatchObject({
      id: 'test-fact',
      version: '0.0.1-test',
      timestamp: timestamp.toISO(),
      entity: 'b:b/b',
      facts: JSON.stringify({ testNumberFact: 555 }),
    });
    expect(afterInsertionFacts[2]).toMatchObject(facts[1]);
    expect(afterInsertionFacts[3]).toMatchObject({
      ...facts[1],
      entity: 'b:b/b',
    });
    expect(afterInsertionFacts[4]).toMatchObject(facts[0]);
    expect(afterInsertionFacts[5]).toMatchObject({
      ...facts[0],
      entity: 'b:b/b',
    });

    expect(afterInsertionFacts).not.toContainEqual(
      oldStaledOutFact(additionalFacts[0]),
    );
    expect(afterInsertionFacts).not.toContainEqual({
      ...oldStaledOutFact(additionalFacts[0]),
      entity: 'b:b/b',
    });
  });
});
