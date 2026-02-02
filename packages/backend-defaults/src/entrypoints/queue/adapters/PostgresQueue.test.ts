/*
 * Copyright 2026 The Backstage Authors
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
  mockServices,
  TestDatabaseId,
  TestDatabases,
} from '@backstage/backend-test-utils';
import { PostgresQueue } from './PostgresQueue';
import { DLQHandler, Job } from '@backstage/backend-plugin-api';
import PgBoss from 'pg-boss';
import waitForExpect from 'wait-for-expect';

const mockLogger = mockServices.logger.mock();

jest.setTimeout(60_000);

describe('PostgresQueue', () => {
  const databases = TestDatabases.create({
    ids: ['POSTGRES_18', 'POSTGRES_14'],
  });

  const testCases = databases.eachSupportedId();

  if (testCases.length === 0) {
    // We need to skip here because the testCases will be empty, and
    // it's not possible to run these tests against SQLite.
    // eslint-disable-next-line jest/expect-expect
    it.skip('skips PostgresQueue tests (no supported databases)', () => {});
    return;
  }

  async function createQueue({
    databaseId,
    schema,
    queueName,
    maxAttempts,
    dlqHandler,
  }: {
    databaseId: TestDatabaseId;
    schema: string;
    queueName: string;
    maxAttempts?: number;
    dlqHandler?: DLQHandler;
  }) {
    const knex = await databases.init(databaseId);
    const { connection } = knex.client.config;
    const connectionString =
      typeof connection === 'string'
        ? connection
        : `postgresql://${connection.user}:${connection.password}@${connection.host}:${connection.port}/${connection.database}`;

    const boss = new PgBoss({
      connectionString,
      schema,
      migrate: true,
    });
    await boss.start();

    const queue = new PostgresQueue({
      boss,
      logger: mockLogger,
      queueName,
      maxAttempts,
      dlqHandler,
    });

    return { boss, queue, knex };
  }

  describe.each(testCases)('%p', databaseId => {
    it('should process jobs in order', async () => {
      const { boss, queue, knex } = await createQueue({
        databaseId,
        schema: 'test_queue_order',
        queueName: 'test_order',
      });

      try {
        const processed: any[] = [];

        queue.process(async (job: Job) => {
          processed.push(job.payload);
        });

        await queue.add({ id: 1 });
        await queue.add({ id: 2 });
        await queue.add({ id: 3 });

        await waitForExpect(() => {
          expect(processed).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
        }, 5000);
      } finally {
        await queue.disconnect();
        await boss.stop();
        await knex.destroy();
      }
    });

    it('should handle priorities', async () => {
      const { boss, queue, knex } = await createQueue({
        databaseId,
        schema: 'test_queue_priority',
        queueName: 'test_priority',
      });

      try {
        const processed: any[] = [];

        await queue.pause();

        await queue.add({ id: 'low' }, { priority: 50 });
        await queue.add({ id: 'high' }, { priority: 5 });
        await queue.add({ id: 'medium' }, { priority: 20 });

        queue.process(async (job: Job) => {
          processed.push(job.payload);
        });

        await queue.resume();
        await waitForExpect(() => {
          expect(processed).toEqual([
            { id: 'high' },
            { id: 'medium' },
            { id: 'low' },
          ]);
        }, 5000);
      } finally {
        await queue.disconnect();
        await boss.stop();
        await knex.destroy();
      }
    });

    it('should handle delays', async () => {
      const { boss, queue, knex } = await createQueue({
        databaseId,
        schema: 'test_queue_delay',
        queueName: 'test_delay',
      });

      try {
        const processed: any[] = [];

        queue.process(async (job: Job) => {
          processed.push(job.payload);
        });

        await queue.add({ id: 'immediate' });
        await queue.add({ id: 'delayed' }, { delay: 1000 });

        const start = Date.now();
        await waitForExpect(() => {
          expect(processed).toEqual([{ id: 'immediate' }]);
          expect(Date.now() - start).toBeGreaterThanOrEqual(500);
        }, 3000);

        await waitForExpect(() => {
          expect(processed).toEqual([{ id: 'immediate' }, { id: 'delayed' }]);
        }, 5000);
      } finally {
        await queue.disconnect();
        await boss.stop();
        await knex.destroy();
      }
    });

    it('should retry failed jobs up to maxAttempts', async () => {
      const { boss, queue, knex } = await createQueue({
        databaseId,
        schema: 'test_queue_retry',
        queueName: 'test_retry',
        maxAttempts: 3,
      });

      try {
        const attempts: number[] = [];

        queue.process(async (job: Job) => {
          attempts.push(job.attempt);
          throw new Error('Job failed');
        });

        await queue.add({ id: 1 });

        await waitForExpect(() => {
          expect(attempts).toEqual([1, 2, 3]);
        }, 9000);
      } finally {
        await queue.disconnect();
        await boss.stop();
        await knex.destroy();
      }
    });

    it('should call DLQ handler after maxAttempts', async () => {
      const dlqHandler = jest.fn();
      const { boss, queue, knex } = await createQueue({
        databaseId,
        schema: 'test_queue_dlq',
        queueName: 'test_dlq',
        maxAttempts: 2,
        dlqHandler,
      });

      try {
        const attempts: number[] = [];

        queue.process(async (job: Job) => {
          attempts.push(job.attempt);
          throw new Error('Job failed');
        });

        await queue.add({ id: 'failing' });

        await waitForExpect(() => {
          expect(attempts).toEqual([1, 2]);
        }, 6000);

        expect(dlqHandler).toHaveBeenCalledTimes(1);
        expect(dlqHandler).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: { id: 'failing' },
            attempt: 2,
          }),
          expect.any(Error),
        );
      } finally {
        await queue.disconnect();
        await boss.stop();
        await knex.destroy();
      }
    });

    it('should not retry successful jobs', async () => {
      const { boss, queue, knex } = await createQueue({
        databaseId,
        schema: 'test_queue_success',
        queueName: 'test_success',
        maxAttempts: 3,
      });

      try {
        const attempts: number[] = [];

        queue.process(async (job: Job) => {
          attempts.push(job.attempt);
        });

        await queue.add({ id: 1 });

        const start = Date.now();
        await waitForExpect(() => {
          expect(attempts).toEqual([1]);
          expect(Date.now() - start).toBeGreaterThanOrEqual(1000);
        }, 2000);
      } finally {
        await queue.disconnect();
        await boss.stop();
        await knex.destroy();
      }
    });

    it('should return correct job count', async () => {
      const { boss, queue, knex } = await createQueue({
        databaseId,
        schema: 'test_queue_count',
        queueName: 'test_count',
      });

      try {
        await queue.pause();

        await queue.add({ id: 1 });
        await queue.add({ id: 2 });
        await queue.add({ id: 3 });

        const count = await queue.getJobCount();
        expect(count).toBe(3);
      } finally {
        await queue.disconnect();
        await boss.stop();
        await knex.destroy();
      }
    });

    it('should throw error when process is called twice', async () => {
      const { boss, queue, knex } = await createQueue({
        databaseId,
        schema: 'test_queue_double',
        queueName: 'test_double',
      });

      try {
        queue.process(async () => {});

        expect(() => {
          queue.process(async () => {});
        }).toThrow('Queue is already being processed');
      } finally {
        await queue.disconnect();
        await boss.stop();
        await knex.destroy();
      }
    });

    it('should handle primitive values correctly', async () => {
      const { boss, queue, knex } = await createQueue({
        databaseId,
        schema: 'test_queue_primitives',
        queueName: 'test_primitives',
      });

      try {
        const processed: any[] = [];

        queue.process(async (job: Job) => {
          processed.push(job.payload);
        });

        await queue.add('string-value');
        await queue.add(42);
        await queue.add(true);
        await queue.add(null);

        await waitForExpect(() => {
          expect(processed).toEqual(['string-value', 42, true, null]);
        }, 5000);
      } finally {
        await queue.disconnect();
        await boss.stop();
        await knex.destroy();
      }
    });
  });
});
