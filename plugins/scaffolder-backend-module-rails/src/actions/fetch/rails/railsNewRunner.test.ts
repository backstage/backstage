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

import { ContainerRunner } from '@backstage/backend-common';
import { createMockDirectory } from '@backstage/backend-test-utils';
import path from 'path';
import { Logger } from 'winston';
import { RailsNewRunner } from './railsNewRunner';

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
      const logger = new Logger();
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
        logger,
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
      });
    });

    it('should use the provided imageName', async () => {
      const logger = new Logger();
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
        logger,
      });

      expect(containerRunner.runContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          imageName: 'foo/rails-custom-image',
        }),
      );
    });

    it('should pass through the streamer to the run docker helper', async () => {
      const logger = new Logger();

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
        logger,
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
      });
    });

    it('update the template path to correct location', async () => {
      const logger = new Logger();
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
        logger,
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
      });
    });
  });

  describe('when rails is available', () => {
    it('use the binary', async () => {
      const logger = new Logger();

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
        logger,
      });

      expect(executeShellCommand).toHaveBeenCalledWith({
        command: 'rails',
        args: expect.arrayContaining([
          'new',
          path.join(mockDir.path, 'intermediate', 'rails-project'),
        ]),
        logger,
      });
    });

    it('update the template path to correct location', async () => {
      const logger = new Logger();

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
        logger,
      });

      expect(executeShellCommand).toHaveBeenCalledWith({
        command: 'rails',
        args: expect.arrayContaining([
          'new',
          path.join(mockDir.path, 'intermediate', 'rails-project'),
          '--template',
          path.join(mockDir.path, './something.rb'),
        ]),
        logger,
      });
    });
  });

  describe('when nothing was generated', () => {
    it('throws an error', async () => {
      const logger = new Logger();

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
          logger,
        }),
      ).rejects.toThrow(/No data generated by rails/);
    });
  });
});
