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
  createDeferred,
  DeferredPromise,
  durationToMilliseconds,
} from '@backstage/types';
import { randomUUID } from 'crypto';
import { HistoryConfig } from '../config';
import { ChangeHandler } from '../database/changeDetection/types';
import pLimit, { Limit } from 'p-limit';

export interface SetupListenerOptions {
  /**
   * A function that returns true if data is ready.
   */
  checker: () => Promise<boolean>;
  /**
   * A signal to abort the listener.
   */
  signal: AbortSignal;
}

/**
 * Handles sets of listners that are waiting for changes to happen in the
 * database.
 */
export class UpdateListener {
  readonly #changeHandler: ChangeHandler;
  readonly #historyConfig: HistoryConfig;
  readonly #shutdownSignal: AbortSignal;
  readonly #checkRunLimiter: Limit;

  constructor(options: {
    changeHandler: ChangeHandler;
    historyConfig: HistoryConfig;
    shutdownSignal: AbortSignal;
  }) {
    this.#changeHandler = options.changeHandler;
    this.#historyConfig = options.historyConfig;
    this.#shutdownSignal = options.shutdownSignal;
    this.#checkRunLimiter = pLimit(2); // avoid stampeding the database on events
  }

  async setupListener(options: SetupListenerOptions): Promise<{
    waitForUpdate(): Promise<'timeout' | 'aborted' | 'ready'>;
  }> {
    // early-out if already aborted
    if (this.#shutdownSignal.aborted) {
      throw new Error('Shutting down');
    }

    const subscription = await this.#changeHandler.setupListener(
      AbortSignal.any([options.signal, this.#shutdownSignal]),
    );

    return {
      waitForUpdate: async () => {
        // early-out if already aborted
        if (options.signal.aborted || this.#shutdownSignal.aborted) {
          return 'aborted';
        }

        const result = createDeferred<'timeout' | 'aborted' | 'ready'>();
        let done: boolean = false;

        const timeoutHandle = setTimeout(() => {
          result.resolve('timeout');
          done = true;
        }, durationToMilliseconds(this.#historyConfig.blockDuration));

        AbortSignal.any([
          options.signal,
          this.#shutdownSignal,
        ]).addEventListener('abort', () => {
          result.resolve('aborted');
          done = true;
          clearTimeout(timeoutHandle);
        });

        (async () => {
          for (;;) {
            try {
              await subscription.waitForUpdate();
              if (done) {
                return;
              }
              const checkPassed = await this.#checkRunLimiter(options.checker);
              if (done) {
                return;
              } else if (checkPassed) {
                result.resolve('ready');
                done = true;
              }
            } catch {
              if (!done) {
                // Just to not end up in fast infinite loops in corner cases
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            }
          }
        })();

        return result;
      },
    };
  }
}
