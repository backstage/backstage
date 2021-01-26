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
import fs from 'fs-extra';
import os from 'os';
import { resolve as resolvePath } from 'path';
import Stream, { PassThrough } from 'stream';
import Docker from 'dockerode';
import mockFs from 'mock-fs';
import * as winston from 'winston';
import {
  runDockerContainer,
  getGeneratorKey,
  isValidRepoUrlForMkdocs,
  getRepoUrlFromLocationAnnotation,
  patchMkdocsYmlPreBuild,
} from './helpers';
import { RemoteProtocol } from '../prepare/types';
import { ParsedLocationAnnotation } from '../../helpers';

const mockEntity = {
  apiVersion: 'version',
  kind: 'TestKind',
  metadata: {
    name: 'testName',
  },
};

const mockDocker = new Docker() as jest.Mocked<Docker>;

const mkdocsYml = fs.readFileSync(
  resolvePath(__filename, '../__fixtures__/mkdocs.yml'),
);
const mkdocsYmlWithRepoUrl = fs.readFileSync(
  resolvePath(__filename, '../__fixtures__/mkdocs_with_repo_url.yml'),
);
const mockLogger = winston.createLogger();

describe('helpers', () => {
  describe('getGeneratorKey', () => {
    it('should return techdocs as the only generator key', () => {
      const key = getGeneratorKey(mockEntity);
      expect(key).toBe('techdocs');
    });
  });

  describe('runDockerContainer', () => {
    beforeEach(() => {
      jest.spyOn(mockDocker, 'pull').mockImplementation((async (
        _image: string,
        _something: any,
        handler: (err: Error | undefined, stream: PassThrough) => void,
      ) => {
        const mockStream = new PassThrough();
        handler(undefined, mockStream);
        mockStream.end();
      }) as any);

      jest
        .spyOn(mockDocker, 'run')
        .mockResolvedValue([{ Error: null, StatusCode: 0 }]);

      jest
        .spyOn(mockDocker, 'ping')
        .mockResolvedValue(Buffer.from('OK', 'utf-8'));
    });

    const imageName = 'spotify/techdocs';
    const args = ['build', '-d', '/result'];
    const docsDir = os.tmpdir();
    const outputDir = os.tmpdir();

    it('should pull the techdocs docker container', async () => {
      await runDockerContainer({
        imageName,
        args,
        docsDir,
        outputDir,
        dockerClient: mockDocker,
      });

      expect(mockDocker.pull).toHaveBeenCalledWith(
        imageName,
        {},
        expect.any(Function),
      );
    });

    it('should run the techdocs docker container', async () => {
      await runDockerContainer({
        imageName,
        args,
        docsDir,
        outputDir,
        dockerClient: mockDocker,
      });

      expect(mockDocker.run).toHaveBeenCalledWith(
        imageName,
        args,
        expect.any(Stream),
        {
          Volumes: {
            '/content': {},
            '/result': {},
          },
          WorkingDir: '/content',
          HostConfig: {
            Binds: [`${docsDir}:/content`, `${outputDir}:/result`],
          },
        },
      );
    });

    it('should ping docker to test availability', async () => {
      await runDockerContainer({
        imageName,
        args,
        docsDir,
        outputDir,
        dockerClient: mockDocker,
      });

      expect(mockDocker.ping).toHaveBeenCalled();
    });

    describe('where docker is unavailable', () => {
      const dockerError = 'a docker error';

      beforeEach(() => {
        jest.spyOn(mockDocker, 'ping').mockImplementationOnce(() => {
          throw new Error(dockerError);
        });
      });

      it('should throw with a descriptive error message including the docker error message', async () => {
        await expect(
          runDockerContainer({
            imageName,
            args,
            docsDir,
            outputDir,
            dockerClient: mockDocker,
          }),
        ).rejects.toThrow(new RegExp(`.+: ${dockerError}`));
      });
    });
  });

  describe('isValidRepoUrlForMkdocs', () => {
    it('should return true for valid repo_url values for mkdocs', () => {
      const validRepoUrls = [
        'https://github.com/org/repo',
        'https://github.com/backstage/backstage/',
        'https://github.com/org123/repo1-2-3/',
        'http://github.com/insecureOrg/insecureRepo',
        'https://gitlab.com/org/repo',
        'https://gitlab.com/backstage/backstage/',
        'https://gitlab.com/org123/repo1-2-3/',
        'http://gitlab.com/insecureOrg/insecureRepo',
      ];

      const validRemoteProtocols = ['github', 'gitlab'];

      validRepoUrls.forEach(url => {
        validRemoteProtocols.forEach(targetType => {
          expect(
            isValidRepoUrlForMkdocs(url, targetType as RemoteProtocol),
          ).toBe(true);
        });
      });
    });

    it('should return false for invalid repo_urls values for mkdocs', () => {
      const invalidRepoUrls = [
        'git@github.com:org/repo',
        'https://github.com/backstage/backstage/tree/master/plugins/techdocs-backend',
      ];

      invalidRepoUrls.forEach(url => {
        expect(isValidRepoUrlForMkdocs(url, 'github')).toBe(false);
      });
    });

    it('should return false for unsupported remote protocols', () => {
      const validRepoUrl = 'https://github.com/backstage/backstage';

      const unsupportedRemoteProtocols = ['dir', 'file', 'url'];

      unsupportedRemoteProtocols.forEach(targetType => {
        expect(
          isValidRepoUrlForMkdocs(validRepoUrl, targetType as RemoteProtocol),
        ).toBe(false);
      });
    });
  });

  describe('getRepoUrlFromLocationAnnotation', () => {
    it('should return undefined for unsupported location type', () => {
      const parsedLocationAnnotation1: ParsedLocationAnnotation = {
        type: 'dir',
        target: '/home/user/workspace/docs-repository',
      };

      const parsedLocationAnnotation2: ParsedLocationAnnotation = {
        type: 'file',
        target: '/home/user/workspace/docs-repository/catalog-info.yaml',
      };

      const parsedLocationAnnotation3: ParsedLocationAnnotation = {
        type: 'url',
        target: 'https://my-website.com/storage/this/docs/repository',
      };

      expect(getRepoUrlFromLocationAnnotation(parsedLocationAnnotation1)).toBe(
        undefined,
      );
      expect(getRepoUrlFromLocationAnnotation(parsedLocationAnnotation2)).toBe(
        undefined,
      );

      expect(getRepoUrlFromLocationAnnotation(parsedLocationAnnotation3)).toBe(
        undefined,
      );
    });

    it('should return correct target url for supported hosts', () => {
      const parsedLocationAnnotation1: ParsedLocationAnnotation = {
        type: 'github',
        target: 'https://github.com/backstage/backstage.git',
      };

      expect(getRepoUrlFromLocationAnnotation(parsedLocationAnnotation1)).toBe(
        'https://github.com/backstage/backstage',
      );

      const parsedLocationAnnotation2: ParsedLocationAnnotation = {
        type: 'github',
        target: 'https://github.com/org/repo',
      };

      expect(getRepoUrlFromLocationAnnotation(parsedLocationAnnotation2)).toBe(
        'https://github.com/org/repo',
      );

      const parsedLocationAnnotation3: ParsedLocationAnnotation = {
        type: 'gitlab',
        target: 'https://gitlab.com/org/repo',
      };

      expect(getRepoUrlFromLocationAnnotation(parsedLocationAnnotation3)).toBe(
        'https://gitlab.com/org/repo',
      );

      const parsedLocationAnnotation4: ParsedLocationAnnotation = {
        type: 'github',
        target:
          'github.com/backstage/backstage/blob/master/plugins/techdocs-backend/examples/documented-component',
      };

      expect(getRepoUrlFromLocationAnnotation(parsedLocationAnnotation4)).toBe(
        'github.com/backstage/backstage/blob/master/plugins/techdocs-backend/examples/documented-component',
      );
    });
  });

  describe('pathMkdocsPreBuild', () => {
    beforeEach(() => {
      mockFs({
        '/mkdocs.yml': mkdocsYml,
        '/mkdocs_with_repo_url.yml': mkdocsYmlWithRepoUrl,
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    it('should add repo_url to mkdocs.yml', async () => {
      const parsedLocationAnnotation: ParsedLocationAnnotation = {
        type: 'github',
        target: 'https://github.com/backstage/backstage',
      };

      await patchMkdocsYmlPreBuild(
        '/mkdocs.yml',
        mockLogger,
        parsedLocationAnnotation,
      );

      const updatedMkdocsYml = await fs.readFile('/mkdocs.yml');

      expect(updatedMkdocsYml.toString()).toContain(
        'repo_url: https://github.com/backstage/backstage',
      );
    });

    it('should not override existing repo_url in mkdocs.yml', async () => {
      const parsedLocationAnnotation: ParsedLocationAnnotation = {
        type: 'github',
        target: 'https://github.com/neworg/newrepo',
      };

      await patchMkdocsYmlPreBuild(
        '/mkdocs_with_repo_url.yml',
        mockLogger,
        parsedLocationAnnotation,
      );

      const updatedMkdocsYml = await fs.readFile('/mkdocs_with_repo_url.yml');

      expect(updatedMkdocsYml.toString()).toContain(
        'repo_url: https://github.com/backstage/backstage',
      );
      expect(updatedMkdocsYml.toString()).not.toContain(
        'repo_url: https://github.com/neworg/newrepo',
      );
    });
  });
});
