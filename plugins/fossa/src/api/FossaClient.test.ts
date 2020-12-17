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

import { UrlPatternDiscovery } from '@backstage/core';
import { msw } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { FindingSummary, FossaApi, FossaClient } from './index';

const server = setupServer();

describe('FossaClient', () => {
  msw.setupDefaultHandlers(server);

  const mockBaseUrl = 'http://backstage:9191/api/proxy';
  const discoveryApi = UrlPatternDiscovery.compile(mockBaseUrl);
  let client: FossaApi;

  beforeEach(() => {
    client = new FossaClient({ discoveryApi, organizationId: '8736' });
  });

  it('should report finding summary', async () => {
    server.use(
      rest.get(`${mockBaseUrl}/fossa/projects`, (req, res, ctx) => {
        expect(req.url.searchParams.toString()).toBe(
          'count=1&title=our-service&organizationId=8736',
        );
        return res(
          ctx.json([
            {
              locator: 'custom+8736/our-service',
              default_branch: 'develop',
              revisions: [
                {
                  updatedAt: '2020-01-01T00:00:00Z',
                  dependency_count: 160,
                  unresolved_licensing_issue_count: 5,
                  unresolved_issue_count: 100,
                },
              ],
            },
          ]),
        );
      }),
    );

    const summary = await client.getFindingSummary('our-service');

    expect(summary).toEqual({
      timestamp: '2020-01-01T00:00:00Z',
      issueCount: 5,
      dependencyCount: 160,
      projectDefaultBranch: 'develop',
      projectUrl: 'https://app.fossa.com/projects/custom%2B8736%2Four-service',
    } as FindingSummary);
  });

  it('should report finding summary without licensing_issue_count', async () => {
    server.use(
      rest.get(`${mockBaseUrl}/fossa/projects`, (req, res, ctx) => {
        expect(req.url.searchParams.toString()).toBe(
          'count=1&title=our-service&organizationId=8736',
        );
        return res(
          ctx.json([
            {
              locator: 'custom+8736/our-service',
              default_branch: 'refs/master',
              revisions: [
                {
                  updatedAt: '2020-01-01T00:00:00Z',
                  dependency_count: 160,
                  unresolved_issue_count: 100,
                },
              ],
            },
          ]),
        );
      }),
    );

    const summary = await client.getFindingSummary('our-service');

    expect(summary).toEqual({
      timestamp: '2020-01-01T00:00:00Z',
      issueCount: 100,
      dependencyCount: 160,
      projectDefaultBranch: 'refs/master',
      projectUrl: 'https://app.fossa.com/projects/custom%2B8736%2Four-service',
    } as FindingSummary);
  });

  it('should skip organizationId', async () => {
    client = new FossaClient({ discoveryApi });

    server.use(
      rest.get(`${mockBaseUrl}/fossa/projects`, (req, res, ctx) => {
        expect(req.url.searchParams.toString()).toBe(
          'count=1&title=our-service',
        );
        return res(ctx.status(404));
      }),
    );

    const summary = await client.getFindingSummary('our-service');

    expect(summary).toBeUndefined();
  });

  it('should handle 404 status', async () => {
    server.use(
      rest.get(`${mockBaseUrl}/fossa/projects`, (req, res, ctx) => {
        expect(req.url.searchParams.toString()).toBe(
          'count=1&title=our-service&organizationId=8736',
        );
        return res(ctx.status(404));
      }),
    );

    const summary = await client.getFindingSummary('our-service');

    expect(summary).toBeUndefined();
  });
});
