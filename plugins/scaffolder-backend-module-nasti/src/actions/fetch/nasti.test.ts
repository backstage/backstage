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
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  getVoidLogger,
  UrlReader,
  ContainerRunner,
} from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import { ScmIntegrations } from '@backstage/integration';
import mockFs from 'mock-fs';
import os from 'os';
import { PassThrough } from 'stream';
import { createFetchNastiAction } from './nasti';
import { join } from 'path';
import type { ActionContext } from '@backstage/plugin-scaffolder-node';

const executeShellCommand = jest.fn();
const commandExists = jest.fn();
const fetchContents = jest.fn();

jest.mock('@backstage/plugin-scaffolder-node', () => ({
  ...jest.requireActual('@backstage/plugin-scaffolder-node'),
  fetchContents: (...args: any[]) => fetchContents(...args),
  executeShellCommand: (...args: any[]) => executeShellCommand(...args),
}));

jest.mock(
  'command-exists',
  () =>
    (...args: any[]) =>
      commandExists(...args),
);

describe('fetch:nasti', () => {
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
    imageName?: string;
  }>;

  const containerRunner: jest.Mocked<ContainerRunner> = {
    runContainer: jest.fn(),
  };

  const mockReader: UrlReader = {
    readUrl: jest.fn(),
    readTree: jest.fn(),
    search: jest.fn(),
  };

  const action = createFetchNastiAction({
    integrations,
    containerRunner,
    reader: mockReader,
  });

  beforeEach(() => {
    jest.resetAllMocks();

    mockContext = {
      input: {
        url: 'https://google.com/nasti',
        targetPath: 'something',
        values: {
          help: 'me',
        },
      },
      templateInfo: {
        entityRef: 'template:default/nasti',
        baseUrl: 'somebase',
      },
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

    // Mock when executeShellCommand is called it creates some new files in the mock filesystem
    executeShellCommand.mockImplementation(async () => {
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

    await expect(action.handler(mockContext)).rejects.toThrow(
      /Fetch action input copyWithoutRender must be an Array/,
    );
  });

  it('should call fetchContents with the correct variables', async () => {
    fetchContents.mockImplementation(() => Promise.resolve());
    await action.handler(mockContext);
    expect(fetchContents).toHaveBeenCalledWith(
      expect.objectContaining({
        reader: mockReader,
        integrations,
        baseUrl: mockContext.templateInfo?.baseUrl,
        fetchUrl: mockContext.input.url,
        outputPath: join(mockTmpDir, 'template', 'template_contents'),
      }),
    );
  });

  it('should call out to nasti using executeShellCommand when nasti is installed', async () => {
    commandExists.mockResolvedValue(true);

    await action.handler(mockContext);

    expect(executeShellCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        command: 'nasti',
        args: [
          'process',
          '-f',
          join(mockTmpDir, 'template/nasti.json'),
          join(mockTmpDir, 'template/template_contents'),
          join(mockTmpDir, 'intermediate'),
        ],
        logStream: mockContext.logStream,
      }),
    );
  });

  it('should call out to the containerRunner when there is no nasti installed', async () => {
    commandExists.mockResolvedValue(false);

    await action.handler(mockContext);

    expect(containerRunner.runContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        imageName: 'quay.io/rh_ee_addrew/nasti:master',
        command: 'nasti',
        args: [
          'process',
          '-f',
          join(mockTmpDir, 'template/nasti.json'),
          join(mockTmpDir, 'template/template_contents'),
          join(mockTmpDir, 'intermediate'),
        ],
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

  it('should throw error if nasti is not installed and containerRunner is undefined', async () => {
    commandExists.mockResolvedValue(false);
    const ccAction = createFetchNastiAction({
      integrations,
      reader: mockReader,
    });

    await expect(ccAction.handler(mockContext)).rejects.toThrow(
      /Invalid state: containerRunner cannot be undefined when nasti is not installed/,
    );
  });
});
