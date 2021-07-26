/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const runCommand = jest.fn();
const commandExists = jest.fn();
const fetchContents = jest.fn();

jest.mock('@backstage/plugin-scaffolder-backend', () => ({
  ...jest.requireActual('@backstage/plugin-scaffolder-backend'),
  fetchContents,
  runCommand,
}));
jest.mock('command-exists', () => commandExists);

import {
  getVoidLogger,
  UrlReader,
  ContainerRunner,
} from '@backstage/backend-common';
import { ConfigReader, JsonObject } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import mockFs from 'mock-fs';
import os from 'os';
import { PassThrough } from 'stream';
import { createFetchCookiecutterAction } from './cookiecutter';
import { join } from 'path';
import type { ActionContext } from '@backstage/plugin-scaffolder-backend';

describe('fetch:cookiecutter', () => {
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

  let mockContext: ActionContext<{
    url: string;
    targetPath?: string;
    values: JsonObject;
    copyWithoutRender?: string[];
    extensions?: string[];
    imageName?: string;
  }>;

  const containerRunner: jest.Mocked<ContainerRunner> = {
    runContainer: jest.fn(),
  };

  const mockReader: UrlReader = {
    read: jest.fn(),
    readTree: jest.fn(),
    search: jest.fn(),
  };

  const action = createFetchCookiecutterAction({
    integrations,
    containerRunner,
    reader: mockReader,
  });

  beforeEach(() => {
    jest.resetAllMocks();

    mockContext = {
      input: {
        url: 'https://google.com/cookie/cutter',
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

    // mock the temp directory
    mockFs({ [mockTmpDir]: {} });
    mockFs({ [`${join(mockTmpDir, 'template')}`]: {} });

    commandExists.mockResolvedValue(null);

    // Mock when run container is called it creates some new files in the mock filesystem
    containerRunner.runContainer.mockImplementation(async () => {
      mockFs({
        [`${join(mockTmpDir, 'intermediate')}`]: {
          'testfile.json': '{}',
        },
      });
    });

    // Mock when runCommand is called it creats some new files in the mock filesystem
    runCommand.mockImplementation(async () => {
      mockFs({
        [`${join(mockTmpDir, 'intermediate')}`]: {
          'testfile.json': '{}',
        },
      });
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('should throw an error when copyWithoutRender is not an array', async () => {
    (mockContext.input as any).copyWithoutRender = 'not an array';

    await expect(action.handler(mockContext)).rejects.toThrowError(
      /Fetch action input copyWithoutRender must be an Array/,
    );
  });

  it('should throw an error when extensions is not an array', async () => {
    (mockContext.input as any).extensions = 'not an array';

    await expect(action.handler(mockContext)).rejects.toThrowError(
      /Fetch action input extensions must be an Array/,
    );
  });

  it('should call fetchContents with the correct variables', async () => {
    fetchContents.mockImplementation(() => Promise.resolve());
    await action.handler(mockContext);
    expect(fetchContents).toHaveBeenCalledWith(
      expect.objectContaining({
        reader: mockReader,
        integrations,
        baseUrl: mockContext.baseUrl,
        fetchUrl: mockContext.input.url,
        outputPath: join(
          mockTmpDir,
          'template',
          "{{cookiecutter and 'contents'}}",
        ),
      }),
    );
  });

  it('should call out to cookiecutter using runCommand when cookiecutter is installed', async () => {
    commandExists.mockResolvedValue(true);

    await action.handler(mockContext);

    expect(runCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        command: 'cookiecutter',
        args: [
          '--no-input',
          '-o',
          join(mockTmpDir, 'intermediate'),
          join(mockTmpDir, 'template'),
          '--verbose',
        ],
        logStream: mockContext.logStream,
      }),
    );
  });

  it('should call out to the containerRunner when there is no cookiecutter installed', async () => {
    commandExists.mockResolvedValue(false);

    await action.handler(mockContext);

    expect(containerRunner.runContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        imageName: 'spotify/backstage-cookiecutter',
        command: 'cookiecutter',
        args: ['--no-input', '-o', '/output', '/input', '--verbose'],
        mountDirs: {
          [join(mockTmpDir, 'intermediate')]: '/output',
          [join(mockTmpDir, 'template')]: '/input',
        },
        workingDir: '/input',
        envVars: { HOME: '/tmp' },
        logStream: mockContext.logStream,
      }),
    );
  });

  it('should use a custom imageName when there is an image supplied to the context', async () => {
    const imageName = 'test-image';
    mockContext.input.imageName = imageName;

    await action.handler(mockContext);

    expect(containerRunner.runContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        imageName,
      }),
    );
  });
});
