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

import { createConfluenceToMarkdownAction } from './confluenceToMarkdown';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import {
  createMockDirectory,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import type { ActionContext } from '@backstage/plugin-scaffolder-node';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { UrlReaderService } from '@backstage/backend-plugin-api';

jest.mock('cross-fetch', () => ({
  __esModule: true,
  default: (...args: Parameters<typeof fetch>) => fetch(...args),
  Response: global.Response,
}));

describe('confluence:transform:markdown', () => {
  const baseUrl = `https://nodomain.confluence.com`;
  const worker = setupServer();
  registerMswTestHooks(worker);

  const config = new ConfigReader({
    confluence: {
      baseUrl: baseUrl,
      auth: {
        token: 'fake_token',
      },
    },
  });

  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        github: [{ host: 'github.com', token: 'token' }],
      },
    }),
  );

  let reader: UrlReaderService;
  let mockContext: ActionContext<{
    confluenceUrls: string[];
    repoUrl: string;
  }>;

  const mockDir = createMockDirectory();
  const workspacePath = mockDir.resolve('workspace');

  beforeEach(() => {
    reader = {
      readUrl: jest.fn(),
      readTree: jest.fn().mockResolvedValue({
        dir: jest.fn(),
      }),
      search: jest.fn(),
    };
    mockContext = createMockActionContext({
      input: {
        confluenceUrls: [
          'https://nodomain.confluence.com/display/testing/mkdocs',
        ],
        repoUrl:
          'https://notreal.github.com/space/backstage/blob/main/mkdocs.yml',
      },
      workspacePath,
    });
    jest.spyOn(mockContext.logger, 'info');

    mockDir.setContent({ 'workspace/mkdocs.yml': 'File contents' });
  });

  afterEach(() => {
    jest.clearAllMocks();
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
      http.get(`${baseUrl}/rest/api/content`, () =>
        HttpResponse.json(responseBody, { status: 200 }),
      ),
      http.get(`${baseUrl}/rest/api/content/4444444/child/attachment`, () =>
        HttpResponse.json(responseBodyTwo, { status: 200 }),
      ),
      http.get(
        `${baseUrl}/download/attachments/4444444/testing.pdf`,
        () => new HttpResponse('hello', { status: 200 }),
      ),
    );

    const action = createConfluenceToMarkdownAction(options);

    await action.handler(mockContext);

    expect(mockContext.logger.info).toHaveBeenCalledWith(
      `Fetching the mkdocs.yml catalog from https://notreal.github.com/space/backstage/blob/main/mkdocs.yml`,
    );
    expect(mockContext.logger.info).toHaveBeenCalledTimes(5);

    expect(mockDir.content({ path: 'workspace/docs' })).toEqual({
      img: { 'testing.pdf': Buffer.from('hello') },
      'mkdocs.md': 'hello world',
    });
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
      http.get(`${baseUrl}/rest/api/content`, () =>
        HttpResponse.json(responseBody, { status: 200 }),
      ),
      http.get(`${baseUrl}/rest/api/content/4444444/child/attachment`, () =>
        HttpResponse.json(responseBodyTwo, { status: 200 }),
      ),
    );

    const action = createConfluenceToMarkdownAction(options);

    await action.handler(mockContext);

    expect(mockContext.logger.info).toHaveBeenCalledWith(
      `Fetching the mkdocs.yml catalog from https://notreal.github.com/space/backstage/blob/main/mkdocs.yml`,
    );
    expect(mockContext.logger.info).toHaveBeenCalledTimes(5);

    expect(mockDir.content({ path: 'workspace/docs' })).toEqual({
      'mkdocs.md': 'hello world',
    });
  });

  it('should fail on the first fetch call with response.ok set to false', async () => {
    const options = {
      reader,
      integrations,
      config,
    };
    const responseBody = {};

    worker.use(
      http.get(`${baseUrl}/rest/api/content`, () =>
        HttpResponse.json(responseBody, { status: 401, statusText: 'nope' }),
      ),
    );

    const action = createConfluenceToMarkdownAction(options);
    await expect(async () => {
      await action.handler(mockContext);
    }).rejects.toThrow('Request failed with 401 nope');
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
      http.get(`${baseUrl}/rest/api/content`, () =>
        HttpResponse.json(responseBody, { status: 200 }),
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
      http.get(`${baseUrl}/rest/api/content`, () =>
        HttpResponse.json(responseBody, { status: 200 }),
      ),
      http.get(`${baseUrl}/rest/api/content/4444444/child/attachment`, () =>
        HttpResponse.json(responseBodyTwo, { status: 404, statusText: 'nope' }),
      ),
    );

    const action = createConfluenceToMarkdownAction(options);
    await expect(async () => {
      await action.handler(mockContext);
    }).rejects.toThrow('Request failed with 404 nope');
  });
});
