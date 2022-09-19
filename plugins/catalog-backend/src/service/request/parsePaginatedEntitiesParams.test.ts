/*
 * Copyright 2022 The Backstage Authors
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
  PaginatedEntitiesCursorRequest,
  PaginatedEntitiesInitialRequest,
} from '../../catalog/types';
import { parsePaginatedEntitiesParams } from './parsePaginatedEntitiesParams';

describe('parsePaginatedEntitiesParams', () => {
  describe('initial request', () => {
    it('should parse all the defined params', () => {
      const validRequest = {
        authorizationToken: 'to_not_be_returned',
        fields: ['kind'],
        limit: '3',
        filter: ['a=1', 'b=2'],
        sortField: ['metadata.name,desc'],
        query: 'query',
      };
      const parsedObj = parsePaginatedEntitiesParams(
        validRequest,
      ) as PaginatedEntitiesInitialRequest;
      expect(parsedObj.limit).toBe(3);
      expect(parsedObj.fields).toBeDefined();
      expect(parsedObj.sortFields).toEqual([
        { field: 'metadata.name', order: 'desc' },
      ]);
      expect(parsedObj.filter).toBeDefined();
      expect(parsedObj.query).toBe('query');
      expect(parsedObj).not.toHaveProperty('authorizationToken');
      expect(parsedObj).not.toHaveProperty('cursor');
    });
    it('should ignore optional params', () => {
      const parsedObj = parsePaginatedEntitiesParams(
        {},
      ) as PaginatedEntitiesInitialRequest;
      expect(parsedObj.limit).toBeUndefined();
      expect(parsedObj.fields).toBeUndefined();
      expect(parsedObj.sortFields).toBeUndefined();
      expect(parsedObj.filter).toBeUndefined();
      expect(parsedObj.query).toBeUndefined();
      expect(parsedObj).not.toHaveProperty('authorizationToken');
      expect(parsedObj).not.toHaveProperty('cursor');
    });

    it.each([
      {
        limit: 'asd',
      },
      { filter: 3 },
      { sortField: ['metadata.uid,diagonal'] },
      { fields: [4] },
      { query: [] },
    ])('should throw if some parameter is not valid %p', params => {
      expect(() => parsePaginatedEntitiesParams(params)).toThrow();
    });
  });

  describe('cursor request', () => {
    it('should parse all the defined params', () => {
      const validRequest = {
        authorizationToken: 'to_not_be_returned',
        fields: ['kind'],
        limit: '3',
        cursor: 'cursor',
      };
      const parsedObj = parsePaginatedEntitiesParams(
        validRequest,
      ) as PaginatedEntitiesCursorRequest;
      expect(parsedObj.limit).toBe(3);
      expect(parsedObj.fields).toBeDefined();
      expect(parsedObj.cursor).toBe('cursor');
    });

    it('should ignore unknown params', () => {
      const validRequest = {
        authorizationToken: 'to_not_be_returned',
        fields: ['kind'],
        limit: '3',
        cursor: 'cursor',
        filter: ['a=1', 'b=2'],
        sortField: 'sortField',
        sortFieldOrder: 'desc',
        query: 'query',
      };
      const parsedObj = parsePaginatedEntitiesParams(
        validRequest,
      ) as PaginatedEntitiesCursorRequest;
      expect(parsedObj.limit).toBe(3);
      expect(parsedObj.fields).toBeDefined();
      expect(parsedObj.cursor).toBe('cursor');
      expect(parsedObj).not.toHaveProperty('filter');
      expect(parsedObj).not.toHaveProperty('sortField');
      expect(parsedObj).not.toHaveProperty('sortFieldOrder');
      expect(parsedObj).not.toHaveProperty('query');
    });

    it('should ignore optional params', () => {
      const parsedObj = parsePaginatedEntitiesParams(
        {},
      ) as PaginatedEntitiesCursorRequest;
      expect(parsedObj.limit).toBeUndefined();
      expect(parsedObj.fields).toBeUndefined();
    });

    it.each([
      {
        limit: 'asd',
      },
      { cursor: [] },
      { fields: [4] },
    ])('should throw if some parameter is not valid %p', params => {
      expect(() => parsePaginatedEntitiesParams(params)).toThrow();
    });
  });
});
