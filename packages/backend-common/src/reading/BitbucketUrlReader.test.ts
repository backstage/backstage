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
import { ConfigReader } from '@backstage/config';
import { getVoidLogger } from '../logging';
import { BitbucketUrlReader } from './BitbucketUrlReader';

const logger = getVoidLogger();

describe('BitbucketUrlReader', () => {
  const worker = setupServer();

  beforeAll(() => worker.listen({ onUnhandledRequest: 'error' }));
  afterAll(() => worker.close());

  beforeEach(() => {
    worker.use(
      rest.get('*', (req, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            url: req.url.toString(),
            headers: req.headers.getAllHeaders(),
          }),
        ),
      ),
    );
  });
  afterEach(() => worker.resetHandlers());

  const createConfig = (username?: string, appPassword?: string) =>
    new ConfigReader(
      {
        integrations: {
          bitbucket: [
            {
              host: 'bitbucket.org',
              username: username,
              appPassword: appPassword,
            },
          ],
        },
      },
      'test-config',
    );

  it.each([
    {
      url:
        'https://bitbucket.org/org-name/repo-name/src/master/templates/my-template.yaml',
      config: createConfig(),
      response: expect.objectContaining({
        url:
          'https://api.bitbucket.org/2.0/repositories/org-name/repo-name/src/master/templates/my-template.yaml',
      }),
    },
    {
      url:
        'https://bitbucket.org/org-name/repo-name/src/master/templates/my-template.yaml',
      config: createConfig('some-user', 'my-secret'),
      response: expect.objectContaining({
        headers: expect.objectContaining({
          authorization: 'Basic c29tZS11c2VyOm15LXNlY3JldA==',
        }),
      }),
    },
    {
      url:
        'https://bitbucket.org/org-name/repo-name/src/master/templates/my-template.yaml',
      config: createConfig(),
      response: expect.objectContaining({
        headers: expect.not.objectContaining({
          authorization: expect.anything(),
        }),
      }),
    },
    {
      url:
        'https://bitbucket.org/org-name/repo-name/src/master/templates/my-template.yaml',
      config: createConfig(undefined, 'only-password-provided'),
      response: expect.objectContaining({
        headers: expect.not.objectContaining({
          authorization: expect.anything(),
        }),
      }),
    },
  ])('should handle happy path %#', async ({ url, config, response }) => {
    const [{ reader }] = BitbucketUrlReader.factory({ config, logger });

    const data = await reader.read(url);
    const res = await JSON.parse(data.toString('utf-8'));
    expect(res).toEqual(response);
  });

  it.each([
    {
      url: 'https://api.com/a/b/blob/master/path/to/c.yaml',
      config: createConfig(),
      error:
        'Incorrect url: https://api.com/a/b/blob/master/path/to/c.yaml, Error: Wrong Bitbucket URL or Invalid file path',
    },
    {
      url: 'com/a/b/blob/master/path/to/c.yaml',
      config: createConfig(),
      error:
        'Incorrect url: com/a/b/blob/master/path/to/c.yaml, TypeError: Invalid URL: com/a/b/blob/master/path/to/c.yaml',
    },
    {
      url: '',
      config: createConfig('', ''),
      error:
        "Invalid type in config for key 'integrations.bitbucket[0].username' in 'test-config', got empty-string, wanted string",
    },
    {
      url: '',
      config: createConfig('only-user-provided', ''),
      error:
        "Invalid type in config for key 'integrations.bitbucket[0].appPassword' in 'test-config', got empty-string, wanted string",
    },
    {
      url: '',
      config: createConfig('', 'only-password-provided'),
      error:
        "Invalid type in config for key 'integrations.bitbucket[0].username' in 'test-config', got empty-string, wanted string",
    },
    {
      url: '',
      config: createConfig('only-user-provided', undefined),
      error:
        "Missing required config value at 'integrations.bitbucket[0].appPassword'",
    },
  ])('should handle error path %#', async ({ url, config, error }) => {
    await expect(async () => {
      const [{ reader }] = BitbucketUrlReader.factory({ config, logger });
      await reader.read(url);
    }).rejects.toThrow(error);
  });
});
