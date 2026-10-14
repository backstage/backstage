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

import { runEngineServer } from './server';
import { getEngineConfig } from './engineConfig';

const mkdocsConfig = getEngineConfig('mkdocs');
import { run } from '@backstage/cli-common';

jest.mock('@backstage/cli-common', () => {
  return {
    run: jest.fn(),
  };
});

const mkdocs = (
  port = '8000',
  options: Parameters<typeof mkdocsConfig.serveArgs>[1] = {},
) => ({
  engineBinary: mkdocsConfig.binary,
  engineServeArgs: mkdocsConfig.serveArgs(port, options),
});

describe('runEngineServer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('docker', () => {
    it('should run docker directly by default', () => {
      runEngineServer(mkdocs('8000', { useDocker: true }));

      expect(run).toHaveBeenCalledWith(
        expect.arrayContaining([
          'docker',
          'run',
          `${process.cwd()}:/content`,
          '8000:8000',
          'serve',
          '--dev-addr',
          '0.0.0.0:8000',
          '--livereload',
          'spotify/techdocs',
        ]),
        expect.objectContaining({}),
      );
    });

    it('should accept port option', () => {
      runEngineServer({
        port: '5678',
        ...mkdocs('5678', { useDocker: true }),
      });
      expect(run).toHaveBeenCalledWith(
        expect.arrayContaining(['docker', '5678:5678', '0.0.0.0:5678']),
        expect.objectContaining({}),
      );
    });

    it('should accept custom docker image', () => {
      runEngineServer({
        dockerImage: 'my-org/techdocs',
        ...mkdocs('8000', { useDocker: true }),
      });
      expect(run).toHaveBeenCalledWith(
        expect.arrayContaining(['docker', 'my-org/techdocs']),
        expect.objectContaining({}),
      );
    });

    it('should accept custom docker options', () => {
      runEngineServer({
        dockerOptions: [
          '--add-host=internal.host:192.168.11.12',
          '--name',
          'my-techdocs-container',
        ],
        ...mkdocs('8000', { useDocker: true }),
      });

      expect(run).toHaveBeenCalledWith(
        [
          'docker',
          'run',
          '--rm',
          '-w',
          '/content',
          '-v',
          `${process.cwd()}:/content`,
          '-p',
          '8000:8000',
          '-it',
          '--add-host=internal.host:192.168.11.12',
          '--name',
          'my-techdocs-container',
          'spotify/techdocs',
          'serve',
          '--dev-addr',
          '0.0.0.0:8000',
          '--livereload',
        ],
        expect.objectContaining({}),
      );
    });

    it('should pass engine serve args through', () => {
      runEngineServer(
        mkdocs('8000', { useDocker: true, clean: true, strict: true }),
      );
      expect(run).toHaveBeenCalledWith(
        expect.arrayContaining(['docker', '--clean', '--strict']),
        expect.objectContaining({}),
      );
    });
  });

  describe('local', () => {
    it('should run the engine binary directly', () => {
      runEngineServer({ useDocker: false, ...mkdocs() });

      expect(run).toHaveBeenCalledWith(
        ['mkdocs', 'serve', '--dev-addr', '127.0.0.1:8000', '--livereload'],
        expect.objectContaining({}),
      );
    });

    it('should use a custom engine binary', () => {
      runEngineServer({
        useDocker: false,
        engineBinary: 'zensical',
        engineServeArgs: ['serve', '--dev-addr', '127.0.0.1:8000'],
      });
      expect(run).toHaveBeenCalledWith(
        ['zensical', 'serve', '--dev-addr', '127.0.0.1:8000'],
        expect.objectContaining({}),
      );
    });
  });
});
