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

import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import {
  createMockDirectory,
  mockServices,
} from '@backstage/backend-test-utils';
import fs from 'fs-extra';
import path, { resolve as resolvePath } from 'node:path';
import { ParsedLocationAnnotation } from '../../helpers';
import {
  createOrUpdateEntityMetadata,
  createOrUpdateMetadata,
  getGeneratorKey,
  getMkdocsYml,
  getRepoUrlFromLocationAnnotation,
  patchIndexPreBuild,
  storeEtagMetadata,
  validateDocsDirectory,
  validateMkdocsYaml,
} from './helpers';
import {
  patchMkdocsYmlPreBuild,
  patchMkdocsYmlWithPlugins,
  sanitizeMkdocsYml,
} from './mkdocsPatchers';
import yaml from 'js-yaml';

const mockEntity = {
  apiVersion: 'version',
  kind: 'TestKind',
  metadata: {
    name: 'testName',
    title: 'Test site name',
  },
};

const mkdocsYml = fs.readFileSync(
  resolvePath(__filename, '../__fixtures__/mkdocs.yml'),
);
const mkdocsDefaultYml = fs.readFileSync(
  resolvePath(__filename, '../__fixtures__/mkdocs_default.yml'),
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
const mkdocsYmlWithComments = fs.readFileSync(
  resolvePath(__filename, '../__fixtures__/mkdocs_with_comments.yml'),
);
const mkdocsYmlWithTechdocsPlugins = fs.readFileSync(
  resolvePath(__filename, '../__fixtures__/mkdocs_with_techdocs_plugin.yml'),
);
const mkdocsYmlWithoutPlugins = fs.readFileSync(
  resolvePath(__filename, '../__fixtures__/mkdocs_without_plugins.yml'),
);
const mkdocsYmlWithAdditionalPlugins = fs.readFileSync(
  resolvePath(__filename, '../__fixtures__/mkdocs_with_additional_plugins.yml'),
);
const mkdocsYmlWithAdditionalPluginsWithConfig = fs.readFileSync(
  resolvePath(
    __filename,
    '../__fixtures__/mkdocs_with_additional_plugins_with_config.yml',
  ),
);
const mkdocsYmlWithEnvTag = fs.readFileSync(
  resolvePath(__filename, '../__fixtures__/mkdocs_with_env_tag.yml'),
);
const mkdocsYmlWithHooks = fs.readFileSync(
  resolvePath(__filename, '../__fixtures__/mkdocs_with_hooks.yml'),
);
const mkdocsYmlWithMergeKeyHooks = fs.readFileSync(
  resolvePath(__filename, '../__fixtures__/mkdocs_with_merge_key_hooks.yml'),
);
const mkdocsYmlWithParserDifferentialHooks = fs.readFileSync(
  resolvePath(
    __filename,
    '../__fixtures__/mkdocs_with_parser_differential_hooks.yml',
  ),
);
const mkdocsYmlWithDuplicateMergeHooks = fs.readFileSync(
  resolvePath(
    __filename,
    '../__fixtures__/mkdocs_with_duplicate_merge_hooks.yml',
  ),
);
const mockLogger = mockServices.logger.mock();
const warn = jest.spyOn(mockLogger, 'warn');

const scmIntegrations = ScmIntegrations.fromConfig(new ConfigReader({}));

describe('helpers', () => {
  const mockDir = createMockDirectory();

  afterEach(mockDir.clear);

  describe('getGeneratorKey', () => {
    it('should return techdocs as the only generator key', () => {
      const key = getGeneratorKey(mockEntity);
      expect(key).toBe('techdocs');
    });
  });

  describe('getRepoUrlFromLocationAnnotation', () => {
    it.each`
      url                                                                        | repo_url                                                                   | edit_uri
      ${'https://github.com/backstage/backstage'}                                | ${'https://github.com/backstage/backstage'}                                | ${undefined}
      ${'https://github.com/backstage/backstage/tree/main/examples/techdocs/'}   | ${'https://github.com/backstage/backstage/tree/main/examples/techdocs/'}   | ${'https://github.com/backstage/backstage/edit/main/examples/techdocs/docs'}
      ${'https://github.com/backstage/backstage/tree/main/examples/techdocs'}    | ${'https://github.com/backstage/backstage/tree/main/examples/techdocs'}    | ${'https://github.com/backstage/backstage/edit/main/examples/techdocs/docs'}
      ${'https://github.com/backstage/backstage/tree/main/'}                     | ${'https://github.com/backstage/backstage/tree/main/'}                     | ${'https://github.com/backstage/backstage/edit/main/docs'}
      ${'https://gitlab.com/backstage/backstage'}                                | ${'https://gitlab.com/backstage/backstage'}                                | ${undefined}
      ${'https://gitlab.com/backstage/backstage/-/blob/main/examples/techdocs/'} | ${'https://gitlab.com/backstage/backstage/-/blob/main/examples/techdocs/'} | ${'https://gitlab.com/backstage/backstage/-/edit/main/examples/techdocs/docs'}
      ${'https://gitlab.com/backstage/backstage/-/blob/main/'}                   | ${'https://gitlab.com/backstage/backstage/-/blob/main/'}                   | ${'https://gitlab.com/backstage/backstage/-/edit/main/docs'}
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
      url                                                                        | repo_url                                                                   | edit_uri
      ${'https://github.com/backstage/backstage/tree/main/examples/techdocs/'}   | ${'https://github.com/backstage/backstage/tree/main/examples/techdocs/'}   | ${'https://github.com/backstage/backstage/edit/main/examples/techdocs/custom/folder'}
      ${'https://github.com/backstage/backstage/tree/main/'}                     | ${'https://github.com/backstage/backstage/tree/main/'}                     | ${'https://github.com/backstage/backstage/edit/main/custom/folder'}
      ${'https://gitlab.com/backstage/backstage/-/blob/main/examples/techdocs/'} | ${'https://gitlab.com/backstage/backstage/-/blob/main/examples/techdocs/'} | ${'https://gitlab.com/backstage/backstage/-/edit/main/examples/techdocs/custom/folder'}
      ${'https://gitlab.com/backstage/backstage/-/blob/main/'}                   | ${'https://gitlab.com/backstage/backstage/-/blob/main/'}                   | ${'https://gitlab.com/backstage/backstage/-/edit/main/custom/folder'}
    `(
      'should convert $url with custom docsFolder',
      ({ url: target, repo_url, edit_uri }) => {
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
        ).toEqual({ repo_url, edit_uri });
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
      mockDir.setContent({
        'mkdocs.yml': mkdocsYml,
        'mkdocs_default.yml': mkdocsDefaultYml,
        'mkdocs_with_repo_url.yml': mkdocsYmlWithRepoUrl,
        'mkdocs_with_edit_uri.yml': mkdocsYmlWithEditUri,
        'mkdocs_with_extensions.yml': mkdocsYmlWithExtensions,
        'mkdocs_with_comments.yml': mkdocsYmlWithComments,
      });
    });

    it('should add edit_uri to mkdocs.yml', async () => {
      const parsedLocationAnnotation: ParsedLocationAnnotation = {
        type: 'url',
        target: 'https://github.com/backstage/backstage',
      };

      await patchMkdocsYmlPreBuild(
        mockDir.resolve('mkdocs.yml'),
        mockLogger,
        parsedLocationAnnotation,
        scmIntegrations,
      );

      const updatedMkdocsYml = await fs.readFile(mockDir.resolve('mkdocs.yml'));

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
        mockDir.resolve('mkdocs_with_extensions.yml'),
        mockLogger,
        parsedLocationAnnotation,
        scmIntegrations,
      );

      const updatedMkdocsYml = await fs.readFile(
        mockDir.resolve('mkdocs_with_extensions.yml'),
      );

      expect(updatedMkdocsYml.toString()).toContain(
        'repo_url: https://github.com/backstage/backstage',
      );
      expect(updatedMkdocsYml.toString()).toContain(
        "emoji_index: !!python/name:materialx.emoji.twemoji ''",
      );
      expect(updatedMkdocsYml.toString()).toContain(
        'slugify: !!python/object/apply:pymdownx.slugs.slugify',
      );
      expect(updatedMkdocsYml.toString()).toContain('case: lower');
    });

    it('should not override existing repo_url in mkdocs.yml', async () => {
      const parsedLocationAnnotation: ParsedLocationAnnotation = {
        type: 'url',
        target: 'https://github.com/neworg/newrepo',
      };

      await patchMkdocsYmlPreBuild(
        mockDir.resolve('mkdocs_with_repo_url.yml'),
        mockLogger,
        parsedLocationAnnotation,
        scmIntegrations,
      );

      const updatedMkdocsYml = await fs.readFile(
        mockDir.resolve('mkdocs_with_repo_url.yml'),
      );

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
        mockDir.resolve('mkdocs_with_edit_uri.yml'),
        mockLogger,
        parsedLocationAnnotation,
        scmIntegrations,
      );

      const updatedMkdocsYml = await fs.readFile(
        mockDir.resolve('mkdocs_with_edit_uri.yml'),
      );

      expect(updatedMkdocsYml.toString()).toContain(
        'edit_uri: https://github.com/backstage/backstage/edit/main/docs',
      );
      expect(updatedMkdocsYml.toString()).not.toContain(
        'edit_uri: https://github.com/neworg/newrepo',
      );
    });

    it('should add edit_uri to mkdocs.yml with existing repo_url', async () => {
      const parsedLocationAnnotation: ParsedLocationAnnotation = {
        type: 'url',
        target: 'https://github.com/neworg/newrepo/tree/main/',
      };

      await patchMkdocsYmlPreBuild(
        mockDir.resolve('mkdocs_with_repo_url.yml'),
        mockLogger,
        parsedLocationAnnotation,
        scmIntegrations,
      );

      const updatedMkdocsYml = await fs.readFile(
        mockDir.resolve('mkdocs_with_repo_url.yml'),
      );

      expect(updatedMkdocsYml.toString()).toContain(
        'edit_uri: https://github.com/neworg/newrepo/edit/main/docs',
      );
      expect(updatedMkdocsYml.toString()).toContain(
        'repo_url: https://github.com/backstage/backstage',
      );
    });

    it('should not update mkdocs.yml if nothing should be changed', async () => {
      const parsedLocationAnnotation: ParsedLocationAnnotation = {
        type: 'dir',
        target: '/unsupported/path',
      };

      await patchMkdocsYmlPreBuild(
        mockDir.resolve('mkdocs_with_comments.yml'),
        mockLogger,
        parsedLocationAnnotation,
        scmIntegrations,
      );

      const updatedMkdocsYml = await fs.readFile(
        mockDir.resolve('mkdocs_with_comments.yml'),
      );

      expect(updatedMkdocsYml.toString()).toContain(
        '# This is a comment that is removed after editing',
      );
      expect(updatedMkdocsYml.toString()).not.toContain('edit_uri');
      expect(updatedMkdocsYml.toString()).not.toContain('repo_url');
    });
  });

  describe('patchMkdocsYmlWithPlugins', () => {
    beforeEach(() => {
      mockDir.setContent({
        'mkdocs_with_techdocs_plugin.yml': mkdocsYmlWithTechdocsPlugins,
        'mkdocs_without_plugins.yml': mkdocsYmlWithoutPlugins,
        'mkdocs_with_additional_plugins.yml': mkdocsYmlWithAdditionalPlugins,
        'mkdocs_with_additional_plugins_with_config.yml':
          mkdocsYmlWithAdditionalPluginsWithConfig,
      });
    });
    it('should not add additional plugins if techdocs exists already in mkdocs file', async () => {
      await patchMkdocsYmlWithPlugins(
        mockDir.resolve('mkdocs_with_techdocs_plugin.yml'),
        mockLogger,
      );

      const updatedMkdocsYml = await fs.readFile(
        mockDir.resolve('mkdocs_with_techdocs_plugin.yml'),
      );
      const parsedYml = yaml.load(updatedMkdocsYml.toString()) as {
        plugins: string[];
      };
      expect(parsedYml.plugins).toHaveLength(1);
      expect(parsedYml.plugins).toContain('techdocs-core');
    });
    it("should add the needed plugin if it doesn't exist in mkdocs file", async () => {
      await patchMkdocsYmlWithPlugins(
        mockDir.resolve('mkdocs_without_plugins.yml'),
        mockLogger,
      );

      const updatedMkdocsYml = await fs.readFile(
        mockDir.resolve('mkdocs_without_plugins.yml'),
      );
      const parsedYml = yaml.load(updatedMkdocsYml.toString()) as {
        plugins: string[];
      };
      expect(parsedYml.plugins).toHaveLength(1);
      expect(parsedYml.plugins).toContain('techdocs-core');
    });
    it('should not override existing plugins', async () => {
      await patchMkdocsYmlWithPlugins(
        mockDir.resolve('mkdocs_with_additional_plugins.yml'),
        mockLogger,
      );
      const updatedMkdocsYml = await fs.readFile(
        mockDir.resolve('mkdocs_with_additional_plugins.yml'),
      );
      const parsedYml = yaml.load(updatedMkdocsYml.toString()) as {
        plugins: string[];
      };
      expect(parsedYml.plugins).toHaveLength(3);
      expect(parsedYml.plugins).toContain('techdocs-core');
      expect(parsedYml.plugins).toContain('not-techdocs-core');
      expect(parsedYml.plugins).toContain('also-not-techdocs-core');
    });
    it('should add all provided default plugins', async () => {
      await patchMkdocsYmlWithPlugins(
        mockDir.resolve('mkdocs_with_additional_plugins.yml'),
        mockLogger,
        ['techdocs-core', 'custom-plugin'],
      );

      const updatedMkdocsYml = await fs.readFile(
        mockDir.resolve('mkdocs_with_additional_plugins.yml'),
      );
      const parsedYml = yaml.load(updatedMkdocsYml.toString()) as {
        plugins: string[];
      };
      expect(parsedYml.plugins).toHaveLength(4);
      expect(parsedYml.plugins).toContain('techdocs-core');
      expect(parsedYml.plugins).toContain('custom-plugin');
    });
    it('should not overwrite config when defaults are added', async () => {
      await patchMkdocsYmlWithPlugins(
        mockDir.resolve('mkdocs_with_additional_plugins_with_config.yml'),
        mockLogger,
        ['techdocs-core', 'custom-plugin'],
      );

      const updatedMkdocsYml = await fs.readFile(
        mockDir.resolve('mkdocs_with_additional_plugins_with_config.yml'),
      );
      const parsedYml = yaml.load(updatedMkdocsYml.toString()) as {
        plugins: object[];
      };
      expect(parsedYml.plugins).toHaveLength(4);
      expect(parsedYml.plugins).toContain('techdocs-core');
      expect(parsedYml.plugins).not.toContain('custom-plugin');
      expect(parsedYml.plugins).toContainEqual({
        'custom-plugin': { with: { configuration: 1 } },
      });
    });
  });

  describe('patchIndexPreBuild', () => {
    afterEach(() => {
      warn.mockClear();
    });
    it('should have no effect if docs/index.md exists', async () => {
      mockDir.setContent({
        'docs/index.md': 'index.md content',
        'docs/README.md': 'docs/README.md content',
      });

      await patchIndexPreBuild({ inputDir: mockDir.path, logger: mockLogger });

      await expect(
        fs.readFile(mockDir.resolve('docs/index.md'), 'utf-8'),
      ).resolves.toEqual('index.md content');
      expect(warn).not.toHaveBeenCalledWith();
    });

    it("should use docs/README.md if docs/index.md doesn't exists", async () => {
      mockDir.setContent({
        'docs/README.md': 'docs/README.md content',
        'README.md': 'main README.md content',
      });

      await patchIndexPreBuild({ inputDir: mockDir.path, logger: mockLogger });

      await expect(
        fs.readFile(mockDir.resolve('docs/index.md'), 'utf-8'),
      ).resolves.toEqual('docs/README.md content');
      expect(warn.mock.calls).toEqual([
        [`${path.normalize('docs/index.md')} not found.`],
      ]);
    });

    it('should use README.md if neither docs/index.md or docs/README.md exist', async () => {
      mockDir.setContent({
        'README.md': 'main README.md content',
      });

      await patchIndexPreBuild({ inputDir: mockDir.path, logger: mockLogger });

      await expect(
        fs.readFile(mockDir.resolve('docs/index.md'), 'utf-8'),
      ).resolves.toEqual('main README.md content');
      expect(warn.mock.calls).toEqual([
        [`${path.normalize('docs/index.md')} not found.`],
        [`${path.normalize('docs/README.md')} not found.`],
        [`${path.normalize('docs/readme.md')} not found.`],
      ]);
    });

    it('should not use any file as index.md if no one matches the requirements', async () => {
      mockDir.setContent({});

      await patchIndexPreBuild({ inputDir: mockDir.path, logger: mockLogger });

      await expect(
        fs.readFile(mockDir.resolve('docs/index.md'), 'utf-8'),
      ).rejects.toThrow();
      const paths = [
        path.normalize('docs/index.md'),
        path.normalize('docs/README.md'),
        path.normalize('docs/readme.md'),
        'README.md',
        'readme.md',
      ];
      expect(warn.mock.calls).toEqual([
        ...paths.map(p => [`${p} not found.`]),
        [
          `Could not find any techdocs' index file. Please make sure at least one of ${paths
            .map(p => mockDir.resolve(p))
            .join(' ')} exists.`,
        ],
      ]);
    });
  });

  describe('addBuildTimestampMetadata', () => {
    const mockFiles = {
      'invalid_techdocs_metadata.json': 'dsds',
      'techdocs_metadata.json': '{"site_name": "Tech Docs"}',
    };

    beforeEach(() => {
      mockDir.setContent(mockFiles);
    });

    it('should create the file if it does not exist', async () => {
      const filePath = mockDir.resolve('wrong_techdocs_metadata.json');
      await createOrUpdateMetadata(filePath, mockLogger);

      // Check if the file exists
      await expect(
        fs.access(filePath, fs.constants.F_OK),
      ).resolves.not.toThrow();
    });

    it('should throw error when the JSON is invalid', async () => {
      const filePath = mockDir.resolve('invalid_techdocs_metadata.json');

      await expect(
        createOrUpdateMetadata(filePath, mockLogger),
      ).rejects.toThrow('Unexpected token');
    });

    it('should add build timestamp to the metadata json', async () => {
      const filePath = mockDir.resolve('techdocs_metadata.json');

      await createOrUpdateMetadata(filePath, mockLogger);

      const json = await fs.readJson(filePath);
      expect(json.build_timestamp).toBeLessThanOrEqual(Date.now());
    });

    it('should add list of files to the metadata json', async () => {
      const filePath = mockDir.resolve('techdocs_metadata.json');

      await createOrUpdateMetadata(filePath, mockLogger);

      const json = await fs.readJson(filePath);
      expect(json.files).toEqual(
        expect.arrayContaining(Object.keys(mockFiles)),
      );
    });
  });

  describe('storeEtagMetadata', () => {
    beforeEach(() => {
      mockDir.setContent({
        'invalid_techdocs_metadata.json': 'dsds',
        'techdocs_metadata.json': '{"site_name": "Tech Docs"}',
      });
    });

    it('should throw error when the JSON is invalid', async () => {
      const filePath = mockDir.resolve('invalid_techdocs_metadata.json');

      await expect(storeEtagMetadata(filePath, 'etag123abc')).rejects.toThrow(
        'Unexpected token',
      );
    });

    it('should add etag to the metadata json', async () => {
      const filePath = mockDir.resolve('techdocs_metadata.json');

      await storeEtagMetadata(filePath, 'etag123abc');

      const json = await fs.readJson(filePath);
      expect(json.etag).toBe('etag123abc');
    });
  });

  describe('createOrUpdateEntityMetadata', () => {
    const mockFiles = {
      'invalid_entity_metadata.json': 'dsds',
      'entity_metadata.json': '{"site_name": "Entity Docs"}',
      'catalog.yaml': 'site_name: Catalog Docs',
    };

    beforeEach(() => {
      mockFs({
        [rootDir]: mockFiles,
      });
    });

    it('should create the file if it does not exist', async () => {
      const filePath = path.join(rootDir, 'wrong_entity_metadata.json');
      await createOrUpdateEntityMetadata(
        path.join(rootDir, 'catalog.yaml'),
        filePath,
        mockLogger,
      );

      // Check if the file exists
      await expect(
        fs.access(filePath, fs.constants.F_OK),
      ).resolves.not.toThrow();
    });

    it('should throw error when the JSON is invalid', async () => {
      const filePath = path.join(rootDir, 'invalid_entity_metadata.json');

      await expect(
        createOrUpdateEntityMetadata(
          path.join(rootDir, 'catalog.yaml'),
          filePath,
          mockLogger,
        ),
      ).rejects.toThrow('Unexpected token d in JSON at position 0');
    });

    it('should throw error when the YAML is invalid', async () => {
      const filePath = path.join(rootDir, 'entity_metadata.json');
      const catalogPath = path.join(rootDir, 'invalid_catalog.yaml');

      await expect(
        createOrUpdateEntityMetadata(catalogPath, filePath, mockLogger),
      ).rejects.toThrow();
    });

    it('should add catalog yaml contents to the metadata json', async () => {
      const filePath = path.join(rootDir, 'entity_metadata.json');

      await createOrUpdateEntityMetadata(
        path.join(rootDir, 'catalog.yaml'),
        filePath,
        mockLogger,
      );

      const json = await fs.readJson(filePath);
      expect(json.site_name).toEqual('Catalog Docs');
    });
  });

  describe('getMkdocsYml', () => {
    const defaultOptions = {
      name: mockEntity.metadata.title,
    };

    it('returns expected contents when .yml file is present', async () => {
      mockDir.setContent({ 'mkdocs.yml': mkdocsYml });
      const {
        path: mkdocsPath,
        content,
        configIsTemporary,
      } = await getMkdocsYml(mockDir.path, defaultOptions);

      expect(mkdocsPath).toBe(mockDir.resolve('mkdocs.yml'));
      expect(content).toBe(mkdocsYml.toString());
      expect(configIsTemporary).toBe(false);
    });

    it('returns expected contents when .yaml file is present', async () => {
      mockDir.setContent({ 'mkdocs.yaml': mkdocsYml });
      const {
        path: mkdocsPath,
        content,
        configIsTemporary,
      } = await getMkdocsYml(mockDir.path, defaultOptions);
      expect(mkdocsPath).toBe(mockDir.resolve('mkdocs.yaml'));
      expect(content).toBe(mkdocsYml.toString());
      expect(configIsTemporary).toBe(false);
    });

    it('returns expected contents when default file is present', async () => {
      const options = {
        name: 'Default Test site name',
      };
      const mockPathExists = jest.spyOn(fs, 'pathExists');
      mockPathExists.mockImplementation(() => Promise.resolve(false));
      mockDir.setContent({ 'mkdocs.yml': mkdocsDefaultYml });
      const {
        path: mkdocsPath,
        content,
        configIsTemporary,
      } = await getMkdocsYml(mockDir.path, options);

      expect(mkdocsPath).toBe(mockDir.resolve('mkdocs.yml'));
      expect(content.split(/[\r\n]+/g)).toEqual(
        mkdocsDefaultYml.toString().split(/[\r\n]+/g),
      );
      expect(configIsTemporary).toBe(true);
      mockPathExists.mockRestore();
    });

    it('throws when neither .yml nor .yaml nor default file is present', async () => {
      const invalidInputDir = resolvePath(__filename);
      await expect(
        getMkdocsYml(invalidInputDir, defaultOptions),
      ).rejects.toThrow(
        /Could not read MkDocs YAML config file mkdocs.yml or mkdocs.yaml or default for validation/,
      );
    });

    it('returns expected content when custom file is specified', async () => {
      const options = { mkdocsConfigFileName: 'another-name.yaml' };
      mockDir.setContent({ 'another-name.yaml': mkdocsYml });

      const {
        path: mkdocsPath,
        content,
        configIsTemporary,
      } = await getMkdocsYml(mockDir.path, options);

      expect(mkdocsPath).toBe(mockDir.resolve('another-name.yaml'));

      expect(content).toBe(mkdocsYml.toString());
      expect(configIsTemporary).toBe(false);
    });

    it('throws when specifying a specific mkdocs config file that does not exist', async () => {
      const options = { mkdocsConfigFileName: 'another-name.yaml' };
      mockDir.setContent({ 'mkdocs.yml': mkdocsDefaultYml });

      await expect(getMkdocsYml(mockDir.path, options)).rejects.toThrow(
        /The specified file .* does not exist/,
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
      ).resolves.toBe('docs/');
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

    it('should validate files with custom yaml tags (scalar)', async () => {
      await expect(
        validateMkdocsYaml(inputDir, mkdocsYmlWithExtensions.toString()),
      ).resolves.toBeUndefined();
    });

    it('should validate files with custom yaml tags (sequence)', async () => {
      await expect(
        validateMkdocsYaml(inputDir, mkdocsYmlWithEnvTag.toString()),
      ).resolves.toBeUndefined();
    });
  });

  describe('sanitizeMkdocsYml', () => {
    beforeEach(() => {
      warn.mockClear();
      mockDir.setContent({
        'mkdocs_with_hooks.yml': mkdocsYmlWithHooks,
        'mkdocs.yml': mkdocsYml,
      });
    });

    it('should remove disallowed keys from mkdocs.yml and log a warning', async () => {
      await sanitizeMkdocsYml(
        mockDir.resolve('mkdocs_with_hooks.yml'),
        mockLogger,
      );

      const updatedMkdocsYml = await fs.readFile(
        mockDir.resolve('mkdocs_with_hooks.yml'),
      );
      const parsedYml = yaml.load(updatedMkdocsYml.toString()) as {
        hooks?: string[];
        site_name: string;
      };
      expect(parsedYml.hooks).toBeUndefined();
      expect(parsedYml.site_name).toBe('Test site name');
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining(
          'Removed the following unsupported configuration keys from mkdocs.yml: hooks',
        ),
      );
    });

    it('should not modify mkdocs.yml when no disallowed keys are present', async () => {
      await sanitizeMkdocsYml(mockDir.resolve('mkdocs.yml'), mockLogger);

      const updatedMkdocsYml = await fs.readFile(mockDir.resolve('mkdocs.yml'));
      const parsedYml = yaml.load(updatedMkdocsYml.toString()) as {
        hooks?: string[];
        site_name: string;
      };
      expect(parsedYml.hooks).toBeUndefined();
      expect(parsedYml.site_name).toBe('Test site name');
      expect(warn).not.toHaveBeenCalled();
    });

    it('should remove multiple disallowed keys and list them all in the warning', async () => {
      const mkdocsWithMultipleDisallowed = `site_name: Test
hooks:
  - hook.py
some_unknown_key: value
another_unknown: true
`;
      mockDir.setContent({
        'mkdocs_multiple.yml': mkdocsWithMultipleDisallowed,
      });

      await sanitizeMkdocsYml(
        mockDir.resolve('mkdocs_multiple.yml'),
        mockLogger,
      );

      const updatedMkdocsYml = await fs.readFile(
        mockDir.resolve('mkdocs_multiple.yml'),
      );
      const parsedYml = yaml.load(updatedMkdocsYml.toString()) as Record<
        string,
        unknown
      >;
      expect(parsedYml.hooks).toBeUndefined();
      expect(parsedYml.some_unknown_key).toBeUndefined();
      expect(parsedYml.another_unknown).toBeUndefined();
      expect(parsedYml.site_name).toBe('Test');
      expect(warn).toHaveBeenCalledWith(
        expect.stringMatching(
          /Removed the following unsupported configuration keys.*hooks.*some_unknown_key.*another_unknown|Removed the following unsupported configuration keys.*hooks.*another_unknown.*some_unknown_key/,
        ),
      );
    });

    it('should remove hooks introduced via YAML merge keys', async () => {
      mockDir.setContent({
        'mkdocs_merge_keys.yml': mkdocsYmlWithMergeKeyHooks,
      });

      await sanitizeMkdocsYml(
        mockDir.resolve('mkdocs_merge_keys.yml'),
        mockLogger,
      );

      const updatedMkdocsYml = await fs.readFile(
        mockDir.resolve('mkdocs_merge_keys.yml'),
      );
      const parsedYml = yaml.load(updatedMkdocsYml.toString()) as Record<
        string,
        unknown
      >;

      expect(parsedYml.hooks).toBeUndefined();
      expect(parsedYml.site_name).toBe('Test');
      expect(parsedYml.plugins).toEqual(['techdocs-core']);
      expect(updatedMkdocsYml.toString()).not.toContain('<<:');

      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining(
          'Removed the following unsupported configuration keys from mkdocs.yml: hooks',
        ),
      );
    });

    it('should remove hooks when parsers interpret duplicate merge keys differently', async () => {
      mockDir.setContent({
        'mkdocs_parser_diff.yml': mkdocsYmlWithParserDifferentialHooks,
      });

      await sanitizeMkdocsYml(
        mockDir.resolve('mkdocs_parser_diff.yml'),
        mockLogger,
      );

      const updatedMkdocsYml = await fs.readFile(
        mockDir.resolve('mkdocs_parser_diff.yml'),
      );
      const parsedYml = yaml.load(updatedMkdocsYml.toString()) as Record<
        string,
        unknown
      >;

      expect(parsedYml.hooks).toBeUndefined();
      expect(parsedYml.site_name).toBe('Test');
      expect(parsedYml.plugins).toEqual(['techdocs-core']);
      expect(parsedYml.extra).toBeDefined();
      expect(updatedMkdocsYml.toString()).not.toContain('<<:');

      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining(
          'Removed the following unsupported configuration keys from mkdocs.yml: hooks',
        ),
      );
    });

    it('should remove hooks with duplicate merge keys and top-level anchors', async () => {
      mockDir.setContent({
        'mkdocs_duplicate_merge.yml': mkdocsYmlWithDuplicateMergeHooks,
      });

      await sanitizeMkdocsYml(
        mockDir.resolve('mkdocs_duplicate_merge.yml'),
        mockLogger,
      );

      const updatedMkdocsYml = await fs.readFile(
        mockDir.resolve('mkdocs_duplicate_merge.yml'),
      );
      const parsedYml = yaml.load(updatedMkdocsYml.toString()) as Record<
        string,
        unknown
      >;

      expect(parsedYml.hooks).toBeUndefined();
      expect(parsedYml.site_name).toBe('Test');
      expect(parsedYml.plugins).toEqual(['techdocs-core']);
      expect(updatedMkdocsYml.toString()).not.toContain('<<:');

      expect(warn).toHaveBeenCalledWith(expect.stringContaining('hooks'));
    });
  });

  describe('validateDocsDirectory', () => {
    it('should pass for a valid docs directory with no symlinks', async () => {
      mockDir.setContent({
        docs: {
          'index.md': 'Hello',
          'guide.md': 'Guide content',
        },
      });

      await expect(
        validateDocsDirectory(mockDir.resolve('docs'), mockDir.path),
      ).resolves.toBeUndefined();
    });

    it('should pass for symlinks pointing within the input directory', async () => {
      mockDir.setContent({
        docs: {
          'index.md': 'Hello',
        },
        'other.md': 'Other content',
      });

      // Create a symlink within the input directory
      await fs.symlink(
        mockDir.resolve('other.md'),
        mockDir.resolve('docs/link.md'),
      );

      await expect(
        validateDocsDirectory(mockDir.resolve('docs'), mockDir.path),
      ).resolves.toBeUndefined();
    });

    it('should reject symlinks pointing outside the input directory', async () => {
      const anotherMockDir = createMockDirectory();

      mockDir.setContent({
        docs: {
          'index.md': 'Hello',
        },
      });

      anotherMockDir.setContent({
        tmp: {
          secret: 'password',
        },
      });

      // Create a symlink pointing outside the input directory
      await fs.symlink(
        anotherMockDir.resolve('tmp/secret'),
        mockDir.resolve('docs/escape.md'),
      );

      await expect(
        validateDocsDirectory(mockDir.resolve('docs'), mockDir.path),
      ).rejects.toThrow(/not allowed to refer to a location outside/i);
    });

    it('should reject symlinks to sensitive files like /etc/passwd', async () => {
      mockDir.setContent({
        docs: {
          'index.md': 'Hello',
        },
      });

      // Create a symlink to /etc/passwd
      await fs.symlink('/etc/passwd', mockDir.resolve('docs/passwd.md'));

      await expect(
        validateDocsDirectory(mockDir.resolve('docs'), mockDir.path),
      ).rejects.toThrow(/not allowed to refer to a location outside/i);
    });

    it('should reject symlinks in nested directories', async () => {
      mockDir.setContent({
        docs: {
          'index.md': 'Hello',
          nested: {
            'page.md': 'Nested page',
          },
        },
      });

      // Create a symlink in a nested directory pointing outside
      await fs.symlink('/etc/passwd', mockDir.resolve('docs/nested/escape.md'));

      await expect(
        validateDocsDirectory(mockDir.resolve('docs'), mockDir.path),
      ).rejects.toThrow(/not allowed to refer to a location outside/i);
    });

    it('should reject directory symlinks pointing outside', async () => {
      const anotherMockDir = createMockDirectory();

      mockDir.setContent({
        docs: {
          'index.md': 'Hello',
        },
      });

      anotherMockDir.setContent({
        tmp: {
          secret: 'password',
        },
      });

      // Create a directory symlink pointing outside
      await fs.symlink(
        anotherMockDir.path,
        mockDir.resolve('docs/external-dir'),
      );

      await expect(
        validateDocsDirectory(mockDir.resolve('docs'), mockDir.path),
      ).rejects.toThrow(/not allowed to refer to a location outside/i);
    });

    it('should pass for directory symlinks within input directory', async () => {
      mockDir.setContent({
        docs: {
          'index.md': 'Hello',
        },
        assets: {
          'image.png': 'binary content',
        },
      });

      // Create a directory symlink within input directory
      await fs.symlink(
        mockDir.resolve('assets'),
        mockDir.resolve('docs/assets'),
      );

      await expect(
        validateDocsDirectory(mockDir.resolve('docs'), mockDir.path),
      ).resolves.toBeUndefined();
    });
  });
});
