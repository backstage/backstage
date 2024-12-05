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

const baseUrl = 'http://localhost:7007';

describe('dynamicFrontendFeaturesLoader', () => {
  const server = setupServer();
  registerMswTestHooks(server);
  const mocks = {
    console: {
      error: jest.spyOn(console, 'error').mockImplementation(() => {}),
      warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
      info: jest.spyOn(console, 'info').mockImplementation(() => {}),
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
          errorLoadRemote: args => {
            // eslint-disable-next-line no-console
            console.error(args);
          },
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
    mocks.federation.get.mockReset();
  });

  it('should return the correct loader name', () => {
    expect(
      dynamicFrontendFeaturesLoader({
        ...getCommonOptions(),
      }).getLoaderName(),
    ).toBe('dynamic-plugins-loader');
  });

  it('should return immediately if dynamic plugins are not enabled in config', async () => {
    let manifestsEndpointCalled = false;
    server.use(
      rest.get(
        `${baseUrl}/api/core.dynamicplugins.frontendRemotes/manifests`,
        (_, res, ctx) => {
          manifestsEndpointCalled = true;
          return res(ctx.json({}));
        },
      ),
    );

    const features = await dynamicFrontendFeaturesLoader({
      ...getCommonOptions(),
    }).load({
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
    expect(features).toMatchObject({
      features: [],
    });
    const infoCalls = mocks.console.info.mock.calls.flatMap(e => e[0]);
    expect(infoCalls).toEqual([]);
    expect(mocks.federation.get.mock.calls.flatMap(e => e[0])).toEqual([]);
    expect(manifestsEndpointCalled).toBe(false);
  });

  it('should load a dynamic frontend plugin with the default exposed remote module', async () => {
    server.use(
      rest.get(
        `${baseUrl}/api/core.dynamicplugins.frontendRemotes/manifests`,
        (_, res, ctx) =>
          res(
            ctx.json({
              'test-plugin': `${baseUrl}/api/core.dynamicplugins.frontendRemotes/remotes/test-plugin/mf-manifest.json`,
            }),
          ),
      ),
      rest.get(
        `${baseUrl}/api/core.dynamicplugins.frontendRemotes/remotes/test-plugin/mf-manifest.json`,
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

    const features = await dynamicFrontendFeaturesLoader({
      ...getCommonOptions(),
    }).load({
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
    expect(features).toMatchObject({
      features: [
        {
          $$type: '@backstage/FrontendPlugin',
          id: 'test-plugin',
          version: 'v1',
        },
      ],
    });
    const infoCalls = mocks.console.info.mock.calls.flatMap(e => e[0]);
    expect(infoCalls).toEqual([
      "Loading dynamic plugin 'test-plugin' from 'http://localhost:7007/api/core.dynamicplugins.frontendRemotes/remotes/test-plugin/mf-manifest.json'",
      "Dynamic plugin remote module 'test-plugin' loaded from http://localhost:7007/api/core.dynamicplugins.frontendRemotes/remotes/test-plugin/mf-manifest.json",
    ]);
    expect(mocks.federation.get.mock.calls.flatMap(e => e[0])).toEqual([
      {
        id: '.',
        name: 'test-plugin',
      },
    ]);
  });

  it('should load several dynamic frontend plugins', async () => {
    server.use(
      rest.get(
        `${baseUrl}/api/core.dynamicplugins.frontendRemotes/manifests`,
        (_, res, ctx) =>
          res(
            ctx.json({
              'plugin-1': `${baseUrl}/api/core.dynamicplugins.frontendRemotes/remotes/plugin-1/mf-manifest.json`,
              'plugin-2': `${baseUrl}/api/core.dynamicplugins.frontendRemotes/remotes/plugin-2/mf-manifest.json`,
            }),
          ),
      ),
      rest.get(
        `${baseUrl}/api/core.dynamicplugins.frontendRemotes/remotes/plugin-1/mf-manifest.json`,
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
        `${baseUrl}/api/core.dynamicplugins.frontendRemotes/remotes/plugin-2/mf-manifest.json`,
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

    const features = await dynamicFrontendFeaturesLoader({
      ...getCommonOptions(),
    }).load({
      config: mockApis.config({
        data: {
          app: {
            packageName: 'app-2',
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
    expect(features).toMatchObject({
      features: [
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
      ],
    });
    const infoCalls = mocks.console.info.mock.calls.flatMap(e => e[0]);
    expect(infoCalls).toEqual([
      "Loading dynamic plugin 'plugin-1' from 'http://localhost:7007/api/core.dynamicplugins.frontendRemotes/remotes/plugin-1/mf-manifest.json'",
      "Loading dynamic plugin 'plugin-2' from 'http://localhost:7007/api/core.dynamicplugins.frontendRemotes/remotes/plugin-2/mf-manifest.json'",
      "Dynamic plugin remote module 'plugin-1' loaded from http://localhost:7007/api/core.dynamicplugins.frontendRemotes/remotes/plugin-1/mf-manifest.json",
      "Dynamic plugin remote module 'plugin-2' loaded from http://localhost:7007/api/core.dynamicplugins.frontendRemotes/remotes/plugin-2/mf-manifest.json",
    ]);
    expect(mocks.federation.get.mock.calls.flatMap(e => e[0])).toEqual([
      {
        id: '.',
        name: 'plugin-1',
      },
      {
        id: '.',
        name: 'plugin-2',
      },
    ]);
  });

  it('should load a dynamic frontend plugin with several exposed remote modules', async () => {
    server.use(
      rest.get(
        `${baseUrl}/api/core.dynamicplugins.frontendRemotes/manifests`,
        (_, res, ctx) =>
          res(
            ctx.json({
              'test-plugin': `${baseUrl}/api/core.dynamicplugins.frontendRemotes/remotes/test-plugin/mf-manifest.json`,
            }),
          ),
      ),
      rest.get(
        `${baseUrl}/api/core.dynamicplugins.frontendRemotes/remotes/test-plugin/mf-manifest.json`,
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

    const features = await dynamicFrontendFeaturesLoader({
      ...getCommonOptions(),
    }).load({
      config: mockApis.config({
        data: {
          app: {
            experimental: {
              packages: {
                include: [],
              },
            },
            packageName: 'app-3',
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
    expect(features).toMatchObject({
      features: [
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
      ],
    });
    const infoCalls = mocks.console.info.mock.calls.flatMap(e => e[0]);
    expect(infoCalls).toEqual([
      "Loading dynamic plugin 'test-plugin' from 'http://localhost:7007/api/core.dynamicplugins.frontendRemotes/remotes/test-plugin/mf-manifest.json'",
      "Dynamic plugin remote module 'test-plugin' loaded from http://localhost:7007/api/core.dynamicplugins.frontendRemotes/remotes/test-plugin/mf-manifest.json",
      "Dynamic plugin remote module 'test-plugin/alpha' loaded from http://localhost:7007/api/core.dynamicplugins.frontendRemotes/remotes/test-plugin/mf-manifest.json",
    ]);
    expect(mocks.federation.get.mock.calls.flatMap(e => e[0])).toEqual([
      {
        id: '.',
        name: 'test-plugin',
      },
      {
        id: './alpha',
        name: 'test-plugin',
      },
    ]);
  });

  it('should warn and recover from a 404 error fetching module feredation configuration', async () => {
    server.use(
      rest.get(
        `${baseUrl}/api/core.dynamicplugins.frontendRemotes/manifests`,
        (_, res, ctx) => res(ctx.status(404, 'NOT FOUND')),
      ),
    );

    mocks.federation.get.mockReturnValue({
      default: createFrontendPlugin({
        id: 'test-plugin',
        extensions: [],
      }),
    });

    const features = await dynamicFrontendFeaturesLoader({
      ...getCommonOptions(),
    }).load({
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
    expect(features).toMatchObject({
      features: [],
    });
    const infoCalls = mocks.console.info.mock.calls.flatMap(e => e[0]);
    expect(infoCalls).toEqual([]);
    expect(mocks.federation.get.mock.calls.flatMap(e => e[0])).toEqual([]);
  });

  it('should warn and recover from unexpected Json while fetching module feredation configuration', async () => {
    server.use(
      rest.get(
        `${baseUrl}/api/core.dynamicplugins.frontendRemotes/manifests`,
        (_, res, ctx) => res(ctx.json('A Json String')),
      ),
    );

    mocks.federation.get.mockReturnValue({
      default: createFrontendPlugin({
        id: 'test-plugin',
        extensions: [],
      }),
    });

    const features = await dynamicFrontendFeaturesLoader({
      ...getCommonOptions(),
    }).load({
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
      `Failed fetching module federation configuration of dynamic frontend plugins: Error: Invalid Json content: should be a Json object`,
    ]);
    const warnCalls = mocks.console.warn.mock.calls.flatMap(e => e[0]);
    expect(warnCalls).toEqual([]);
    expect(features).toMatchObject({
      features: [],
    });
    const infoCalls = mocks.console.info.mock.calls.flatMap(e => e[0]);
    expect(infoCalls).toEqual([]);
    expect(mocks.federation.get.mock.calls.flatMap(e => e[0])).toEqual([]);
  });

  it('should warn and recover from empty response while fetching module feredation configuration', async () => {
    server.use(
      rest.get(
        `${baseUrl}/api/core.dynamicplugins.frontendRemotes/manifests`,
        (_, res, ctx) => res(ctx.status(200)),
      ),
    );

    mocks.federation.get.mockReturnValue({
      default: createFrontendPlugin({
        id: 'test-plugin',
        extensions: [],
      }),
    });

    const features = await dynamicFrontendFeaturesLoader({
      ...getCommonOptions(),
    }).load({
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
      `Failed fetching module federation configuration of dynamic frontend plugins: FetchError: invalid json response body at http://localhost:7007/api/core.dynamicplugins.frontendRemotes/manifests reason: Unexpected end of JSON input`,
    ]);
    const warnCalls = mocks.console.warn.mock.calls.flatMap(e => e[0]);
    expect(warnCalls).toEqual([]);
    expect(features).toMatchObject({
      features: [],
    });
    const infoCalls = mocks.console.info.mock.calls.flatMap(e => e[0]);
    expect(infoCalls).toEqual([]);
    expect(mocks.federation.get.mock.calls.flatMap(e => e[0])).toEqual([]);
  });

  it('should warn on 404 error fetching module feredation manifest, but still load other remotes', async () => {
    server.use(
      rest.get(
        `${baseUrl}/api/core.dynamicplugins.frontendRemotes/manifests`,
        (_, res, ctx) =>
          res(
            ctx.json({
              'plugin-1': `${baseUrl}/api/core.dynamicplugins.frontendRemotes/remotes/plugin-1/mf-manifest.json`,
              'plugin-2': `${baseUrl}/api/core.dynamicplugins.frontendRemotes/remotes/plugin-2/mf-manifest.json`,
            }),
          ),
      ),
      rest.get(
        `${baseUrl}/api/core.dynamicplugins.frontendRemotes/remotes/plugin-1/mf-manifest.json`,
        (_, res, ctx) => res(ctx.json({}), ctx.status(404, 'NOT FOUND')),
      ),
      rest.get(
        `${baseUrl}/api/core.dynamicplugins.frontendRemotes/remotes/plugin-2/mf-manifest.json`,
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

    const features = await dynamicFrontendFeaturesLoader({
      ...getCommonOptions(),
    }).load({
      config: mockApis.config({
        data: {
          app: {
            packageName: 'app-4',
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
      "Failed fetching module federation manifest from 'http://localhost:7007/api/core.dynamicplugins.frontendRemotes/remotes/plugin-1/mf-manifest.json': Error: 404 - NOT FOUND",
    ]);
    const warnCalls = mocks.console.warn.mock.calls.flatMap(e => e[0]);
    expect(warnCalls).toEqual([]);
    expect(features).toMatchObject({
      features: [
        {
          $$type: '@backstage/FrontendPlugin',
          id: 'plugin-2',
          version: 'v1',
        },
      ],
    });
    const infoCalls = mocks.console.info.mock.calls.flatMap(e => e[0]);
    expect(infoCalls).toEqual([
      "Loading dynamic plugin 'plugin-1' from 'http://localhost:7007/api/core.dynamicplugins.frontendRemotes/remotes/plugin-1/mf-manifest.json'",
      "Loading dynamic plugin 'plugin-2' from 'http://localhost:7007/api/core.dynamicplugins.frontendRemotes/remotes/plugin-2/mf-manifest.json'",
      "Dynamic plugin remote module 'plugin-2' loaded from http://localhost:7007/api/core.dynamicplugins.frontendRemotes/remotes/plugin-2/mf-manifest.json",
    ]);
    expect(mocks.federation.get.mock.calls.flatMap(e => e[0])).toEqual([
      {
        id: '.',
        name: 'plugin-2',
      },
    ]);
  });

  it('should warn on unexpected Json content while fetching module feredation manifest, but still load other remotes', async () => {
    server.use(
      rest.get(
        `${baseUrl}/api/core.dynamicplugins.frontendRemotes/manifests`,
        (_, res, ctx) =>
          res(
            ctx.json({
              'plugin-1': `${baseUrl}/api/core.dynamicplugins.frontendRemotes/remotes/plugin-1/mf-manifest.json`,
              'plugin-2': `${baseUrl}/api/core.dynamicplugins.frontendRemotes/remotes/plugin-2/mf-manifest.json`,
            }),
          ),
      ),
      rest.get(
        `${baseUrl}/api/core.dynamicplugins.frontendRemotes/remotes/plugin-1/mf-manifest.json`,
        (_, res, ctx) => res(ctx.json('A Json String')),
      ),
      rest.get(
        `${baseUrl}/api/core.dynamicplugins.frontendRemotes/remotes/plugin-2/mf-manifest.json`,
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

    const features = await dynamicFrontendFeaturesLoader({
      ...getCommonOptions(),
    }).load({
      config: mockApis.config({
        data: {
          app: {
            packageName: 'app-5',
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
      "Failed fetching module federation manifest from 'http://localhost:7007/api/core.dynamicplugins.frontendRemotes/remotes/plugin-1/mf-manifest.json': Error: Invalid Json content: should be a Json object",
    ]);
    const warnCalls = mocks.console.warn.mock.calls.flatMap(e => e[0]);
    expect(warnCalls).toEqual([]);
    expect(features).toMatchObject({
      features: [
        {
          $$type: '@backstage/FrontendPlugin',
          id: 'plugin-2',
          version: 'v1',
        },
      ],
    });
    const infoCalls = mocks.console.info.mock.calls.flatMap(e => e[0]);
    expect(infoCalls).toEqual([
      "Loading dynamic plugin 'plugin-1' from 'http://localhost:7007/api/core.dynamicplugins.frontendRemotes/remotes/plugin-1/mf-manifest.json'",
      "Loading dynamic plugin 'plugin-2' from 'http://localhost:7007/api/core.dynamicplugins.frontendRemotes/remotes/plugin-2/mf-manifest.json'",
      "Dynamic plugin remote module 'plugin-2' loaded from http://localhost:7007/api/core.dynamicplugins.frontendRemotes/remotes/plugin-2/mf-manifest.json",
    ]);
    expect(mocks.federation.get.mock.calls.flatMap(e => e[0])).toEqual([
      {
        id: '.',
        name: 'plugin-2',
      },
    ]);
  });

  it('should warn on empty module, but still load other remotes', async () => {
    server.use(
      rest.get(
        `${baseUrl}/api/core.dynamicplugins.frontendRemotes/manifests`,
        (_, res, ctx) =>
          res(
            ctx.json({
              'plugin-1': `${baseUrl}/api/core.dynamicplugins.frontendRemotes/remotes/plugin-1/mf-manifest.json`,
              'plugin-2': `${baseUrl}/api/core.dynamicplugins.frontendRemotes/remotes/plugin-2/mf-manifest.json`,
            }),
          ),
      ),
      rest.get(
        `${baseUrl}/api/core.dynamicplugins.frontendRemotes/remotes/plugin-1/mf-manifest.json`,
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
        `${baseUrl}/api/core.dynamicplugins.frontendRemotes/remotes/plugin-2/mf-manifest.json`,
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

    const features = await dynamicFrontendFeaturesLoader({
      ...getCommonOptions(),
    }).load({
      config: mockApis.config({
        data: {
          app: {
            packageName: 'app-6',
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
      "Skipping empty dynamic plugin remote module 'plugin-1'.",
    ]);
    expect(features).toMatchObject({
      features: [
        {
          $$type: '@backstage/FrontendPlugin',
          id: 'plugin-2',
          version: 'v1',
        },
      ],
    });
    const infoCalls = mocks.console.info.mock.calls.flatMap(e => e[0]);
    expect(infoCalls).toEqual([
      "Loading dynamic plugin 'plugin-1' from 'http://localhost:7007/api/core.dynamicplugins.frontendRemotes/remotes/plugin-1/mf-manifest.json'",
      "Loading dynamic plugin 'plugin-2' from 'http://localhost:7007/api/core.dynamicplugins.frontendRemotes/remotes/plugin-2/mf-manifest.json'",
      "Dynamic plugin remote module 'plugin-2' loaded from http://localhost:7007/api/core.dynamicplugins.frontendRemotes/remotes/plugin-2/mf-manifest.json",
    ]);
    expect(mocks.federation.get.mock.calls.flatMap(e => e[0])).toEqual([
      {
        id: '.',
        name: 'plugin-1',
      },
      {
        id: '.',
        name: 'plugin-2',
      },
    ]);
  });

  it('should warn on module without default export, but still load other remotes', async () => {
    server.use(
      rest.get(
        `${baseUrl}/api/core.dynamicplugins.frontendRemotes/manifests`,
        (_, res, ctx) =>
          res(
            ctx.json({
              'plugin-1': `${baseUrl}/api/core.dynamicplugins.frontendRemotes/remotes/plugin-1/mf-manifest.json`,
              'plugin-2': `${baseUrl}/api/core.dynamicplugins.frontendRemotes/remotes/plugin-2/mf-manifest.json`,
            }),
          ),
      ),
      rest.get(
        `${baseUrl}/api/core.dynamicplugins.frontendRemotes/remotes/plugin-1/mf-manifest.json`,
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
        `${baseUrl}/api/core.dynamicplugins.frontendRemotes/remotes/plugin-2/mf-manifest.json`,
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

    const features = await dynamicFrontendFeaturesLoader({
      ...getCommonOptions(),
    }).load({
      config: mockApis.config({
        data: {
          app: {
            packageName: 'app-7',
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
      "Skipping dynamic plugin remote module 'plugin-1' since it doesn't export a new 'FrontendFeature' as default export.",
    ]);
    expect(features).toMatchObject({
      features: [
        {
          $$type: '@backstage/FrontendPlugin',
          id: 'plugin-2',
          version: 'v1',
        },
      ],
    });
    const infoCalls = mocks.console.info.mock.calls.flatMap(e => e[0]);
    expect(infoCalls).toEqual([
      "Loading dynamic plugin 'plugin-1' from 'http://localhost:7007/api/core.dynamicplugins.frontendRemotes/remotes/plugin-1/mf-manifest.json'",
      "Loading dynamic plugin 'plugin-2' from 'http://localhost:7007/api/core.dynamicplugins.frontendRemotes/remotes/plugin-2/mf-manifest.json'",
      "Dynamic plugin remote module 'plugin-1' loaded from http://localhost:7007/api/core.dynamicplugins.frontendRemotes/remotes/plugin-1/mf-manifest.json",
      "Dynamic plugin remote module 'plugin-2' loaded from http://localhost:7007/api/core.dynamicplugins.frontendRemotes/remotes/plugin-2/mf-manifest.json",
    ]);
    expect(mocks.federation.get.mock.calls.flatMap(e => e[0])).toEqual([
      {
        id: '.',
        name: 'plugin-1',
      },
      {
        id: '.',
        name: 'plugin-2',
      },
    ]);
  });
});
