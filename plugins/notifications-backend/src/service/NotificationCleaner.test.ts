/*
 * Copyright 2025 The Backstage Authors
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
import { LoggerService, SchedulerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { mockServices } from '@backstage/backend-test-utils';
import { NotificationsStore } from '../database';
import { NotificationCleaner } from './NotificationCleaner.ts';

describe('NotificationCleaner', () => {
  let mockConfig: Config;
  let mockScheduler: SchedulerService;
  let mockLogger: LoggerService;
  let mockDatabase: NotificationsStore;

  beforeEach(() => {
    mockConfig = mockServices.rootConfig();
    mockScheduler = mockServices.scheduler.mock();
    mockLogger = mockServices.logger.mock();
    mockDatabase = {
      clearNotifications: jest.fn(),
    } as unknown as NotificationsStore;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initNotificationCleaner', () => {
    it('should initialize the notification cleaner with the correct schedule', async () => {
      const mockTaskRunner = {
        run: jest.fn(),
      };
      mockScheduler.createScheduledTaskRunner = jest
        .fn()
        .mockReturnValue(mockTaskRunner);

      const cleaner = new NotificationCleaner(
        mockConfig,
        mockScheduler,
        mockLogger,
        mockDatabase,
      );
      expect(cleaner).toBeInstanceOf(NotificationCleaner);
      await cleaner.initTaskRunner();

      expect(mockScheduler.createScheduledTaskRunner).toHaveBeenCalled();
      expect(mockTaskRunner.run).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'notification-cleaner',
          fn: expect.any(Function),
        }),
      );
    });

    it('should not create a task runner if retention is disabled', async () => {
      mockConfig = mockServices.rootConfig({
        data: { notifications: { retention: false } },
      });
      const cleaner = new NotificationCleaner(
        mockConfig,
        mockScheduler,
        mockLogger,
        mockDatabase,
      );
      await cleaner.initTaskRunner();

      expect(mockScheduler.createScheduledTaskRunner).not.toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Notification retention is disabled, skipping notification cleaner task',
      );
    });
  });

  describe('clearNotifications', () => {
    it('should clear notifications', async () => {
      mockDatabase.clearNotifications = jest
        .fn()
        .mockResolvedValue({ deletedCount: 1 });
      const mockTaskRunner = {
        run: jest.fn().mockImplementation(({ fn }) => fn()),
      };
      mockScheduler.createScheduledTaskRunner = jest
        .fn()
        .mockReturnValue(mockTaskRunner);

      const cleaner = new NotificationCleaner(
        mockConfig,
        mockScheduler,
        mockLogger,
        mockDatabase,
      );
      await cleaner.initTaskRunner();

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Starting notification cleaner task',
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Notification cleaner task completed successfully, deleted 1 notifications',
      );
      expect(mockDatabase.clearNotifications).toHaveBeenCalledWith({
        maxAge: { years: 1 },
      });
    });
  });
});
