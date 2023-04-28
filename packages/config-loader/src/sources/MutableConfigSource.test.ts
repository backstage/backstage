/*
 * Copyright 2023 The Backstage Authors
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

import { ConfigSources } from './ConfigSources';
import { MutableConfigSource } from './MutableConfigSource';
import { isResolved, readAll } from './__testUtils__/testUtils';

describe('MutableConfigSource', () => {
  it('should be initialized with data', async () => {
    const source = MutableConfigSource.create({ data: { a: 1 } });
    const config = await ConfigSources.toConfig(source);
    expect(config.getNumber('a')).toEqual(1);
    config.close();
  });

  it('should be created without data', async () => {
    const source = MutableConfigSource.create();
    const it = source.readConfigData();
    const first = it.next();
    await expect(isResolved(first)).resolves.toBe(false);
    source.setData({ a: 1 });
    await expect(first).resolves.toEqual({
      value: {
        configs: [
          {
            data: { a: 1 },
            context: 'mutable-config',
          },
        ],
      },
      done: false,
    });
  });

  it('should be mutable and work with multiple consumers', async () => {
    const source = MutableConfigSource.create({ data: { a: 1 } });
    const resultsPromise = readAll(source);

    const it = source.readConfigData();
    await expect(it.next()).resolves.toEqual({
      value: {
        configs: [
          {
            data: { a: 1 },
            context: 'mutable-config',
          },
        ],
      },
      done: false,
    });

    const next2 = it.next();
    source.setData({ a: 2 });
    await expect(next2).resolves.toEqual({
      value: {
        configs: [
          {
            data: { a: 2 },
            context: 'mutable-config',
          },
        ],
      },
      done: false,
    });

    const next3 = it.next();
    source.setData({ a: 3 });
    await expect(next3).resolves.toEqual({
      value: {
        configs: [
          {
            data: { a: 3 },
            context: 'mutable-config',
          },
        ],
      },
      done: false,
    });

    const last = it.next();
    source.close();
    await expect(last).resolves.toEqual({
      done: true,
    });

    await expect(resultsPromise).resolves.toEqual([
      [{ data: { a: 1 }, context: 'mutable-config' }],
      [{ data: { a: 2 }, context: 'mutable-config' }],
      [{ data: { a: 3 }, context: 'mutable-config' }],
    ]);
  });

  it('should be self-mutable', async () => {
    const source = MutableConfigSource.create({ data: { a: 1 } });
    const resultsPromise = readAll(source);

    for await (const { configs } of source.readConfigData()) {
      const a = configs[0].data.a as number;
      if (a < 3) {
        source.setData({ a: a + 1 });
      } else {
        source.close();
      }
    }

    await expect(resultsPromise).resolves.toEqual([
      [{ data: { a: 1 }, context: 'mutable-config' }],
      [{ data: { a: 2 }, context: 'mutable-config' }],
      [{ data: { a: 3 }, context: 'mutable-config' }],
    ]);
  });
});
