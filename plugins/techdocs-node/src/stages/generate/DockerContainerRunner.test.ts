/*
 * Copyright 2020 The Backstage Authors
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

import fs from 'fs-extra';
import Stream, { PassThrough } from 'stream';
import { DockerContainerRunner, UserOptions } from './DockerContainerRunner';
import { createMockDirectory } from '@backstage/backend-test-utils';

const mockPull = jest.fn();
const mockRun = jest.fn();
const mockPing = jest.fn();

jest.mock(
  'dockerode',
  () =>
    function MockDocker() {
      return {
        pull: mockPull,
        run: mockRun,
        ping: mockPing,
      };
    },
);

describe('DockerContainerRunner', () => {
  let containerTaskApi: DockerContainerRunner;

  const inputDir = createMockDirectory();
  const outputDir = createMockDirectory();

  beforeEach(() => {
    inputDir.clear();
    outputDir.clear();

    mockPull.mockImplementation(
      (
        _repoTag: string,
        _options: {},
        callback: (error?: any, result?: any) => void,
      ) => {
        const mockStream = new PassThrough();
        callback(undefined, mockStream);
        mockStream.end();
      },
    );
    mockRun.mockResolvedValue([{ Error: null, StatusCode: 0 }]);
    mockPing.mockResolvedValue(Buffer.from('OK', 'utf-8'));

    containerTaskApi = new DockerContainerRunner();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const imageName = 'dockerorg/image';
  const args = ['bash', '-c', 'echo test'];
  const mountDirs = {
    [inputDir.path]: '/input',
    [outputDir.path]: '/output',
  };
  const workingDir = inputDir.path;
  const envVars = { HOME: '/tmp', LOG_LEVEL: 'debug' };
  const envVarsArray = ['HOME=/tmp', 'LOG_LEVEL=debug'];

  it('should pull the docker container', async () => {
    await containerTaskApi.runContainer({
      imageName,
      args,
    });

    expect(mockPull).toHaveBeenCalledWith(imageName, {}, expect.any(Function));

    expect(mockRun).toHaveBeenCalled();
  });

  it('should not pull the docker container when pullImage is false', async () => {
    await containerTaskApi.runContainer({
      imageName,
      args,
      pullImage: false,
    });

    expect(mockPull).not.toHaveBeenCalled();
    expect(mockRun).toHaveBeenCalled();
  });

  it('should call the dockerClient run command with the correct arguments passed through', async () => {
    await containerTaskApi.runContainer({
      imageName,
      args,
      mountDirs,
      envVars,
      workingDir,
    });

    expect(mockRun).toHaveBeenCalledWith(
      imageName,
      args,
      expect.any(Stream),
      expect.objectContaining({
        Env: envVarsArray,
        WorkingDir: workingDir,
        HostConfig: {
          AutoRemove: true,
          Binds: expect.arrayContaining([
            `${await fs.realpath(inputDir.path)}:/input`,
            `${await fs.realpath(outputDir.path)}:/output`,
          ]),
        },
        Volumes: {
          '/input': {},
          '/output': {},
        },
      }),
    );
  });

  it('should ping docker to test availability', async () => {
    await containerTaskApi.runContainer({
      imageName,
      args,
    });

    expect(mockPing).toHaveBeenCalled();
  });

  it('should pass through the user and group id from the host machine and set the home dir', async () => {
    await containerTaskApi.runContainer({
      imageName,
      args,
    });

    const userOptions: UserOptions = {};
    if (process.getuid && process.getgid) {
      userOptions.User = `${process.getuid()}:${process.getgid()}`;
    }

    expect(mockRun).toHaveBeenCalledWith(
      imageName,
      args,
      expect.any(Stream),
      expect.objectContaining({
        ...userOptions,
      }),
    );
  });

  it('throws a correct error if the command fails in docker', async () => {
    mockRun.mockResolvedValueOnce([
      {
        Error: new Error('Something went wrong with docker'),
        StatusCode: 0,
      },
    ]);

    await expect(
      containerTaskApi.runContainer({
        imageName,
        args,
      }),
    ).rejects.toThrow(/Something went wrong with docker/);
  });

  describe('where docker is unavailable', () => {
    const dockerError = 'a docker error';

    beforeEach(() => {
      mockPing.mockImplementationOnce(() => {
        throw new Error(dockerError);
      });
    });

    it('should throw with a descriptive error message including the docker error message', async () => {
      await expect(
        containerTaskApi.runContainer({
          imageName,
          args,
        }),
      ).rejects.toThrow(new RegExp(`.+: ${dockerError}`));
    });
  });

  it('should pass through the log stream to the docker client', async () => {
    const logStream = new PassThrough();
    await containerTaskApi.runContainer({
      imageName,
      args,
      logStream,
    });

    expect(mockRun).toHaveBeenCalledWith(
      imageName,
      args,
      logStream,
      expect.objectContaining({
        HostConfig: {
          AutoRemove: true,
          Binds: [],
        },
        Volumes: {},
      }),
    );
  });
});
