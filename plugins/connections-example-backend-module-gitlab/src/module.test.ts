/*
 * Copyright 2026 The Backstage Authors
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
  createBackendModule,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { startTestBackend } from '@backstage/backend-test-utils';
import { mockServices } from '@backstage/backend-test-utils';
import {
  connectionsServiceRef,
  declareConnection,
} from '@backstage/connections';

describe('connections-example-backend-module-gitlab', () => {
  const testConfig = mockServices.rootConfig.factory({
    data: {
      connections: [
        {
          type: 'gitlab',
          host: 'gitlab.com',
          auth: [{ method: 'token', token: 'gl-test-token' }],
        },
        {
          type: 'github',
          host: 'github.com',
          auth: [{ method: 'token', token: 'gh-test-token' }],
        },
      ],
    },
  });

  it('module can access its declared gitlab connection', async () => {
    expect.assertions(2);

    const testModule = createBackendModule({
      pluginId: 'test',
      moduleId: 'gitlab-test',
      register(reg) {
        declareConnection(reg, {
          type: 'gitlab',
        });
        reg.registerInit({
          deps: { connections: connectionsServiceRef },
          async init({ connections }) {
            const conn = await connections.find({
              type: 'gitlab',
              url: 'https://gitlab.com/my-org/my-repo',
              authMethods: ['token'],
            });
            expect(conn.host).toBe('gitlab.com');
            expect(conn.auth.method).toBe('token');
          },
        });
      },
    });

    await startTestBackend({
      features: [
        testConfig,
        createBackendPlugin({
          pluginId: 'test',
          register(env) {
            env.registerInit({ deps: {}, async init() {} });
          },
        }),
        testModule,
      ],
    });
  });

  it('module cannot access a connection type it did not declare', async () => {
    expect.assertions(1);

    const testModule = createBackendModule({
      pluginId: 'test',
      moduleId: 'gitlab-only',
      register(reg) {
        declareConnection(reg, {
          type: 'gitlab',
        });
        reg.registerInit({
          deps: { connections: connectionsServiceRef },
          async init({ connections }) {
            await expect(
              connections.find({
                type: 'github',
                url: 'https://github.com/my-org/my-repo',
                authMethods: ['token'],
              }),
            ).rejects.toThrow(/undeclared connection of type "github"/);
          },
        });
      },
    });

    await startTestBackend({
      features: [
        testConfig,
        createBackendPlugin({
          pluginId: 'test',
          register(reg) {
            reg.registerInit({ deps: {}, async init() {} });
          },
        }),
        testModule,
      ],
    });
  });

  it('plugin and module only see their respective plugins', async () => {
    expect.assertions(4);

    const testPlugin = createBackendPlugin({
      pluginId: 'test',
      register(reg) {
        declareConnection(reg, {
          type: 'github',
        });
        reg.registerInit({
          deps: { connections: connectionsServiceRef },
          async init({ connections }) {
            const gh = await connections.find({
              type: 'github',
              url: 'https://github.com/my-org/my-repo',
              authMethods: ['token'],
            });
            expect(gh.host).toBe('github.com');

            await expect(
              connections.find({
                type: 'gitlab',
                url: 'https://gitlab.com/my-org/my-repo',
                authMethods: ['token'],
              }),
            ).rejects.toThrow(/undeclared connection of type "gitlab"/);
          },
        });
      },
    });

    const testModule = createBackendModule({
      pluginId: 'test',
      moduleId: 'gitlab-only',
      register(reg) {
        declareConnection(reg, {
          type: 'gitlab',
        });
        reg.registerInit({
          deps: { connections: connectionsServiceRef },
          async init({ connections }) {
            const conn = await connections.find({
              type: 'gitlab',
              url: 'https://gitlab.com/my-org/my-repo',
              authMethods: ['token'],
            });
            expect(conn.host).toBe('gitlab.com');

            await expect(
              connections.find({
                type: 'github',
                url: 'https://github.com/my-org/my-repo',
                authMethods: ['token'],
              }),
            ).rejects.toThrow(/undeclared connection of type "github"/);
          },
        });
      },
    });

    await startTestBackend({
      features: [testConfig, testPlugin, testModule],
    });
  });
});
