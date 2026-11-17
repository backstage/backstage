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

import { createBackendPlugin } from '@backstage/backend-plugin-api';
import {
  mockCredentials,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import type { RegistryReader } from '@earendil-works/pi-durable';
import type { AiService } from './contracts';
import { aiServiceRef } from './service';

describe('aiServiceRef', () => {
  it('installs a plugin-scoped service that fails closed on production opens', async () => {
    let service: AiService | undefined;
    const backend = await startTestBackend({
      features: [
        createBackendPlugin({
          pluginId: 'test-consumer',
          register(reg) {
            reg.registerInit({
              deps: { ai: aiServiceRef },
              async init({ ai }) {
                service = ai;
              },
            });
          },
        }),
      ],
    });

    // The backend starting proves the factory's core service dependencies
    // (database, auth, permissions, logger, auditor, lifecycle,
    // pluginMetadata) resolve under backend-test-utils.
    expect(service).toBeDefined();
    await expect(
      service!.openHarness({
        sessionId: 's1',
        config: {
          root: new ConfigReader({
            assistant: {
              mode: 'service',
              model: { provider: 'acme', modelId: 'acme-large' },
            },
          }),
          path: 'assistant',
        },
        credentials: mockCredentials.user(),
        registry: {
          snapshot: () => ({} as ReturnType<RegistryReader['snapshot']>),
          subscribe: () => () => {},
        },
        registryVersion: 'v1',
      }),
    ).rejects.toThrow(/Wave 1 integration is not wired.*fail closed/s);

    await backend.stop();
  });
});
