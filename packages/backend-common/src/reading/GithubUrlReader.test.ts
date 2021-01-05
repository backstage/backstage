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
import { GithubUrlReader } from './GithubUrlReader';
import { ReadTreeResponseFactory } from './tree';

const treeResponseFactory = ReadTreeResponseFactory.create({
  config: new ConfigReader({}),
});

describe('GithubUrlReader', () => {
  describe('implementation', () => {
    it('rejects unknown targets', async () => {
      const processor = new GithubUrlReader(
        {
          host: 'github.com',
          apiBaseUrl: 'https://api.github.com',
        },
        { treeResponseFactory },
      );
      await expect(
        processor.read('https://not.github.com/apa'),
      ).rejects.toThrow(
        'Incorrect URL: https://not.github.com/apa, Error: Invalid GitHub URL or file path',
      );
    });
  });

  describe('readTree', () => {
    const worker = setupServer();

    msw.setupDefaultHandlers(worker);

    const repoBuffer = fs.readFileSync(
      path.resolve('src', 'reading', '__fixtures__', 'repo.tar.gz'),
    );

    beforeEach(() => {
      worker.use(
        rest.get(
          'https://github.com/backstage/mock/archive/repo.tar.gz',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/x-gzip'),
              ctx.body(repoBuffer),
            ),
        ),
      );
    });

    it('returns the wanted files from an archive', async () => {
      const processor = new GithubUrlReader(
        {
          host: 'github.com',
          apiBaseUrl: 'https://api.github.com',
        },
        { treeResponseFactory },
      );

      const response = await processor.readTree(
        'https://github.com/backstage/mock/tree/repo',
      );

      const files = await response.files();

      expect(files.length).toBe(2);
      const mkDocsFile = await files[0].content();
      const indexMarkdownFile = await files[1].content();

      expect(mkDocsFile.toString()).toBe('site_name: Test\n');
      expect(indexMarkdownFile.toString()).toBe('# Test\n');
    });

    it('includes the subdomain in the github url', async () => {
      worker.resetHandlers();
      worker.use(
        rest.get(
          'https://ghe.github.com/backstage/mock/archive/repo.tar.gz',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/x-gzip'),
              ctx.body(repoBuffer),
            ),
        ),
      );

      const processor = new GithubUrlReader(
        {
          host: 'ghe.github.com',
          apiBaseUrl: 'https://api.github.com',
        },
        { treeResponseFactory },
      );

      const response = await processor.readTree(
        'https://ghe.github.com/backstage/mock/tree/repo/docs',
      );

      const files = await response.files();

      expect(files.length).toBe(1);
      const indexMarkdownFile = await files[0].content();

      expect(indexMarkdownFile.toString()).toBe('# Test\n');
    });

    it('must specify a branch', async () => {
      const processor = new GithubUrlReader(
        {
          host: 'github.com',
          apiBaseUrl: 'https://api.github.com',
        },
        { treeResponseFactory },
      );

      await expect(
        processor.readTree('https://github.com/backstage/mock'),
      ).rejects.toThrow(
        'GitHub URL must contain branch to be able to fetch tree',
      );
    });

    it('returns the wanted files from an archive with a subpath', async () => {
      const processor = new GithubUrlReader(
        {
          host: 'github.com',
          apiBaseUrl: 'https://api.github.com',
        },
        { treeResponseFactory },
      );

      const response = await processor.readTree(
        'https://github.com/backstage/mock/tree/repo/docs',
      );

      const files = await response.files();

      expect(files.length).toBe(1);
      const indexMarkdownFile = await files[0].content();

      expect(indexMarkdownFile.toString()).toBe('# Test\n');
    });
  });
});
