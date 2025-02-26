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
import { EntityProvider } from '@backstage/plugin-catalog-node';
import { mockServices } from '@backstage/backend-test-utils';
import { DefaultProviderDatabase } from '../database/DefaultProviderDatabase';
import { evictEntitiesFromOrphanedProviders } from './evictEntitiesFromOrphanedProviders';

describe('evictEntitiesFromOrphanedProviders', () => {
  const db = {
    transaction: jest.fn().mockImplementation(cb => cb((() => {}) as any)),
    replaceUnprocessedEntities: jest.fn(),
    listReferenceSourceKeys: jest.fn(),
  } as unknown as jest.Mocked<DefaultProviderDatabase>;

  const providers = [
    { getProviderName: () => 'provider1' },
    { getProviderName: () => 'provider2' },
  ] as unknown as EntityProvider[];
  const logger = mockServices.logger.mock();

  it('replaces unprocessed entities for orphaned providers with empty items', async () => {
    db.listReferenceSourceKeys.mockResolvedValue(['foo', 'bar']);

    await evictEntitiesFromOrphanedProviders({ db, providers, logger });

    expect(db.replaceUnprocessedEntities).toHaveBeenCalledTimes(2);
    expect(db.replaceUnprocessedEntities).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      {
        sourceKey: 'foo',
        type: 'full',
        items: [],
      },
    );
    expect(db.replaceUnprocessedEntities).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      {
        sourceKey: 'bar',
        type: 'full',
        items: [],
      },
    );
  });

  it('does not replace unprocessed entities for providers that are not orphaned', async () => {
    db.listReferenceSourceKeys.mockResolvedValue(['foo', 'provider1']);

    await evictEntitiesFromOrphanedProviders({ db, providers, logger });

    expect(db.replaceUnprocessedEntities).not.toHaveBeenCalledWith(
      expect.anything(),
      {
        sourceKey: 'provider1',
        type: 'full',
        items: [],
      },
    );
  });
});
