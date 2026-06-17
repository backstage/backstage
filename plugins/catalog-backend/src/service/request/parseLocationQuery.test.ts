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

import { FilterPredicate } from '@backstage/filter-predicates';
import {
  encodeLocationQueryCursor,
  parseLocationQuery,
} from './parseLocationQuery';

function encodeCursor(cursor: object): string {
  return Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64');
}

describe('parseLocationQuery', () => {
  describe('initial request (no cursor)', () => {
    it('should use default limit of 1000 when not provided', () => {
      const result = parseLocationQuery({});
      expect(result.limit).toBe(1000);
      expect(result.afterId).toBeUndefined();
      expect(result.query).toBeUndefined();
    });

    it('should use provided limit', () => {
      const result = parseLocationQuery({ limit: 50 });
      expect(result.limit).toBe(50);
    });

    it('should parse a valid query', () => {
      const query = { type: 'url' };
      const result = parseLocationQuery({ query });
      expect(result.query).toEqual(query);
    });

    it('should parse a complex query with $all', () => {
      const query: FilterPredicate = {
        $all: [{ type: 'url' }, { target: { $in: ['a', 'b'] } }],
      };
      const result = parseLocationQuery({ query });
      expect(result.query).toEqual(query);
    });

    it('should throw on invalid limit (zero)', () => {
      expect(() =>
        parseLocationQuery({ limit: 0 }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Limit must be a positive integer >= 1"`,
      );
    });

    it('should throw on invalid limit (negative)', () => {
      expect(() =>
        parseLocationQuery({ limit: -5 }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Limit must be a positive integer >= 1"`,
      );
    });

    it('should throw on invalid limit (non-integer)', () => {
      expect(() =>
        parseLocationQuery({ limit: 1.5 }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Limit must be a positive integer >= 1"`,
      );
    });

    it('should throw on invalid query', () => {
      expect(() =>
        parseLocationQuery({ query: { $invalid: true } as any }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Invalid query: Validation error: Invalid at "$invalid""`,
      );
    });
  });

  describe('cursor request', () => {
    it('should parse a valid cursor', () => {
      const cursor = encodeCursor({ limit: 10, afterId: 'abc-123' });
      const result = parseLocationQuery({ cursor });
      expect(result.limit).toBe(10);
      expect(result.afterId).toBe('abc-123');
      expect(result.query).toBeUndefined();
    });

    it('should parse cursor with query', () => {
      const query = { type: 'url' };
      const cursor = encodeCursor({ limit: 25, afterId: 'xyz', query });
      const result = parseLocationQuery({ cursor });
      expect(result.limit).toBe(25);
      expect(result.afterId).toBe('xyz');
      expect(result.query).toEqual(query);
    });

    it('should parse cursor without afterId', () => {
      const cursor = encodeCursor({ limit: 15 });
      const result = parseLocationQuery({ cursor });
      expect(result.limit).toBe(15);
      expect(result.afterId).toBeUndefined();
    });

    it('cursor takes precedence over other request fields', () => {
      const cursor = encodeCursor({ limit: 10 });
      const result = parseLocationQuery({
        cursor,
        limit: 100,
        query: { type: 'file' },
      });
      expect(result.limit).toBe(10);
      expect(result.query).toBeUndefined();
    });

    it('should throw on invalid base64 cursor', () => {
      expect(() =>
        parseLocationQuery({ cursor: '!!not-base64!!' }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Malformed cursor, unknown encoding"`,
      );
    });

    it('should throw on invalid JSON cursor', () => {
      const cursor = Buffer.from('not json', 'utf8').toString('base64');
      expect(() =>
        parseLocationQuery({ cursor }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Malformed cursor, unknown encoding"`,
      );
    });

    it('should throw on cursor missing required limit', () => {
      const cursor = encodeCursor({ afterId: 'abc' });
      expect(() =>
        parseLocationQuery({ cursor }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Malformed cursor: Validation error: Required at "limit""`,
      );
    });

    it('should throw on cursor with invalid limit (zero)', () => {
      const cursor = encodeCursor({ limit: 0 });
      expect(() =>
        parseLocationQuery({ cursor }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Malformed cursor: Validation error: Number must be greater than or equal to 1 at "limit""`,
      );
    });

    it('should throw on cursor with invalid limit (non-integer)', () => {
      const cursor = encodeCursor({ limit: 2.5 });
      expect(() =>
        parseLocationQuery({ cursor }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Malformed cursor: Validation error: Expected integer, received float at "limit""`,
      );
    });

    it('should throw on cursor with invalid query', () => {
      const cursor = encodeCursor({ limit: 10, query: { $invalid: true } });
      expect(() =>
        parseLocationQuery({ cursor }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Malformed cursor: Validation error: Invalid at "query.$invalid""`,
      );
    });
  });

  describe('encodeLocationQueryCursor roundtrip', () => {
    it('should encode and decode a cursor with all fields', () => {
      const original = {
        limit: 50,
        afterId: 'some-uuid',
        query: { type: 'url' },
      };
      const encoded = encodeLocationQueryCursor(original);
      const decoded = parseLocationQuery({ cursor: encoded });
      expect(decoded).toEqual(original);
    });

    it('should encode and decode a cursor without optional fields', () => {
      const original = { limit: 25 };
      const encoded = encodeLocationQueryCursor(original);
      const decoded = parseLocationQuery({ cursor: encoded });
      expect(decoded.limit).toBe(25);
      expect(decoded.afterId).toBeUndefined();
      expect(decoded.query).toBeUndefined();
    });
  });
});
