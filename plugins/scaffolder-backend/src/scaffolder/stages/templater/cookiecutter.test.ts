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
jest.mock('./helpers', () => ({
  runDockerContainer: jest.fn(),
  runCommand: jest.fn(),
}));
jest.mock('command-exists-promise', () => jest.fn());

import { CookieCutter } from './cookiecutter';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { RunDockerContainerOptions, RunCommandOptions } from './helpers';
import { PassThrough } from 'stream';
import Docker from 'dockerode';

const commandExists = require('command-exists-promise');

describe('CookieCutter Templater', () => {
  const cookie = new CookieCutter();
  const mockDocker = {} as Docker;
  const {
    runDockerContainer,
  }: {
    runDockerContainer: jest.Mock<RunDockerContainerOptions>;
  } = require('./helpers');

  jest
    .spyOn(fs, 'readdir')
    .mockImplementation(() => Promise.resolve(['newthing']));

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  const mkTemp = async () => {
    const tempDir = os.tmpdir();
    return await fs.promises.mkdtemp(path.join(tempDir, 'temp'));
  };

  it('should write a cookiecutter.json file with the values from the entity', async () => {
    const tempdir = await mkTemp();

    const values = {
      owner: 'blobby',
      storePath: 'backstage/end-repo',
      description: 'description',
      component_id: 'newthing',
    };

    await cookie.run({ directory: tempdir, values, dockerClient: mockDocker });

    const cookieCutterJson = await fs.readJSON(`${tempdir}/cookiecutter.json`);

    expect(cookieCutterJson).toEqual(expect.objectContaining(values));
  });

  it('should merge any value that is in the cookiecutter.json path already', async () => {
    const tempdir = await mkTemp();
    const existingJson = {
      _copy_without_render: ['./github/workflows/*'],
    };

    await fs.writeJSON(`${tempdir}/cookiecutter.json`, existingJson);

    const values = {
      owner: 'blobby',
      storePath: 'backstage/end-repo',
      component_id: 'something',
    };

    await cookie.run({ directory: tempdir, values, dockerClient: mockDocker });

    const cookieCutterJson = await fs.readJSON(`${tempdir}/cookiecutter.json`);

    expect(cookieCutterJson).toEqual({ ...existingJson, ...values });
  });

  it('should throw an error if the cookiecutter json is malformed and not missing', async () => {
    const tempdir = await mkTemp();

    await fs.writeFile(`${tempdir}/cookiecutter.json`, "{'");

    const values = {
      owner: 'blobby',
      storePath: 'backstage/end-repo',
    };

    await expect(
      cookie.run({ directory: tempdir, values, dockerClient: mockDocker }),
    ).rejects.toThrow(/Unexpected token ' in JSON at position 1/);
  });

  it('should run the correct docker container with the correct bindings for the volumes', async () => {
    const tempdir = await mkTemp();

    const values = {
      owner: 'blobby',
      storePath: 'backstage/end-repo',
      component_id: 'newthing',
    };

    await cookie.run({ directory: tempdir, values, dockerClient: mockDocker });

    expect(runDockerContainer).toHaveBeenCalledWith({
      imageName: 'spotify/backstage-cookiecutter',
      args: [
        'cookiecutter',
        '--no-input',
        '-o',
        '/result',
        '/template',
        '--verbose',
      ],
      templateDir: tempdir,
      resultDir: expect.stringContaining(`${tempdir}-result`),
      logStream: undefined,
      dockerClient: mockDocker,
    });
  });

  it('should return the result path to the end templated folder', async () => {
    const tempdir = await mkTemp();

    const values = {
      owner: 'blobby',
      storePath: 'backstage/end-repo',
      component_id: 'newthing',
    };

    const { resultDir } = await cookie.run({
      directory: tempdir,
      values,
      dockerClient: mockDocker,
    });

    expect(resultDir.startsWith(`${tempdir}-result`)).toBeTruthy();
  });

  it('should pass through the streamer to the run docker helper', async () => {
    const stream = new PassThrough();

    const tempdir = await mkTemp();

    const values = {
      owner: 'blobby',
      storePath: 'backstage/end-repo',
      component_id: 'newthing',
    };

    await cookie.run({
      directory: tempdir,
      values,
      logStream: stream,
      dockerClient: mockDocker,
    });

    expect(runDockerContainer).toHaveBeenCalledWith({
      imageName: 'spotify/backstage-cookiecutter',
      args: [
        'cookiecutter',
        '--no-input',
        '-o',
        '/result',
        '/template',
        '--verbose',
      ],
      templateDir: tempdir,
      resultDir: expect.stringContaining(`${tempdir}-result`),
      logStream: stream,
      dockerClient: mockDocker,
    });
  });

  describe('when cookiecutter is available', () => {
    beforeAll(() => {
      commandExists.mockImplementation(() => () => true);
    });

    it('use the binary', async () => {
      const {
        runCommand,
      }: {
        runCommand: jest.Mock<RunCommandOptions>;
      } = require('./helpers');

      const stream = new PassThrough();

      const tempdir = await mkTemp();

      const values = {
        owner: 'blobby',
        storePath: 'backstage/end-repo',
        component_id: 'newthing',
      };

      await cookie.run({
        directory: tempdir,
        values,
        logStream: stream,
        dockerClient: mockDocker,
      });

      expect(runCommand).toHaveBeenCalledWith({
        command: 'cookiecutter',
        args: expect.arrayContaining([
          '--no-input',
          '-o',
          tempdir,
          expect.stringContaining(`${tempdir}-result`),
          '--verbose',
        ]),
        logStream: stream,
      });
    });
  });

  describe('when nothing was generated', () => {
    beforeEach(() => {
      jest.spyOn(fs, 'readdir').mockImplementation(() => Promise.resolve([]));
    });

    it('throws an error', async () => {
      const stream = new PassThrough();

      const tempdir = await mkTemp();

      return expect(
        cookie.run({
          directory: tempdir,
          values: {
            owner: 'blobby',
            storePath: 'backstage/end-repo',
          },
          logStream: stream,
          dockerClient: mockDocker,
        }),
      ).rejects.toThrow(/Cookie Cutter did not generate anything/);
    });
  });
});
