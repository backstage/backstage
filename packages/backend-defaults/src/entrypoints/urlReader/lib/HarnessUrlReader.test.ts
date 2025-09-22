/*
 * Copyright 2024 The Backstage Authors
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
import { HarnessIntegration, readHarnessConfig } from '@backstage/integration';
import { JsonObject } from '@backstage/types';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { UrlReaderPredicateTuple } from './types';
import { DefaultReadTreeResponseFactory } from './tree';
import getRawBody from 'raw-body';
import { HarnessUrlReader } from './HarnessUrlReader';
import { NotFoundError, NotModifiedError } from '@backstage/errors';
import fs from 'fs-extra';
import path from 'path';

const treeResponseFactory = DefaultReadTreeResponseFactory.create({
  config: new ConfigReader({}),
});

const harnessProcessor = new HarnessUrlReader(
  new HarnessIntegration(
    readHarnessConfig(
      new ConfigReader({
        host: 'app.harness.io',
        token: 'p',
      }),
    ),
  ),
  { treeResponseFactory },
);

const createReader = (config: JsonObject): UrlReaderPredicateTuple[] => {
  return HarnessUrlReader.factory({
    config: new ConfigReader(config),
    logger: mockServices.logger.mock(),
    treeResponseFactory,
  });
};
const responseBuffer = Buffer.from('Apache License');
const harnessApiResponse = (content: any) => {
  return content;
};
const commitHash = '3bdd5457286abdf920db4b77bf2fef79a06190c2';

const handlers = [
  rest.get(
    'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName/projName/repoName/:path+/raw/all-apis.yaml',
    (_req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ message: 'Error!!!' }));
    },
  ),
  rest.get(
    'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName/projName/repoName/:path+/raw/404error.yaml',
    (_req, res, ctx) => {
      return res(ctx.status(404), ctx.json({ message: 'File not found.' }));
    },
  ),
  rest.get(
    'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName/projName/repoName/:path+/raw/stream.TXT',
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.body(harnessApiResponse(responseBuffer.toString())),
      );
    },
  ),

  rest.get(
    'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName/projName/repoName/:path+/raw/buffer.TXT',
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.body(harnessApiResponse(responseBuffer.toString())),
      );
    },
  ),
  rest.get(
    'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName2/projectName/repoName/:path+/content?routingId=accountId&include_commit=true&git_ref=refs/heads/branchName',
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.set('Content-Type', 'application/json'),
        ctx.json({ latest_commit: { sha: commitHash } }),
      );
    },
  ),
  rest.get(
    'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName3/projectName/repoName/:path+/content?routingId=accountId&include_commit=true&git_ref=refs/heads/branchName',
    (_, res, ctx) => {
      return res(ctx.status(404));
    },
  ),
];

describe('HarnessUrlReader', () => {
  const worker = setupServer(...handlers);
  registerMswTestHooks(worker);
  beforeAll(() => worker.listen({ onUnhandledRequest: 'bypass' }));
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('reader factory', () => {
    it('creates a reader.', () => {
      const readers = createReader({
        integrations: {
          harness: [{ host: 'app.harness.io' }],
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
          harness: [{ host: 'app.harness.io' }],
        },
      });
      const predicate = readers[0].predicate;

      expect(predicate(new URL('https://app.harness.io/path'))).toBe(true);
    });

    it('returns false for a different host.', () => {
      const readers = createReader({
        integrations: {
          harness: [{ host: 'app.harness.io' }],
        },
      });
      const predicate = readers[0].predicate;

      expect(predicate(new URL('https://github.com/path'))).toBe(false);
    });
  });

  describe('readUrl part 1', () => {
    it('should be able to read file contents as buffer', async () => {
      const result = await harnessProcessor.readUrl(
        'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/buffer.TXT',
      );
      const buffer = await result.buffer();
      expect(buffer.toString()).toBe(responseBuffer.toString());
    });

    it('should be able to read file contents as stream', async () => {
      const result = await harnessProcessor.readUrl(
        'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/stream.TXT',
      );
      const fromStream = await getRawBody(result.stream!());
      expect(fromStream.toString()).toBe(responseBuffer.toString());
    });

    it('should raise NotFoundError on 404.', async () => {
      await expect(
        harnessProcessor.readUrl(
          'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/404error.yaml',
        ),
      ).rejects.toThrow(
        'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/404error.yaml x https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName/projName/repoName/+/raw/404error.yaml?routingId=accountId&git_ref=refs/heads/refMain, 404 Not Found',
      );
    });

    it('should throw an error on non 404 errors.', async () => {
      await expect(
        harnessProcessor.readUrl(
          'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/all-apis.yaml',
        ),
      ).rejects.toThrow(
        'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/all-apis.yaml x https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName/projName/repoName/+/raw/all-apis.yaml?routingId=accountId&git_ref=refs/heads/refMain, 500 Internal Server Error',
      );
    });
  });

  describe('readTree', () => {
    const repoBuffer = fs.readFileSync(
      path.resolve(__dirname, '__fixtures__/mock-main.zip'),
    );

    it('should be able to get archive', async () => {
      worker.use(
        rest.get(
          'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName2/projectName/repoName/:path+/archive/branchName.zip',
          (_, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/gzip'),
              ctx.set(
                'content-disposition',
                'attachment; filename=backstage-mock.zip',
              ),
              ctx.body(repoBuffer),
            );
          },
        ),
      );

      const response = await harnessProcessor.readTree(
        'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName2/projects/projectName/repos/repoName/files/branchName',
      );
      expect(response.etag).toBe(commitHash);

      const files = await response.files();
      expect(files.length).toBe(2);
    });

    it('should return not modified', async () => {
      await expect(
        harnessProcessor.readTree(
          'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName2/projects/projectName/repos/repoName/files/branchName2',
          {
            etag: commitHash,
          },
        ),
      ).rejects.toThrow(NotModifiedError);
    });

    it('should return not found', async () => {
      await expect(
        harnessProcessor.readTree(
          'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName3/projects/projectName/repos/repoName/files/branchName3',
        ),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('search', () => {
    it('should return a single file when given an exact URL', async () => {
      const data = await harnessProcessor.search(
        'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/buffer.TXT',
      );
      expect(data.etag).toBe('');
      expect(data.files.length).toBe(1);
      expect(data.files[0].url).toBe(
        'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/buffer.TXT',
      );
      expect((await data.files[0].content()).toString()).toEqual(
        'Apache License',
      );
    });

    it('should return empty list of files for not found files.', async () => {
      const data = await harnessProcessor.search(
        'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/404error.yaml',
      );
      expect(data.etag).toBe('');
      expect(data.files.length).toBe(0);
    });

    it('throws if given URL with wildcard', async () => {
      await expect(
        harnessProcessor.search(
          'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/*.yaml',
        ),
      ).rejects.toThrow('Unsupported search pattern URL');
    });
  });
});
