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

import { TRACER_ID, withActiveSpan } from '../util/opentelemetry';
import { trace } from '@opentelemetry/api';

const DEFAULT_POLLING_INTERVAL_MS = 1000;
const tracer = trace.getTracer(TRACER_ID);

type Options<T> = {
  /**
   * The callback used to load in new tasks. The number of items returned
   * in the array must be at most `count` number of items, but may be lower.
   *
   * Any error thrown from this method fill be treated as an unhandled rejection.
   */
  loadTasks: (count: number) => Promise<Array<T>>;

  /**
   * The callback used to process a single item.
   *
   * Any error thrown from this method fill be treated as an unhandled rejection.
   */
  processTask: (item: T) => Promise<void>;

  /**
   * The target minimum number of items to process in parallel. Once the number
   * of in-flight tasks reaches this count, more tasks will be loaded in.
   */
  lowWatermark: number;

  /**
   * The maximum number of items to process in parallel.
   */
  highWatermark: number;

  /**
   * The interval at which tasks are polled for in the background when
   * there aren't enough tasks to load to satisfy the low watermark.
   *
   * @default 1000
   */
  pollingIntervalMs?: number;
};

/**
 * Creates a task processing pipeline which continuously loads in tasks to
 * keep the number of parallel in-flight tasks between a low and high watermark.
 *
 * @param options - The options for the pipeline.
 * @returns A stop function which when called halts all processing.
 */
export function startTaskPipeline<T>(options: Options<T>) {
  const {
    loadTasks,
    processTask,
    lowWatermark,
    highWatermark,
    pollingIntervalMs = DEFAULT_POLLING_INTERVAL_MS,
  } = options;

  if (lowWatermark >= highWatermark) {
    throw new Error('lowWatermark must be lower than highWatermark');
  }

  // State is in an object so that it can be stably referenced from within
  // callbacks below
  const state = { inFlightCount: 0 };
  const abortController = new AbortController();
  const abortSignal = abortController.signal;

  const barrier = createBarrier({
    waitTimeoutMillis: pollingIntervalMs,
    signal: abortSignal,
  });

  async function pipelineLoop() {
    while (!abortSignal.aborted) {
      if (state.inFlightCount <= lowWatermark) {
        await withActiveSpan(tracer, 'TaskPipelineLoop', async span => {
          const loadCount = highWatermark - state.inFlightCount;
          const loadedItems = await Promise.resolve()
            .then(() => loadTasks(loadCount))
            .catch(() => {
              // Silently swallow errors and go back to sleep to try again; we
              // delegate to the loadTasks function itself to catch errors and log
              // if it so desires
              return [];
            });
          span.setAttribute('itemCount', loadedItems.length);
          if (loadedItems.length && !abortSignal.aborted) {
            state.inFlightCount += loadedItems.length;
            for (const item of loadedItems) {
              Promise.resolve()
                .then(() => processTask(item))
                .catch(() => {
                  // Silently swallow errors and go back to sleep to try again; we
                  // delegate to the processTask function itself to catch errors
                  // and log if it so desires
                })
                .finally(() => {
                  state.inFlightCount -= 1;
                  barrier.release();
                });
            }
          }
        });
      }
      await barrier.wait();
    }
  }

  pipelineLoop().catch(error => {
    // This should be impossible, but if it did happen, it would signal a
    // programming error inside the loop (errors should definitely be caught
    // inside of it). Let's rethrow with more information, and let it be caught
    // by the process' uncaught exception handler, which will log the occurrence
    // at a high level.
    throw new Error(`Unexpected error in processing pipeline loop`, error);
  });

  return () => {
    abortController.abort();
    barrier.destroy();
  };
}

/**
 * Creates a barrier with a timeout, that can be awaited or prematurely
 * released either manually or by an abort signal.
 */
export function createBarrier(options: {
  waitTimeoutMillis: number;
  signal: AbortSignal;
}): {
  wait: () => Promise<void>;
  release: () => void;
  destroy: () => void;
} {
  const { waitTimeoutMillis, signal } = options;
  const resolvers = new Set<() => void>();

  function wait() {
    if (signal.aborted || !(waitTimeoutMillis > 0)) {
      return Promise.resolve();
    }

    return new Promise<void>(resolve => {
      const timeoutHandle = setTimeout(done, waitTimeoutMillis);

      function done() {
        resolvers.delete(done);
        clearTimeout(timeoutHandle);
        resolve();
      }

      resolvers.add(done);
    });
  }

  function release() {
    const resolversToCall = new Set(resolvers);
    resolvers.clear();
    for (const resolver of resolversToCall) {
      resolver();
    }
  }

  signal.addEventListener('abort', release);

  return {
    wait,
    release,
    destroy: () => signal.removeEventListener('abort', release),
  };
}
