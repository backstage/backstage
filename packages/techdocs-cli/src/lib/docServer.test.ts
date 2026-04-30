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

import { runDocServer } from './docServer';
import { run } from '@backstage/cli-common';

jest.mock('@backstage/cli-common', () => {
  return {
    run: jest.fn(),
  };
});

describe('runDocServer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('docker', () => {
    it('should run docker directly by default', () => {
      runDocServer({});

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
      runDocServer({ port: '5678' });
      expect(run).toHaveBeenCalledWith(
        expect.arrayContaining(['docker', '5678:5678', '0.0.0.0:5678']),
        expect.objectContaining({}),
      );
    });

    it('should accept custom docker image', () => {
      runDocServer({ dockerImage: 'my-org/techdocs' });
      expect(run).toHaveBeenCalledWith(
        expect.arrayContaining(['docker', 'my-org/techdocs']),
        expect.objectContaining({}),
      );
    });

    it('should accept custom docker options', () => {
      runDocServer({
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

    it('should accept additional CLI parameters', () => {
      runDocServer({
        parameterClean: true,
        parameterStrict: true,
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
      runDocServer({ useDocker: false });

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
      runDocServer({ useDocker: false, port: '5678' });
      expect(run).toHaveBeenCalledWith(
        expect.arrayContaining(['mkdocs', '127.0.0.1:5678']),
        expect.objectContaining({}),
      );
    });
  });

  describe('zensical', () => {
    it('should use zensical docker image when generator type is techdocs-zensical', () => {
      runDocServer({ generatorType: 'techdocs-zensical' });

      expect(run).toHaveBeenCalledWith(
        expect.arrayContaining([
          'docker',
          'spotify/techdocs-zensical:latest',
          'serve',
        ]),
        expect.objectContaining({}),
      );
    });

    it('should run zensical command locally when generator type is techdocs-zensical', () => {
      runDocServer({ useDocker: false, generatorType: 'techdocs-zensical' });

      expect(run).toHaveBeenCalledWith(
        expect.arrayContaining([
          'zensical',
          'serve',
          '--dev-addr',
          '127.0.0.1:8000',
        ]),
        expect.objectContaining({}),
      );
    });
  });
});
