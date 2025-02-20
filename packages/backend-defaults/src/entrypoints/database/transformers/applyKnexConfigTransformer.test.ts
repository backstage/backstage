/*
 * Copyright 2025 The Backstage Authors
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

import { KnexConfigTransformer } from '../types';
import { applyKnexConfigTransformer } from './applyKnexConfigTransformer';
import { Knex } from 'knex';

describe('createPgDatabaseClient with transformers', () => {
  const configExistingTransformer = {
    client: 'pg',
    connection: {
      type: 'a-type',
    },
  } as Knex.Config;
  const configMissingTransformer = {
    client: 'pg',
    connection: {
      type: 'no-transformer-for-this-type',
    },
  } as Knex.Config;
  const configDefaultTransformer = {
    client: 'pg',
    connection: {
      type: 'default',
    },
  } as Knex.Config;
  const transformers: Record<string, KnexConfigTransformer> = {
    'a-type': jest.fn().mockImplementation(a => a),
  };
  const typeTransformerMock = transformers['a-type'] as jest.Mock;

  it('calls connection type transformer if connection.type is set', async () => {
    await applyKnexConfigTransformer(configExistingTransformer, transformers);
    expect(typeTransformerMock).toHaveBeenCalledTimes(1);
  });
  it('throws if connection.type has no transformer', async () => {
    await expect(
      async () =>
        await applyKnexConfigTransformer(
          configMissingTransformer,
          transformers,
        ),
    ).rejects.toThrow(
      /No transformer exists for type: no-transformer-for-this-type/,
    );
  });
  it('does not throw when type is default', async () => {
    expect(
      async () =>
        await applyKnexConfigTransformer(
          configDefaultTransformer,
          transformers,
        ),
    ).not.toThrow();
  });
});
