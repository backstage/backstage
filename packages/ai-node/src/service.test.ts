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
  // Note on the parallel-SQLite "worker failed to exit gracefully" warning
  // this file occasionally produces: it is Jest-environment noise, not an
  // ai-node leak, for the lifecycle this suite exercises (backend startup,
  // this test's failed in-memory open, backend stop). Evidence, captured
  // with async_hooks resource tracking and full creation stacks: after
  // `backend.stop()` the only resources left are one Timeout a bare
  // `startTestBackend` without any AI consumer also leaves (the
  // Jest-environment baseline), plus — when the default mock database is
  // used — the mock database service's in-memory knex pool reaper
  // (tarn KnexPool._startReaping), which the mock never destroys. A
  // test-owned knex that is destroyed leaves no extra timer, and no timer
  // created by ai-node code is pending after stop. The warning accordingly
  // never appears under --runInBand or --detectOpenHandles. In production
  // the real DatabaseService owns pool teardown.
  it('installs a wired plugin-scoped service that fails closed on in-memory databases', async () => {
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
    // pluginMetadata) resolve under backend-test-utils, and that the
    // production Wave 1 wiring (migrations, lease, storage, guard, journal)
    // initializes.
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
    ).rejects.toThrow(/file-backed SQLite database/s);

    await backend.stop();
  });
});
