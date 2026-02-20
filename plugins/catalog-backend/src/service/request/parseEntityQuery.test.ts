/*
 * Copyright 2026 The Backstage Authors
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

import { parseEntityQuery } from './parseEntityQuery';
import { encodeCursor } from '../util';
import { Cursor } from '../../catalog/types';

describe('parseEntityQuery', () => {
  describe('initial request', () => {
    it('returns empty result for empty request', () => {
      const result = parseEntityQuery({});
      expect(result).toEqual({
        query: undefined,
        orderFields: undefined,
        fullTextFilter: undefined,
        fields: undefined,
        limit: undefined,
      });
    });

    it('parses a simple query predicate', () => {
      const query = { kind: 'component' };
      const result = parseEntityQuery({ query });
      expect(result).toEqual(
        expect.objectContaining({ query: { kind: 'component' } }),
      );
    });

    it('parses a complex query with $all, $any, $not', () => {
      const query = {
        $all: [
          { kind: 'component' },
          { $any: [{ 'spec.type': 'service' }, { 'spec.type': 'website' }] },
          { $not: { 'spec.lifecycle': 'experimental' } },
        ],
      };
      const result = parseEntityQuery({ query });
      expect(result).toEqual(expect.objectContaining({ query }));
    });

    it('parses query with $exists operator', () => {
      const query = { 'metadata.labels.team': { $exists: true } };
      const result = parseEntityQuery({ query });
      expect(result).toEqual(expect.objectContaining({ query }));
    });

    it('parses query with $in operator', () => {
      const query = { kind: { $in: ['component', 'api'] } };
      const result = parseEntityQuery({ query });
      expect(result).toEqual(expect.objectContaining({ query }));
    });

    it('passes through limit', () => {
      const result = parseEntityQuery({ limit: 50 });
      expect(result).toEqual(expect.objectContaining({ limit: 50 }));
    });

    it('passes through fields', () => {
      const result = parseEntityQuery({
        fields: ['metadata.name', 'kind'],
      });
      expect(result).toEqual(
        expect.objectContaining({ fields: ['metadata.name', 'kind'] }),
      );
    });

    it('parses orderBy into orderFields', () => {
      const result = parseEntityQuery({
        orderBy: [
          { field: 'metadata.name', order: 'asc' },
          { field: 'metadata.namespace', order: 'desc' },
        ],
      });
      expect(result).toEqual(
        expect.objectContaining({
          orderFields: [
            { field: 'metadata.name', order: 'asc' },
            { field: 'metadata.namespace', order: 'desc' },
          ],
        }),
      );
    });

    it('parses fullTextFilter', () => {
      const result = parseEntityQuery({
        fullTextFilter: { term: 'search term', fields: ['metadata.name'] },
      });
      expect(result).toEqual(
        expect.objectContaining({
          fullTextFilter: {
            term: 'search term',
            fields: ['metadata.name'],
          },
        }),
      );
    });

    it('defaults fullTextFilter term to empty string when missing', () => {
      const result = parseEntityQuery({
        fullTextFilter: {} as any,
      });
      expect(result).toEqual(
        expect.objectContaining({
          fullTextFilter: { term: '', fields: undefined },
        }),
      );
    });

    it('throws on invalid query predicate', () => {
      expect(() =>
        parseEntityQuery({ query: { $invalid: true } as any }),
      ).toThrow(/Invalid query/);
    });

    it('throws when query root is not an object', () => {
      expect(() => parseEntityQuery({ query: 'bad' as any })).toThrow(
        /Query must be an object/,
      );
    });

    it('throws on invalid orderBy order value', () => {
      expect(() =>
        parseEntityQuery({
          // @ts-expect-error - invalid order value
          orderBy: [{ field: 'metadata.name', order: 'sideways' }],
        }),
      ).toThrow(/Invalid order field order/);
    });
  });

  describe('cursor request', () => {
    function makeCursor(partial: Partial<Cursor>): string {
      const full: Cursor = {
        orderFields: [],
        orderFieldValues: [],
        isPrevious: false,
        ...partial,
      };
      return encodeCursor(full);
    }

    it('decodes a valid cursor', () => {
      const cursor = makeCursor({
        orderFields: [{ field: 'metadata.name', order: 'asc' }],
        orderFieldValues: ['test'],
        isPrevious: false,
      });
      const result = parseEntityQuery({ cursor });
      expect(result).toEqual(
        expect.objectContaining({
          cursor: expect.objectContaining({
            orderFields: [{ field: 'metadata.name', order: 'asc' }],
            orderFieldValues: ['test'],
            isPrevious: false,
          }),
        }),
      );
    });

    it('passes through limit and fields with cursor', () => {
      const cursor = makeCursor({});
      const result = parseEntityQuery({
        cursor,
        limit: 25,
        fields: ['metadata.name'],
      });
      expect(result).toEqual(
        expect.objectContaining({
          limit: 25,
          fields: ['metadata.name'],
        }),
      );
    });

    it('throws on empty cursor string', () => {
      expect(() => parseEntityQuery({ cursor: '' })).toThrow(
        /Cursor cannot be empty/,
      );
    });

    it('throws on invalid base64 cursor', () => {
      expect(() => parseEntityQuery({ cursor: '!!not-valid!!' })).toThrow(
        /Malformed cursor/,
      );
    });

    it('throws on invalid JSON in cursor', () => {
      const cursor = Buffer.from('not json', 'utf8').toString('base64');
      expect(() => parseEntityQuery({ cursor })).toThrow(/Malformed cursor/);
    });
  });
});
