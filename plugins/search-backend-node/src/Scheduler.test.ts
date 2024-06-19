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

import { Scheduler } from './index';
import { mockServices } from '@backstage/backend-test-utils';

describe('Scheduler', () => {
  let testScheduler: Scheduler;

  beforeEach(() => {
    const logger = mockServices.logger.mock();
    testScheduler = new Scheduler({
      logger,
    });
  });

  describe('addToSchedule', () => {
    it('should not add a task and interval to schedule, if already started', async () => {
      const mockTask1 = jest.fn();
      const mockTask2 = jest.fn();
      const mockScheduledTaskRunner1 = {
        run: jest.fn(),
      };
      const mockScheduledTaskRunner2 = {
        run: jest.fn(),
      };

      // Add a task and interval to schedule
      testScheduler.addToSchedule({
        id: 'id1',
        task: mockTask1,
        scheduledRunner: mockScheduledTaskRunner1,
      });

      // Starts scheduling process
      testScheduler.start();

      // Throws Error if task and interval is added to a already started schedule
      expect(() =>
        testScheduler.addToSchedule({
          id: 'id2',
          task: mockTask2,
          scheduledRunner: mockScheduledTaskRunner2,
        }),
      ).toThrow();

      expect(mockScheduledTaskRunner1.run).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'id1',
          fn: mockTask1,
        }),
      );
      expect(mockScheduledTaskRunner2.run).not.toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'id2',
          fn: mockTask2,
        }),
      );
    });

    it('should not add a task to schedule, if it already exists', async () => {
      const mockTask1 = jest.fn();
      const mockTask2 = jest.fn();
      const mockScheduledTaskRunner1 = {
        run: jest.fn(),
      };
      const mockScheduledTaskRunner2 = {
        run: jest.fn(),
      };

      // Add a task and interval to schedule
      testScheduler.addToSchedule({
        id: 'id1',
        task: mockTask1,
        scheduledRunner: mockScheduledTaskRunner1,
      });

      // Throws Error if task and interval is added to a already started schedule
      expect(() =>
        testScheduler.addToSchedule({
          id: 'id1',
          task: mockTask2,
          scheduledRunner: mockScheduledTaskRunner2,
        }),
      ).toThrow();

      // Starts scheduling process
      testScheduler.start();

      expect(mockScheduledTaskRunner1.run).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'id1',
          fn: mockTask1,
        }),
      );
      expect(mockScheduledTaskRunner2.run).not.toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'id2',
          fn: mockTask2,
        }),
      );
    });

    it('should be possible to add a task and interval to schedule, if already started, but stopped in between', async () => {
      const mockTask1 = jest.fn();
      const mockTask2 = jest.fn();
      const mockScheduledTaskRunner1 = {
        run: jest.fn(),
      };
      const mockScheduledTaskRunner2 = {
        run: jest.fn(),
      };

      // Add a task and interval to schedule
      testScheduler.addToSchedule({
        id: 'id1',
        task: mockTask1,
        scheduledRunner: mockScheduledTaskRunner1,
      });

      // Starts scheduling process
      testScheduler.start();

      // Stop scheduling process
      testScheduler.stop();

      // Shouldn't throw error, as it is stopped.
      expect(() =>
        testScheduler.addToSchedule({
          id: 'id2',
          task: mockTask2,
          scheduledRunner: mockScheduledTaskRunner2,
        }),
      ).not.toThrow();

      // Starts scheduling process
      testScheduler.start();

      expect(mockScheduledTaskRunner1.run).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'id1',
          fn: mockTask1,
        }),
      );
      expect(mockScheduledTaskRunner2.run).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'id2',
          fn: mockTask2,
        }),
      );
    });
  });

  describe('start', () => {
    it('should execute tasks on start', () => {
      const mockTask1 = jest.fn();
      const mockTask2 = jest.fn();
      const mockScheduledTaskRunner1 = {
        run: jest.fn(),
      };
      const mockScheduledTaskRunner2 = {
        run: jest.fn(),
      };

      // Add tasks and interval to schedule
      testScheduler.addToSchedule({
        id: 'id1',
        task: mockTask1,
        scheduledRunner: mockScheduledTaskRunner1,
      });
      testScheduler.addToSchedule({
        id: 'id2',
        task: mockTask2,
        scheduledRunner: mockScheduledTaskRunner2,
      });

      // Starts scheduling process
      testScheduler.start();

      expect(mockScheduledTaskRunner1.run).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'id1',
          fn: mockTask1,
        }),
      );
      expect(mockScheduledTaskRunner2.run).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'id2',
          fn: mockTask2,
        }),
      );
    });
  });

  describe('stop', () => {
    it('should abort tasks on stop', () => {
      const run = jest.fn();

      // Add tasks and interval to schedule
      testScheduler.addToSchedule({
        id: '1',
        task: jest.fn(),
        scheduledRunner: { run },
      });
      testScheduler.addToSchedule({
        id: '2',
        task: jest.fn(),
        scheduledRunner: { run },
      });

      // Starts scheduling process
      testScheduler.start();

      const signals = run.mock.calls.map(([options]) => options.signal);

      expect(signals).toHaveLength(2);

      for (const signal of signals) {
        expect(signal.aborted).toBeFalsy();
      }

      // Stops scheduling process
      testScheduler.stop();

      for (const signal of signals) {
        expect(signal.aborted).toBeTruthy();
      }
    });
  });
});
