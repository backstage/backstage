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

import { mockApis, registerMswTestHooks } from '@backstage/test-utils';
import {
  DynamicFrontendFeaturesLoaderOptions,
  dynamicFrontendFeaturesLoader,
} from './loader';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { RemoteEntryExports } from '@module-federation/runtime/types';
import { Module } from '@module-federation/sdk';
import { createFrontendPlugin } from '@backstage/frontend-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { InternalFrontendFeatureLoader } from '../../frontend-plugin-api/src/wiring/createFrontendFeatureLoader';
import { resetFederationGlobalInfo } from '@module-federation/runtime/core';

const baseUrl = 'http://localhost:7007';

describe('dynamicFrontendFeaturesLoader', () => {
  const server = setupServer();
  registerMswTestHooks(server);
  const mocks = {
    console: {
      error: jest.spyOn(console, 'error').mockImplementation(() => {}),
      warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
      info: jest.spyOn(console, 'info').mockImplementation(() => {}),
      debug: jest.spyOn(console, 'debug').mockImplementation(() => {}),
    },
    federation: {
      get: jest.fn((_: { name: string; id: string }): Module => ({})),
      onLoad: jest.fn(() => {}),
    },
  };

  const getCommonOptions = (): DynamicFrontendFeaturesLoaderOptions => ({
    moduleFederation: {
      // We add this module federation plugin to mock the
      // effective retrieval of the remote content, since it
      // normally requires a host application built with module federation support,
      // and won't work by default in Jest tests.
      plugins: [
        {
          name: 'load-entry-mock',
          loadEntry: async args => {
            return {
              get: (id: string) => async () => {
                return await mocks.federation.get({
                  name: args.remoteInfo.name,
                  id,
                });
              },
              init: async () => {},
            } as RemoteEntryExports;
          },
          onLoad: mocks.federation.onLoad,
        },
      ],
    },
  });

  const manifestDummyData = {
    metaData: {
      buildInfo: {},
      remoteEntry: {
        name: 'remoteEntry.js',
      },
      types: {},
      publicPath: 'auto',
    },
    shared: [],
  };

  const manifestExposedRemoteDummyData = {
    assets: {
      js: {
        sync: [],
        async: [],
      },
      css: {
        sync: [],
        async: [],
      },
    },
  };

  afterEach(() => {
    mocks.console.error.mockReset();
    mocks.console.warn.mockReset();
    mocks.console.info.mockReset();
    mocks.console.debug.mockReset();
    mocks.federation.get.mockReset();
    mocks.federation.onLoad.mockReset();
    resetFederationGlobalInfo();
  });

  it('should return immediately if dynamic plugins are not enabled in config', async () => {
    let manifestsEndpointCalled = false;
    server.use(
      rest.get(
        `${baseUrl}/.backstage/dynamic-plugins/remotes`,
        (_, res, ctx) => {
          manifestsEndpointCalled = true;
          return res(ctx.json({}));
        },
      ),
    );

    const features = await (
      dynamicFrontendFeaturesLoader({
        ...getCommonOptions(),
      }) as InternalFrontendFeatureLoader
    ).loader({
      config: mockApis.config({
        data: {
          app: {
            experimental: {
              packages: {
                include: [],
              },
            },
          },
          backend: {
            baseUrl,
          },
        },
      }),
    });

    const errorCalls = mocks.console.error.mock.calls.flatMap(e => e[0]);
    expect(errorCalls).toEqual([]);
    const warnCalls = mocks.console.warn.mock.calls.flatMap(e => e[0]);
    expect(warnCalls).toEqual([]);
    expect(features).toMatchObject([]);
    const infoCalls = mocks.console.info.mock.calls.flatMap(e => e[0]);
    expect(infoCalls).toEqual([]);
    expect(mocks.federation.get.mock.calls.flatMap(e => e[0])).toEqual([]);
    expect(manifestsEndpointCalled).toBe(false);
  });

  it('should load a dynamic frontend plugin with the default exposed remote module', async () => {
    server.use(
      rest.get(
        `${baseUrl}/.backstage/dynamic-features/remotes`,
        (_, res, ctx) =>
          res(
            ctx.json([
              {
                packageName: 'plugin-test-dynamic',
                exposedModules: ['.'],
                remoteInfo: {
                  name: 'test_plugin',
                  entry: `${baseUrl}/.backstage/dynamic-features/remotes/plugin-test-dynamic/mf-manifest.json`,
                },
              },
            ]),
          ),
      ),
      rest.get(
        `${baseUrl}/.backstage/dynamic-features/remotes/plugin-test-dynamic/mf-manifest.json`,
        (_, res, ctx) =>
          res(
            ctx.json({
              name: 'test_plugin',
              ...manifestDummyData,
              exposes: [
                {
                  id: 'test_plugin:.',
                  name: '.',
                  path: '.',
                  ...manifestExposedRemoteDummyData,
                },
              ],
            }),
          ),
      ),
    );

    mocks.federation.get.mockReturnValue({
      default: createFrontendPlugin({
        id: 'test-plugin',
        extensions: [],
      }),
    });

    const features = await (
      dynamicFrontendFeaturesLoader({
        ...getCommonOptions(),
      }) as InternalFrontendFeatureLoader
    ).loader({
      config: mockApis.config({
        data: {
          app: {
            experimental: {
              packages: {
                include: [],
              },
            },
          },
          backend: {
            baseUrl,
          },
          dynamicPlugins: {},
        },
      }),
    });

    const errorCalls = mocks.console.error.mock.calls.flatMap(e => e[0]);
    expect(errorCalls).toEqual([]);
    const warnCalls = mocks.console.warn.mock.calls.flatMap(e => e[0]);
    expect(warnCalls).toEqual([]);
    expect(features).toMatchObject([
      {
        $$type: '@backstage/FrontendPlugin',
        id: 'test-plugin',
        version: 'v1',
      },
    ]);
    const infoCalls = mocks.console.info.mock.calls.flatMap(e => e[0]);
    expect(infoCalls).toEqual([
      "Remote module 'test_plugin' of dynamic plugin 'plugin-test-dynamic' loaded from http://localhost:7007/.backstage/dynamic-features/remotes/plugin-test-dynamic/mf-manifest.json",
    ]);
    const debugCalls = mocks.console.debug.mock.calls.flatMap(e => e[0]);
    expect(debugCalls).toEqual([
      "Loading dynamic plugin 'plugin-test-dynamic' from 'http://localhost:7007/.backstage/dynamic-features/remotes/plugin-test-dynamic/mf-manifest.json'",
    ]);
    expect(mocks.federation.get.mock.calls.flatMap(e => e[0])).toEqual([
      {
        id: '.',
        name: 'test_plugin',
      },
    ]);
  });

  it('should load several dynamic frontend plugins', async () => {
    server.use(
      rest.get(
        `${baseUrl}/.backstage/dynamic-features/remotes`,
        (_, res, ctx) =>
          res(
            ctx.json([
              {
                packageName: 'plugin-1',
                exposedModules: ['.'],
                remoteInfo: {
                  name: 'plugin_1',
                  entry: `${baseUrl}/.backstage/dynamic-features/remotes/plugin-1/mf-manifest.json`,
                },
              },
              {
                packageName: 'plugin-2',
                exposedModules: ['.'],
                remoteInfo: {
                  name: 'plugin_2',
                  entry: `${baseUrl}/.backstage/dynamic-features/remotes/plugin-2/mf-manifest.json`,
                },
              },
            ]),
          ),
      ),
      rest.get(
        `${baseUrl}/.backstage/dynamic-features/remotes/plugin-1/mf-manifest.json`,
        (_, res, ctx) =>
          res(
            ctx.json({
              name: 'plugin_1',
              ...manifestDummyData,
              exposes: [
                {
                  id: 'plugin_1:.',
                  name: '.',
                  path: '.',
                  ...manifestExposedRemoteDummyData,
                },
              ],
            }),
          ),
      ),
      rest.get(
        `${baseUrl}/.backstage/dynamic-features/remotes/plugin-2/mf-manifest.json`,
        (_, res, ctx) =>
          res(
            ctx.json({
              name: 'plugin_2',
              ...manifestDummyData,
              exposes: [
                {
                  id: 'plugin_2:.',
                  name: '.',
                  path: '.',
                  ...manifestExposedRemoteDummyData,
                },
              ],
            }),
          ),
      ),
    );

    mocks.federation.get.mockReturnValueOnce({
      default: createFrontendPlugin({
        id: 'plugin-1',
        extensions: [],
      }),
    });
    mocks.federation.get.mockReturnValueOnce({
      default: createFrontendPlugin({
        id: 'plugin-2',
        extensions: [],
      }),
    });

    const features = await (
      dynamicFrontendFeaturesLoader({
        ...getCommonOptions(),
      }) as InternalFrontendFeatureLoader
    ).loader({
      config: mockApis.config({
        data: {
          app: {
            experimental: {
              packages: {
                include: [],
              },
            },
          },
          backend: {
            baseUrl,
          },
          dynamicPlugins: {},
        },
      }),
    });

    const errorCalls = mocks.console.error.mock.calls.flatMap(e => e[0]);
    expect(errorCalls).toEqual([]);
    const warnCalls = mocks.console.warn.mock.calls.flatMap(e => e[0]);
    expect(warnCalls).toEqual([]);
    expect(features).toMatchObject([
      {
        $$type: '@backstage/FrontendPlugin',
        id: 'plugin-1',
        version: 'v1',
      },
      {
        $$type: '@backstage/FrontendPlugin',
        id: 'plugin-2',
        version: 'v1',
      },
    ]);
    const infoCalls = mocks.console.info.mock.calls.flatMap(e => e[0]);
    expect(infoCalls).toEqual([
      "Remote module 'plugin_1' of dynamic plugin 'plugin-1' loaded from http://localhost:7007/.backstage/dynamic-features/remotes/plugin-1/mf-manifest.json",
      "Remote module 'plugin_2' of dynamic plugin 'plugin-2' loaded from http://localhost:7007/.backstage/dynamic-features/remotes/plugin-2/mf-manifest.json",
    ]);
    const debugCalls = mocks.console.debug.mock.calls.flatMap(e => e[0]);
    expect(debugCalls).toEqual([
      "Loading dynamic plugin 'plugin-1' from 'http://localhost:7007/.backstage/dynamic-features/remotes/plugin-1/mf-manifest.json'",
      "Loading dynamic plugin 'plugin-2' from 'http://localhost:7007/.backstage/dynamic-features/remotes/plugin-2/mf-manifest.json'",
    ]);
    expect(mocks.federation.get.mock.calls.flatMap(e => e[0])).toEqual([
      {
        id: '.',
        name: 'plugin_1',
      },
      {
        id: '.',
        name: 'plugin_2',
      },
    ]);
  });

  it('should load a dynamic frontend plugin with several exposed remote modules', async () => {
    server.use(
      rest.get(
        `${baseUrl}/.backstage/dynamic-features/remotes`,
        (_, res, ctx) =>
          res(
            ctx.json([
              {
                packageName: 'plugin-test-dynamic',
                exposedModules: ['.', 'alpha'],
                remoteInfo: {
                  name: 'test_plugin',
                  entry: `${baseUrl}/.backstage/dynamic-features/remotes/plugin-test-dynamic/mf-manifest.json`,
                },
              },
            ]),
          ),
      ),
      rest.get(
        `${baseUrl}/.backstage/dynamic-features/remotes/plugin-test-dynamic/mf-manifest.json`,
        (_, res, ctx) =>
          res(
            ctx.json({
              name: 'test_plugin',
              ...manifestDummyData,
              exposes: [
                {
                  id: 'test_plugin:.',
                  name: '.',
                  path: '.',
                  ...manifestExposedRemoteDummyData,
                },
                {
                  id: 'test_plugin:alpha',
                  name: 'alpha',
                  path: './alpha',
                  ...manifestExposedRemoteDummyData,
                },
              ],
            }),
          ),
      ),
    );

    mocks.federation.get.mockReturnValueOnce({
      default: createFrontendPlugin({
        id: 'test-plugin',
        extensions: [],
      }),
    });
    mocks.federation.get.mockReturnValueOnce({
      default: createFrontendPlugin({
        id: 'test-plugin-alpha',
        extensions: [],
      }),
    });

    const features = await (
      dynamicFrontendFeaturesLoader({
        ...getCommonOptions(),
      }) as InternalFrontendFeatureLoader
    ).loader({
      config: mockApis.config({
        data: {
          app: {
            experimental: {
              packages: {
                include: [],
              },
            },
          },
          backend: {
            baseUrl,
          },
          dynamicPlugins: {},
        },
      }),
    });

    const errorCalls = mocks.console.error.mock.calls.flatMap(e => e[0]);
    expect(errorCalls).toEqual([]);
    const warnCalls = mocks.console.warn.mock.calls.flatMap(e => e[0]);
    expect(warnCalls).toEqual([]);
    expect(features).toMatchObject([
      {
        $$type: '@backstage/FrontendPlugin',
        id: 'test-plugin',
        version: 'v1',
      },
      {
        $$type: '@backstage/FrontendPlugin',
        id: 'test-plugin-alpha',
        version: 'v1',
      },
    ]);
    const infoCalls = mocks.console.info.mock.calls.flatMap(e => e[0]);
    expect(infoCalls).toEqual([
      "Remote module 'test_plugin' of dynamic plugin 'plugin-test-dynamic' loaded from http://localhost:7007/.backstage/dynamic-features/remotes/plugin-test-dynamic/mf-manifest.json",
      "Remote module 'test_plugin/alpha' of dynamic plugin 'plugin-test-dynamic' loaded from http://localhost:7007/.backstage/dynamic-features/remotes/plugin-test-dynamic/mf-manifest.json",
    ]);
    const debugCalls = mocks.console.debug.mock.calls.flatMap(e => e[0]);
    expect(debugCalls).toEqual([
      "Loading dynamic plugin 'plugin-test-dynamic' from 'http://localhost:7007/.backstage/dynamic-features/remotes/plugin-test-dynamic/mf-manifest.json'",
    ]);
    expect(mocks.federation.get.mock.calls.flatMap(e => e[0])).toEqual([
      {
        id: '.',
        name: 'test_plugin',
      },
      {
        id: './alpha',
        name: 'test_plugin',
      },
    ]);
  });

  it('should load a dynamic frontend plugin from Javascript remote entry', async () => {
    mocks.federation.get.mockRestore();
    mocks.federation.onLoad.mockRestore();
    server.use(
      rest.get(
        `${baseUrl}/.backstage/dynamic-features/remotes`,
        (_, res, ctx) =>
          res(
            ctx.json([
              {
                packageName: 'plugin-test-dynamic',
                exposedModules: ['.'],
                remoteInfo: {
                  name: 'test_plugin',
                  entry: `${baseUrl}/.backstage/dynamic-features/remotes/plugin-test-dynamic/remoteEntry.js`,
                  type: 'jsonp',
                },
              },
            ]),
          ),
      ),
      rest.get(
        `${baseUrl}/.backstage/dynamic-features/remotes/plugin-test-dynamic/remoteEntry.js`,
        (_, res, ctx) => res(ctx.text('coucou :-)')),
      ),
    );

    mocks.federation.get.mockReturnValueOnce({
      default: createFrontendPlugin({
        id: 'test-plugin',
        extensions: [],
      }),
    });

    const features = await (
      dynamicFrontendFeaturesLoader({
        ...getCommonOptions(),
      }) as InternalFrontendFeatureLoader
    ).loader({
      config: mockApis.config({
        data: {
          app: {
            experimental: {
              packages: {
                include: [],
              },
            },
          },
          backend: {
            baseUrl,
          },
          dynamicPlugins: {},
        },
      }),
    });

    const errorCalls = mocks.console.error.mock.calls.flatMap(e => e[0]);
    expect(errorCalls).toEqual([]);
    const warnCalls = mocks.console.warn.mock.calls.flatMap(e => e[0]);
    expect(warnCalls).toEqual([]);
    expect(features).toMatchObject([
      {
        $$type: '@backstage/FrontendPlugin',
        id: 'test-plugin',
        version: 'v1',
      },
    ]);
    const infoCalls = mocks.console.info.mock.calls.flatMap(e => e[0]);
    expect(infoCalls).toEqual([
      "Remote module 'test_plugin' of dynamic plugin 'plugin-test-dynamic' loaded from http://localhost:7007/.backstage/dynamic-features/remotes/plugin-test-dynamic/remoteEntry.js",
    ]);
    const debugCalls = mocks.console.debug.mock.calls.flatMap(e => e[0]);
    expect(debugCalls).toEqual([
      "Loading dynamic plugin 'plugin-test-dynamic' from 'http://localhost:7007/.backstage/dynamic-features/remotes/plugin-test-dynamic/remoteEntry.js'",
    ]);
    expect(mocks.federation.get.mock.calls.flatMap(e => e[0])).toEqual([
      {
        id: '.',
        name: 'test_plugin',
      },
    ]);
  });

  it('should warn and recover from a 404 error fetching module feredation configuration', async () => {
    server.use(
      rest.get(
        `${baseUrl}/.backstage/dynamic-features/remotes`,
        (_, res, ctx) => res(ctx.status(404, 'NOT FOUND')),
      ),
    );

    mocks.federation.get.mockReturnValue({
      default: createFrontendPlugin({
        id: 'test-plugin',
        extensions: [],
      }),
    });

    const features = await (
      dynamicFrontendFeaturesLoader({
        ...getCommonOptions(),
      }) as InternalFrontendFeatureLoader
    ).loader({
      config: mockApis.config({
        data: {
          app: {
            experimental: {
              packages: {
                include: [],
              },
            },
          },
          backend: {
            baseUrl,
          },
          dynamicPlugins: {},
        },
      }),
    });

    const errorCalls = mocks.console.error.mock.calls.flatMap(e => e[0]);
    expect(errorCalls).toEqual([
      `Failed fetching module federation configuration of dynamic frontend plugins: Error: 404 - NOT FOUND`,
    ]);
    const warnCalls = mocks.console.warn.mock.calls.flatMap(e => e[0]);
    expect(warnCalls).toEqual([]);
    expect(features).toMatchObject([]);
    const infoCalls = mocks.console.info.mock.calls.flatMap(e => e[0]);
    expect(infoCalls).toEqual([]);
    expect(mocks.federation.get.mock.calls.flatMap(e => e[0])).toEqual([]);
  });

  it('should warn and recover from empty response while fetching module feredation configuration', async () => {
    server.use(
      rest.get(
        `${baseUrl}/.backstage/dynamic-features/remotes`,
        (_, res, ctx) => res(ctx.status(200)),
      ),
    );

    mocks.federation.get.mockReturnValue({
      default: createFrontendPlugin({
        id: 'test-plugin',
        extensions: [],
      }),
    });

    const features = await (
      dynamicFrontendFeaturesLoader({
        ...getCommonOptions(),
      }) as InternalFrontendFeatureLoader
    ).loader({
      config: mockApis.config({
        data: {
          app: {
            experimental: {
              packages: {
                include: [],
              },
            },
          },
          backend: {
            baseUrl,
          },
          dynamicPlugins: {},
        },
      }),
    });

    const errorCalls = mocks.console.error.mock.calls.flatMap(e => e[0]);
    expect(errorCalls).toEqual([
      `Failed fetching module federation configuration of dynamic frontend plugins: FetchError: invalid json response body at http://localhost:7007/.backstage/dynamic-features/remotes reason: Unexpected end of JSON input`,
    ]);
    const warnCalls = mocks.console.warn.mock.calls.flatMap(e => e[0]);
    expect(warnCalls).toEqual([]);
    expect(features).toMatchObject([]);
    const infoCalls = mocks.console.info.mock.calls.flatMap(e => e[0]);
    expect(infoCalls).toEqual([]);
    expect(mocks.federation.get.mock.calls.flatMap(e => e[0])).toEqual([]);
  });

  it('should warn on empty module, but still load other remotes', async () => {
    server.use(
      rest.get(
        `${baseUrl}/.backstage/dynamic-features/remotes`,
        (_, res, ctx) =>
          res(
            ctx.json([
              {
                packageName: 'plugin-1',
                exposedModules: ['.'],
                remoteInfo: {
                  name: 'plugin_1',
                  entry: `${baseUrl}/.backstage/dynamic-features/remotes/plugin-1/mf-manifest.json`,
                },
              },
              {
                packageName: 'plugin-2',
                exposedModules: ['.'],
                remoteInfo: {
                  name: 'plugin_2',
                  entry: `${baseUrl}/.backstage/dynamic-features/remotes/plugin-2/mf-manifest.json`,
                },
              },
            ]),
          ),
      ),
      rest.get(
        `${baseUrl}/.backstage/dynamic-features/remotes/plugin-1/mf-manifest.json`,
        (_, res, ctx) =>
          res(
            ctx.json({
              name: 'plugin_1',
              ...manifestDummyData,
              exposes: [
                {
                  id: 'plugin_1:.',
                  name: '.',
                  path: '.',
                  ...manifestExposedRemoteDummyData,
                },
              ],
            }),
          ),
      ),
      rest.get(
        `${baseUrl}/.backstage/dynamic-features/remotes/plugin-2/mf-manifest.json`,
        (_, res, ctx) =>
          res(
            ctx.json({
              name: 'plugin_2',
              ...manifestDummyData,
              exposes: [
                {
                  id: 'plugin_2:.',
                  name: '.',
                  path: '.',
                  ...manifestExposedRemoteDummyData,
                },
              ],
            }),
          ),
      ),
    );

    mocks.federation.get.mockReturnValueOnce(undefined);
    mocks.federation.get.mockReturnValueOnce({
      default: createFrontendPlugin({
        id: 'plugin-2',
        extensions: [],
      }),
    });

    const features = await (
      dynamicFrontendFeaturesLoader({
        ...getCommonOptions(),
      }) as InternalFrontendFeatureLoader
    ).loader({
      config: mockApis.config({
        data: {
          app: {
            experimental: {
              packages: {
                include: [],
              },
            },
          },
          backend: {
            baseUrl,
          },
          dynamicPlugins: {},
        },
      }),
    });

    const errorCalls = mocks.console.error.mock.calls.flatMap(e => e[0]);
    expect(errorCalls).toEqual([]);
    const warnCalls = mocks.console.warn.mock.calls.flatMap(e => e[0]);
    expect(warnCalls).toEqual([
      "Skipping empty dynamic plugin remote module 'plugin_1'.",
    ]);
    expect(features).toMatchObject([
      {
        $$type: '@backstage/FrontendPlugin',
        id: 'plugin-2',
        version: 'v1',
      },
    ]);
    const infoCalls = mocks.console.info.mock.calls.flatMap(e => e[0]);
    expect(infoCalls).toEqual([
      "Remote module 'plugin_2' of dynamic plugin 'plugin-2' loaded from http://localhost:7007/.backstage/dynamic-features/remotes/plugin-2/mf-manifest.json",
    ]);
    const debugCalls = mocks.console.debug.mock.calls.flatMap(e => e[0]);
    expect(debugCalls).toEqual([
      "Loading dynamic plugin 'plugin-1' from 'http://localhost:7007/.backstage/dynamic-features/remotes/plugin-1/mf-manifest.json'",
      "Loading dynamic plugin 'plugin-2' from 'http://localhost:7007/.backstage/dynamic-features/remotes/plugin-2/mf-manifest.json'",
    ]);
    expect(mocks.federation.get.mock.calls.flatMap(e => e[0])).toEqual([
      {
        id: '.',
        name: 'plugin_1',
      },
      {
        id: '.',
        name: 'plugin_2',
      },
    ]);
  });

  it('should skip module without default export, but still load other remotes', async () => {
    server.use(
      rest.get(
        `${baseUrl}/.backstage/dynamic-features/remotes`,
        (_, res, ctx) =>
          res(
            ctx.json([
              {
                packageName: 'plugin-1',
                exposedModules: ['.'],
                remoteInfo: {
                  name: 'plugin_1',
                  entry: `${baseUrl}/.backstage/dynamic-features/remotes/plugin-1/mf-manifest.json`,
                },
              },
              {
                packageName: 'plugin-2',
                exposedModules: ['.'],
                remoteInfo: {
                  name: 'plugin_2',
                  entry: `${baseUrl}/.backstage/dynamic-features/remotes/plugin-2/mf-manifest.json`,
                },
              },
            ]),
          ),
      ),
      rest.get(
        `${baseUrl}/.backstage/dynamic-features/remotes/plugin-1/mf-manifest.json`,
        (_, res, ctx) =>
          res(
            ctx.json({
              name: 'plugin_1',
              ...manifestDummyData,
              exposes: [
                {
                  id: 'plugin_1:.',
                  name: '.',
                  path: '.',
                  ...manifestExposedRemoteDummyData,
                },
              ],
            }),
          ),
      ),
      rest.get(
        `${baseUrl}/.backstage/dynamic-features/remotes/plugin-2/mf-manifest.json`,
        (_, res, ctx) =>
          res(
            ctx.json({
              name: 'plugin_2',
              ...manifestDummyData,
              exposes: [
                {
                  id: 'plugin_2:.',
                  name: '.',
                  path: '.',
                  ...manifestExposedRemoteDummyData,
                },
              ],
            }),
          ),
      ),
    );

    mocks.federation.get.mockReturnValueOnce({
      anExport: 'anExportValue',
    });
    mocks.federation.get.mockReturnValueOnce({
      default: createFrontendPlugin({
        id: 'plugin-2',
        extensions: [],
      }),
    });

    const features = await (
      dynamicFrontendFeaturesLoader({
        ...getCommonOptions(),
      }) as InternalFrontendFeatureLoader
    ).loader({
      config: mockApis.config({
        data: {
          app: {
            experimental: {
              packages: {
                include: [],
              },
            },
          },
          backend: {
            baseUrl,
          },
          dynamicPlugins: {},
        },
      }),
    });

    const errorCalls = mocks.console.error.mock.calls.flatMap(e => e[0]);
    expect(errorCalls).toEqual([]);
    const warnCalls = mocks.console.warn.mock.calls.flatMap(e => e[0]);
    expect(warnCalls).toEqual([]);
    expect(features).toMatchObject([
      {
        $$type: '@backstage/FrontendPlugin',
        id: 'plugin-2',
        version: 'v1',
      },
    ]);
    const infoCalls = mocks.console.info.mock.calls.flatMap(e => e[0]);
    expect(infoCalls).toEqual([
      "Remote module 'plugin_1' of dynamic plugin 'plugin-1' loaded from http://localhost:7007/.backstage/dynamic-features/remotes/plugin-1/mf-manifest.json",
      "Remote module 'plugin_2' of dynamic plugin 'plugin-2' loaded from http://localhost:7007/.backstage/dynamic-features/remotes/plugin-2/mf-manifest.json",
    ]);
    const debugCalls = mocks.console.debug.mock.calls.flatMap(e => e[0]);
    expect(debugCalls).toEqual([
      "Loading dynamic plugin 'plugin-1' from 'http://localhost:7007/.backstage/dynamic-features/remotes/plugin-1/mf-manifest.json'",
      "Loading dynamic plugin 'plugin-2' from 'http://localhost:7007/.backstage/dynamic-features/remotes/plugin-2/mf-manifest.json'",
      "Skipping dynamic plugin remote module '[object Object]' since it doesn't export a new 'FrontendFeature' as default export.",
    ]);
    expect(mocks.federation.get.mock.calls.flatMap(e => e[0])).toEqual([
      {
        id: '.',
        name: 'plugin_1',
      },
      {
        id: '.',
        name: 'plugin_2',
      },
    ]);
  });

  it('should warn on 404 error fetching module feredation manifest, but still load other remotes', async () => {
    server.use(
      rest.get(
        `${baseUrl}/.backstage/dynamic-features/remotes`,
        (_, res, ctx) =>
          res(
            ctx.json([
              {
                packageName: 'plugin-1',
                exposedModules: ['.'],
                remoteInfo: {
                  name: 'plugin_1',
                  entry: `${baseUrl}/.backstage/dynamic-features/remotes/plugin-1/mf-manifest.json`,
                },
              },
              {
                packageName: 'plugin-2',
                exposedModules: ['.'],
                remoteInfo: {
                  name: 'plugin_2',
                  entry: `${baseUrl}/.backstage/dynamic-features/remotes/plugin-2/mf-manifest.json`,
                },
              },
            ]),
          ),
      ),
      rest.get(
        `${baseUrl}/.backstage/dynamic-features/remotes/plugin-1/mf-manifest.json`,
        (_, res, ctx) => res(ctx.json({}), ctx.status(404, 'NOT FOUND')),
      ),
      rest.get(
        `${baseUrl}/.backstage/dynamic-features/remotes/plugin-2/mf-manifest.json`,
        (_, res, ctx) =>
          res(
            ctx.json({
              name: 'plugin_2',
              ...manifestDummyData,
              exposes: [
                {
                  id: 'plugin_2:.',
                  name: '.',
                  path: '.',
                  ...manifestExposedRemoteDummyData,
                },
              ],
            }),
          ),
      ),
    );

    mocks.federation.get.mockReturnValueOnce({
      default: createFrontendPlugin({
        id: 'plugin-2',
        extensions: [],
      }),
    });

    const features = await (
      dynamicFrontendFeaturesLoader({
        ...getCommonOptions(),
      }) as InternalFrontendFeatureLoader
    ).loader({
      config: mockApis.config({
        data: {
          app: {
            experimental: {
              packages: {
                include: [],
              },
            },
          },
          backend: {
            baseUrl,
          },
          dynamicPlugins: {},
        },
      }),
    });

    const errorCalls = mocks.console.error.mock.calls.flatMap(e => e[0]);
    expect(errorCalls).toEqual([
      "Failed loading remote module 'plugin_1' of dynamic plugin 'plugin-1': Error: [ Federation Runtime ]: [ Federation Runtime ]: [ Federation Runtime ]: http://localhost:7007/.backstage/dynamic-features/remotes/plugin-1/mf-manifest.json is not a federation manifest",
    ]);
    const warnCalls = mocks.console.warn.mock.calls.flatMap(e => e[0]);
    expect(warnCalls).toEqual([]);
    expect(features).toMatchObject([
      {
        $$type: '@backstage/FrontendPlugin',
        id: 'plugin-2',
        version: 'v1',
      },
    ]);
    const infoCalls = mocks.console.info.mock.calls.flatMap(e => e[0]);
    expect(infoCalls).toEqual([
      "Remote module 'plugin_2' of dynamic plugin 'plugin-2' loaded from http://localhost:7007/.backstage/dynamic-features/remotes/plugin-2/mf-manifest.json",
    ]);
    const debugCalls = mocks.console.debug.mock.calls.flatMap(e => e[0]);
    expect(debugCalls).toEqual([
      "Loading dynamic plugin 'plugin-1' from 'http://localhost:7007/.backstage/dynamic-features/remotes/plugin-1/mf-manifest.json'",
      "Loading dynamic plugin 'plugin-2' from 'http://localhost:7007/.backstage/dynamic-features/remotes/plugin-2/mf-manifest.json'",
    ]);

    expect(mocks.federation.get.mock.calls.flatMap(e => e[0])).toEqual([
      {
        id: '.',
        name: 'plugin_2',
      },
    ]);
  });

  it('should warn on unexpected Json content while fetching module feredation manifest, but still load other remotes', async () => {
    server.use(
      rest.get(
        `${baseUrl}/.backstage/dynamic-features/remotes`,
        (_, res, ctx) =>
          res(
            ctx.json([
              {
                packageName: 'plugin-1',
                exposedModules: ['.'],
                remoteInfo: {
                  name: 'plugin_1',
                  entry: `${baseUrl}/.backstage/dynamic-features/remotes/plugin-1/mf-manifest.json`,
                },
              },
              {
                packageName: 'plugin-2',
                exposedModules: ['.'],
                remoteInfo: {
                  name: 'plugin_2',
                  entry: `${baseUrl}/.backstage/dynamic-features/remotes/plugin-2/mf-manifest.json`,
                },
              },
            ]),
          ),
      ),
      rest.get(
        `${baseUrl}/.backstage/dynamic-features/remotes/plugin-1/mf-manifest.json`,
        (_, res, ctx) => res(ctx.json('A Json String')),
      ),
      rest.get(
        `${baseUrl}/.backstage/dynamic-features/remotes/plugin-2/mf-manifest.json`,
        (_, res, ctx) =>
          res(
            ctx.json({
              name: 'plugin-2',
              ...manifestDummyData,
              exposes: [
                {
                  id: 'plugin-2:.',
                  name: '.',
                  path: '.',
                  ...manifestExposedRemoteDummyData,
                },
              ],
            }),
          ),
      ),
    );

    mocks.federation.get.mockReturnValueOnce({
      default: createFrontendPlugin({
        id: 'plugin-2',
        extensions: [],
      }),
    });

    const features = await (
      dynamicFrontendFeaturesLoader({
        ...getCommonOptions(),
      }) as InternalFrontendFeatureLoader
    ).loader({
      config: mockApis.config({
        data: {
          app: {
            experimental: {
              packages: {
                include: [],
              },
            },
          },
          backend: {
            baseUrl,
          },
          dynamicPlugins: {},
        },
      }),
    });

    const errorCalls = mocks.console.error.mock.calls.flatMap(e => e[0]);
    expect(errorCalls).toEqual([
      "Failed loading remote module 'plugin_1' of dynamic plugin 'plugin-1': Error: [ Federation Runtime ]: [ Federation Runtime ]: [ Federation Runtime ]: http://localhost:7007/.backstage/dynamic-features/remotes/plugin-1/mf-manifest.json is not a federation manifest",
    ]);
    const warnCalls = mocks.console.warn.mock.calls.flatMap(e => e[0]);
    expect(warnCalls).toEqual([]);
    expect(features).toMatchObject([
      {
        $$type: '@backstage/FrontendPlugin',
        id: 'plugin-2',
        version: 'v1',
      },
    ]);
    const infoCalls = mocks.console.info.mock.calls.flatMap(e => e[0]);
    expect(infoCalls).toEqual([
      "Remote module 'plugin_2' of dynamic plugin 'plugin-2' loaded from http://localhost:7007/.backstage/dynamic-features/remotes/plugin-2/mf-manifest.json",
    ]);
    const debugCalls = mocks.console.debug.mock.calls.flatMap(e => e[0]);
    expect(debugCalls).toEqual([
      "Loading dynamic plugin 'plugin-1' from 'http://localhost:7007/.backstage/dynamic-features/remotes/plugin-1/mf-manifest.json'",
      "Loading dynamic plugin 'plugin-2' from 'http://localhost:7007/.backstage/dynamic-features/remotes/plugin-2/mf-manifest.json'",
    ]);
    expect(mocks.federation.get.mock.calls.flatMap(e => e[0])).toEqual([
      {
        id: '.',
        name: 'plugin_2',
      },
    ]);
  });
});
