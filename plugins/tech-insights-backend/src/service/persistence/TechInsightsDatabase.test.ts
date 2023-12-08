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
import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
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

const baseTimestamp = DateTime.fromISO('2023-12-01T12:00:00.000Z', {
  zone: 'UTC',
});
const now = baseTimestamp.toISO()!;
const shortlyInTheFuture = baseTimestamp
  .plus(Duration.fromObject({ seconds: 1 }))
  .toISO()!;
const farInTheFuture = baseTimestamp
  .plus(Duration.fromObject({ years: 10 }))
  .toISO()!;

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

const sameFactsDiffDateNow = baseTimestamp.toISO()!;
const sameFactsDiffDateNearFuture = baseTimestamp
  .plus(Duration.fromObject({ seconds: 1 }))
  .toISO()!;
const sameFactsDiffDateFuture = baseTimestamp
  .plus(Duration.fromObject({ days: 1 }))
  .toISO()!;

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
  const databases = TestDatabases.create({
    ids: ['POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });

  async function createStore(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    const { techInsightsStore } = await initializePersistenceContext(
      { getClient: async () => knex },
      { logger: getVoidLogger() },
    );

    await knex.batchInsert('fact_schemas', factSchemas);
    await knex.batchInsert('facts', facts);

    async function rawFacts() {
      const rows = await knex('facts').select();
      return rows.map(it => ({
        ...it,
        timestamp:
          it.timestamp === 'string'
            ? DateTime.fromISO(it.timestamp)
            : DateTime.fromJSDate(it.timestamp),
      }));
    }

    return { store: techInsightsStore, knex, rawFacts };
  }

  const baseAssertionFact = {
    id: 'test-fact',
    entity: { namespace: 'a', kind: 'a', name: 'a' },
    timestamp: DateTime.fromISO(shortlyInTheFuture),
    version: '0.0.1-test',
    facts: { testNumberFact: 2 },
  };

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip.each(databases.eachSupportedId())(
    'should be able to return latest schema, %p',
    async databaseId => {
      const { store } = await createStore(databaseId);
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
    },
  );

  it.each(databases.eachSupportedId())(
    'should return last schema based on semver, %p',
    async databaseId => {
      const { store, knex } = await createStore(databaseId);
      await knex.batchInsert('fact_schemas', additionalFactSchemas);

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
    },
  );

  it.each(databases.eachSupportedId())(
    'should return multiple schemas if those exists, %p',
    async databaseId => {
      const { store, knex } = await createStore(databaseId);
      await knex.batchInsert('fact_schemas', [
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
    },
  );

  it.each(databases.eachSupportedId())(
    'should return latest facts only for the correct id, %p',
    async databaseId => {
      const { store } = await createStore(databaseId);
      const returnedFact = await store.getLatestFactsByIds(
        ['test-fact'],
        'a:a/a',
      );
      expect(returnedFact['test-fact']).toMatchObject(baseAssertionFact);
    },
  );

  it.each(databases.eachSupportedId())(
    'should return latest fact with multiple entries, %p',
    async databaseId => {
      const { store, knex } = await createStore(databaseId);
      await knex.batchInsert('fact_schemas', [sameFactsDiffDateSchema]);
      await knex.batchInsert(
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
    },
  );

  it.each(databases.eachSupportedId())(
    'should return latest facts for multiple ids, %p',
    async databaseId => {
      const { store, knex } = await createStore(databaseId);
      await knex.batchInsert('fact_schemas', [secondSchema]);
      await knex.batchInsert(
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
    },
  );

  it.each(databases.eachSupportedId())(
    'should return facts correctly between time range, %p',
    async databaseId => {
      const { store, knex } = await createStore(databaseId);
      await knex.batchInsert('facts', additionalFacts);
      const returnedFacts = await store.getFactsBetweenTimestampsByIds(
        ['test-fact'],
        'a:a/a',
        DateTime.fromISO(now),
        DateTime.fromISO(shortlyInTheFuture).plus(
          Duration.fromObject({ seconds: 1 }),
        ),
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
    },
  );

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip.each(databases.eachSupportedId())(
    'should delete extraneous rows when MaxItems is defined. Should leave only n latest, %p',
    async databaseId => {
      const { store, knex, rawFacts } = await createStore(databaseId);
      const deviledFact = (it: {}) => ({
        ...it,
        facts: JSON.stringify({
          testNumberFact: 666,
        }),
      });
      await knex.batchInsert('facts', additionalFacts.map(deviledFact));

      const preInsertionFacts = await rawFacts();
      expect(preInsertionFacts).toHaveLength(3);

      const timestamp = baseTimestamp.plus(Duration.fromObject({ seconds: 2 }));
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

      const afterInsertionFacts = await rawFacts();
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
    },
  );

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip.each(databases.eachSupportedId())(
    'should delete extraneous rows for each entity when MaxItems is defined. Should leave only n latest, %p',
    async databaseId => {
      const { store, knex, rawFacts } = await createStore(databaseId);
      const deviledFact = (it: {}) => ({
        ...it,
        facts: JSON.stringify({
          testNumberFact: 666,
        }),
      });
      await knex.batchInsert('facts', additionalFacts.map(deviledFact));

      const preInsertionFacts = await rawFacts();

      expect(preInsertionFacts).toHaveLength(3);

      await knex.batchInsert(
        'facts',
        preInsertionFacts.map(it => ({ ...it, entity: 'b:b/b' })),
      );

      const timestamp = baseTimestamp.plus(Duration.fromObject({ seconds: 2 }));
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

      const afterInsertionFacts = await rawFacts();

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
    },
  );

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip.each(databases.eachSupportedId())(
    'should delete extraneous rows when TTL is defined. Should leave only items with timestamp greater than TTL, %p',
    async databaseId => {
      const { store, knex, rawFacts } = await createStore(databaseId);
      const oldStaledOutFact = (it: {}) => ({
        ...it,
        facts: JSON.stringify({
          testNumberFact: 666,
        }),
        timestamp: baseTimestamp.minus({ weeks: 3 }).toISO(),
      });
      await knex.batchInsert('facts', additionalFacts.map(oldStaledOutFact));

      const preInsertionFacts = await rawFacts();
      expect(preInsertionFacts).toHaveLength(3);

      const timestamp = baseTimestamp.plus(Duration.fromObject({ seconds: 2 }));
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

      const afterInsertionFacts = await knex('facts')
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
    },
  );

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip.each(databases.eachSupportedId())(
    'should delete extraneous rows for each entity when TTL expired, %p',
    async databaseId => {
      const { store, knex, rawFacts } = await createStore(databaseId);
      const oldStaledOutFact = (it: {}) => ({
        ...it,
        facts: JSON.stringify({
          testNumberFact: 666,
        }),
        timestamp: baseTimestamp.minus({ weeks: 3 }).toISO(),
      });
      await knex.batchInsert('facts', additionalFacts.map(oldStaledOutFact));

      const preInsertionFacts = await rawFacts();
      expect(preInsertionFacts).toHaveLength(3);

      await knex.batchInsert(
        'facts',
        preInsertionFacts.map(it => ({ ...it, entity: 'b:b/b' })),
      );

      const timestamp = baseTimestamp.plus(Duration.fromObject({ seconds: 2 }));
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

      const afterInsertionFacts = await knex('facts')
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
    },
  );
});
