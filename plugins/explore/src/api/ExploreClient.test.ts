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
  ExploreTool,
  GetExploreToolsResponse,
} from '@backstage/plugin-explore-common';
import { MockFetchApi, setupRequestMockHandlers } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { ExploreClient } from './ExploreClient';

const server = setupServer();

describe('ExploreClient', () => {
  setupRequestMockHandlers(server);

  const mockBaseUrl = 'http://backstage/api/explore';
  const discoveryApi = { getBaseUrl: async () => mockBaseUrl };
  const fetchApi = new MockFetchApi();

  let client: ExploreClient;
  beforeEach(() => {
    client = new ExploreClient({ discoveryApi, fetchApi });
  });

  describe('getTools', () => {
    const mockTools: ExploreTool[] = [
      {
        title: 'Tool 1',
        image: 'https://example.com/image.png',
        url: 'https://example.com',
      },
      {
        title: 'Tool 2',
        image: 'https://example.com/image.png',
        url: 'https://example.com',
      },
    ];

    it('should fetch data from the explore-backend', async () => {
      const expectedResponse: GetExploreToolsResponse = {
        tools: mockTools,
      };

      server.use(
        rest.get(`${mockBaseUrl}/tools`, (_, res, ctx) =>
          res(ctx.json(expectedResponse)),
        ),
      );

      const response = await client.getTools();
      expect(response).toEqual(expectedResponse);
    });

    it('should request explore tools with specific filters', async () => {
      const expectedResponse: GetExploreToolsResponse = {
        tools: mockTools,
      };

      server.use(
        rest.get(`${mockBaseUrl}/tools`, (req, res, ctx) => {
          expect(req.url.search).toBe('?tag=a&tag=b&lifecycle=alpha');
          return res(ctx.json(expectedResponse));
        }),
      );

      const response = await client.getTools({
        filter: { tags: ['a', 'b'], lifecycle: ['alpha'] },
      });
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('when using exploreToolsConfig for backwards compatibility', () => {
    const mockExploreToolsConfig = {
      getTools: jest.fn(),
    };

    beforeEach(() => {
      client = new ExploreClient({
        discoveryApi,
        fetchApi,
        exploreToolsConfig: mockExploreToolsConfig,
      });
    });

    it('should return data from the deprecated api', async () => {
      mockExploreToolsConfig.getTools.mockResolvedValue([
        {
          title: 'Some Tool',
          image: 'https://example.com/image.png',
          url: 'https://example.com',
        },
      ]);

      await client.getTools();
      expect(mockExploreToolsConfig.getTools).toHaveBeenCalled();
    });
  });
});
