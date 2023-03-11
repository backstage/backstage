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
import mockFs from 'mock-fs';
import os from 'os';
import fetch from 'node-fetch';
import type { ActionContext } from '@backstage/plugin-scaffolder-node';
import { readFile, writeFile } from 'fs-extra';
import { Readable } from 'stream';

jest.mock('node-fetch');
jest.mock('fs-extra', () => ({
  mkdirSync: jest.fn(),
  readFile: jest.fn().mockResolvedValue('File contents'),
  writeFile: jest.fn().mockImplementation(() => {
    return Promise.resolve();
  }),
  outputFile: jest.fn(),
  openSync: jest.fn(),
  createWriteStream: jest.fn().mockReturnValue(new PassThrough()),
  writeStream: jest.fn(),
}));
const { Response } = jest.requireActual('node-fetch');

describe('transform:confluence-to-markdown', () => {
  const config = new ConfigReader({
    confluence: {
      baseUrl: 'https://nodomain.confluence.com/',
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

    (fetch as jest.MockedFunction<typeof fetch>)
      .mockResolvedValueOnce(
        new Response(JSON.stringify(responseBody), {
          status: 200,
          statusText: 'OK',
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(responseBodyTwo), {
          status: 200,
          statusText: 'OK',
        }),
      )
      .mockResolvedValueOnce(
        new Response(Readable.from('Hello world'), {
          status: 200,
          statusText: 'OK',
        }),
      );

    const mockCreateWriteStream = jest.fn().mockReturnValue({
      on: jest.fn(),
      once: jest.fn((_event, callback) => {
        callback();
      }),
    });
    jest.mock('fs', () => ({
      openSync: jest.fn(),
      createWriteStream: jest.fn().mockReturnValue(mockCreateWriteStream),
    }));
    const action = createConfluenceToMarkdownAction(options);

    await action.handler(mockContext);

    expect(logger.info).toHaveBeenCalledWith(
      `Fetching the mkdocs.yml catalog from https://notreal.github.com/space/backstage/mkdocs.yml`,
    );
    expect(logger.info).toHaveBeenCalledTimes(5);

    expect(fetch).toHaveBeenCalledTimes(3);
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

    (fetch as jest.MockedFunction<typeof fetch>)
      .mockResolvedValueOnce(
        new Response(JSON.stringify(responseBody), {
          status: 200,
          statusText: 'OK',
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(responseBodyTwo), {
          status: 200,
          statusText: 'OK',
        }),
      );

    jest.mock('fs-extra', () => ({
      readFile: jest.fn().mockResolvedValue('File contents'),
    }));
    const action = createConfluenceToMarkdownAction(options);

    await action.handler(mockContext);

    expect(logger.info).toHaveBeenCalledWith(
      `Fetching the mkdocs.yml catalog from https://notreal.github.com/space/backstage/mkdocs.yml`,
    );
    expect(logger.info).toHaveBeenCalledTimes(5);

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(readFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledTimes(1);
  });

  it('shoud fail on the first fetch call with response.ok set to false', async () => {
    const options = {
      reader,
      integrations,
      config,
    };
    const responseBody = {};
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      new Response(JSON.stringify(responseBody), {
        status: 401,
        statusText: 'npot',
        ok: false,
      }),
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
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      new Response(JSON.stringify(responseBody), {
        status: 200,
        statusText: 'ok',
      }),
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

    (fetch as jest.MockedFunction<typeof fetch>)
      .mockResolvedValueOnce(
        new Response(JSON.stringify(responseBody), {
          status: 200,
          statusText: 'OK',
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(responseBodyTwo), {
          status: 404,
          statusText: 'notok',
        }),
      );
    const action = createConfluenceToMarkdownAction(options);
    await expect(async () => {
      await action.handler(mockContext);
    }).rejects.toThrow('Request failed with 404 Error');
  });
});
