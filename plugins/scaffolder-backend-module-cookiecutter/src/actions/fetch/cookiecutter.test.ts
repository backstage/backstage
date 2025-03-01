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

import { ConfigReader } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import { ScmIntegrations } from '@backstage/integration';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { createFetchCookiecutterAction } from './cookiecutter';
import { join } from 'path';
import type { ActionContext } from '@backstage/plugin-scaffolder-node';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { Writable } from 'stream';
import { UrlReaderService } from '@backstage/backend-plugin-api';
import { ContainerRunner } from './ContainerRunner';

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

describe('fetch:cookiecutter', () => {
  const mockDir = createMockDirectory({ mockOsTmpDir: true });
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

  const mockTmpDir = mockDir.path;

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

  const mockReader: UrlReaderService = {
    readUrl: jest.fn(),
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

    mockContext = createMockActionContext({
      input: {
        url: 'https://google.com/cookie/cutter',
        targetPath: 'something',
        values: {
          help: 'me',
        },
      },
      templateInfo: {
        entityRef: 'template:default/cookiecutter',
        baseUrl: 'somebase',
      },
      workspacePath: mockTmpDir,
    });
    mockDir.setContent({ template: {} });

    commandExists.mockResolvedValue(null);

    // Mock when run container is called it creates some new files in the mock filesystem
    containerRunner.runContainer.mockImplementation(async () => {
      mockDir.setContent({
        'intermediate/testfile.json': '{}',
      });
    });

    // Mock when executeShellCommand is called it creates some new files in the mock filesystem
    executeShellCommand.mockImplementation(async () => {
      mockDir.setContent({
        'intermediate/testfile.json': '{}',
      });
    });
  });

  it('should throw an error when copyWithoutRender is not an array', async () => {
    (mockContext.input as any).copyWithoutRender = 'not an array';

    await expect(action.handler(mockContext)).rejects.toThrow(
      /Fetch action input copyWithoutRender must be an Array/,
    );
  });

  it('should throw an error when extensions is not an array', async () => {
    (mockContext.input as any).extensions = 'not an array';

    await expect(action.handler(mockContext)).rejects.toThrow(
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
        baseUrl: mockContext.templateInfo?.baseUrl,
        fetchUrl: mockContext.input.url,
        outputPath: join(
          mockTmpDir,
          'template',
          "{{cookiecutter and 'contents'}}",
        ),
      }),
    );
  });

  it('should call out to cookiecutter using executeShellCommand when cookiecutter is installed', async () => {
    commandExists.mockResolvedValue(true);

    await action.handler(mockContext);

    expect(executeShellCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        command: 'cookiecutter',
        args: [
          '--no-input',
          '-o',
          join(mockTmpDir, 'intermediate'),
          join(mockTmpDir, 'template'),
          '--verbose',
        ],
        logStream: expect.any(Writable),
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
        logStream: expect.any(Writable),
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

  it('should throw error if cookiecutter is not installed and containerRunner is undefined', async () => {
    commandExists.mockResolvedValue(false);
    const ccAction = createFetchCookiecutterAction({
      integrations,
      reader: mockReader,
    });

    await expect(ccAction.handler(mockContext)).rejects.toThrow(
      /Invalid state: containerRunner cannot be undefined when cookiecutter is not installed/,
    );
  });
});
