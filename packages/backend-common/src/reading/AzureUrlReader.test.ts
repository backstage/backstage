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
import { AzureUrlReader } from './AzureUrlReader';
import { msw } from '@backstage/test-utils';

const logger = getVoidLogger();

describe('AzureUrlReader', () => {
  const worker = setupServer();
  msw.setupDefaultHandlers(worker);

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

  const createConfig = (token?: string) =>
    new ConfigReader(
      {
        integrations: { azure: [{ host: 'dev.azure.com', token }] },
      },
      'test-config',
    );

  it.each([
    {
      url:
        'https://dev.azure.com/org-name/project-name/_git/repo-name?path=my-template.yaml&version=GBmaster',
      config: createConfig(),
      response: expect.objectContaining({
        url:
          'https://dev.azure.com/org-name/project-name/_apis/git/repositories/repo-name/items?path=my-template.yaml&version=master',
      }),
    },
    {
      url:
        'https://dev.azure.com/org-name/project-name/_git/repo-name?path=my-template.yaml',
      config: createConfig(),
      response: expect.objectContaining({
        url:
          'https://dev.azure.com/org-name/project-name/_apis/git/repositories/repo-name/items?path=my-template.yaml',
      }),
    },
    {
      url: 'https://dev.azure.com/a/b/_git/repo-name?path=my-template.yaml',
      config: createConfig('0123456789'),
      response: expect.objectContaining({
        headers: expect.objectContaining({
          authorization: 'Basic OjAxMjM0NTY3ODk=',
        }),
      }),
    },
    {
      url: 'https://dev.azure.com/a/b/_git/repo-name?path=my-template.yaml',
      config: createConfig(undefined),
      response: expect.objectContaining({
        headers: expect.not.objectContaining({
          authorization: expect.anything(),
        }),
      }),
    },
  ])('should handle happy path %#', async ({ url, config, response }) => {
    const [{ reader }] = AzureUrlReader.factory({ config, logger });

    const data = await reader.read(url);
    const res = await JSON.parse(data.toString('utf-8'));
    expect(res).toEqual(response);
  });

  it.each([
    {
      url: 'https://api.com/a/b/blob/master/path/to/c.yaml',
      config: createConfig(),
      error:
        'Incorrect url: https://api.com/a/b/blob/master/path/to/c.yaml, Error: Wrong Azure Devops URL or Invalid file path',
    },
    {
      url: 'com/a/b/blob/master/path/to/c.yaml',
      config: createConfig(),
      error:
        'Incorrect url: com/a/b/blob/master/path/to/c.yaml, TypeError: Invalid URL: com/a/b/blob/master/path/to/c.yaml',
    },
    {
      url: '',
      config: createConfig(''),
      error:
        "Invalid type in config for key 'integrations.azure[0].token' in 'test-config', got empty-string, wanted string",
    },
  ])('should handle error path %#', async ({ url, config, error }) => {
    await expect(async () => {
      const [{ reader }] = AzureUrlReader.factory({ config, logger });
      await reader.read(url);
    }).rejects.toThrow(error);
  });
});
