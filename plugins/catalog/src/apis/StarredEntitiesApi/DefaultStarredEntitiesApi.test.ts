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

import { MockStorageApi } from '@backstage/test-utils';
import { DefaultStarredEntitiesApi } from './DefaultStarredEntitiesApi';
import { performMigrationToTheNewBucket } from './migration';

jest.mock('./migration');

function getStarred(api: DefaultStarredEntitiesApi) {
  return new Promise((resolve, reject) => {
    const subscription = api.starredEntitie$().subscribe({
      next(starred) {
        resolve(starred);
        subscription.unsubscribe();
      },
      error: reject,
    });
  });
}

describe('DefaultStarredEntitiesApi', () => {
  beforeEach(() => {
    (performMigrationToTheNewBucket as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('constructor', () => {
    it('should call migration', () => {
      const api = new DefaultStarredEntitiesApi({
        storageApi: MockStorageApi.create(),
      });
      expect(performMigrationToTheNewBucket).toHaveBeenCalledTimes(1);
      expect(api).toBeDefined();
    });
  });

  it('should notify and toggle starred entities', async () => {
    const entityRef = 'component:default/mock';

    const storageApi = MockStorageApi.create();
    const storageBucket = storageApi.forBucket('starredEntities');
    const api = new DefaultStarredEntitiesApi({ storageApi });

    const values = new Array<Set<string>>();
    api.starredEntitie$().subscribe({
      next: value => {
        values.push(value);
      },
    });

    await expect(getStarred(api)).resolves.toEqual(new Set());

    await api.toggleStarred(entityRef);
    await expect(getStarred(api)).resolves.toEqual(new Set([entityRef]));
    expect(storageBucket.snapshot('entityRefs')).toEqual(
      expect.objectContaining({ presence: 'present', value: [entityRef] }),
    );

    await api.toggleStarred(entityRef);
    await expect(getStarred(api)).resolves.toEqual(new Set());
    expect(storageBucket.snapshot('entityRefs')).toEqual(
      expect.objectContaining({ presence: 'present', value: [] }),
    );

    expect(values).toEqual([new Set(), new Set([entityRef]), new Set()]);
  });

  it('should read starred entities from storage', async () => {
    const entityRef = 'component:default/mock';

    const storageApi = MockStorageApi.create();
    const storageBucket = storageApi.forBucket('starredEntities');
    storageBucket.set('entityRefs', [entityRef]);
    const api = new DefaultStarredEntitiesApi({ storageApi });

    await expect(getStarred(api)).resolves.toEqual(new Set([entityRef]));
  });
});
