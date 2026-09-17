/*
 * Copyright 2020 The Backstage Authors
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

import { ErrorLike } from '@backstage/errors';
import { Worker } from 'node:worker_threads';
import { getEnvironmentConcurrency } from './concurrency';

type WorkerThreadMessage =
  | {
      type: 'done';
    }
  | {
      type: 'item';
      index: number;
      item: unknown;
    }
  | {
      type: 'start';
    }
  | {
      type: 'result';
      index: number;
      result: unknown;
    }
  | {
      type: 'error';
      error: ErrorLike;
    };

/**
 * Options for {@link runWorkerQueueThreads}.
 *
 * @public
 */
export type WorkerQueueThreadsOptions<TItem, TResult, TContext> = {
  /** The items to process */
  items: Iterable<TItem>;
  /**
   * A function that will be called within each worker thread at startup,
   * which should return the worker function that will be called for each item.
   *
   * This function must be defined as an arrow function or using the
   * function keyword, and must be entirely self contained, not referencing
   * any variables outside of its scope. This is because the function source
   * is stringified and evaluated in the worker thread.
   *
   * To pass data to the worker, use the `context` option and `items`, but
   * note that they are both copied by value into the worker thread, except for
   * types that are explicitly shareable across threads, such as `SharedArrayBuffer`.
   */
  workerFactory: (
    context: TContext,
  ) =>
    | ((item: TItem) => Promise<TResult>)
    | Promise<(item: TItem) => Promise<TResult>>;
  /** Context data supplied to each worker factory */
  context?: TContext;
};

/**
 * Spawns one or more worker threads using the `worker_threads` module.
 * Each thread processes one item at a time from the provided `options.items`.
 *
 * @public
 */
export async function runWorkerQueueThreads<TItem, TResult, TContext>(
  options: WorkerQueueThreadsOptions<TItem, TResult, TContext>,
): Promise<{ results: TResult[] }> {
  const items = Array.from(options.items);
  const workerFactory = options.workerFactory;
  const workerData = options.context;
  const threadCount = Math.min(getEnvironmentConcurrency(), items.length);

  const iterator = items[Symbol.iterator]();
  const results = new Array<TResult>();
  let itemIndex = 0;

  await Promise.all(
    Array(threadCount)
      .fill(0)
      .map(async () => {
        const thread = new Worker(`(${workerQueueThread})(${workerFactory})`, {
          eval: true,
          workerData,
        });

        return new Promise<void>((resolve, reject) => {
          thread.on('message', (message: WorkerThreadMessage) => {
            if (message.type === 'start' || message.type === 'result') {
              if (message.type === 'result') {
                results[message.index] = message.result as TResult;
              }
              const { value, done } = iterator.next();
              if (done) {
                thread.postMessage({ type: 'done' });
              } else {
                thread.postMessage({
                  type: 'item',
                  index: itemIndex,
                  item: value,
                });
                itemIndex += 1;
              }
            } else if (message.type === 'error') {
              const error = new Error(message.error.message);
              error.name = message.error.name;
              error.stack = message.error.stack;
              reject(error);
            }
          });

          thread.on('error', reject);
          thread.on('exit', (code: number) => {
            if (code !== 0) {
              reject(new Error(`Worker thread exited with code ${code}`));
            } else {
              resolve();
            }
          });
        });
      }),
  );

  return { results };
}

/* istanbul ignore next */
function workerQueueThread(
  workerFuncFactory: (
    data: unknown,
  ) => Promise<(item: unknown) => Promise<unknown>>,
) {
  const { parentPort, workerData } = require('node:worker_threads');

  Promise.resolve()
    .then(() => workerFuncFactory(workerData))
    .then(
      workerFunc => {
        parentPort.on('message', async (message: WorkerThreadMessage) => {
          if (message.type === 'done') {
            parentPort.close();
            return;
          }
          if (message.type === 'item') {
            try {
              const result = await workerFunc(message.item);
              parentPort.postMessage({
                type: 'result',
                index: message.index,
                result,
              });
            } catch (error) {
              parentPort.postMessage({ type: 'error', error });
            }
          }
        });

        parentPort.postMessage({ type: 'start' });
      },
      error => parentPort.postMessage({ type: 'error', error }),
    );
}
