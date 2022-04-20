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

import { getVoidLogger } from '@backstage/backend-common';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { GitLabClient } from './client';

const instanceUsers = [
  // only primary email
  {
    id: 1,
    name: 'User One',
    username: 'user.one',
    state: 'active',
    avatar_url: 'https://example.com/avatar/1',
    web_url: 'https://example.com/user.one',
    created_at: '2021-12-01T10:00:00.000Z',
    bot: false,
    public_email: null,
    job_title: '',
    email: 'user.one@example.com',
  },
  // only public email
  {
    id: 2,
    name: 'User Two',
    username: 'user.two',
    state: 'active',
    avatar_url: 'https://example.com/avatar/2',
    web_url: 'https://example.com/user.two',
    created_at: '2021-12-01T10:00:00.000Z',
    bot: false,
    public_email: 'user.two.public@example.com',
    job_title: '',
  },
  // both public and primary email
  {
    id: 3,
    name: 'User Three',
    username: 'user.three',
    state: 'active',
    avatar_url: 'https://example.com/avatar/3',
    web_url: 'https://example.com/user.three',
    created_at: '2021-12-01T10:00:00.000Z',
    bot: false,
    public_email: 'user.three.public@example.com',
    email: 'user.three.primary@example.com',
    job_title: '',
  },
  // bot user
  {
    id: 4,
    name: 'Project Bot User',
    username: 'project_4_bot',
    state: 'active',
    avatar_url: 'https://example.com/avatar/4',
    web_url: 'https://example.com/project_4_bot',
    created_at: '2021-12-01T10:00:00.000Z',
    bot: true,
    public_email: 'project4_bot@example.com',
    job_title: '',
  },
];

describe('GitLabClient', () => {
  const config = new ConfigReader({
    integrations: {
      gitlab: [
        {
          host: 'example.com',
          token: 'test-token',
          apiBaseUrl: 'https://example.com/api/v4',
        },
      ],
    },
  });
  const integrations = ScmIntegrations.fromConfig(config);
  const logger = getVoidLogger();
  const client = new GitLabClient({ integrations, logger });

  const server = setupServer();
  setupRequestMockHandlers(server);

  describe('listProjects', () => {
    it('should get projects for a given group', async () => {
      server.use(
        rest.get(
          'https://example.com/api/v4/groups/test-group/projects',
          (_, res, ctx) => {
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
          },
        ),
      );

      await expect(
        toArray(client.listProjects('https://example.com/test-group')),
      ).resolves.toHaveLength(1);
    });

    it('should get all projects for an instance', async () => {
      server.use(
        rest.get('https://example.com/api/v4/projects', (_, res, ctx) => {
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

      await expect(
        toArray(client.listProjects('https://example.com')),
      ).resolves.toHaveLength(2);
    });
  });

  describe('readUsers', () => {
    it('should get instance users', async () => {
      server.use(
        rest.get('https://example.com/api/v4/users', (_, res, ctx) => {
          return res(ctx.set('x-next-page', ''), ctx.json(instanceUsers));
        }),
      );
      await expect(
        toArray(client.listUsers('https://example.com', {})),
      ).resolves.toHaveLength(3);
      await expect(
        toArray(client.listUsers('https://example.com', { blocked: true })),
      ).resolves.toHaveLength(4);
      await expect(
        toArray(client.listUsers('https://example.com', { inherited: true })),
      ).resolves.toHaveLength(4);
    });

    it('should get group users', async () => {
      server.use(
        rest.get(
          'https://example.com/api/v4/groups/testgroup%2Fsubgroup/users',
          (_, res, ctx) => {
            return res(ctx.set('x-next-page', ''), ctx.json(instanceUsers));
          },
        ),
      );
      await expect(
        client.listUsers('https://example.com/testgroup/subgroup', {}),
      ).resolves.toHaveLength(2);
    });

    it('should get group users, with inherited', async () => {
      server.use(
        rest.get(
          'https://example.com/api/v4/groups/testgroup%2Fsubgroup/users/all',
          (_, res, ctx) => {
            return res(ctx.set('x-next-page', ''), ctx.json(instanceUsers));
          },
        ),
      );
      await expect(
        client.listUsers('https://example.com/testgroup/subgroup', {
          inherited: true,
        }),
      ).resolves.toHaveLength(2);
    });
  });

  describe('pagedRequest', () => {
    beforeEach(() => {
      // fake paginated endpoint with 4 pages each returning one item
      server.use(
        rest.get('https://example.com/api/v4/fake-paged', (req, res, ctx) => {
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
      server.use(
        rest.get('https://example.com/api/v4/fake-unhealthy', (_, res, ctx) => {
          return res(ctx.status(400), ctx.json({ error: 'some error' }));
        }),
      );
    });

    it('should go through the whole paging cycle', async () => {
      await expect(
        toArray(
          (client as any).pagedRequest(
            '/fake-paged',
            integrations.gitlab.byHost('example.com')!,
          ),
        ),
      ).resolves.toHaveLength(4);
    });

    it('should throw if response is not okay', async () => {
      await expect(
        toArray(
          (client as any).pagedRequest(
            '/fake-unhealthy',
            integrations.gitlab.byHost('example.com')!,
          ),
        ),
      ).rejects.toThrowError();
    });
  });

  describe('request', () => {
    beforeEach(() => {
      server.use(
        rest.post('https://example.com/api/v4/echo', (req, res, ctx) => {
          return res(
            // set status to 401 Not Authorized if token does not match
            ctx.status(
              req.headers.get('private-token') === 'test-token' ? 200 : 401,
            ),
            ctx.json(req.body),
          );
        }),
      );
      server.use(
        rest.get(
          'https://example.com/api/v4/unprotected-endpoint',
          (_, res, ctx) => {
            return res(ctx.json({ data: 'test-data' }));
          },
        ),
      );
      // returns 401 if token does not match
      server.use(
        rest.get(
          'https://example.com/api/v4/protected-endpoint',
          (req, res, ctx) => {
            return res(
              ctx.status(
                req.headers.get('private-token') === 'test-token' ? 200 : 401,
              ),
              ctx.json({ data: 'protected' }),
            );
          },
        ),
      );
      // always returns HTTP status 500
      server.use(
        rest.get('https://example.com/api/v4/error', (_, res, ctx) => {
          return res(ctx.status(500), ctx.json({}));
        }),
      );
    });

    it('should return the response json', async () => {
      await expect(
        (client as any)
          .request(
            'https://example.com/api/v4/unprotected-endpoint',
            integrations.gitlab.byHost('example.com')!,
          )
          .then((response: any) => response.json()),
      ).resolves.toEqual({ data: 'test-data' });
    });

    it('should set request options using gitlab config', async () => {
      await expect(
        (client as any)
          .request(
            'https://example.com/api/v4/protected-endpoint',
            integrations.gitlab.byHost('example.com')!,
          )
          .then((response: any) => response.json()),
      ).resolves.toEqual({ data: 'protected' });
    });

    it('should override existing request options if provided', async () => {
      await expect(
        (client as any)
          .request(
            'https://example.com/api/v4/protected-endpoint',
            integrations.gitlab.byHost('example.com')!,
            { headers: { 'private-token': 'another-value' } },
          )
          .then((response: any) => response.json()),
      ).rejects.toThrow();
    });

    it('should extend request options with existing', async () => {
      // endpoint which echos body and sets status 200 if authenticated
      const testBody = { something: 'echo' };
      const response = await (client as any).request(
        'https://example.com/api/v4/echo',
        integrations.gitlab.byHost('example.com')!,
        {
          method: 'POST',
          body: JSON.stringify(testBody),
          headers: { 'content-type': 'application/json' },
        },
      );
      // body passed in via init should be echoed as auth token in the existing
      // client options should be preserved
      await expect(response.json()).resolves.toEqual(testBody);
    });

    it('should throw if response is not ok', async () => {
      await expect(
        (client as any).request(
          'https://example.com/api/v4/error',
          integrations.gitlab.byHost('example.com')!,
        ),
      ).rejects.toThrowError();
    });
  });
});

async function toArray<T = unknown>(iter: AsyncGenerator<T>): Promise<T[]> {
  const arr = new Array<T>();
  for await (const item of iter) {
    arr.push(item);
  }
  return arr;
}
