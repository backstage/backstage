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

import { WebStorage } from './WebStorage';
import { ErrorApi, StorageApi } from '@backstage/core-plugin-api';

describe('WebStorage Storage API', () => {
  const mockErrorApi = { post: jest.fn(), error$: jest.fn() };
  const createWebStorage = (
    args?: Partial<{
      errorApi: ErrorApi;
      namespace?: string;
    }>,
  ): StorageApi => {
    return WebStorage.create({
      errorApi: mockErrorApi,
      ...args,
    });
  };
  it('should return undefined for values which are unset', async () => {
    const storage = createWebStorage();

    expect(storage.snapshot('myfakekey').value).toBeUndefined();
    expect(storage.snapshot('myfakekey')).toEqual({
      key: 'myfakekey',
      presence: 'absent',
      value: undefined,
    });
  });

  it('should allow the setting and getting of the simple data structures', async () => {
    const storage = createWebStorage();

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

  it('should allow setting of complex data structures', async () => {
    const storage = createWebStorage();

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
    const storage = createWebStorage();

    const wrongKeyNextHandler = jest.fn();
    const selectedKeyNextHandler = jest.fn();
    const mockData = { hello: 'im a great new value' };

    await new Promise<void>(resolve => {
      storage.observe$<typeof mockData>('correctKey').subscribe({
        next: snapshot => {
          selectedKeyNextHandler(snapshot);
          if (snapshot.presence === 'present') {
            resolve();
          }
        },
      });

      storage.observe$('wrongKey').subscribe({ next: wrongKeyNextHandler });

      storage.set('correctKey', mockData);
    });

    expect(wrongKeyNextHandler).toHaveBeenCalledTimes(0);
    expect(selectedKeyNextHandler).toHaveBeenCalledTimes(1);
    expect(selectedKeyNextHandler).toHaveBeenCalledWith({
      key: 'correctKey',
      presence: 'present',
      value: mockData,
    });
  });

  it('should subscribe to key changes when deleting a value', async () => {
    const storage = createWebStorage();

    const wrongKeyNextHandler = jest.fn();
    const selectedKeyNextHandler = jest.fn();
    const mockData = { hello: 'im a great new value' };

    storage.set('correctKey', mockData);

    await new Promise<void>(resolve => {
      storage.observe$('correctKey').subscribe({
        next: snapshot => {
          selectedKeyNextHandler(snapshot);
          if (snapshot.presence === 'absent') {
            resolve();
          }
        },
      });

      storage.observe$('wrongKey').subscribe({ next: wrongKeyNextHandler });

      storage.remove('correctKey');
    });

    expect(wrongKeyNextHandler).toHaveBeenCalledTimes(0);
    expect(selectedKeyNextHandler).toHaveBeenCalledTimes(1);
    expect(selectedKeyNextHandler).toHaveBeenCalledWith({
      key: 'correctKey',
      presence: 'absent',
      value: undefined,
    });
  });

  it('should be able to create different buckets for different uses', async () => {
    const rootStorage = createWebStorage();

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
    const rootStorage = createWebStorage();

    // when getting key test2 it will translate to /profile/something/deep/test2
    const firstStorage = rootStorage
      .forBucket('profile')
      .forBucket('something')
      .forBucket('deep');
    // when getting key deep/test2 it will translate to /profile/something/deep/test2
    const secondStorage = rootStorage.forBucket('profile/something');

    await firstStorage.set('test2', { error: true });

    expect(secondStorage.snapshot('deep/test2')).toMatchObject({
      presence: 'absent',
    });
  });

  it('should call the error api when the json can not be parsed in local storage', async () => {
    const rootStorage = createWebStorage({
      namespace: '/Test/Mock/Thing',
    });

    localStorage.setItem('/Test/Mock/Thing/key', '{smd: asdouindA}');

    const value = rootStorage.snapshot('key');

    expect(value).toEqual({
      key: 'key',
      presence: 'absent',
      value: undefined,
    });
    expect(mockErrorApi.post).toHaveBeenCalledWith(expect.any(Error));
    expect(mockErrorApi.post).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Error when parsing JSON config from storage for: key',
      }),
    );
  });

  it('should return a stable reference for the same namespace and same bucket', async () => {
    const rootStorage = createWebStorage({
      namespace: '/Test/Mock/Thing/Thing ',
    });

    expect(rootStorage.forBucket('test')).toBe(rootStorage.forBucket('test'));
  });

  it('should freeze the snapshot value', async () => {
    const storage = createWebStorage();

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
});
