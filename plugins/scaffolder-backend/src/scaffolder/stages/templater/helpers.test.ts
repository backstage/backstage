/*
 * Copyright 2020 Spotify AB
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
import Stream, { PassThrough } from 'stream';
import os from 'os';
import fs from 'fs';
import Docker from 'dockerode';
import { UserOptions, runDockerContainer } from './helpers';

describe('helpers', () => {
  const mockDocker = new Docker() as jest.Mocked<Docker>;

  beforeEach(() => {
    jest
      .spyOn(mockDocker, 'run')
      .mockResolvedValue([{ Error: null, StatusCode: 0 }]);
    jest.spyOn(mockDocker, 'pull').mockImplementation((async (
      _image: string,
      _something: any,
      handler: (err: Error | undefined, stream: PassThrough) => void,
    ) => {
      const mockStream = new PassThrough();
      handler(undefined, mockStream);
      mockStream.end();
    }) as any);
  });

  describe('runDockerContainer', () => {
    const imageName = 'blam/github:ben';
    const args = ['bash', '-c', 'echo lol'];
    const templateDir = os.tmpdir();
    const resultDir = os.tmpdir();

    it('will pull the docker container before running', async () => {
      await runDockerContainer({
        imageName,
        args,
        templateDir,
        resultDir,
        dockerClient: mockDocker,
      });

      expect(mockDocker.pull).toHaveBeenCalledWith(
        imageName,
        {},
        expect.any(Function),
      );
    });
    it('should call the dockerClient run command with the correct arguments passed through', async () => {
      await runDockerContainer({
        imageName,
        args,
        templateDir,
        resultDir,
        dockerClient: mockDocker,
      });

      expect(mockDocker.run).toHaveBeenCalledWith(
        imageName,
        args,
        expect.any(Stream),
        expect.objectContaining({
          HostConfig: {
            Binds: expect.arrayContaining([
              `${await fs.promises.realpath(templateDir)}:/template`,
              `${await fs.promises.realpath(resultDir)}:/result`,
            ]),
          },
          Volumes: {
            '/template': {},
            '/result': {},
          },
        }),
      );
    });

    it('throws a correct error if the templating fails in docker', async () => {
      mockDocker.run.mockResolvedValueOnce([
        {
          Error: new Error('Something went wrong with docker'),
          StatusCode: 0,
        },
      ]);

      await expect(
        runDockerContainer({
          imageName,
          args,
          templateDir,
          resultDir,
          dockerClient: mockDocker,
        }),
      ).rejects.toThrow(/Something went wrong with docker/);
    });

    it('throws a correct error when the response code of the container is non-zero', async () => {
      mockDocker.run.mockResolvedValueOnce([
        {
          Error: null,
          StatusCode: 123,
        },
      ]);

      await expect(
        runDockerContainer({
          imageName,
          args,
          templateDir,
          resultDir,
          dockerClient: mockDocker,
        }),
      ).rejects.toThrow(
        /Docker container returned a non-zero exit code \(123\)/,
      );
    });

    it('should pass through the user and group id from the host machine and set the home dir', async () => {
      await runDockerContainer({
        imageName,
        args,
        templateDir,
        resultDir,
        dockerClient: mockDocker,
      });

      const userOptions: UserOptions = {};
      if (process.getuid && process.getgid) {
        userOptions.User = `${process.getuid()}:${process.getgid()}`;
      }

      expect(mockDocker.run).toHaveBeenCalledWith(
        imageName,
        args,
        expect.any(Stream),
        expect.objectContaining({
          ...userOptions,
          Env: ['HOME=/tmp'],
        }),
      );
    });

    it('should pass through the log stream to the docker client', async () => {
      const logStream = new PassThrough();
      await runDockerContainer({
        imageName,
        args,
        templateDir,
        resultDir,
        logStream,
        dockerClient: mockDocker,
      });

      expect(mockDocker.run).toHaveBeenCalledWith(
        imageName,
        args,
        logStream,
        expect.objectContaining({
          HostConfig: {
            Binds: expect.arrayContaining([
              `${await fs.promises.realpath(templateDir)}:/template`,
              `${await fs.promises.realpath(resultDir)}:/result`,
            ]),
          },
          Volumes: {
            '/template': {},
            '/result': {},
          },
        }),
      );
    });
  });
});
