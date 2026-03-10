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

import { Job, QueueWorkerJob } from '@backstage/backend-plugin-api/alpha';
import { TestDatabases, mockServices } from '@backstage/backend-test-utils';
import waitForExpect from 'wait-for-expect';
import { DatabaseQueue } from './DatabaseQueue';
import { migrateQueueItems } from '../database/migrateQueueItems';

jest.setTimeout(60_000);

describe('DatabaseQueue', () => {
  const databases = TestDatabases.create();
  const logger = mockServices.logger.mock();

  it.each(databases.eachSupportedId())(
    'processes queued jobs in priority order using %p',
    async databaseId => {
      const db = await databases.init(databaseId);
      await migrateQueueItems(db);
      const queue = new DatabaseQueue({
        db,
        logger,
        pollIntervalMs: 10,
        queueName: `test-${databaseId}`,
      });

      try {
        const processed: Array<{ id: string }> = [];

        await queue.add({ id: 'low' }, { priority: 50 });
        await queue.add({ id: 'high' }, { priority: 5 });
        await queue.add({ id: 'medium' }, { priority: 20 });

        queue.process(async (job: Job) => {
          processed.push(job.payload as { id: string });
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
        await db.destroy();
      }
    },
  );

  it.each(databases.eachSupportedId())(
    'waits for active jobs during disconnect using %p',
    async databaseId => {
      const db = await databases.init(databaseId);
      await migrateQueueItems(db);
      const queue = new DatabaseQueue({
        db,
        logger,
        pollIntervalMs: 10,
        queueName: `disconnect-${databaseId}`,
      });

      try {
        let releaseJob: (() => void) | undefined;
        const jobStarted = new Promise<void>(resolve => {
          queue.process(async () => {
            resolve();
            await new Promise<void>(jobResolve => {
              releaseJob = jobResolve;
            });
          });
        });

        await queue.add({ id: 1 });
        await jobStarted;

        let disconnected = false;
        const disconnectPromise = queue.disconnect().then(() => {
          disconnected = true;
        });

        await new Promise(resolve => setTimeout(resolve, 100));
        expect(disconnected).toBe(false);

        releaseJob?.();
        await disconnectPromise;
        expect(disconnected).toBe(true);
      } finally {
        await db.destroy();
      }
    },
  );

  it.each(databases.eachSupportedId())(
    'supports direct worker processing using %p',
    async databaseId => {
      const db = await databases.init(databaseId);
      await migrateQueueItems(db);
      const queue = new DatabaseQueue({
        db,
        logger,
        pollIntervalMs: 10,
        queueName: `worker-${databaseId}`,
      });

      try {
        await queue.add({ id: 'low' }, { priority: 50 });
        await queue.add({ id: 'high' }, { priority: 5 });
        await queue.add({ id: 'medium' }, { priority: 20 });

        const worker = queue.process({ batchSize: 2 });
        let firstBatch: QueueWorkerJob[] | undefined;

        await waitForExpect(async () => {
          firstBatch = await worker.next();
          expect(
            firstBatch?.map(job => (job.payload as { id: string }).id),
          ).toEqual(['high', 'medium']);
        }, 5000);

        await Promise.all(firstBatch?.map(job => job.complete()) ?? []);

        const secondBatch = await worker.next();
        expect(
          secondBatch?.map(job => (job.payload as { id: string }).id),
        ).toEqual(['low']);

        await Promise.all(secondBatch?.map(job => job.complete()) ?? []);
        await worker.close();
        await expect(worker.next()).resolves.toBeUndefined();
      } finally {
        await queue.disconnect();
        await db.destroy();
      }
    },
  );
});
