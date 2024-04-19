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

import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { HarnessIntegration, readHarnessConfig } from '@backstage/integration';
import { JsonObject } from '@backstage/types';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { getVoidLogger } from '../logging';
import { UrlReaderPredicateTuple } from './types';
import { DefaultReadTreeResponseFactory } from './tree';
import getRawBody from 'raw-body';
import { HarnessUrlReader } from './HarnessUrlReader';
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

const harnessProcessor = new HarnessUrlReader(
  new HarnessIntegration(
    readHarnessConfig(
      new ConfigReader({
        host: 'app.harness.io',
      }),
    ),
  ),
);

const createReader = (config: JsonObject): UrlReaderPredicateTuple[] => {
  return HarnessUrlReader.factory({
    config: new ConfigReader(config),
    logger: getVoidLogger(),
    treeResponseFactory,
  });
};

describe('HarnessUrlReader', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

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

  describe('readUrl', () => {
    const responseBuffer = Buffer.from('Apache License');
    const harnessApiResponse = (content: any) => {
      return JSON.stringify({
        encoding: 'base64',
        content: Buffer.from(content).toString('base64'),
      });
    };

    it.skip('should be able to read file contents as buffer', async () => {
      worker.use(
        rest.get(
          'https://app.harness.io/api/v1/repos/owner/project/contents/LICENSE',
          (req, res, ctx) => {
            // Test utils prefers matching URL directly but it is part of Gitea's API
            if (req.url.searchParams.get('ref') === 'branch2') {
              return res(
                ctx.status(200),
                ctx.body(harnessApiResponse(responseBuffer.toString())),
              );
            }

            return res(ctx.status(500));
          },
        ),
      );

      const result = await harnessProcessor.readUrl(
        'https://app.harness.io/owner/project/src/branch/branch2/LICENSE',
      );
      const buffer = await result.buffer();
      expect(buffer.toString()).toBe(responseBuffer.toString());
    });

    it.skip('should be able to read file contents as stream', async () => {
      worker.use(
        rest.get(
          'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/LICENSE.txt',
          (req, res, ctx) => {
            if (req.url.searchParams.get('ref') === 'refMain') {
              return res(
                ctx.status(200),
                ctx.body(harnessApiResponse(responseBuffer.toString())),
              );
            }

            return res(ctx.status(500));
          },
        ),
      );

      const result = await harnessProcessor.readUrl(
        'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/LICENSE.TXT',
      );
      const fromStream = await getRawBody(result.stream!());
      expect(fromStream.toString()).toBe(responseBuffer.toString());
    });

    it.skip('should raise NotFoundError on 404.', async () => {
      worker.use(
        rest.get(
          'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/all-apis.yaml',
          (_, res, ctx) => {
            return res(ctx.status(404, 'File not found.'));
          },
        ),
      );

      await expect(
        harnessProcessor.readUrl(
          'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/all-apis.yaml',
        ),
      ).rejects.toThrow(NotFoundError);
    });

    it.skip('should throw an error on non 404 errors.', async () => {
      worker.use(
        rest.get(
          'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/all-apis.yaml',
          (_, res, ctx) => {
            return res(ctx.status(500, 'Error!!!'));
          },
        ),
      );

      await expect(
        harnessProcessor.readUrl(
          'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/all-apis.yaml',
        ),
      ).rejects.toThrow(
        'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName/projName/repoName/+/content/all-apis.yaml?routingId=accountId&include_commit=false&ref=refMain, 500 Error!!!',
      );
    });
  });
});
