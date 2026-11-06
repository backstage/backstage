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
  createBackendPlugin,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { startTestBackend } from '@backstage/backend-test-utils';
import { secretProviderServiceRef, secretResolverServiceRef } from './service';

describe('secretResolverServiceRef', () => {
  it('derives the consumer identity from the plugin metadata, not the caller', async () => {
    const observedConsumers: string[] = [];

    const providerFactory = createServiceFactory({
      service: secretProviderServiceRef,
      deps: {},
      async factory() {
        return {
          id: 'test',
          async resolve({ consumer }) {
            observedConsumers.push(consumer.pluginId);
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
            deps: { secrets: secretResolverServiceRef },
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

    // Each plugin resolves through its own plugin-scoped resolver, so the shared
    // provider sees each consumer's real plugin id even though neither plugin
    // supplied one.
    expect(observedConsumers.sort()).toEqual(['plugin-one', 'plugin-two']);
  });
});
