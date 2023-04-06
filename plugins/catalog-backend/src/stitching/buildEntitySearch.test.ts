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

import { Entity, DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { buildEntitySearch, mapToRows, traverse } from './buildEntitySearch';

describe('buildEntitySearch', () => {
  describe('traverse', () => {
    it('expands lists of strings to several rows', () => {
      const input = { a: ['b', 'c', 'd'] };
      const output = traverse(input);
      expect(output).toEqual([
        { key: 'a', value: 'b' },
        { key: 'a.b', value: true },
        { key: 'a', value: 'c' },
        { key: 'a.c', value: true },
        { key: 'a', value: 'd' },
        { key: 'a.d', value: true },
      ]);
    });

    it('expands objects', () => {
      const input = { a: { b: { c: 'd' }, e: 'f' } };
      const output = traverse(input);
      expect(output).toEqual([
        { key: 'a.b.c', value: 'd' },
        { key: 'a.e', value: 'f' },
      ]);
    });

    it('expands list of objects', () => {
      const input = { root: { list: [{ a: 1 }, { a: 2 }] } };
      const output = traverse(input);
      expect(output).toEqual([
        { key: 'root.list.a', value: 1 },
        { key: 'root.list.a', value: 2 },
      ]);
    });

    it('skips over special keys', () => {
      const input = {
        status: { x: 1 },
        attachments: [{ y: 2 }],
        relations: [{ z: 3 }],
        a: 'a',
        metadata: {
          b: 'b',
          name: 'name',
          namespace: 'namespace',
          uid: 'uid',
          etag: 'etag',
          c: 'c',
        },
        d: 'd',
      };
      const output = traverse(input);
      expect(output).toEqual([
        { key: 'a', value: 'a' },
        { key: 'metadata.b', value: 'b' },
        { key: 'metadata.c', value: 'c' },
        { key: 'd', value: 'd' },
      ]);
    });
  });

  describe('mapToRows', () => {
    it('converts base types to strings or null', () => {
      const input = [
        { key: 'a', value: true },
        { key: 'b', value: false },
        { key: 'c', value: 7 },
        { key: 'd', value: 'string' },
        { key: 'e', value: null },
        { key: 'f', value: undefined },
      ];
      const output = mapToRows(input, 'eid');
      expect(output).toEqual([
        { entity_id: 'eid', key: 'a', original_value: 'true', value: 'true' },
        { entity_id: 'eid', key: 'b', original_value: 'false', value: 'false' },
        { entity_id: 'eid', key: 'c', original_value: '7', value: '7' },
        {
          entity_id: 'eid',
          key: 'd',
          original_value: 'string',
          value: 'string',
        },
        { entity_id: 'eid', key: 'e', original_value: null, value: null },
        { entity_id: 'eid', key: 'f', original_value: null, value: null },
      ]);
    });

    it('emits lowercase version of keys and values and also keeps the original value', () => {
      const input = [{ key: 'fOo', value: 'BaR' }];
      const output = mapToRows(input, 'eid');
      expect(output).toEqual([
        { entity_id: 'eid', key: 'foo', original_value: 'BaR', value: 'bar' },
      ]);
    });

    it('skips very large keys', () => {
      const input = [{ key: 'a'.repeat(10000), value: 'foo' }];
      const output = mapToRows(input, 'eid');
      expect(output).toEqual([]);
    });

    it('replaces very large values with null', () => {
      const input = [{ key: 'foo', value: 'a'.repeat(10000) }];
      const output = mapToRows(input, 'eid');
      expect(output).toEqual([
        { entity_id: 'eid', key: 'foo', original_value: null, value: null },
      ]);
    });
  });

  describe('buildEntitySearch', () => {
    it('adds special keys even if missing', () => {
      const input: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: { name: 'n' },
      };
      expect(buildEntitySearch('eid', input)).toEqual([
        {
          entity_id: 'eid',
          key: 'apiversion',
          original_value: 'a',
          value: 'a',
        },
        { entity_id: 'eid', key: 'kind', original_value: 'b', value: 'b' },
        {
          entity_id: 'eid',
          key: 'metadata.name',
          original_value: 'n',
          value: 'n',
        },
        {
          entity_id: 'eid',
          key: 'metadata.namespace',
          original_value: null,
          value: null,
        },
        {
          entity_id: 'eid',
          key: 'metadata.uid',
          original_value: null,
          value: null,
        },
        {
          entity_id: 'eid',
          key: 'metadata.namespace',
          original_value: DEFAULT_NAMESPACE,
          value: DEFAULT_NAMESPACE,
        },
      ]);
    });

    it('adds relations', () => {
      const input: Entity = {
        relations: [
          {
            type: 't1',
            targetRef: 'k:ns/a',
          },
          {
            type: 't2',
            targetRef: 'k:ns/b',
          },
        ],
        apiVersion: 'a',
        kind: 'b',
        metadata: { name: 'n' },
      };
      expect(buildEntitySearch('eid', input)).toEqual([
        {
          entity_id: 'eid',
          key: 'apiversion',
          original_value: 'a',
          value: 'a',
        },
        { entity_id: 'eid', key: 'kind', original_value: 'b', value: 'b' },
        {
          entity_id: 'eid',
          key: 'metadata.name',
          original_value: 'n',
          value: 'n',
        },
        {
          entity_id: 'eid',
          key: 'metadata.namespace',
          original_value: null,
          value: null,
        },
        {
          entity_id: 'eid',
          key: 'metadata.uid',
          original_value: null,
          value: null,
        },
        {
          entity_id: 'eid',
          key: 'metadata.namespace',
          original_value: DEFAULT_NAMESPACE,
          value: DEFAULT_NAMESPACE,
        },
        {
          entity_id: 'eid',
          key: 'relations.t1',
          original_value: 'k:ns/a',
          value: 'k:ns/a',
        },
        {
          entity_id: 'eid',
          key: 'relations.t2',
          original_value: 'k:ns/b',
          value: 'k:ns/b',
        },
      ]);
    });

    it('rejects duplicate keys', () => {
      expect(() =>
        buildEntitySearch('eid', {
          relations: [],
          apiVersion: 'a',
          kind: 'b',
          metadata: {
            name: 'n',
            Namespace: 'ns',
          },
        }),
      ).toThrow(
        `Entity has duplicate keys that vary only in casing, 'metadata.namespace'`,
      );

      expect(() =>
        buildEntitySearch('eid', {
          relations: [
            {
              type: 'dup',
              targetRef: 'k:ns/a',
            },
            {
              type: 'DUP',
              targetRef: 'k:ns/b',
            },
          ],
          apiVersion: 'a',
          kind: 'b',
          metadata: { name: 'n' },
        }),
      ).toThrow(
        `Entity has duplicate keys that vary only in casing, 'relations.dup'`,
      );

      expect(() =>
        buildEntitySearch('eid', {
          apiVersion: 'a',
          kind: 'b',
          metadata: { name: 'n' },
          spec: {
            owner: 'o',
            OWNER: 'o',
            lifecycle: 'production',
            lifeCycle: 'production',
          },
        }),
      ).toThrow(
        `Entity has duplicate keys that vary only in casing, 'spec.owner', 'spec.lifecycle'`,
      );
    });
  });
});
