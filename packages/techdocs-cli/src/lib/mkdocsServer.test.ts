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

import { runMkdocsServer } from './mkdocsServer';
import { run } from '@backstage/cli-common';

jest.mock('@backstage/cli-common', () => {
  return {
    run: jest.fn(),
  };
});

describe('runMkdocsServer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('docker', () => {
    it('should run docker directly by default', () => {
      runMkdocsServer({});

      expect(run).toHaveBeenCalledWith(
        expect.arrayContaining([
          'docker',
          'run',
          `${process.cwd()}:/content`,
          '8000:8000',
          'serve',
          '--dev-addr',
          '0.0.0.0:8000',
          'spotify/techdocs',
        ]),
        expect.objectContaining({}),
      );
    });

    it('should accept port option', () => {
      runMkdocsServer({ port: '5678' });
      expect(run).toHaveBeenCalledWith(
        expect.arrayContaining(['docker', '5678:5678', '0.0.0.0:5678']),
        expect.objectContaining({}),
      );
    });

    it('should accept custom docker image', () => {
      runMkdocsServer({ dockerImage: 'my-org/techdocs' });
      expect(run).toHaveBeenCalledWith(
        expect.arrayContaining(['docker', 'my-org/techdocs']),
        expect.objectContaining({}),
      );
    });

    it('should accept custom docker options', () => {
      runMkdocsServer({
        dockerOptions: [
          '--add-host=internal.host:192.168.11.12',
          '--name',
          'my-techdocs-container',
        ],
      });

      expect(run).toHaveBeenCalledWith(
        expect.arrayContaining([
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
        ]),
        expect.objectContaining({}),
      );
    });

    it('should accept additinoal mkdocs CLI parameters', () => {
      runMkdocsServer({
        mkdocsParameterClean: true,
        mkdocsParameterStrict: true,
      });
      expect(run).toHaveBeenCalledWith(
        expect.arrayContaining([
          'docker',
          'serve',
          '--dev-addr',
          '0.0.0.0:8000',
          '--clean',
          '--strict',
        ]),
        expect.objectContaining({}),
      );
    });
  });

  describe('mkdocs', () => {
    it('should run mkdocs if specified', () => {
      runMkdocsServer({ useDocker: false });

      expect(run).toHaveBeenCalledWith(
        expect.arrayContaining([
          'mkdocs',
          'serve',
          '--dev-addr',
          '127.0.0.1:8000',
        ]),
        expect.objectContaining({}),
      );
    });

    it('should accept port option', () => {
      runMkdocsServer({ useDocker: false, port: '5678' });
      expect(run).toHaveBeenCalledWith(
        expect.arrayContaining(['mkdocs', '127.0.0.1:5678']),
        expect.objectContaining({}),
      );
    });
  });
});
