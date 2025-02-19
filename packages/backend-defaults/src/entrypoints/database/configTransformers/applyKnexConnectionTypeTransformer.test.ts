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

import { KnexConnectionTypeTransformer } from '../types';
import { applyKnexConnectionTypeTransformer } from './applyKnexConnectionTypeTransformer';
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
  const transformers: Record<string, KnexConnectionTypeTransformer> = {
    'a-type': jest.fn().mockImplementation(a => a),
  };
  const typeTransformerMock = transformers['a-type'] as jest.Mock;

  it('calls connection type transformer if connection.type is set', async () => {
    await applyKnexConnectionTypeTransformer(
      configExistingTransformer,
      transformers,
    );
    expect(typeTransformerMock).toHaveBeenCalledTimes(1);
  });
  it('throws if connection.type has no transformer', async () => {
    await expect(
      async () =>
        await applyKnexConnectionTypeTransformer(
          configMissingTransformer,
          transformers,
        ),
    ).rejects.toThrow(/Unknown connection type: no-transformer-for-this-type/);
  });
  it('does not throw when type is default', async () => {
    expect(
      async () =>
        await applyKnexConnectionTypeTransformer(
          configDefaultTransformer,
          transformers,
        ),
    ).not.toThrow();
  });
});
