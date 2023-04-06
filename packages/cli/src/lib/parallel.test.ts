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

import os from 'os';
import {
  parseParallelismOption,
  getEnvironmentParallelism,
  runParallelWorkers,
  runWorkerQueueThreads,
  runWorkerThreads,
} from './parallel';

const defaultParallelism = Math.ceil(os.cpus().length / 2);

describe('parseParallelismOption', () => {
  it('coerces false no parallelism', () => {
    expect(parseParallelismOption(false)).toBe(1);
    expect(parseParallelismOption('false')).toBe(1);
  });

  it('coerces true or undefined to default parallelism', () => {
    expect(parseParallelismOption(true)).toBe(defaultParallelism);
    expect(parseParallelismOption('true')).toBe(defaultParallelism);
    expect(parseParallelismOption(undefined)).toBe(defaultParallelism);
    expect(parseParallelismOption(null)).toBe(defaultParallelism);
  });

  it('coerces number string to number', () => {
    expect(parseParallelismOption('2')).toBe(2);
  });

  it.each([['on'], [2.5], ['2.5']])('throws error for %p', value => {
    expect(() => parseParallelismOption(value as any)).toThrow(
      `Parallel option value '${value}' is not a boolean or integer`,
    );
  });
});

describe('getEnvironmentParallelism', () => {
  it('reads the parallelism setting from the environment', () => {
    process.env.BACKSTAGE_CLI_BUILD_PARALLEL = '2';
    expect(getEnvironmentParallelism()).toBe(2);

    process.env.BACKSTAGE_CLI_BUILD_PARALLEL = 'true';
    expect(getEnvironmentParallelism()).toBe(defaultParallelism);

    process.env.BACKSTAGE_CLI_BUILD_PARALLEL = 'false';
    expect(getEnvironmentParallelism()).toBe(1);

    delete process.env.BACKSTAGE_CLI_BUILD_PARALLEL;
    expect(getEnvironmentParallelism()).toBe(defaultParallelism);
  });
});

describe('runParallelWorkers', () => {
  it('executes work in parallel', async () => {
    const started = new Array<number>();
    const done = new Array<number>();
    const waiting = new Array<() => void>();

    const work = runParallelWorkers({
      items: [0, 1, 2, 3, 4],
      parallelismSetting: 4,
      parallelismFactor: 0.5, // 2 at a time
      worker: async item => {
        started.push(item);
        await new Promise<void>(resolve => {
          waiting[item] = resolve;
        });
        done.push(item);
      },
    });

    await new Promise(resolve => setTimeout(resolve));
    expect(started).toEqual([0, 1]);
    expect(done).toEqual([]);
    waiting[0]();

    await new Promise(resolve => setTimeout(resolve));
    expect(started).toEqual([0, 1, 2]);
    expect(done).toEqual([0]);
    waiting[1]();
    waiting[2]();

    await new Promise(resolve => setTimeout(resolve));
    expect(started).toEqual([0, 1, 2, 3, 4]);
    expect(done).toEqual([0, 1, 2]);
    waiting[3]();
    waiting[4]();

    await work;
    expect(done).toEqual([0, 1, 2, 3, 4]);
  });

  it('executes work sequentially', async () => {
    const started = new Array<number>();
    const done = new Array<number>();
    const waiting = new Array<() => void>();

    const work = runParallelWorkers({
      items: [0, 1, 2, 3, 4],
      parallelismFactor: 0, // 1 at a time
      worker: async item => {
        started.push(item);
        await new Promise<void>(resolve => {
          waiting[item] = resolve;
        });
        done.push(item);
      },
    });

    await new Promise(resolve => setTimeout(resolve));
    expect(started).toEqual([0]);
    expect(done).toEqual([]);
    waiting[0]();

    await new Promise(resolve => setTimeout(resolve));
    expect(started).toEqual([0, 1]);
    expect(done).toEqual([0]);
    waiting[1]();

    await new Promise(resolve => setTimeout(resolve));
    expect(started).toEqual([0, 1, 2]);
    waiting[2]();

    await new Promise(resolve => setTimeout(resolve));
    expect(started).toEqual([0, 1, 2, 3]);
    waiting[3]();

    await new Promise(resolve => setTimeout(resolve));
    expect(started).toEqual([0, 1, 2, 3, 4]);
    waiting[4]();

    await work;
    expect(done).toEqual([0, 1, 2, 3, 4]);
  });
});

describe('runWorkerQueueThreads', () => {
  it('should execute work in parallel', async () => {
    const sharedData = new SharedArrayBuffer(10);
    const sharedView = new Uint8Array(sharedData);

    const results = await runWorkerQueueThreads({
      threadCount: 4,
      workerData: sharedData,
      items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      workerFactory: data => {
        const view = new Uint8Array(data);

        return async (i: number) => {
          view[i] = 10 + i;
          return 20 + i;
        };
      },
    });

    expect(Array.from(sharedView)).toEqual([
      10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    ]);
    expect(results).toEqual([20, 21, 22, 23, 24, 25, 26, 27, 28, 29]);
  });
});

describe('runWorkerThreads', () => {
  it('should run a single thread without items', async () => {
    const [result] = await runWorkerThreads({
      threadCount: 1,
      workerData: 'foo',
      worker: async data => `${data}bar`,
    });

    expect(result).toBe('foobar');
  });

  it('should run multiple threads without items', async () => {
    const results = await runWorkerThreads({
      threadCount: 4,
      worker: async () => 'foo',
    });

    expect(results).toEqual(['foo', 'foo', 'foo', 'foo']);
  });

  it('should send messages', async () => {
    const messages = new Array<string>();

    await runWorkerThreads({
      threadCount: 2,
      worker: async (_data, sendMessage) => {
        sendMessage('a');
        await new Promise(resolve => setTimeout(resolve, 10));
        sendMessage('b');
        await new Promise(resolve => setTimeout(resolve, 10));
        sendMessage('c');
      },
      onMessage: (message: string) => messages.push(message),
    });

    expect(messages.sort()).toEqual(['a', 'a', 'b', 'b', 'c', 'c']);
  });
});
