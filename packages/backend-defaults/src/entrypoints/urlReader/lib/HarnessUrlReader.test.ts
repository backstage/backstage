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
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { UrlReaderPredicateTuple } from './types';
import { DefaultReadTreeResponseFactory } from './tree';
import getRawBody from 'raw-body';
import { HarnessUrlReader } from './HarnessUrlReader';
import { NotFoundError, NotModifiedError } from '@backstage/errors';
import fs from 'fs-extra';
import path from 'node:path';

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

const apiKeyHarnessProcessor = new HarnessUrlReader(
  new HarnessIntegration(
    readHarnessConfig(
      new ConfigReader({
        host: 'app.harness.io',
        apiKey: 'harness-api-key',
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
  http.get(
    'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName/projName/repoName/:path+/raw/all-apis.yaml',
    () => HttpResponse.json({ message: 'Error!!!' }, { status: 500 }),
  ),
  http.get(
    'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName/projName/repoName/:path+/raw/404error.yaml',
    () => HttpResponse.json({ message: 'File not found.' }, { status: 404 }),
  ),
  http.get(
    'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName/projName/repoName/:path+/raw/stream.TXT',
    () =>
      new HttpResponse(harnessApiResponse(responseBuffer.toString()), {
        status: 200,
      }),
  ),

  http.get(
    'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName/projName/repoName/:path+/raw/buffer.TXT',
    () =>
      new HttpResponse(harnessApiResponse(responseBuffer.toString()), {
        status: 200,
      }),
  ),
  http.get(
    'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName2/projectName/repoName/:path+/content?routingId=accountId&include_commit=true&git_ref=refs/heads/branchName',
    () =>
      HttpResponse.json(
        { latest_commit: { sha: commitHash } },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      ),
  ),
  http.get(
    'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName3/projectName/repoName/:path+/content?routingId=accountId&include_commit=true&git_ref=refs/heads/branchName',
    () => new HttpResponse(null, { status: 404 }),
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
    it('rejects non-allowlisted cross-origin redirects at any hop', async () => {
      let receivedApiKey: string | null = null;
      worker.use(
        http.get(
          'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName/projName/repoName/:path+/raw/redirect.yaml',
          () =>
            new HttpResponse(null, {
              status: 302,
              headers: { location: '/redirect-hop' },
            }),
        ),
        http.get(
          'https://app.harness.io/redirect-hop',
          () =>
            new HttpResponse(null, {
              status: 302,
              headers: { location: 'https://redirect.example/target' },
            }),
        ),
        http.get('https://redirect.example/target', ({ request }) => {
          receivedApiKey = request.headers.get('x-api-key');
          return new HttpResponse('redirected content', { status: 200 });
        }),
      );

      await expect(
        apiKeyHarnessProcessor.readUrl(
          'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/redirect.yaml',
        ),
      ).rejects.toThrow('Refusing to follow cross-origin Harness redirect');
      expect(receivedApiKey).toBeNull();
    });

    it('follows same-origin redirects with the API key', async () => {
      let receivedApiKey: string | null = null;
      worker.use(
        http.get(
          'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName/projName/repoName/:path+/raw/same-origin-redirect.yaml',
          () =>
            new HttpResponse(null, {
              status: 302,
              headers: { location: '/redirect-target' },
            }),
        ),
        http.get('https://app.harness.io/redirect-target', ({ request }) => {
          receivedApiKey = request.headers.get('x-api-key');
          return new HttpResponse('redirected content', { status: 200 });
        }),
      );

      const response = await apiKeyHarnessProcessor.readUrl(
        'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/same-origin-redirect.yaml',
      );

      expect((await response.buffer()).toString()).toBe('redirected content');
      expect(receivedApiKey).toBe('harness-api-key');
    });

    it.each([
      {
        authType: 'API key',
        integrationAuth: { apiKey: 'harness-api-key' },
        sourceHeader: 'x-api-key',
        sourceValue: 'harness-api-key',
      },
      {
        authType: 'token',
        integrationAuth: { token: 'harness-token' },
        sourceHeader: 'authorization',
        sourceValue: 'Bearer harness-token',
      },
    ])(
      'follows allowlisted cross-origin redirects with origin-scoped $authType request options',
      async ({ integrationAuth, sourceHeader, sourceValue }) => {
        let receivedSourceHeader: string | null = null;
        let receivedTargetApiKey: string | null = null;
        let receivedTargetAuthorization: string | null = null;
        worker.use(
          http.get(
            'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName/projName/repoName/:path+/raw/allowlisted-redirect.yaml',
            ({ request }) => {
              receivedSourceHeader = request.headers.get(sourceHeader);
              return new HttpResponse(null, {
                status: 302,
                headers: {
                  location:
                    'https://downloads.example.com/allowlisted-target.yaml',
                },
              });
            },
          ),
          http.get(
            'https://downloads.example.com/allowlisted-target.yaml',
            ({ request }) => {
              receivedTargetApiKey = request.headers.get('x-api-key');
              receivedTargetAuthorization =
                request.headers.get('authorization');
              return new HttpResponse('redirected content', { status: 200 });
            },
          ),
        );

        const [{ reader }] = createReader({
          integrations: {
            harness: [{ host: 'app.harness.io', ...integrationAuth }],
          },
          backend: {
            reading: {
              allow: [{ host: 'downloads.example.com' }],
            },
          },
        });

        const response = await reader.readUrl(
          'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/allowlisted-redirect.yaml',
        );

        expect((await response.buffer()).toString()).toBe('redirected content');
        expect(receivedSourceHeader).toBe(sourceValue);
        expect(receivedTargetApiKey).toBeNull();
        expect(receivedTargetAuthorization).toBeNull();
      },
    );

    it('follows at most five same-origin redirects', async () => {
      worker.use(
        http.get(
          'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName/projName/repoName/:path+/raw/five-redirects.yaml',
          () =>
            new HttpResponse(null, {
              status: 302,
              headers: { location: '/five-redirects/1' },
            }),
        ),
        http.get('https://app.harness.io/five-redirects/:hop', ({ params }) => {
          const hop = Number(params.hop);
          return hop === 5
            ? new HttpResponse('redirected content', { status: 200 })
            : new HttpResponse(null, {
                status: 302,
                headers: { location: `/five-redirects/${hop + 1}` },
              });
        }),
        http.get(
          'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName/projName/repoName/:path+/raw/too-many-redirects.yaml',
          () =>
            new HttpResponse(null, {
              status: 302,
              headers: { location: '/too-many-redirects/1' },
            }),
        ),
        http.get(
          'https://app.harness.io/too-many-redirects/:hop',
          ({ params }) => {
            const hop = Number(params.hop);
            return new HttpResponse(null, {
              status: 302,
              headers: { location: `/too-many-redirects/${hop + 1}` },
            });
          },
        ),
      );

      const response = await apiKeyHarnessProcessor.readUrl(
        'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/five-redirects.yaml',
      );
      expect((await response.buffer()).toString()).toBe('redirected content');

      await expect(
        apiKeyHarnessProcessor.readUrl(
          'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/too-many-redirects.yaml',
        ),
      ).rejects.toThrow('Too many redirects (max 5)');
    });

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

    it('rejects cross-origin redirects while reading the latest commit', async () => {
      let receivedApiKey: string | null = null;
      worker.use(
        http.get(
          'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName4/projectName/repoName/:path+/content',
          () =>
            new HttpResponse(null, {
              status: 302,
              headers: { location: 'https://redirect.example/commit' },
            }),
        ),
        http.get('https://redirect.example/commit', ({ request }) => {
          receivedApiKey = request.headers.get('x-api-key');
          return HttpResponse.json({ latest_commit: { sha: commitHash } });
        }),
        http.get(
          'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName4/projectName/repoName/:path+/archive/branchName.zip',
          () =>
            new HttpResponse(new Uint8Array(repoBuffer), {
              status: 200,
              headers: { 'Content-Type': 'application/gzip' },
            }),
        ),
      );

      await expect(
        apiKeyHarnessProcessor.readTree(
          'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName4/projects/projectName/repos/repoName/files/branchName',
        ),
      ).rejects.toThrow('Refusing to follow cross-origin Harness redirect');
      expect(receivedApiKey).toBeNull();
    });

    it('rejects cross-origin redirects while reading the archive', async () => {
      let receivedApiKey: string | null = null;
      worker.use(
        http.get(
          'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName5/projectName/repoName/:path+/content',
          () => HttpResponse.json({ latest_commit: { sha: commitHash } }),
        ),
        http.get(
          'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName5/projectName/repoName/:path+/archive/branchName.zip',
          () =>
            new HttpResponse(null, {
              status: 302,
              headers: { location: 'https://redirect.example/archive' },
            }),
        ),
        http.get('https://redirect.example/archive', ({ request }) => {
          receivedApiKey = request.headers.get('x-api-key');
          return new HttpResponse(new Uint8Array(repoBuffer), {
            status: 200,
            headers: { 'Content-Type': 'application/gzip' },
          });
        }),
      );

      await expect(
        apiKeyHarnessProcessor.readTree(
          'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName5/projects/projectName/repos/repoName/files/branchName',
        ),
      ).rejects.toThrow('Refusing to follow cross-origin Harness redirect');
      expect(receivedApiKey).toBeNull();
    });

    it('should be able to get archive', async () => {
      worker.use(
        http.get(
          'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName2/projectName/repoName/:path+/archive/branchName.zip',
          () =>
            new HttpResponse(new Uint8Array(repoBuffer), {
              status: 200,
              headers: {
                'Content-Type': 'application/gzip',
                'content-disposition':
                  'attachment; filename=backstage-mock.zip',
              },
            }),
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
