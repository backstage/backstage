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

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import { getVoidLogger } from '../logging';
import { DefaultReadTreeResponseFactory } from './tree';
import { UrlReaderPredicateTuple } from './types';
import {
  GerritIntegration,
  readGerritIntegrationConfig,
} from '@backstage/integration';
import { GerritUrlReader } from './GerritUrlReader';

const treeResponseFactory = DefaultReadTreeResponseFactory.create({
  config: new ConfigReader({}),
});

const gerritProcessor = new GerritUrlReader(
  new GerritIntegration(
    readGerritIntegrationConfig(
      new ConfigReader({
        host: 'gerrit.com',
      }),
    ),
  ),
);

const createReader = (config: JsonObject): UrlReaderPredicateTuple[] => {
  return GerritUrlReader.factory({
    config: new ConfigReader(config),
    logger: getVoidLogger(),
    treeResponseFactory,
  });
};

describe('GerritUrlReader', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  describe('reader factory', () => {
    it('creates a reader.', () => {
      const readers = createReader({
        integrations: {
          gerrit: [{ host: 'gerrit.com' }],
        },
      });
      expect(readers).toHaveLength(1);
    });

    it('should not create a default entry.', () => {
      const readers = createReader({
        integrations: {},
      });
      expect(readers).toHaveLength(0);
    });
  });

  describe('predicates without Gitiles', () => {
    const readers = createReader({
      integrations: {
        gerrit: [{ host: 'gerrit.com' }],
      },
    });
    const predicate = readers[0].predicate;

    it('returns true for the configured host', () => {
      expect(predicate(new URL('https://gerrit.com/path'))).toBe(true);
    });

    it('returns false for a different host.', () => {
      expect(predicate(new URL('https://github.com/path'))).toBe(false);
    });
  });

  describe('predicates with gitilesBaseUrl set.', () => {
    const readers = createReader({
      integrations: {
        gerrit: [
          { host: 'gerrit-review.com', gitilesBaseUrl: 'https://gerrit.com' },
        ],
      },
    });
    const predicate = readers[0].predicate;

    it('returns false since gitilesBaseUrl is set to the api host.', () => {
      expect(predicate(new URL('https://gerrit-review.com/path'))).toBe(false);
    });

    it('returns false for  host.', () => {
      expect(predicate(new URL('https://gerrit.com/path'))).toBe(true);
    });
  });

  describe('readUrl', () => {
    const responseBuffer = Buffer.from('Apache License');
    it('should be able to read file contents', async () => {
      worker.use(
        rest.get(
          'https://gerrit.com/projects/web%2Fproject/branches/master/files/LICENSE/content',
          (_, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.body(responseBuffer.toString('base64')),
            );
          },
        ),
      );

      const result = await gerritProcessor.readUrl(
        'https://gerrit.com/web/project/+/refs/heads/master/LICENSE',
      );
      const buffer = await result.buffer();
      expect(buffer.toString()).toBe(responseBuffer.toString());
    });

    it('should raise NotFoundError on 404.', async () => {
      worker.use(
        rest.get(
          'https://gerrit.com/projects/web%2Fproject/branches/master/files/LICENSE/content',
          (_, res, ctx) => {
            return res(ctx.status(404, 'File not found.'));
          },
        ),
      );

      await expect(
        gerritProcessor.readUrl(
          'https://gerrit.com/web/project/+/refs/heads/master/LICENSE',
        ),
      ).rejects.toThrow(
        'File https://gerrit.com/web/project/+/refs/heads/master/LICENSE not found.',
      );
    });

    it('should throw an error on non 404 errors.', async () => {
      worker.use(
        rest.get(
          'https://gerrit.com/projects/web%2Fproject/branches/master/files/LICENSE/content',
          (_, res, ctx) => {
            return res(ctx.status(500, 'Error!!!'));
          },
        ),
      );

      await expect(
        gerritProcessor.readUrl(
          'https://gerrit.com/web/project/+/refs/heads/master/LICENSE',
        ),
      ).rejects.toThrow(
        'https://gerrit.com/web/project/+/refs/heads/master/LICENSE' +
          ' could not be read as https://gerrit.com/projects/web%2Fproject' +
          '/branches/master/files/LICENSE/content, 500 Error!!!',
      );
    });
  });
});
