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

import { ConfigReader } from '@backstage/config';
import { PassThrough } from 'stream';
import mockFs from 'mock-fs';
import { CopierRunArgs, CopierRunner } from './CopierRunner';
import path from 'path';
import {
  ContainerRunner,
  GitProviders,
  getVoidLogger,
} from '@backstage/backend-common';
import fs from 'fs-extra';
import YAML from 'yaml';

const executeShellCommand = jest.fn();
const commandExists = jest.fn();

const mockGit = {
  clone: jest.fn(),
  fetch: jest.fn(),
};
jest.mock('@backstage/plugin-scaffolder-node', () => ({
  ...jest.requireActual('@backstage/plugin-scaffolder-node'),
  executeShellCommand: (...args: any[]) => executeShellCommand(...args),
}));

jest.mock(
  'command-exists',
  () =>
    (...args: any[]) =>
      commandExists(...args),
);

describe('fetch:copier', () => {
  const mockTmpDir = '/foo';
  const mockTemplateDir = path.join(mockTmpDir, 'template');
  let copierRunner: CopierRunner;
  let defaultRunArgs: CopierRunArgs;
  let logStream: PassThrough;
  let containerRunner: jest.Mocked<ContainerRunner>;
  beforeEach(() => {
    jest.resetAllMocks();
    containerRunner = {
      runContainer: jest.fn(),
    };
    jest.spyOn(GitProviders, 'default').mockReturnValue({
      getGit: jest.fn().mockReturnValue(mockGit),
    });
    logStream = new PassThrough();
    copierRunner = CopierRunner.fromConfig(new ConfigReader({}), {
      workspacePath: mockTmpDir,
      templatePath: mockTemplateDir,
      logger: getVoidLogger(),
      logStream,
    });

    defaultRunArgs = {
      answerFileDirectory: 'answerfiles',
      values: {
        name: 'test-name',
        description: 'test-description',
      },
      args: {
        answerFile: '.copier.answers.yaml',
        url: 'https://www.google.com/copier-templates',
      },
    };
    mockFs({
      [mockTmpDir]: {},
    });

    executeShellCommand.mockImplementation(async () => {
      mockFs({
        [`${mockTmpDir}`]: {
          '.copier.answers.yaml': '_src_path: www.google.com',
        },
      });
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  describe('Local Copier', () => {
    beforeEach(() => {
      commandExists.mockResolvedValue(true);
    });
    it('should throw an error when copier is not installed', async () => {
      commandExists.mockRejectedValue(null);
      await expect(copierRunner.run(defaultRunArgs)).rejects.toThrow(
        'Copier is not installed. Please install copier or provide a docker image name',
      );
    });

    it('should throw an error when an answerfile with the same name already exists', async () => {
      mockFs({
        [path.join(
          mockTmpDir,
          defaultRunArgs.answerFileDirectory,
          defaultRunArgs.args.answerFile,
        )]: '',
      });
      await expect(copierRunner.run(defaultRunArgs)).rejects.toThrow(
        'answerfile .copier.answers.yaml already exists in workspace.  Please ensure each answerfile has a unique name.',
      );
    });

    it('should pull a template from the upstream url', async () => {
      await copierRunner.run(defaultRunArgs);
      expect(mockGit.clone).toHaveBeenCalledWith({
        depth: 100,
        dir: mockTemplateDir,
        url: defaultRunArgs.args.url,
      });
      expect(mockGit.fetch).toHaveBeenCalledWith({
        dir: mockTemplateDir,
        tags: true,
      });
    });

    it('should generate a template and patch answerfile', async () => {
      await copierRunner.run(defaultRunArgs);
      const expectedCopyCommand =
        `copy --force -a .copier.answers.yaml --data name=test-name --data description=test-description ${mockTemplateDir} ${mockTmpDir}`.split(
          ' ',
        );
      expect(executeShellCommand).toHaveBeenCalledWith({
        command: 'copier',
        args: expectedCopyCommand,
        logStream: expect.any(PassThrough),
      });

      const answerFile = YAML.parse(
        fs.readFileSync(
          path.join(
            mockTmpDir,
            defaultRunArgs.answerFileDirectory,
            defaultRunArgs.args.answerFile,
          ),
          'utf-8',
        ),
      );
      expect(answerFile._src_path).toBe(defaultRunArgs.args.url);
    });

    it('should append the last line of the python traceback if copier fails', async () => {
      executeShellCommand.mockImplementationOnce(async () => {
        logStream.write('uh oh');
        logStream.write(
          "here's a big traceback, but we don't want to show this to the end-user",
        );
        logStream.write("value for 'name' is not good");
        throw new Error('copier failed');
      });

      await expect(copierRunner.run(defaultRunArgs)).rejects.toThrow(
        "copier failed: value for 'name' is not good",
      );
    });
  });

  describe('Container Copier', () => {
    beforeEach(() => {
      commandExists.mockRejectedValue(null);
      defaultRunArgs.imageName = 'test-image';
      containerRunner.runContainer.mockImplementation(async () => {
        mockFs({
          [`${mockTmpDir}`]: {
            '.copier.answers.yaml': '_src_path: www.google.com',
          },
        });
      });
      copierRunner = CopierRunner.fromConfig(new ConfigReader({}), {
        workspacePath: mockTmpDir,
        templatePath: mockTemplateDir,
        logger: getVoidLogger(),
        logStream,
        containerRunner,
      });
    });

    it('should still use the local copier install when it is present', async () => {
      commandExists.mockResolvedValue(true);
      await copierRunner.run(defaultRunArgs);
      expect(containerRunner.runContainer).not.toHaveBeenCalled();
    });

    it('should fail if imageName is provided but no container runner is configured', async () => {
      copierRunner = CopierRunner.fromConfig(new ConfigReader({}), {
        workspacePath: mockTmpDir,
        templatePath: mockTemplateDir,
        logger: getVoidLogger(),
        logStream,
      });
      await expect(copierRunner.run(defaultRunArgs)).rejects.toThrow(
        'No container runner configured.  Please check your `scaffolder.ts` configuration',
      );
    });

    it('should run the container with the correct command', async () => {
      await copierRunner.run(defaultRunArgs);
      const expectedCopyCommand =
        `copy --force -a .copier.answers.yaml --data name=test-name --data description=test-description ${mockTemplateDir} ${mockTmpDir}`.split(
          ' ',
        );
      expect(containerRunner.runContainer).toHaveBeenCalledWith({
        imageName: defaultRunArgs.imageName,
        command: 'copier',
        args: expectedCopyCommand,
        logStream: expect.any(PassThrough),
        mountDirs: {
          [mockTemplateDir]: '/input',
          [mockTmpDir]: '/output',
        },
      });
    });
  });
});
