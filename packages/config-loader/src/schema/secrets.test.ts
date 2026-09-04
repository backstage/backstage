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
import { loadConfigSchema } from './load';
import { enumerateConfigSecrets } from './secrets';

describe('enumerateConfigSecrets', () => {
  it('returns string leaves selected by secret visibility', async () => {
    const schema = await loadConfigSchema({
      serialized: {
        schemas: [
          {
            value: {
              type: 'object',
              properties: {
                secret: { type: 'string', visibility: 'secret' },
                nested: {
                  type: 'object',
                  properties: {
                    token: { type: 'string', visibility: 'secret' },
                    list: {
                      type: 'array',
                      visibility: 'secret',
                      items: { type: 'string', visibility: 'secret' },
                    },
                  },
                },
                public: { type: 'string' },
              },
            },
            path: '/mock',
          },
        ],
        backstageConfigSchemaVersion: 1,
      },
    });
    const config = new ConfigReader({
      secret: 'top-secret',
      nested: { token: 'nested-secret', list: ['first', 'second'] },
      public: 'public-value',
    });

    expect(Array.from(enumerateConfigSecrets({ config, schema }))).toEqual([
      'top-secret',
      'nested-secret',
      'first',
      'second',
    ]);
  });

  it('deduplicates values and ignores schema errors', async () => {
    const schema = await loadConfigSchema({
      serialized: {
        schemas: [
          {
            value: {
              type: 'object',
              properties: {
                secrets: {
                  type: 'array',
                  visibility: 'secret',
                  items: { type: 'string', minLength: 100 },
                },
              },
            },
            path: '/mock',
          },
        ],
        backstageConfigSchemaVersion: 1,
      },
    });

    expect(
      Array.from(
        enumerateConfigSecrets({
          config: new ConfigReader({ secrets: ['same', 'same'] }),
          schema,
        }),
      ),
    ).toEqual(['same']);
  });
});
