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

import {
  parseParallelismOption,
  getEnvironmentParallelism,
  runParallelWorkers,
} from './parallel';

describe('parseParallelismOption', () => {
  it('coerces false no parallelism', () => {
    expect(parseParallelismOption(false)).toBe(1);
    expect(parseParallelismOption('false')).toBe(1);
  });

  it('coerces true or undefined to default parallelism', () => {
    expect(parseParallelismOption(true)).toBe(4);
    expect(parseParallelismOption('true')).toBe(4);
    expect(parseParallelismOption(undefined)).toBe(4);
    expect(parseParallelismOption(null)).toBe(4);
  });

  it('coerces number string to number', () => {
    expect(parseParallelismOption('2')).toBe(2);
  });

  it.each([['on'], [2.5], ['2.5']])('throws error for %p', value => {
    expect(() => parseParallelismOption(value as any)).toThrowError(
      `Parallel option value '${value}' is not a boolean or integer`,
    );
  });
});

describe('getEnvironmentParallelism', () => {
  it('reads the parallelism setting from the environment', () => {
    process.env.BACKSTAGE_CLI_BUILD_PARALLEL = '2';
    expect(getEnvironmentParallelism()).toBe(2);

    process.env.BACKSTAGE_CLI_BUILD_PARALLEL = 'true';
    expect(getEnvironmentParallelism()).toBe(4);

    process.env.BACKSTAGE_CLI_BUILD_PARALLEL = 'false';
    expect(getEnvironmentParallelism()).toBe(1);

    delete process.env.BACKSTAGE_CLI_BUILD_PARALLEL;
    expect(getEnvironmentParallelism()).toBe(4);
  });
});

describe('runParallelWorkers', () => {
  it('executes work in parallel', async () => {
    const started = new Array<number>();
    const done = new Array<number>();
    const waiting = new Array<() => void>();

    const work = runParallelWorkers({
      items: [0, 1, 2, 3, 4],
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
