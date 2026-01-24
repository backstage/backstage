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
import {
  LoggerService,
  SchedulerService,
  SchedulerServiceTaskScheduleDefinition,
} from '@backstage/backend-plugin-api';
import { Config, readDurationFromConfig } from '@backstage/config';
import { NotificationsStore } from '../database';
import { HumanDuration } from '@backstage/types';
import { ForwardedError } from '@backstage/errors';

export class NotificationCleaner {
  private readonly retention: HumanDuration = { years: 1 };
  private readonly enabled: boolean = true;
  private readonly scheduler: SchedulerService;
  private readonly logger: LoggerService;
  private readonly database: NotificationsStore;

  constructor(
    config: Config,
    scheduler: SchedulerService,
    logger: LoggerService,
    database: NotificationsStore,
  ) {
    this.scheduler = scheduler;
    this.logger = logger;
    this.database = database;
    if (config.has('notifications.retention')) {
      const retentionConfig = config.get('notifications.retention');
      if (typeof retentionConfig === 'boolean' && !retentionConfig) {
        logger.info(
          'Notification retention is disabled, skipping notification cleaner task',
        );
        this.enabled = false;
        return;
      }
      this.retention = readDurationFromConfig(config, {
        key: 'notifications.retention',
      });
    }
  }

  async initTaskRunner() {
    if (!this.enabled) {
      return;
    }

    const schedule: SchedulerServiceTaskScheduleDefinition = {
      frequency: { cron: '0 0 * * *' },
      timeout: { hours: 1 },
      initialDelay: { hours: 1 },
      scope: 'global',
    };

    const taskRunner = this.scheduler.createScheduledTaskRunner(schedule);
    await taskRunner.run({
      id: 'notification-cleaner',
      fn: async () => {
        await this.clearNotifications(
          this.logger,
          this.database,
          this.retention,
        );
      },
    });
  }

  private async clearNotifications(
    logger: LoggerService,
    database: NotificationsStore,
    retention: HumanDuration,
  ) {
    logger.info('Starting notification cleaner task');
    try {
      const result = await database.clearNotifications({ maxAge: retention });
      logger.info(
        `Notification cleaner task completed successfully, deleted ${result.deletedCount} notifications`,
      );
    } catch (error) {
      throw new ForwardedError('Notification cleaner task failed', error);
    }
  }
}
