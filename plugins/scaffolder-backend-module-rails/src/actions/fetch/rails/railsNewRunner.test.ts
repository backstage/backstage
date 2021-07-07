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
const runCommand = jest.fn();
const commandExists = jest.fn();

jest.mock('@backstage/plugin-scaffolder-backend', () => ({ runCommand }));
jest.mock('command-exists', () => commandExists);
jest.mock('fs-extra');

import { ContainerRunner } from '@backstage/backend-common';
import fs from 'fs-extra';

import path from 'path';
import { PassThrough } from 'stream';

import { RailsNewRunner } from './railsNewRunner';

describe('Rails Templater', () => {
  const containerRunner: jest.Mocked<ContainerRunner> = {
    runContainer: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when running on docker', () => {
    it('should run the correct bindings for the volumes', async () => {
      const logStream = new PassThrough();
      const values = {
        owner: 'angeliski',
        storePath: 'https://github.com/angeliski/rails-project',
        name: 'rails-project',
        imageName: 'foo/rails-custom-image',
      };

      jest.spyOn(fs, 'readdir').mockResolvedValueOnce(['newthing'] as any);
      jest
        .spyOn(fs, 'realpath')
        .mockImplementation(x => Promise.resolve(x.toString()));

      const templater = new RailsNewRunner({ containerRunner });
      await templater.run({
        workspacePath: 'tempdir',
        values,
        logStream,
      });

      expect(containerRunner.runContainer).toHaveBeenCalledWith({
        imageName: 'foo/rails-custom-image',
        command: 'rails',
        args: ['new', '/output/rails-project'],
        envVars: { HOME: '/tmp' },
        mountDirs: {
          ['tempdir']: '/input',
          [path.join('tempdir', 'intermediate')]: '/output',
        },
        workingDir: '/input',
        logStream: logStream,
      });
    });

    it('should use the provided imageName', async () => {
      const logStream = new PassThrough();
      const values = {
        owner: 'angeliski',
        storePath: 'https://github.com/angeliski/rails-project',
        name: 'rails-project',
        imageName: 'foo/rails-custom-image',
      };

      jest.spyOn(fs, 'readdir').mockResolvedValueOnce(['newthing'] as any);

      const templater = new RailsNewRunner({ containerRunner });
      await templater.run({
        workspacePath: 'tempdir',
        values,
        logStream,
      });

      expect(containerRunner.runContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          imageName: 'foo/rails-custom-image',
        }),
      );
    });

    it('should pass through the streamer to the run docker helper', async () => {
      const stream = new PassThrough();

      const values = {
        owner: 'angeliski',
        storePath: 'https://github.com/angeliski/rails-project',
        name: 'rails-project',
        imageName: 'foo/rails-custom-image',
      };

      jest.spyOn(fs, 'readdir').mockResolvedValueOnce(['newthing'] as any);

      const templater = new RailsNewRunner({ containerRunner });
      await templater.run({
        workspacePath: 'tempdir',
        values,
        logStream: stream,
      });

      expect(containerRunner.runContainer).toHaveBeenCalledWith({
        imageName: 'foo/rails-custom-image',
        command: 'rails',
        args: ['new', '/output/rails-project'],
        envVars: { HOME: '/tmp' },
        mountDirs: {
          ['tempdir']: '/input',
          [path.join('tempdir', 'intermediate')]: '/output',
        },
        workingDir: '/input',
        logStream: stream,
      });
    });

    it('update the template path to correct location', async () => {
      const logStream = new PassThrough();
      const values = {
        owner: 'angeliski',
        storePath: 'https://github.com/angeliski/rails-project',
        name: 'rails-project',
        railsArguments: { template: './something.rb' },
        imageName: 'foo/rails-custom-image',
      };

      jest.spyOn(fs, 'readdir').mockResolvedValueOnce(['newthing'] as any);
      jest
        .spyOn(fs, 'realpath')
        .mockImplementation(x => Promise.resolve(x.toString()));

      const templater = new RailsNewRunner({ containerRunner });
      await templater.run({
        workspacePath: 'tempdir',
        values,
        logStream,
      });

      expect(containerRunner.runContainer).toHaveBeenCalledWith({
        imageName: 'foo/rails-custom-image',
        command: 'rails',
        args: [
          'new',
          '/output/rails-project',
          '--template',
          '/input/something.rb',
        ],
        envVars: { HOME: '/tmp' },
        mountDirs: {
          ['tempdir']: '/input',
          [path.join('tempdir', 'intermediate')]: '/output',
        },
        workingDir: '/input',
        logStream: logStream,
      });
    });
  });

  describe('when rails is available', () => {
    it('use the binary', async () => {
      const stream = new PassThrough();

      const values = {
        owner: 'angeliski',
        storePath: 'https://github.com/angeliski/rails-project',
        name: 'rails-project',
        imageName: 'foo/rails-custom-image',
      };

      jest.spyOn(fs, 'readdir').mockResolvedValueOnce(['newthing'] as any);
      commandExists.mockImplementationOnce(() => () => true);

      const templater = new RailsNewRunner({ containerRunner });
      await templater.run({
        workspacePath: 'tempdir',
        values,
        logStream: stream,
      });

      expect(runCommand).toHaveBeenCalledWith({
        command: 'rails',
        args: expect.arrayContaining([
          'new',
          path.join('tempdir', 'intermediate', 'rails-project'),
        ]),
        logStream: stream,
      });
    });
    it('update the template path to correct location', async () => {
      const stream = new PassThrough();

      const values = {
        owner: 'angeliski',
        storePath: 'https://github.com/angeliski/rails-project',
        name: 'rails-project',
        railsArguments: { template: './something.rb' },
        imageName: 'foo/rails-custom-image',
      };

      jest.spyOn(fs, 'readdir').mockResolvedValueOnce(['newthing'] as any);
      commandExists.mockImplementationOnce(() => () => true);

      const templater = new RailsNewRunner({ containerRunner });
      await templater.run({
        workspacePath: 'tempdir',
        values,
        logStream: stream,
      });

      expect(runCommand).toHaveBeenCalledWith({
        command: 'rails',
        args: expect.arrayContaining([
          'new',
          path.join('tempdir', 'intermediate', 'rails-project'),
          '--template',
          path.join('tempdir', './something.rb'),
        ]),
        logStream: stream,
      });
    });
  });

  describe('when nothing was generated', () => {
    it('throws an error', async () => {
      const stream = new PassThrough();

      jest
        .spyOn(fs, 'readdir')
        .mockImplementationOnce(() => Promise.resolve([]));

      const templater = new RailsNewRunner({ containerRunner });
      await expect(
        templater.run({
          workspacePath: 'tempdir',
          values: {
            owner: 'angeliski',
            storePath: 'https://github.com/angeliski/rails-project',
            name: 'rails-project',
            imageName: 'foo/rails-custom-image',
          },
          logStream: stream,
        }),
      ).rejects.toThrow(/No data generated by rails/);
    });
  });
});
