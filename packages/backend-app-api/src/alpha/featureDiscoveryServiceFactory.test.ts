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

import {
  startTestBackend,
  mockServices,
  createMockDirectory,
} from '@backstage/backend-test-utils';
import { featureDiscoveryServiceFactory } from './featureDiscoveryServiceFactory';

const mockDir = createMockDirectory();
process.argv[1] = mockDir.path;

const pluginApiPath = require.resolve('@backstage/backend-plugin-api');

describe('featureDiscoveryServiceFactory', () => {
  beforeEach(() => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        name: 'example-app',
        dependencies: {
          'detected-plugin': '0.0.0',
          'detected-module': '0.0.0',
          'detected-plugin-with-alpha': '0.0.0',
          'detected-library': '0.0.0',
        },
      }),
      'node_modules/detected-plugin': {
        'package.json': JSON.stringify({
          name: 'detected-plugin',
          main: 'index.js',
          backstage: {
            role: 'backend-plugin',
          },
        }),
        'index.js': `
        const { createBackendPlugin, coreServices } = require('${pluginApiPath}');
        exports.default = createBackendPlugin({
            pluginId: 'detected',
            register(env) {
              env.registerInit({
                deps: { logger: coreServices.rootLogger },
                async init({ logger }) {
                  logger.warn('detected-plugin');
                },
              });
            },
        });
        `,
      },
      'node_modules/detected-module': {
        'package.json': JSON.stringify({
          name: 'detected-module',
          main: 'index.js',
          backstage: {
            role: 'backend-plugin-module',
          },
        }),
        'index.js': `
        const { createBackendModule, coreServices } = require('${pluginApiPath}');
        exports.default = createBackendModule({
            pluginId: 'detected',
            moduleId: 'derp',
            register(env) {
              env.registerInit({
                deps: { logger: coreServices.rootLogger },
                async init({ logger }) {
                  logger.warn('detected-module');
                },
              });
            },
        });
        `,
      },
      'node_modules/detected-plugin-with-alpha': {
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
        'index.js': `exports.default = undefined;`,
        'alpha.js': `
        const { createBackendPlugin, coreServices } = require('${pluginApiPath}');
        exports.default = createBackendPlugin({
            pluginId: 'detected-alpha',
            register(env) {
              env.registerInit({
                deps: { logger: coreServices.rootLogger },
                async init({ logger }) {
                  logger.warn('detected-plugin-with-alpha');
                },
              });
            },
        });
        `,
      },
      'node_modules/detected-library': {
        'package.json': JSON.stringify({
          name: 'detected-library',
          main: 'index.js',
          backstage: {
            role: 'node-library',
          },
        }),
        'index.js': `
        const { createServiceFactory, createServiceRef, coreServices } = require('${pluginApiPath}');
        exports.default = createServiceFactory({
          service: createServiceRef({ id: 'test', scope: 'root' }),
          deps: { logger: coreServices.rootLogger },
          factory({ logger }) {
            logger.warn('detected-library');
            return {};
          },
        });
        `,
      },
    });
  });

  it('should detect plugin and module packages when "all" is specified', async () => {
    const mock = mockServices.rootLogger.mock({ child: () => mock });

    await startTestBackend({
      features: [
        mock.factory,
        featureDiscoveryServiceFactory,
        mockServices.rootConfig.factory({
          data: { backend: { packages: 'all' } },
        }),
      ],
    });

    expect(mock.warn).toHaveBeenCalledWith('detected-plugin');
    expect(mock.warn).toHaveBeenCalledWith('detected-module');
    expect(mock.warn).toHaveBeenCalledWith('detected-plugin-with-alpha');
    expect(mock.warn).toHaveBeenCalledWith('detected-library');
  });

  it('detects only the packages that are listed as included', async () => {
    const mock = mockServices.rootLogger.mock({ child: () => mock });

    await startTestBackend({
      features: [
        mock.factory,
        featureDiscoveryServiceFactory,
        mockServices.rootConfig.factory({
          data: {
            backend: {
              packages: {
                include: [
                  'detected-plugin',
                  'detected-plugin-with-alpha',
                  'detected-library',
                ],
              },
            },
          },
        }),
      ],
    });

    expect(mock.warn).toHaveBeenCalledWith('detected-plugin');
    expect(mock.warn).toHaveBeenCalledWith('detected-plugin-with-alpha');
    expect(mock.warn).toHaveBeenCalledWith('detected-library');
    expect(mock.warn).not.toHaveBeenCalledWith('detected-module');
  });

  it('does not detect packages when included is an empty list', async () => {
    const mock = mockServices.rootLogger.mock({ child: () => mock });

    await startTestBackend({
      features: [
        mock.factory,
        featureDiscoveryServiceFactory,
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

    expect(mock.warn).not.toHaveBeenCalledWith('detected-plugin');
    expect(mock.warn).not.toHaveBeenCalledWith('detected-plugin-with-alpha');
    expect(mock.warn).not.toHaveBeenCalledWith('detected-module');
    expect(mock.warn).not.toHaveBeenCalledWith('detected-library');
  });

  it('does not detect an excluded packages', async () => {
    const mock = mockServices.rootLogger.mock({ child: () => mock });

    await startTestBackend({
      features: [
        mock.factory,
        featureDiscoveryServiceFactory,
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

    expect(mock.warn).not.toHaveBeenCalledWith('detected-plugin');
    expect(mock.warn).not.toHaveBeenCalledWith('detected-module');
    expect(mock.warn).toHaveBeenCalledWith('detected-plugin-with-alpha');
    expect(mock.warn).toHaveBeenCalledWith('detected-library');
  });

  it('does not excluded packages when it is an empty list', async () => {
    const mock = mockServices.rootLogger.mock({ child: () => mock });

    await startTestBackend({
      features: [
        mock.factory,
        featureDiscoveryServiceFactory,
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

    expect(mock.warn).toHaveBeenCalledWith('detected-plugin');
    expect(mock.warn).toHaveBeenCalledWith('detected-module');
    expect(mock.warn).toHaveBeenCalledWith('detected-plugin-with-alpha');
    expect(mock.warn).toHaveBeenCalledWith('detected-library');
  });

  it('does not detect packages that are included and excluded', async () => {
    const mock = mockServices.rootLogger.mock({ child: () => mock });

    await startTestBackend({
      features: [
        mock.factory,
        featureDiscoveryServiceFactory,
        mockServices.rootConfig.factory({
          data: {
            backend: {
              packages: {
                include: [
                  'detected-plugin',
                  'detected-module',
                  'detected-plugin-with-alpha',
                ],
                exclude: ['detected-module'],
              },
            },
          },
        }),
      ],
    });

    expect(mock.warn).toHaveBeenCalledWith('detected-plugin');
    expect(mock.warn).not.toHaveBeenCalledWith('detected-library');
    expect(mock.warn).not.toHaveBeenCalledWith('detected-module');
    expect(mock.warn).toHaveBeenCalledWith('detected-plugin-with-alpha');
  });

  it('does not detect any packages when "packages" is empty', async () => {
    const mock = mockServices.rootLogger.mock({ child: () => mock });

    await startTestBackend({
      features: [
        mock.factory,
        featureDiscoveryServiceFactory,
        mockServices.rootConfig.factory({
          data: { backend: { packages: {} } },
        }),
      ],
    });

    expect(mock.warn).not.toHaveBeenCalled();
  });

  it('does not detect any packages when "packages" is not present', async () => {
    const mock = mockServices.rootLogger.mock({ child: () => mock });

    await startTestBackend({
      features: [
        mock.factory,
        featureDiscoveryServiceFactory,
        mockServices.rootConfig.factory({
          data: { backend: {} },
        }),
      ],
    });

    expect(mock.warn).not.toHaveBeenCalled();
  });
});
