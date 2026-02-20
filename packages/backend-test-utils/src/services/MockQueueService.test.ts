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

import { MockQueueService } from './MockQueueService';

describe('MockQueueService', () => {
  let service: MockQueueService;

  beforeEach(() => {
    service = new MockQueueService();
  });

  afterEach(async () => {
    await service.clearAllQueues();
  });

  describe('getQueue', () => {
    it('should create a new queue', async () => {
      const queue = await service.getQueue('test-queue');
      expect(queue).toBeDefined();
    });

    it('should return the same queue for the same name', async () => {
      const queue1 = await service.getQueue('test-queue');
      const queue2 = await service.getQueue('test-queue');
      expect(queue1).toBe(queue2);
    });

    it('should create different queues for different names', async () => {
      const queue1 = await service.getQueue('queue-1');
      const queue2 = await service.getQueue('queue-2');
      expect(queue1).not.toBe(queue2);
    });
  });

  describe('Queue operations', () => {
    it('should add jobs to the queue', async () => {
      const queue = await service.getQueue('test-queue');
      await queue.add({ message: 'test' });
      const count = await queue.getJobCount();
      expect(count).toBe(1);
    });

    it('should process jobs with a handler', async () => {
      const queue = await service.getQueue('test-queue');
      const handler = jest.fn();

      queue.process(handler);
      await queue.add({ message: 'test' });

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          payload: { message: 'test' },
          attempt: 1,
        }),
      );
    });

    it('should process multiple jobs in order', async () => {
      const queue = await service.getQueue('test-queue');
      const processedJobs: any[] = [];

      queue.process(async job => {
        processedJobs.push(job.payload);
      });

      await queue.add({ order: 1 });
      await queue.add({ order: 2 });
      await queue.add({ order: 3 });

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(processedJobs).toEqual([{ order: 1 }, { order: 2 }, { order: 3 }]);
    });

    it('should pause and resume queue processing', async () => {
      const queue = await service.getQueue('test-queue');
      const handler = jest.fn();

      queue.process(handler);
      await queue.pause();

      await queue.add({ message: 'test1' });
      await queue.add({ message: 'test2' });

      await new Promise(resolve => setTimeout(resolve, 50));
      expect(handler).not.toHaveBeenCalled();

      await queue.resume();
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(handler).toHaveBeenCalledTimes(2);
    });

    it('should return correct job count', async () => {
      const queue = await service.getQueue('test-queue');

      expect(await queue.getJobCount()).toBe(0);

      await queue.pause();
      await queue.add({ message: 'test1' });
      await queue.add({ message: 'test2' });

      expect(await queue.getJobCount()).toBe(2);
    });

    it('should disconnect and clear jobs', async () => {
      const queue = await service.getQueue('test-queue');

      await queue.pause();
      await queue.add({ message: 'test1' });
      await queue.add({ message: 'test2' });

      await queue.disconnect();

      expect(await queue.getJobCount()).toBe(0);
    });

    it('should throw error when adding to disconnected queue', async () => {
      const queue = await service.getQueue('test-queue');
      await queue.disconnect();

      await expect(queue.add({ message: 'test' })).rejects.toThrow(
        'Queue is disconnected',
      );
    });

    it('should throw error when setting handler multiple times', async () => {
      const queue = await service.getQueue('test-queue');
      const handler = jest.fn();

      queue.process(handler);

      expect(() => queue.process(handler)).toThrow(
        'Handler already set for this queue',
      );
    });

    it('should handle job processing errors', async () => {
      const queue = await service.getQueue('test-queue');
      const error = new Error('Processing failed');

      queue.process(async () => {
        throw error;
      });

      await queue.add({ message: 'test' });

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(await queue.getJobCount()).toBe(0);
    });

    it('should respect job options delay', async () => {
      const queue = await service.getQueue('test-queue');
      const mockQueue = service.getExistingQueue('test-queue')!;
      const handler = jest.fn();

      await queue.pause();

      queue.process(handler);

      await queue.add({ message: 'delayed' }, { delay: 1000 });

      const pending = mockQueue.getPendingJobs();
      expect(pending).toHaveLength(1);
      expect(pending[0].payload).toEqual({ message: 'delayed' });

      expect(handler).not.toHaveBeenCalled();

      await queue.resume();

      await new Promise(resolve => setTimeout(resolve, 10));
      expect(handler).toHaveBeenCalled();
    });
  });

  describe('Test helpers', () => {
    it('should provide access to existing queues', async () => {
      await service.getQueue('test-queue');
      const queue = service.getExistingQueue('test-queue');
      expect(queue).toBeDefined();
    });

    it('should return undefined for non-existent queues', () => {
      const queue = service.getExistingQueue('non-existent');
      expect(queue).toBeUndefined();
    });

    it('should list all queue names', async () => {
      await service.getQueue('queue-1');
      await service.getQueue('queue-2');
      await service.getQueue('queue-3');

      const names = service.getQueueNames();
      expect(names).toEqual(['queue-1', 'queue-2', 'queue-3']);
    });

    it('should clear all queues', async () => {
      await service.getQueue('queue-1');
      await service.getQueue('queue-2');

      await service.clearAllQueues();

      expect(service.getQueueNames()).toEqual([]);
    });

    it('should provide pause state', async () => {
      const queue = await service.getQueue('test-queue');
      const mockQueue = service.getExistingQueue('test-queue')!;

      expect(mockQueue.isPausedState()).toBe(false);

      await queue.pause();
      expect(mockQueue.isPausedState()).toBe(true);

      await queue.resume();
      expect(mockQueue.isPausedState()).toBe(false);
    });

    it('should provide pending jobs', async () => {
      const queue = await service.getQueue('test-queue');
      const mockQueue = service.getExistingQueue('test-queue')!;

      await queue.pause();
      await queue.add({ order: 1 });
      await queue.add({ order: 2 });

      const pending = mockQueue.getPendingJobs();
      expect(pending).toHaveLength(2);
      expect(pending[0].payload).toEqual({ order: 1 });
      expect(pending[1].payload).toEqual({ order: 2 });
    });
  });

  describe('DLQ functionality', () => {
    it('should retry failed jobs up to maxAttempts', async () => {
      const queue = await service.getQueue('test-queue');
      const attempts: number[] = [];

      queue.process(async job => {
        attempts.push(job.attempt);
        throw new Error('Job failed');
      });

      await queue.add({ message: 'failing' });

      // Wait for processing and retries
      await new Promise(resolve => setTimeout(resolve, 100));

      // Default maxAttempts is 5, so should attempt 5 times
      expect(attempts.length).toBe(5);
      expect(attempts).toEqual([1, 2, 3, 4, 5]);
    });

    it('should call DLQ handler after maxAttempts', async () => {
      const dlqHandler = jest.fn();
      const queue = await service.getQueue('test-queue', { dlqHandler });
      const attempts: number[] = [];

      queue.process(async job => {
        attempts.push(job.attempt);
        throw new Error('Job failed');
      });

      await queue.add({ message: 'failing' });

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 100));

      // Should have attempted 5 times (default maxAttempts)
      expect(attempts).toEqual([1, 2, 3, 4, 5]);

      // DLQ handler should have been called
      expect(dlqHandler).toHaveBeenCalledTimes(1);
      expect(dlqHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { message: 'failing' },
          attempt: 5,
        }),
        expect.any(Error),
      );
    });

    it('should not call DLQ handler for successful jobs', async () => {
      const dlqHandler = jest.fn();
      const queue = await service.getQueue('test-queue', { dlqHandler });

      queue.process(async () => {
        // Success
      });

      await queue.add({ message: 'success' });

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(dlqHandler).not.toHaveBeenCalled();
    });
  });

  describe('factory', () => {
    it('should create a service factory', () => {
      const factory = service.factory();
      expect(factory).toBeDefined();
      expect(factory.service).toBeDefined();
    });
  });
});
