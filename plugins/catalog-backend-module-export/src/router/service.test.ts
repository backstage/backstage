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

/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 */
import { ParsedQs } from 'qs';

function loadServiceWithRemap(map: Record<string, string>) {
  jest.resetModules();
  jest.doMock('../types', () => ({
    __esModule: true,
    REQUEST_COLUMN_ENTITY_FILTER_MAP: map,
  }));
  return require('./service') as typeof import('./service');
}

describe('toEntityFilterQuery', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('returns undefined for null input', () => {
    const svc = loadServiceWithRemap({});
    expect(
      svc.toEntityFilterQuery(null as unknown as ParsedQs),
    ).toBeUndefined();
  });

  it('parses JSON string containing an object', () => {
    const svc = loadServiceWithRemap({});
    const json = JSON.stringify({ name: 'alice', count: 3 });
    const res = svc.toEntityFilterQuery(json as unknown as ParsedQs);
    expect(res).toEqual({ name: 'alice', count: '3' });
  });

  it('parses JSON string containing an array of objects', () => {
    const svc = loadServiceWithRemap({});
    const json = JSON.stringify([{ name: 'a' }, { name: 'b' }]);
    const res = svc.toEntityFilterQuery(json as unknown as ParsedQs);
    expect(res).toEqual([{ name: 'a' }, { name: 'b' }]);
  });

  it('throws for invalid JSON string', () => {
    const svc = loadServiceWithRemap({});
    expect(() =>
      svc.toEntityFilterQuery('not a json' as unknown as ParsedQs),
    ).toThrow('`filter(s)` must be an object/array or valid JSON string');
  });

  it('normalizes values to strings and arrays of strings for object input', () => {
    const svc = loadServiceWithRemap({});
    const input = {
      single: 42,
      multi: [1, 'two', true],
      dotPath: 'spec.type',
    } as unknown as ParsedQs;
    const res = svc.toEntityFilterQuery(input);
    expect(res).toEqual({
      single: '42',
      multi: ['1', 'two', 'true'],
      dotPath: 'spec.type',
    });
  });

  it('normalizes an array of objects', () => {
    const svc = loadServiceWithRemap({});
    const input = [{ a: 1, b: ['x', 2] }, { a: 'z' }] as unknown as ParsedQs;
    const res = svc.toEntityFilterQuery(input);
    expect(res).toEqual([{ a: '1', b: ['x', '2'] }, { a: 'z' }]);
  });

  it('throws for unsupported primitive input types', () => {
    const svc = loadServiceWithRemap({});
    expect(() => svc.toEntityFilterQuery(123 as unknown as ParsedQs)).toThrow(
      '`filter(s)` must be an object or array of objects',
    );
  });

  it('remaps request keys using REQUEST_COLUMN_ENTITY_FILTER_MAP when configured', () => {
    const svc = loadServiceWithRemap({
      name: 'metadata.name',
      col: 'spec.owner',
    });
    const res = svc.toEntityFilterQuery({
      name: 'alice',
      col: 'team-a',
      x: 1,
    } as unknown as ParsedQs);
    expect(res).toEqual({
      'metadata.name': 'alice',
      'spec.owner': 'team-a',
      x: '1',
    });
  });
});
