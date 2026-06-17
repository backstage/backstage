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

import { runConcurrentTasks } from './runConcurrentTasks';

describe('runConcurrentTasks', () => {
  afterEach(() => {
    delete process.env.BACKSTAGE_CLI_CONCURRENCY;
  });

  it('executes work in parallel', async () => {
    const started = new Array<number>();
    const done = new Array<number>();
    const waiting = new Array<() => void>();

    process.env.BACKSTAGE_CLI_CONCURRENCY = '4';
    const work = runConcurrentTasks({
      items: [0, 1, 2, 3, 4],
      concurrencyFactor: 0.5, // 2 at a time
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

    const work = runConcurrentTasks({
      items: [0, 1, 2, 3, 4],
      concurrencyFactor: 0, // 1 at a time
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

  it('returns void', async () => {
    const result = await runConcurrentTasks({
      items: [1, 2, 3],
      worker: async () => {},
    });
    expect(result).toBeUndefined();
  });

  it('defaults to environment concurrency', async () => {
    const started = new Array<number>();
    process.env.BACKSTAGE_CLI_CONCURRENCY = '2';

    await runConcurrentTasks({
      items: [0, 1],
      worker: async item => {
        started.push(item);
      },
    });

    expect(started).toEqual([0, 1]);
  });

  it('supports the deprecated BACKSTAGE_CLI_BUILD_PARALLEL with a warning', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

    process.env.BACKSTAGE_CLI_BUILD_PARALLEL = '2';
    await runConcurrentTasks({
      items: [0, 1],
      worker: async () => {},
    });

    expect(warnSpy).toHaveBeenCalledWith(
      'The BACKSTAGE_CLI_BUILD_PARALLEL environment variable is deprecated, use BACKSTAGE_CLI_CONCURRENCY instead',
    );

    delete process.env.BACKSTAGE_CLI_BUILD_PARALLEL;
    warnSpy.mockRestore();
  });
});
