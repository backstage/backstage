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

import { createDeferred, durationToMilliseconds } from '@backstage/types';
import pLimit, { Limit } from 'p-limit';
import { HistoryConfig } from '../config';
import { ChangeHandler } from '../database/changeDetection/types';

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
export interface UpdateListener {
  /**
   * Set up a listener for changes in the database.
   *
   * @remarks
   *
   * Setting up a listener is cheap. You should set it up "eagerly", even before
   * performing an initial read that might or might not turn out to return any
   * data. That way you will be sure that no events are missed in the time
   * between that initial read and starting to listen for changes.
   *
   * The checker is used to determine whether data is ready (as deterined by the
   * caller), and is called zero or more times as the underlying database is
   * determined to have changes worth inspecting.
   *
   * It is important that the signal passed in gets marked as aborted as soon as
   * you are finished with the listener, because that releases all resources
   * associated with the listener.
   */
  setupListener(options: SetupListenerOptions): Promise<{
    /**
     * Blocks until there are any updates, or the operation is aborted, or a
     * pre-set timeout occurs - whichever happens first.
     *
     * This method can be called repeatedly if needed.
     */
    waitForUpdate(): Promise<'timeout' | 'aborted' | 'ready'>;
  }>;
}

export class UpdateListenerImpl implements UpdateListener {
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
                clearTimeout(timeoutHandle);
                return;
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
