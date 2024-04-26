/*
 * Copyright 2023 The Backstage Authors
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

import { PluginScanner } from './plugin-scanner';
import { JsonObject } from '@backstage/types';
import { Logs, MockedLogger } from '../__testUtils__/testUtils';
import { ConfigReader } from '@backstage/config';
import path from 'path';
import * as url from 'url';
import { ScannedPluginPackage } from './types';
import {
  MockDirectoryContent,
  createMockDirectory,
} from '@backstage/backend-test-utils';

const mockDir = createMockDirectory();

describe('plugin-scanner', () => {
  const env = process.env;
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    mockDir.clear();
    process.env = env;
  });

  describe('applyConfig', () => {
    type TestCase = {
      name: string;
      backstageRoot?: string;
      fileSystem?: any;
      config: JsonObject;
      environment?: { [key: string]: string };
      expectedLogs?: Logs;
      expectedRootDirectory?: string;
      expectedError?: string;
    };

    it.each<TestCase>([
      {
        name: 'no dynamic plugins',
        config: {},
        expectedRootDirectory: undefined,
        expectedLogs: {
          infos: [
            {
              message: "'dynamicPlugins' config entry not found.",
            },
          ],
        },
      },
      {
        name: 'valid config with relative root directory path',
        backstageRoot: mockDir.resolve('backstageRoot'),
        fileSystem: {
          backstageRoot: {
            'dist-dynamic': {},
          },
        },
        config: {
          dynamicPlugins: {
            rootDirectory: 'dist-dynamic',
          },
        },
        expectedRootDirectory: mockDir.resolve('backstageRoot/dist-dynamic'),
      },
      {
        name: 'valid config with absolute root directory path inside the backstage root',
        backstageRoot: mockDir.resolve('backstageRoot'),
        fileSystem: {
          backstageRoot: {
            'dist-dynamic': {},
          },
        },
        config: {
          dynamicPlugins: {
            rootDirectory: mockDir.resolve('backstageRoot/dist-dynamic'),
          },
        },
        expectedRootDirectory: mockDir.resolve('backstageRoot/dist-dynamic'),
      },
      {
        name: 'valid config with absolute root directory path outside the backstage root',
        backstageRoot: mockDir.resolve('backstageRoot'),
        fileSystem: {
          somewhere: {
            'dist-dynamic': {},
          },
        },
        config: {
          dynamicPlugins: {
            rootDirectory: mockDir.resolve('somewhere/dist-dynamic'),
          },
        },
        expectedError: `Dynamic plugins under '${mockDir.resolve(
          'somewhere/dist-dynamic',
        )}' cannot access backstage modules in '${mockDir.resolve(
          'backstageRoot/node_modules',
        )}'.
Please add '${mockDir.resolve(
          'backstageRoot/node_modules',
        )}' to the 'NODE_PATH' when running the backstage backend.`,
      },
      {
        name: 'valid config with absolute root directory path outside the backstage root but with backstage root included in NODE_PATH',
        backstageRoot: mockDir.resolve('backstageRoot'),
        fileSystem: {
          somewhere: {
            'dist-dynamic': {},
          },
        },
        config: {
          dynamicPlugins: {
            rootDirectory: mockDir.resolve('somewhere/dist-dynamic'),
          },
        },
        environment: {
          NODE_PATH: `${mockDir.resolve('somewhere-else')}${
            path.delimiter
          }${mockDir.resolve('backstageRoot', 'node_modules')}${
            path.delimiter
          }${mockDir.resolve('anywhere-else')}`,
        },
        expectedRootDirectory: mockDir.resolve('somewhere/dist-dynamic'),
      },
      {
        name: 'invalid config: dynamicPlugins not an object',
        config: {
          dynamicPlugins: 1,
        },
        expectedLogs: {
          warns: [
            {
              message: "'dynamicPlugins' config entry should be an object.",
            },
          ],
        },
      },
      {
        name: 'invalid config: rootDirectory not a string',
        config: {
          dynamicPlugins: {
            rootDirectory: 1,
          },
        },
        expectedLogs: {
          warns: [
            {
              message:
                "'dynamicPlugins.rootDirectory' config entry should be a string.",
            },
          ],
        },
      },
      {
        name: 'invalid config: no rootDirectory entry',
        config: {
          dynamicPlugins: {},
        },
        expectedLogs: {
          warns: [
            {
              message:
                "'dynamicPlugins' config entry does not contain the 'rootDirectory' field.",
            },
          ],
        },
      },
      {
        name: 'valid config pointing to a file instead of a directory',
        backstageRoot: mockDir.resolve('backstageRoot'),
        fileSystem: {
          backstageRoot: {
            'dist-dynamic': '',
          },
        },
        config: {
          dynamicPlugins: {
            rootDirectory: 'dist-dynamic',
          },
        },
        expectedError: 'Not a directory',
      },
    ])('$name', (tc: TestCase): void => {
      if (tc.environment) {
        process.env = {
          ...env,
          ...tc.environment,
        };
      }
      const logger = new MockedLogger();
      const backstageRoot = tc.backstageRoot ? tc.backstageRoot : '';
      function toTest(): PluginScanner {
        return PluginScanner.create({
          config: new ConfigReader(tc.config),
          logger,
          backstageRoot,
        });
      }
      if (tc.fileSystem) {
        mockDir.setContent(tc.fileSystem);
      }
      if (tc.expectedError) {
        /* eslint-disable-next-line jest/no-conditional-expect */
        expect(toTest).toThrow(tc.expectedError);
        return;
      }
      const pluginScanner = toTest();
      if (tc.expectedLogs) {
        /* eslint-disable-next-line jest/no-conditional-expect */
        expect(logger.logs).toEqual<Logs>(tc.expectedLogs);
      } else {
        /* eslint-disable-next-line jest/no-conditional-expect */
        expect(logger.logs).toEqual<Logs>({});
      }
      expect(pluginScanner.rootDirectory).toEqual(tc.expectedRootDirectory);
    });
  });
  describe('scanRoot', () => {
    type TestCase = {
      name: string;
      preferAlpha?: boolean;
      fileSystem?: MockDirectoryContent;
      expectedLogs?: Logs;
      expectedPluginPackages?: ScannedPluginPackage[];
      expectedError?: string;
    };

    it.each<TestCase>([
      {
        name: 'dynamic plugins disabled',
        expectedPluginPackages: [],
        expectedLogs: {
          infos: [
            {
              message: "'dynamicPlugins' config entry not found.",
            },
          ],
        },
      },
      {
        name: 'manifest found in directory',
        fileSystem: {
          backstageRoot: {
            'dist-dynamic': {
              'test-backend-plugin': {
                'package.json': JSON.stringify({
                  name: 'test-backend-plugin-dynamic',
                  version: '0.0.0',
                  main: 'dist/index.cjs.js',
                  backstage: { role: 'backend-plugin' },
                }),
              },
            },
          },
        },
        expectedPluginPackages: [
          {
            location: url.pathToFileURL(
              mockDir.resolve('backstageRoot/dist-dynamic/test-backend-plugin'),
            ),
            manifest: {
              name: 'test-backend-plugin-dynamic',
              version: '0.0.0',
              main: 'dist/index.cjs.js',
              backstage: { role: 'backend-plugin' },
            },
          },
        ],
      },
      {
        name: 'backend plugin found in symlink',
        fileSystem: {
          backstageRoot: {
            'dist-dynamic': {
              'test-backend-plugin': ctx =>
                ctx.symlink(
                  mockDir.resolve('somewhere-else/test-backend-plugin-target'),
                ),
            },
          },
          'somewhere-else': {
            'test-backend-plugin-target': {
              'package.json': JSON.stringify({
                name: 'test-backend-plugin-dynamic',
                version: '0.0.0',
                main: 'dist/index.cjs.js',
                backstage: { role: 'backend-plugin' },
              }),
            },
          },
        },
        expectedPluginPackages: [
          {
            location: url.pathToFileURL(
              mockDir.resolve('backstageRoot/dist-dynamic/test-backend-plugin'),
            ),
            manifest: {
              name: 'test-backend-plugin-dynamic',
              version: '0.0.0',
              main: 'dist/index.cjs.js',
              backstage: { role: 'backend-plugin' },
            },
          },
        ],
      },
      {
        name: 'ignored folder child: not a directory',
        fileSystem: {
          backstageRoot: {
            'dist-dynamic': {
              'test-backend-plugin': '',
            },
          },
        },
        expectedPluginPackages: [],
        expectedLogs: {
          infos: [
            {
              message: `skipping '${mockDir.resolve(
                'backstageRoot/dist-dynamic/test-backend-plugin',
              )}' since it is not a directory`,
            },
          ],
        },
      },
      {
        name: 'ignored folder child symlink: target is not a directory',
        fileSystem: {
          backstageRoot: {
            'dist-dynamic': {
              'test-backend-plugin': ctx =>
                ctx.symlink(
                  mockDir.resolve('somewhere-else/test-backend-plugin-target'),
                ),
            },
          },
          'somewhere-else': {
            'test-backend-plugin-target': '',
          },
        },
        expectedPluginPackages: [],
        expectedLogs: {
          infos: [
            {
              message: `skipping '${mockDir.resolve(
                'backstageRoot/dist-dynamic/test-backend-plugin',
              )}' since it is not a directory`,
            },
          ],
        },
      },
      {
        name: 'alpha manifest available but not preferred',
        preferAlpha: false,
        fileSystem: {
          backstageRoot: {
            'dist-dynamic': {
              'test-backend-plugin': {
                'package.json': JSON.stringify({
                  name: 'test-backend-plugin-dynamic',
                  version: '0.0.0',
                  main: 'dist/index.cjs.js',
                  backstage: { role: 'backend-plugin' },
                }),
                alpha: {
                  'package.json': JSON.stringify({
                    name: 'test-backend-plugin-dynamic',
                    version: '0.0.0',
                    main: '../dist/alpha.cjs.js',
                  }),
                },
              },
            },
          },
        },
        expectedPluginPackages: [
          {
            location: url.pathToFileURL(
              mockDir.resolve('backstageRoot/dist-dynamic/test-backend-plugin'),
            ),
            manifest: {
              name: 'test-backend-plugin-dynamic',
              version: '0.0.0',
              main: 'dist/index.cjs.js',
              backstage: { role: 'backend-plugin' },
            },
          },
        ],
      },
      {
        name: 'alpha manifest preferred and found in directory',
        preferAlpha: true,
        fileSystem: {
          backstageRoot: {
            'dist-dynamic': {
              'test-backend-plugin': {
                'package.json': JSON.stringify({
                  name: 'test-backend-plugin-dynamic',
                  version: '0.0.0',
                  main: 'dist/index.cjs.js',
                  backstage: { role: 'backend-plugin' },
                }),
                alpha: {
                  'package.json': JSON.stringify({
                    name: 'test-backend-plugin-dynamic',
                    version: '0.0.0',
                    main: '../dist/alpha.cjs.js',
                  }),
                },
              },
            },
          },
        },
        expectedPluginPackages: [
          {
            location: url.pathToFileURL(
              mockDir.resolve(
                'backstageRoot/dist-dynamic/test-backend-plugin/alpha',
              ),
            ),
            manifest: {
              name: 'test-backend-plugin-dynamic',
              version: '0.0.0',
              main: '../dist/alpha.cjs.js',
              backstage: { role: 'backend-plugin' },
            },
          },
        ],
      },
      {
        name: 'alpha manifest preferred but skipped because not a directory',
        preferAlpha: true,
        fileSystem: {
          backstageRoot: {
            'dist-dynamic': {
              'test-backend-plugin': {
                'package.json': JSON.stringify({
                  name: 'test-backend-plugin-dynamic',
                  version: '0.0.0',
                  main: 'dist/index.cjs.js',
                  backstage: { role: 'backend-plugin' },
                }),
                alpha: '',
              },
            },
          },
        },
        expectedPluginPackages: [
          {
            location: url.pathToFileURL(
              mockDir.resolve('backstageRoot/dist-dynamic/test-backend-plugin'),
            ),
            manifest: {
              name: 'test-backend-plugin-dynamic',
              version: '0.0.0',
              main: 'dist/index.cjs.js',
              backstage: { role: 'backend-plugin' },
            },
          },
        ],
        expectedLogs: {
          warns: [
            {
              message: `skipping '${mockDir.resolve(
                'backstageRoot/dist-dynamic/test-backend-plugin/alpha',
              )}' since it is not a directory`,
            },
          ],
        },
      },
      {
        name: "alpha manifest preferred but skipped because the `alpha` sub-directory doesn't exist",
        preferAlpha: true,
        fileSystem: {
          backstageRoot: {
            'dist-dynamic': {
              'test-backend-plugin': {
                'package.json': JSON.stringify({
                  name: 'test-backend-plugin-dynamic',
                  version: '0.0.0',
                  main: 'dist/index.cjs.js',
                  backstage: { role: 'backend-plugin' },
                }),
              },
            },
          },
        },
        expectedPluginPackages: [
          {
            location: url.pathToFileURL(
              mockDir.resolve('backstageRoot/dist-dynamic/test-backend-plugin'),
            ),
            manifest: {
              name: 'test-backend-plugin-dynamic',
              version: '0.0.0',
              main: 'dist/index.cjs.js',
              backstage: { role: 'backend-plugin' },
            },
          },
        ],
      },
      {
        name: 'invalid alpha package.json',
        preferAlpha: true,
        fileSystem: {
          backstageRoot: {
            'dist-dynamic': {
              'test-backend-plugin': {
                'package.json': JSON.stringify({
                  name: 'test-backend-plugin-dynamic',
                  version: '0.0.0',
                  main: 'dist/index.cjs.js',
                  backstage: { role: 'backend-plugin' },
                }),
                alpha: {
                  'package.json': "invalid json content, 1, '",
                },
              },
            },
          },
        },
        expectedPluginPackages: [],
        expectedLogs: {
          errors: [
            {
              message: `failed to load dynamic plugin manifest from '${mockDir.resolve(
                'backstageRoot/dist-dynamic/test-backend-plugin/alpha',
              )}'`,
              meta: {
                name: 'SyntaxError',
                message: expect.stringContaining('Unexpected token'),
              },
            },
          ],
        },
      },
      {
        name: 'invalid package.json',
        fileSystem: {
          backstageRoot: {
            'dist-dynamic': {
              'test-backend-plugin': {
                'package.json': "invalid json content, 1, '",
              },
            },
          },
        },
        expectedPluginPackages: [],
        expectedLogs: {
          errors: [
            {
              message: `failed to load dynamic plugin manifest from '${mockDir.resolve(
                'backstageRoot/dist-dynamic/test-backend-plugin',
              )}'`,
              meta: {
                name: 'SyntaxError',
                message: expect.stringContaining('Unexpected token'),
              },
            },
          ],
        },
      },
      {
        name: 'missing backstage role in package.json',
        fileSystem: {
          backstageRoot: {
            'dist-dynamic': {
              'test-backend-plugin': {
                'package.json': JSON.stringify({
                  name: 'test-backend-plugin-dynamic',
                  version: '0.0.0',
                  main: 'dist/index.cjs.js',
                }),
              },
            },
          },
        },
        expectedPluginPackages: [],
        expectedLogs: {
          errors: [
            {
              message: `failed to load dynamic plugin manifest from '${mockDir.resolve(
                'backstageRoot/dist-dynamic/test-backend-plugin',
              )}'`,
              meta: {
                name: 'Error',
                message: "field 'backstage.role' not found in 'package.json'",
              },
            },
          ],
        },
      },
      {
        name: 'missing main field in package.json',
        fileSystem: {
          backstageRoot: {
            'dist-dynamic': {
              'test-backend-plugin': {
                'package.json': JSON.stringify({
                  name: 'test-backend-plugin-dynamic',
                  version: '0.0.0',
                  backstage: { role: 'backend-plugin' },
                }),
              },
            },
          },
        },
        expectedPluginPackages: [],
        expectedLogs: {
          errors: [
            {
              message: `failed to load dynamic plugin manifest from '${mockDir.resolve(
                'backstageRoot/dist-dynamic/test-backend-plugin',
              )}'`,
              meta: {
                name: 'Error',
                message: "field 'main' not found in 'package.json'",
              },
            },
          ],
        },
      },
    ])('$name', async (tc: TestCase): Promise<void> => {
      const logger = new MockedLogger();
      const backstageRoot = mockDir.resolve('backstageRoot');
      async function toTest(): Promise<ScannedPluginPackage[]> {
        const pluginScanner = PluginScanner.create({
          config: new ConfigReader(
            tc.fileSystem
              ? {
                  dynamicPlugins: {
                    rootDirectory: 'dist-dynamic',
                  },
                }
              : {},
          ),
          logger,
          backstageRoot,
          preferAlpha: tc.preferAlpha,
        });
        return (await pluginScanner.scanRoot()).packages;
      }
      if (tc.fileSystem) {
        mockDir.setContent(tc.fileSystem);
      }
      if (tc.expectedError) {
        /* eslint-disable-next-line jest/no-conditional-expect */
        expect(toTest).toThrow(tc.expectedError);
        return;
      }
      const plugins = await toTest();
      expect(logger.logs).toEqual<Logs>(tc.expectedLogs ? tc.expectedLogs : {});
      expect(plugins).toEqual(tc.expectedPluginPackages);
    });
  });
});
