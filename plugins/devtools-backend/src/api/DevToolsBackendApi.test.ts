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

import { ConfigReader } from '@backstage/config';
import {
  createMockDirectory,
  mockServices,
} from '@backstage/backend-test-utils';
import { overrideTargetPaths } from '@backstage/cli-common/testUtils';
import { DevToolsBackendApi } from './DevToolsBackendApi';

describe('DevToolsBackendApi', () => {
  const mockDir = createMockDirectory();

  it('redacts the secrets of workspace packages that are not resolvable by name', async () => {
    // A pnpm workspace with the isolated layout, where the backend is not
    // linked into the node_modules of the workspace root
    mockDir.setContent({
      'package.json': JSON.stringify({ name: 'root', private: true }),
      'pnpm-workspace.yaml': 'packages:\n  - packages/*\n',
      'packages/backend/package.json': JSON.stringify({
        name: '@internal/devtools-test-backend',
        version: '1.0.0',
        configSchema: {
          $schema: 'http://json-schema.org/draft-07/schema#',
          type: 'object',
          properties: {
            backend: {
              type: 'object',
              properties: {
                apiKey: { type: 'string', visibility: 'secret' },
                baseUrl: { type: 'string' },
              },
            },
          },
        },
      }),
    });
    overrideTargetPaths({ dir: mockDir.resolve('packages/backend') });

    const api = new DevToolsBackendApi(
      mockServices.logger.mock(),
      new ConfigReader({
        backend: { apiKey: 'my-secret', baseUrl: 'http://localhost:7007' },
      }),
    );

    await expect(api.listConfig()).resolves.toEqual({
      config: {
        backend: { apiKey: '<secret>', baseUrl: 'http://localhost:7007' },
      },
      error: undefined,
    });
  });
});
