/*
 * Copyright 2020 Spotify AB
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

import { Entity } from '../ingestion';
import { buildEntitySearch, visitEntityPart } from './search';
import { DbEntitiesSearchRow } from './types';

describe('search', () => {
  describe('visitEntityPart', () => {
    it('expands lists of strings to several rows', () => {
      const input = { a: ['b', 'c', 'd'] };
      const output: DbEntitiesSearchRow[] = [];
      visitEntityPart('eid', '', input, output);
      expect(output).toEqual([
        { entity_id: 'eid', key: 'a', value: 'b' },
        { entity_id: 'eid', key: 'a', value: 'c' },
        { entity_id: 'eid', key: 'a', value: 'd' },
      ]);
    });

    it('expands objects', () => {
      const input = { a: { b: { c: 'd' }, e: 'f' } };
      const output: DbEntitiesSearchRow[] = [];
      visitEntityPart('eid', '', input, output);
      expect(output).toEqual([
        { entity_id: 'eid', key: 'a.b.c', value: 'd' },
        { entity_id: 'eid', key: 'a.e', value: 'f' },
      ]);
    });

    it('converts base types to strings or null', () => {
      const input = {
        a: true,
        b: false,
        c: 7,
        d: 'string',
        e: null,
        f: undefined,
      };
      const output: DbEntitiesSearchRow[] = [];
      visitEntityPart('eid', '', input, output);
      expect(output).toEqual([
        { entity_id: 'eid', key: 'a', value: 'true' },
        { entity_id: 'eid', key: 'b', value: 'false' },
        { entity_id: 'eid', key: 'c', value: '7' },
        { entity_id: 'eid', key: 'd', value: 'string' },
        { entity_id: 'eid', key: 'e', value: null },
        { entity_id: 'eid', key: 'f', value: null },
      ]);
    });

    it('skips over special keys', () => {
      const input = {
        a: 'a',
        metadata: {
          b: 'b',
          name: 'name',
          namespace: 'namespace',
          uid: 'uid',
          etag: 'etag',
          generation: 'generation',
          c: 'c',
        },
        d: 'd',
      };
      const output: DbEntitiesSearchRow[] = [];
      visitEntityPart('eid', '', input, output);
      expect(output).toEqual([
        { entity_id: 'eid', key: 'a', value: 'a' },
        { entity_id: 'eid', key: 'metadata.b', value: 'b' },
        { entity_id: 'eid', key: 'metadata.c', value: 'c' },
        { entity_id: 'eid', key: 'd', value: 'd' },
      ]);
    });

    it('expands list of objects', () => {
      const input = { root: { list: [{ a: 1 }, { a: 2 }] } };
      const output: DbEntitiesSearchRow[] = [];
      visitEntityPart('eid', '', input, output);
      expect(output).toEqual([
        { entity_id: 'eid', key: 'root.list.a', value: '1' },
        { entity_id: 'eid', key: 'root.list.a', value: '2' },
      ]);
    });
  });

  describe('buildEntitySearch', () => {
    it('adds special keys even if missing', () => {
      const input: Entity = {
        apiVersion: 'a',
        kind: 'b',
      };
      expect(buildEntitySearch('eid', input)).toEqual([
        { entity_id: 'eid', key: 'metadata.name', value: null },
        { entity_id: 'eid', key: 'metadata.namespace', value: null },
        { entity_id: 'eid', key: 'metadata.uid', value: null },
        { entity_id: 'eid', key: 'apiVersion', value: 'a' },
        { entity_id: 'eid', key: 'kind', value: 'b' },
        { entity_id: 'eid', key: 'name', value: null },
        { entity_id: 'eid', key: 'namespace', value: null },
        { entity_id: 'eid', key: 'uid', value: null },
      ]);
    });

    it('adds prefix-stripped versions', () => {
      const input: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'name',
          labels: {
            lbl: 'lbl',
          },
          annotations: {
            ann: 'ann',
          },
        },
        spec: {
          sub: {
            spc: 'spc',
          },
        },
      };
      expect(buildEntitySearch('eid', input)).toStrictEqual(
        expect.arrayContaining([
          { entity_id: 'eid', key: 'metadata.name', value: 'name' },
          { entity_id: 'eid', key: 'name', value: 'name' },
          { entity_id: 'eid', key: 'metadata.labels.lbl', value: 'lbl' },
          { entity_id: 'eid', key: 'labels.lbl', value: 'lbl' },
          { entity_id: 'eid', key: 'lbl', value: 'lbl' },
          { entity_id: 'eid', key: 'metadata.annotations.ann', value: 'ann' },
          { entity_id: 'eid', key: 'annotations.ann', value: 'ann' },
          { entity_id: 'eid', key: 'ann', value: 'ann' },
          { entity_id: 'eid', key: 'spec.sub.spc', value: 'spc' },
          { entity_id: 'eid', key: 'sub.spc', value: 'spc' },
        ]),
      );
    });
  });
});
