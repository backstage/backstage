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
  coreServices,
  createBackendPlugin,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { startTestBackend } from '@backstage/backend-test-utils';
import { secretProviderServiceRef, secretsServiceRef } from './service';

describe('secretsServiceRef', () => {
  it('creates a provider for each plugin with its identity from plugin metadata', async () => {
    const observedPluginIds: string[] = [];
    const constructedPluginIds: string[] = [];

    const providerFactory = createServiceFactory({
      service: secretProviderServiceRef,
      deps: { pluginMetadata: coreServices.pluginMetadata },
      async factory({ pluginMetadata }) {
        const pluginId = pluginMetadata.getId();
        constructedPluginIds.push(pluginId);
        return {
          id: 'test',
          async resolve({ reference }) {
            expect(reference).toEqual({ key: 'token' });
            observedPluginIds.push(pluginId);
            return { value: 'secret' };
          },
        };
      },
    });

    const resolvingPlugin = (pluginId: string) =>
      createBackendPlugin({
        pluginId,
        register(env) {
          env.registerInit({
            deps: { secrets: secretsServiceRef },
            async init({ secrets }) {
              await secrets.resolve({
                reference: { provider: 'test', reference: { key: 'token' } },
              });
            },
          });
        },
      });

    await startTestBackend({
      features: [
        providerFactory,
        resolvingPlugin('plugin-one'),
        resolvingPlugin('plugin-two'),
      ],
    });

    expect(constructedPluginIds.sort()).toEqual(['plugin-one', 'plugin-two']);
    expect(observedPluginIds.sort()).toEqual(['plugin-one', 'plugin-two']);
  });
});
