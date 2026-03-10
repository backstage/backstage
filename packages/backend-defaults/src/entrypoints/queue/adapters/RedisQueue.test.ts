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
  TestCacheId,
  TestCaches,
} from '@backstage/backend-test-utils';
import { RedisQueue } from './RedisQueue';
import { DLQHandler, Job } from '@backstage/backend-plugin-api/alpha';
import Redis from 'ioredis';
import waitForExpect from 'wait-for-expect';

const mockLogger = mockServices.logger.mock();

jest.setTimeout(60_000);

describe('RedisQueue', () => {
  const caches = TestCaches.create({
    ids: ['REDIS_7'],
  });

  const testCases = caches.eachSupportedId();

  if (testCases.length === 0) {
    // Need to skip as the testCases will be empty, and it's not possible to run these
    // tests against memory cache
    // eslint-disable-next-line jest/expect-expect
    it.skip('skips RedisQueue tests (no supported caches)', () => {});
    return;
  }

  const createKeyPrefix = (cacheId: string) =>
    `test_queue:${cacheId}:${Date.now()}:${Math.random()}:`;

  async function createQueue({
    cacheId,
    queueName,
    maxAttempts,
    dlqHandler,
  }: {
    cacheId: TestCacheId;
    queueName: string;
    maxAttempts?: number;
    dlqHandler?: DLQHandler;
  }) {
    const { connection } = await caches.init(cacheId);
    const client = new Redis(connection);

    const queue = new RedisQueue({
      client,
      logger: mockLogger,
      queueName,
      keyPrefix: createKeyPrefix(cacheId),
      maxAttempts,
      dlqHandler,
    });

    return { client, queue };
  }

  describe.each(testCases)('%p', cacheId => {
    it('should process jobs in order', async () => {
      const { client, queue } = await createQueue({
        cacheId,
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
        await client.quit();
      }
    });

    it('should handle priorities', async () => {
      const { client, queue } = await createQueue({
        cacheId,
        queueName: 'test_priority',
      });

      try {
        const processed: any[] = [];

        await queue.add({ id: 'low' }, { priority: 50 });
        await queue.add({ id: 'high' }, { priority: 5 });
        await queue.add({ id: 'medium' }, { priority: 20 });

        queue.process(async (job: Job) => {
          processed.push(job.payload);
        });
        await waitForExpect(() => {
          expect(processed).toEqual([
            { id: 'high' },
            { id: 'medium' },
            { id: 'low' },
          ]);
        }, 5000);
      } finally {
        await queue.disconnect();
        await client.quit();
      }
    });

    it('should handle delays', async () => {
      const { client, queue } = await createQueue({
        cacheId,
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
        await client.quit();
      }
    });

    it('should retry failed jobs up to maxAttempts', async () => {
      const { client, queue } = await createQueue({
        cacheId,
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
        }, 7000);
      } finally {
        await queue.disconnect();
        await client.quit();
      }
    });

    it('should preserve job priority when retrying', async () => {
      const { client, queue } = await createQueue({
        cacheId,
        queueName: 'test_retry_priority',
        maxAttempts: 2,
      });

      try {
        const attempts: number[] = [];

        queue.process(async (job: Job) => {
          attempts.push(job.attempt);
          throw new Error('Job failed');
        });

        await queue.add({ id: 1 }, { priority: 42 });

        await waitForExpect(async () => {
          expect(attempts).toEqual([1]);

          const delayedEntries = await client.zrangebyscore(
            (queue as any).delayedKey,
            '-inf',
            '+inf',
          );

          expect(delayedEntries).toHaveLength(1);

          const serialized = delayedEntries[0];
          const json = serialized.startsWith('{')
            ? serialized
            : serialized.slice(serialized.indexOf(':') + 1);
          expect(JSON.parse(json)).toEqual(
            expect.objectContaining({
              priority: 42,
            }),
          );
        }, 5000);
      } finally {
        await queue.disconnect();
        await client.quit();
      }
    });

    it('should handle DLQ', async () => {
      const dlqHandler = jest.fn();
      const { client, queue } = await createQueue({
        cacheId,
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
        }, 5000);
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
        await client.quit();
      }
    });

    it('should return correct job count', async () => {
      const { client, queue } = await createQueue({
        cacheId,
        queueName: 'test_count',
      });

      try {
        await queue.add({ id: 1 });
        await queue.add({ id: 2 });
        await queue.add({ id: 3 });

        const count = await queue.getJobCount();
        expect(count).toBe(3);
      } finally {
        await queue.disconnect();
        await client.quit();
      }
    });

    it('should throw error when process is called twice', async () => {
      const { client, queue } = await createQueue({
        cacheId,
        queueName: 'test_double',
      });

      try {
        queue.process(async () => {});

        expect(() => {
          queue.process(async () => {});
        }).toThrow('Queue is already being processed');
      } finally {
        await queue.disconnect();
        await client.quit();
      }
    });
  });
});
