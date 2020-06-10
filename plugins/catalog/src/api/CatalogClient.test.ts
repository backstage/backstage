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
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { CatalogClient } from './CatalogClient';
import { DescriptorEnvelope } from '../types';

const server = setupServer();

describe('CatalogClient', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe('getEntities', () => {
    it('should return the json response for the correct path', async () => {
      const mockApiOrigin = 'http://backstage:9191';
      const mockBasePath = '/i-am-a-mock-base';
      const client = new CatalogClient({
        apiOrigin: mockApiOrigin,
        basePath: mockBasePath,
      });

      const mockDescriptors: DescriptorEnvelope[] = [
        {
          apiVersion: '1',
          kind: 'Component',
          metadata: {
            description: 'Im a description',
            name: 'Test1',
            namespace: 'test1',
          },
        },
        {
          apiVersion: '1',
          kind: 'Component',
          metadata: {
            description: 'Im a description',
            name: 'Test2',
            namespace: 'test1',
          },
        },
      ];
      server.use(
        rest.get(`${mockApiOrigin}${mockBasePath}/entities`, (_, res, ctx) => {
          return res(ctx.json(mockDescriptors));
        }),
      );

      const entities = await client.getEntities();

      expect(entities).toEqual(mockDescriptors);
    });
  });
});
