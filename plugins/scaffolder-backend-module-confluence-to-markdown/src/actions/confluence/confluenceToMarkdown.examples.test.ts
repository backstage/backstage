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
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { examples } from './confluenceToMarkdown.examples';
import yaml from 'yaml';
import { ActionContext } from '@backstage/plugin-scaffolder-node';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { UrlReaderService } from '@backstage/backend-plugin-api';

describe('confluence:transform:markdown examples', () => {
  const baseUrl = `https://confluence.example.com`;
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
      input: yaml.parse(examples[0].example).steps[0].input,
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

    expect(mockContext.logger.info).toHaveBeenCalledWith(
      `Fetching the mkdocs.yml catalog from https://github.com/organization-name/repo-name/blob/main/mkdocs.yml`,
    );
    expect(mockContext.logger.info).toHaveBeenCalledTimes(5);

    expect(mockDir.content({ path: 'workspace/docs' })).toEqual({
      img: { 'testing.pdf': Buffer.from('hello') },
      'Page-Title.md': 'hello world',
    });
  });
});
