/*
 * Copyright 2022 The Backstage Authors
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

import mockFs from 'mock-fs';
import { normalize, resolve as resolvePath } from 'path';
import * as pathsLib from '../../lib/paths';

import {
  buildDocs,
  runCliExtraction,
  runApiExtraction,
  categorizePackageDirs,
} from './api-extractor';

import { buildApiReports } from './api-reports';
import { generateTypeDeclarations } from './generateTypeDeclarations';

jest.mock('./generateTypeDeclarations');
// create mocks for the dependencies of the `buildApiReports` function
jest.mock('./api-extractor', () => ({
  createTemporaryTsConfig: jest.fn(),
  categorizePackageDirs: jest.fn().mockImplementation(async (p: string[]) => {
    console.log('categorizePackageDirs', p);
    return {
      tsPackageDirs: p,
      cliPackageDirs: p,
    };
  }),
  runApiExtraction: jest.fn(),
  runCliExtraction: jest.fn(),
  buildDocs: jest.fn(),
}));

const projectPaths = pathsLib.paths;

jest
  .spyOn(projectPaths, 'targetRoot', 'get')
  .mockReturnValue(normalize('/root'));
jest.spyOn(projectPaths, 'resolveTargetRoot').mockImplementation((...path) => {
  return resolvePath(normalize('/root'), ...path);
});

describe('buildApiReports', () => {
  beforeEach(() => {
    mockFs({
      [projectPaths.targetRoot]: {
        'package.json': JSON.stringify({
          workspaces: { packages: ['packages/*', 'plugins/*'] },
        }),
        packages: {
          'package-a': {
            'package.json': '{}',
          },
          'package-b': {
            'package.json': '{}',
          },
          'package-c': {},
          'README.md': 'Hello World',
        },
        plugins: {
          'plugin-a': {
            'package.json': '{}',
          },
          'plugin-b': {
            'package.json': '{}',
          },
          'plugin-c': {
            'package.json': '{}',
          },
        },
      },
    });
  });

  afterEach(() => {
    mockFs.restore();
    jest.clearAllMocks();
  });

  it('should run without any options', async () => {
    const opts = {};
    const paths: string[] = [];

    await buildApiReports(paths, opts);

    expect(categorizePackageDirs).toHaveBeenCalledWith([
      normalize('packages/package-a'),
      normalize('packages/package-b'),
      normalize('plugins/plugin-a'),
      normalize('plugins/plugin-b'),
      normalize('plugins/plugin-c'),
    ]);

    expect(generateTypeDeclarations).not.toHaveBeenCalled();
    expect(runApiExtraction).toHaveBeenCalledWith({
      packageDirs: [
        normalize('packages/package-a'),
        normalize('packages/package-b'),
        normalize('plugins/plugin-a'),
        normalize('plugins/plugin-b'),
        normalize('plugins/plugin-c'),
      ],
      tsconfigFilePath: resolvePath('/root/tsconfig.json'),
      allowWarnings: [],
      omitMessages: [],
      isLocalBuild: true,
      outputDir: resolvePath('/root/node_modules/.cache/api-extractor'),
    });
    expect(runCliExtraction).toHaveBeenCalledWith({
      packageDirs: [
        normalize('packages/package-a'),
        normalize('packages/package-b'),
        normalize('plugins/plugin-a'),
        normalize('plugins/plugin-b'),
        normalize('plugins/plugin-c'),
      ],
      isLocalBuild: true,
    });

    expect(buildDocs).not.toHaveBeenCalled();
  });

  describe('paths', () => {
    it('should generate API reports for one specific package', async () => {
      const paths = ['packages/package-a'];
      const opts = {};

      await buildApiReports(paths, opts);

      expect(categorizePackageDirs).toHaveBeenCalledWith([
        normalize('packages/package-a'),
      ]);

      expect(runApiExtraction).toHaveBeenCalledWith({
        packageDirs: [normalize('packages/package-a')],
        tsconfigFilePath: resolvePath('/root/tsconfig.json'),
        allowWarnings: [],
        omitMessages: [],
        isLocalBuild: true,
        outputDir: resolvePath('/root/node_modules/.cache/api-extractor'),
      });
      expect(runCliExtraction).toHaveBeenCalledWith({
        packageDirs: [normalize('packages/package-a')],
        isLocalBuild: true,
      });

      expect(buildDocs).not.toHaveBeenCalled();
    });
    it('should generate API reports for multiple specific packages', async () => {
      const paths = ['packages/package-a', 'packages/package-b'];
      const opts = {};

      await buildApiReports(paths, opts);

      expect(categorizePackageDirs).toHaveBeenCalledWith([
        normalize('packages/package-a'),
        normalize('packages/package-b'),
      ]);

      expect(runApiExtraction).toHaveBeenCalledWith({
        packageDirs: [
          normalize('packages/package-a'),
          normalize('packages/package-b'),
        ],
        tsconfigFilePath: resolvePath('/root/tsconfig.json'),
        allowWarnings: [],
        omitMessages: [],
        isLocalBuild: true,
        outputDir: resolvePath('/root/node_modules/.cache/api-extractor'),
      });
      expect(runCliExtraction).toHaveBeenCalledWith({
        packageDirs: [
          normalize('packages/package-a'),
          normalize('packages/package-b'),
        ],
        isLocalBuild: true,
      });

      expect(buildDocs).not.toHaveBeenCalled();
    });
    it('should generate API reports for all packages matching the glob pattern', async () => {
      const paths = ['packages/*'];
      const opts = {};

      await buildApiReports(paths, opts);

      expect(categorizePackageDirs).toHaveBeenCalledWith([
        normalize('packages/package-a'),
        normalize('packages/package-b'),
      ]);

      expect(runApiExtraction).toHaveBeenCalledWith({
        packageDirs: [
          normalize('packages/package-a'),
          normalize('packages/package-b'),
        ],
        tsconfigFilePath: resolvePath('/root/tsconfig.json'),
        allowWarnings: [],
        omitMessages: [],
        isLocalBuild: true,
        outputDir: resolvePath('/root/node_modules/.cache/api-extractor'),
      });
      expect(runCliExtraction).toHaveBeenCalledWith({
        packageDirs: [
          normalize('packages/package-a'),
          normalize('packages/package-b'),
        ],
        isLocalBuild: true,
      });

      expect(buildDocs).not.toHaveBeenCalled();
    });

    it('should generate API reports for all packages matching multiple glob patterns', async () => {
      const paths = ['packages/*', 'plugins/*a'];
      const opts = {};

      await buildApiReports(paths, opts);

      expect(categorizePackageDirs).toHaveBeenCalledWith([
        normalize('packages/package-a'),
        normalize('packages/package-b'),
        normalize('plugins/plugin-a'),
      ]);

      expect(runApiExtraction).toHaveBeenCalledWith({
        packageDirs: [
          normalize('packages/package-a'),
          normalize('packages/package-b'),
          normalize('plugins/plugin-a'),
        ],
        tsconfigFilePath: resolvePath('/root/tsconfig.json'),
        allowWarnings: [],
        omitMessages: [],
        isLocalBuild: true,
        outputDir: resolvePath('/root/node_modules/.cache/api-extractor'),
      });
      expect(runCliExtraction).toHaveBeenCalledWith({
        packageDirs: [
          normalize('packages/package-a'),
          normalize('packages/package-b'),
          normalize('plugins/plugin-a'),
        ],
        isLocalBuild: true,
      });

      expect(buildDocs).not.toHaveBeenCalled();
    });

    it('should generate API reports for specific packages and glob pattern', async () => {
      const opts = {};
      const paths = ['packages/package-a', 'plugins/*'];

      await buildApiReports(paths, opts);

      expect(categorizePackageDirs).toHaveBeenCalledWith([
        normalize('packages/package-a'),
        normalize('plugins/plugin-a'),
        normalize('plugins/plugin-b'),
        normalize('plugins/plugin-c'),
      ]);

      expect(runApiExtraction).toHaveBeenCalledWith({
        packageDirs: [
          normalize('packages/package-a'),
          normalize('plugins/plugin-a'),
          normalize('plugins/plugin-b'),
          normalize('plugins/plugin-c'),
        ],
        tsconfigFilePath: resolvePath('/root/tsconfig.json'),
        allowWarnings: [],
        omitMessages: [],
        isLocalBuild: true,
        outputDir: resolvePath('/root/node_modules/.cache/api-extractor'),
      });
      expect(runCliExtraction).toHaveBeenCalledWith({
        packageDirs: [
          normalize('packages/package-a'),
          normalize('plugins/plugin-a'),
          normalize('plugins/plugin-b'),
          normalize('plugins/plugin-c'),
        ],
        isLocalBuild: true,
      });

      expect(buildDocs).not.toHaveBeenCalled();
    });
  });
  describe('allowWarnings', () => {
    it('should accept single path value', async () => {
      const opts = {
        allowWarnings: 'packages/package-a',
      };
      const paths = ['packages/*'];

      await buildApiReports(paths, opts);

      expect(runApiExtraction).toHaveBeenCalledWith({
        packageDirs: [
          normalize('packages/package-a'),
          normalize('packages/package-b'),
        ],
        tsconfigFilePath: resolvePath('/root/tsconfig.json'),
        allowWarnings: ['packages/package-a'],
        omitMessages: [],
        isLocalBuild: true,
        outputDir: resolvePath('/root/node_modules/.cache/api-extractor'),
      });
    });

    it('should accept multiple path values as comma separated string', async () => {
      const opts = {
        allowWarnings: 'packages/package-a,packages/package-b',
      };
      const paths = ['packages/*'];

      await buildApiReports(paths, opts);

      expect(runApiExtraction).toHaveBeenCalledWith({
        packageDirs: [
          normalize('packages/package-a'),
          normalize('packages/package-b'),
        ],
        tsconfigFilePath: resolvePath('/root/tsconfig.json'),
        allowWarnings: ['packages/package-a', 'packages/package-b'],
        omitMessages: [],
        isLocalBuild: true,
        outputDir: resolvePath('/root/node_modules/.cache/api-extractor'),
      });
    });

    it('should accept multiple path values as comma separated string with spaces', async () => {
      const opts = {
        allowWarnings: 'packages/package-a, packages/package-b',
      };
      const paths = ['packages/*'];

      await buildApiReports(paths, opts);

      expect(runApiExtraction).toHaveBeenCalledWith({
        packageDirs: [
          normalize('packages/package-a'),
          normalize('packages/package-b'),
        ],
        tsconfigFilePath: resolvePath('/root/tsconfig.json'),
        allowWarnings: ['packages/package-a', 'packages/package-b'],
        omitMessages: [],
        isLocalBuild: true,
        outputDir: resolvePath('/root/node_modules/.cache/api-extractor'),
      });
    });
  });
  describe('allowAllWarnings', () => {
    it('should accept boolean values', async () => {
      const opts = {
        allowAllWarnings: true,
      };
      const paths = ['packages/*'];

      await buildApiReports(paths, opts);

      expect(runApiExtraction).toHaveBeenCalledWith({
        packageDirs: [
          normalize('packages/package-a'),
          normalize('packages/package-b'),
        ],
        tsconfigFilePath: resolvePath('/root/tsconfig.json'),
        allowWarnings: true,
        omitMessages: [],
        isLocalBuild: true,
        outputDir: resolvePath('/root/node_modules/.cache/api-extractor'),
      });
    });
  });
  describe('omitMessages', () => {
    it('should accept single message value', async () => {
      const opts = {
        omitMessages: 'ae-missing-release-tag',
      };
      const paths = ['packages/*'];

      await buildApiReports(paths, opts);

      expect(runApiExtraction).toHaveBeenCalledWith({
        packageDirs: [
          normalize('packages/package-a'),
          normalize('packages/package-b'),
        ],
        tsconfigFilePath: resolvePath('/root/tsconfig.json'),
        allowWarnings: [],
        omitMessages: ['ae-missing-release-tag'],
        isLocalBuild: true,
        outputDir: resolvePath('/root/node_modules/.cache/api-extractor'),
      });
    });

    it('should accept multiple message values as comma separated string', async () => {
      const opts = {
        omitMessages: 'ae-missing-release-tag,ae-missing-annotations',
      };
      const paths = ['packages/*'];

      await buildApiReports(paths, opts);

      expect(runApiExtraction).toHaveBeenCalledWith({
        packageDirs: [
          normalize('packages/package-a'),
          normalize('packages/package-b'),
        ],
        tsconfigFilePath: resolvePath('/root/tsconfig.json'),
        allowWarnings: [],
        omitMessages: ['ae-missing-release-tag', 'ae-missing-annotations'],
        isLocalBuild: true,
        outputDir: resolvePath('/root/node_modules/.cache/api-extractor'),
      });
    });

    it('should accept multiple message values as comma separated string with spaces', async () => {
      const opts = {
        omitMessages: 'ae-missing-release-tag, ae-missing-annotations',
      };
      const paths = ['packages/*'];

      await buildApiReports(paths, opts);

      expect(runApiExtraction).toHaveBeenCalledWith({
        packageDirs: [
          normalize('packages/package-a'),
          normalize('packages/package-b'),
        ],
        tsconfigFilePath: resolvePath('/root/tsconfig.json'),
        allowWarnings: [],
        omitMessages: ['ae-missing-release-tag', 'ae-missing-annotations'],
        isLocalBuild: true,
        outputDir: resolvePath('/root/node_modules/.cache/api-extractor'),
      });
    });
  });
  describe('isCI', () => {
    it('should set localBuild to false if CI option is passed', async () => {
      const opts = {
        ci: true,
      };
      const paths = ['packages/*'];

      await buildApiReports(paths, opts);

      expect(runApiExtraction).toHaveBeenCalledWith({
        packageDirs: [
          normalize('packages/package-a'),
          normalize('packages/package-b'),
        ],
        tsconfigFilePath: resolvePath('/root/tsconfig.json'),
        allowWarnings: [],
        omitMessages: [],
        isLocalBuild: false,
        outputDir: resolvePath('/root/node_modules/.cache/api-extractor'),
      });
      expect(runCliExtraction).toHaveBeenCalledWith({
        packageDirs: [
          normalize('packages/package-a'),
          normalize('packages/package-b'),
        ],
        isLocalBuild: false,
      });
    });
  });
  describe('docs', () => {
    it('should run typedoc if docs option is passed', async () => {
      const opts = {
        docs: true,
      };
      const paths = ['packages/*'];

      await buildApiReports(paths, opts);

      expect(buildDocs).toHaveBeenCalledWith({
        inputDir: resolvePath('/root/node_modules/.cache/api-extractor'),
        outputDir: resolvePath('/root/docs/reference'),
      });
    });
  });
  describe('tsc', () => {
    it('should run tsc if tsc option is passed', async () => {
      const opts = {
        tsc: true,
      };
      const paths = ['packages/*'];

      await buildApiReports(paths, opts);

      expect(generateTypeDeclarations).toHaveBeenCalled();
    });
  });
});
