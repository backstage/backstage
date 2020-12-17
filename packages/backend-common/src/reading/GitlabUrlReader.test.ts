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

import { ConfigReader } from '@backstage/config';
import { msw } from '@backstage/test-utils';
import fs from 'fs';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import path from 'path';
import { getVoidLogger } from '../logging';
import { GitlabUrlReader } from './GitlabUrlReader';
import { ReadTreeResponseFactory } from './tree';

const logger = getVoidLogger();

const treeResponseFactory = ReadTreeResponseFactory.create({
  config: new ConfigReader({}),
});

describe('GitlabUrlReader', () => {
  const worker = setupServer();
  msw.setupDefaultHandlers(worker);

  describe('implementation', () => {
    beforeEach(() => {
      worker.use(
        rest.get('*/api/v4/projects/:name', (_, res, ctx) =>
          res(ctx.status(200), ctx.json({ id: 12345 })),
        ),
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
          integrations: { gitlab: [{ host: 'gitlab.com', token }] },
        },
        'test-config',
      );

    it.each([
      // Project URLs
      {
        url:
          'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/my/path/to/file.yaml',
        config: createConfig(),
        response: expect.objectContaining({
          url:
            'https://gitlab.com/api/v4/projects/12345/repository/files/my%2Fpath%2Fto%2Ffile.yaml/raw?ref=branch',
          headers: expect.objectContaining({
            'private-token': '',
          }),
        }),
      },
      {
        url:
          'https://gitlab.example.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/my/path/to/file.yaml',
        config: createConfig('0123456789'),
        response: expect.objectContaining({
          url:
            'https://gitlab.example.com/api/v4/projects/12345/repository/files/my%2Fpath%2Fto%2Ffile.yaml/raw?ref=branch',
          headers: expect.objectContaining({
            'private-token': '0123456789',
          }),
        }),
      },
      {
        url:
          'https://gitlab.com/groupA/teams/teamA/repoA/-/blob/branch/my/path/to/file.yaml', // Repo not in subgroup
        config: createConfig(),
        response: expect.objectContaining({
          url:
            'https://gitlab.com/api/v4/projects/12345/repository/files/my%2Fpath%2Fto%2Ffile.yaml/raw?ref=branch',
        }),
      },

      // Raw URLs
      {
        url: 'https://gitlab.example.com/a/b/blob/master/c.yaml',
        config: createConfig(),
        response: expect.objectContaining({
          url: 'https://gitlab.example.com/a/b/raw/master/c.yaml',
        }),
      },
    ])('should handle happy path %#', async ({ url, config, response }) => {
      const [{ reader }] = GitlabUrlReader.factory({
        config,
        logger,
        treeResponseFactory,
      });

      const data = await reader.read(url);
      const res = await JSON.parse(data.toString('utf-8'));
      expect(res).toEqual(response);
    });

    it.each([
      {
        url: '',
        config: createConfig(''),
        error:
          "Invalid type in config for key 'integrations.gitlab[0].token' in 'test-config', got empty-string, wanted string",
      },
    ])('should handle error path %#', async ({ url, config, error }) => {
      await expect(async () => {
        const [{ reader }] = GitlabUrlReader.factory({
          config,
          logger,
          treeResponseFactory,
        });
        await reader.read(url);
      }).rejects.toThrow(error);
    });
  });

  describe('readTree', () => {
    const repoBuffer = fs.readFileSync(
      path.resolve('src', 'reading', '__fixtures__', 'repo.zip'),
    );

    beforeEach(() => {
      worker.use(
        rest.get(
          'https://gitlab.com/backstage/mock/-/archive/repo/mock-repo.zip',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/zip'),
              ctx.body(repoBuffer),
            ),
        ),
      );
    });

    it('returns the wanted files from an archive', async () => {
      const processor = new GitlabUrlReader(
        { host: 'gitlab.com' },
        { treeResponseFactory },
      );

      const response = await processor.readTree(
        'https://gitlab.com/backstage/mock/tree/repo',
      );

      const files = await response.files();
      expect(files.length).toBe(2);

      const indexMarkdownFile = await files[0].content();
      const mkDocsFile = await files[1].content();

      expect(mkDocsFile.toString()).toBe('site_name: Test\n');
      expect(indexMarkdownFile.toString()).toBe('# Test\n');
    });

    it('returns the wanted files from hosted gitlab', async () => {
      worker.use(
        rest.get(
          'https://git.mycompany.com/backstage/mock/-/archive/repo/mock-repo.zip',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/zip'),
              ctx.body(repoBuffer),
            ),
        ),
      );

      const processor = new GitlabUrlReader(
        { host: 'git.mycompany.com' },
        { treeResponseFactory },
      );

      const response = await processor.readTree(
        'https://git.mycompany.com/backstage/mock/tree/repo/docs',
      );

      const files = await response.files();

      expect(files.length).toBe(1);
      const indexMarkdownFile = await files[0].content();

      expect(indexMarkdownFile.toString()).toBe('# Test\n');
    });

    it('throws an error when branch is not specified', async () => {
      const processor = new GitlabUrlReader(
        { host: 'gitlab.com' },
        { treeResponseFactory },
      );

      await expect(
        processor.readTree('https://gitlab.com/backstage/mock'),
      ).rejects.toThrow(
        'GitLab URL must contain a branch to be able to fetch its tree',
      );
    });

    it('returns the wanted files from an archive with a subpath', async () => {
      const processor = new GitlabUrlReader(
        { host: 'gitlab.com' },
        { treeResponseFactory },
      );

      const response = await processor.readTree(
        'https://gitlab.com/backstage/mock/tree/repo/docs',
      );

      const files = await response.files();

      expect(files.length).toBe(1);
      const indexMarkdownFile = await files[0].content();

      expect(indexMarkdownFile.toString()).toBe('# Test\n');
    });
  });
});
