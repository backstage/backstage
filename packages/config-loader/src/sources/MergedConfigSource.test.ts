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

import { MergedConfigSource } from './MergedConfigSource';
import { MutableConfigSource } from './MutableConfigSource';
import { isResolved, readAll, simpleSource } from './__testUtils__/testUtils';
import { ConfigSource } from './types';

describe('MergedConfigSource', () => {
  it('should forward from a single source', async () => {
    const source = simpleSource([{ a: 1 }, { a: 2 }, { a: 3 }]);
    const merged = MergedConfigSource.from([source]);
    await expect(readAll(merged)).resolves.toEqual([
      [{ data: { a: 1 }, context: 'mock-source' }],
      [{ data: { a: 2 }, context: 'mock-source' }],
      [{ data: { a: 3 }, context: 'mock-source' }],
    ]);
  });

  it('should forward from multiple sources', async () => {
    const sourceA = simpleSource([{ a: 1 }, { a: 2 }, { a: 3 }], 'a');
    const sourceB = simpleSource([{ b: 1 }, { b: 2 }], 'b');
    const sourceC = simpleSource([{ c: 1 }], 'c');
    const merged = MergedConfigSource.from([sourceA, sourceB, sourceC]);
    await expect(readAll(merged)).resolves.toEqual([
      [
        { data: { a: 1 }, context: 'a' },
        { data: { b: 1 }, context: 'b' },
        { data: { c: 1 }, context: 'c' },
      ],
      [
        { data: { a: 2 }, context: 'a' },
        { data: { b: 1 }, context: 'b' },
        { data: { c: 1 }, context: 'c' },
      ],
      [
        { data: { a: 3 }, context: 'a' },
        { data: { b: 1 }, context: 'b' },
        { data: { c: 1 }, context: 'c' },
      ],
      [
        { data: { a: 3 }, context: 'a' },
        { data: { b: 2 }, context: 'b' },
        { data: { c: 1 }, context: 'c' },
      ],
    ]);
  });

  it('should forward from multiple sources at difference pace', async () => {
    const sourceA = MutableConfigSource.create({ context: 'a' });
    const sourceB = MutableConfigSource.create({ context: 'b' });
    const merged = MergedConfigSource.from([sourceA, sourceB]);

    const it = merged.readConfigData();

    const first = it.next();
    await expect(isResolved(first, { wait: true })).resolves.toBe(false);
    sourceA.setData({ a: 1 });
    await expect(isResolved(first, { wait: true })).resolves.toBe(false);
    sourceB.setData({ b: 1 });

    await expect(first).resolves.toEqual({
      value: {
        data: [
          { data: { a: 1 }, context: 'a' },
          { data: { b: 1 }, context: 'b' },
        ],
      },
      done: false,
    });

    sourceB.setData({ b: 2 });

    await expect(it.next()).resolves.toEqual({
      value: {
        data: [
          { data: { a: 1 }, context: 'a' },
          { data: { b: 2 }, context: 'b' },
        ],
      },
      done: false,
    });

    const last = it.next();
    await expect(isResolved(last, { wait: true })).resolves.toBe(false);
    sourceA.close();
    await expect(isResolved(last, { wait: true })).resolves.toBe(false);
    sourceB.close();
    await expect(isResolved(last, { wait: true })).resolves.toBe(true);

    await expect(last).resolves.toEqual({
      done: true,
    });
  });

  it('should be flattened', async () => {
    const sym = Symbol.for(
      '@backstage/config-loader#MergedConfigSource.sources',
    );
    const sourceA: ConfigSource = {
      async *readConfigData() {
        yield { configs: [] };
      },
    };
    const sourceD: ConfigSource = {
      async *readConfigData() {
        yield { configs: [] };
      },
    };
    const sourceB: ConfigSource = {
      async *readConfigData() {
        yield { configs: [] };
      },
    };
    const sourceC: ConfigSource = {
      async *readConfigData() {
        yield { configs: [] };
      },
    };

    const sourceAB = MergedConfigSource.from([sourceA, sourceB]);
    const sourceABC = MergedConfigSource.from([sourceAB, sourceC]);
    const sourceABCD = MergedConfigSource.from([sourceABC, sourceD]);

    expect((sourceAB as any)[sym]).toEqual([sourceA, sourceB]);
    expect((sourceABC as any)[sym]).toEqual([sourceA, sourceB, sourceC]);
    expect((sourceABCD as any)[sym]).toEqual([
      sourceA,
      sourceB,
      sourceC,
      sourceD,
    ]);

    await expect(readAll(sourceAB)).resolves.toEqual([[]]);
    await expect(readAll(sourceABC)).resolves.toEqual([[]]);
    await expect(readAll(sourceABCD)).resolves.toEqual([[]]);
  });
});
