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

import { EntityProvider } from '@backstage/plugin-catalog-node';
import { ProviderDatabase } from '../database/types';
import { connectEntityProviders } from './connectEntityProviders';

describe('connectEntityProviders', () => {
  it('prepares mutations before acquiring a transaction', async () => {
    const calls: string[] = [];
    const db = {
      prepareUnprocessedEntities: jest.fn(async options => {
        calls.push('prepare');
        return options;
      }),
      transaction: jest.fn(async callback => {
        calls.push('transaction');
        return callback({});
      }),
      replaceUnprocessedEntities: jest.fn(async () => {
        calls.push('replace');
      }),
    } as unknown as ProviderDatabase;
    const provider: EntityProvider = {
      getProviderName: () => 'test',
      connect: async connection => {
        await connection.applyMutation({
          type: 'full',
          entities: [
            {
              entity: {
                apiVersion: 'backstage.io/v1alpha1',
                kind: 'Component',
                metadata: { name: 'test' },
              },
            },
          ],
        });
      },
    };

    await connectEntityProviders(db, [{ provider }]);

    expect(calls).toEqual(['prepare', 'transaction', 'replace']);
  });
});
