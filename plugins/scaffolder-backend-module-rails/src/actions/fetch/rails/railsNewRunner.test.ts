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

const executeShellCommand = jest.fn();
const commandExists = jest.fn();

jest.mock('@backstage/plugin-scaffolder-node', () => ({
  executeShellCommand: (...args: any[]) => executeShellCommand(...args),
}));
jest.mock(
  'command-exists',
  () =>
    (...args: any[]) =>
      commandExists(...args),
);

import path from 'path';
import { PassThrough } from 'stream';
import { RailsNewRunner } from './railsNewRunner';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { ContainerRunner } from './ContainerRunner';

describe('Rails Templater', () => {
  const containerRunner: jest.Mocked<ContainerRunner> = {
    runContainer: jest.fn(),
  };

  const mockDir = createMockDirectory();

  beforeEach(() => {
    jest.clearAllMocks();
    mockDir.clear();
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

      mockDir.setContent({
        intermediate: {
          fakeGeneratedOutput: 'a',
        },
      });

      const templater = new RailsNewRunner({ containerRunner });
      await templater.run({
        workspacePath: mockDir.path,
        values,
        logStream,
      });

      expect(containerRunner.runContainer).toHaveBeenCalledWith({
        imageName: 'foo/rails-custom-image',
        command: 'rails',
        args: ['new', '/output/rails-project'],
        envVars: { HOME: '/tmp' },
        mountDirs: {
          [mockDir.path]: '/input',
          [path.join(mockDir.path, 'intermediate')]: '/output',
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

      mockDir.setContent({
        intermediate: {
          fakeGeneratedOutput: 'a',
        },
      });

      const templater = new RailsNewRunner({ containerRunner });
      await templater.run({
        workspacePath: mockDir.path,
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

      mockDir.setContent({
        intermediate: {
          fakeGeneratedOutput: 'a',
        },
      });

      const templater = new RailsNewRunner({ containerRunner });
      await templater.run({
        workspacePath: mockDir.path,
        values,
        logStream: stream,
      });

      expect(containerRunner.runContainer).toHaveBeenCalledWith({
        imageName: 'foo/rails-custom-image',
        command: 'rails',
        args: ['new', '/output/rails-project'],
        envVars: { HOME: '/tmp' },
        mountDirs: {
          [mockDir.path]: '/input',
          [path.join(mockDir.path, 'intermediate')]: '/output',
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
        railsArguments: { template: `.${path.sep}something.rb` },
        imageName: 'foo/rails-custom-image',
      };

      mockDir.setContent({
        intermediate: {
          fakeGeneratedOutput: 'a',
        },
      });

      const templater = new RailsNewRunner({ containerRunner });
      await templater.run({
        workspacePath: mockDir.path,
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
          [mockDir.path]: '/input',
          [path.join(mockDir.path, 'intermediate')]: '/output',
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

      mockDir.setContent({
        intermediate: {
          fakeGeneratedOutput: 'a',
        },
      });
      commandExists.mockImplementationOnce(() => () => true);

      const templater = new RailsNewRunner({ containerRunner });
      await templater.run({
        workspacePath: mockDir.path,
        values,
        logStream: stream,
      });

      expect(executeShellCommand).toHaveBeenCalledWith({
        command: 'rails',
        args: expect.arrayContaining([
          'new',
          path.join(mockDir.path, 'intermediate', 'rails-project'),
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
        railsArguments: { template: `.${path.sep}something.rb` },
        imageName: 'foo/rails-custom-image',
      };

      mockDir.setContent({
        intermediate: {
          fakeGeneratedOutput: 'a',
        },
      });
      commandExists.mockImplementationOnce(() => () => true);

      const templater = new RailsNewRunner({ containerRunner });
      await templater.run({
        workspacePath: mockDir.path,
        values,
        logStream: stream,
      });

      expect(executeShellCommand).toHaveBeenCalledWith({
        command: 'rails',
        args: expect.arrayContaining([
          'new',
          path.join(mockDir.path, 'intermediate', 'rails-project'),
          '--template',
          path.join(mockDir.path, './something.rb'),
        ]),
        logStream: stream,
      });
    });
  });

  describe('when nothing was generated', () => {
    it('throws an error', async () => {
      const stream = new PassThrough();

      mockDir.setContent({
        intermediate: {},
      });

      const templater = new RailsNewRunner({ containerRunner });
      await expect(
        templater.run({
          workspacePath: mockDir.path,
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
