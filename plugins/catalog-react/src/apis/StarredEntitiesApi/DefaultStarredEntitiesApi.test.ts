/*
 * Copyright 2021 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import { StorageApi } from '@backstage/core-plugin-api';
import { MockStorageApi } from '@backstage/test-utils';
import { DefaultStarredEntitiesApi } from './DefaultStarredEntitiesApi';

describe('DefaultStarredEntitiesApi', () => {
  let mockStorage: StorageApi;
  let starredEntitiesApi: DefaultStarredEntitiesApi;

  const mockEntity: Entity = {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'mock',
    },
  };

  beforeEach(() => {
    mockStorage = MockStorageApi.create();
    starredEntitiesApi = new DefaultStarredEntitiesApi({
      storageApi: mockStorage,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('toggleStarred', () => {
    it('should star unstarred entity', async () => {
      expect(starredEntitiesApi.isStarred(mockEntity)).toBe(false);

      await starredEntitiesApi.toggleStarred(mockEntity);

      expect(starredEntitiesApi.isStarred(mockEntity)).toBe(true);
    });

    it('should unstar starred entity', async () => {
      const bucket = mockStorage.forBucket('settings');
      await bucket.set('starredEntities', ['component:default/mock']);

      expect(starredEntitiesApi.isStarred(mockEntity)).toBe(true);

      await starredEntitiesApi.toggleStarred(mockEntity);

      expect(starredEntitiesApi.isStarred(mockEntity)).toBe(false);
    });
  });

  describe('starredEntities$', () => {
    const handler = jest.fn();

    beforeEach(async () => {
      await new Promise<void>(resolve => {
        starredEntitiesApi.starredEntitie$().subscribe({
          next: (...args) => {
            handler(...args);

            if (handler.mock.calls.length >= 2) {
              resolve();
            }
          },
        });

        const bucket = mockStorage.forBucket('settings');
        bucket.set('starredEntities', ['component:default/mock']).then();
      });
    });

    it('should receive updates', async () => {
      expect(handler).toBeCalledTimes(2);
      expect(handler).toBeCalledWith({
        starredEntities: new Set(),
        isStarred: expect.any(Function),
      });
      expect(handler).toBeCalledWith({
        starredEntities: new Set(['component:default/mock']),
        isStarred: expect.any(Function),
      });
    });

    it('should receive isStarred function that operates on the latest state', async () => {
      expect(handler.mock.calls[0][0].isStarred(mockEntity)).toBe(true);
      expect(handler.mock.calls[1][0].isStarred(mockEntity)).toBe(true);
    });
  });
});
