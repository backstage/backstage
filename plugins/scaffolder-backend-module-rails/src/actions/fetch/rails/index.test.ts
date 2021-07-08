/*
 * Copyright 2021 Spotify AB
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

const mockRailsTemplater = { run: jest.fn() };
jest.mock('@backstage/plugin-scaffolder-backend', () => ({
  ...jest.requireActual('@backstage/plugin-scaffolder-backend'),
  fetchContents: jest.fn(),
}));
jest.mock('./railsNewRunner', () => {
  return {
    RailsNewRunner: jest.fn().mockImplementation(() => {
      return mockRailsTemplater;
    }),
  };
});

import {
  ContainerRunner,
  getVoidLogger,
  UrlReader,
} from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import mockFs from 'mock-fs';
import os from 'os';
import { resolve as resolvePath } from 'path';
import { PassThrough } from 'stream';
import { createFetchRailsAction } from './index';
import { fetchContents } from '@backstage/plugin-scaffolder-backend';

describe('fetch:rails', () => {
  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        azure: [
          { host: 'dev.azure.com', token: 'tokenlols' },
          { host: 'myazurehostnotoken.com' },
        ],
      },
    }),
  );

  const mockTmpDir = os.tmpdir();
  const mockContext = {
    input: {
      url: 'https://rubyonrails.org/generator',
      targetPath: 'something',
      values: {
        help: 'me',
      },
    },
    baseUrl: 'somebase',
    workspacePath: mockTmpDir,
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn().mockResolvedValue(mockTmpDir),
  };

  const mockReader: UrlReader = {
    read: jest.fn(),
    readTree: jest.fn(),
    search: jest.fn(),
  };
  const containerRunner: ContainerRunner = {
    runContainer: jest.fn(),
  };

  const action = createFetchRailsAction({
    integrations,
    reader: mockReader,
    containerRunner,
  });

  beforeEach(() => {
    mockFs({ [`${mockContext.workspacePath}/result`]: {} });
    jest.restoreAllMocks();
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('should call fetchContents with the correct values', async () => {
    await action.handler(mockContext);

    expect(fetchContents).toHaveBeenCalledWith({
      reader: mockReader,
      integrations,
      baseUrl: mockContext.baseUrl,
      fetchUrl: mockContext.input.url,
      outputPath: resolvePath(mockContext.workspacePath),
    });
  });

  it('should execute the rails templater with the correct values', async () => {
    await action.handler(mockContext);

    expect(mockRailsTemplater.run).toHaveBeenCalledWith({
      workspacePath: mockTmpDir,
      logStream: mockContext.logStream,
      values: mockContext.input.values,
    });
  });

  it('should execute the rails templater with optional inputs if they are present and valid', async () => {
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        imageName: 'foo/rails-custom-image',
      },
    });

    expect(mockRailsTemplater.run).toHaveBeenCalledWith({
      workspacePath: mockTmpDir,
      logStream: mockContext.logStream,
      values: {
        ...mockContext.input.values,
        imageName: 'foo/rails-custom-image',
      },
    });
  });

  it('should throw if the target directory is outside of the workspace path', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          ...mockContext.input,
          targetPath: '/foo',
        },
      }),
    ).rejects.toThrow(
      /targetPath may not specify a path outside the working directory/,
    );
  });
});
