/*
 * Copyright 2021 The Backstage Authors
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

import { ConfigReader } from '@backstage/config';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { readGitLabIntegrationConfig } from '@backstage/integration';
import { getVoidLogger } from '@backstage/backend-common';
import { rest } from 'msw';
import { setupServer, SetupServerApi } from 'msw/node';

import { GitLabClient, paginated } from './client';

const server = setupServer();
setupRequestMockHandlers(server);

const MOCK_CONFIG = readGitLabIntegrationConfig(
  new ConfigReader({
    host: 'example.com',
    token: 'test-token',
    apiBaseUrl: 'https://example.com/api/v4',
  }),
);
const FAKE_PAGED_ENDPOINT = `/some-endpoint`;
const FAKE_PAGED_URL = `${MOCK_CONFIG.apiBaseUrl}${FAKE_PAGED_ENDPOINT}`;

function setupFakeFourPageURL(srv: SetupServerApi, url: string) {
  srv.use(
    rest.get(url, (req, res, ctx) => {
      const page = req.url.searchParams.get('page');
      const currentPage = page ? Number(page) : 1;
      const fakePageCount = 4;

      return res(
        // set next page number header if page requested is less than count
        ctx.set(
          'x-next-page',
          currentPage < fakePageCount ? String(currentPage + 1) : '',
        ),
        ctx.json([{ someContentOfPage: currentPage }]),
      );
    }),
  );
}

function setupFakeGroupProjectsEndpoint(
  srv: SetupServerApi,
  apiBaseUrl: string,
  groupID: string,
) {
  srv.use(
    rest.get(`${apiBaseUrl}/groups/${groupID}/projects`, (_, res, ctx) => {
      return res(
        ctx.set('x-next-page', ''),
        ctx.json([
          {
            id: 1,
            description: 'Project One Description',
            name: 'Project One',
            path: 'project-one',
          },
        ]),
      );
    }),
  );
}

function setupFakeInstanceProjectsEndpoint(
  srv: SetupServerApi,
  apiBaseUrl: string,
) {
  srv.use(
    rest.get(`${apiBaseUrl}/projects`, (_, res, ctx) => {
      return res(
        ctx.set('x-next-page', ''),
        ctx.json([
          {
            id: 1,
            description: 'Project One Description',
            name: 'Project One',
            path: 'project-one',
          },
          {
            id: 2,
            description: 'Project Two Description',
            name: 'Project Two',
            path: 'project-two',
          },
        ]),
      );
    }),
  );
}

describe('GitLabClient', () => {
  describe('isSelfManaged', () => {
    it('returns true if self managed instance', () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader({
            host: 'example.com',
            token: 'test-token',
            apiBaseUrl: 'https://example.com/api/v4',
          }),
        ),
        logger: getVoidLogger(),
      });
      expect(client.isSelfManaged()).toBeTruthy();
    });
    it('returns false if gitlab.com', () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader({
            host: 'gitlab.com',
            token: 'test-token',
          }),
        ),
        logger: getVoidLogger(),
      });
      expect(client.isSelfManaged()).toBeFalsy();
    });
  });

  describe('baseUrl', () => {
    it('should be a property from the underlying integration config', () => {
      const client = new GitLabClient({
        config: readGitLabIntegrationConfig(
          new ConfigReader({
            host: 'example.com',
            token: 'test-token',
            apiBaseUrl: 'https://example.com/subdirectory/api/v4',
            baseUrl: 'https://example.com/subdirectory',
          }),
        ),
        logger: getVoidLogger(),
      });
      expect(client.baseUrl).toEqual('https://example.com/subdirectory');
    });
  });

  describe('pagedRequest', () => {
    const client = new GitLabClient({
      config: MOCK_CONFIG,
      logger: getVoidLogger(),
    });

    beforeEach(() => {
      // setup fake paginated endpoint with 4 pages each returning one item
      setupFakeFourPageURL(server, FAKE_PAGED_URL);
    });

    it('should provide immediate items within the page', async () => {
      const { items } = await client.pagedRequest(FAKE_PAGED_ENDPOINT);
      // fake page contains exactly one item
      expect(items).toHaveLength(1);
    });

    it('should request items for a given page number', async () => {
      const requestedPage = 2;
      const { items, nextPage } = await client.pagedRequest(
        FAKE_PAGED_ENDPOINT,
        {
          page: requestedPage,
        },
      );
      // should contain an item from a given page
      expect(items[0].someContentOfPage).toEqual(requestedPage);
      // should set the nextPage property to the next page
      expect(nextPage).toEqual(3);
    });

    it('should not have a next page if at the end', async () => {
      const { items, nextPage } = await client.pagedRequest(
        FAKE_PAGED_ENDPOINT,
        {
          page: 4,
        },
      );
      // should contain item of last page
      expect(items).toHaveLength(1);
      expect(nextPage).toBeNull();
    });

    it('should throw if response is not okay', async () => {
      const endpoint = '/unhealthy-endpoint';
      const url = `${MOCK_CONFIG.apiBaseUrl}${endpoint}`;
      server.use(
        rest.get(url, (_, res, ctx) => {
          return res(ctx.status(400), ctx.json({ error: 'some error' }));
        }),
      );

      // non-200 status code should throw
      await expect(() => client.pagedRequest(endpoint)).rejects.toThrowError();
    });
  });

  describe('listProjects', () => {
    const client = new GitLabClient({
      config: MOCK_CONFIG,
      logger: getVoidLogger(),
    });

    it('should get projects for a given group', async () => {
      setupFakeGroupProjectsEndpoint(
        server,
        MOCK_CONFIG.apiBaseUrl,
        'test-group',
      );

      const groupProjectsGen = paginated(
        options => client.listProjects(options),
        { group: 'test-group' },
      );
      const allItems = [];
      for await (const item of groupProjectsGen) {
        allItems.push(item);
      }

      expect(allItems).toHaveLength(1);
    });

    it('should get all projects for an instance', async () => {
      setupFakeInstanceProjectsEndpoint(server, MOCK_CONFIG.apiBaseUrl);

      const instanceProjects = paginated(
        options => client.listProjects(options),
        {},
      );
      const allProjects = [];
      for await (const project of instanceProjects) {
        allProjects.push(project);
      }

      expect(allProjects).toHaveLength(2);
    });
  });

  describe('request', () => {
    const client = new GitLabClient({
      config: MOCK_CONFIG,
      logger: getVoidLogger(),
    });

    beforeEach(() => {
      // endpoint which returns 401 if token does not match
      server.use(
        rest.get(
          `${MOCK_CONFIG.apiBaseUrl}/protected-endpoint`,
          (req, res, ctx) => {
            return res(
              ctx.status(
                req.headers.get('private-token') === MOCK_CONFIG.token
                  ? 200
                  : 401,
              ),
              ctx.json({ data: 'protected' }),
            );
          },
        ),
      );
    });

    it('should return the response json', async () => {
      // endpoint which returns a json object
      server.use(
        rest.get(`${MOCK_CONFIG.apiBaseUrl}/some-endpoint`, (_, res, ctx) => {
          return res(ctx.json({ data: 'test-data' }));
        }),
      );

      const response = await client.request('/some-endpoint', {});
      await expect(response.json()).resolves.toEqual({ data: 'test-data' });
    });

    it('should set request options using gitlab config', async () => {
      const response = await client.request('/protected-endpoint', {});
      await expect(response.json()).resolves.toEqual({ data: 'protected' });
    });

    it('should override existing request options if provided', async () => {
      await expect(
        client.request('/protected-endpoint', {
          headers: { 'private-token': 'another-value' },
        }),
      ).rejects.toThrow();
    });

    it('should extend request options with existing', async () => {
      // endpoint which echos body and sets status 200 if authenticated
      server.use(
        rest.post(`${MOCK_CONFIG.apiBaseUrl}/echo`, (req, res, ctx) => {
          return res(
            // set status to 401 Not Authorized if token does not match
            ctx.status(
              req.headers.get('private-token') === MOCK_CONFIG.token
                ? 200
                : 401,
            ),
            ctx.json(req.body),
          );
        }),
      );

      const testBody = { something: 'echo' };
      const response = await client.request('/echo', {
        method: 'POST',
        body: JSON.stringify(testBody),
        headers: { 'content-type': 'application/json' },
      });
      // body passed in via init should be echoed as auth token in the existing
      // client options should be preserved
      await expect(response.json()).resolves.toEqual(testBody);
    });

    it('should throw if response is not ok', async () => {
      // endpoint which always returns HTTP status 500
      server.use(
        rest.get(`${MOCK_CONFIG.apiBaseUrl}/error`, (_, res, ctx) => {
          return res(ctx.status(500), ctx.json({}));
        }),
      );

      await expect(client.request('/error', {})).rejects.toThrowError();
    });
  });
});

describe('paginated', () => {
  it('should iterate through the pages until exhausted', async () => {
    setupFakeFourPageURL(server, FAKE_PAGED_URL);
    const client = new GitLabClient({
      config: MOCK_CONFIG,
      logger: getVoidLogger(),
    });

    const paginatedItems = paginated(
      options => client.pagedRequest(FAKE_PAGED_ENDPOINT, options),
      {},
    );
    const allItems = [];
    for await (const item of paginatedItems) {
      allItems.push(item);
    }

    expect(allItems).toHaveLength(4);
  });
});
