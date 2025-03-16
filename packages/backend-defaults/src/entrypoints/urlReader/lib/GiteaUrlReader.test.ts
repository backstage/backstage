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

import {
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { GiteaIntegration, readGiteaConfig } from '@backstage/integration';
import { JsonObject } from '@backstage/types';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { UrlReaderPredicateTuple } from './types';
import { DefaultReadTreeResponseFactory } from './tree';
import getRawBody from 'raw-body';
import { GiteaUrlReader } from './GiteaUrlReader';
import { NotFoundError, NotModifiedError } from '@backstage/errors';
import fs from 'fs-extra';
import path from 'path';

const treeResponseFactory = DefaultReadTreeResponseFactory.create({
  config: new ConfigReader({}),
});

const giteaProcessor = new GiteaUrlReader(
  new GiteaIntegration(
    readGiteaConfig(
      new ConfigReader({
        host: 'gitea.com',
      }),
    ),
  ),
  { treeResponseFactory },
);

const createReader = (config: JsonObject): UrlReaderPredicateTuple[] => {
  return GiteaUrlReader.factory({
    config: new ConfigReader(config),
    logger: mockServices.logger.mock(),
    treeResponseFactory,
  });
};

describe('GiteaUrlReader', () => {
  const worker = setupServer();
  registerMswTestHooks(worker);

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

    it('should throw NotModified if server responds with 304 from etag', async () => {
      worker.use(
        rest.get(
          'https://gitea.com/api/v1/repos/owner/project/contents/LICENSE',
          (_, res, ctx) => {
            return res(ctx.set('ETag', 'foo'), ctx.status(304, 'Error!!!'));
          },
        ),
      );

      await expect(
        giteaProcessor.readUrl(
          'https://gitea.com/owner/project/src/branch/branch2/LICENSE',
          {
            etag: 'foo',
          },
        ),
      ).rejects.toThrow(NotModifiedError);
    });

    it('should throw NotModified if server responds with 304 from lastModifiedAfter', async () => {
      worker.use(
        rest.get(
          'https://gitea.com/api/v1/repos/owner/project/contents/LICENSE',
          (_, res, ctx) => {
            return res(
              ctx.set(
                'Last-Modified',
                new Date('2020-01-01T00:00:00Z').toUTCString(),
              ),
              ctx.status(304, 'Error!!!'),
            );
          },
        ),
      );

      await expect(
        giteaProcessor.readUrl(
          'https://gitea.com/owner/project/src/branch/branch2/LICENSE',
          {
            lastModifiedAfter: new Date('2020-01-01T00:00:00Z'),
          },
        ),
      ).rejects.toThrow(NotModifiedError);
    });
  });

  describe('readTree', () => {
    const commitHash = '3bdd5457286abdf920db4b77bf2fef79a06190c2';

    const repoBuffer = fs.readFileSync(
      path.resolve(__dirname, '__fixtures__/mock-main.tar.gz'),
    );

    beforeEach(() => {
      worker.use(
        rest.get(
          'https://gitea.com/api/v1/repos/owner/project/git/commits/branch2',
          (_, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json({ sha: commitHash }),
            );
          },
        ),
      );
    });

    it('should be able to get archive', async () => {
      worker.use(
        rest.get(
          'https://gitea.com/api/v1/repos/owner/project/archive/branch2.tar.gz',
          (_, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/gzip'),
              ctx.set(
                'content-disposition',
                'attachment; filename=backstage-mock.tar.gz',
              ),
              ctx.body(repoBuffer),
            );
          },
        ),
      );

      const response = await giteaProcessor.readTree(
        'https://gitea.com/owner/project/src/branch/branch2',
      );
      expect(response.etag).toBe(commitHash);

      const files = await response.files();
      expect(files.length).toBe(2);
    });

    it('should return not modified', async () => {
      await expect(
        giteaProcessor.readTree(
          'https://gitea.com/owner/project/src/branch/branch2',
          {
            etag: commitHash,
          },
        ),
      ).rejects.toThrow(NotModifiedError);
    });

    it('should return not found', async () => {
      worker.use(
        rest.get(
          'https://gitea.com/api/v1/repos/owner/project/git/commits/branch3',
          (_, res, ctx) => {
            return res(ctx.status(404));
          },
        ),
      );

      await expect(
        giteaProcessor.readTree(
          'https://gitea.com/owner/project/src/branch/branch3',
        ),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('search', () => {
    const responseBuffer = Buffer.from('Apache License');
    const giteaApiResponse = (content: any) => {
      return JSON.stringify({
        encoding: 'base64',
        content: Buffer.from(content).toString('base64'),
      });
    };

    it('should return a single file when given an exact URL', async () => {
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

      const data = await giteaProcessor.search(
        'https://gitea.com/owner/project/src/branch/branch2/LICENSE',
      );
      expect(data.etag).toBe('');
      expect(data.files.length).toBe(1);
      expect(data.files[0].url).toBe(
        'https://gitea.com/owner/project/src/branch/branch2/LICENSE',
      );
      expect((await data.files[0].content()).toString()).toEqual(
        'Apache License',
      );
    });

    it('should return empty list of files for not found files.', async () => {
      worker.use(
        rest.get(
          'https://gitea.com/api/v1/repos/owner/project/contents/LICENSE',
          (_, res, ctx) => {
            return res(ctx.status(404, 'File not found.'));
          },
        ),
      );

      const data = await giteaProcessor.search(
        'https://gitea.com/owner/project/src/branch/branch2/LICENSE',
      );
      expect(data.etag).toBe('');
      expect(data.files.length).toBe(0);
    });

    it('throws if given URL with wildcard', async () => {
      await expect(
        giteaProcessor.search(
          'https://gitea.com/owner/project/src/branch/branch2/*.yaml',
        ),
      ).rejects.toThrow('Unsupported search pattern URL');
    });
  });
});
