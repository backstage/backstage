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
  Cursor,
  QueryEntitiesCursorRequest,
  QueryEntitiesInitialRequest,
} from '../../catalog/types';
import { encodeCursor } from '../util';
import { parseQueryEntitiesParams } from './parseQueryEntitiesParams';

describe('parseQueryEntitiesParams', () => {
  describe('initial request', () => {
    it('should parse all the defined params', () => {
      const validRequest = {
        authorizationToken: 'to_not_be_returned',
        fields: ['kind'],
        limit: 3,
        filter: ['a=1', 'b=2'],
        orderField: ['metadata.name,desc'],
        fullTextFilterTerm: 'query',
        fullTextFilterFields: ['metadata.name', 'metadata.namespace'],
      };
      const parsedObj = parseQueryEntitiesParams(
        validRequest,
      ) as QueryEntitiesInitialRequest;
      expect(parsedObj.fields).toBeDefined();
      expect(parsedObj.orderFields).toEqual([
        { field: 'metadata.name', order: 'desc' },
      ]);
      expect(parsedObj.filter).toBeDefined();
      expect(parsedObj.fullTextFilter).toEqual({
        term: 'query',
        fields: ['metadata.name', 'metadata.namespace'],
      });
      expect(parsedObj).not.toHaveProperty('authorizationToken');
      expect(parsedObj).not.toHaveProperty('cursor');
    });
    it('should ignore optional params', () => {
      const parsedObj = parseQueryEntitiesParams(
        {},
      ) as QueryEntitiesInitialRequest;
      expect(parsedObj.fields).toBeUndefined();
      expect(parsedObj.orderFields).toBeUndefined();
      expect(parsedObj.filter).toBeUndefined();
      expect(parsedObj.fullTextFilter).toEqual({ term: '', fields: undefined });
      expect(parsedObj).not.toHaveProperty('authorizationToken');
      expect(parsedObj).not.toHaveProperty('cursor');
    });

    it.each([
      { filter: 3 },
      { orderField: ['metadata.uid,diagonal'] },
      { fields: [4] },
    ])('should throw if some parameter is not valid %p', (params: any) => {
      expect(() => parseQueryEntitiesParams(params)).toThrow();
    });
  });

  describe('cursor request', () => {
    it('should parse all the defined params', () => {
      const cursor: Cursor = {
        totalItems: 100,
        orderFields: [],
        orderFieldValues: [],
        isPrevious: false,
      };
      const validRequest = {
        authorizationToken: 'to_not_be_returned',
        fields: ['kind'],
        limit: 3,
        cursor: encodeCursor(cursor),
      };
      const parsedObj = parseQueryEntitiesParams(
        validRequest,
      ) as QueryEntitiesCursorRequest;
      expect(parsedObj.fields).toBeDefined();
      expect(parsedObj.cursor).toEqual(cursor);
    });

    it('should ignore unknown params', () => {
      const cursor: Cursor = {
        totalItems: 100,
        orderFields: [],
        orderFieldValues: [],
        isPrevious: false,
      };
      const validRequest = {
        authorizationToken: 'to_not_be_returned',
        fields: ['kind'],
        limit: 3,
        cursor: encodeCursor(cursor),
        filter: ['a=1', 'b=2'],
        orderField: ['orderField,desc'],
        query: 'query',
      };
      const parsedObj = parseQueryEntitiesParams(
        validRequest,
      ) as QueryEntitiesCursorRequest;
      expect(parsedObj.fields).toBeDefined();
      expect(parsedObj.cursor).toEqual(cursor);
      expect(parsedObj).not.toHaveProperty('filter');
      expect(parsedObj).not.toHaveProperty('orderField');
      expect(parsedObj).not.toHaveProperty('query');
    });

    it('should ignore optional params', () => {
      const parsedObj = parseQueryEntitiesParams(
        {},
      ) as QueryEntitiesCursorRequest;
      expect(parsedObj.fields).toBeUndefined();
    });

    it.each([{ cursor: [] }, { fields: [4] }])(
      'should throw if some parameter is not valid %p',
      (params: any) => {
        expect(() => parseQueryEntitiesParams(params)).toThrow();
      },
    );
  });
});
