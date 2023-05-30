/*
 * Copyright 2023 The Backstage Authors
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
import { PassThrough } from 'stream';
import { createConfluenceToMarkdownAction } from './confluenceToMarkdown';
import { getVoidLogger } from '@backstage/backend-common';
import { UrlReader } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import mockFs from 'mock-fs';
import os from 'os';
import type { ActionContext } from '@backstage/plugin-scaffolder-node';
import { readFile, writeFile, createWriteStream } from 'fs-extra';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

jest.mock('fs-extra', () => ({
  mkdirSync: jest.fn(),
  readFile: jest.fn().mockResolvedValue('File contents'),
  writeFile: jest.fn().mockImplementation(() => {
    return Promise.resolve();
  }),
  outputFile: jest.fn(),
  openSync: jest.fn(),
  createWriteStream: jest.fn().mockReturnValue(new PassThrough()),
  ensureDir: jest.fn(),
}));

describe('confluence:transform:markdown', () => {
  const baseUrl = `https://nodomain.confluence.com`;
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  const config = new ConfigReader({
    confluence: {
      baseUrl: baseUrl,
      token: 'fake_token',
    },
  });

  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        github: [{ host: 'github.com', token: 'token' }],
      },
    }),
  );

  let reader: UrlReader;
  let mockContext: ActionContext<{
    confluenceUrls: string[];
    repoUrl: string;
  }>;

  const logger = getVoidLogger();
  jest.spyOn(logger, 'info');

  const mockTmpDir = os.tmpdir();

  beforeEach(() => {
    reader = {
      readUrl: jest.fn(),
      readTree: jest.fn().mockResolvedValue({
        dir: jest.fn(),
      }),
      search: jest.fn(),
    };
    mockContext = {
      input: {
        confluenceUrls: [
          'https://nodomain.confluence.com/display/testing/mkdocs',
        ],
        repoUrl: 'https://notreal.github.com/space/backstage/mkdocs.yml',
      },
      workspacePath: '/tmp',
      logger,
      logStream: new PassThrough(),
      output: jest.fn(),
      createTemporaryDirectory: jest.fn().mockResolvedValue(mockTmpDir),
    };
    mockFs({ [`${mockTmpDir}/src/docs`]: {} });
  });
  afterEach(() => {
    jest.clearAllMocks();
    mockFs.restore();
  });

  it('should call confluence to markdown action successfully with results array', async () => {
    const options = {
      reader,
      integrations,
      config,
    };
    const responseBody = {
      results: [
        {
          id: '4444444',
          type: 'page',
          title: 'Testing',
          body: {
            export_view: {
              value: '<p>hello world</p>',
            },
          },
        },
      ],
    };
    const responseBodyTwo = {
      results: [
        {
          id: '4444444',
          type: 'attachment',
          title: 'testing.pdf',
          metadata: {
            mediaType: 'application/pdf',
          },
          _links: {
            download: '/download/attachments/4444444/testing.pdf',
          },
        },
      ],
    };

    worker.use(
      rest.get(`${baseUrl}/rest/api/content`, (_, res, ctx) =>
        res(ctx.status(200, 'OK'), ctx.json(responseBody)),
      ),
      rest.get(
        `${baseUrl}/rest/api/content/4444444/child/attachment`,
        (_, res, ctx) => res(ctx.status(200, 'OK'), ctx.json(responseBodyTwo)),
      ),
      rest.get(
        `${baseUrl}/download/attachments/4444444/testing.pdf`,
        (_, res, ctx) => res(ctx.status(200, 'OK'), ctx.body('hello')),
      ),
    );

    const action = createConfluenceToMarkdownAction(options);

    await action.handler(mockContext);

    expect(logger.info).toHaveBeenCalledWith(
      `Fetching the mkdocs.yml catalog from https://notreal.github.com/space/backstage/mkdocs.yml`,
    );
    expect(logger.info).toHaveBeenCalledTimes(6);
    expect(createWriteStream).toHaveBeenCalledTimes(1);
    expect(readFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledTimes(1);
  });

  it('should call confluence to markdown action successfully with empty results array', async () => {
    const options = {
      reader,
      integrations,
      config,
    };
    const responseBody = {
      results: [
        {
          id: '4444444',
          type: 'page',
          title: 'Testing',
          body: {
            export_view: {
              value: '<p>hello world</p>',
            },
          },
        },
      ],
    };
    const responseBodyTwo = {
      results: [],
    };

    worker.use(
      rest.get(`${baseUrl}/rest/api/content`, (_, res, ctx) =>
        res(ctx.status(200, 'OK'), ctx.json(responseBody)),
      ),
      rest.get(
        `${baseUrl}/rest/api/content/4444444/child/attachment`,
        (_, res, ctx) => res(ctx.status(200, 'OK'), ctx.json(responseBodyTwo)),
      ),
    );

    const action = createConfluenceToMarkdownAction(options);

    await action.handler(mockContext);

    expect(logger.info).toHaveBeenCalledWith(
      `Fetching the mkdocs.yml catalog from https://notreal.github.com/space/backstage/mkdocs.yml`,
    );
    expect(logger.info).toHaveBeenCalledTimes(6);

    expect(createWriteStream).not.toHaveBeenCalled();
    expect(readFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledTimes(1);
  });

  it('should fail on the first fetch call with response.ok set to false', async () => {
    const options = {
      reader,
      integrations,
      config,
    };
    const responseBody = {};

    worker.use(
      rest.get(`${baseUrl}/rest/api/content`, (_, res, ctx) =>
        res(ctx.status(401, 'nope'), ctx.json(responseBody)),
      ),
    );

    const action = createConfluenceToMarkdownAction(options);
    await expect(async () => {
      await action.handler(mockContext);
    }).rejects.toThrow('Request failed with 401 Error');
  });

  it('should return nothing in results from the first api call and fail', async () => {
    const options = {
      reader,
      integrations,
      config,
    };
    const responseBody = {
      results: [],
    };

    worker.use(
      rest.get(`${baseUrl}/rest/api/content`, (_, res, ctx) =>
        res(ctx.status(200, 'OK'), ctx.json(responseBody)),
      ),
    );

    const action = createConfluenceToMarkdownAction(options);
    await expect(async () => {
      await action.handler(mockContext);
    }).rejects.toThrow(
      'Could not find document https://nodomain.confluence.com/display/testing/mkdocs. Please check your input.',
    );
  });

  it('should fail on the second fetch call to confluence', async () => {
    const options = {
      reader,
      integrations,
      config,
    };
    const responseBody = {
      results: [
        {
          id: '4444444',
          type: 'page',
          title: 'Testing',
          body: {
            export_view: {
              value: '<p>hello world</p>',
            },
          },
        },
      ],
    };
    const responseBodyTwo = {};

    worker.use(
      rest.get(`${baseUrl}/rest/api/content`, (_, res, ctx) =>
        res(ctx.status(200, 'OK'), ctx.json(responseBody)),
      ),
      rest.get(
        `${baseUrl}/rest/api/content/4444444/child/attachment`,
        (_, res, ctx) =>
          res(ctx.status(404, 'nope'), ctx.json(responseBodyTwo)),
      ),
    );

    const action = createConfluenceToMarkdownAction(options);
    await expect(async () => {
      await action.handler(mockContext);
    }).rejects.toThrow('Request failed with 404 Error');
  });
});
