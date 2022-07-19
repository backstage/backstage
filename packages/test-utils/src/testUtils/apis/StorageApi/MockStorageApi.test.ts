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
import { StorageApi } from '@backstage/core-plugin-api';
import { MockStorageApi } from './MockStorageApi';

describe('WebStorage Storage API', () => {
  const createMockStorage = (): StorageApi => {
    return MockStorageApi.create();
  };

  it('should return undefined for values which are unset', async () => {
    const storage = createMockStorage();

    expect(storage.snapshot('myfakekey').value).toBeUndefined();
    expect(storage.snapshot('myfakekey')).toEqual({
      key: 'myfakekey',
      presence: 'absent',
      value: undefined,
      newValue: undefined,
    });
  });

  it('should allow the setting and snapshotting of the simple data structures', async () => {
    const storage = createMockStorage();

    await storage.set('myfakekey', 'helloimastring');
    await storage.set('mysecondfakekey', 1234);
    await storage.set('mythirdfakekey', true);
    expect(storage.snapshot('myfakekey').value).toBe('helloimastring');
    expect(storage.snapshot('mysecondfakekey').value).toBe(1234);
    expect(storage.snapshot('mythirdfakekey').value).toBe(true);
    expect(storage.snapshot('myfakekey')).toEqual({
      key: 'myfakekey',
      presence: 'present',
      value: 'helloimastring',
    });
    expect(storage.snapshot('mysecondfakekey')).toEqual({
      key: 'mysecondfakekey',
      presence: 'present',
      value: 1234,
    });
    expect(storage.snapshot('mythirdfakekey')).toEqual({
      key: 'mythirdfakekey',
      presence: 'present',
      value: true,
    });
  });

  it('should allow setting of complex datastructures', async () => {
    const storage = createMockStorage();

    const mockData = {
      something: 'here',
      is: [{ super: { complex: [{ but: 'something', why: true }] } }],
    };

    await storage.set('myfakekey', mockData);

    expect(storage.snapshot('myfakekey').value).toEqual(mockData);
    expect(storage.snapshot('myfakekey')).toEqual({
      key: 'myfakekey',
      presence: 'present',
      value: mockData,
    });
  });

  it('should subscribe to key changes when setting a new value', async () => {
    const storage = createMockStorage();

    const wrongKeyNextHandler = jest.fn();
    const selectedKeyNextHandler = jest.fn();
    const mockData = { hello: 'im a great new value' };

    await new Promise<void>(resolve => {
      storage.observe$<typeof mockData>('correctKey').subscribe({
        next: (...args) => {
          selectedKeyNextHandler(...args);
          resolve();
        },
      });

      storage.observe$('wrongKey').subscribe({ next: wrongKeyNextHandler });

      storage.set('correctKey', mockData);
    });

    expect(wrongKeyNextHandler).not.toHaveBeenCalled();
    expect(selectedKeyNextHandler).toHaveBeenCalledTimes(1);
    expect(selectedKeyNextHandler).toHaveBeenCalledWith({
      key: 'correctKey',
      presence: 'present',
      value: mockData,
    });
  });

  it('should subscribe to key changes when deleting a value', async () => {
    const storage = createMockStorage();

    const wrongKeyNextHandler = jest.fn();
    const selectedKeyNextHandler = jest.fn();
    const mockData = { hello: 'im a great new value' };

    storage.set('correctKey', mockData);

    await new Promise<void>(resolve => {
      storage.observe$('correctKey').subscribe({
        next: (...args) => {
          selectedKeyNextHandler(...args);
          resolve();
        },
      });

      storage.observe$('wrongKey').subscribe({ next: wrongKeyNextHandler });

      storage.remove('correctKey');
    });

    expect(wrongKeyNextHandler).not.toHaveBeenCalled();
    expect(selectedKeyNextHandler).toHaveBeenCalledTimes(1);
    expect(selectedKeyNextHandler).toHaveBeenCalledWith({
      key: 'correctKey',
      presence: 'absent',
      value: undefined,
      newValue: undefined,
    });
  });

  it('should be able to create different buckets for different uses', async () => {
    const rootStorage = createMockStorage();

    const firstStorage = rootStorage.forBucket('userSettings');
    const secondStorage = rootStorage.forBucket('profileSettings');
    const keyName = 'blobby';

    await firstStorage.set(keyName, 'boop');
    await secondStorage.set(keyName, 'deerp');

    expect(firstStorage.snapshot(keyName)).not.toBe(
      secondStorage.snapshot(keyName),
    );
    expect(firstStorage.snapshot(keyName).value).toBe('boop');
    expect(secondStorage.snapshot(keyName).value).toBe('deerp');
    expect(firstStorage.snapshot(keyName)).not.toEqual(
      secondStorage.snapshot(keyName),
    );
    expect(firstStorage.snapshot(keyName)).toEqual({
      key: keyName,
      presence: 'present',
      value: 'boop',
    });
    expect(secondStorage.snapshot(keyName)).toEqual({
      key: keyName,
      presence: 'present',
      value: 'deerp',
    });
  });

  it('should not clash with other namespaces when creating buckets', async () => {
    const rootStorage = createMockStorage();

    // when getting key test2 it will translate to /profile/something/deep/test2
    const firstStorage = rootStorage
      .forBucket('profile')
      .forBucket('something')
      .forBucket('deep');
    // when getting key deep/test2 it will translate to /profile/something/deep/test2
    const secondStorage = rootStorage.forBucket('profile/something');

    await firstStorage.set('test2', { error: true });

    expect(secondStorage.snapshot('deep/test2').value).toBe(undefined);
    expect(secondStorage.snapshot('deep/test2')).toMatchObject({
      presence: 'absent',
    });
  });

  it('should not reuse storage instances between different rootStorages', async () => {
    const rootStorage1 = createMockStorage();
    const rootStorage2 = createMockStorage();

    const firstStorage = rootStorage1.forBucket('something');
    const secondStorage = rootStorage2.forBucket('something');

    await firstStorage.set('test2', true);

    expect(firstStorage.snapshot('test2').value).toBe(true);
    expect(secondStorage.snapshot('test2').value).toBe(undefined);
    expect(firstStorage.snapshot('test2')).toEqual({
      key: 'test2',
      presence: 'present',
      value: true,
    });
    expect(secondStorage.snapshot('test2')).toEqual({
      key: 'test2',
      presence: 'absent',
      value: undefined,
    });
  });

  it('should freeze the snapshot value', async () => {
    const storage = createMockStorage();

    const data = { foo: 'bar', baz: [{ foo: 'bar' }] };
    storage.set('foo', data);

    const snapshot = storage.snapshot<typeof data>('foo');
    expect(snapshot.value).not.toBe(data);

    if (snapshot.presence !== 'present') {
      throw new Error('Invalid presence');
    }

    expect(() => {
      snapshot.value.foo = 'buzz';
    }).toThrow(/Cannot assign to read only property/);
    expect(() => {
      snapshot.value.baz[0].foo = 'buzz';
    }).toThrow(/Cannot assign to read only property/);
    expect(() => {
      snapshot.value.baz.push({ foo: 'buzz' });
    }).toThrow(/Cannot add property 1, object is not extensible/);
  });

  it('should freeze observed values', async () => {
    const storage = createMockStorage();

    const snapshotPromise = new Promise<any>(resolve => {
      storage.observe$('test').subscribe({
        next: resolve,
      });
    });

    storage.set('test', {
      foo: {
        bar: 'baz',
      },
    });

    const snapshot = await snapshotPromise;
    expect(snapshot.presence).toBe('present');
    expect(() => {
      snapshot.value!.foo.bar = 'qux';
    }).toThrow(/Cannot assign to read only property 'bar' of object/);
  });

  it('should JSON serialize stored values', async () => {
    const storage = createMockStorage();

    storage.set<any>('test', {
      foo: {
        toJSON() {
          return {
            bar: 'baz',
          };
        },
      },
    });

    expect(storage.snapshot('test')).toMatchObject({
      presence: 'present',
      value: {
        foo: {
          bar: 'baz',
        },
      },
    });
  });
});
