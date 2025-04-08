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

import { registerMswTestHooks } from '@backstage/backend-test-utils';
import { BitbucketServerIntegrationConfig } from '@backstage/integration';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  BitbucketServerClient,
  BitbucketServerPagedResponse,
  paginated,
} from './BitbucketServerClient';
import { BitbucketServerProject, BitbucketServerRepository } from './types';

const server = setupServer();

const catalogInfoFile = `
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: "backstage"
  description: "A Backstage service"
spec:
  type: service
  lifecycle: experimental
  owner: "backstage"
`;

describe('BitbucketServerClient', () => {
  const config: BitbucketServerIntegrationConfig = {
    host: 'bitbucket.mycompany.com',
    apiBaseUrl: 'https://bitbucket.mycompany.com/api/rest/1.0',
    username: 'test-user',
    password: 'test-pw',
  };
  const client = BitbucketServerClient.fromConfig({
    config: config,
  });

  registerMswTestHooks(server);

  it('listProjects', async () => {
    server.use(
      rest.get(`${config.apiBaseUrl}/projects`, (req, res, ctx) => {
        if (
          req.headers.get('authorization') !== 'Basic dGVzdC11c2VyOnRlc3QtcHc='
        ) {
          return res(ctx.status(400));
        }
        const response: BitbucketServerPagedResponse<BitbucketServerProject> = {
          size: 1,
          limit: 25,
          isLastPage: true,
          start: 0,
          nextPageStart: 0,
          values: [
            {
              key: 'test-project',
            },
          ],
        };
        return res(ctx.json(response));
      }),
    );

    const projects = paginated(options =>
      client.listProjects({ listOptions: options }),
    );

    const results = [];
    for await (const project of projects) {
      results.push(project);
    }

    expect(results).toHaveLength(1);
    expect(results[0].key).toEqual('test-project');
  });

  it('listRepositories', async () => {
    server.use(
      rest.get(
        `${config.apiBaseUrl}/projects/test-project/repos`,
        (req, res, ctx) => {
          if (
            req.headers.get('authorization') !==
            'Basic dGVzdC11c2VyOnRlc3QtcHc='
          ) {
            return res(ctx.status(400));
          }
          const response: BitbucketServerPagedResponse<BitbucketServerRepository> =
            {
              size: 1,
              limit: 25,
              isLastPage: true,
              start: 0,
              nextPageStart: 0,
              values: [
                {
                  project: {
                    key: 'test-project',
                  },
                  slug: 'test-repository',
                  description: 'A test repository.',
                  links: {
                    self: [
                      {
                        href: 'https://bitbucket.mycompany.com/projects/test-project',
                      },
                    ],
                  },
                  archived: false,
                },
              ],
            };
          return res(ctx.json(response));
        },
      ),
    );

    const repos = paginated(options =>
      client.listRepositories({
        projectKey: 'test-project',
        listOptions: options,
      }),
    );

    const results = [];
    for await (const repo of repos) {
      results.push(repo);
    }

    expect(results).toHaveLength(1);
    expect(results[0].project.key).toEqual('test-project');
    expect(results[0].slug).toEqual('test-repository');
    expect(results[0].links.self[0].href).toEqual(
      'https://bitbucket.mycompany.com/projects/test-project',
    );
  });

  it('getFile', async () => {
    server.use(
      rest.get(
        `${config.apiBaseUrl}/projects/test-project/repos/test-repo/raw/catalog-info.yaml`,
        (req, res, ctx) => {
          if (
            req.headers.get('authorization') !==
            'Basic dGVzdC11c2VyOnRlc3QtcHc='
          ) {
            return res(ctx.status(400));
          }

          return res(ctx.text(catalogInfoFile));
        },
      ),
    );

    const response = await client.getFile({
      projectKey: 'test-project',
      repo: 'test-repo',
      path: 'catalog-info.yaml',
    });
    expect(await response.text()).toEqual(catalogInfoFile);
  });

  it('getRepository', async () => {
    server.use(
      rest.get(
        `${config.apiBaseUrl}/projects/test-project/repos/test-repo`,
        (req, res, ctx) => {
          if (
            req.headers.get('authorization') !==
            'Basic dGVzdC11c2VyOnRlc3QtcHc='
          ) {
            return res(ctx.status(400));
          }
          const response: BitbucketServerRepository = {
            project: {
              key: 'test-project',
            },
            slug: 'test-repo',
            description: 'A test repository.',
            links: {
              self: [
                {
                  href: 'https://bitbucket.mycompany.com/projects/test-project',
                },
              ],
            },
            archived: false,
          };

          return res(ctx.json(response));
        },
      ),
    );

    const repo = await client.getRepository({
      projectKey: 'test-project',
      repo: 'test-repo',
    });
    expect(repo.project.key).toEqual('test-project');
    expect(repo.slug).toEqual('test-repo');
    expect(repo.links.self[0].href).toEqual(
      'https://bitbucket.mycompany.com/projects/test-project',
    );
  });
});
