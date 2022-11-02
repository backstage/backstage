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

import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { GiteaIntegration, readGiteaConfig } from '@backstage/integration';
import { JsonObject } from '@backstage/types';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { getVoidLogger } from '../logging';
import { UrlReaderPredicateTuple } from './types';
import { DefaultReadTreeResponseFactory } from './tree';
import getRawBody from 'raw-body';
import { GiteaUrlReader } from './GiteaUrlReader';
import { NotFoundError } from '@backstage/errors';

const treeResponseFactory = DefaultReadTreeResponseFactory.create({
  config: new ConfigReader({}),
});

jest.mock('../scm', () => ({
  Git: {
    fromAuth: () => ({
      clone: jest.fn(() => Promise.resolve({})),
    }),
  },
}));

const giteaProcessor = new GiteaUrlReader(
  new GiteaIntegration(
    readGiteaConfig(
      new ConfigReader({
        host: 'gitea.com',
      }),
    ),
  ),
);

const createReader = (config: JsonObject): UrlReaderPredicateTuple[] => {
  return GiteaUrlReader.factory({
    config: new ConfigReader(config),
    logger: getVoidLogger(),
    treeResponseFactory,
  });
};

describe('GiteaUrlReader', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('reader factory', () => {
    it('creates a reader.', () => {
      const readers = createReader({
        integrations: {
          gitea: [{ host: 'gitea.com' }],
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

  describe('predicates', () => {
    it('returns true for the configured host', () => {
      const readers = createReader({
        integrations: {
          gitea: [{ host: 'gitea.com' }],
        },
      });
      const predicate = readers[0].predicate;

      expect(predicate(new URL('https://gitea.com/path'))).toBe(true);
    });

    it('returns false for a different host.', () => {
      const readers = createReader({
        integrations: {
          gitea: [{ host: 'gitea.com' }],
        },
      });
      const predicate = readers[0].predicate;

      expect(predicate(new URL('https://github.com/path'))).toBe(false);
    });
  });

  describe('readUrl', () => {
    const responseBuffer = Buffer.from('Apache License');
    const giteaApiResponse = (content: any) => {
      return JSON.stringify({
        encoding: 'base64',
        content: Buffer.from(content).toString('base64'),
      });
    };

    it('should be able to read file contents as buffer', async () => {
      worker.use(
        rest.get(
          'https://gitea.com/api/v1/repos/owner/project/contents/LICENSE',
          (req, res, ctx) => {
            // Test utils prefers matching URL directly but it is part of Gitea's API
            if (req.url.searchParams.get('ref') === 'branch2') {
              return res(
                ctx.status(200),
                ctx.body(giteaApiResponse(responseBuffer.toString())),
              );
            }

            return res(ctx.status(500));
          },
        ),
      );

      const result = await giteaProcessor.readUrl(
        'https://gitea.com/owner/project/src/branch/branch2/LICENSE',
      );
      const buffer = await result.buffer();
      expect(buffer.toString()).toBe(responseBuffer.toString());
    });

    it('should be able to read file contents as stream', async () => {
      worker.use(
        rest.get(
          'https://gitea.com/api/v1/repos/owner/project/contents/LICENSE',
          (req, res, ctx) => {
            if (req.url.searchParams.get('ref') === 'branch2') {
              return res(
                ctx.status(200),
                ctx.body(giteaApiResponse(responseBuffer.toString())),
              );
            }

            return res(ctx.status(500));
          },
        ),
      );

      const result = await giteaProcessor.readUrl(
        'https://gitea.com/owner/project/src/branch/branch2/LICENSE',
      );
      const fromStream = await getRawBody(result.stream!());
      expect(fromStream.toString()).toBe(responseBuffer.toString());
    });

    it('should raise NotFoundError on 404.', async () => {
      worker.use(
        rest.get(
          'https://gitea.com/api/v1/repos/owner/project/contents/LICENSE',
          (_, res, ctx) => {
            return res(ctx.status(404, 'File not found.'));
          },
        ),
      );

      await expect(
        giteaProcessor.readUrl(
          'https://gitea.com/owner/project/src/branch/branch2/LICENSE',
        ),
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw an error on non 404 errors.', async () => {
      worker.use(
        rest.get(
          'https://gitea.com/api/v1/repos/owner/project/contents/LICENSE',
          (_, res, ctx) => {
            return res(ctx.status(500, 'Error!!!'));
          },
        ),
      );

      await expect(
        giteaProcessor.readUrl(
          'https://gitea.com/owner/project/src/branch/branch2/LICENSE',
        ),
      ).rejects.toThrow(
        'https://gitea.com/owner/project/src/branch/branch2/LICENSE could not be read as https://gitea.com/api/v1/repos/owner/project/contents/LICENSE?ref=branch2, 500 Error!!!',
      );
    });
  });
});
