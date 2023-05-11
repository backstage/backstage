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

import { getVoidLogger } from '@backstage/backend-common';
import {
  ExploreTool,
  GetExploreToolsRequest,
} from '@backstage/plugin-explore-common';
import express from 'express';
import request from 'supertest';
import { ExploreToolProvider } from '../tools';
import { createRouter } from './router';

const mockTools: ExploreTool[] = [
  { title: 'Tool 1', url: 'https://example.com/tool1', image: '' },
  { title: 'Tool 2', url: 'https://example.com/tool2', image: '' },
  { title: 'Tool 3', url: 'https://example.com/tool2', image: '' },
];

describe('createRouter', () => {
  let app: express.Express;
  const toolProvider: ExploreToolProvider = {
    getTools: async ({}: GetExploreToolsRequest) => {
      return {
        tools: mockTools,
      };
    },
  };

  beforeAll(async () => {
    const router = await createRouter({
      logger: getVoidLogger(),
      toolProvider,
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /tools', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/tools');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(
        expect.objectContaining({ tools: mockTools }),
      );
    });
  });
});
