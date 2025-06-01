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
import { createDeferred, durationToMilliseconds } from '@backstage/types';
import { Knex } from 'knex';
import pLimit from 'p-limit';
import { PollingChangeHandler } from './PollingChangeHandler';
import { PostgresListenNotifyChangeHandler } from './PostgresListenNotifyChangeHandler';
import { SetupListenerOptions, UpdateListener } from './types';
import { sleep } from '../../helpers';
import { once } from 'events';

/**
 * Helps in the creation of a change handler, by allowing the deferred creation
 * of the knex client.
 */
export function createChangeHandler(options: {
  knexPromise: Promise<Knex>;
  logger: LoggerService;
  lifecycle: LifecycleService;
  historyConfig: HistoryConfig;
}): UpdateListener {
  const { knexPromise, logger, lifecycle, historyConfig } = options;

  // the underlying notification mechanism is created lazily later
  let implementation:
    | PostgresListenNotifyChangeHandler
    | PollingChangeHandler
    | undefined;

  // avoid stampeding the database on events
  const checkRunLimiter = pLimit(2);

  // react to shutdown
  const shutdownController = new AbortController();
  const shutdownSignal = shutdownController.signal;
  lifecycle.addShutdownHook(async () => {
    shutdownController.abort();
    await implementation?.shutdown();
  });

  return {
    async setupListener({ signal, checker }: SetupListenerOptions) {
      // early-out if already aborted
      const abortSignal = AbortSignal.any([signal, shutdownSignal]);
      if (abortSignal.aborted) {
        return {
          waitForUpdate: async () => 'aborted',
        };
      }
      const abortPromise = once(abortSignal, 'abort');

      if (!implementation) {
        const knex = await knexPromise;
        implementation = knex.client.config.client.includes('pg')
          ? new PostgresListenNotifyChangeHandler(knex, logger)
          : new PollingChangeHandler(knex, historyConfig);
      }

      const subscription = await implementation.setupListener(abortSignal);

      return {
        waitForUpdate: async () => {
          if (abortSignal.aborted) {
            return 'aborted';
          }

          const result = createDeferred<'timeout' | 'aborted' | 'ready'>();
          let done: boolean = false;

          const timeoutHandle = setTimeout(() => {
            result.resolve('timeout');
            done = true;
          }, durationToMilliseconds(historyConfig.blockDuration));

          abortPromise.then(() => {
            result.resolve('aborted');
            done = true;
            clearTimeout(timeoutHandle);
          });

          (async () => {
            while (!done) {
              try {
                await subscription.waitForUpdate();
                if (!done) {
                  const checkPassed = await checkRunLimiter(checker);
                  if (!done && checkPassed) {
                    result.resolve('ready');
                    done = true;
                    clearTimeout(timeoutHandle);
                    return;
                  }
                }
              } catch {
                // Just to not end up in fast infinite loops in corner cases
                await sleep(historyConfig.blockPollFrequency, abortSignal);
              }
            }
          })();

          return result;
        },
      };
    },
  };
}
