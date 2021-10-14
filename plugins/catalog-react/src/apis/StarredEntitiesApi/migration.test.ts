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

import { StorageApi } from '@backstage/core-plugin-api';
import { MockStorageApi } from '@backstage/test-utils';
import { performMigrationToTheNewBucket } from './migration';

describe('performMigrationToTheNewBucket', () => {
  let mockStorage: StorageApi;

  beforeEach(() => {
    mockStorage = MockStorageApi.create();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should migrate', async () => {
    const oldBucket = mockStorage.forBucket('settings');
    const newBucket = mockStorage.forBucket('starredEntities');

    // fill NEW bucket
    await newBucket.set('entityRefs', ['component:default/c']);

    // fill OLD bucket
    await oldBucket.set('starredEntities', [
      'entity:Component:default:a',
      'entity:template:custom:b',
    ]);
    expect(oldBucket.get('starredEntities')).not.toBeUndefined();

    await performMigrationToTheNewBucket({ storageApi: mockStorage });

    // read NEW bucket
    expect(await newBucket.get('entityRefs')).toEqual([
      'component:default/c',
      'component:default/a',
      'template:custom/b',
    ]);

    // OLD bucket should be removed
    expect(oldBucket.get('starredEntities')).toBeUndefined();
  });

  it('should ignore invalid entries', async () => {
    const oldBucket = mockStorage.forBucket('settings');
    const newBucket = mockStorage.forBucket('starredEntities');

    // fill OLD bucket
    await oldBucket.set('starredEntities', [
      'entity:Component:default:a',
      1,
      'entity:Component:a',
      'invalid',
    ]);
    expect(oldBucket.get('starredEntities')).not.toBeUndefined();

    await performMigrationToTheNewBucket({ storageApi: mockStorage });

    // read NEW bucket
    expect(await newBucket.get('entityRefs')).toEqual(['component:default/a']);

    // OLD bucket should be removed
    expect(oldBucket.get('starredEntities')).toBeUndefined();
  });

  it('should skip migration without old starred entities', async () => {
    const newBucket = mockStorage.forBucket('starredEntities');

    // fill NEW bucket
    const expectedEntries = ['component:default/a'];
    await newBucket.set('entityRefs', expectedEntries);

    await performMigrationToTheNewBucket({ storageApi: mockStorage });

    // read NEW bucket
    expect(newBucket.get('entityRefs')).toBe(expectedEntries);
  });

  it('should skip migration with non-array old starred entities', async () => {
    const oldBucket = mockStorage.forBucket('settings');
    const newBucket = mockStorage.forBucket('starredEntities');

    // fill OLD bucket with invalid content
    await oldBucket.set('starredEntities', 'invalid');

    // fill NEW bucket
    const expectedEntries = ['component:default/a'];
    await newBucket.set('entityRefs', expectedEntries);

    await performMigrationToTheNewBucket({ storageApi: mockStorage });

    // read NEW bucket
    expect(newBucket.get('entityRefs')).toBe(expectedEntries);

    // OLD bucket should be unchanged
    expect(oldBucket.get('starredEntities')).toBe('invalid');
  });
});
