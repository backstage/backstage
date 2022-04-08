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

import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { PermissionEvaluator } from '@backstage/plugin-permission-common';
import {
  IndexBuilder,
  SearchEngine,
} from '@backstage/plugin-search-backend-node';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';

const mockPermissionEvaluator: PermissionEvaluator = {
  authorize: () => {
    throw new Error('Not implemented');
  },
  authorizeConditional: () => {
    throw new Error('Not implemented');
  },
};

describe('createRouter', () => {
  let app: express.Express;
  let mockSearchEngine: jest.Mocked<SearchEngine>;

  beforeAll(async () => {
    const logger = getVoidLogger();
    mockSearchEngine = {
      getIndexer: jest.fn(),
      setTranslator: jest.fn(),
      query: jest.fn().mockResolvedValue({
        results: [],
        nextPageCursor: '',
        previousPageCursor: '',
      }),
    };
    const indexBuilder = new IndexBuilder({
      logger,
      searchEngine: mockSearchEngine,
    });

    const router = await createRouter({
      engine: indexBuilder.getSearchEngine(),
      types: {
        'first-type': {},
        'second-type': {},
      },
      config: new ConfigReader({ permissions: { enabled: false } }),
      permissions: mockPermissionEvaluator,
      logger,
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /query', () => {
    it('returns empty results array', async () => {
      const response = await request(app).get('/query');

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({ results: [] });
    });

    it.each([
      '',
      'term=foo',
      'term=foo&extra=param',
      'types[0]=first-type',
      'types[0]=first-type&types[1]=second-type',
      'filters[prop]=value',
      'pageCursor=foo',
    ])('accepts valid query string "%s"', async queryString => {
      const response = await request(app).get(`/query?${queryString}`);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        results: [],
      });
    });

    it.each([
      'term[0]=foo',
      'term[prop]=value',
      'types=foo',
      'types[0]=unknown-type',
      'types[length]=10000&types[0]=first-type',
      'filters=stringValue',
      'pageCursor[0]=1',
    ])('rejects invalid query string "%s"', async queryString => {
      const response = await request(app).get(`/query?${queryString}`);

      expect(response.status).toEqual(400);
      expect(response.body).toMatchObject({
        error: { message: /invalid query string/i },
      });
    });

    it('removes backend-only properties from search documents', async () => {
      mockSearchEngine.query.mockResolvedValue({
        results: [
          {
            type: 'software-catalog',
            document: {
              text: 'foo',
              title: 'bar baz',
              location: '/catalog/default/component/example',
              authorization: {
                resourceRef: 'component:default/example',
              },
            },
          },
        ],
        nextPageCursor: '',
        previousPageCursor: '',
      });

      const response = await request(app).get('/query');

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        results: [
          {
            type: 'software-catalog',
            document: {
              text: 'foo',
              title: 'bar baz',
              location: '/catalog/default/component/example',
            },
          },
        ],
      });
    });

    describe('search result filtering', () => {
      beforeAll(async () => {
        const logger = getVoidLogger();
        mockSearchEngine = {
          getIndexer: jest.fn(),
          setTranslator: jest.fn(),
          query: jest.fn(),
        };
        const indexBuilder = new IndexBuilder({
          logger,
          searchEngine: mockSearchEngine,
        });

        const router = await createRouter({
          engine: indexBuilder.getSearchEngine(),
          types: indexBuilder.getDocumentTypes(),
          config: new ConfigReader({ permissions: { enabled: false } }),
          permissions: mockPermissionEvaluator,
          logger,
        });
        app = express().use(router);
      });

      describe('where the search result set includes unsafe results', () => {
        const safeResult = {
          type: 'software-catalog',
          document: {
            text: 'safe',
            title: 'safe-location',
            // eslint-disable-next-line no-script-url
            location: '/catalog/default/component/safe',
          },
        };
        beforeEach(() => {
          mockSearchEngine.query.mockResolvedValue({
            results: [
              {
                type: 'software-catalog',
                document: {
                  text: 'unsafe',
                  title: 'unsafe-location',
                  // eslint-disable-next-line no-script-url
                  location: 'javascript:alert("unsafe")',
                },
              },
              safeResult,
            ],
            nextPageCursor: '',
            previousPageCursor: '',
          });
        });

        it('removes the unsafe results', async () => {
          const response = await request(app).get('/query');

          expect(response.status).toEqual(200);
          expect(response.body).toMatchObject({ results: [safeResult] });
        });
      });
    });
  });
});
