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

import {
  getVoidLogger,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import {
  IndexBuilder,
  LunrSearchEngine,
  SearchEngine,
} from '@backstage/plugin-search-backend-node';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';

describe('createRouter', () => {
  let app: express.Express;
  let mockDiscoveryApi: jest.Mocked<PluginEndpointDiscovery>;
  let mockSearchEngine: jest.Mocked<SearchEngine>;

  beforeAll(async () => {
    const logger = getVoidLogger();
    const searchEngine = new LunrSearchEngine({ logger });
    const indexBuilder = new IndexBuilder({ logger, searchEngine });
    mockDiscoveryApi = {
      getBaseUrl: jest.fn(),
      getExternalBaseUrl: jest.fn().mockResolvedValue('http://localhost:3000/'),
    };

    const router = await createRouter({
      engine: indexBuilder.getSearchEngine(),
      logger,
      discovery: mockDiscoveryApi,
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /query', () => {
    it('returns empty results array', async () => {
      const response = await request(app).get('/query');

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({ results: [] });
    });

    describe('search result filtering', () => {
      beforeAll(async () => {
        const logger = getVoidLogger();
        mockDiscoveryApi = {
          getBaseUrl: jest.fn(),
          getExternalBaseUrl: jest
            .fn()
            .mockResolvedValue('http://localhost:3000/'),
        };
        mockSearchEngine = {
          index: jest.fn(),
          setTranslator: jest.fn(),
          query: jest.fn(),
        };
        const indexBuilder = new IndexBuilder({
          logger,
          searchEngine: mockSearchEngine,
        });

        const router = await createRouter({
          engine: indexBuilder.getSearchEngine(),
          logger,
          discovery: mockDiscoveryApi,
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
