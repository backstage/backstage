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

import { BitbucketCloudIntegrationConfig } from '@backstage/integration';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { BitbucketCloudClient } from './BitbucketCloudClient';
import { Models } from './models';

const server = setupServer();

describe('BitbucketCloudClient', () => {
  const config: BitbucketCloudIntegrationConfig = {
    host: 'bitbucket.org',
    apiBaseUrl: 'https://api.bitbucket.org/2.0',
    username: 'test-user',
    appPassword: 'test-pw',
  };
  const client = BitbucketCloudClient.fromConfig(config);

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  it('searchCode', async () => {
    server.use(
      rest.get(
        `https://api.bitbucket.org/2.0/workspaces/ws/search/code`,
        (req, res, ctx) => {
          if (
            req.headers.get('authorization') !==
            'Basic dGVzdC11c2VyOnRlc3QtcHc='
          ) {
            return res(ctx.status(400));
          }

          const query = req.url.searchParams.get('search_query');
          if (query !== 'query') {
            return res(ctx.json({ values: [] } as Models.SearchResultPage));
          }

          const response: Models.SearchResultPage = {
            values: [
              {
                content_match_count: 1,
                file: {
                  type: 'commit_file',
                  path: 'path/to/file',
                },
              },
            ],
          };
          return res(ctx.json(response));
        },
      ),
    );

    const pagination = client.searchCode('ws', 'query');

    const results = [];
    for await (const result of pagination.iterateResults()) {
      results.push(result);
    }

    expect(results).toHaveLength(1);
    expect(results[0].file!.path).toEqual('path/to/file');
  });

  it('listRepositoriesByWorkspace', async () => {
    server.use(
      rest.get(
        'https://api.bitbucket.org/2.0/repositories/ws',
        (_, res, ctx) => {
          const response = {
            values: [
              {
                type: 'repository',
                slug: 'repo1',
              } as Models.Repository,
            ],
          };
          return res(ctx.json(response));
        },
      ),
    );

    const pagination = client.listRepositoriesByWorkspace('ws');

    const results = [];
    for await (const result of pagination.iterateResults()) {
      results.push(result);
    }

    expect(results).toHaveLength(1);
    expect(results[0].slug).toEqual('repo1');
  });
});
