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

import { ConfigReader } from '@backstage/config';
import {
  AzureIntegration,
  DefaultAzureDevOpsCredentialsProvider,
  readAzureIntegrationConfig,
  ScmIntegrations,
  AzureDevOpsCredentialLike,
  AzureIntegrationConfig,
} from '@backstage/integration';
import {
  createMockDirectory,
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import fs from 'fs-extra';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import path from 'path';
import { NotModifiedError } from '@backstage/errors';
import { AzureUrlReader } from './AzureUrlReader';
import { DefaultReadTreeResponseFactory } from './tree';

type AzureIntegrationConfigLike = Partial<
  Omit<AzureIntegrationConfig, 'credential' | 'credentials'>
> & {
  credentials?: Partial<AzureDevOpsCredentialLike>[];
};

const logger = mockServices.logger.mock();

const mockDir = createMockDirectory({ mockOsTmpDir: true });

const treeResponseFactory = DefaultReadTreeResponseFactory.create({
  config: new ConfigReader({}),
});

const urlReaderFactory = (azureIntegration: AzureIntegrationConfigLike) => {
  const credentialsProvider =
    DefaultAzureDevOpsCredentialsProvider.fromIntegrations(
      ScmIntegrations.fromConfig(
        new ConfigReader({
          integrations: {
            azure: [azureIntegration],
          },
        }),
      ),
    );
  return new AzureUrlReader(
    new AzureIntegration(
      readAzureIntegrationConfig(new ConfigReader(azureIntegration)),
    ),
    {
      treeResponseFactory,
      credentialsProvider,
    },
  );
};

describe('AzureUrlReader', () => {
  beforeEach(mockDir.clear);

  const worker = setupServer();
  registerMswTestHooks(worker);

  describe('read', () => {
    beforeEach(() => {
      worker.use(
        rest.get('*', (req, res, ctx) =>
          res(
            ctx.status(200),
            ctx.json({
              url: req.url.toString(),
              headers: req.headers.all(),
            }),
          ),
        ),
      );
    });

    const createConfig = (token?: string) => {
      let credentials: AzureDevOpsCredentialLike[] | undefined = undefined;
      if (token !== undefined) {
        credentials = [
          {
            personalAccessToken: token,
          },
        ];
      }
      return new ConfigReader(
        {
          integrations: {
            azure: [
              {
                host: 'dev.azure.com',
                credentials: credentials,
              },
            ],
          },
        },
        'test-config',
      );
    };

    it.each([
      {
        url: 'https://dev.azure.com/org-name/project-name/_git/repo-name?path=my-template.yaml&version=GBmaster',
        config: createConfig(),
        response: expect.objectContaining({
          url: 'https://dev.azure.com/org-name/project-name/_apis/git/repositories/repo-name/items?api-version=6.0&path=my-template.yaml&version=master',
        }),
      },
      {
        url: 'https://dev.azure.com/org-name/project-name/_git/repo-name?path=my-template.yaml',
        config: createConfig(),
        response: expect.objectContaining({
          url: 'https://dev.azure.com/org-name/project-name/_apis/git/repositories/repo-name/items?api-version=6.0&path=my-template.yaml',
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
          headers: expect.objectContaining({
            authorization: expect.stringMatching(/^Bearer /),
          }),
        }),
      },
    ])('should handle happy path %#', async ({ url, config, response }) => {
      const [{ reader }] = AzureUrlReader.factory({
        config,
        logger,
        treeResponseFactory,
      });

      const { buffer } = await reader.readUrl(url);
      const fromStream = await buffer();
      const res = await JSON.parse(fromStream.toString());
      expect(res).toEqual(response);
    });

    it.each([
      {
        url: 'https://api.com/a/b/blob/master/path/to/c.yaml',
        config: createConfig(),
        error: 'Azure URL must point to a git repository',
      },
      {
        url: 'com/a/b/blob/master/path/to/c.yaml',
        config: createConfig(),
        error: 'Invalid URL',
      },
      {
        url: '',
        config: createConfig(''),
        error:
          "Invalid type in config for key 'integrations.azure[0].credentials[0].personalAccessToken' in 'test-config', got empty-string, wanted string",
      },
    ])('should handle error path %#', async ({ url, config, error }) => {
      await expect(async () => {
        const [{ reader }] = AzureUrlReader.factory({
          config,
          logger,
          treeResponseFactory,
        });
        await reader.readUrl(url);
      }).rejects.toThrow(error);
    });
  });

  describe('readTree', () => {
    const repoBuffer = fs.readFileSync(
      path.resolve(__dirname, '__fixtures__/mock-main.zip'),
    );

    const processor = urlReaderFactory({
      host: 'dev.azure.com',
      credentials: [
        {
          personalAccessToken: 'my-pat',
        },
      ],
    });

    beforeEach(() => {
      worker.use(
        rest.get(
          'https://dev.azure.com/organization/project/_apis/git/repositories/repository/items',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/zip'),
              ctx.body(repoBuffer),
            ),
        ),
        rest.get(
          // https://docs.microsoft.com/en-us/rest/api/azure/devops/git/commits/get%20commits?view=azure-devops-rest-6.0#on-a-branch
          'https://dev.azure.com/organization/project/_apis/git/repositories/repository/commits',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.json({
                count: 2,
                value: [
                  {
                    commitId: '123abc2',
                    comment: 'second commit',
                  },
                  {
                    commitId: '123abc1',
                    comment: 'first commit',
                  },
                ],
              }),
            ),
        ),
      );
    });

    it('returns the wanted files from an archive', async () => {
      const response = await processor.readTree(
        'https://dev.azure.com/organization/project/_git/repository',
      );

      expect(response.etag).toBe('123abc2');

      const files = await response.files();

      expect(files.length).toBe(2);
      const mkDocsFile = await files[0].content();
      const indexMarkdownFile = await files[1].content();

      expect(mkDocsFile.toString()).toBe('site_name: Test\n');
      expect(indexMarkdownFile.toString()).toBe('# Test\n');
    });

    it('creates a directory with the wanted files', async () => {
      const response = await processor.readTree(
        'https://dev.azure.com/organization/project/_git/repository',
      );

      const dir = await response.dir({ targetDir: mockDir.path });

      await expect(
        fs.readFile(path.join(dir, 'mkdocs.yml'), 'utf8'),
      ).resolves.toBe('site_name: Test\n');
      await expect(
        fs.readFile(path.join(dir, 'docs', 'index.md'), 'utf8'),
      ).resolves.toBe('# Test\n');
    });

    it('throws a NotModifiedError when given a etag in options', async () => {
      const fnAzure = async () => {
        await processor.readTree(
          'https://dev.azure.com/organization/project/_git/repository',
          { etag: '123abc2' },
        );
      };

      await expect(fnAzure).rejects.toThrow(NotModifiedError);
    });

    it('should not throw a NotModifiedError when given an outdated etag in options', async () => {
      const response = await processor.readTree(
        'https://dev.azure.com/organization/project/_git/repository',
        { etag: 'outdated123abc' },
      );

      expect(response.etag).toBe('123abc2');
      const files = await response.files();

      expect(files.length).toBe(2);
      const mkDocsFile = await files[0].content();
      const indexMarkdownFile = await files[1].content();

      expect(mkDocsFile.toString()).toBe('site_name: Test\n');
      expect(indexMarkdownFile.toString()).toBe('# Test\n');
    });
  });

  describe('search', () => {
    const repoBuffer = fs.readFileSync(
      path.resolve(__dirname, '__fixtures__/mock-main.zip'),
    );

    const processor = urlReaderFactory({
      host: 'dev.azure.com',
      credentials: [
        {
          personalAccessToken: 'my-pat',
        },
      ],
    });

    beforeEach(() => {
      worker.use(
        rest.get(
          'https://dev.azure.com/org-name/project-name/_apis/git/repositories/repo-name/items',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/zip'),
              ctx.body(repoBuffer),
            ),
        ),
        rest.get(
          // https://docs.microsoft.com/en-us/rest/api/azure/devops/git/commits/get%20commits?view=azure-devops-rest-6.0#on-a-branch
          'https://dev.azure.com/org-name/project-name/_apis/git/repositories/repo-name/commits',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.json({
                count: 2,
                value: [
                  {
                    commitId: '123abc2',
                    comment: 'second commit',
                  },
                  {
                    commitId: '123abc1',
                    comment: 'first commit',
                  },
                ],
              }),
            ),
        ),
      );
    });

    it('works for exact urls', async () => {
      const result = await processor.search(
        'https://dev.azure.com/org-name/project-name/_git/repo-name?path=my-template.yaml&version=GBmaster',
      );
      expect(result.etag).toBe('');
      expect(result.files.length).toBe(1);
      expect(result.files[0].url).toBe(
        'https://dev.azure.com/org-name/project-name/_git/repo-name?path=my-template.yaml&version=GBmaster',
      );
    });

    it('works for the naive case', async () => {
      const result = await processor.search(
        'https://dev.azure.com/org-name/project-name/_git/repo-name?path=%2F**%2Findex.*&version=GBmaster',
      );
      expect(result.etag).toBe('123abc2');
      expect(result.files.length).toBe(1);
      expect(result.files[0].url).toBe(
        'https://dev.azure.com/org-name/project-name/_git/repo-name?path=%2Fdocs%2Findex.md&version=GBmaster',
      );
      await expect(result.files[0].content()).resolves.toEqual(
        Buffer.from('# Test\n'),
      );
    });

    it('throws NotModifiedError when same etag', async () => {
      await expect(
        processor.search(
          'https://dev.azure.com/org-name/project-name/_git/repo-name?path=**/index.*&version=GBmaster',
          { etag: '123abc2' },
        ),
      ).rejects.toThrow(NotModifiedError);
    });
  });
});
