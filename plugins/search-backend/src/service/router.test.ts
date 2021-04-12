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

import { getVoidLogger } from '@backstage/backend-common';
import { IndexBuilder } from '@backstage/plugin-search-backend-node';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const logger = getVoidLogger();
    const indexBuilder = new IndexBuilder({ logger });
    const router = await createRouter({
      logger,
      engine: indexBuilder.getSearchEngine(),
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
  });
});
