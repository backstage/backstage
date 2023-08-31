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

import mockFs from 'mock-fs';
import { resolve as resolvePath, dirname } from 'path';
import { startTestBackend, mockServices } from '@backstage/backend-test-utils';
import { featureDiscoveryServiceFactory } from './featureDiscoveryServiceFactory';
import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';

const rootDir = dirname(process.argv[1]);

describe('featureDiscoveryServiceFactory', () => {
  beforeEach(() => {
    mockFs({
      [rootDir]: {
        'package.json': JSON.stringify({
          name: 'example-app',
          dependencies: {
            'detected-plugin': '0.0.0',
            'detected-module': '0.0.0',
            'detected-plugin-with-alpha': '0.0.0',
          },
        }),
      },
      [resolvePath(rootDir, 'node_modules/detected-plugin')]: {
        'package.json': JSON.stringify({
          name: 'detected-plugin',
          main: 'index.js',
          backstage: {
            role: 'backend-plugin',
          },
        }),
        'index.js': `
        const { createBackendPlugin, coreServices } = require('@backstage/backend-plugin-api');
        exports.detectedPlugin = createBackendPlugin({
            pluginId: 'detected',
            register(env) {
              env.registerInit({
                deps: { identity: coreServices.identity },
                async init({ identity }) {
                  identity.getIdentity('detected-plugin');
                },
              });
            },
        });
        `,
      },
      [resolvePath(rootDir, 'node_modules/detected-module')]: {
        'package.json': JSON.stringify({
          name: 'detected-module',
          main: 'index.js',
          backstage: {
            role: 'backend-plugin-module',
          },
        }),
        'index.js': `
        const { createBackendModule, coreServices } = require('@backstage/backend-plugin-api');
        exports.detectedModuleDerp = createBackendModule({
            pluginId: 'detected',
            moduleId: 'derp',
            register(env) {
              env.registerInit({
                deps: { identity: coreServices.identity },
                async init({ identity }) {
                  identity.getIdentity('detected-module');
                },
              });
            },
        });
        `,
      },
      [resolvePath(rootDir, 'node_modules/detected-plugin-with-alpha')]: {
        'package.json': JSON.stringify({
          name: 'detected-plugin-with-alpha',
          main: 'index.js',
          exports: {
            '.': {
              default: 'index.js',
            },
            './alpha': {
              default: 'alpha.js',
            },
            './package.json': './package.json',
          },
          backstage: {
            role: 'backend-plugin',
          },
        }),
        'index.js': `exports.detectedPlugin = undefined;`,
        'alpha.js': `
        const { createBackendPlugin, coreServices } = require('@backstage/backend-plugin-api');
        exports.detectedPluginAlpha = createBackendPlugin({
            pluginId: 'detected-alpha',
            register(env) {
              env.registerInit({
                deps: { identity: coreServices.identity },
                async init({ identity }) {
                  identity.getIdentity('detected-plugin-with-alpha');
                },
              });
            },
        });
        `,
      },
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('should detect plugin and module packages when "all" is specified', async () => {
    const fn = jest.fn().mockResolvedValue({});

    await startTestBackend({
      features: [
        createServiceFactory({
          service: coreServices.identity,
          deps: {},
          factory: () => ({ getIdentity: fn }),
        }),
        featureDiscoveryServiceFactory(),
        mockServices.rootConfig.factory({
          data: { backend: { packages: 'all' } },
        }),
      ],
    });

    expect(fn).toHaveBeenCalledWith('detected-plugin');
    expect(fn).toHaveBeenCalledWith('detected-module');
    expect(fn).toHaveBeenCalledWith('detected-plugin-with-alpha');
  });

  it('detects only the packages that are listed as included', async () => {
    const fn = jest.fn().mockResolvedValue({});

    await startTestBackend({
      features: [
        createServiceFactory({
          service: coreServices.identity,
          deps: {},
          factory: () => ({ getIdentity: fn }),
        }),
        featureDiscoveryServiceFactory(),
        mockServices.rootConfig.factory({
          data: {
            backend: {
              packages: {
                include: ['detected-plugin', 'detected-plugin-with-alpha'],
              },
            },
          },
        }),
      ],
    });

    expect(fn).toHaveBeenCalledWith('detected-plugin');
    expect(fn).toHaveBeenCalledWith('detected-plugin-with-alpha');
    expect(fn).not.toHaveBeenCalledWith('detected-module');
  });

  it('does not detect packages when included is an empty list', async () => {
    const fn = jest.fn().mockResolvedValue({});

    await startTestBackend({
      features: [
        createServiceFactory({
          service: coreServices.identity,
          deps: {},
          factory: () => ({ getIdentity: fn }),
        }),
        featureDiscoveryServiceFactory(),
        mockServices.rootConfig.factory({
          data: {
            backend: {
              packages: {
                include: [],
              },
            },
          },
        }),
      ],
    });

    expect(fn).not.toHaveBeenCalledWith('detected-plugin');
    expect(fn).not.toHaveBeenCalledWith('detected-plugin-with-alpha');
    expect(fn).not.toHaveBeenCalledWith('detected-module');
  });

  it('does not detect an excluded packages', async () => {
    const fn = jest.fn().mockResolvedValue({});

    await startTestBackend({
      features: [
        createServiceFactory({
          service: coreServices.identity,
          deps: {},
          factory: () => ({ getIdentity: fn }),
        }),
        featureDiscoveryServiceFactory(),
        mockServices.rootConfig.factory({
          data: {
            backend: {
              packages: {
                exclude: ['detected-plugin', 'detected-module'],
              },
            },
          },
        }),
      ],
    });

    expect(fn).not.toHaveBeenCalledWith('detected-plugin');
    expect(fn).not.toHaveBeenCalledWith('detected-module');
    expect(fn).toHaveBeenCalledWith('detected-plugin-with-alpha');
  });

  it('does not excluded packages when it is an empty list', async () => {
    const fn = jest.fn().mockResolvedValue({});

    await startTestBackend({
      features: [
        createServiceFactory({
          service: coreServices.identity,
          deps: {},
          factory: () => ({ getIdentity: fn }),
        }),
        featureDiscoveryServiceFactory(),
        mockServices.rootConfig.factory({
          data: {
            backend: {
              packages: {
                exclude: [],
              },
            },
          },
        }),
      ],
    });

    expect(fn).toHaveBeenCalledWith('detected-plugin');
    expect(fn).toHaveBeenCalledWith('detected-module');
    expect(fn).toHaveBeenCalledWith('detected-plugin-with-alpha');
  });

  it('does not detect packages that are included and excluded', async () => {
    const fn = jest.fn().mockResolvedValue({});

    await startTestBackend({
      features: [
        createServiceFactory({
          service: coreServices.identity,
          deps: {},
          factory: () => ({ getIdentity: fn }),
        }),
        featureDiscoveryServiceFactory(),
        mockServices.rootConfig.factory({
          data: {
            backend: {
              packages: {
                include: [
                  'detected-plugin',
                  'detected-module',
                  'detected-plugin-with-alpha',
                ],
                exclude: ['detected-plugin'],
              },
            },
          },
        }),
      ],
    });

    expect(fn).not.toHaveBeenCalledWith('detected-plugin');
    expect(fn).toHaveBeenCalledWith('detected-module');
    expect(fn).toHaveBeenCalledWith('detected-plugin-with-alpha');
  });

  it('does not detect any packages when "packages" is empty', async () => {
    const fn = jest.fn().mockResolvedValue({});

    await startTestBackend({
      features: [
        createServiceFactory({
          service: coreServices.identity,
          deps: {},
          factory: () => ({ getIdentity: fn }),
        }),
        featureDiscoveryServiceFactory(),
        mockServices.rootConfig.factory({
          data: { backend: { packages: {} } },
        }),
      ],
    });

    expect(fn).not.toHaveBeenCalled();
  });

  it('does not detect any packages when "packages" is not present', async () => {
    const fn = jest.fn().mockResolvedValue({});

    await startTestBackend({
      features: [
        createServiceFactory({
          service: coreServices.identity,
          deps: {},
          factory: () => ({ getIdentity: fn }),
        }),
        featureDiscoveryServiceFactory(),
        mockServices.rootConfig.factory({
          data: { backend: {} },
        }),
      ],
    });

    expect(fn).not.toHaveBeenCalled();
  });
});
