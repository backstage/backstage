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

import { HistoryConfig } from '../../config';

import { LifecycleService, LoggerService } from '@backstage/backend-plugin-api';
import { Knex } from 'knex';
import { PollingChangeHandler } from './PollingChangeHandler';
import { PostgresListenNotifyChangeHandler } from './PostgresListenNotifyChangeHandler';
import { ChangeHandler } from './types';

/**
 * Helps in the creation of a change handler, by allowing the deferred creation
 * of the knex client.
 */
export function createChangeHandler(options: {
  knexPromise: Promise<Knex>;
  logger: LoggerService;
  lifecycle: LifecycleService;
  historyConfig: HistoryConfig;
}): ChangeHandler {
  const { knexPromise, logger, lifecycle, historyConfig } = options;

  let implementation:
    | PostgresListenNotifyChangeHandler
    | PollingChangeHandler
    | undefined;

  lifecycle.addShutdownHook(async () => {
    if (implementation) {
      await implementation.shutdown();
      implementation = undefined;
    }
  });

  return {
    async setupListener(signal) {
      if (!implementation) {
        const knex = await knexPromise;
        implementation = knex.client.config.client.includes('pg')
          ? new PostgresListenNotifyChangeHandler(knex, logger)
          : new PollingChangeHandler(knex, historyConfig);
      }
      return implementation.setupListener(signal);
    },
  };
}
