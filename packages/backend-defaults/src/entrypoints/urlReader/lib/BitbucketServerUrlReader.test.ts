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
  BitbucketServerIntegration,
  readBitbucketServerIntegrationConfig,
} from '@backstage/integration';
import {
  createMockDirectory,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import fs from 'fs-extra';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import path from 'path';
import { NotModifiedError } from '@backstage/errors';
import { BitbucketServerUrlReader } from './BitbucketServerUrlReader';
import { DefaultReadTreeResponseFactory } from './tree';
import { UrlReaderServiceReadUrlResponse } from '@backstage/backend-plugin-api';

createMockDirectory({ mockOsTmpDir: true });

const treeResponseFactory = DefaultReadTreeResponseFactory.create({
  config: new ConfigReader({}),
});

const reader = new BitbucketServerUrlReader(
  new BitbucketServerIntegration(
    readBitbucketServerIntegrationConfig(
      new ConfigReader({
        host: 'bitbucket.mycompany.net',
        apiBaseUrl: 'https://api.bitbucket.mycompany.net/rest/api/1.0',
      }),
    ),
  ),
  { treeResponseFactory },
);

describe('BitbucketServerUrlReader', () => {
  const worker = setupServer();
  registerMswTestHooks(worker);

  describe('readTree', () => {
    const repoBuffer = fs.readFileSync(
      path.resolve(__dirname, '__fixtures__/bitbucket-server-repo.tar.gz'),
    );

    beforeEach(() => {
      worker.use(
        rest.get(
          'https://api.bitbucket.mycompany.net/rest/api/1.0/projects/backstage/repos/mock/archive',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/zip'),
              ctx.set(
                'content-disposition',
                'attachment; filename=backstage-mock.tgz',
              ),
              ctx.body(repoBuffer),
            ),
        ),
        rest.get(
          'https://api.bitbucket.mycompany.net/rest/api/1.0/projects/backstage/repos/mock/branches',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.json({
                size: 2,
                values: [
                  {
                    displayId: 'some-branch-that-should-be-ignored',
                    latestCommit: 'bogus hash',
                  },
                  {
                    displayId: 'some-branch',
                    latestCommit: '12ab34cd56ef78gh90ij12kl34mn56op78qr90st',
                  },
                ],
              }),
            ),
        ),
        rest.get(
          'https://api.bitbucket.mycompany.net/rest/api/1.0/projects/backstage/repos/mock/branches/default',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.json({
                id: 'refs/heads/master',
                displayId: 'master',
                type: 'BRANCH',
                latestCommit: '3bdd5457286abdf920db4b77bf2fef79a06190c2',
                latestChangeset: '3bdd5457286abdf920db4b77bf2fef79a06190c2',
                isDefault: true,
              }),
            ),
        ),
        rest.get(
          'https://api.bitbucket.mycompany.net/rest/api/1.0/projects/backstage/repos/mock/default-branch',
          (_, res, ctx) => res(ctx.status(404)),
        ),
      );
    });

    it('uses private bitbucket host', async () => {
      const response = await reader.readTree(
        'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/docs?at=some-branch',
      );

      expect(response.etag).toBe('12ab34cd56ef');

      const files = await response.files();

      expect(files.length).toBe(1);
      const indexMarkdownFile = await files[0].content();

      expect(indexMarkdownFile.toString()).toBe('# Test\n');
    });

    it('uses default branch when no branch is provided', async () => {
      const response = await reader.readTree(
        'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/src',
      );

      expect(response.etag).toBe('3bdd5457286a');
    });
  });

  describe('readTree without branch', () => {
    const repoBuffer = fs.readFileSync(
      path.resolve(__dirname, '__fixtures__/bitbucket-server-repo.tar.gz'),
    );

    beforeEach(() => {
      worker.use(
        rest.get(
          'https://api.bitbucket.mycompany.net/rest/api/1.0/projects/backstage/repos/mock/archive',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/zip'),
              ctx.set(
                'content-disposition',
                'attachment; filename=backstage-mock.tgz',
              ),
              ctx.body(repoBuffer),
            ),
        ),
        rest.get(
          'https://api.bitbucket.mycompany.net/rest/api/1.0/projects/backstage/repos/mock/branches',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.json({
                size: 2,
                values: [
                  {
                    displayId: 'some-branch-that-should-be-ignored',
                    latestCommit: 'bogus hash',
                  },
                  {
                    displayId: 'some-branch',
                    latestCommit: '12ab34cd56ef78gh90ij12kl34mn56op78qr90st',
                  },
                ],
              }),
            ),
        ),
      );
    });

    it('uses private bitbucket host', async () => {
      const response = await reader.readTree(
        'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/docs?at=some-branch',
      );

      expect(response.etag).toBe('12ab34cd56ef');

      const files = await response.files();

      expect(files.length).toBe(1);
      const indexMarkdownFile = await files[0].content();

      expect(indexMarkdownFile.toString()).toBe('# Test\n');
    });
  });

  describe('search private', () => {
    const repoBuffer = fs.readFileSync(
      path.resolve(__dirname, '__fixtures__/bitbucket-server-repo.tar.gz'),
    );

    beforeEach(() => {
      worker.use(
        rest.get(
          'https://api.bitbucket.mycompany.net/rest/api/1.0/projects/backstage/repos/mock/archive',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/zip'),
              ctx.set(
                'content-disposition',
                'attachment; filename=backstage-mock.tgz',
              ),
              ctx.body(repoBuffer),
            ),
        ),
        rest.get(
          'https://api.bitbucket.mycompany.net/rest/api/1.0/projects/backstage/repos/mock/branches',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.json({
                size: 2,
                values: [
                  {
                    displayId: 'master-of-none',
                    latestCommit: 'bogus hash',
                  },
                  {
                    displayId: 'master',
                    latestCommit: '12ab34cd56ef78gh90ij12kl34mn56op78qr90st',
                  },
                ],
              }),
            ),
        ),
      );
    });

    it('works for the naive case', async () => {
      const result = await reader.search(
        'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/**/index.*?at=master',
      );
      expect(result.etag).toBe('12ab34cd56ef');
      expect(result.files.length).toBe(1);
      expect(result.files[0].url).toBe(
        'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/docs/index.md?at=master',
      );
      await expect(result.files[0].content()).resolves.toEqual(
        Buffer.from('# Test\n'),
      );
    });

    it('works in nested folders', async () => {
      const result = await reader.search(
        'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/docs/index.*?at=master',
      );
      expect(result.etag).toBe('12ab34cd56ef');
      expect(result.files.length).toBe(1);
      expect(result.files[0].url).toBe(
        'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/docs/index.md?at=master',
      );
      await expect(result.files[0].content()).resolves.toEqual(
        Buffer.from('# Test\n'),
      );
    });

    it('throws NotModifiedError when same etag', async () => {
      await expect(
        reader.search(
          'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/**/index.*?at=master',
          { etag: '12ab34cd56ef' },
        ),
      ).rejects.toThrow(NotModifiedError);
    });

    it('should work for exact URLs by using readUrl directly', async () => {
      reader.readUrl = jest.fn().mockResolvedValue({
        buffer: async () => Buffer.from('content'),
        etag: 'etag',
      } as UrlReaderServiceReadUrlResponse);

      const result = await reader.search(
        'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/template.yml',
      );
      expect(reader.readUrl).toHaveBeenCalledTimes(1);
      expect(result.etag).toBe('etag');
      expect(result.files.length).toBe(1);
      expect(result.files[0].url).toBe(
        'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/template.yml',
      );
      expect((await result.files[0].content()).toString()).toEqual('content');
    });
  });
});
