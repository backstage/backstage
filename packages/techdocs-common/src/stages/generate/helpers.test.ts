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

import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import fs from 'fs-extra';
import mockFs from 'mock-fs';
import os from 'os';
import path, { resolve as resolvePath } from 'path';
import { ParsedLocationAnnotation } from '../../helpers';
import {
  addBuildTimestampMetadata,
  getGeneratorKey,
  getMkdocsYml,
  getRepoUrlFromLocationAnnotation,
  patchMkdocsYmlPreBuild,
  storeEtagMetadata,
  validateMkdocsYaml,
} from './helpers';

const mockEntity = {
  apiVersion: 'version',
  kind: 'TestKind',
  metadata: {
    name: 'testName',
  },
};

const mkdocsYml = fs.readFileSync(
  resolvePath(__filename, '../__fixtures__/mkdocs.yml'),
);
const mkdocsYmlWithExtensions = fs.readFileSync(
  resolvePath(__filename, '../__fixtures__/mkdocs_with_extensions.yml'),
);
const mkdocsYmlWithRepoUrl = fs.readFileSync(
  resolvePath(__filename, '../__fixtures__/mkdocs_with_repo_url.yml'),
);
const mkdocsYmlWithEditUri = fs.readFileSync(
  resolvePath(__filename, '../__fixtures__/mkdocs_with_edit_uri.yml'),
);
const mkdocsYmlWithValidDocDir = fs.readFileSync(
  resolvePath(__filename, '../__fixtures__/mkdocs_valid_doc_dir.yml'),
);
const mkdocsYmlWithInvalidDocDir = fs.readFileSync(
  resolvePath(__filename, '../__fixtures__/mkdocs_invalid_doc_dir.yml'),
);
const mkdocsYmlWithInvalidDocDir2 = fs.readFileSync(
  resolvePath(__filename, '../__fixtures__/mkdocs_invalid_doc_dir2.yml'),
);
const mockLogger = getVoidLogger();
const rootDir = os.platform() === 'win32' ? 'C:\\rootDir' : '/rootDir';

const scmIntegrations = ScmIntegrations.fromConfig(new ConfigReader({}));

describe('helpers', () => {
  describe('getGeneratorKey', () => {
    it('should return techdocs as the only generator key', () => {
      const key = getGeneratorKey(mockEntity);
      expect(key).toBe('techdocs');
    });
  });

  describe('getRepoUrlFromLocationAnnotation', () => {
    it.each`
      url                                                                        | repo_url                                    | edit_uri
      ${'https://github.com/backstage/backstage'}                                | ${'https://github.com/backstage/backstage'} | ${undefined}
      ${'https://github.com/backstage/backstage/tree/main/examples/techdocs/'}   | ${undefined}                                | ${'https://github.com/backstage/backstage/edit/main/examples/techdocs/docs'}
      ${'https://github.com/backstage/backstage/tree/main/'}                     | ${undefined}                                | ${'https://github.com/backstage/backstage/edit/main/docs'}
      ${'https://gitlab.com/backstage/backstage'}                                | ${'https://gitlab.com/backstage/backstage'} | ${undefined}
      ${'https://gitlab.com/backstage/backstage/-/blob/main/examples/techdocs/'} | ${undefined}                                | ${'https://gitlab.com/backstage/backstage/-/edit/main/examples/techdocs/docs'}
      ${'https://gitlab.com/backstage/backstage/-/blob/main/'}                   | ${undefined}                                | ${'https://gitlab.com/backstage/backstage/-/edit/main/docs'}
    `('should convert $url', ({ url: target, repo_url, edit_uri }) => {
      const parsedLocationAnnotation: ParsedLocationAnnotation = {
        type: 'url',
        target,
      };

      expect(
        getRepoUrlFromLocationAnnotation(
          parsedLocationAnnotation,
          scmIntegrations,
        ),
      ).toEqual({ repo_url, edit_uri });
    });

    it.each`
      url                                                                        | edit_uri
      ${'https://github.com/backstage/backstage/tree/main/examples/techdocs/'}   | ${'https://github.com/backstage/backstage/edit/main/examples/techdocs/custom/folder'}
      ${'https://github.com/backstage/backstage/tree/main/'}                     | ${'https://github.com/backstage/backstage/edit/main/custom/folder'}
      ${'https://gitlab.com/backstage/backstage/-/blob/main/examples/techdocs/'} | ${'https://gitlab.com/backstage/backstage/-/edit/main/examples/techdocs/custom/folder'}
      ${'https://gitlab.com/backstage/backstage/-/blob/main/'}                   | ${'https://gitlab.com/backstage/backstage/-/edit/main/custom/folder'}
    `(
      'should convert $url with custom docsFolder',
      ({ url: target, edit_uri }) => {
        const parsedLocationAnnotation: ParsedLocationAnnotation = {
          type: 'url',
          target,
        };

        expect(
          getRepoUrlFromLocationAnnotation(
            parsedLocationAnnotation,
            scmIntegrations,
            './custom/folder',
          ),
        ).toEqual({ edit_uri });
      },
    );

    it.each`
      url
      ${'https://bitbucket.org/backstage/backstage/src/master/examples/techdocs/'}
      ${'https://bitbucket.org/backstage/backstage/src/master/'}
      ${'https://dev.azure.com/organization/project/_git/repository?path=%2Fexamples%2Ftechdocs'}
      ${'https://dev.azure.com/organization/project/_git/repository?path=%2F'}
    `('should ignore $url', ({ url: target }) => {
      const parsedLocationAnnotation: ParsedLocationAnnotation = {
        type: 'url',
        target,
      };

      expect(
        getRepoUrlFromLocationAnnotation(
          parsedLocationAnnotation,
          scmIntegrations,
        ),
      ).toEqual({});
    });

    it('should ignore unsupported location type', () => {
      const parsedLocationAnnotation: ParsedLocationAnnotation = {
        type: 'dir',
        target: '/home/user/workspace/docs-repository',
      };

      expect(
        getRepoUrlFromLocationAnnotation(
          parsedLocationAnnotation,
          scmIntegrations,
        ),
      ).toEqual({});
    });
  });

  describe('patchMkdocsYmlPreBuild', () => {
    beforeEach(() => {
      mockFs({
        '/mkdocs.yml': mkdocsYml,
        '/mkdocs_with_repo_url.yml': mkdocsYmlWithRepoUrl,
        '/mkdocs_with_edit_uri.yml': mkdocsYmlWithEditUri,
        '/mkdocs_with_extensions.yml': mkdocsYmlWithExtensions,
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    it('should add edit_uri to mkdocs.yml', async () => {
      const parsedLocationAnnotation: ParsedLocationAnnotation = {
        type: 'url',
        target: 'https://github.com/backstage/backstage',
      };

      await patchMkdocsYmlPreBuild(
        '/mkdocs.yml',
        mockLogger,
        parsedLocationAnnotation,
        scmIntegrations,
      );

      const updatedMkdocsYml = await fs.readFile('/mkdocs.yml');

      expect(updatedMkdocsYml.toString()).toContain(
        'repo_url: https://github.com/backstage/backstage',
      );
    });

    it('should add repo_url to mkdocs.yml that contains custom yaml tags', async () => {
      const parsedLocationAnnotation: ParsedLocationAnnotation = {
        type: 'url',
        target: 'https://github.com/backstage/backstage',
      };

      await patchMkdocsYmlPreBuild(
        '/mkdocs_with_extensions.yml',
        mockLogger,
        parsedLocationAnnotation,
        scmIntegrations,
      );

      const updatedMkdocsYml = await fs.readFile('/mkdocs_with_extensions.yml');

      expect(updatedMkdocsYml.toString()).toContain(
        'repo_url: https://github.com/backstage/backstage',
      );
      expect(updatedMkdocsYml.toString()).toContain(
        "emoji_index: !!python/name:materialx.emoji.twemoji ''",
      );
    });

    it('should not override existing repo_url in mkdocs.yml', async () => {
      const parsedLocationAnnotation: ParsedLocationAnnotation = {
        type: 'url',
        target: 'https://github.com/neworg/newrepo',
      };

      await patchMkdocsYmlPreBuild(
        '/mkdocs_with_repo_url.yml',
        mockLogger,
        parsedLocationAnnotation,
        scmIntegrations,
      );

      const updatedMkdocsYml = await fs.readFile('/mkdocs_with_repo_url.yml');

      expect(updatedMkdocsYml.toString()).toContain(
        'repo_url: https://github.com/backstage/backstage',
      );
      expect(updatedMkdocsYml.toString()).not.toContain(
        'repo_url: https://github.com/neworg/newrepo',
      );
    });

    it('should not override existing edit_uri in mkdocs.yml', async () => {
      const parsedLocationAnnotation: ParsedLocationAnnotation = {
        type: 'url',
        target: 'https://github.com/neworg/newrepo',
      };

      await patchMkdocsYmlPreBuild(
        '/mkdocs_with_edit_uri.yml',
        mockLogger,
        parsedLocationAnnotation,
        scmIntegrations,
      );

      const updatedMkdocsYml = await fs.readFile('/mkdocs_with_edit_uri.yml');

      expect(updatedMkdocsYml.toString()).toContain(
        'edit_uri: https://github.com/backstage/backstage/edit/main/docs',
      );
      expect(updatedMkdocsYml.toString()).not.toContain(
        'https://github.com/neworg/newrepo',
      );
    });
  });

  describe('addBuildTimestampMetadata', () => {
    beforeEach(() => {
      mockFs.restore();
      mockFs({
        [rootDir]: {
          'invalid_techdocs_metadata.json': 'dsds',
          'techdocs_metadata.json': '{"site_name": "Tech Docs"}',
        },
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    it('should create the file if it does not exist', async () => {
      const filePath = path.join(rootDir, 'wrong_techdocs_metadata.json');
      await addBuildTimestampMetadata(filePath, mockLogger);

      // Check if the file exists
      await expect(
        fs.access(filePath, fs.constants.F_OK),
      ).resolves.not.toThrowError();
    });

    it('should throw error when the JSON is invalid', async () => {
      const filePath = path.join(rootDir, 'invalid_techdocs_metadata.json');

      await expect(
        addBuildTimestampMetadata(filePath, mockLogger),
      ).rejects.toThrowError('Unexpected token d in JSON at position 0');
    });

    it('should add build timestamp to the metadata json', async () => {
      const filePath = path.join(rootDir, 'techdocs_metadata.json');

      await addBuildTimestampMetadata(filePath, mockLogger);

      const json = await fs.readJson(filePath);
      expect(json.build_timestamp).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('storeEtagMetadata', () => {
    beforeEach(() => {
      mockFs.restore();
      mockFs({
        [rootDir]: {
          'invalid_techdocs_metadata.json': 'dsds',
          'techdocs_metadata.json': '{"site_name": "Tech Docs"}',
        },
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    it('should throw error when the JSON is invalid', async () => {
      const filePath = path.join(rootDir, 'invalid_techdocs_metadata.json');

      await expect(
        storeEtagMetadata(filePath, 'etag123abc'),
      ).rejects.toThrowError('Unexpected token d in JSON at position 0');
    });

    it('should add etag to the metadata json', async () => {
      const filePath = path.join(rootDir, 'techdocs_metadata.json');

      await storeEtagMetadata(filePath, 'etag123abc');

      const json = await fs.readJson(filePath);
      expect(json.etag).toBe('etag123abc');
    });
  });

  describe('getMkdocsYml', () => {
    afterEach(() => {
      mockFs.restore();
    });

    const inputDir = resolvePath(__filename, '../__fixtures__/');

    it('returns expected contents when .yml file is present', async () => {
      const key = path.join(inputDir, 'mkdocs.yml');
      mockFs({ [key]: mkdocsYml });
      const { path: mkdocsPath, content } = await getMkdocsYml(inputDir);

      expect(mkdocsPath).toBe(key);
      expect(content).toBe(mkdocsYml.toString());
    });

    it('returns expected contents when .yaml file is present', async () => {
      const key = path.join(inputDir, 'mkdocs.yaml');
      mockFs({ [key]: mkdocsYml });
      const { path: mkdocsPath, content } = await getMkdocsYml(inputDir);
      expect(mkdocsPath).toBe(key);
      expect(content).toBe(mkdocsYml.toString());
    });

    it('throws when neither .yml nor .yaml file is present', async () => {
      const invalidInputDir = resolvePath(__filename);
      await expect(getMkdocsYml(invalidInputDir)).rejects.toThrowError(
        /Could not read MkDocs YAML config file mkdocs.yml or mkdocs.yaml for validation/,
      );
    });
  });

  describe('validateMkdocsYaml', () => {
    const inputDir = resolvePath(__filename, '../__fixtures__/');

    it('should return true on when no docs_dir present', async () => {
      await expect(
        validateMkdocsYaml(inputDir, mkdocsYml.toString()),
      ).resolves.toBeUndefined();
    });

    it('should return true on when a valid docs_dir is present', async () => {
      await expect(
        validateMkdocsYaml(inputDir, mkdocsYmlWithValidDocDir.toString()),
      ).resolves.toBeUndefined();
    });

    it('should return false on absolute doc_dir path', async () => {
      await expect(
        validateMkdocsYaml(inputDir, mkdocsYmlWithInvalidDocDir.toString()),
      ).rejects.toThrow();
    });

    it('should return false on doc_dir path that traverses directory structure backwards', async () => {
      await expect(
        validateMkdocsYaml(inputDir, mkdocsYmlWithInvalidDocDir2.toString()),
      ).rejects.toThrow();
    });

    it('should validate files with custom yaml tags', async () => {
      await expect(
        validateMkdocsYaml(inputDir, mkdocsYmlWithExtensions.toString()),
      ).resolves.toBeUndefined();
    });
  });
});
