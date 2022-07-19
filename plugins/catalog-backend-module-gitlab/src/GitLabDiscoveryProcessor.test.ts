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
import { ConfigReader } from '@backstage/config';
import { LocationSpec } from '@backstage/plugin-catalog-backend';
import { rest, RestRequest } from 'msw';
import { setupServer } from 'msw/node';
import { GitLabDiscoveryProcessor, parseUrl } from './GitLabDiscoveryProcessor';
import { GitLabProject } from './lib';

const server = setupServer();

const DOMAIN = 'gitlab.fake';
const SERVER_URL = `https://${DOMAIN}`;
const API_URL = `${SERVER_URL}/api/v4`;
const PROJECTS_URL = `${API_URL}/projects`;
const GROUP_PROJECTS_URL = `${API_URL}/groups/group%2Fsubgroup/projects`;
const EXISTING_PROJECT_PATH = 'exist';

const PROJECT_LOCATION: LocationSpec = {
  type: 'gitlab-discovery',
  target: `${SERVER_URL}/blob/*/catalog-info.yaml`,
};
const PROJECT_LOCATION_MASTER_BRANCH: LocationSpec = {
  type: 'gitlab-discovery',
  target: `${SERVER_URL}/blob/master/catalog-info.yaml`,
};
const GROUP_LOCATION: LocationSpec = {
  type: 'gitlab-discovery',
  target: `${SERVER_URL}/group/subgroup/blob/*/catalog-info.yaml`,
};

const GROUP_LOCATION_CUSTOM_BRANCH: LocationSpec = {
  type: 'gitlab-discovery',
  target: `${SERVER_URL}/group/subgroup/blob/test/catalog-info.yaml`,
};
const SERVER_TIME = '2001-01-01T12:34:56.000Z';

function setupFakeServer(
  url: string,
  listProjectsCallback: (request: {
    page: number;
    include_subgroups: boolean;
  }) => {
    data: GitLabProject[];
    nextPage?: number;
  },
  assertion?: (r: RestRequest) => any,
) {
  server.use(
    rest.get(url, (req, res, ctx) => {
      // Send the request to the assertion to give the test an opportunity to inspect the parameters.
      if (assertion !== undefined) {
        assertion(req);
      }

      if (req.headers.get('private-token') !== 'test-token') {
        return res(ctx.status(401), ctx.json({}));
      }
      const page = req.url.searchParams.get('page');
      const include_subgroups = req.url.searchParams.get('include_subgroups');
      const response = listProjectsCallback({
        page: parseInt(page!, 10),
        include_subgroups: include_subgroups === 'true',
      });

      // Filter the fake results based on the `last_activity_after` parameter
      const last_activity_after = req.url.searchParams.get(
        'last_activity_after',
      );
      const filteredData = response.data.filter(
        v =>
          !last_activity_after ||
          Date.parse(v.last_activity_at) >= Date.parse(last_activity_after),
      );

      return res(
        ctx.set('x-next-page', response.nextPage?.toString() ?? ''),
        ctx.json(filteredData),
      );
    }),
    rest.head(
      `${API_URL}/projects/:project_path/repository/files/:file_path`,
      (req, res, ctx) => {
        if (req.headers.get('private-token') !== 'test-token') {
          return res(ctx.status(401), ctx.json({}));
        }
        const ref = req.url.searchParams.get('ref');

        if (ref === 'main' || ref === 'master') {
          return res(ctx.status(200));
        }

        if (EXISTING_PROJECT_PATH === req.params.project_path) {
          return res(ctx.status(200));
        }

        return res(ctx.status(404));
      },
    ),
  );
}

function getConfig(): any {
  return {
    backend: {
      cache: { store: 'memory' },
    },
    integrations: {
      gitlab: [
        {
          host: DOMAIN,
          apiBaseUrl: API_URL,
          token: 'test-token',
        },
      ],
    },
  };
}

function getProcessor({
  config,
  options,
}: {
  config?: any;
  options?: Partial<Parameters<typeof GitLabDiscoveryProcessor.fromConfig>[1]>;
} = {}): GitLabDiscoveryProcessor {
  return GitLabDiscoveryProcessor.fromConfig(
    new ConfigReader(config || getConfig()),
    {
      logger: getVoidLogger(),
      ...options,
    },
  );
}

describe('GitlabDiscoveryProcessor', () => {
  beforeAll(() => {
    server.listen();
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(SERVER_TIME));
  });
  afterEach(() => server.resetHandlers());
  afterAll(() => {
    server.close();
    jest.useRealTimers();
  });

  describe('parseUrl', () => {
    it('parses well formed URLs', () => {
      expect(
        parseUrl('https://gitlab.com/group/subgroup/blob/master/catalog.yaml'),
      ).toEqual({
        group: 'group/subgroup',
        host: 'gitlab.com',
        branch: 'master',
        catalogPath: 'catalog.yaml',
      });
      expect(
        parseUrl('https://gitlab.com/blob/*/subfolder/catalog.yaml'),
      ).toEqual({
        group: undefined,
        host: 'gitlab.com',
        branch: '*',
        catalogPath: 'subfolder/catalog.yaml',
      });
    });

    it('throws on incorrectly formed URLs', () => {
      expect(() => parseUrl('https://gitlab.com')).toThrow();
      expect(() => parseUrl('https://gitlab.com//')).toThrow();
      expect(() => parseUrl('https://gitlab.com/foo')).toThrow();
      expect(() => parseUrl('https://gitlab.com//foo')).toThrow();
      expect(() => parseUrl('https://gitlab.com/org/teams')).toThrow();
      expect(() => parseUrl('https://gitlab.com/org//teams')).toThrow();
      expect(() =>
        parseUrl('https://gitlab.com/org//teams/blob/catalog.yaml'),
      ).toThrow();
    });
  });

  describe('handles repositories', () => {
    it('pages through all repositories', async () => {
      const processor = getProcessor();
      setupFakeServer(PROJECTS_URL, request => {
        switch (request.page) {
          case 1:
            return {
              data: [
                {
                  id: 1,
                  archived: false,
                  default_branch: 'main',
                  last_activity_at: '2021-08-05T11:03:05.774Z',
                  web_url: 'https://gitlab.fake/1',
                  path_with_namespace: '1',
                },
                {
                  id: 2,
                  archived: false,
                  default_branch: 'main',
                  last_activity_at: '2021-08-05T11:03:05.774Z',
                  web_url: 'https://gitlab.fake/g/2',
                  path_with_namespace: 'g/2',
                },
              ],
              nextPage: 2,
            };
          case 2:
            return {
              data: [
                {
                  id: 3,
                  archived: false,
                  default_branch: 'master',
                  last_activity_at: '2021-08-05T11:03:05.774Z',
                  web_url: 'https://gitlab.fake/3',
                  path_with_namespace: '3',
                },
                {
                  id: 4,
                  archived: true, // ARCHIVED
                  default_branch: 'master',
                  last_activity_at: '2021-08-05T11:03:05.774Z',
                  web_url: 'https://gitlab.fake/4',
                  path_with_namespace: '4',
                },
                {
                  id: 5,
                  archived: false,
                  default_branch: undefined, // MISSING DEFAULT BRANCH
                  last_activity_at: '2021-08-05T11:03:05.774Z',
                  web_url: 'https://gitlab.fake/g/5',
                  path_with_namespace: 'g/5',
                },
              ],
            };
          default:
            throw new Error('Invalid request');
        }
      });

      const result: any[] = [];
      await processor.readLocation(PROJECT_LOCATION, false, e => {
        result.push(e);
      });
      expect(result).toEqual([
        {
          type: 'location',
          location: {
            type: 'url',
            target: 'https://gitlab.fake/1/-/blob/main/catalog-info.yaml',
            presence: 'optional',
          },
        },
        {
          type: 'location',
          location: {
            type: 'url',
            target: 'https://gitlab.fake/g/2/-/blob/main/catalog-info.yaml',
            presence: 'optional',
          },
        },
        {
          type: 'location',
          location: {
            type: 'url',
            target: 'https://gitlab.fake/3/-/blob/master/catalog-info.yaml',
            presence: 'optional',
          },
        },
      ]);
    });

    it('can force a branch name', async () => {
      const processor = getProcessor();
      setupFakeServer(PROJECTS_URL, request => {
        switch (request.page) {
          case 1:
            return {
              data: [
                {
                  id: 1,
                  archived: false,
                  default_branch: 'main',
                  last_activity_at: '2021-08-05T11:03:05.774Z',
                  web_url: 'https://gitlab.fake/1',
                  path_with_namespace: '1',
                },
              ],
            };
          default:
            throw new Error('Invalid request');
        }
      });

      const result: any[] = [];
      await processor.readLocation(PROJECT_LOCATION_MASTER_BRANCH, false, e => {
        result.push(e);
      });
      expect(result).toEqual([
        {
          type: 'location',
          location: {
            type: 'url',
            target: 'https://gitlab.fake/1/-/blob/master/catalog-info.yaml',
            presence: 'optional',
          },
        },
      ]);
    });

    it('can filter based on group', async () => {
      const processor = getProcessor();
      setupFakeServer(GROUP_PROJECTS_URL, request => {
        if (!request.include_subgroups) {
          throw new Error('include_subgroups should be set');
        }
        switch (request.page) {
          case 1:
            return {
              data: [
                {
                  id: 1,
                  archived: false,
                  default_branch: 'main',
                  last_activity_at: '2021-08-05T11:03:05.774Z',
                  web_url: 'https://gitlab.fake/1',
                  path_with_namespace: '1',
                },
              ],
            };
          default:
            throw new Error('Invalid request');
        }
      });

      const result: any[] = [];
      await processor.readLocation(GROUP_LOCATION, false, e => {
        result.push(e);
      });
      // If everything was set up correctly, we should have received the fake repo specified above
      expect(result).toHaveLength(1);
    });

    it('can filter based on file existing', async () => {
      const processor = getProcessor({
        options: { skipReposWithoutExactFileMatch: true },
      });
      setupFakeServer(GROUP_PROJECTS_URL, request => {
        if (!request.include_subgroups) {
          throw new Error('include_subgroups should be set');
        }
        switch (request.page) {
          case 1:
            return {
              data: [
                {
                  id: 1,
                  archived: false,
                  default_branch: 'main',
                  last_activity_at: '2021-08-05T11:03:05.774Z',
                  web_url: 'https://gitlab.fake/1',
                  path_with_namespace: '1',
                },
                {
                  id: 1,
                  archived: false,
                  default_branch: 'main',
                  last_activity_at: '2021-08-05T11:03:05.774Z',
                  web_url: `https://gitlab.fake/${EXISTING_PROJECT_PATH}`,
                  path_with_namespace: EXISTING_PROJECT_PATH,
                },
              ],
            };
          default:
            throw new Error('Invalid request');
        }
      });

      const result: any[] = [];
      await processor.readLocation(GROUP_LOCATION_CUSTOM_BRANCH, false, e => {
        result.push(e);
      });
      // If everything was set up correctly, we should have received the fake repo specified above
      expect(result).toHaveLength(1);
    });

    it('uses the previous scan timestamp to filter', async () => {
      const payload = {
        data: [
          {
            id: 1,
            archived: false,
            default_branch: 'main',
            last_activity_at: '2000-01-01T00:00:00Z',
            web_url: 'https://gitlab.fake/1',
          },
          {
            id: 2,
            archived: false,
            default_branch: 'main',
            last_activity_at: '2002-01-01T00:00:00Z',
            web_url: 'https://gitlab.fake/2',
          },
        ],
      };
      const processor = getProcessor();

      setupFakeServer(
        PROJECTS_URL,
        request => {
          switch (request.page) {
            case 1:
              return payload;
            default:
              throw new Error('Invalid request');
          }
        },
        request => {
          // We assert that the last activity timestamp is not being sent to the GitLab API as we expect the cache to be empty.
          expect(
            request.url.searchParams.get('last_activity_after'),
          ).toBeNull();
        },
      );

      const result: any[] = [];

      // First scan should find all repos, since no last activity was cached
      await processor.readLocation(PROJECT_LOCATION, false, e => {
        result.push(e);
      });
      expect(result).toHaveLength(2);

      // Second scan should have used the mocked Date to set the last scanned time to 2001
      // This should result in only the second repo being scanned, since that has a timestamp of 2002
      setupFakeServer(
        PROJECTS_URL,
        _ => {
          return payload;
        },
        request => {
          // We assert that the last activity timestamp is being sent to the GitLab API since we expect it to be in the cache.
          expect(request.url.searchParams.get('last_activity_after')).toMatch(
            SERVER_TIME,
          );
        },
      );
      const result2: any[] = [];
      await processor.readLocation(PROJECT_LOCATION, false, e => {
        result2.push(e);
      });
      expect(result2).toHaveLength(1);
    });
  });

  describe('handles failure', () => {
    it('invalid token', async () => {
      // Setup an empty fake gitlab, since we don't care about actual results
      setupFakeServer(PROJECTS_URL, _ => {
        return {
          data: [],
        };
      });

      const config = getConfig();
      config.integrations.gitlab[0].token = 'invalid';
      await expect(
        getProcessor({ config }).readLocation(PROJECT_LOCATION, false, _ => {}),
      ).rejects.toThrow(/Unauthorized/);
    });

    it('missing integration', async () => {
      const config = getConfig();
      delete config.integrations;
      await expect(
        getProcessor({ config }).readLocation(PROJECT_LOCATION, false, _ => {}),
      ).rejects.toThrow(/no GitLab integration/);
    });

    it('location type', async () => {
      const incorrectLocation: LocationSpec = {
        type: 'something-that-is-not-gitlab-discovery',
        target: 'https://gitlab.fake/oh-dear',
      };

      await expect(
        getProcessor().readLocation(incorrectLocation, false, _ => {}),
      ).resolves.toBeFalsy();
    });
  });
});
