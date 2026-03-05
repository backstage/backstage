/*
 * Copyright 2024 The Backstage Authors
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

import { createMockDirectory } from '@backstage/backend-test-utils';
import { readFrontendConfig } from './readFrontendConfig';
import { ConfigReader } from '@backstage/config';

describe('readFrontendConfig', () => {
  const mockDir = createMockDirectory();

  afterEach(() => {
    mockDir.clear();
  });

  it('should validate env config', async () => {
    mockDir.setContent({
      'appDir/.config-schema.json': JSON.stringify({
        schemas: [
          {
            value: {
              type: 'object',

              properties: {
                app: {
                  type: 'object',
                  properties: {
                    secretOfLife: {
                      type: 'string',
                      visibility: 'secret',
                    },
                    backendConfig: {
                      type: 'string',
                      visibility: 'backend',
                    },
                    publicValue: {
                      type: 'string',
                      visibility: 'frontend',
                    },
                  },
                },
              },
            },
          },
        ],
        backstageConfigSchemaVersion: 1,
      }),
    });

    const config = new ConfigReader({
      app: {
        secretOfLife: '42',
        backendConfig: 'backend',
        publicValue: 'public',
      },
    });

    const frontendConfig = await readFrontendConfig({
      env: {
        APP_CONFIG_app_secretOfLife: 'ignored',
        APP_CONFIG_app_backendConfig: 'ignored',
        APP_CONFIG_app_publicValue: 'injected',
      },
      appDistDir: `${mockDir.path}/appDir`,
      config,
    });

    expect(frontendConfig).toEqual([
      {
        context: 'env',
        data: {
          app: {
            publicValue: 'injected',
          },
        },
        deprecatedKeys: [],
        filteredKeys: undefined,
      },
      {
        context: 'app',
        data: { app: { publicValue: 'public' } },
        deprecatedKeys: [],
        filteredKeys: undefined,
      },
    ]);
  });
});
