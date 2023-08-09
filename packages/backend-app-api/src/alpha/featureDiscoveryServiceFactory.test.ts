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
            role: 'backend-module',
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
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('should detect plugin and module packages', async () => {
    const fn = jest.fn().mockResolvedValue({});

    await startTestBackend({
      services: [
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
  });
});
