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

import { MemoryQueue } from './MemoryQueue';
import { Job } from '@backstage/backend-plugin-api';
import { mockServices } from '@backstage/backend-test-utils';
import waitForExpect from 'wait-for-expect';

const mockLogger = mockServices.logger.mock();

describe('MemoryQueue', () => {
  it('should process jobs in order', async () => {
    const queue = new MemoryQueue({
      interval: 10,
      logger: mockLogger,
      queueName: 'test',
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
      });
    } finally {
      await queue.disconnect();
    }
  });

  it('should handle priorities', async () => {
    const queue = new MemoryQueue({
      interval: 10,
      logger: mockLogger,
      queueName: 'test',
    });
    try {
      const processed: any[] = [];

      queue.process(async (job: Job) => {
        await new Promise(resolve => setTimeout(resolve, 20));
        processed.push(job.payload);
      });

      await queue.pause();

      await queue.add({ id: 'low' }, { priority: 50 });
      await queue.add({ id: 'high' }, { priority: 5 });
      await queue.add({ id: 'medium' }, { priority: 20 });

      await queue.resume();

      await waitForExpect(() => {
        expect(processed).toHaveLength(3);
      }, 1000);

      expect(processed).toEqual([
        { id: 'high' },
        { id: 'medium' },
        { id: 'low' },
      ]);
    } finally {
      await queue.disconnect();
    }
  });

  it('should handle delays', async () => {
    const queue = new MemoryQueue({
      interval: 10,
      logger: mockLogger,
      queueName: 'test',
    });
    try {
      const processed: any[] = [];

      queue.process(async (job: Job) => {
        processed.push(job.payload);
      });

      await queue.add({ id: 'immediate' });
      await queue.add({ id: 'delayed' }, { delay: 100 });

      const start = Date.now();
      await waitForExpect(() => {
        expect(processed).toEqual([{ id: 'immediate' }]);
        expect(Date.now() - start).toBeGreaterThanOrEqual(50);
      }, 500);

      await waitForExpect(() => {
        expect(processed).toEqual([{ id: 'immediate' }, { id: 'delayed' }]);
      }, 1000);
    } finally {
      await queue.disconnect();
    }
  });

  it('should not process the same job concurrently', async () => {
    const queue = new MemoryQueue({
      interval: 10,
      logger: mockLogger,
      queueName: 'test',
    });
    try {
      let activeJobs = 0;
      let maxActiveJobs = 0;

      const processed: number[] = [];

      queue.process(async job => {
        activeJobs++;
        maxActiveJobs = Math.max(maxActiveJobs, activeJobs);
        await new Promise(resolve => setTimeout(resolve, 30));
        processed.push((job.payload as { id: number }).id);
        activeJobs--;
      });

      await queue.add({ id: 1 });
      await queue.add({ id: 2 });

      await waitForExpect(() => {
        expect(processed).toHaveLength(2);
      });

      expect(maxActiveJobs).toBe(1);
    } finally {
      await queue.disconnect();
    }
  });

  it('should process jobs concurrently when concurrency > 1', async () => {
    const queue = new MemoryQueue({
      interval: 10,
      logger: mockLogger,
      queueName: 'test',
    });
    try {
      let activeJobs = 0;
      let maxActiveJobs = 0;

      const processed: number[] = [];

      queue.process(
        async job => {
          activeJobs++;
          maxActiveJobs = Math.max(maxActiveJobs, activeJobs);
          await new Promise(resolve => setTimeout(resolve, 50));
          processed.push((job.payload as { id: number }).id);
          activeJobs--;
        },
        { concurrency: 3 },
      );

      await queue.add({ id: 1 });
      await queue.add({ id: 2 });
      await queue.add({ id: 3 });

      await waitForExpect(() => {
        expect(processed).toHaveLength(3);
      });

      expect(maxActiveJobs).toBe(3);
    } finally {
      await queue.disconnect();
    }
  });

  it('should respect concurrency limit', async () => {
    const queue = new MemoryQueue({
      interval: 10,
      logger: mockLogger,
      queueName: 'test',
    });
    try {
      let activeJobs = 0;
      let maxActiveJobs = 0;

      const processed: number[] = [];

      queue.process(
        async job => {
          activeJobs++;
          maxActiveJobs = Math.max(maxActiveJobs, activeJobs);
          await new Promise(resolve => setTimeout(resolve, 50));
          processed.push((job.payload as { id: number }).id);
          activeJobs--;
        },
        { concurrency: 2 },
      );

      await queue.add({ id: 1 });
      await queue.add({ id: 2 });
      await queue.add({ id: 3 });
      await queue.add({ id: 4 });

      await waitForExpect(() => {
        expect(processed).toHaveLength(4);
      });

      expect(maxActiveJobs).toBe(2);
    } finally {
      await queue.disconnect();
    }
  });

  it('should retry failed jobs up to maxAttempts', async () => {
    const queue = new MemoryQueue({
      interval: 10,
      logger: mockLogger,
      queueName: 'test',
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
      }, 5000);
    } finally {
      await queue.disconnect();
    }
  });

  it('should call DLQ handler after maxAttempts', async () => {
    const dlqHandler = jest.fn();
    const queue = new MemoryQueue({
      interval: 10,
      logger: mockLogger,
      queueName: 'test',
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
      }, 4000);

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
    }
  });

  it('should not retry successful jobs', async () => {
    const queue = new MemoryQueue({
      interval: 10,
      logger: mockLogger,
      queueName: 'test',
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
        expect(Date.now() - start).toBeGreaterThanOrEqual(100);
      }, 1000);
    } finally {
      await queue.disconnect();
    }
  });
});
