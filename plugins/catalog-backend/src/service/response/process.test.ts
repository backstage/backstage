/*
 * Copyright 2024 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import { performance } from 'node:perf_hooks';
import { entitiesResponseToObjects, processRawEntitiesResult } from './process';

const mockTransform = (entity: Entity): Entity => ({
  ...entity,
  kind: `transformed-${entity.kind}`,
});

describe('processRawEntitiesResult', () => {
  it('should leave unprojected results untouched', async () => {
    const entities = ['{ "kind": "test" }', null];
    const result = await processRawEntitiesResult(entities);
    expect(result).toEqual({
      type: 'raw',
      entities: ['{ "kind": "test" }', null],
    });
    expect(result.type === 'raw' && result.entities).toBe(entities);
  });

  it('should serialize projected batches, preserving order and nulls', async () => {
    expect(
      await processRawEntitiesResult(
        ['{"kind":"first"}', null, '{"kind":"last"}', null],
        mockTransform,
      ),
    ).toEqual({
      type: 'raw-batches',
      batches: [
        '[{"kind":"transformed-first"},null,{"kind":"transformed-last"},null]',
      ],
    });
    expect(await processRawEntitiesResult([], mockTransform)).toEqual({
      type: 'raw',
      entities: [],
    });
  });

  it('should bound batches and preserve nulls at batch boundaries', async () => {
    const input = Array.from({ length: 202 }, (_, i) =>
      i === 99 || i === 100 ? null : JSON.stringify({ kind: `${i}` }),
    );
    const result = await processRawEntitiesResult(input, mockTransform);
    expect(result.type).toBe('raw-batches');
    if (result.type !== 'raw-batches') throw new Error('Expected batches');
    const batches = result.batches.map(batch => JSON.parse(batch));
    expect(batches.map(batch => batch.length)).toEqual([100, 100, 2]);
    expect(batches[0][99]).toBeNull();
    expect(batches[1][0]).toBeNull();
    expect(batches[2]).toEqual([
      { kind: 'transformed-200' },
      { kind: 'transformed-201' },
    ]);
    expect(entitiesResponseToObjects(result)).toHaveLength(202);
  });

  it('should keep a single projected entity in raw form', async () => {
    expect(
      await processRawEntitiesResult(['{"kind":"test"}'], mockTransform),
    ).toEqual({
      type: 'raw',
      entities: ['{"kind":"transformed-test"}'],
    });
    expect(await processRawEntitiesResult([null], mockTransform)).toEqual({
      type: 'raw',
      entities: [null],
    });
  });

  it('should shorten batches for large entities without losing oversized entities', async () => {
    const input = [600_000, 600_000, 1_100_000, 10].map(size =>
      JSON.stringify({ kind: 'test', spec: { description: 'x'.repeat(size) } }),
    );
    const result = await processRawEntitiesResult(input, mockTransform);
    expect(result.type).toBe('raw-batches');
    if (result.type !== 'raw-batches') throw new Error('Expected batches');
    expect(result.batches.map(batch => JSON.parse(batch).length)).toEqual([
      1, 1, 1, 1,
    ]);
    const decoded = entitiesResponseToObjects(result);
    expect(decoded).toHaveLength(4);
    expect(
      decoded.map(entity => (entity!.spec!.description as string).length),
    ).toEqual([600_000, 600_000, 1_100_000, 10]);
  });

  it('should let other event-loop work run while projecting an expensive page', async () => {
    // Advance only the CPU clock: real immediates must get a turn, without
    // requiring slow or timing-sensitive CPU work in the test itself.
    let elapsed = 0;
    const clock = jest
      .spyOn(performance, 'now')
      .mockImplementation(() => elapsed);
    let processed = 0;
    const progress: number[] = [];
    let observer: NodeJS.Immediate;
    const observe = () => {
      progress.push(processed);
      observer = setImmediate(observe);
    };
    observer = setImmediate(observe);

    try {
      const result = await processRawEntitiesResult(
        Array(250).fill('{"kind":"test"}'),
        entity => {
          ++processed;
          elapsed += 0.1;
          return mockTransform(entity);
        },
      );
      expect(processed).toBe(250);
      expect(progress).toEqual([100, 200]);
      expect(entitiesResponseToObjects(result)).toEqual(
        Array(250).fill({ kind: 'transformed-test' }),
      );
    } finally {
      clearImmediate(observer);
      clock.mockRestore();
    }
  });

  it('should not schedule a yield for a cheap projection', async () => {
    const clock = jest.spyOn(performance, 'now').mockReturnValue(0);
    let yielded = false;
    const observer = setImmediate(() => {
      yielded = true;
    });
    try {
      await processRawEntitiesResult(
        Array(250).fill('{"kind":"test"}'),
        mockTransform,
      );
      expect(yielded).toBe(false);
    } finally {
      clearImmediate(observer);
      clock.mockRestore();
    }
  });

  it('should reject malformed JSON and failed transforms before returning a page', async () => {
    await expect(async () =>
      processRawEntitiesResult(
        [...Array(100).fill('{"kind":"test"}'), 'invalid'],
        mockTransform,
      ),
    ).rejects.toThrow(SyntaxError);
    await expect(async () =>
      processRawEntitiesResult(['{"kind":"test"}'], () => {
        throw new Error('projection failed');
      }),
    ).rejects.toThrow('projection failed');
  });
});

describe('entitiesResponseToObjects', () => {
  it('should convert entities in object form', () => {
    expect(
      entitiesResponseToObjects({
        type: 'object',
        entities: [null, { kind: 'test' } as Entity],
      }),
    ).toEqual([null, { kind: 'test' }]);
  });

  it('should convert entities in raw form', () => {
    expect(
      entitiesResponseToObjects({
        type: 'raw',
        entities: [null, '{"kind":"test"}'],
      }),
    ).toEqual([null, { kind: 'test' }]);
  });
});
