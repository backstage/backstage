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

import { getRequestHeaders, RollbarApi } from './RollbarApi';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { getVoidLogger } from '@backstage/backend-common';
import { RollbarProject } from './types';

describe('RollbarApi', () => {
  describe('getRequestHeaders', () => {
    it('should generate headers based on token passed in constructor', () => {
      expect(getRequestHeaders('testtoken')).toEqual({
        headers: {
          'X-Rollbar-Access-Token': `testtoken`,
        },
      });
    });
  });

  describe('getAllProjects', () => {
    const server = setupServer();
    setupRequestMockHandlers(server);

    const mockBaseUrl = 'https://api.rollbar.com/api/1';

    const mockProjects: RollbarProject[] = [
      { id: 123, name: 'abc', accountId: 1, status: 'enabled' },
      { id: 456, name: 'xyz', accountId: 1, status: 'enabled' },
    ];

    const setupHandlers = () => {
      server.use(
        rest.get(`${mockBaseUrl}/projects`, (_, res, ctx) => {
          return res(ctx.json({ result: mockProjects }));
        }),
      );
    };

    it('should return all projects with a name attribute', async () => {
      setupHandlers();
      const api = new RollbarApi('my-access-token', getVoidLogger());
      const projects = await api.getAllProjects();
      expect(projects).toEqual(mockProjects);
    });
  });
});
