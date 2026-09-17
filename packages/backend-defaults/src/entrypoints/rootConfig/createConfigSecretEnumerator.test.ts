/*
 * Copyright 2020 The Backstage Authors
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

import { loadConfigSchema } from '@backstage/config-loader';
import { createConfigSecretEnumerator } from './createConfigSecretEnumerator';
import { mockServices } from '@backstage/backend-test-utils';

describe('createConfigSecretEnumerator', () => {
  it('should enumerate secrets', async () => {
    const logger = mockServices.logger.mock();

    const enumerate = await createConfigSecretEnumerator({
      logger,
    });
    const secrets = enumerate(
      mockServices.rootConfig({
        data: {
          backend: { auth: { keys: [{ secret: 'my-secret-password' }] } },
        },
      }),
    );
    expect(Array.from(secrets)).toEqual(['my-secret-password']);
  }, 20_000); // Bit higher timeout since we're loading all config schemas in the repo

  it('should enumerate secrets with explicit schema', async () => {
    const logger = mockServices.logger.mock();

    const enumerate = await createConfigSecretEnumerator({
      logger,
      schema: await loadConfigSchema({
        serialized: {
          schemas: [
            {
              value: {
                type: 'object',
                properties: {
                  secret: {
                    visibility: 'secret',
                    type: 'string',
                  },
                },
              },
              path: '/mock',
            },
          ],
          backstageConfigSchemaVersion: 1,
        },
      }),
    });

    const secrets = enumerate(
      mockServices.rootConfig({
        data: {
          secret: 'my-secret',
          other: 'not-secret',
        },
      }),
    );
    expect(Array.from(secrets)).toEqual(['my-secret']);
  });
});
