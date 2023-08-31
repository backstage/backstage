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
import mockFs from 'mock-fs';
import { JsonObject } from '@backstage/types';
import { Logs, MockedLogger } from '../__testUtils__/testUtils';
import { ConfigReader } from '@backstage/config';
import path from 'path';
import { ScannedPluginPackage } from './types';

describe('plugin-scanner', () => {
  const env = process.env;
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    mockFs.restore();
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
        backstageRoot: '/backstageRoot',
        fileSystem: {
          '/backstageRoot': mockFs.directory({
            items: {
              'dist-dynamic': mockFs.directory(),
            },
          }),
        },
        config: {
          dynamicPlugins: {
            rootDirectory: 'dist-dynamic',
          },
        },
        expectedRootDirectory: '/backstageRoot/dist-dynamic',
      },
      {
        name: 'valid config with absolute root directory path inside the backstage root',
        backstageRoot: '/backstageRoot',
        fileSystem: {
          '/backstageRoot': mockFs.directory({
            items: {
              'dist-dynamic': mockFs.directory(),
            },
          }),
        },
        config: {
          dynamicPlugins: {
            rootDirectory: '/backstageRoot/dist-dynamic',
          },
        },
        expectedRootDirectory: '/backstageRoot/dist-dynamic',
      },
      {
        name: 'valid config with absolute root directory path outside the backstage root',
        backstageRoot: '/backstageRoot',
        fileSystem: {
          '/somewhere': mockFs.directory({
            items: {
              'dist-dynamic': mockFs.directory(),
            },
          }),
        },
        config: {
          dynamicPlugins: {
            rootDirectory: '/somewhere/dist-dynamic',
          },
        },
        expectedError: `Dynamic plugins under '/somewhere/dist-dynamic' cannot access backstage modules in '/backstageRoot/node_modules'.
Please add '/backstageRoot/node_modules' to the 'NODE_PATH' when running the backstage backend.`,
      },
      {
        name: 'valid config with absolute root directory path outside the backstage root but with backstage root included in NODE_PATH',
        backstageRoot: '/backstageRoot',
        fileSystem: {
          '/somewhere': mockFs.directory({
            items: {
              'dist-dynamic': mockFs.directory(),
            },
          }),
        },
        config: {
          dynamicPlugins: {
            rootDirectory: '/somewhere/dist-dynamic',
          },
        },
        environment: {
          NODE_PATH: `/somewhere-else${path.delimiter}/backstageRoot/node_modules${path.delimiter}/anywhere-else`,
        },
        expectedRootDirectory: '/somewhere/dist-dynamic',
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
        backstageRoot: '/backstageRoot',
        fileSystem: {
          '/backstageRoot': mockFs.directory({
            items: {
              'dist-dynamic': mockFs.file(),
            },
          }),
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
        return new PluginScanner(
          new ConfigReader(tc.config),
          logger,
          backstageRoot,
        );
      }
      if (tc.fileSystem) {
        mockFs(tc.fileSystem);
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
      fileSystem?: any;
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
          '/backstageRoot': mockFs.directory({
            items: {
              'dist-dynamic': mockFs.directory({
                items: {
                  'test-backend-plugin': mockFs.directory({
                    items: {
                      'package.json': mockFs.file({
                        content: JSON.stringify({
                          name: 'test-backend-plugin-dynamic',
                          version: '0.0.0',
                          main: 'dist/index.cjs.js',
                          backstage: { role: 'backend-plugin' },
                        }),
                      }),
                    },
                  }),
                },
              }),
            },
          }),
        },
        expectedPluginPackages: [
          {
            location: new URL(
              'file:///backstageRoot/dist-dynamic/test-backend-plugin',
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
          '/backstageRoot': mockFs.directory({
            items: {
              'dist-dynamic': mockFs.directory({
                items: {
                  'test-backend-plugin': mockFs.symlink({
                    path: '/somewhere-else/test-backend-plugin-target',
                  }),
                },
              }),
            },
          }),
          '/somewhere-else': mockFs.directory({
            items: {
              'test-backend-plugin-target': mockFs.directory({
                items: {
                  'package.json': mockFs.file({
                    content: JSON.stringify({
                      name: 'test-backend-plugin-dynamic',
                      version: '0.0.0',
                      main: 'dist/index.cjs.js',
                      backstage: { role: 'backend-plugin' },
                    }),
                  }),
                },
              }),
            },
          }),
        },
        expectedPluginPackages: [
          {
            location: new URL(
              'file:///backstageRoot/dist-dynamic/test-backend-plugin',
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
          '/backstageRoot': mockFs.directory({
            items: {
              'dist-dynamic': mockFs.directory({
                items: {
                  'test-backend-plugin': mockFs.file({}),
                },
              }),
            },
          }),
        },
        expectedPluginPackages: [],
        expectedLogs: {
          infos: [
            {
              message:
                "skipping '/backstageRoot/dist-dynamic/test-backend-plugin' since it is not a directory",
            },
          ],
        },
      },
      {
        name: 'ignored folder child symlink: target is not a directory',
        fileSystem: {
          '/backstageRoot': mockFs.directory({
            items: {
              'dist-dynamic': mockFs.directory({
                items: {
                  'test-backend-plugin': mockFs.symlink({
                    path: '/somewhere-else/test-backend-plugin-target',
                  }),
                },
              }),
            },
          }),
          '/somewhere-else': mockFs.directory({
            items: {
              'test-backend-plugin-target': mockFs.file({}),
            },
          }),
        },
        expectedPluginPackages: [],
        expectedLogs: {
          infos: [
            {
              message:
                "skipping '/backstageRoot/dist-dynamic/test-backend-plugin' since it is not a directory",
            },
          ],
        },
      },
      {
        name: 'alpha manifest available but not preferred',
        preferAlpha: false,
        fileSystem: {
          '/backstageRoot': mockFs.directory({
            items: {
              'dist-dynamic': mockFs.directory({
                items: {
                  'test-backend-plugin': mockFs.directory({
                    items: {
                      'package.json': mockFs.file({
                        content: JSON.stringify({
                          name: 'test-backend-plugin-dynamic',
                          version: '0.0.0',
                          main: 'dist/index.cjs.js',
                          backstage: { role: 'backend-plugin' },
                        }),
                      }),
                      alpha: mockFs.directory({
                        items: {
                          'package.json': mockFs.file({
                            content: JSON.stringify({
                              name: 'test-backend-plugin-dynamic',
                              version: '0.0.0',
                              main: '../dist/alpha.cjs.js',
                            }),
                          }),
                        },
                      }),
                    },
                  }),
                },
              }),
            },
          }),
        },
        expectedPluginPackages: [
          {
            location: new URL(
              'file:///backstageRoot/dist-dynamic/test-backend-plugin',
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
          '/backstageRoot': mockFs.directory({
            items: {
              'dist-dynamic': mockFs.directory({
                items: {
                  'test-backend-plugin': mockFs.directory({
                    items: {
                      'package.json': mockFs.file({
                        content: JSON.stringify({
                          name: 'test-backend-plugin-dynamic',
                          version: '0.0.0',
                          main: 'dist/index.cjs.js',
                          backstage: { role: 'backend-plugin' },
                        }),
                      }),
                      alpha: mockFs.directory({
                        items: {
                          'package.json': mockFs.file({
                            content: JSON.stringify({
                              name: 'test-backend-plugin-dynamic',
                              version: '0.0.0',
                              main: '../dist/alpha.cjs.js',
                            }),
                          }),
                        },
                      }),
                    },
                  }),
                },
              }),
            },
          }),
        },
        expectedPluginPackages: [
          {
            location: new URL(
              'file:///backstageRoot/dist-dynamic/test-backend-plugin/alpha',
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
          '/backstageRoot': mockFs.directory({
            items: {
              'dist-dynamic': mockFs.directory({
                items: {
                  'test-backend-plugin': mockFs.directory({
                    items: {
                      'package.json': mockFs.file({
                        content: JSON.stringify({
                          name: 'test-backend-plugin-dynamic',
                          version: '0.0.0',
                          main: 'dist/index.cjs.js',
                          backstage: { role: 'backend-plugin' },
                        }),
                      }),
                      alpha: mockFs.file({}),
                    },
                  }),
                },
              }),
            },
          }),
        },
        expectedPluginPackages: [
          {
            location: new URL(
              'file:///backstageRoot/dist-dynamic/test-backend-plugin',
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
              message:
                "skipping '/backstageRoot/dist-dynamic/test-backend-plugin/alpha' since it is not a directory",
            },
          ],
        },
      },
      {
        name: 'invalid alpha package.json',
        preferAlpha: true,
        fileSystem: {
          '/backstageRoot': mockFs.directory({
            items: {
              'dist-dynamic': mockFs.directory({
                items: {
                  'test-backend-plugin': mockFs.directory({
                    items: {
                      'package.json': mockFs.file({
                        content: JSON.stringify({
                          name: 'test-backend-plugin-dynamic',
                          version: '0.0.0',
                          main: 'dist/index.cjs.js',
                          backstage: { role: 'backend-plugin' },
                        }),
                      }),
                      alpha: mockFs.directory({
                        items: {
                          'package.json': mockFs.file({
                            content: "invalid json content, 1, '",
                          }),
                        },
                      }),
                    },
                  }),
                },
              }),
            },
          }),
        },
        expectedPluginPackages: [],
        expectedLogs: {
          errors: [
            {
              message:
                "failed to load dynamic plugin manifest from '/backstageRoot/dist-dynamic/test-backend-plugin/alpha'",
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
          '/backstageRoot': mockFs.directory({
            items: {
              'dist-dynamic': mockFs.directory({
                items: {
                  'test-backend-plugin': mockFs.directory({
                    items: {
                      'package.json': mockFs.file({
                        content: "invalid json content, 1, '",
                      }),
                    },
                  }),
                },
              }),
            },
          }),
        },
        expectedPluginPackages: [],
        expectedLogs: {
          errors: [
            {
              message:
                "failed to load dynamic plugin manifest from '/backstageRoot/dist-dynamic/test-backend-plugin'",
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
          '/backstageRoot': mockFs.directory({
            items: {
              'dist-dynamic': mockFs.directory({
                items: {
                  'test-backend-plugin': mockFs.directory({
                    items: {
                      'package.json': mockFs.file({
                        content: JSON.stringify({
                          name: 'test-backend-plugin-dynamic',
                          version: '0.0.0',
                          main: 'dist/index.cjs.js',
                        }),
                      }),
                    },
                  }),
                },
              }),
            },
          }),
        },
        expectedPluginPackages: [],
        expectedLogs: {
          errors: [
            {
              message:
                "failed to load dynamic plugin manifest from '/backstageRoot/dist-dynamic/test-backend-plugin'",
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
          '/backstageRoot': mockFs.directory({
            items: {
              'dist-dynamic': mockFs.directory({
                items: {
                  'test-backend-plugin': mockFs.directory({
                    items: {
                      'package.json': mockFs.file({
                        content: JSON.stringify({
                          name: 'test-backend-plugin-dynamic',
                          version: '0.0.0',
                          backstage: { role: 'backend-plugin' },
                        }),
                      }),
                    },
                  }),
                },
              }),
            },
          }),
        },
        expectedPluginPackages: [],
        expectedLogs: {
          errors: [
            {
              message:
                "failed to load dynamic plugin manifest from '/backstageRoot/dist-dynamic/test-backend-plugin'",
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
      const backstageRoot = '/backstageRoot';
      async function toTest(): Promise<ScannedPluginPackage[]> {
        const pluginScanner = new PluginScanner(
          new ConfigReader(
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
          tc.preferAlpha === undefined ? false : tc.preferAlpha,
        );
        return await pluginScanner.scanRoot();
      }
      if (tc.fileSystem) {
        mockFs(tc.fileSystem);
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
