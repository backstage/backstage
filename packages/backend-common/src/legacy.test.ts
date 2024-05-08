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
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import { EventEmitter } from 'events';
import { Router } from 'express';
import { createLegacyAuthAdapters } from './auth';
import { legacyPlugin } from './legacy';
import {
  authServiceFactory,
  tokenManagerServiceFactory,
} from '@backstage/backend-app-api';

describe('legacyPlugin', () => {
  it('can auth across the new and old systems', async () => {
    const emitter = new EventEmitter();

    const done = new Promise(resolve => {
      emitter.once('done', () => {
        emitter.once('done', resolve);
      });
    });

    await startTestBackend({
      features: [
        authServiceFactory,
        tokenManagerServiceFactory,
        mockServices.rootConfig.factory({
          data: {
            backend: {
              auth: {
                keys: [
                  {
                    secret: 'test',
                  },
                ],
              },
            },
          },
        }),
        createBackendPlugin({
          pluginId: 'new',
          register(reg) {
            reg.registerInit({
              deps: {
                auth: coreServices.auth,
                discovery: coreServices.discovery,
              },
              async init({ auth }) {
                emitter.once('legacy-token', async otherToken => {
                  const credentials = await auth.authenticate(otherToken);
                  expect(credentials.principal).toEqual({
                    type: 'service',
                    subject: 'external:backstage-plugin',
                  });
                  emitter.emit('done');
                });

                const { token } = await auth.getPluginRequestToken({
                  onBehalfOf: await auth.getOwnServiceCredentials(),
                  targetPluginId: 'old',
                });
                emitter.emit('new-token', token);
              },
            });
          },
        }),
        legacyPlugin(
          'old',
          Promise.resolve({
            async default({ tokenManager, identity, discovery }) {
              const { auth } = createLegacyAuthAdapters({
                tokenManager,
                identity,
                discovery,
                auth: undefined as any as typeof coreServices.auth.T,
                httpAuth: undefined as any as typeof coreServices.httpAuth.T,
              });

              emitter.once('new-token', async otherToken => {
                const credentials = await auth.authenticate(otherToken);
                expect(credentials.principal).toEqual({
                  type: 'service',
                  subject: 'external:backstage-plugin',
                });
                emitter.emit('done');
              });

              const { token } = await tokenManager.getToken();
              emitter.emit('legacy-token', token);

              return Router();
            },
          }),
        ),
      ],
    });

    await done;
  });
});
